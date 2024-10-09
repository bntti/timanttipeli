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
import { type JSX, type SyntheticEvent, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { SocketEventContext } from '../app/StateProvider';
import { socket } from '../socket';

const Home = (): JSX.Element => {
    const { rooms } = useContext(SocketEventContext);

    const [newRoom, setNewRoom] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string>('');
    const navigate = useNavigate();

    const createRoom = (event: SyntheticEvent): void => {
        event.preventDefault();
        if (newRoom.trim() === '') {
            setError(true);
            setFeedback('Room name cannot be empty');
            return;
        }
        setError(false);
        setFeedback('');
        socket.emit('createRoom', newRoom, (roomId) => navigate(`/room/${roomId}`));
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
