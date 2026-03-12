import { defineConfig } from 'vite';

// Named .mts because of https://vitejs.dev/guide/troubleshooting.html#this-package-is-esm-only

// https://vitejs.dev/config/
export default defineConfig({
    resolve: { tsconfigPaths: true },
    server: {
        proxy: {
            '/socket.io': {
                target: 'http://localhost:5000',
                ws: true,
            },
        },
    },
});
