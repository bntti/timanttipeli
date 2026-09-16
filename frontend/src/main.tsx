import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/App.js';
import { SocketEventStateProvider, UserStateProvider } from './app/StateProvider';

// oxlint-disable-next-line typescript/no-non-null-assertion
createRoot(document.querySelector('#root')!).render(
    <StrictMode>
        <UserStateProvider>
            <SocketEventStateProvider>
                <App />
            </SocketEventStateProvider>
        </UserStateProvider>
    </StrictMode>,
);
