import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        activities: resolve(__dirname, 'activities.html'),
        news: resolve(__dirname, 'news.html'),
        events: resolve(__dirname, 'events.html'),
        membership: resolve(__dirname, 'membership.html'),
        donate: resolve(__dirname, 'donate.html'),
        contact: resolve(__dirname, 'contact.html'),
        quran: resolve(__dirname, 'quran.html'),
        tasbih: resolve(__dirname, 'tasbih.html'),
        login: resolve(__dirname, 'login.html'),
      },
    },
  },
});
