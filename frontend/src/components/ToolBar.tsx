import { AddModeratorOutlined, Brightness3, Brightness7, Home, RemoveModeratorOutlined } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppBar, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { ThemeContext, UserContext } from '../app/StateProvider';

const ToolBar = (): JSX.Element => {
    const { user, setUser } = useContext(UserContext);
    const { colorMode } = useContext(ThemeContext);
    const theme = useTheme();

    return (
        <AppBar position="static" sx={{ mb: 2.5 }}>
            <Toolbar>
                <IconButton color="inherit" component={Link} to="/">
                    <Home />
                </IconButton>

                <IconButton onClick={colorMode.toggleTheme} color="inherit" size="large" sx={{ marginRight: 'auto' }}>
                    {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness3 />}
                </IconButton>

                {user.username && (
                    <IconButton onClick={() => setUser({ ...user, admin: !user.admin })} color="inherit" size="large">
                        {user.admin ? <RemoveModeratorOutlined /> : <AddModeratorOutlined />}
                    </IconButton>
                )}
                <Typography color="inherit">
                    <em>{user.username === '' ? 'Not Logged in' : user.username}</em>
                </Typography>

                <IconButton color="inherit" component={Link} to="/logout" size="large">
                    <LogoutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default ToolBar;
