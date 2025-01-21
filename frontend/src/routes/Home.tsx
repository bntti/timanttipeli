import {
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { type JSX, type SyntheticEvent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { SocketEventContext } from '../app/StateProvider';
import { socket } from '../socket';

const HomeRoute = (): JSX.Element => {
    const { t } = useTranslation();
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
        socket.emit('createRoom', newRoom, async (roomId) => navigate(`/room/${roomId}`));
    };

    if (rooms === null) return <Typography>Loading rooms...</Typography>;
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: 'calc(100vh - 76px - 30px)',
            }}
        >
            <Box sx={{ flex: 1 }}>
                <Typography variant="h5">{t('rooms')}</Typography>
                {rooms.length === 0 ? (
                    <Typography>{t('no-rooms')}</Typography>
                ) : (
                    <List component={Paper} sx={{ mt: 2 }} disablePadding>
                        {rooms
                            .filter((room) => !room.hidden)
                            .map((room, i, filteredRooms) => (
                                <div key={room.name}>
                                    <ListItem disablePadding>
                                        <ListItemButton component={Link} to={`/room/${room.id}`}>
                                            <ListItemText>{room.name}</ListItemText>
                                        </ListItemButton>
                                    </ListItem>
                                    {i !== filteredRooms.length - 1 && <Divider component="li" />}
                                </div>
                            ))}
                    </List>
                )}
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ paddingTop: 2.5 }}>
                <form onSubmit={createRoom}>
                    <FormControl fullWidth error={error}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label={t('create-new-room')}
                            error={error}
                            onChange={(event) => {
                                setError(false);
                                setNewRoom(event.target.value);
                            }}
                        />
                        {feedback && <FormHelperText variant="standard">{feedback}</FormHelperText>}
                        <Button fullWidth variant="outlined" type="submit" sx={{ mt: 1 }}>
                            {t('create-room')}
                        </Button>
                    </FormControl>
                </form>
            </Box>
        </Box>
    );
};

export default HomeRoute;
