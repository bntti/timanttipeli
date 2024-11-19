import { Typography } from '@mui/material';
import { type JSX, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../app/StateProvider';

const LogoutRoute = (): JSX.Element => {
    const { t } = useTranslation();
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    }, [navigate, setUser]);

    return <Typography>{t('logging-out-dots')}</Typography>;
};

export default LogoutRoute;
