import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/airtable': {
          target: 'https://api.airtable.com/v0',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/airtable/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.AIRTABLE_PAT}`)
            })
          },
        },
      },
    },
  }
})