import { AddModeratorOutlined, AutoFixNormal, AutoFixOff, Home, RemoveModeratorOutlined } from '@mui/icons-material';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import { type JSX, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import UserButton from './UserButton';
import { UserContext } from '../app/StateProvider';

const ToolBar = (): JSX.Element => {
    const { user, setUser } = useContext(UserContext);
    const location = useLocation();

    return (
        <AppBar position="static" sx={{ mb: 2.5 }}>
            <Toolbar>
                <IconButton color="inherit" component={Link} to="/" size="large">
                    <Home />
                </IconButton>
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
            </Toolbar>
        </AppBar>
    );
};

export default ToolBar;
