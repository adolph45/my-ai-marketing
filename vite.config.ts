
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use '.' to refer to the current directory, avoiding the 'cwd' property error on the process object in strictly typed environments
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    define: {
      // Ensure process.env.API_KEY is available in frontend code as per Gemini SDK requirements
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || '')
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false
    }
  };
});
