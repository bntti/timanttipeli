import { Brightness3, Brightness7, Logout } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Button, ListItemIcon, ListItemText, Menu, MenuItem, Typography, useTheme } from '@mui/material';
import { type JSX, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ThemeContext, UserContext } from '../app/StateProvider';

const UserButton = (): JSX.Element => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { colorMode } = useContext(ThemeContext);

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [anchorWidth, setAnchorWidth] = useState<number | null>(null);

    const menuOpen = Boolean(anchorEl);

    if (user === null) {
        return (
            <Typography color="inherit">
                <em>Not Logged in</em>
            </Typography>
        );
    }

    return (
        <>
            <Button
                color="inherit"
                onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                    setAnchorWidth(event.currentTarget.offsetWidth);
                }}
                style={{ textTransform: 'none' }}
            >
                <Box sx={{ marginRight: 1, marginTop: 1 }}>
                    <PersonIcon color="inherit" />
                </Box>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.username}</span>
                <ArrowDropDownIcon color="inherit" />
            </Button>

            <Menu anchorEl={anchorEl} open={menuOpen} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={colorMode.toggleTheme} sx={{ width: anchorWidth ?? '100%' }}>
                    <ListItemIcon>{theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness3 />}</ListItemIcon>
                    <ListItemText>Theme</ListItemText>
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        navigate('/logout');
                    }}
                >
                    <ListItemIcon>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>{' '}
                </MenuItem>
            </Menu>
        </>
    );
};

export default UserButton;
