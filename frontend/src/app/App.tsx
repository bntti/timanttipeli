import { Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { Navigate, RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';

import { UserContext, UserSchema } from './StateProvider';
import Root from '../components/Root';
import Home from '../routes/Home';
import Login from '../routes/Login';
import Logout from '../routes/Logout';
import RoomRoute from '../routes/Room';

const RequireAuth = ({ children }: { children: JSX.Element }): JSX.Element => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const storageUser = localStorage.getItem('user');

    useEffect(() => {
        if (user.username !== '') return; // Race condition? (shouldn't be a problem)
        if (storageUser) {
            try {
                const newUser = UserSchema.parse(JSON.parse(storageUser));
                setUser(newUser);
            } catch (error) {
                console.error(error);
                navigate('/logout');
            }
        }
    }, [user, storageUser, setUser, navigate]);

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
