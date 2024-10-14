import { Button, Container, Paper, TextField, Typography } from '@mui/material';
import { type JSX, type SyntheticEvent, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { UserContext } from '../app/StateProvider';

const LoginRoute = (): JSX.Element => {
    const { state } = useLocation() as { state?: { from: string } };
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>('');

    const addApiToken = (event: SyntheticEvent): void => {
        event.preventDefault();

        const user = { username, admin: false, cheats: false };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));

        if (state?.from) navigate(state.from);
        else navigate('/');
    };

    return (
        <Container component={Paper} sx={{ pt: 2.5, pb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Select username
            </Typography>
            <form onSubmit={addApiToken}>
                <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <Button variant="contained" type="submit" sx={{ mt: 1 }}>
                    Log in
                </Button>
            </form>
        </Container>
    );
};

export default LoginRoute;
