import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server:{
            // proxy: 'http://localhost:8000',
            proxy: {
              "/api": {
                target: "http://localhost:8000",
                changeOrigin: true,
                secure: false,      
                ws: true, 
              },
            },
           
          },
    };
});
