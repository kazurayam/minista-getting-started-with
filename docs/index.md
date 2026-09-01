- Table of contents
{:toc}

# スタティックサイトジェネレーター minista を試してみた

## 背景

わたしはWebプログラミングを中心にいろいろ学んで作って楽しんでいる。ある学術団体の事務職員をしていて、その団体のインターネットホームページの管理を任された。そのサイトは古き良きHTMLサイトで、数十のHTMLファイルとCSSファイルから構成されている。たくさんのHTMLの中に `<head>` と `<nav>` と `<footer>` があって、ほとんど同じコードが重複して存在している。数年前、外部のWebデザイナに発注して初期構築したらしい。受託したデザイナが何らかのオーサリングツールでソースを書き、ビルドした成果物がApacheサーバのhtdocsディレクトリの下に配置されている。デザイナがどういうツールを使ったのかはわからない。デザイナから発注主へソースコードを納入するということはしなかったようだ。たぶん発注した人が「ソースって何？納品しなくていいよ。よくわからないから」といったんじゃないかと推測している。

わたしは今でも必要に応じてこのサイトにWhat’s News的な記事を追加するべくエディタでHTMLを修正している。このやり方でメンテナンスを続けるのは厳しいなあと感じている。近い将来、誰かにサイトの管理役を引き継ぐことになるだろう。その時HTMLの山をホイと渡してあとは知らんぷりするのは気がとがめる。今どきのソフトウェア技術を導入してホームページのメンテナンス作業を楽にしたい、と思った。

