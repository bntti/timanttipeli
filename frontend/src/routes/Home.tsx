import {
    Button,
    Divider,
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
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Rooms, RoomsSchema } from '../types';

const Home = (): JSX.Element => {
    const [rooms, setRooms] = useState<Rooms | null>(null);
    const [newRoom, setNewRoom] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`/api/rooms`)
            .then((response) => {
                setRooms(RoomsSchema.parse(response.data));
            })
            .catch(console.error);
    }, []);

    const addApiToken = (event: React.SyntheticEvent): void => {
        event.preventDefault();
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
                <form onSubmit={addApiToken}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Create new room"
                        value={newRoom}
                        onChange={(event) => {
                            setNewRoom(event.target.value);
                        }}
                    />
                    <Button fullWidth variant="outlined" type="submit" sx={{ mt: 1 }}>
                        Create room
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Home;
