يويبينغ 🥮
 ==========
 Yuebing هو برنامج مفتوح المصدر لتشغيل مواقع استضافة الفيديو.

 تقوم Yuebing تلقائيًا بإعداد مقاطع الفيديو المصدر الخاصة بك للبث باستخدام التنسيقات الحديثة ، والتي يمكن تشغيلها على أي منها
 الجهاز عبر أي اتصال.

 يمكن لـ Yuebing استخدام Amazon S3 أو Backblaze B2 لتخزين الواجهة الخلفية ، ولديه العديد من الميزات المتقدمة.

 ### مصدر
 * [yuebing on GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing on npm](https://www.npmjs.com/package/yuebing)
 * [yuebing على DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # اقرأ هذا بلغة أخرى
 تمت ترجمة هذا المستند README.md عبر [hokeylization](https://github.com/cobbzilla/hokeylization) إلى
 العديد من اللغات.

 أنا متأكد من أنها ليست مثالية ، لكني آمل أن تكون أفضل من لا شيء!

 [🇸🇦 عربي](docs / ar / README.md)
 [🇧🇩 بنغالي](docs / bn / README.md)
 [🇩🇪 ألماني](docs / de / README.md)
 [🇺🇸 إنجليزي](docs / en / README.md)
 [🇪🇸 إسباني](docs / es / README.md)
 [🇫🇷 فرنسي](docs / fr / README.md)
 [🇹🇩 الهوسا](docs / ha / README.md)
 [🇮🇳 هندي](docs / hi / README.md)
 [🇮🇩 إندونيسي](docs / id / README.md)
 [🇮🇹 إيطالي](docs / it / README.md)
 [🇯🇵 ياباني](docs / ja / README.md)
 [🇰🇷 كوري](docs / ko / README.md)
 [🇮🇳 المهاراتية](docs / mr / README.md)
 [🇵🇱 بولندي](docs / pl / README.md)
 [🇧🇷 برتغالي](docs / pt / README.md)
 [🇷🇺 بالروسية](docs / ru / README.md)
 [🇰🇪 السواحيلية](docs / sw / README.md)
 [🇵🇭 تاغالوغ](docs / tl / README.md)
 [🇹🇷 التركية](docs / tr / README.md)
 [🇵🇰 الأردية](docs / ur / README.md)
 [🇻🇳 فيتنامي](docs / vi / README.md)
 [🇨🇳 الصينية](docs / zh / README.md)
 ----

 # محتويات
 * [إلهام](# إلهام)
 * [الميزات الميزات)
 * [التثبيت](# التثبيت)
 * [Docker](# Docker)
 * [حزمة npm](# حزمة npm)
 * [من المصدر](# من المصدر)
 * [التكوين](# التكوين)
 * [nginx config](# nginx-config)
 * [لماذا اسم yuebing؟](# Why-the-name-yuebing؟)

 ## إلهام
 في العام الماضي ، أمضت أمي الكثير من الوقت (والمال!) في تنظيم ورقمنة أرشيف من مقاطع الفيديو العائلية القديمة.
 كان بعضها قديمًا جدًا ، ويعود إلى الأربعينيات. أشياء كلاسيكية جميلة حقًا.

 أردنا مشاركتها بشكل خاص مع العائلة ، ولكن * ليس مع التكنولوجيا الكبيرة *.
 كان الذهاب إلى استضافة الفيديو "المجانية" من مزود رئيسي غير مطروح.

 ما كنا نبحث عنه:
 * مستضافة ذاتيًا ، ولكن من السهل تشغيلها وصيانتها ** تمامًا
 * تيارات في تنسيقات الفيديو الحديثة ، بما في ذلك معدل البت التكيفي
 * يتم تشغيل مقاطع الفيديو على أي جهاز أو سطح مكتب أو هاتف محمول
 * مع اتصال النطاق الترددي العالي ، تكون جودة الفيديو رائعة ؛ بأفضل ما يمكن
 * ** حتى مع الاتصال السيئ ** ، يكون التشغيل بجودة جيدة و * لا يتخطى أو يتم تخزينه مؤقتًا *
 * تخزين مشفر ، وبالتالي قادر على استخدام حلول التخزين السحابي العامة ببعض الثقة
 * خادم عديم الحالة: حافظ على أي شيء مهم للتخزين عالي المرونة
 * ** لا أريد أن أقلق بشأن النسخ الاحتياطية! **
 * * كان هذا ممتعًا. كما اتضح أنه لا يوجد أي شيء مثل هذا. Yuebing يفعل! *
 * بعد تشغيل مثيل سمين لتحويل كل شيء ، قم بتمزيقه وتشغيل شيء أرخص على المدى الطويل
 * يمكنك تشغيل Yuebing بأقل من 10 دولارات شهريًا ؛ ونأمل أن يكون أقل من ذلك أثناء قيامنا بتحسين أثر Yuebing

 استغرقت أسبوعين لمسح ما كان هناك. بدأت في الاسترخاء بشكل كبير في متطلباتي ، وما زلت
 لا يمكن العثور على شيء لائق. نظرت إلى العديد من المشاريع مفتوحة المصدر ، ولا أقول أي شيء لأنهم جميعًا لديهم
 العديد من العيوب الصارخة.

 لذا ، قررت ، ما مدى صعوبة ذلك؟ تقوم بتوصيل S3 إلى ffmpeg ، وتضع واجهة أمامية حديثة بشكل لائق ، وقد انتهيت ، أليس كذلك؟
 ... حسنًا ، استغرق الجزء الأكبر من العمل شهرين ، لكن كان من الممتع جدًا التوقف!
 أتمنى أن تستمتع بها أيضًا!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">** لنجعل مواقع الفيديو ذاتية الاستضافة سهلة للغاية! **</a>

 ## سمات
 * حوّل مجموعة مقاطع فيديو S3 (أو B2) إلى موقع فيديو خاص للأصدقاء والعائلة!
 * قم بتوصيل حاوية مصدر واحدة أو أكثر لتوفير ملفات وسائط خام
 * تقوم Yuebing تلقائيًا بتحويل ترميز مقاطع الفيديو المصدر إلى أحدث تنسيق وأكثرها دعمًا على نطاق واسع لتدفق معدل البت التكيفي (DASH / mp4)
 * يتم تخزين جميع البيانات في دلو الوجهة ؛ يمكنك تدمير الخادم وقتما تشاء
 * مفيد للتشغيل مبدئيًا على مثيل مُحسَّن لوحدة المعالجة المركزية من أجل التحويل الأولي للشفرة ، ثم تشغيل \
    on a much cheaper instance for 24/7/365 service.
 * يدعم التخزين المشفر بالكامل (التشفير من جانب التطبيق ، فقط لديك المفتاح)
 * للقراءة دائمًا من المصدر ، لا تغير محتوى المصدر مطلقًا
 * المسح التلقائي واليدوي لملفات الوسائط الجديدة
 * إلى أي مدى تريد الأشياء الخاصة أو العامة؟ يدعم Yuebing:
 * خاص تمامًا: لا توجد وسائط معروضة للمستخدمين المجهولين ، يمكن فقط لعناوين البريد الإلكتروني المعتمدة إنشاء حسابات
 * شبه خاص: لا توجد وسائط معروضة للمستخدمين المجهولين ، ولكن يمكن لأي شخص إنشاء حساب مستخدم
 * عام مع تسجيل محدود: يتم عرض الوسائط للجميع ، ولكن عناوين البريد الإلكتروني المعتمدة فقط هي التي يمكنها إنشاء حسابات
 * علني تمامًا: الوسائط المعروضة للجميع ، ويمكن لأي شخص إنشاء حساب مستخدم
 * مدول بالكامل! يأتي كل النص المرئي للمستخدم (والأشياء الأخرى الخاصة بالمنطقة المحلية) من الموارد المترجمة
 * [مساعدة المجتمع ، ترجمة Yuebing إلى لغات جديدة!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * وحدة تحكم المشرف كاملة الميزات
 * البحث عن مقاطع الفيديو بالكلمات الرئيسية أو من سحابة العلامات
 * <a href="https://www.patreon.com/cobbzilla">** قريبا بدعمكم **</a> :
 * دعم لمزيد من أنواع الوسائط (الصوت ، الصور ، إلخ)
 * الوسائط التي تم تحميلها بواسطة المستخدم
 * إبداءات الإعجاب والمشاركة ودفع الإشعارات
 * "نوع المصدر" جديد: مثيل Yuebing آخر!
    * Federation between friendly instances: unified search, user accounts, etc

 ## ميزة مستخدم مجهول (إذا تم تكوين الموقع للسماح للزوار المجهولين)
 * تصفح الوسائط
 * مشاهدة الوسائط!
 * إنشاء حساب (إذا تم تكوين الموقع للسماح بتسجيل الحساب)

 ## ميزات المستخدم الذي قام بتسجيل الدخول
 * تصفح الوسائط
 * مشاهدة الوسائط!
 * أضف تعليقا ، عدّل تعليقك ، احذف تعليقك!
 * ادعو أصدقاء
 * تحرير معلومات الحساب
 * حذف الحساب ، حذف كل ما يخصك بما في ذلك جميع تعليقاتك

 ## ميزات المستخدم الإداري
 * تحرير البيانات الوصفية للوسائط ، وعرض الصور المصغرة ، وتغيير الصورة المصغرة المحددة
 * عرض الوسائط تحويل قائمة الانتظار وحالة الوظيفة
 * بدء عمليات مسح وفهارس جديدة لوسائط المصدر

 ## ميزات الخادم / الواجهة الخلفية
 * يتم تخزين بيانات غير ثابتة / مهمة سهلة العبور داخل الحاوية.
 * يتم الاحتفاظ بجميع البيانات المعمرة في دلو الوجهة ؛ في الأساس ، نستخدم S3 كقاعدة بيانات خاصة بنا
 * المسح الدوري التلقائي لحاوية المصدر للوسائط الجديدة
 * إضافة وتغيير الوسائط الوصفية. يتم تخزين عمليات التحرير في حاوية الوجهة ، ولا يتم تعديل وسائط المصدر مطلقًا
 * ملامح الإخراج شكلي. الافتراضي هو DASH-mp4 مع ملفات تعريف فرعية متعددة
 * يتم تخزين معلومات حساب المستخدم أيضًا في حاوية الوجهة ، ويتم تشفيرها اختياريًا
 * إذا تم تغيير مفتاح التشفير ، يمكن للمسؤول ترحيل المستخدمين إلى المفتاح الجديد باستخدام وحدة تحكم مسؤول الويب

 ## تثبيت
 يمكنك تثبيت وتشغيل `yuebing` عبر عامل إرساء أو npm أو مباشرة من المصدر.

 ### عامل ميناء
 إذا كان لديك عامل إرساء ، فيمكنك البدء مع Yuebing بسرعة:

    docker run -it cobbzilla/yuebing

 ### حزمة npm
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### من المصدر
 للتشغيل من المصدر ، ستحتاج إلى nodejs v16 + والغزل

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

 راجع [محرر مستندات المطور](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) لمزيد من المعلومات

 ## إعدادات
 للتلاعب مع Yuebing ، لا بأس أن تبدأه دون تكوين أي شيء.
 قم بتشغيل `yuebing` وسيُطلب منك إدخال الحد الأدنى من التكوين عند بدء تشغيله.

 إذا كنت تخطط لتشغيل Yuebing لفترة ، فراجع [مستندات التكوين](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) للحصول على
 مزيد من المعلومات حول كيفية إعداد الأشياء.

 ### تهيئة nginx
 Yuebing هو تطبيق Nuxt ، ويتوقع أنك ستضع nginx (أو خادم ويب آخر) في
 أمامه للتعامل مع SSL ، وتحديد المعدل إذا لزم الأمر ، وما إلى ذلك.

 إذا كنت تستخدم nginx ، فإليك [نموذج تهيئة](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) يمكنك استخدامه.

 ## لماذا اسم yuebing؟
 [أولونغ الأرنب](https://en.wikipedia.org/wiki/Oolong_ (الأرنب)) كان رائعاً ومشهوراً
 [ميمي الإنترنت المبكر](https://duckduckgo.com/؟q=oolong+rabbit&ia=images&iax=images). توفي أولونغ في عام 2003 ،
 قبل عامين من وجود خدمة فيديو شهيرة على نطاق واسع!

 تم تسمية خليفة أولونغ يويبينغ. لم تكن Yuebing مشهورة مثل Oolong ، ولكن هل كان ذلك مهمًا؟
 نجح Yuebing مع ذلك.

 ولعل الأمر الأكثر إثارة للاهتمام هو أن كلمة yuebing تعني [كعكة القمر](https://en.wikipedia.org/wiki/Mooncake)
 (الصينية: [月饼](https://zh.wikipedia.org/wiki/٪E6٪9C٪88٪E9٪A5٪BC) ،
 اليابانية: [月餅](https://ja.wikipedia.org/wiki/٪E6٪9C٪88٪E9٪A4٪85)) ؛ كعك القمر لذيذ جدًا ويمكن العثور عليه في
 مجموعة متنوعة من النكهات والأنماط. استمتع بأسلوب إقليمي عريق ، أو جرب كعكة غريبة من المعاصر
 الخبازين الذين يستكشفون منطقة مجهولة لذيذة! حقا هناك yuebing للجميع!

</pre>