いくつかのページをJSXで作り直してみた。それはもちろんできる。JSXを導入すればコードをコンポーネント化することができてコードの重複を排除できるのがうれしい。しかしこのサイトをReactによる Single Page Application に移行したいわけではない。閲覧オンリーなサイトだからReactの会話的ユーザーインタフェースは必要ない。レンタルサーバー上のApacheサーバに静的HTMLとCSSを配置しただけの現状の構成を変えてNode.jsのサーバに移行すべき理由がない。SPAにしたら「ホームページの応答が遅くなった」といわれるかもしれないし。さてどうしようか…​と迷っているうちに [minista](https://minista.qranoko.jp/) を見つけた。

> minista（ミニスタ）は、ReactのJSXとViteで100%静的なサイトを作るスタティックサイトジェネレーターです。

これ、わたしのニーズにあっているかもしれないと思った。ministaのドキュメント [”Setup”](https://minista.qranoko.jp/docs/setup) を手始めにいろいろ試した。途中行き詰まったこともある。ministaのGitHubレポジトリにissueを投げた。

-   [build したらエラ〜発生: ReferenceError: document is not defined
    \#146](https://github.com/qrac/minista/issues/146#event-30162718761)

このissueにキスパートが応えてくれて大いに学ぶところがあった。

ministaの公式ドキュメントには製品に関する詳細な情報が盛られている。しかし未経験者が読むべき初歩的な手引きが見当たらないと思った。そこでわたしの経験をネタに Getting Started with minista を書くことにした。

## 作業環境

-   マシン: MacBook Air Intel, 2018

-   OS: macOS Sonoma 17.8.9

-   JavaScript Runtime: Bun 1.4.0

minitaの公式ドキュメントはJavaScriptランタイムとして [npm](https://bun.sh/) を使っている。わたしは個人的な好みにより [bun](https://bun.sh/) を使った。わたしの見る限り問題ない。

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

`"devDependencies"` プロパティにいくつかの外部パッケージが列挙されている。`minista` パッケージが根っこで、ministaが依存してい他のパッケージ群を網羅している。つまりコマンドラインで下記の操作をした結果と同じだろう。

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

ministaの書き方を習うために少し中身のあるプロジェクトを作ろう。次のような方針のもとに:

1.  １つきりではなく複数のページから成るサイトのサンプルを作ろう

2.  トップページのURLパスは `/` とする。このほかにサブディレクトリを持つURLを作る。たとえば `/about/` のように。

3.  共通のレイアウトを作り、すべてのページがそれに従うこととする

4.  レイアウトを `<head>` と `<nav>` と `<footer>` で構成する

5.  レイアウトを表現するコンポーネントを各々独立した `.jsx` ファイルにする。一つのページを複数のコンポーネントの組み合わせで実現する。

6.  CSSでページのスタイルを定義する。`<head>` と `<nav>` と `<footer>` の背景色を塗り分けて見やすくしよう。

7.  コンテンツの一部として写真も表示しよう

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

**`pluginSsg` プラグインのオプションの設定と `my-minista-project` プロジェクトの実際のフォルダ構成とが整合性が取れていること** が重要だ。もしも `pluginSsg` の設定と実際のフォルダ構成が食い違っていると `bun run build` コマンドを実行した時にstatic site generationの処理が空振りするので、`dist` ディレクトリの中に期待したような成果物が作られないだろう。

`my-minista-project` プロジェクトにおいてわたしは `pluginSsg` プラグインの設定を下記のように書きました。

      plugins: [
        pluginSsg({
          layout: "/src/layouts/index.{tsx,jsx}",
          src: ["/src/pages/**/*.{tsx,jsx,mdx,md}"],
          srcBases: ["/src/pages"],
        }),

実はこの設定は [plusginSsg - 公式ドキュメント](https://minista.qranoko.jp/docs/plugins/ssg#options) に示されたデフォルト値と同じです。だから

      plugins: [
        pluginSsg(),

と書いても同じことです。`my-minista-project` では設定を明示的に書いたのは、ドキュメントをいちいち参照するよりもコードを読み返す方が楽だからです。

さて、plusginSsgの設定を上記のように決定したので、それに呼応してフォルダ構成がどうあるべきかが決まり、JSXファイルとCSSファイルと画像ファイルをどこに配置するかが決まります。

`pluginSsg` のオプションのデフォルト値がminista開発者の意見を反映していることは当然でしょう。

わたしは `my-minista-project` のフォルダ構成を下記のようにしました。

    $ tree -I 'node_modules|dist' my-minista-project
    my-minista-project
    ├── bun.lock
    ├── package.json
    ├── src
    │   ├── assets
    │   │   ├── css
    │   │   │   └── index.css
    │   │   └── images
    │   │       ├── 20210515111349_p.jpg
    │   │       ├── 4467417.jpeg
    │   │       └── seagull.jpg
    │   ├── layouts
    │   │   ├── footer.tsx
    │   │   ├── header.tsx
    │   │   ├── index.tsx
    │   │   └── nav.tsx
    │   └── pages
    │       ├── about
    │       │   └── index.tsx
    │       └── index.tsx
    ├── tsconfig.json
    └── vite.config.js

なぜこのようなフォルダ構成にしたのか？理由を説明します。

#### `src` ディレクトリ

ソースとしてのJSXファイルとCSSファイル画像ファイルをすべて `my-minista-project/src` ディレクトリの下に格納することにします。あとで `bun run build` コマンドを実行した時に成果物が `my-minista-project/dist` ディレクトリに出力されるはず。入力元としての\`src\` と出力先 `dist` というふうに二つを対照的に配置するのが見やすくて良い。

#### `src/layouts`

サイトのすべてのページが共通のレイアウトに従うように作るという設計方針にしたがい、レイアウトを規定するJSXファイル `my-minista-project/src/layouts/index.tsx` を作りました\`pluginSsg\` プラグインの `` layout ` オプションが `layout: "/src/layouts/index.{tsx,jsx}", `` と設定されていることと整合が取れていなければなりません。

`my-minista-project/src/layouts/index.tsx` のコードを下記のように書きました。

    import type { LayoutProps } from "minista/types"
    import { Head } from "minista/head"

    import { MyHeader } from "./header"
    import { MyNav } from "./nav"
    import { MyFooter} from "./footer"

    export default function (props: LayoutProps) {
      return (
        <>
          <Head htmlAttributes={{ lang: "en" }}>
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <title>my-minista-project</title>
          </Head>
          <MyHeader />
          <MyNav />
          <main className="myMain">
            {props.children}
          </main>
          <MyFooter />
        </>
      )
    }

HTML要素 `<head>` を実装するJSXファイルを下記のように書きました。

    export const MyHeader = () => {
        return (
            <header className="myheader">
                <h1>my-minista-project</h1>
            </header>
        )
    }

`header.jsx` ファイルを `/src/layouts/` ディレクトリの中に配置しました。その一方でレイアウトを実装するJSXが

`import { MyHeader } from "./header"`

とやってインポートしています。`header.jsx` が `my-minista-project/src/layouts/` ではない別の場所にあっても本来は構わない。`import` 文の `from "fffff"` を適切に書けば解決できる。しかしレイアウトを構成する複数のJSXを１箇所に集めた方が見通しが良い。そこで `header.jsx` を `src/layouts/` ディレクトリに配置した 。`nav` や `footer` についても同じ考えを適用した。

#### `src/pages/`

ページを実装するJSXファイルを `my-minista-project/src/pages/` ディレクトリの中に格納しました。Webサイトが起動した時に `my-minista-project/src/pages/index.tsx` ファイルがURL `http://localhost:xxxx/` に対応します。

`my-minista-project/src/pages/about/index.tsx` ファイルがURL `http://localhost:xxxx/about/` に対応します。このように `pages` ディレクトリの下のファイルの相対パスがURLのサブパスと一対一に対応します。

#### `srcBases`

`pluginSsg` プラグインの設定をこう書いた。

    srcBases: ["/src/pages"],

ドキュメントの [srcBases](https://minista.qranoko.jp/docs/plugins/ssg#srcbases) にこう書いてある。

> ページテンプレートをURLに変換する際に省くパス。前方一致で削除されます。
>
> — 
> text

この設定があるので、ファイルパス `my-minista-project/src/pages/about/index.tsx` の中の `/src/pages` が省かれて `locahost:pppp/about/` というURLに対応づけられる、というルールが適用されます。

#### `src/assets/`

CSSファイルと画像ファイルを `my-minista-project/src/assets/` の中に格納しました。

## minitaレポジトリのdocsプロジェクト

TODO

## 結び

Markdownで書ける。良いなあ。使おう。
