- Table of contents
{:toc}

# ministaに入門した話

## 背景

わたしはWeb技術を中心にいろいろ作って楽しんでいる。ある学術団体の事務職員をしていて、その団体のインターネットホームページの管理を任された。そのサイトはいわゆる古き良きHTMLサイトで、数十のHTMLファイルとCSSファイルから構成されている。たくさんのHTMLの中に `<head>` と `<nav>` と `<footer>` があって、ほとんど同じコードが重複して存在している。外部のWebデザイナに発注して納品されたものだ。受託したデザイナがツールでソースを書きツールでビルドした成果物がApacheサーバのhtdocsディレクトリの下に配置されている。デザイナがどういうツールで納品物を作ったかはわからない。デザイナから発注主へソースを納入するということはしなかったようだ。多分「ソースって何？要らないよ、手に余るから」と発注主が言ったんじゃないかな。

わたしはときどきこのサイトに **What’s News** 的な記事を追加するべくHTMLをエディタで編集する。その時このままではメンテナンスが厳しいなあと感じている。近い将来、誰かにサイトの管理役を引き継ぐことになるだろう。その時HTMLの山をホイと渡してあとは知らんぷりするのは気がとがめる。今どきのソフトウェア技術を導入してホームページのメンテナンス作業を楽にしたい、と思った。

いくつかのページをJSXで作り直してみた。それはもちろんできる。JSXを導入すればコードをコンポーネント化することができてうれしい。しかしこのサイトをReactによる **Single Page Application** に移行したいのか？そうではない。これは閲覧向けの素朴なサイトで、Reactの高度なユーザーインタフェースは要らない。Apacheサーバに静的HTMLとCSSを配置しただけのサイトの現状構成を変えるべき理由がない。Reactアプリにしたら団体の人に「ホームページの応答が遅くなった」といわれるだろうし。どうしようか…​

