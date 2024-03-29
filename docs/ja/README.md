ゆえびん🥮
 ==========
 Yuebing は、ビデオ ホスティング サイトを運営するためのオープンソース ソフトウェアです。

 Yuebing は、最新のフォーマットを使用して、ストリーミング用にソース ビデオを自動的に準備します。
任意の接続を介してデバイス。

 Yuebing は、バックエンド ストレージに Amazon S3 または Backblaze B2 を使用でき、多くの高度な機能を備えています。

 ＃＃＃ ソース
* [GitHub の yuebing](https://github.com/cobbzilla/yuebing)
 * [npmでのyuebing](https://www.npmjs.com/package/yuebing)
 * [DockerHub の yuebing](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # これを別の言語で読む
この README.md ドキュメントは、[hokeylization](https://github.com/cobbzilla/hokeylization) によって翻訳されています。
たくさんの言語。

完璧ではないことは確かですが、何もないよりはましだと思います!

 [🇸🇦 アラビア語](../ar/README.md)
 [🇧🇩ベンガル語](../bn/README.md)
 [🇩🇪 ドイツ語](../de/README.md)
 [🇺🇸 英語](../en/README.md)
 [🇪🇸 スペイン語](../es/README.md)
 [🇫🇷フランス語](../fr/README.md)
 [🇹🇩ハウサ](../ha/README.md)
 [🇮🇳 ヒンディー語](../hi/README.md)
 [🇮🇩 インドネシア語](../id/README.md)
 [🇮🇹 イタリア語](../it/README.md)
 [🇯🇵 日本語](../ja/README.md)
 [🇰🇷韓国語](../ko/README.md)
 [🇮🇳 マランティ](../mr/README.md)
 [🇵🇱 ポーランド語](../pl/README.md)
 [🇧🇷 ポルトガル語](../pt/README.md)
 [🇷🇺 ロシア語](../ru/README.md)
 [🇰🇪 スワヒリ語](../sw/README.md)
 [🇵🇭 タガログ語](../tl/README.md)
 [🇹🇷トルコ語](../tr/README.md)
 [🇵🇰 ウルドゥー語](../ur/README.md)
 [🇻🇳 ベトナム語](../vi/README.md)
 [🇨🇳 中国語](../zh/README.md)
 ----

 ＃ コンテンツ
* [ひらめき](#ひらめき)
 * [機能](#機能)
 * [インストール](#インストール)
 * [ドッカー](#ドッカー)
 * [npm パッケージ](#npm パッケージ)
 * [ソースから](#ソースから)
 * [構成](#構成)
 * [nginx 構成](#nginx-config)
 * [Why the name yuebing?](#Why-the-name-yuebing?)

 ＃＃ インスピレーション
昨年、私の母は、古い家族のビデオのアーカイブを整理してデジタル化するために、膨大な時間 (そしてお金も!) を費やしました。
これらのいくつかはかなり古く、1940 年代にさかのぼります。本当に美しい、古典的なもの。

これらを個人的に家族と共有したかったのですが、*大きな技術者とは共有しませんでした*。
大手プロバイダーの「無料」ビデオ ホスティングを利用することは、検討の余地がありませんでした。

私たちが探していたもの：
 * 自己ホスト型ですが、実行と保守は完全に **手を使わずに簡単**
 * アダプティブ ビットレートを含む最新のビデオ フォーマットでストリーミング
* ビデオは、デスクトップまたはモバイルのあらゆるデバイスで再生できます
* 高帯域幅の接続により、ビデオの品質は最高です。それが得られるほど良い
* **接続が悪い場合でも**、再生はまともな品質で、*スキップやバッファリングはありません*
 * 暗号化されたストレージにより、ある程度の自信を持ってパブリック クラウド ストレージ ソリューションを使用できます
* ステートレス サーバー: 回復力の高いストレージに重要なものを永続化します
* **バックアップについて心配したくない!**
 * *これがあってよかった。結局のところ、このようなものは何もありません。 Yuebing です!*
 * 強力なインスタンスを実行してすべてをトランスコードした後、それを破棄して、長期的にはより安価なものを実行します
* 月額 $10 未満で Yuebing を実行できます。 Yuebing のフットプリントを最適化することで、将来的にはさらに少なくなることを願っています

そこにあるものを調査するのに数週間かかりました。私は自分の要件を大幅に緩和し始めましたが、それでもなお
まともなものは何も見つかりませんでした。私はいくつかのオープンソース プロジェクトを見てきました。
複数の明らかな欠陥。

それで、私は決めました、それはどれほど難しいでしょうか？ S3 を ffmpeg に接続し、そこに最新のフロントエンドを配置すれば完了ですよね?
 ...まあ、ええと、作業の大部分は数か月かかりましたが、楽しすぎてやめられませんでした!
あなたもそれを楽しんでください！

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**セルフホスティング動画サイトを超簡単にしましょう!**</a>

 ＃＃ 特徴
* ビデオの S3 (または B2) バケットを、友人や家族のためのプライベート ビデオ サイトに変換します!
 * 生のメディア ファイルを提供する 1 つ以上のソース バケットを接続します
* Yuebing は、ソース ビデオを最新かつ最も広くサポートされているアダプティブ ビットレート ストリーミング用の形式 (DASH/mp4) に自動的にトランスコードします。
 * すべてのデータが宛先バケットに保存されます。いつでもサーバーを破壊できます
* 最初のトランスコーディングのために CPU 最適化インスタンスで最初に実行し、\
    on a much cheaper instance for 24/7/365 service.
 * 完全に暗号化されたストレージをサポート (アプリ側の暗号化、あなただけがキーを持っています)
 * ソースから常に読み取り専用で、ソース コンテンツを変更しない
* 新しいメディア ファイルの自動および手動スキャン
* どれくらい私的または公的なものを望んでいますか? Yuebing のサポート:
 * 完全に非公開: 匿名ユーザーにはメディアが表示されず、承認された電子メール アドレスのみがアカウントを作成できます
* セミプライベート: 匿名ユーザーにはメディアは表示されませんが、誰でもユーザー アカウントを作成できます
* 限定登録で一般公開: メディアは全員に表示されますが、承認された電子メール アドレスのみがアカウントを作成できます
* 完全公開: メディアは全員に公開され、誰でもユーザー アカウントを作成できます
*完全に国際化！ユーザーに表示されるすべてのテキスト (およびその他のロケール固有のもの) は、ローカライズされたリソースから取得されます
* [コミュニティを支援し、Yuebing を新しい言語に翻訳してください!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * フル機能の管理コンソール
* キーワードまたはタグ クラウドから動画を検索
* <a href="https://www.patreon.com/cobbzilla">**皆様のご支援により近日公開**</a> :
 * より多くのメディア タイプ (オーディオ、画像など) のサポート
* ユーザーがアップロードしたメディア
* いいね、シェア、プッシュ通知
* 新しい「ソース タイプ」: 別の Yuebing インスタンス!
    * Federation between friendly instances: unified search, user accounts, etc

 ## 匿名ユーザー機能 (サイトが匿名の訪問者を許可するように構成されている場合)
 *メディアを閲覧する
*メディアを見る！
 * アカウントの作成 (サイトがアカウント登録を許可するように構成されている場合)

 ## ログインユーザー機能
*メディアを閲覧する
*メディアを見る！
 * コメントを追加、コメントを編集、コメントを削除!
 * 友達を招待
* アカウント情報を編集
* アカウントを削除し、すべてのコメントを含むあなたのものをすべて削除します

## 管理者ユーザーの機能
* メディア メタデータの編集、サムネイルの表示、選択したサムネイルの変更
* メディア変換キューとジョブ ステータスを表示する
* ソースメディアの新しいスキャンとインデックスを開始

## サーバー/バックエンド機能
* 一時的であり、ゼロの永続的/重要なデータはコンテナー内に保存されます。
 * すべての耐久性のあるデータは宛先バケットに保持されます。基本的に、S3をデータベースとして使用します
* 新しいメディアのソース バケットの自動定期スキャン
* メディア メタデータの追加と変更。編集内容は宛先バケットに保存され、ソース メディアは変更されません
* 構成可能な出力プロファイル。デフォルトは、複数のサブプロファイルを持つ DASH-mp4 です
* ユーザー アカウント情報も宛先バケットに保存され、オプションで暗号化されます
* 暗号化キーが変更された場合、管理者は Web 管理コンソールを使用してユーザーを新しいキーに移行できます

## インストール
docker、npm、またはソースから直接`yuebing`をインストールして実行できます。

 ### ドッカー
docker があれば、Yuebing をすぐに使い始めることができます。

    docker run -it cobbzilla/yuebing

 ### npm パッケージ
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### ソースから
ソースから実行するには、nodejs v16+ と yarn が必要です

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

詳細については、[開発者ドキュメント](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md)を参照してください

＃＃ 構成
Yuebing をいじるには、何も設定せずに起動しても問題ありません。
 `yuebing`を実行すると、起動時に最小限の構成を入力するよう求められます。

しばらく Yuebing を実行する予定がある場合は、[構成ドキュメント](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) を参照してください。
設定方法の詳細。

 ### nginxの設定
Yuebing は Nuxt アプリであり、nginx (または他の Web サーバー) を配置することを期待しています。
 SSL、必要に応じてレート制限などを処理するためにその前に。

 nginx を使用している場合は、[サンプル構成](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) を使用できます。

 ## なぜユエビンという名前なのですか?
 【うさぎのウーロン】(https://en.wikipedia.org/wiki/Oolong_(うさぎ))はかわいくて有名な
[初期のインターネットミーム](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images).ウーロンは2003年に亡くなり、
某大人気動画サービスが存在する2年前！

ウーロンの後継者はユエビンと名付けられました。 Yuebing はウーロンほど有名ではありませんでしたが、それは問題でしたか?
それにもかかわらず、Yuebing は成功しました。

おそらくもっと興味深いことに、yuebing は [月餅](https://en.wikipedia.org/wiki/Mooncake) を意味します。
 (中国語: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
日本語: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85));月餅はとても美味しく、
多種多様な味とスタイル。昔ながらの地域のスタイルを楽しんだり、現代のエキゾチックなケーキを試してみてください
未知の領域をおいしく開拓しているパン職人たち！本当にみんなのためのyuebingがあります！

</pre>
