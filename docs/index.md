- Table of contents
{:toc}

# スタティックサイトジェネレーター minista を試してみた

GitHubレポジトリ: <https://github.com/kazurayam/minista-getting-started-with/>

## はじめに

### 背景

わたしはWebプログラミングを中心にいろいろ学んで作って楽しんでいる。ある学術団体の事務職員をしていて、その団体のインターネットホームページの管理を任された。そのサイトは古き良きHTMLサイトで、数十のHTMLファイルとCSSファイルから構成されている。たくさんのHTMLの中に `<head>` と `<nav>` と `<footer>` があって、ほとんど同じコードが重複して存在している。数年前、外部のWebデザイナに発注して初期構築したらしい。受託したデザイナが何らかのオーサリングツールでソースを書き、ビルドした成果物がApacheサーバのhtdocsフォルダの下に配置されている。デザイナがどういうツールを使ったのかはわからない。デザイナから発注主へソースコードを納入するということはしなかったようだ。たぶん発注した人が「ソースって何？納品しなくていいよ。よくわからないから」といったんじゃないかと推測している。

わたしはこのサイトにWhat’s News的な記事を追加するためにエディタでHTMLを修正しているが、このやり方でメンテナンスを続けるのはキビしいなあと感じている。近い将来、誰かにサイトの管理役を引き継ぐことになるだろう。その時HTMLの山をホイと渡してあとは知らんぷりするのは気がとがめる。今どきのソフトウェア技術を導入してホームページのメンテナンス作業を楽にしたい、と思った。

