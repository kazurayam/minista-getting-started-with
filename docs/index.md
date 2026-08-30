- Table of contents
{:toc}

# ViteのデモプロジェクトをMinistaで静的HTMLサイトに変換することに成功した話

## 要旨

わたしは元プログラマー。定年退職後もWeb技術を中心にいろいろ作って楽しんでいる。アルバイトとしてある学術団体の事務職員をしているのだが、その団体のインターネットホームページの管理を任された。そのサイトはいわゆる古き良きHTMLサイトで、数十のHTMLファイルとCSSファイルから構成されている。たくさんのHTMLの中に `<head>` と `<nav>` と `<footer>` があって、ほとんど同じコードがたくさん重複して存在している。外部のWebデザイナに委託して納品されたものだ。デザイナがどういうテンプレート技術を使ってソースから納品物を作ったかは今となってはわからない。重複だらけのHTMLファイルの山がApacheサーバーの htdocs ディレクトリの下に配置されているのをわたしは受け取った。

ときどき *What’s News* 的な記事を追加する仕事をわたしがするのだが、このままではメンテナンスが厳しいなあと感じている。近い将来、誰かにサイトの管理役を引き継ぐことになるだろう。現状のHTMLの山をホイと渡してあとは知らんぷりするのは気がとがめる。今どきのソフトウェア技術を導入してホームページのメンテナンス作業を楽にしたい、と思った。JSXでサイトを作り直す試みに着手した。それはもちろんできる。JSXを導入すればコードをコンポーネント化することができて良い。しかしこのサイトをReactによる *Single Page Application* に移行したいのか？それはダメだ。Reactアプリにしたら団体の会長さんに「ホームページの応答が遅くなった」といわれるだろう。当該サイトが現状Apacheサーバに静的HTMLとCSSを配置したシンプルなもので、その形を変えるべき理由が今のところ見当たらないし。

