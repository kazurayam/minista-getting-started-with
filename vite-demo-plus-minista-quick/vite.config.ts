// vite-demo-pulu-minista-quick/vite.config.ts
import { defineConfig, pluginSsg, pluginBundle, pluginIsland } from "minista"
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        pluginSsg({
            layout: "/index.tsx",
            src: ["/src/**/*.{tsx,jsx,mdx,md}"],
            srcBases: ["/src"]
        }),
        pluginBundle({
          src: ["/index.tsx", "/src/**/*.{tsx,jsx,mdx}"],
        }),
        pluginIsland(),
        react(), 
    ]
})