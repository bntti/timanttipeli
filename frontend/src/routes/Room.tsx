import { Alert, Button, Divider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { UserContext } from '../app/StateProvider';
import PlayerTableMemo from '../components/PlayerTable';
import RemovedCardsMemo from '../components/RemovedCards';
import RoomDataMemo from '../components/RoomData';
import RoundCardsMemo from '../components/RoundCards';
import { Room, RoomSchema } from '../types';

const RoomRoute = (): JSX.Element => {
    const [room, setRoom] = useState<Room | null>(null);
    const [vote, setVote] = useState<'stay' | 'leave' | null>(null);
    const [admin, setAdmin] = useState<boolean>(false);
    const { user } = useContext(UserContext);
    const { roomId } = useParams();

    useEffect(() => {
        axios
            .get(`/api/room/${roomId}`)
            .then((response) => {
                setRoom(RoomSchema.parse(response.data));
            })
            .catch(console.error);
    }, [roomId]);

    useEffect(() => {
        const pollingInterval = setInterval(() => {
            axios
                .get(`/api/room/${roomId}`)
                .then((response) => {
                    const newRoom = RoomSchema.parse(response.data);
                    if (JSON.stringify(room) !== JSON.stringify(newRoom)) setRoom(newRoom);
                })
                .catch(console.error);
        }, 1000);

        return () => clearInterval(pollingInterval);
    }, [room, roomId]);

    useEffect(() => {
        if (room && room.data.roundInProgress) setVote(room.data.currentRound.votes[user] ?? null);
    }, [user, room]);

    const joinGame = (): void => {
        axios
            .post(`/api/room/${roomId}/joinGame`, { userName: user })
            .then((response) => setRoom(RoomSchema.parse(response.data)))
            .catch(console.error);
    };
    const leaveGame = (): void => {
        axios
            .post(`/api/room/${roomId}/leaveGame`, { userName: user })
            .then((response) => setRoom(RoomSchema.parse(response.data)))
            .catch(console.error);
    };
    const startGame = (): void => {
        axios
            .post(`/api/room/${roomId}/startGame`)
            .then((response) => setRoom(RoomSchema.parse(response.data)))
            .catch(console.error);
    };
    const startRound = (): void => {
        axios
            .post(`/api/room/${roomId}/startRound`)
            .then((response) => setRoom(RoomSchema.parse(response.data)))
            .catch(console.error);
    };
    const resetRoom = (): void => {
        if (confirm('Reset room?')) {
            axios
                .post(`/api/room/${roomId}/resetRoom`)
                .then((response) => setRoom(RoomSchema.parse(response.data)))
                .catch(console.error);
        }
    };
    const deleteRoom = (): void => {
        if (confirm('Delete room?')) {
            axios
                .delete(`/api/room/${roomId}`)
                .then((response) => setRoom(RoomSchema.parse(response.data)))
                .catch(console.error);
        }
    };
    const apiVote = (value: 'stay' | 'leave' | null): void => {
        setVote(value);
        axios
            .post(`/api/room/${roomId}/vote`, { userName: user, vote: value })
            .then((response) => setRoom(RoomSchema.parse(response.data)))
            .catch(console.error);
    };

    if (room === null) return <Typography>Loading room...</Typography>;
    if (room.hidden) return <Navigate to="/" />;
    return (
        <>
            {!room.data.gameInProgress && !(user in room.data.players) && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    You are not in the game
                </Alert>
            )}

            <PlayerTableMemo roomPlayers={room.data.players} roundPlayers={room.data.currentRound?.players ?? null} />
            {room.data.gameInProgress && (
                <>
                    {room.data.roundInProgress ? (
                        <RoomDataMemo
                            roundNumber={room.data.roundsDone + 1}
                            deckSize={
                                Object.keys(room.data.currentRound.deck).length + room.data.currentRound.inPlay.length
                            }
                            numVotes={Object.keys(room.data.currentRound.votes).length}
                            pointsOnGround={room.data.currentRound.pointsOnGround}
                            pointsPerPlayer={room.data.currentRound?.pointsPerPlayer}
                        />
                    ) : (
                        <RoomDataMemo roundNumber={room.data.roundsDone + 1} />
                    )}

                    {room.data.removedCards.length > 0 && <RemovedCardsMemo removedCards={room.data.removedCards} />}
                </>
            )}

            {room.data.roundInProgress && (
                <>
                    <RoundCardsMemo inPlay={room.data.currentRound.inPlay} />
                    {room.data.currentRound.players.includes(user) && (
                        <ToggleButtonGroup
                            size="large"
                            fullWidth
                            orientation="horizontal"
                            value={vote}
                            exclusive
                            onChange={(_, value) => apiVote(value)}
                            sx={{ mt: 2 }}
                        >
                            <ToggleButton value="stay">Stay</ToggleButton>
                            <ToggleButton value="leave">Leave</ToggleButton>
                        </ToggleButtonGroup>
                    )}
                </>
            )}

            <Divider sx={{ mt: 5, mb: 1 }} />
            {!room.data.gameInProgress &&
                (user in room.data.players ? (
                    <Button fullWidth onClick={leaveGame} variant="outlined">
                        Leave game
                    </Button>
                ) : (
                    <Button fullWidth onClick={joinGame} variant="outlined">
                        Join game
                    </Button>
                ))}

            <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => setAdmin(!admin)}>
                {admin ? 'Disable admin' : 'Enable admin'}
            </Button>
            {admin && (
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
                    <Button variant="outlined" color="error" fullWidth sx={{ mt: 3 }} onClick={resetRoom}>
                        Reset room
                    </Button>
                    {!room.data.gameInProgress && (
                        <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={deleteRoom}>
                            Delete Room
                        </Button>
                    )}
                </>
            )}
        </>
    );
};

export default RoomRoute;