そんな時 [minista](https://minista.qranoko.jp/) というソフトウェアを見つけた。

> minista（ミニスタ）は、ReactのJSXとViteで100%静的なサイトを作るスタティックサイトジェネレーターです。

これ、良いかもしれない。いろいろ試してみてministaについてわたしが学んだことを報告します。

## 作業環境

-   マシン: MacBook Air Intel, 2018

-   OS: macOS Sonoma 17.8.9

-   JavaScript Runtime: Bun 1.4.0

## minimal-minista-project

ministaの公式ドキュメントの最初に紹介されているサンプルプロジェクトをやってみた。

ministaの必要最小限のサンプルプロジェクトを作った。 [Setup / minista](https://minista.qranoko.jp/docs/setup#automatic) のなかの **Automatic** の説明を参照した。

    $ cd $ROOT
    $ bun create minista@latest minimal-minista-project -- --template minimal.ts

    create-minista (v4.0.10)
    ? Which template would you like to use? › - Use arrow-keys. Return to submit.
        Minimal (JavaScript)
    ❯   Minimal (Typescript)
    > Copying project files...
    ✔ Done!

    Next steps:
      1: cd minimal-minista-project
      2: npm install
      3: npm run dev

    To close the dev server, hit Ctrl + C

## vite-demoプロジェクト

viteのデモプロジェクトを作った。[Vite / Getting Started / Scaffolding Your First Vite Project](https://vite.dev/guide/#scaffolding-your-first-vite-project) を参照した。

    $ cd $ROOT
    $ bun create vite@latest vite-demo
    │
    ◆  Select a framework:
    │  ○ Vanilla
    │  ○ Vue
    │  ● React
    │  ○ Preact
    │  ○ Lit
    │  ○ Svelte
    │  ○ Solid
    │  ○ Ember
    │  ○ Qwik
    │  ○ Angular
    │  ○ Marko
    │  ○ Others
    │  ↑/↓ to navigate • Enter: confirm
    │
    ◆  Select a variant:
    │  ● TypeScript
    │  ○ TypeScript + React Compiler
    │  ○ JavaScript
    │  ○ JavaScript + React Compiler
    │  ○ RSC
    │  ○ React Router v7 ↗ https://reactrouter.com
    │  ○ TanStack Router ↗ https://tanstack.com/router
    │  ○ RedwoodSDK ↗ https://rwsdk.com
    │  ○ Vike ↗ https://vike.dev
    │  ↑/↓ to navigate • Enter: confirm
    ◆  Which linter to use?
    │  ● Oxlint
    │  ○ ESLint
    │  ↑/↓ to navigate • Enter: confirm
    ◆  Install with bun and start now?
    │  ○ Yes / ● No
    ◇  Scaffolding project in /Users/kazuakiurayama/github/minista-getting-started-with/vite-demo...
    │
    └  Done. Now run:

      cd vite-demo-plus
      bun install
      bun dev

ディレクトリ `vite-demo` ができた。その内容はこんなだ。

    $ tree -L 2 vite-demo/
    vite-demo/
    ├── README.md
    ├── index.html
    ├── package.json
    ├── public
    │   ├── favicon.svg
    │   └── icons.svg
    ├── src
    │   ├── App.css
    │   ├── App.tsx
    │   ├── assets
    │   ├── index.css
    │   └── main.tsx
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts

    4 directories, 13 files

開発サーバーを立ち上げるにはこうする。

    $ cd $ROOT/vite-demo
    $ bun install
    $ bun run dev

開発サーバが立ち上がったらブラウザで <http://localhost:5173> を開け。viteのdemoの画面が見えるはず。

![001 vite demo](https://kazurayam.github.io/minista-getting-started-with/images/001-vite-demo.png)

わたしはここ数年Reactを学習する題材としてこのvite-demoプロジェクトのコードセットを繰り返し眺めてきた。プロジェクトディレクトリの下に `index.html` があって `src/main.tsx` があって `src/App.tsx` がある。Reactアプリはすべてこのファイル構成に従わねばならないのだと思いこんでいた。ところがそんなことないということを今回学んだ。ええっ、そうだったんですか！と驚いた。詳しくは後述。

## vite-demo-plus-minista-quick

`vite-demo` プロジェクトを静的HTMLに変換したいと思った。[Setup - ministaのManual](https://minista.qranoko.jp/docs/setup#manual) の説明に従って\`vite-demo\` に minista を追加すればそれが可能になるんじゃないかと思った。やってみたが、最初、うまくいかなかった。自分で解決できなかったので、ministaのGitHubレポジトリのissueに質問を投稿した。幸いなことにministaの作者 qrac が即答してくれた。

-   <https://github.com/qrac/minista/issues/146#event-30162718761>

qrac の回答になぞることにより、viteのデモプロジェクトにministaを組み込んで静的HTMLサイトを生成することに成功した。その内容を以下に記述しよう。

viteのデモプロジェクトを雛形として\`vite-demo-plus-minista-quick\` プロジェクトを作った。

    $ cd $ROOT/vite-demo-plus-minista
    $ bun create vite@latest vite-demo-plus-minista-quick

これによって `vite-demo` プロジェクトと全く同じファイル群一式が `vite-demo-plus-minista-quick` ディレクトリの下に出力された。

ここに minista のパッケージを追加した。

    $ cd vite-demo-plust-minista-quick
    $ bun add -d minista
    bun add v1.4.0 (34cbb9a40)

    + @types/node@24.13.3 (v26.4.0 available)
    + @types/react@19.2.18
    + @types/react-dom@19.2.5
    + @vitejs/plugin-react@6.1.1
    + oxlint@1.80.0
    + typescript@6.0.3 (v7.0.2 available)
    + vite@8.2.2
    + react@19.2.8
    + react-dom@19.2.8

    installed minista@4.0.10 with binaries:
     - minista

    254 packages installed [7.49s]

qrqcのアドバイスによれば、わたしは下記３つのministaプラグインを必要とするだろう、とのこと。

-   pluginSsg - minista <https://minista.qranoko.jp/docs/plugins/ssg>

-   pluginBundle - minista <https://minista.qranoko.jp/docs/plugins/bundle>

-   pluginIsland - minista <https://minista.qranoko.jp/docs/plugins/island>

これらのプラグインを有効化するために `vite-demo-plus-minista-quick/vite.config.ts` を書きにように修正する必要がある。

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
