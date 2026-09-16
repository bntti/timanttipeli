import type { JSX } from 'react';

import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { ThemeContext } from '../app/StateProvider';
import Toolbar from './Toolbar';

const Root = (): JSX.Element => {
    const defaultTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const [mode, setMode] = useState<'light' | 'dark'>(defaultTheme ?? 'light');

    const colorMode = useMemo(
        () => ({
            colorMode: {
                toggleTheme: () => {
                    setMode((prevMode) => {
                        localStorage.setItem('theme', prevMode === 'light' ? 'dark' : 'light');
                        return prevMode === 'light' ? 'dark' : 'light';
                    });
                },
            },
        }),
        [],
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode],
    );

    return (
        <ThemeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                <Toolbar />
                <Container sx={{ paddingBottom: '30px' }}>
                    <Outlet />
                </Container>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default Root;
