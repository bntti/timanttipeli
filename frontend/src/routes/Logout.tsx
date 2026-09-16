import type { JSX } from 'react';

import { Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../app/StateProvider';

const LogoutRoute = (): JSX.Element => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(null);
        localStorage.removeItem('user');
        void navigate('/login');
    }, [navigate, setUser]);

    return <Typography>Logging out...</Typography>;
};

export default LogoutRoute;
