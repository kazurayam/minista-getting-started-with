- Table of contents
{:toc}

# ViteのデモプロジェクトをMinistaで静的HTMLサイトに変換することに成功した話

    $ bun --version
    1.4.0

    $ cd ~
    $ mkdir minista-getting-started-with
    $ cd minista-getting-started-with
    $ ROOT=`pwd`
    $ echo $ROOT
    /Users/kazurayam/tmp/minista-getting-started-with

## minimal-minista-project

ministaの必要最小限のサンプルプロジェクトを作った。 [Setup / minista](https://minista.qranoko.jp/docs/setup#automatic) を参照した。

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
