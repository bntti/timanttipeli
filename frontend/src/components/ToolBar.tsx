import { Brightness3, Brightness7, Home } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppBar, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { ThemeContext, UserContext } from '../app/StateProvider';

const ToolBar = (): JSX.Element => {
    const { user } = useContext(UserContext);
    const { colorMode } = useContext(ThemeContext);
    const theme = useTheme();

    return (
        <AppBar position="static" sx={{ mb: 2.5 }}>
            <Toolbar>
                <IconButton color="inherit" component={Link} to="/">
                    <Home />
                </IconButton>

                <IconButton onClick={colorMode.toggleTheme} color="inherit" size="large">
                    {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness3 />}
                </IconButton>

                <Typography color="inherit" sx={{ marginLeft: 'auto' }}>
                    <em>{user === '' ? 'Not Logged in' : user}</em>
                </Typography>

                <IconButton color="inherit" component={Link} to="/logout" size="large">
                    <LogoutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default ToolBar;
