- Table of contents
{:toc}

# スタティックサイトジェネレーター minista を試してみた

## 背景

わたしはWebプログラミングを中心にいろいろ学んで作って楽しんでいる。ある学術団体の事務職員をしていて、その団体のインターネットホームページの管理を任された。そのサイトは古き良きHTMLサイトで、数十のHTMLファイルとCSSファイルから構成されている。たくさんのHTMLの中に `<head>` と `<nav>` と `<footer>` があって、ほとんど同じコードが重複して存在している。数年前、外部のWebデザイナに発注して初期構築したらしい。受託したデザイナが何らかのオーサリングツールでソースを書き、ビルドした成果物がApacheサーバのhtdocsディレクトリの下に配置されている。デザイナがどういうツールを使ったのかはわからない。デザイナから発注主へソースコードを納入するということはしなかったようだ。たぶん発注主が「ソースって何？要らないよ。よくわからないから」と言ったんじゃないかと推測している。

わたしは今でも必要に応じてこのサイトにWhat’s News的な記事を追加するべくエディタでHTMLを修正している。このやり方でメンテナンスを続けるのは厳しいなあと感じている。近い将来、誰かにサイトの管理役を引き継ぐことになるだろう。その時HTMLの山をホイと渡してあとは知らんぷりするのは気がとがめる。今どきのソフトウェア技術を導入してホームページのメンテナンス作業を楽にしたい、と思った。

