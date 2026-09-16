/* oxlint-disable promise/prefer-await-to-then */
import { build } from 'esbuild';

build({
    bundle: true,
    entryPoints: ['./src/index.ts'],
    format: 'esm',
    minify: true,
    outExtension: { '.js': '.mjs' },
    outdir: './dist',
    packages: 'external',
    platform: 'node',
    sourcemap: true,
}).catch(() => {
    process.exit(1);
});
