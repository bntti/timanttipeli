import { Button, Container, Paper, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { UserContext } from '../app/StateProvider';

const Login = (): JSX.Element => {
    const { state } = useLocation();
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [newUser, setNewUser] = useState('');

    const addApiToken = (event: React.SyntheticEvent): void => {
        event.preventDefault();
        setUser(newUser);
        localStorage.setItem('user', newUser);
        if (state && state.from) navigate(state.from);
        else navigate('/');
    };

    return (
        <Container component={Paper} sx={{ pt: 2.5, pb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Login
            </Typography>
            <form onSubmit={addApiToken}>
                <TextField
                    fullWidth
                    label="Usename"
                    value={newUser}
                    onChange={(event) => {
                        setNewUser(event.target.value);
                    }}
                />
                <Button variant="contained" type="submit" sx={{ mt: 1 }}>
                    Log in
                </Button>
            </form>
        </Container>
    );
};

export default Login;