いくつかのページをJSXで作り直してみた。それはもちろんできる。JSXを導入すればコードをコンポーネント化することができてコードの重複を排除できるのがうれしい。しかしこのサイトをReactによる Single Page Application に移行したいと望んではいない。閲覧オンリーなサイトだからReactの会話的ユーザーインタフェースは必要ない。レンタルサーバー上のApacheサーバに静的HTMLとCSSを配置しただけの現状の構成を変えてNode.jsの上でサーバに移行すべき理由がない。SPAにしたらきっと団体の人に「ホームページの応答が遅くなった」といわれるだろうし。さてどうしようか…​と迷走しているうちに [minista](https://minista.qranoko.jp/) を見つけた。

> minista（ミニスタ）は、ReactのJSXとViteで100%静的なサイトを作るスタティックサイトジェネレーターです。

これ、わたしのニーズにあっているかもしれないと思った。ministaのドキュメント [”Setup”](https://minista.qranoko.jp/docs/setup) を手始めにいろいろ試した。途中行き詰まってしまい ministaのGitHubレポジトリにissueを投げた。

-   [build したらエラ〜発生: ReferenceError: document is not defined
    \#146](https://github.com/qrac/minista/issues/146#event-30162718761)

このissueにキスパートが応えてくれて大いに学ぶところがあった。

ministaの公式ドキュメントには製品に関する詳細な情報が盛られている。しかし未経験者が読むべき初歩的な手引きが見当たらないと思った。そこでわたしの経験をネタに Getting Started with minista を書くことにした。

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

続けて `bun install` コマンドを実行し、外部パッケージを導入した。

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

`bun create minista` コマンドによって初期作成されたファイルの中身をみてみよう。

### `package.json` ファイル

    {
      "name": "minista-project",
      "private": true,
      "type": "module",
      "scripts": {
        "dev": "minista",
        "build": "minista build",
        "preview": "minista preview"
      },
      "devDependencies": {
        "@types/node": "^26.2.0",
        "@types/react": "^19.2.18",
        "@types/react-dom": "^19.2.4",
        "minista": "^4.0.10",
        "react": "^19.2.8",
        "react-dom": "^19.2.8",
        "typescript": "^7.0.2",
        "vite": "^8.2.1"
      }
    }

`"devDependencies"` プロパティにいくつかの外部パッケージが列挙されている。これらは `minista` パッケージとそれが依存しているパッケージ群だ。だからコマンドラインで下記の操作をした結果と同じだろう。

    $ cd $ROOT/minimal-minista-project
    $ bun add minista@latest

それから `"scripts"` プロパティに３つのコマンドが定義されている。

      "scripts": {
        "dev": "minista",
        "build": "minista build",
        "preview": "minista preview"
      },

これら３つのコマンドはministaで開発する上で繰り返し実行するものだ。詳しくみてみよう。

#### コマンド1 `bun run dev`

コマンドラインで `bun run dev` とやるとViteの開発用Webサーバが立ち上がる。

    $ cd $ROOT/minimal-minista-project
    $ bun run dev
    $ minista

      VITE v8.2.2  ready in 6013 ms

      ➜  Local:   http://localhost:5173/
      ➜  Network: use --host to expose
      ➜  press h + enter to show help

ブラウザで <http://localhost:5173/> を開くとこんな画面が応答される。

![001 minimal minista project](https://kazurayam.github.io/minista-getting-started-with/images/001_minimal-minista-project.png)

開発サーバーを停止するにはコマンドラインでCTRL+Cとやればよい。

#### コマンド2 `bun run build`

コマンドラインで `bun run dev` とやるとViteによるビルドが実行される。 ビルドによって `dist` ディレクトリが作られ、その中にWebサイトを構成するHTMLやCSSや画像ファイルが出力される。`dist` ディレクトリの中に作られたHTML＋CSS＋画像一式をApacheサーバのhtdocsディレクトリの下にFTPでアップロードすれば、高速で応答するWebサイトができるだろう。

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

`minimal-minista-project` の `dist` ディレクトリの中身を見てみよう。

    $ tree dist
    dist
    └── index.html

    1 directory, 1 file

minista が `src/index.tsx` から `dist/index.html` を生成した。これを見ればたしかに **static site generation** が行われたのがわかる。

#### コマンド３ `bun run preview`

コマンドラインで `bun run dev` とやるとViteの開発サーバが立ち上がる。すると `dist` ディレクトリの中に生成された静的HTML＋CSSのサイトが閲覧できる。

    $ minista preview
      ➜  Local:   http://localhost:4173/
      ➜  Network: use --host to expose
      ➜  press h + enter to show help

ブラウザで <http://localhost:4173/> をひらけば "Hello!" 画面が応答される。それは `bun run dev` コマンドによって閲覧可能になった "Hello!" 画面と見た目は同じだ。

`bun run dev` コマンドによって閲覧可能になった画面は `src/index.tsx` ファイルから生成された画面だ。その一方で `bun run preview` コマンドによって閲覧可能になった画面は `dist/index.html` によるものだ。 `src/index.jsx` と `dist/index.html` と、ふたつのファイルの中身は違うが、ブラウザに表示された画面の見た目は同じだ。

### `src/pages/index.tsx` ファイル

ブラウザで `http://localhost:5173/` を開いた時に表示される画面の元ネタがこの `.tsx` ファイルだ。JSX構文で書かれている。

    export default function () {
      return (
        <>
          <h1>Hello!</h1>
        </>
      )
    }

`.tsx` ファイルが一個だけとは、その名の通り必要最小限（minimal）なサンプルだ。ミニマルすぎてministaの使い方を習うのにあまり参考にならない。 *もう少し中身のあるサンプルをあとで紹介する。*

### `dist/index.html` ファイル

ministaは `src/index.tsx` を入力として `dist/index.html` ファイルを出力する。ministaによって生成されたhtmlファイルはminified形式で、改行も字下げも無い。参照の便宜のためここではエディタでprettyに直したHTMLを下記に示す。

    <!doctype html>
    <html lang="ja">

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>

    <body>
        <h1>Hello!</h1>
    </body>

    </html>

### `tsconfig.json` ファイル

    {
      "compilerOptions": {
        "target": "esnext",
        "module": "esnext",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "allowSyntheticDefaultImports": true,
        "skipLibCheck": true,
        "noErrorTruncation": true,
        "jsx": "react-jsx",
        "types": ["minista/client"]
      },
      "exclude": ["node_modules", "dist"]
    }

この中に

        "jsx": "react-jsx",

と書かれていることに注目。TypeScriptコンパイラがJSX構文を認識して処理するためにReactが実装したJSX処理系を使えと宣言している。

この宣言があるのでTypeScriptコンパイラは `src/pages/index.tsx` のなかの `<h1>Hello!</h1>` という1行を妥当なJSX構文として受け入れる。もしもこの宣言がないとTypeScriptコンパイラはJSX構文を受け入れず、 `<h1>Hello!</h1>` を構文エラーとしてはじくだろう。

### `vite.config.ts` ファイル

    import { defineConfig, pluginSsg } from "minista"

    export default defineConfig({
      plugins: [pluginSsg()],
    })

ここでministaが提供する `pluginSsg` プラグインを有効化すると宣言している。この宣言は重要だ。これが無いとあなたが `bun run build` コマンドを実行してもviteはministaによる **S**tatic **s**ite **g**enerationの処理を実行しないので `dist` 　ディレクトリの中に何も出力されないだろう。

ここで `pluginSsg` プラグインのドキュメントをぜひ一読してほしい。

-   [pluginSsgのドキュメント](https://minista.qranoko.jp/docs/plugins/ssg)

`pluginSsg` プラグインがどんな設定項目を受け入れるか、それぞれの項目にどういう値を与えるべきかを理解することが、ministaに入門するための最初の一歩です。

## my-minista-project

ministaの書き方を習うために少し中身のあるプロジェクトを作ろう。

1.  複数のページを持つサイトのサンプルを作ろう

2.  複数ページが共通のレイアウトに従うこととする

3.  レイアウトには `<head>` と `<nav>` と `<footer>` を持たせよう

4.  レイアウトを表現するコンポーネントを各々独立した `.jsx` ファイルにしよう

5.  CSSを組み込もう

6.  画像も入れよう

複数の `.jsx` ファイルと `.css` ファイルと `.jpeg` ファイルをどのようなファイル構造の中に配置するか、それに応じてministaのpluginをどのように設定するかが注目すべきポイントだ。

`$ROOT` の下に `my-minista-project` を作ろう。プロジェクトフォルダの名前はユニークにしなければならないが、その他の手順は `minimal-minista-project` と作るのと同じ。

    $ cd $ROOT
    $ bun create minista@latest my-minista-project -- --template minista.ts
    $ cd my-minista-project
    $ bun install

### 1. `src/index.jsx` を削除する

`bun create minista@latest` コマンドに `--template minista.ts` とテンプレートを指定したので `src/index.tsx` ファイルが生成された。このファイルを削除してください。`my-minista-project` のためにこのファイルは不要だから。

### 2. `vite.config.js` を書き換える

次に `vite.config.js` を次のように書きかえる。

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

３つのministaプラグインを使おうとしています。ドキュメントをそれぞれ一読してください。

-   [pluginSsgのドキュメント](https://minista.qranoko.jp/docs/plugins/ssg)

-   [pluginBundleのドキュメント](https://minista.qranoko.jp/docs/plugins/bundle)

-   [pluginBeautifyのドキュメント](https://minista.qranoko.jp/docs/plugins/beautify)

`pluginSsg` と `pluginBundle` はministaプロジェクトではおそらく必ず使うことになる重要プラグインです。

`pluginSsg` プラグインの設定を下記のように書きました。

      plugins: [
        pluginSsg({
          layout: "/src/layouts/index.{tsx,jsx}",
          src: ["/src/pages/**/*.{tsx,jsx,mdx,md}"],
          srcBases: ["/src/pages"],
        }),

実はこの設定はデフォルト値そのものです。だから

      plugins: [
        pluginSsg(),

と書いても同じことです。`my-minista-project` では設定を明示的にコードとして書きました。ドキュメントをいちいち参照して思い出すよりもコードとして読めるほうが初学者には楽だからです。

## minitaレポジトリのdocsプロジェクト

TODO

## 結び

Markdownで書ける。良いなあ。使おう。