最近 [minista](https://minista.qranoko.jp/) というソフトウェアを見つけた。

> minista（ミニスタ）は、ReactのJSXとViteで100%静的なサイトを作るスタティックサイトジェネレーターです。

これ、わたしのニーズに適っているかもしれないと思った。ministaのドキュメントの linik:https://minista.qranoko.jp/docs/setup\[Setup\] を手始めに色々試した。途中、行き詰まってしまい ministaのGitHubレポジトリにissueを投げたこともあった。

-   [build したらエラ〜発生: ReferenceError: document is not defined
    \#146](https://github.com/qrac/minista/issues/146#event-30162718761)

このissueにたいしエキスパートが応えてくれて、大いに学ぶところがあった。ministaの公式ドキュメントは製品に関する詳細情報が盛られているが、初学者が読むべき初歩的な手引きが見当たらなかった。そこでわたしの経験をネタに Getting Started with minista を書きます。

## 作業環境

-   マシン: MacBook Air Intel, 2018

-   OS: macOS Sonoma 17.8.9

-   JavaScript Runtime: Bun 1.4.0

minitaの公式ドキュメントはJavaScriptランタイムとして [npm](https://bun.sh/) を使っている。わたしは個人的な好みにより [bun](https://bun.sh/) を代替として使った。わたしの見る限り問題ない。

## minimal-minista-project

まず手元のPCに適当なディレクトリを作った。そのディレクトリのパスをシェル変数 `ROOT` で参照できるようにした。

    $ cd ~/tmp
    $ mkdir minista-getting-started-with
    $ cd minsta-getting-started-with
    $ ROOT=`pwd`

ministaの公式ドキュメント [Setup / minista](https://minista.qranoko.jp/docs/setup#automatic) のなかの **Automatic** の説明を参照して最小限のministaプロジェクト `minimal-minista-project` を作った。

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

どんなファイルが初期作成されたかというと

    $ tree minimal-minista-project
    minimal-minista-project
    ├── package.json
    ├── src
    │   └── pages
    │       └── index.tsx
    ├── tsconfig.json
    └── vite.config.ts

    3 directories, 4 files

続けて `bun install` コマンドを実行し、外部パッケージを導入しよう。

    $ cd $ROOT/minimal-minista-project
    $ bun install
    bun install v1.4.0 (34cbb9a40)

    + @types/node@26.4.0
    + @types/react@19.2.18
    + @types/react-dom@19.2.5
    + minista@4.0.10
    + react@19.2.8
    + react-dom@19.2.8
    + typescript@7.0.2
    + vite@8.2.2

    252 packages installed [5.59s]

\`bun create minista\`によって初期作成されたファイルの中身をみてみよう。

### `package.json`

    include::../minimal-minista-project/package.json

`"devDependencies"` プロパティにいくつかの外部パッケージが列挙されている。これらは `minista` パッケージとそれが依存しているパッケージ群だ。だからコマンドラインで下記の操作をした結果と同じだろう。

    $ cd $ROOT/minimal-minista-project
    $ bun add minista@latest

`"scripts"` プロパティに３つのコマンドが定義されている。

      "scripts": {
        "dev": "minista",
        "build": "minista build",
        "preview": "minista preview"
      },

#### bun run dev

コマンドラインで `bun run dev` とやるとViteの開発用Webサーバが立ち上がる。

    $ cd $ROOT/minimal-minista-project
    $ bun run dev
    $ minista

      VITE v8.2.2  ready in 6013 ms

      ➜  Local:   http://localhost:5173/
      ➜  Network: use --host to expose
      ➜  press h + enter to show help

ブラウザで <http://localhost:5175/> を開くとこんな画面が応答される。

![001 minimal minista project](https://kazurayam.github.io/minista-getting-started-with/images/001_minimal-minista-project.png)

CTRL+Cで開発サーバーを停止することができる。

#### bun run build

コマンドラインで `bun run dev` とやるとViteによるビルドが実行される。 `dist` ディレクトリが作られ、その中に静的HTML＋CSSのサイトが生成される。

    $ cd $ROOT/minimal-minista-project
    $ bun run build
    $ minista build
    vite v8.2.2 building ssr environment for production...
    ✓ 3 modules transformed.
    computing gzip size...
    node_modules/.minista/ssr/__minista-ssg.mjs  0.87 kB │ gzip: 0.46 kB

    ✓ built in 41ms
    vite v8.2.2 building client environment for production...
    ✓ 2 modules transformed.
    computing gzip size...
    dist/index.html  0.17 kB │ gzip: 0.15 kB

    ✓ built in 41ms

    $ tree dist
    dist
    └── index.html

    1 directory, 1 file

このサンプルが出力するのは `index.html` ファイルが一個だけだ。たしかにminimalだ。あまり参考にならない。

もう少し中身のあるサンプルをあとで紹介するから今はパスしてほしい。

#### bun run preview

コマンドラインで `bun run dev` とやるとViteの開発サーバが立ち上がる。今度は `dist` ディレクトリの中に生成された静的HTML＋CSSのサイトが閲覧できる。

    $ minista preview
      ➜  Local:   http://localhost:4173/
      ➜  Network: use --host to expose
      ➜  press h + enter to show help

ブラウザで <http://localhost:4173/> をひらけば "Hello!" と画面が応答される。`bun run dev` した時に応答された画面は `src/index.tsx` ファイルから生成された画面だが、`bun run preview` した時に応答されるのは `dist/index.html` ファイルだ。.jsxと.htmlと、ふたつのファイルの中身は違うが、ブラウザに表示された画面はまったく同じ。ministaが「スタティックサイトジェネレーション」を実行するとはこういうことだ。

### `` src/pages/index.tsx` ``

    include::../minimal-minista-project/src/pages/index.tsx

-   `` tsconfig.json` ``

<!-- -->

    include::../minimal-minista-project/tsconfig.json

-   `vite.config.ts`

<!-- -->

    include::../minimal-minista-project/vite.config.ts

## my-minista-project

TODO

Unresolved directive in index\_.adoc - include::./05\_minista-docs.adoc\[\]

## 結び

Markdownで書ける。良いなあ。使おう。
