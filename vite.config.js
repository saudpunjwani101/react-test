import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Add this for React JSX support

export default defineConfig({
  plugins: [
    process.env.VITEST && react(),
    !process.env.VITEST && reactRouter(), // Disable during Vitest
    tailwindcss(),
  ],
  test: {
    globals: true, // Allows global test/expect without imports
    environment: 'jsdom', // Simulates browser DOM for React tests
    setupFiles: './setupTests.js',
  },
})
