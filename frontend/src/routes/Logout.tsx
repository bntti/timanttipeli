import { Typography } from '@mui/material';
import { JSX, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../app/StateProvider';

const Logout = (): JSX.Element => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        setUser({ username: '', admin: false, cheats: false });
        localStorage.removeItem('user');
        navigate('/login');
    }, [navigate, setUser]);

    return <Typography>Logging out...</Typography>;
};

export default Logout;
