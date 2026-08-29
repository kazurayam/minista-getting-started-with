// vite-app-plus-minista/index.tsx

import type { LayoutProps } from "minista/types"
import { Head } from "minista/head"

export default function (props: LayoutProps) {
  return (
    <>
      <Head htmlAttributes={{ lang: "en" }}>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title>my-minista-project</title>
      </Head>
      {props.children}
    </>
  )
}