import { Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { UserContext } from './StateProvider';
import Root from '../components/Root';
import Home from '../routes/Home';
import Login from '../routes/Login';
import Logout from '../routes/Logout';
import RoomRoute from '../routes/Room';

const RequireAuth = ({ children }: { children: JSX.Element }): JSX.Element => {
    const { user, setUser } = useContext(UserContext);

    const storageUser = localStorage.getItem('user');

    useEffect(() => {
        if (user.username !== '') return; // Race condition? (shouldn't be a problem)
        if (storageUser) setUser(JSON.parse(storageUser));
    }, [user, storageUser, setUser]);

    if (user.username !== '') return children;
    if (storageUser) return <Typography>Loading</Typography>;

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
                        <Home />
                    </RequireAuth>
                ),
            },
            { path: 'login', element: <Login /> },
            { path: 'logout', element: <Logout /> },
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
