import { Typography } from '@mui/material';
import { type JSX, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../app/StateProvider';

const LogoutRoute = (): JSX.Element => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    }, [navigate, setUser]);

    return <Typography>Logging out...</Typography>;
};

export default LogoutRoute;
