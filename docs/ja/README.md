ユエビン🥮
 ==========
 Yuebing は、ビデオ ホスティング サイトを実行するためのオープンソース ソフトウェアです。

 Yuebing は、最新の形式を使用してストリーミング用にソース ビデオを自動的に準備し、あらゆるデバイスで再生可能にします。
あらゆる接続上のデバイス。

 Yuebing は、バックエンド ストレージとして Amazon S3 または Backblaze B2 を使用でき、多くの高度な機能を備えています。

 ＃＃＃ ソース
* [GitHub 上の yuebing](https://github.com/cobbzilla/yuebing)
 * [npm の yuebing](https://www.npmjs.com/package/yuebing)
 * [DockerHub 上の yuebing](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # これを別の言語で読んでください
この README.md ドキュメントは、[hokeylization](https://github.com/cobbzilla/hokeylization) 経由で次のように翻訳されています。
たくさんの言語。

完璧ではないのは確かですが、何もしないよりはマシだと思います。

 [🇸🇦 アラビア語](../ar/README.md)
 [🇧🇩ベンガル語](../bn/README.md)
 [🇩🇪 ドイツ語](../de/README.md)
 [🇺🇸 英語](../en/README.md)
 [🇪🇸スペイン語](../es/README.md)
 [🇫🇷 フランス語](../fr/README.md)
 [🇹🇩ハウサ語](../ha/README.md)
 [🇮🇳 ヒンディー語](../hi/README.md)
 [🇮🇩 インドネシア語](../id/README.md)
 [🇮🇹 イタリア語](../it/README.md)
 [🇯🇵日本語](../ja/README.md)
 [🇰🇷韓国語](../ko/README.md)
 [🇮🇳マラーティー語](../mr/README.md)
 [🇵🇱ポーランド語](../pl/README.md)
 [🇧🇷ポルトガル語](../pt/README.md)
 [🇷🇺ロシア語](../ru/README.md)
 [🇰🇪 スワヒリ語](../sw/README.md)
 [🇵🇭タガログ語](../tl/README.md)
 [🇹🇷 トルコ語](../tr/README.md)
 [🇵🇰 ウルドゥー語](../ur/README.md)
 [🇻🇳ベトナム語](../vi/README.md)
 [🇨🇳中国語](../zh/README.md)
 ----

 ＃ コンテンツ
* [インスピレーション](#インスピレーション)
 * [特長](#特長)
 * [インストール](#インストール)
 * [ドッカー](#Docker)
 * [npm パッケージ](#npm-package)
 * [ソースから](#From-source)
 * [構成](#構成)
 * [nginx config](#nginx-config)
 * [なぜユエビンという名前ですか?](#なぜユエビンという名前ですか?)

 ＃＃ インスピレーション
昨年、母は膨大な時間とお金を費やして、古い家族のビデオのアーカイブを整理してデジタル化しました。
中には 1940 年代にまで遡るかなり古いものもありました。本当に美しくて古典的なもの。

私たちはこれらを家族と非公開で共有したかったのですが、*大手テクノロジーとは共有したくありません*。
大手プロバイダーの「無料」ビデオホスティングを利用することは検討の対象外でした。

私たちが探していたもの:
 * 自己ホスト型ですが、完全に**ハンズオフで簡単**に実行および保守できます
* アダプティブ ビットレートを含む最新のビデオ形式でのストリーミング
* ビデオはデスクトップまたはモバイルのどのデバイスでも再生できます
* 高帯域幅接続では、ビデオ品質は素晴らしいです。できるだけ良い
* **接続が悪い場合でも**、再生は適切な品質であり、*スキップやバッファリングはありません*
 * 暗号化されたストレージにより、パブリック クラウド ストレージ ソリューションをある程度安心して使用できます
* ステートレス サーバー: 復元力の高いストレージにとって重要なものはすべて永続化します。
 * **バックアップについて心配したくない!**
 * *これがあってよかったです。結局のところ、このようなものは何もありません。ユエビンはそうだよ!*
 * 頑丈なインスタンスを実行してすべてをトランスコードした後、それを破棄し、長期的にはより安価なインスタンスを実行します。
 * Yuebing は月額 10 ドル未満で実行できます。 Yuebing のフットプリントを最適化することで、今後はさらに減少することを願っています

私はそこにあるものを調査するのに数週間かかりました。要件を大幅に緩和し始めましたが、それでも
まともなものは何も見つかりませんでした。いくつかのオープンソース プロジェクトを検討しましたが、どのプロジェクトにも
複数の明らかな欠陥。

それで、私は決心しました、それはどれほど難しいでしょうか？ S3 を ffmpeg に接続し、そこに最新のフロントエンドを配置すれば完了です。
 ...まあ、作業の大部分は数か月かかりましたが、楽しすぎてやめられませんでした。
皆さんも楽しんでいただければ幸いです！

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**セルフホスティング ビデオ サイトを超簡単に作ってみましょう!**</a>

 ＃＃ 特徴
* S3 (または B2) バケツのビデオを友人や家族のためのプライベートビデオサイトに変換します。
 * 生のメディア ファイルを提供する 1 つ以上のソース バケットを接続します
* Yuebing は、ソース ビデオをアダプティブ ビットレート ストリーミング (DASH/mp4) 用に最新かつ最も広くサポートされている形式に自動的にトランスコードします。
 * すべてのデータは宛先バケットに保存されます。いつでもサーバーを破壊できます
* 最初のトランスコーディングのために CPU に最適化されたインスタンスで最初に実行し、その後 \ を実行する場合に役立ちます。
    on a much cheaper instance for 24/7/365 service.
 * 完全に暗号化されたストレージをサポート (アプリ側の暗号化、キーを持っているのはあなただけ)
 * ソースからは常に読み取り専用であり、ソースのコンテンツは決して変更しないでください
* 新しいメディア ファイルの自動および手動スキャン
* 物事をどの程度プライベートまたはパブリックにしたいですか? Yuebing は次のことをサポートしています。
 * 完全にプライベート: 匿名ユーザーにはメディアは表示されず、承認された電子メール アドレスのみがアカウントを作成できます。
 * セミプライベート: 匿名ユーザーにはメディアは表示されませんが、誰でもユーザー アカウントを作成できます
* 登録が限定された公開: メディアは全員に表示されますが、承認された電子メール アドレスのみがアカウントを作成できます
* 完全に公開: メディアは全員に表示され、誰でもユーザー アカウントを作成できます。
 * 完全に国際化されました!ユーザーに表示されるすべてのテキスト (およびその他のロケール固有のもの) はローカライズされたリソースから取得されます。
 * [コミュニティに協力して、Yuebing を新しい言語に翻訳してください!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * フル機能の管理コンソール
* キーワードまたはタグクラウドから動画を検索
* <a href="https://www.patreon.com/cobbzilla">**皆様のサポートにより近日公開**</a> :
 * より多くのメディアタイプ (オーディオ、画像など) のサポート
* ユーザーがアップロードしたメディア
* いいね、シェア、プッシュ通知
* 新しい「ソース タイプ」: 別の Yuebing インスタンス!
    * Federation between friendly instances: unified search, user accounts, etc

 ## 匿名ユーザー機能 (匿名の訪問者を許可するようにサイトが設定されている場合)
 * メディアの閲覧
*メディアを見てください！
 * アカウントの作成 (サイトがアカウント登録を許可するように設定されている場合)

 ## ログインユーザーの機能
* メディアの閲覧
*メディアを見てください！
 * コメントの追加、コメントの編集、コメントの削除!
 * 友達を招待
* アカウント情報を編集する
* アカウントを削除すると、すべてのコメントを含め、自分のものすべてが削除されます

## 管理者ユーザーの機能
* メディアメタデータの編集、サムネイルの表示、選択したサムネイルの変更
* メディア変換キューとジョブのステータスを表示
* ソースメディアの新しいスキャンとインデックスを開始します

## サーバー/バックエンド機能
* 一時的に使いやすく、永続的/重要なデータはコンテナ内に保存されません。
 * すべての耐久性のあるデータは宛先バケットに保存されます。基本的に、データベースとして S3 を使用します
* 新しいメディアのソース バケットの自動定期スキャン
* メディアメタデータを追加および変更します。編集内容は宛先バケットに保存され、ソースメディアは変更されません。
 * 設定可能な出力プロファイル。デフォルトは複数のサブプロファイルを持つ DASH-mp4 です
* ユーザーアカウント情報も宛先バケットに保存され、オプションで暗号化されます。
 * 暗号化キーが変更された場合、管理者は Web 管理コンソールを使用してユーザーを新しいキーに移行できます

## インストール
`yuebing` docker、npm 経由、またはソースから直接インストールして実行できます。

 ### ドッカー
docker をお持ちの場合は、Yuebing をすぐに使い始めることができます。

    docker run -it cobbzilla/yuebing

 ### npm パッケージ
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### ソースより
ソースから実行するには、nodejs v16+ と Yarn が必要です

    # Clone source and install dependencies
    git clone https://github.com/cobbzilla/yuebing.git
    cd yuebing
    yarn install

    # Use the 'yuebing' command from the git repo
    ./yuebing

    # Or, since you have the source, run any of the `yarn` scripts
    yarn docker-run-dev # Fastest build & startup, dev docker image
    yarn docker-run # Faster at runtime, production docker image
    yarn dev # Run yuebing locally in dev mode
    yarn build # Build yuebing locally for production mode
    yarn start # Start yuebing locally in production mode

詳細については、[開発者ドキュメント](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) を参照してください。

 ＃＃ 構成
Yuebing を試してみるには、何も設定せずに起動しても問題ありません。
 `yuebing`を実行すると、起動時に最小限の設定を入力するように求められます。

 Yuebing をしばらく実行する予定がある場合は、[設定ドキュメント](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) を参照してください。
設定方法の詳細については、こちらをご覧ください。

 ### nginx 設定
Yuebing は Nuxt アプリであり、nginx (またはその他の Web サーバー) を組み込むことを想定しています。
 SSL、必要に応じてレート制限などを処理するためにその前にあります。

 nginx を使用している場合は、[サンプル構成](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) を使用できます。

 ## なぜ yuebing という名前ですか?
 [ウーロンウサギ](https://en.wikipedia.org/wiki/Oolong_(ウサギ)) は愛らしくて有名なウサギでした
[初期のインターネット ミーム](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images)。ウーロン氏は2003年に亡くなったが、
某大人気動画サービスが存在する2年前！

ウーロンの後継者は岳氷という名前だった。岳氷はウーロンほど有名ではありませんでしたが、それは問題でしたか？
それでもユエビンは成功した。

おそらくもっと興味深いのは、yuebing が [月餅] を意味することです (https://en.wikipedia.org/wiki/Mooncake)
 (中国語: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC)、
日本語: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85));月餅はとてもおいしいです。
多種多様なフレーバーとスタイル。伝統的な地方スタイルを楽しんだり、現代的なエキゾチックなケーキを試してみたりしてください
おいしい未知の領域を探求するパン屋たち！本当に誰にとっても楽しいyuebingがあります！

</pre>
