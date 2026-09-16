import type { JSX } from 'react';

import {
    AddModeratorOutlined,
    AutoFixNormal,
    AutoFixOff,
    Home,
    MenuBook,
    RemoveModeratorOutlined,
} from '@mui/icons-material';
import { AppBar, IconButton, Toolbar as MuiToolbar } from '@mui/material';
import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { UserContext } from '../app/StateProvider';
import UserButton from './UserButton';

const Toolbar = (): JSX.Element => {
    const { user, setUser } = useContext(UserContext);
    const location = useLocation();

    return (
        <AppBar position="static" sx={{ mb: 2.5 }}>
            <MuiToolbar>
                <IconButton color="inherit" component={Link} to="/" size="large">
                    <Home />
                </IconButton>
                {!location.pathname.startsWith('/room/') && (
                    <IconButton color="inherit" component={Link} to="/rules" size="large">
                        <MenuBook />
                    </IconButton>
                )}

                <span style={{ flexGrow: 1 }} />

                {user !== null && location.pathname.startsWith('/room/') && (
                    <>
                        <IconButton
                            onClick={() => setUser({ ...user, cheats: !user.cheats })}
                            color="inherit"
                            size="large"
                        >
                            {user.cheats ? <AutoFixOff /> : <AutoFixNormal />}
                        </IconButton>
                        <IconButton
                            onClick={() => setUser({ ...user, admin: !user.admin })}
                            color="inherit"
                            size="large"
                        >
                            {user.admin ? <RemoveModeratorOutlined /> : <AddModeratorOutlined />}
                        </IconButton>
                    </>
                )}
                <UserButton />
            </MuiToolbar>
        </AppBar>
    );
};

export default Toolbar;
