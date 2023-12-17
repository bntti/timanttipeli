import {
    Alert,
    Box,
    Button,
    Divider,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    useTheme,
} from '@mui/material';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { UserContext } from '../app/StateProvider';
import { Room, RoomSchema, TrapCard } from '../types';

const RoomRoute = (): JSX.Element => {
    const [room, setRoom] = useState<Room | null>(null);
    const [vote, setVote] = useState<'stay' | 'leave' | null>(null);
    const [admin, setAdmin] = useState<boolean>(false);
    const { user } = useContext(UserContext);
    const { roomId } = useParams();
    const theme = useTheme();

    useEffect(() => {
        axios
            .get(`/api/room/${roomId}`)
            .then((response) => {
                setRoom(RoomSchema.parse(response.data));
            })
            .catch(console.error);
    }, [roomId]);

    useEffect(() => {
        // TODO: Fix
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

            {/* {JSON.stringify(room)} */}
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography>Player</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>Points</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(room.data.players).map(([player, points]) => (
                            <TableRow
                                key={player}
                                sx={{
                                    '&:last-child td': {
                                        borderBottom: 0,
                                    },
                                    background:
                                        room.data.roundInProgress && room.data.currentRound.players.includes(player)
                                            ? theme.palette.mode === 'light'
                                                ? '#00f3'
                                                : '#99f3'
                                            : '#0000',
                                }}
                            >
                                <TableCell sx={{ width: '60%' }}>
                                    <Typography>{player}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{points}</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {room.data.gameInProgress && (
                <>
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table size="small">
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ width: '60%' }}>
                                        <Typography>Round #</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>{room.data.roundsDone + 1}</Typography>
                                    </TableCell>
                                </TableRow>

                                {room.data.roundInProgress && (
                                    <>
                                        <TableRow>
                                            <TableCell sx={{ width: '60%' }}>
                                                <Typography>Deck size</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>
                                                    {Object.keys(room.data.currentRound.deck).length +
                                                        room.data.currentRound.inPlay.length}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ width: '60%' }}>
                                                <Typography>Number of votes</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>
                                                    {Object.keys(room.data.currentRound.votes).length}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ width: '60%' }}>
                                                <Typography>Points per player</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>{room.data.currentRound.pointsPerPlayer}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{
                                                '&:last-child td': {
                                                    borderBottom: 0,
                                                },
                                            }}
                                        >
                                            <TableCell sx={{ width: '60%' }}>
                                                <Typography>Points on ground</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>{room.data.currentRound.pointsOnGround}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {room.data.removedCards.length > 0 && (
                        <Paper sx={{ mt: 2, pl: 1, pr: 1, pt: 1 }}>
                            <Typography textAlign="center">Removed cards</Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                }}
                            >
                                {room.data.removedCards.map((card, i) => (
                                    <Box
                                        key={`${card.type}${i}`}
                                        sx={{
                                            m: 1,
                                            p: 1,
                                            width: 80,
                                            background: card.type === 'relic' ? '#ff09' : '#f009',
                                            border: '1px solid',
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Typography sx={{ textAlign: 'center' }}>
                                            {card.type !== 'trap' ? card.value : card.trap}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    )}
                </>
            )}

            {room.data.roundInProgress && (
                <>
                    <Grid component={Paper} container sx={{ mt: 2 }}>
                        <Grid item xs={6}>
                            <Typography sx={{ textAlign: 'center' }}>cards</Typography>
                        </Grid>
                        <Divider orientation="vertical" flexItem sx={{ mr: '-1px' }} />
                        <Grid item xs={6}>
                            <Typography sx={{ textAlign: 'center' }}>traps</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                }}
                            >
                                {room.data.currentRound.inPlay
                                    .filter((card) => card.type !== 'trap')
                                    .map((card, i) => (
                                        <Box
                                            key={`${card.type}${i}`}
                                            sx={{
                                                m: 1,
                                                p: 1,
                                                width: 40,
                                                background: card.type === 'points' ? '#aaa9' : '#ff09',
                                                border: '1px solid',
                                                borderRadius: 2,
                                            }}
                                        >
                                            <Typography sx={{ textAlign: 'center' }}>
                                                {card.type !== 'trap' ? card.value : card.trap}
                                            </Typography>
                                        </Box>
                                    ))}
                            </Box>
                        </Grid>
                        <Divider orientation="vertical" flexItem sx={{ mr: '-1px' }} />
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                }}
                            >
                                {room.data.currentRound.inPlay
                                    .filter((card): card is TrapCard => card.type === 'trap')
                                    .map((card, i) => (
                                        <Box
                                            key={`${card.trap}${i}`}
                                            sx={{
                                                m: 1,
                                                p: 1,
                                                width: 80,
                                                background: '#f009',
                                                border: '1px solid',
                                                borderRadius: 2,
                                            }}
                                        >
                                            <Typography sx={{ textAlign: 'center' }}>{card.trap}</Typography>
                                        </Box>
                                    ))}
                            </Box>
                        </Grid>
                    </Grid>
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
