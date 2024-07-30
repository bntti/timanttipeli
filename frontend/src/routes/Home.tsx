import {
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { JSX, SyntheticEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Rooms, RoomsSchema } from '../types';

const Home = (): JSX.Element => {
    const [rooms, setRooms] = useState<Rooms | null>(null);
    const [newRoom, setNewRoom] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`/api/rooms`)
            .then((response) => {
                setRooms(RoomsSchema.parse(response.data));
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        const pollingInterval = setInterval(() => {
            axios
                .get(`/api/rooms`)
                .then((response) => {
                    const newRooms = RoomsSchema.parse(response.data);
                    if (JSON.stringify(rooms) !== JSON.stringify(newRooms)) setRooms(newRooms);
                })
                .catch(console.error);
        }, 1000);

        return () => clearInterval(pollingInterval);
    }, [rooms]);

    const createRoom = (event: SyntheticEvent): void => {
        event.preventDefault();
        if (newRoom.trim() === '') {
            setError(true);
            setFeedback('Room name cannot be empty');
            return;
        }
        setError(false);
        setFeedback('');
        axios
            .post('/api/createRoom', { name: newRoom })
            .then((response) => {
                const roomId = z.number().int().parse(response.data);
                navigate(`/room/${roomId}`);
            })
            .catch(console.error);
    };

    if (rooms === null) return <Typography>Loading rooms...</Typography>;
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: 'calc(100vh - 76px - 30px)',
            }}
        >
            <div style={{ flex: 1 }}>
                <Typography variant="h5">Rooms</Typography>
                {rooms.length === 0 ? (
                    <Typography>No rooms</Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table component="div">
                            <TableBody component="div">
                                {rooms
                                    .filter((room) => !room.hidden)
                                    .map((room) => (
                                        <TableRow
                                            key={room.name}
                                            component={Link}
                                            to={`/room/${room.id}`}
                                            sx={{
                                                textDecoration: 'none',
                                                '&:last-child td': {
                                                    borderBottom: 0,
                                                },
                                            }}
                                        >
                                            <TableCell component="div">
                                                <Typography>{room.name}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>
            <Divider sx={{ mb: 2 }} />
            <div style={{ paddingTop: 2.5 }}>
                <form onSubmit={createRoom}>
                    <FormControl fullWidth error={error}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Create new room"
                            value={newRoom}
                            error={error}
                            onChange={(event) => {
                                setError(false);
                                setNewRoom(event.target.value);
                            }}
                        />
                        {feedback && <FormHelperText variant="standard">{feedback}</FormHelperText>}
                        <Button fullWidth variant="outlined" type="submit" sx={{ mt: 1 }}>
                            Create room
                        </Button>
                    </FormControl>
                </form>
            </div>
        </div>
    );
};

export default Home;
