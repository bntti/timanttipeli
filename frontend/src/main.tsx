import './i18n'; // Side effect import

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/App.js';
import { SocketEventStateProvider, UserStateProvider } from './app/StateProvider';

createRoot(document.querySelector('#root')!).render(
    <StrictMode>
        <UserStateProvider>
            <SocketEventStateProvider>
                <App />
            </SocketEventStateProvider>
        </UserStateProvider>
    </StrictMode>,
);
