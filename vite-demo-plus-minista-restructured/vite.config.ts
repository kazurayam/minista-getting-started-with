import { defineConfig, pluginSsg, pluginBundle, pluginIsland } from "minista"
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        pluginSsg({
            layout: "/src/layouts/index.{tsx,jsx}",
            src: ["/src/pages/**/*.{tsx,jsx,mdx,md}"],
            srcBases: ["/src/pages"]
        }),
        pluginBundle({
          src: ["/src/layouts/index.tsx", "/src/pages/**/*.{tsx,jsx,mdx}"],
        }),
        pluginIsland(),
        react(), 
    ]
})