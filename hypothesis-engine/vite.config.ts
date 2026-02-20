import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'watch-data',
      configureServer(server) {
        server.watcher.add('data/**/*.json');
        server.watcher.on('change', (path) => {
          if (path.endsWith('.json') && path.includes('data/')) {
            server.ws.send({ type: 'full-reload' });
          }
        });
      },
    },
  ],
});
