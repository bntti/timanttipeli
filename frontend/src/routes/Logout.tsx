import { Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../app/StateProvider';

const Logout = (): JSX.Element => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        setUser({ username: '', admin: false });
        localStorage.removeItem('user');
        navigate('/login');
    }, [navigate, setUser]);

    return <Typography>Logging out...</Typography>;
};

export default Logout;
