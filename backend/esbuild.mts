import { build } from 'esbuild';

try {
    await build({
        bundle: true,
        entryPoints: ['./src/index.ts'],
        external: ['express', 'socket.io', 'zod'],
        format: 'esm',
        minify: true,
        outExtension: { '.js': '.mjs' },
        outdir: './dist',
        platform: 'node',
        sourcemap: true,
    });
} catch (error) {
    console.error(error);
    process.exit(1);
}
