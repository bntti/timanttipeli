import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/App.js';
import { GlobalStateProvider } from './app/StateProvider';

createRoot(document.querySelector('#root')!).render(
    <StrictMode>
        <GlobalStateProvider>
            <App />
        </GlobalStateProvider>
    </StrictMode>,
);
