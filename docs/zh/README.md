月饼🥮
 ==========
 Yuebing 是用于运行视频托管网站的开源软件。

 Yuebing 自动准备您的源视频以使用现代格式进行流式传输，可在任何设备上播放
通过任何连接的设备。

阅兵可以使用 Amazon S3 或 Backblaze B2 作为后端存储，并具有许多高级功能。

 ＃＃＃ 来源
* [GitHub 上的月饼](https://github.com/cobbzilla/yuebing)
 * [npm 上的月饼](https://www.npmjs.com/package/yuebing)
 * [DockerHub 上的月饼](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # 用另一种语言阅读
此 README.md 文档已通过 [hokeylization](https://github.com/cobbzilla/hokeylization) 翻译成
许多语言。

我敢肯定它并不完美，但我希望它总比没有好！

 [🇸🇦 阿拉伯语](../ar/README.md)
 [🇧🇩 孟加拉语](../bn/README.md)
 [🇩🇪 德语](../de/README.md)
 [🇺🇸 英文](../zh/README.md)
 [🇪🇸 西班牙语](../es/README.md)
 [🇫🇷法语](../fr/README.md)
 [🇹🇩 豪萨语](../ha/README.md)
 [🇮🇳 印地语](../hi/README.md)
 [🇮🇩 印尼文](../id/README.md)
 [🇮🇹 意大利语](../it/README.md)
 [🇯🇵 日语](../ja/README.md)
 [🇰🇷韩文](../ko/README.md)
 [🇮🇳 马拉地语](../mr/README.md)
 [🇵🇱 波兰语](../pl/README.md)
 [🇧🇷 葡萄牙语](../pt/README.md)
 [🇷🇺 俄语](../ru/README.md)
 [🇰🇪 斯瓦希里语](../sw/README.md)
 [🇵🇭他加禄语](../tl/README.md)
 [🇹🇷 土耳其语](../tr/README.md)
 [🇵🇰 乌尔都语](../ur/README.md)
 [🇻🇳越南语](../vi/README.md)
 [🇨🇳中文](../zh/README.md)
 ----

 ＃ 内容
* [灵感](#Inspiration)
 * [功能](#Features)
 * [安装](#安装)
 * [码头工人]（#码头工人）
 * [npm 包](#npm-包)
 * [来源](#From-source)
 * [配置](#配置)
 * [nginx 配置](#nginx-config)
 * [为什么叫月饼？](#Why-the-name-yuebing?)

 ＃＃ 灵感
去年，我妈妈花了很多时间（和金钱！）来整理和数字化旧家庭视频档案。
其中一些非常古老，可以追溯到 1940 年代。真的很漂亮，经典的东西。

我们想与家人私下分享这些内容，但*不想与大型科技公司*。
使用来自主要提供商的“免费”视频托管是不可能的。

我们在寻找什么：
 * 自托管，但完全**易于**运行和维护
* 现代视频格式流，包括自适应比特率
* 视频可在任何设备、桌面或移动设备上播放
* 通过高带宽连接，视频质量非常棒；要多好能有多好
* **即使连接不好**，播放质量也不错，*不会跳过或缓冲*
 * 加密存储，可放心使用公有云存储方案
* 无状态服务器：持久保存任何对具有高弹性的存储重要的东西
* **我不想担心备份！**
 * *这是一个很好的拥有。事实证明，没有任何东西是这样的。月饼有！*
 * 在运行一个强大的实例对所有内容进行转码后，将其拆除并运行一些从长远来看更便宜的东西
* 您可以以低于 10 美元/月的价格运行阅冰；并希望在我们优化悦冰足迹的过程中减少

我花了几周时间调查那里有什么。我开始大大放宽了自己的要求，但还是
找不到像样的东西。我看了几个开源项目，我不说是哪个，因为他们都有
多个明显的缺陷。

所以，我决定，这能有多难？你将 S3 连接到 ffmpeg，在上面放一个相当现代的前端，你就完成了，对吧？
 ……嗯，大部分的工作花了几个月的时间，但实在太有趣了，根本停不下来！
我希望你也喜欢它！

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**让我们让自托管视频网站变得超级简单！**</a>

 ＃＃ 特征
* 将 S3（或 B2）视频桶转换为亲朋好友的私人视频网站！
 * 连接一个或多个提供原始媒体文件的源桶
* 阅冰自动将源视频转码为最新和最广泛支持的自适应比特率流媒体格式 (DASH/mp4)
 * 所有数据都存储在目标桶中；你可以随时销毁服务器
* 对于最初在 CPU 优化实例上运行以进行初始转码很有用，然后运行 \
    on a much cheaper instance for 24/7/365 service.
 * 支持全加密存储（app端加密，只有你有钥匙）
 * 源代码始终只读，永不更改源代码内容
* 自动和手动扫描新媒体文件
* 你想要的东西有多私密或公开？悦冰支持：
 *完全私密：没有媒体显示给匿名用户，只有批准的电子邮件地址才能创建帐户
* 半私密：不向匿名用户显示任何媒体，但任何人都可以创建用户帐户
* 有限注册的公众：向所有人展示媒体，但只有经过批准的电子邮件地址才能创建帐户
* 完全公开：媒体向所有人展示，任何人都可以创建用户帐户
* 全面国际化！所有用户可见的文本（以及其他特定于语言环境的内容）都来自本地化资源
* [帮助社区，将月饼翻译成新的语言！](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * 功能齐全的管理控制台
* 按关键字或标签云搜索视频
* <a href="https://www.patreon.com/cobbzilla">**在您的支持下即将推出**</a> ：
 * 支持更多媒体类型（音频、图像等）
 * 用户上传的媒体
* 点赞、分享和推送通知
* 新的“来源类型”：另一个月饼实例！
    * Federation between friendly instances: unified search, user accounts, etc

 ## 匿名用户功能（如果站点已配置为允许匿名访问者）
 * 浏览媒体
* 观看媒体！
 * 创建帐户（如果站点已配置为允许帐户注册）

 ## 登录用户功能
* 浏览媒体
* 观看媒体！
 * 添加评论、编辑评论、删除评论！
 * 邀请朋友
* 编辑账户信息
* 删除账户，删除所有属于你的东西，包括你所有的评论

## 管理员用户功能
* 编辑媒体元数据、查看缩略图、更改选定的缩略图
* 查看媒体转换队列和作业状态
* 开始新的源媒体扫描和索引

## 服务器/后端功能
* Transient-friendly，零持久/重要数据存储在容器中。
 * 所有持久化数据都持久化在目标桶中；本质上，我们使用 S3 作为我们的数据库
* 自动定期扫描新媒体源桶
* 添加和更改媒体元数据；编辑存储在目标存储桶中，源媒体永远不会被修改
* 可配置的输出配置文件。默认为具有多个子配置文件的 DASH-mp4
 * 用户帐户信息也存储在目标存储桶中，可选择加密
* 如果更改了加密密钥，管理员可以使用 Web 管理控制台将用户迁移到新密钥

＃＃ 安装
您可以通过 docker、npm 或直接从源代码安装和运行`yuebing` 。

 ### 码头工人
如果你有docker，可以快速上手阅冰：

    docker run -it cobbzilla/yuebing

 ### npm 包
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### 来自源码
要从源代码运行，您需要 nodejs v16+ 和 yarn

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

有关详细信息，请参阅 [开发人员文档](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md)

 ＃＃ 配置
玩乐冰，什么都不配置就启动就好了。
运行`yuebing` ，启动时会提示你输入最小配置。

如果您打算运行一段时间的阅冰，请参阅[配置文档](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md)
有关如何设置的更多信息。

 ### nginx 配置
Yuebing 是一个 Nuxt 应用程序，并希望您将 nginx（或其他一些 Web 服务器）放在
在它前面处理 SSL、速率限制（如果需要）等。

如果您使用的是 nginx，这里有一个您可以使用的 [示例配置](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf)。

 ## 为什么叫月饼？
 [乌龙兔](https://en.wikipedia.org/wiki/Oolong_(rabbit)) 是一只可爱而有名的
[早期互联网模因](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images)。 2003年乌龙去世，
两年前某个广受欢迎的视频服务甚至还存在！

乌龙的传人叫月冰。月冰没有乌龙那么出名，但这有关系吗？
尽管如此，月冰还是成功了。

或许更有趣的是，月饼的意思是[月饼](https://en.wikipedia.org/wiki/Mooncake)
 （中文：[月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
日语：[月饼](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85));月饼很好吃，可以在
多种口味和风格。享受历史悠久的地域风格，或尝试现代异国情调的蛋糕
正在探索美味未知领域的面包师！真正每个人都有一个月饼！

</pre>