サイトのページをJSXで作り直してみた。それはもちろんできる。JSXならコンポーネント化することができてコードの重複を排除できるのがうれしい。しかしこのサイトをReactによる Single Page Application に移行したいわけではない。そもそも閲覧オンリーなサイトだからReactの会話的ユーザーインタフェースは必要ない。レンタルサーバー上のApacheサーバに静的HTMLとCSSを配置しただけの現状の構成を捨ててNode.jsのサーバに移行すべき理由がない。SPAにしたら「ホームページの応答が遅くなった」といわれるかもしれないし。さてどうしようか…​と迷っているうちに [minista](https://minista.qranoko.jp/) を見つけた。

> minista（ミニスタ）は、ReactのJSXとViteで100%静的なサイトを作るスタティックサイトジェネレーターです。

これ、わたしのニーズにあっているかもしれないと思った。ministaのドキュメント [”Setup”](https://minista.qranoko.jp/docs/setup) を手始めにいろいろ試した。途中行き詰まったこともあった。ministaのGitHubレポジトリにissueを投げた。

-   [build したらエラ〜発生: ReferenceError: document is not defined
    \#146](https://github.com/qrac/minista/issues/146#event-30162718761)

このissueにキスパートが応えてくれた。おおいに学ぶところがあった。

ministaの公式ドキュメントに詳細情報が書かれている。しかし未経験者が迷わず読み通せる初歩的な手引きがないとわたしは思った。そこで自分の経験をネタに Getting Started with minista を書くことにした。

### 対象読者

-   TypeScriptでWebアプリを開発するスキルを持っている人

-   React JSXでページを書きたい、しかし最終的には静的HTMLサイトを作りたいと望んでいる人

-   ministaをまだ知らない人

### 記事を読むメリット

ReactのJSXとViteで100%静的なサイトを作るスタティックサイトジェネレーター [minista](https://minista.qranoko.jp/) に入門することができる。ある程度のボリュームのある実行可能なサンプルコードに触れることができる。

## わたしの作業環境

-   マシン: MacBook Air Intel, 2018

-   OS: macOS Sonoma 17.8.9

-   JavaScript Runtime: Bun 1.4.0

minitaの公式ドキュメントはJavaScriptランタイムとして [npm](https://bun.sh/) を使っているが、わたしは個人的な好みにより [bun](https://bun.sh/) を使った。わたしの見るかぎり問題なかった。

## minimal-minista-project プロジェクト

まず手元のPCに適当なフォルダを作った。そのフォルダのパスをシェル変数 `ROOT` で参照できるようにした。

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

`"devDependencies"` プロパティにいくつかの外部パッケージが列挙されている。`minista` パッケージが根っこで、ministaが依存しているパッケージ群を網羅している。つまりコマンドラインで下記の操作をした結果と同じだろう。

    $ cd $ROOT/minimal-minista-project
    $ bun add minista@latest

それから `"scripts"` プロパティに３つのコマンドが定義されている。

      "scripts": {
        "dev": "minista",
        "build": "minista build",
        "preview": "minista preview"
      },

これら３つのコマンドはministaで作業するなら繰り返し実行するものだ。詳しくみてみよう。

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

コマンドラインで `bun run dev` とやるとViteによるビルドが実行される。 ビルドによって `dist` フォルダが作られ、その中にWebサイトを構成するHTMLやCSSや画像ファイルが出力される。

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

`minimal-minista-project` の `dist` フォルダの中身を見てみよう。

    $ tree dist
    dist
    └── index.html

    1 directory, 1 file

minista が `src/index.tsx` を入力として受け取り、それ `dist/index.html` を生成した。たしかに **static site generation** が行われたのがわかる。

#### コマンド３ `bun run preview`

コマンドラインで `bun run dev` とやるとViteの開発サーバが立ち上がる。すると `dist` フォルダの中に生成された静的HTML＋CSSのサイトが閲覧できる。

    $ minista preview
      ➜  Local:   http://localhost:4173/
      ➜  Network: use --host to expose
      ➜  press h + enter to show help

ブラウザで <http://localhost:4173/> をひらけば "Hello!" 画面が応答される。それは `bun run dev` コマンドによって閲覧可能になった "Hello!" 画面と見た目は同じだ。

`bun run dev` コマンドによって閲覧可能になった画面は `src/index.tsx` ファイルから生成された画面だ。その一方で `bun run preview` コマンドによって閲覧可能になった画面は `dist/index.html` によるものだ。 `src/index.jsx` と `dist/index.html` と、ふたつのファイルの中身は全く違うが、ブラウザに表示された画面の見た目は同じだ。

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

特に目立つところはない。

### `vite.config.ts` ファイル

    import { defineConfig, pluginSsg } from "minista"

    export default defineConfig({
      plugins: [pluginSsg()],
    })

ここでministaが提供する `pluginSsg` プラグインを有効化してViteに組み込むことを宣言している。

この宣言は重要だ。これが無いとあなたが `bun run build` コマンドを実行してもviteはministaによる **S**tatic **s**ite **g**enerationの処理を実行しない。 `dist` フォルダの中に何も出力されないだろう。

ここで `pluginSsg` プラグインのドキュメントをぜひ一読してほしい。

-   [pluginSsgのドキュメント](https://minista.qranoko.jp/docs/plugins/ssg)

`pluginSsg` プラグインがどんな設定項目を受け入れるか、それぞれの項目にどういう値を与えるべきかを理解することが、ministaに入門するための最初の一歩です。

## my-minista-project　プロジェクト

ministaの使い方を習うために少し中身のあるプロジェクトを作ろう。次のような方針のもとに:

1.  １つきりではなく複数のページから成るサイトのサンプルを作ろう

2.  トップページのURLパスは `/` とする。このほかにサブフォルダを持つURLを作る。たとえば `/about/` のように。

3.  共通レイアウトを作り、すべてのページがそれに従うこととする

4.  レイアウトをHTML要素 `<head>` と `<nav>` と `<footer>` などで構成する

5.  レイアウト部品を各々独立した `.jsx` ファイルにする。一つのページを複数のコンポーネントを組み合わせることによって実装する。

6.  CSSでページのスタイルを定義する。`<head>` と `<nav>` と `<footer>` の背景色を塗り分けて見やすくするとか。

7.  コンテンツの一部として写真も表示しよう

最終的には `my-minista-project` プロジェクトは下記のような姿のWebページを応答します。

![002 my minista project](https://kazurayam.github.io/minista-getting-started-with/images/002_my-minista-project.png)

それでは `$ROOT` の下に `my-minista-project` を作ろう。手順は `minimal-minista-project` と作るのと同じ。ただしプロジェクトフォルダの名前をユニークなものにする点だけ気をつけて。

    $ cd $ROOT
    $ bun create minista@latest my-minista-project -- --template minista.ts
    $ cd my-minista-project
    $ bun install

下書きされた `my-minista-project` を書きかえていく。順を追って説明しよう。

### 1. `src/index.jsx` を削除する

`bun create minista@latest` コマンドに `--template minista.ts` と指定した。このテンプレートの定義に従って `src/index.tsx` ファイルが生成された。しかし `my-minista-project` でこのtsxファイルは不要だ。だから削除する。

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

`pluginSsg` と `pluginBundle` はどのministaプロジェクトも使うであろう基本的なプラグインです。

**`pluginSsg` プラグインのオプションの設定と `my-minista-project` プロジェクトの実際のフォルダ構成とを整合させること** がとても重要です。

もしも `pluginSsg` の設定と実際のフォルダ構成が食い違っていると `bun run build` コマンドを実行した時にministaによるstatic site generationの処理が空振りする。エラーメッセージが出力されるわけではない。期待したような成果物が `dist` フォルダに出力されないだけだ。あれえ？と首をかしげるだろう。

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

と書いても同じことです。`my-minista-project` で設定をコードに明示したのは、ブラウザでドキュメントを参照するよりもエディタでコードを読み返す方が楽だからです。

**ministaプロジェクトのフォルダ構成をどうすべきか？ministaの開発者のオススメを `pluginSsg` プラグインのデフォルト値から読み取ることができます。** minista開発者の考えを推し量りつつ わたしは `my-minista-project` のフォルダ構成を下記のようにしました。

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

なぜこのような構成にしたのか？以下に補足します。

#### `src` フォルダ

ソースとしてのJSXファイルとCSSファイル画像ファイルをすべて `my-minista-project/src` フォルダの下に格納することにします。あとで `bun run build` コマンドを実行した時に成果物が `my-minista-project/dist` フォルダに出力されるはず。入力元としての\`src\` と出力先 `dist` とふたつを対照的に配置するとわかりやすい。

#### `src/layouts` フォルダ

サイトのすべてのページが共通のレイアウトに従うように作るという設計方針にしたがい、レイアウトを規定するJSXファイル `my-minista-project/src/layouts/index.tsx` を作りました `pluginSsg` プラグインの `layout` オプションが `layout: "/src/layouts/index.{tsx,jsx}",` と設定されていることと整合が取れるようにしました。

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

`/src/layouts/header.tsx` を下記のように書きました。これはHTML要素 `<head>` を実装するコンポーネントです。

    export const MyHeader = () => {
        return (
            <header className="myheader">
                <h1>my-minista-project</h1>
            </header>
        )
    }

`header.jsx` ファイルを `/src/layouts/` フォルダの中に配置しました。その一方でレイアウトを実装するJSXが

`import { MyHeader } from "./header"`

とやってインポートしています。`header.jsx` が `my-minista-project/src/layouts/` ではなく別のフォルダにあっても本来は構わない。その場合 `import` 文の `from "fffff"` を適切に書けば解決できる。しかしレイアウトを構成する複数のJSXを１箇所に集めた方が見通しが良いと考えたので、 `header.jsx` を `src/layouts/` フォルダに配置した 。`nav` や `footer` についても同じ考えを適用した。

#### `layout` オプション

`vite.config.js` ファイルの `pluginSsg` プラグインの設定にこう書いた。

      plugins: [
        pluginSsg({
          layout: "/src/layouts/index.{tsx,jsx}",

`layout` とは何なのか？ [ドキュメント](https://minista.qranoko.jp/docs/plugins/ssg#layout) にこう書いてある。

> layout
> すべてのページテンプレートをラップするコンポーネントの場所を指定します。対象ファイルはViteの機能でglob importされ最初に見つかったファイルが使用されます。

`my-minista-project/src/layout/index.tsx` をどのように書いたか、もう一度引用すると下記の通り。

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

わたしはここに出現する `LayoutProps` とか `Head` とかをまだよくわかっていません。いくつかのサンプルコードからコピペして動かしてみたら動いちゃったまで。

#### `srcBases` オプション

`pluginSsg` プラグインの設定にこう書いた。

      plugins: [
        pluginSsg({
          ...
          srcBases: ["/src/pages"],

srcBasesについてドキュメントの [srcBases](https://minista.qranoko.jp/docs/plugins/ssg#srcbases) にこう書いてある。

> srcBase
> ページテンプレートをURLに変換する際に省くパス。前方一致で削除されます。

もしこの設定が無ければ ファイルパス `my-minista-project/src/pages/about/index.tsx` は URL `http://locahost:xxxx/src/pages/about/` に対応づけられるでしょう。しかしこのURLは醜い。 `srcBase` オプションを指定することによりファイルパス `my-minista-project/src/pages/about/index.tsx` が `http://locahost:xxxx/about/` というURLに対応づけられます。

#### `src/pages/` フォルダ

ページを実装するJSXファイルを `my-minista-project/src/pages/` フォルダの中に格納しました。Webサイトが起動した時に `my-minista-project/src/pages/index.tsx` ファイルがURL `http://localhost:xxxx/` に対応します。

`my-minista-project/src/pages/about/index.tsx` ファイルがURL `http://localhost:xxxx/about/` に対応します。このように `pages` フォルダの下のファイルの相対パスがURLのサブパスと一対一に対応します。

#### `src/assets/` フォルダ

`vite.config.ts` ファイルの中に `pluginBundle` の設定が書いてあります。

        pluginBundle({
          src: ["/src/layouts/index.{tsx,jsx}", "/src/pages/**/*.{tsx,jsx,mdx}"],
          outName: "bundle",
          useExportCss: true,
        }),

を参照のこと。実はこの設定は [pluginBundleのドキュメントのOptions](https://minista.qranoko.jp/docs/plugins/bundle#options) に示されたデフォルト値と同じです。だから

      plugins: [
        pluginBundle(),

と書いても同じことです。

`pluginBundle` の `src` オプションが何を意味するかというと

> CSS・画像を検出するテンプレートをglob形式で指定します。対象ファイルはViteの機能でglob importされます。

とのこと。例えば `/src/pages/index.tsx` には下記のようなimport文が書いてあります。

    import "../assets/css/index.css"
    import heroImg from "../assets/images/seagull.jpg"

これに整合するように、`my-minista-project/src/assets/css` フォルダを作ってその中に `index.css` ファイルを格納しました。同じように `my-minista-project/src/assets/images` フォルダを作って画像ファイルを格納しました。こんなふうに:

    $ cd $ROOT/my-minista-project
    $ tree src/assets
    src/assets
    ├── css
    │   └── index.css
    └── images
        ├── 20210515111349_p.jpg
        ├── 4467417.jpeg
        └── seagull.jpg

#### `my-minista-project` のソース

GitHubにレポジトリを作ってソースを公開しました。

-   <https://github.com/kazurayam/minista-getting-started-with//tree/master/my-minista-project>

個々のJSXやCSSのソースについてはGitHubレポジトリを参照してください。素朴なコードなので説明を省略します。

#### buildするとこうなる

    $ cd $ROOT/my-minista-project
    $ bun run build

    $ minista build
    vite v8.2.2 building ssr environment for production...
    ✓ 11 modules transformed.
    computing gzip size...
    node_modules/.minista/ssr/__minista-ssg.mjs  9.62 kB │ gzip: 5.22 kB

    ✓ built in 151ms
    vite v8.2.2 building client environment for production...
    ✓ 19 modules transformed.
    computing gzip size...
    dist/index.html                    1.71 kB │ gzip: 0.82 kB
    dist/about/index.html              6.15 kB │ gzip: 4.20 kB
    dist/assets/seagull-DMex-28w.jpg  30.04 kB
    dist/assets/bundle-PBukV8x2.css    0.65 kB │ gzip: 0.29 kB

    ✓ built in 121ms

`dist` フォルダに静的サイトを構成するファイル一式が生成されました。

    $ cd $ROOT/my-minimal-project
    $ tree -I 'node_modules' .
    .
    ├── bun.lock
    ├── dist
    │   ├── about
    │   │   └── index.html
    │   ├── assets
    │   │   ├── bundle-PBukV8x2.css
    │   │   └── seagull-DMex-28w.jpg
    │   └── index.html
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

`src` フォルダと `dist` フォルダを見比べると、ministaが `bun run build` の時にどんな処理をするのかを推察することができます。

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr class="header">
<th style="text-align: left;"><code>src</code> フォルダのファイル</th>
<th style="text-align: left;"><code>dist</code> フォルダ</th>
<th style="text-align: left;">補足</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p><code>src/pages/index.tsx</code> →</p></td>
<td style="text-align: left;"><p><code>dist/index.html</code></p></td>
<td style="text-align: left;"><p><code>http://localhost:4173/</code> に対応する</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><code>src/pages/about/index.tsx</code> →</p></td>
<td style="text-align: left;"><p><code>dist/about/index.html</code></p></td>
<td style="text-align: left;"><p><code>http://localhost:4173/about/</code> に対応する</p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><code>src/layouts/*.tsx</code> →</p></td>
<td style="text-align: left;"><p>なし</p></td>
<td style="text-align: left;"><p>コンポーネントは結合されて *.html ファイルの一部になる</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><code>src/assets/css/index.css</code> →</p></td>
<td style="text-align: left;"><p><code>dist/assets/bundle-PBukV8x2.css</code></p></td>
<td style="text-align: left;"><p>ページのJSXが参照しているCSSファイル（複数可）の内容をマージして１つのCSSファイルにする</p></td>
</tr>
<tr class="odd">
<td style="text-align: left;"><p><code>src/assets/images/seagull.jpg</code> →</p></td>
<td style="text-align: left;"><p><code>dist/assets/images/seagull-DMex-28w.jpg</code></p></td>
<td style="text-align: left;"><p>そのままコピーした?何か最適化したか?</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p><code>src/assets/images/20210515111349_p.jpg</code> →</p></td>
<td style="text-align: left;"><p>なし</p></td>
<td style="text-align: left;"><p>srcに存在する画像でHTMLが参照していない画像は無視される。 <code>dist</code> に出力されない</p></td>
</tr>
</tbody>
</table>

`dist` フォルダの中に生成された静的Webサイトを閲覧するには今まで通り `build run preview` コマンドを実行すればいい。サーバーが立ち上がったらブラウザで `http://localhost:4173` を開け。こんな画面が表示される。

![003 my minista project about](https://kazurayam.github.io/minista-getting-started-with/images/003_my-minista-project-about.png)

わたしもministaに入門することができたと思う。

## minista本家の `docs` プロジェクト

ministaのGitHubレポジトリに `docs` フォルダがある。

-   <https://github.com/qrac/minista/tree/main/docs>

このフォルダは minista を使って静的Webサイトを生成する充実したサンプルになっている。どういうWebサイトが生成されるのかというと以下のURLだ。

-   <https://minista.qranoko.jp/docs/>

つまりministaの公式ドキュメントのサイトそれ自体がministaを使って構築されているわけだ。

公式ドキュメントを見ればministaがたくさんの機能（プラグイン）を提供することがわかる。実際に動くサンプルを見たいなあ…​ そう思ったら [misista/docs](https://github.com/qrac/minista/tree/main/docs) フォルダを掘ってみると良い。宝物がゴロゴロ転がっている予感がします。

たとえば

-   <https://github.com/qrac/minista/tree/main/docs/src/pages/docs/plugins>

を見てみよう。ministaのプラグインに関するドキュメントのソースコード群だ。

![004 docs plugins ssg](https://kazurayam.github.io/minista-getting-started-with/images/004_docs_plugins_ssg.png)

`pluginSsg` プラグインのドキュメントがこれ。

-   <https://github.com/qrac/minista/blob/main/docs/src/pages/docs/plugins/ssg.mdx>

あれ？ファイル名の拡張子が `.mdx` という見慣れない文字になっている。これをよく見るとMarkdown構文のテキストでした。ministaの公式ドキュメントのほとんどはMarkdown構文で書かれていました。

## 結び

わたしはministaを使って静的HTMLサイトを作ることに成功した。わたしがいま担当しているHTMLオンリーなWebサイトをJSXで書き直すのにministaがきっと役立つ。JSXの利点を享受しつつも、無理にSingle Page Applicationに移行する愚を避けて、Apacheサーバのhtdocsフォルダ下に静的HTML+CSSを置くだけの現状のシステム構成を継承することができる。さらに [`pluginMdx`](https://minista.qranoko.jp/docs/plugins/mdx) を導入すれば、What\`s NewsページのコンテンツをMarkdown構文のテキストで書けるようになる。某学術団体インターネット・ホームページのメンテナンスは数段やさしくなるに違いない。これからもっとministaを深掘りしていきます。
