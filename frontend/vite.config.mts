import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                rewrite: (path) => path.replace(/^\/api/u, ''),
            },
            // '/socket.io': {
            //     target: 'http://localhost:5000',
            //     ws: true,
            // },
        },
    },
});
