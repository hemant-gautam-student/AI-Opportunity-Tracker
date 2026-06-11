import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const BASE_ID = 'appyy1Aeo1gibcStS'
const TABLE_NAME = 'Opportunities'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/airtable-proxy': {
          target: 'https://api.airtable.com',
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              // Inject Airtable auth header
              proxyReq.setHeader('Authorization', `Bearer ${env.AIRTABLE_PAT}`)

              // Parse original URL to extract query params
              const parsed = new URL(req.url, 'http://localhost')
              const recordId = parsed.searchParams.get('id')

              // Build target path
              let targetPath = `/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`
              if (recordId) {
                targetPath += `/${recordId}`
              }

              proxyReq.path = targetPath
            })
          },
        },
      },
    },
  }
})