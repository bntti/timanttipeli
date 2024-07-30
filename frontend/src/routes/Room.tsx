import { Alert, Button, Divider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import axios from 'axios';
import { JSX, useCallback, useContext, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { UserContext } from '../app/StateProvider';
import CardDialogMemo from '../components/CardDialog';
import DurationBarMemo from '../components/DurationBar';
import PlayerTableMemo from '../components/PlayerTable';
import RemovedCardsMemo from '../components/RemovedCards';
import RoomDataMemo from '../components/RoomData';
import RoundCardsMemo from '../components/RoundCards';
import SettingsFormMemo from '../components/SettingsForm';
import VoteDialogMemo from '../components/VoteDialog';
import { Card, Room, RoomResponseSchema, Settings } from '../types';

const RoomRoute = (): JSX.Element => {
    const [room, setRoom] = useState<Room | null>(null);
    const [vote, setVote] = useState<'stay' | 'leave' | null>(null);
    const [dontUpdate, setDontUpdate] = useState<boolean>(false);
    const [voteDelay, setVoteDelay] = useState<number | null>(null);

    const [lastVote, setLastVote] = useState<{ [key: string]: 'stay' | 'leave' }>({});
    const [votesOpen, setVotesOpen] = useState<boolean>(false);
    const [votesOpenDuration, setVotesOpenDuration] = useState<number>(2);

    const [lastCard, setLastCard] = useState<Card | null>(null);
    const [gameEnded, setGameEnded] = useState<boolean>(false);
    const [cardOpen, setCardOpen] = useState<boolean>(false);
    const [cardOpenDuration, setCardOpenDuration] = useState<number>(2);

    const { user } = useContext(UserContext);
    const { roomId } = useParams();

    const handleShowCard = useCallback(
        (newRoom: Room): void => {
            if (!newRoom.data.gameInProgress || !room) {
                setDontUpdate(false);
                return;
            }
            const numPlayers = room.data.roundInProgress
                ? room.data.currentRound.players.length
                : Object.keys(room.data.players).length;
            const openDuration =
                numPlayers === 1 && newRoom.data.roundInProgress ? room.settings.cardTime1 : room.settings.cardTime;

            if (openDuration === 0) {
                setDontUpdate(false);
                setRoom(newRoom);
                return;
            }
            setDontUpdate(true);
            setLastCard(newRoom.data.lastCard);
            setGameEnded(!newRoom.data.roundInProgress);
            setCardOpenDuration(openDuration);
            setCardOpen(true);
            setTimeout(() => {
                setCardOpen(false);
                setDontUpdate(false);
                setRoom(newRoom);
            }, openDuration);
        },
        [room],
    );

    const handleShowVote = useCallback(
        (newRoom: Room): void => {
            if (!newRoom.data.gameInProgress || !room) return;
            const numPlayers = room.data.roundInProgress
                ? room.data.currentRound.players.length
                : Object.keys(room.data.players).length;
            const openDuration = numPlayers === 1 ? room.settings.voteShowTime1 : room.settings.voteShowTime;

            if (openDuration === 0) {
                if (newRoom.data.lastCard === null) {
                    setRoom(newRoom);
                    return;
                }
                handleShowCard(newRoom);
                return;
            }
            setDontUpdate(true);
            setLastVote(newRoom.data.lastVote);
            setVotesOpenDuration(openDuration);
            setVotesOpen(true);
            setTimeout(() => {
                setVotesOpen(false);
                if (!newRoom.data.gameInProgress) throw new Error('assert');
                if (newRoom.data.lastCard === null) {
                    setDontUpdate(false);
                    setRoom(newRoom);
                    return;
                }
                handleShowCard(newRoom);
            }, openDuration);
        },
        [handleShowCard, room],
    );

    const handleSetRoom = useCallback(
        ({ room: newRoom, serverTime }: { room: Room; serverTime: number }): void => {
            if (JSON.stringify(room) !== JSON.stringify(newRoom)) {
                if (dontUpdate) return;

                if (
                    room &&
                    room.data.roundInProgress &&
                    room.data.currentRound.players.length > 1 &&
                    newRoom.data.roundInProgress &&
                    newRoom.data.currentRound.voteEnd
                ) {
                    setDontUpdate(true);
                    setRoom({
                        ...room,
                        data: {
                            ...room.data,
                            currentRound: { ...room.data.currentRound, votes: newRoom.data.currentRound.votes },
                        },
                    });
                    const delay = newRoom.data.currentRound.voteEnd - serverTime;
                    setVoteDelay(delay);
                    setTimeout(() => {
                        setVoteDelay(null);
                        axios
                            .get(`/api/room/${roomId}`)
                            .then((response) => {
                                setDontUpdate(false);
                                handleSetRoom(RoomResponseSchema.parse(response.data));
                            })
                            .catch(console.error);
                    }, delay);
                } else if (
                    room &&
                    room.data.roundInProgress &&
                    newRoom.data.gameInProgress &&
                    (!newRoom.data.roundInProgress ||
                        newRoom.data.currentRound.deck.length !== room.data.currentRound.deck.length)
                ) {
                    handleShowVote(newRoom);
                } else if (room && !room.data.roundInProgress && newRoom.data.roundInProgress) {
                    handleShowCard(newRoom);
                } else {
                    setRoom(newRoom);
                }
            }
        },
        [room, dontUpdate, roomId, handleShowVote, handleShowCard],
    );

    useEffect(() => {
        axios
            .get(`/api/room/${roomId}`)
            .then((response) => {
                handleSetRoom(RoomResponseSchema.parse(response.data));
            })
            .catch(console.error);
    }, [roomId, handleSetRoom]);

    useEffect(() => {
        const pollingInterval = setInterval(() => {
            axios
                .get(`/api/room/${roomId}`)
                .then((response) => {
                    handleSetRoom(RoomResponseSchema.parse(response.data));
                })
                .catch(console.error);
        }, 1000);

        return () => clearInterval(pollingInterval);
    }, [room, roomId, handleSetRoom]);

    useEffect(() => {
        if (room && room.data.roundInProgress) setVote(room.data.currentRound.votes[user.username] ?? null);
    }, [user, room]);

    const joinGame = (): void => {
        axios
            .post(`/api/room/${roomId}/joinGame`, { username: user.username })
            .then((response) => handleSetRoom(RoomResponseSchema.parse(response.data)))
            .catch(console.error);
    };
    const leaveGame = (): void => {
        axios
            .post(`/api/room/${roomId}/leaveGame`, { username: user.username })
            .then((response) => handleSetRoom(RoomResponseSchema.parse(response.data)))
            .catch(console.error);
    };
    const setSettings = (settings: Settings): void => {
        axios
            .put(`/api/room/${roomId}/settings`, settings)
            .then((response) => handleSetRoom(RoomResponseSchema.parse(response.data)))
            .catch(console.error);
    };
    const startGame = (): void => {
        axios
            .post(`/api/room/${roomId}/startGame`)
            .then((response) => handleSetRoom(RoomResponseSchema.parse(response.data)))
            .catch(console.error);
    };
    const startRound = (): void => {
        axios
            .post(`/api/room/${roomId}/startRound`)
            .then((response) => handleSetRoom(RoomResponseSchema.parse(response.data)))
            .catch(console.error);
    };
    const endGame = (): void => {
        if (confirm('End game?')) {
            axios
                .post(`/api/room/${roomId}/endGame`)
                .then((response) => handleSetRoom(RoomResponseSchema.parse(response.data)))
                .catch(console.error);
        }
    };
    const resetRoom = (): void => {
        if (confirm('Reset room?')) {
            axios
                .post(`/api/room/${roomId}/resetRoom`)
                .then((response) => handleSetRoom(RoomResponseSchema.parse(response.data)))
                .catch(console.error);
        }
    };
    const deleteRoom = (): void => {
        if (confirm('Delete room?')) {
            axios
                .delete(`/api/room/${roomId}`)
                .then((response) => handleSetRoom(RoomResponseSchema.parse(response.data)))
                .catch(console.error);
        }
    };
    const apiVote = (value: 'stay' | 'leave' | null): void => {
        if (!value && voteDelay) return;
        setVote(value);
        axios
            .post(`/api/room/${roomId}/vote`, { username: user.username, vote: value })
            .then((response) => handleSetRoom(RoomResponseSchema.parse(response.data)))
            .catch(console.error);
    };

    if (room === null) return <Typography>Loading room...</Typography>;
    if (room.hidden) return <Navigate to="/" />;
    return (
        <>
            {!room.data.gameInProgress && !(user.username in room.data.players) && (
                <Alert severity="warning" sx={{ mb: 2 }} variant="outlined">
                    You are not in the game
                </Alert>
            )}

            <VoteDialogMemo
                open={votesOpen}
                duration={votesOpenDuration}
                lastVote={lastVote}
                handleClose={() => setVotesOpen(false)}
            />
            <CardDialogMemo
                open={cardOpen}
                duration={cardOpenDuration}
                card={lastCard}
                gameEnded={gameEnded}
                handleClose={() => setCardOpen(false)}
            />

            {room.data.roundInProgress ? (
                <PlayerTableMemo
                    roomPlayers={room.data.players}
                    gameInProgress={room.data.gameInProgress}
                    roundPlayers={room.data.currentRound.players}
                    pointsPerPlayer={room.data.currentRound.pointsPerPlayer}
                    votes={Object.keys(room.data.currentRound.votes)}
                    pointsGained={room.data.currentRound.pointsGained}
                    hasRelic={room.data.currentRound.hasRelic}
                />
            ) : (
                <PlayerTableMemo gameInProgress={room.data.gameInProgress} roomPlayers={room.data.players} />
            )}
            {room.data.gameInProgress && (
                <>
                    <RoomDataMemo
                        gameNumber={Math.floor(room.data.roundsDone / 5) + 1}
                        roundNumber={(room.data.roundsDone % 5) + 1}
                        deckSize={room.data.deckSize}
                        pointsOnGround={room.data.roundInProgress ? room.data.currentRound.pointsOnGround : null}
                        deck={room.data.roundInProgress && user.cheats ? room.data.currentRound.deck : null}
                        inPlay={room.data.roundInProgress && user.cheats ? room.data.currentRound.inPlay : null}
                    />
                    {room.data.removedCards.length > 0 && <RemovedCardsMemo removedCards={room.data.removedCards} />}
                </>
            )}

            {room.data.roundInProgress && (
                <>
                    <RoundCardsMemo inPlay={room.data.currentRound.inPlay} />
                    {room.data.currentRound.players.includes(user.username) && (
                        <ToggleButtonGroup
                            size="large"
                            fullWidth
                            orientation="horizontal"
                            value={vote}
                            exclusive
                            onChange={(_, value) => apiVote(value as 'stay' | 'leave' | null)}
                            sx={{ mt: 2 }}
                        >
                            <ToggleButton value="stay">Stay</ToggleButton>
                            <ToggleButton value="leave">Leave</ToggleButton>
                        </ToggleButtonGroup>
                    )}
                    {voteDelay && <DurationBarMemo duration={voteDelay} />}
                </>
            )}

            {(!room.data.gameInProgress || user.admin) && <Divider sx={{ mt: 5, mb: 0.5 }} />}
            {!room.data.gameInProgress &&
                (user.username in room.data.players ? (
                    <Button fullWidth onClick={leaveGame} variant="outlined" sx={{ mt: 1 }}>
                        Leave game
                    </Button>
                ) : (
                    <Button fullWidth onClick={joinGame} variant="outlined" sx={{ mt: 1 }}>
                        Join game
                    </Button>
                ))}

            {user.admin && (
                <>
                    {room.data.gameInProgress && !room.data.roundInProgress && (
                        <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={startRound}>
                            Start Round
                        </Button>
                    )}
                    {!room.data.gameInProgress && (
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{ mt: 1 }}
                            disabled={Object.keys(room.data.players).length === 0}
                            onClick={startGame}
                        >
                            Start Game
                        </Button>
                    )}
                    {room.data.gameInProgress && !room.data.roundInProgress && (
                        <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={endGame}>
                            End game
                        </Button>
                    )}
                    {(!room.data.gameInProgress || room.data.roundInProgress) && (
                        <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={resetRoom}>
                            Reset room
                        </Button>
                    )}
                    {!room.data.gameInProgress && (
                        <>
                            <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={deleteRoom}>
                                Delete Room
                            </Button>
                            <Divider sx={{ mt: 2, mb: 1 }} />
                            <Typography variant="subtitle1">Settings</Typography>
                            <SettingsFormMemo settings={room.settings} setSettings={setSettings} />
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default RoomRoute;
