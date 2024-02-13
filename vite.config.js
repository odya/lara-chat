import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl'
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), 'VITE_PORT');
    return {
        // vite config
        server: {
            https: true,
            port: env.VITE_PORT,
            strictPort: true,
            // host: 'lara-chat.test',
            // host: import.meta.env.VITE_HOST
        },
        plugins: [
            basicSsl(),
            laravel({
                input: 'resources/js/app.jsx',
                refresh: true,
            }),
            react(),
        ],
        resolve: {
            alias: {
                'ziggy-js': resolve('./vendor/tightenco/ziggy/dist/react.m.js')
            },
        },
    }
})
