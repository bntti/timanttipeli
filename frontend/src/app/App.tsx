import type { JSX, PropsWithChildren, ReactNode } from 'react';

// oxlint-disable react/no-multi-comp
import { Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { Navigate, RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';

import Root from '../components/Root';
import HomeRoute from '../routes/Home';
import LoginRoute from '../routes/Login';
import LogoutRoute from '../routes/Logout';
import RoomRoute from '../routes/Room';
import RulesRoute from '../routes/Rules';
import { UserContext, UserSchema } from './StateProvider';

const RequireAuth = ({ children }: PropsWithChildren): ReactNode => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const storageUser = localStorage.getItem('user');

    useEffect(() => {
        if (user !== null) return;
        if (storageUser !== null)
            try {
                const newUser = UserSchema.parse(JSON.parse(storageUser));
                setUser(newUser);
            } catch (error) {
                // oxlint-disable-next-line no-console
                console.error(error);
                void navigate('/logout');
            }
    }, [user, storageUser, setUser, navigate]);

    if (user !== null) return children;
    if (storageUser !== null) return <Typography>Loading</Typography>;

    return <Navigate replace to="/login" state={{ from: location.pathname }} />;
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/',
                element: (
                    <RequireAuth>
                        <HomeRoute />
                    </RequireAuth>
                ),
            },
            { path: 'login', element: <LoginRoute /> },
            { path: 'logout', element: <LogoutRoute /> },
            {
                path: 'rules',
                element: (
                    <RequireAuth>
                        <RulesRoute />
                    </RequireAuth>
                ),
            },
            {
                path: 'room/:roomId',
                element: (
                    <RequireAuth>
                        <RoomRoute />
                    </RequireAuth>
                ),
            },
        ],
    },
]);

const App = (): JSX.Element => <RouterProvider router={router} />;

export default App;
