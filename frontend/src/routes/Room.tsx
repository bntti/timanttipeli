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
        if (room && room.data.roundInProgress) setVote(room.data.currentRound.votes[user.username] ?? null);
    }, [user, room]);

    const joinGame = (): void => {
        axios
            .post(`/api/room/${roomId}/joinGame`, { username: user.username })
            .then((response) => setRoom(RoomSchema.parse(response.data)))
            .catch(console.error);
    };
    const leaveGame = (): void => {
        axios
            .post(`/api/room/${roomId}/leaveGame`, { username: user.username })
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
        if (confirm(room && room.data.gameInProgress && !room.data.roundInProgress ? 'End game?' : 'Reset room?')) {
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
            .post(`/api/room/${roomId}/vote`, { username: user.username, vote: value })
            .then((response) => setRoom(RoomSchema.parse(response.data)))
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
                            onChange={(_, value) => apiVote(value)}
                            sx={{ mt: 2 }}
                        >
                            <ToggleButton value="stay">Stay</ToggleButton>
                            <ToggleButton value="leave">Leave</ToggleButton>
                        </ToggleButtonGroup>
                    )}
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
                    <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={resetRoom}>
                        {room.data.gameInProgress && !room.data.roundInProgress ? 'End game' : 'Reset room'}
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
