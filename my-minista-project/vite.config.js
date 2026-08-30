import { defineConfig, pluginSsg, pluginBundle, pluginBeautify } from "minista"

export default defineConfig({
  plugins: [
    pluginSsg({
      layout: "/src/layouts/index.{tsx,jsx}",
      src: ["/src/pages/**/*.{tsx,jsx,mdx,md}"],
      srcBases: ["/src/pages"],
    }),
    pluginBundle({
      src: ["/src/layouts/index.{tsx,jsx}", "/src/pages/**/*.{tsx,jsx,mdx}"],
      outName: "bundle",
      useExportCss: true,
    }),
    pluginBeautify()
  ],
})
