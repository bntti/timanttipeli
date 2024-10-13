import { Alert, Button, Divider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { type JSX, useCallback, useContext, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import type { Card, Room, Settings } from '@/common/types';
import { SocketEventContext, type User, UserContext } from '../app/StateProvider';
import CardDialogMemo from '../components/CardDialog';
import DurationBarMemo from '../components/DurationBar';
import PlayerTableMemo from '../components/PlayerTable';
import RemovedCardsMemo from '../components/RemovedCards';
import RoomDataMemo from '../components/RoomData';
import RoundCardsMemo from '../components/RoundCards';
import SettingsFormMemo from '../components/SettingsForm';
import VoteDialogMemo from '../components/VoteDialog';
import { socket } from '../socket';

const RoomRoute = (): JSX.Element => {
    const { user } = useContext(UserContext) as { user: User };
    const { room: newRoomData, serverTime } = useContext(SocketEventContext) as {
        room: Room | null;
        serverTime: number;
    };
    const { roomId: roomIdParam } = useParams() as { roomId: string };
    const roomId = parseInt(roomIdParam);

    const [room, setRoom] = useState<Room | null>(null);
    const [removePlayers, setRemovePlayers] = useState<boolean>(false);

    const [vote, setVote] = useState<'stay' | 'leave' | null>(null);
    const [voteDelay, setVoteDelay] = useState<number | null>(null);

    const [lastVote, setLastVote] = useState<{ [key: string]: 'stay' | 'leave' }>({});
    const [votesOpen, setVotesOpen] = useState<boolean>(false);
    const [votesOpenDuration, setVotesOpenDuration] = useState<number>(2);

    const [currentCard, setCurrentCard] = useState<Card | null>(null);
    const [gameEnded, setGameEnded] = useState<boolean>(false);
    const [cardOpen, setCardOpen] = useState<boolean>(false);
    const [cardOpenDuration, setCardOpenDuration] = useState<number>(2);

    // Join and leave room
    useEffect(() => {
        socket.emit('joinRoom', roomId);
        return () => {
            socket.emit('leaveRoom', roomId);
        };
    }, [roomId]);

    const showCard = useCallback(
        (newRoom: Room): void => {
            if (!newRoom.data.gameInProgress || !room) throw new Error('assert');

            const numPlayers = room.data.roundInProgress
                ? room.data.currentRound.players.length
                : Object.keys(room.data.players).length;
            const openDuration =
                numPlayers === 1 && newRoom.data.roundInProgress ? room.settings.cardTime1 : room.settings.cardTime;

            if (openDuration === 0) {
                setRoom(newRoom);
                return;
            }

            setCurrentCard(newRoom.data.lastCard);
            setGameEnded(!newRoom.data.roundInProgress);
            setCardOpenDuration(openDuration);
            setCardOpen(true);
            setTimeout(() => {
                setCardOpen(false);
                setRoom(newRoom);
            }, openDuration);
        },
        [room],
    );

    const showVoteAndCard = useCallback(
        (newRoom: Room): void => {
            if (!newRoom.data.gameInProgress || !room) throw new Error('assert');

            const numPlayers = room.data.roundInProgress
                ? room.data.currentRound.players.length
                : Object.keys(room.data.players).length;
            const openDuration = numPlayers === 1 ? room.settings.voteShowTime1 : room.settings.voteShowTime;

            if (openDuration === 0) {
                // All players left
                if (newRoom.data.lastCard === null) setRoom(newRoom);
                else showCard(newRoom);
                return;
            }

            setLastVote(newRoom.data.lastVote);
            setVotesOpenDuration(openDuration);
            setVotesOpen(true);
            setTimeout(() => {
                if (!newRoom.data.gameInProgress) throw new Error('assert');
                setVotesOpen(false);

                // All players left
                if (newRoom.data.lastCard === null) {
                    setRoom(newRoom);
                } else {
                    showCard(newRoom);
                }
            }, openDuration);
        },
        [showCard, room],
    );

    const handleSetRoom = useCallback(
        (newRoom: Room): void => {
            if (JSON.stringify(room) === JSON.stringify(newRoom)) return;

            if (room === null) {
                setRoom(newRoom);
                return;
            }

            // Reset removePlayers when round starts
            if (!room.data.roundInProgress && newRoom.data.roundInProgress) setRemovePlayers(false);

            // Vote timer
            if (
                room.data.roundInProgress &&
                !room.data.currentRound.voteEndTime &&
                newRoom.data.roundInProgress &&
                newRoom.data.currentRound.voteEndTime
            ) {
                setRoom({
                    ...room,
                    data: {
                        ...room.data,
                        currentRound: {
                            ...room.data.currentRound,
                            votes: newRoom.data.currentRound.votes,
                            voteEndTime: newRoom.data.currentRound.voteEndTime,
                        },
                    },
                });
                const delay = newRoom.data.currentRound.voteEndTime - serverTime;
                setVoteDelay(delay);
                setTimeout(() => {
                    setVoteDelay(null);
                }, delay);
                return;
            }

            // Vote ended, show vote
            if (
                room.data.roundInProgress &&
                newRoom.data.gameInProgress &&
                (!newRoom.data.roundInProgress ||
                    room.data.currentRound.deck.length !== newRoom.data.currentRound.deck.length)
            ) {
                showVoteAndCard(newRoom);
                return;
            }

            // Round started, Show first card
            if (!room.data.roundInProgress && newRoom.data.roundInProgress) {
                showCard(newRoom);
                return;
            }

            setRoom(newRoom);
        },
        [room, serverTime, showVoteAndCard, showCard],
    );

    useEffect(() => {
        if (newRoomData !== null) handleSetRoom(newRoomData);
    }, [handleSetRoom, newRoomData]);

    useEffect(() => {
        if (room?.data.roundInProgress) setVote(room.data.currentRound.votes[user.username] ?? null);
    }, [user, room]);

    const joinGame = (): void => {
        socket.emit('joinGame', roomId, user.username);
    };
    const leaveGame = (): void => {
        if (!room?.data.gameInProgress || confirm('Leave game?')) {
            socket.emit('leaveGame', roomId, user.username);
        }
    };
    const kickPlayer = (username: string): void => {
        socket.emit('kickPlayer', roomId, username);
    };
    const setSettings = (settings: Settings): void => {
        socket.emit('editRoomSettings', roomId, settings);
    };
    const startGame = (): void => {
        socket.emit('startGame', roomId);
    };
    const startRound = (): void => {
        socket.emit('startRound', roomId);
    };
    const endGame = (): void => {
        if (confirm('End game?')) {
            socket.emit('endGame', roomId);
        }
    };
    const endRound = (): void => {
        if (confirm('End round?')) {
            socket.emit('endRound', roomId);
        }
    };
    const resetRoom = (): void => {
        if (confirm('Reset room?')) {
            socket.emit('resetRoom', roomId);
        }
    };
    const deleteRoom = (): void => {
        if (confirm('Delete room?')) {
            socket.emit('deleteRoom', roomId);
        }
    };
    const apiVote = (value: 'stay' | 'leave' | null): void => {
        // Don't allow removing vote when vote in progress
        if (voteDelay && value === null) return;

        setVote(value);
        socket.emit('vote', roomId, user.username, value);
    };

    if (room === null) return <Typography>Loading room...</Typography>;
    if (room.hidden) return <Navigate to="/" />;
    return (
        <>
            <VoteDialogMemo open={votesOpen} duration={votesOpenDuration} lastVote={lastVote} />
            <CardDialogMemo open={cardOpen} duration={cardOpenDuration} card={currentCard} gameEnded={gameEnded} />

            {!room.data.gameInProgress && !(user.username in room.data.players) && (
                <Alert severity="warning" sx={{ mb: 2 }} variant="outlined">
                    You are not in the game
                </Alert>
            )}

            {room.data.roundInProgress ? (
                <PlayerTableMemo
                    roomPlayers={room.data.players}
                    gameInProgress={room.data.gameInProgress}
                    removePlayers={removePlayers && !room.data.roundInProgress}
                    kickPlayer={kickPlayer}
                    roundPlayers={room.data.currentRound.players}
                    pointsPerPlayer={room.data.currentRound.pointsPerPlayer}
                    votes={Object.keys(room.data.currentRound.votes)}
                    pointsGained={room.data.currentRound.pointsGained}
                    hasRelic={room.data.currentRound.hasRelic}
                />
            ) : (
                <PlayerTableMemo
                    gameInProgress={room.data.gameInProgress}
                    removePlayers={removePlayers && !room.data.roundInProgress}
                    roomPlayers={room.data.players}
                    kickPlayer={kickPlayer}
                />
            )}
            {room.data.gameInProgress && (
                <>
                    <RoomDataMemo
                        gameNumber={Math.floor(room.data.roundsDone / 5) + 1}
                        roundNumber={(room.data.roundsDone % 5) + 1}
                        deckSize={room.data.deckSize}
                        pointsOnGround={room.data.roundInProgress ? room.data.currentRound.pointsOnGround : null}
                        cheats={room.settings.allowCheats && user.cheats}
                        deck={room.data.currentRound?.deck ?? null}
                        inPlay={room.data.currentRound?.inPlay ?? null}
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

            {(!room.data.roundInProgress || user.admin) && <Divider sx={{ mt: 5, mb: 0.5 }} />}

            {!room.data.roundInProgress &&
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
                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 1 }}
                        disabled={Object.keys(room.data.players).length === 0 || room.data.roundInProgress}
                        onClick={() => setRemovePlayers(!removePlayers)}
                    >
                        Manage players
                    </Button>
                    {room.data.gameInProgress && !room.data.roundInProgress && (
                        <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={endGame}>
                            End game
                        </Button>
                    )}
                    {room.data.gameInProgress && room.data.roundInProgress && (
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{ mt: 1 }}
                            fullWidth
                            onClick={endRound}
                            disabled={room.data.currentRound.voteEndTime !== null}
                        >
                            End round
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
                            <SettingsFormMemo settings={room.settings} setSettings={setSettings} />
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default RoomRoute;
