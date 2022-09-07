Yuebing 🥮
 ==========
 Yuebing, video barındırma sitelerini çalıştırmak için açık kaynaklı bir yazılımdır.

 Kaynak videolarınızı otomatik olarak herhangi bir videoda oynatılabilen modern akış biçimlerine dönüştürür.
 cihazı herhangi bir bağlantı üzerinden

 Yuebing, arka uç depolaması için Amazon S3 veya Backblaze B2'yi kullanabilir ve birçok gelişmiş özelliğe sahiptir.

 ### Kaynak
 * [GitHub'da yuebing](https://github.com/cobbzilla/yuebing)
 * [npm'de yuebing](https://www.npmjs.com/package/yuebing)
 * [DockerHub'da yuebing](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # İçindekiler
 * [İlham](#İlham)
 * [Özellikler özellikler)
 * [Kurulum](#Kurulum)
 * [Docker](#Docker)
 * [npm paketi](#npm paketi)
 * [Kaynaktan](#Kaynaktan)
 * [Yapılandırma](#Yapılandırma)
 * [nginx yapılandırması](#nginx-config)
 * [Neden yuebing adı?](#Neden-yuebing-adı?)

 ## Esin
 Geçen yıl annem eski aile videolarından oluşan bir arşivi düzenlemek ve dijitalleştirmek için tonlarca zaman (ve para!) harcadı.
 Bunlardan bazıları 1950'lere kadar giden oldukça eskiydi. Gerçekten güzel, klasik şeyler.

 Bunları aileyle özel olarak paylaşmak istedik ama *büyük teknolojiyle değil*.
 Büyük bir sağlayıcıdan "ücretsiz" video barındırma hizmeti almak masanın dışındaydı.

 Aradığımız şey:
 * Kendi kendine barındırılır, ancak çalıştırılması ve bakımı tamamen **elde olmadan kolay**
 * Uyarlanabilir bit hızı dahil modern video formatlarında akışlar
 * Videolar herhangi bir cihazda, masaüstünde veya mobilde oynatılır
 * Yüksek bant genişliğine sahip bir bağlantıyla video kalitesi harikadır; aldığı kadar iyi
 * **Kötü bir bağlantıyla** bile oynatma kalitesi iyi ve *atlama yapmıyor veya ara belleğe almıyor*
 * Şifreli depolama, böylece genel bulut depolama çözümlerini biraz güvenle kullanabilir
 * Durum bilgisi olmayan sunucu: depolama için önemli olan her şeyi yüksek düzeyde dirençli olarak sürdürün
 * **Yedekleme konusunda endişelenmek istemiyorum!**
 * *Bunun olması güzeldi. Görünüşe göre hiçbir şey böyle bir şey yok. Yuebing yapar!*
 * Her şeyi dönüştürmek için güçlü bir örnek çalıştırdıktan sonra, onu parçalayın ve uzun vadede daha ucuz bir şey çalıştırın
 * Yuebing'i ayda 10$'ın altında çalıştırabilirsiniz; ve umarım Yuebing'in ayak izini optimize ederken daha da az yol alırız

 Orada ne olduğunu araştırmak için birkaç hafta uğraştım. Gereksinimlerimi büyük ölçüde gevşetmeye başladım ve hala
 düzgün bir şey bulamadı. Birkaç açık kaynak projesine baktım, hangisi olduğunu söylemiyorum çünkü hepsinin
 birden fazla göze çarpan kusur.

 Ve karar verdim, ne kadar zor olabilir? S3'ü ffmpeg'e bağlarsınız, üzerine oldukça modern bir ön uç koyarsınız ve işiniz biter,
 Sağ?

 .... uh, tamam, bu noktada yaklaşık bir aydır, ama çok eğlenceli! Umarım siz de eğlenirsiniz!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Kendi kendini barındıran video sitelerini çok kolay hale getirelim!**</a>

 ## Özellikler
 * Videolu bir S3 kovasını arkadaşlarınız ve aileniz için özel bir video sitesine dönüştürün!
 * Ham medya dosyaları sağlayan bir veya daha fazla kaynak paketi bağlayın
 * Yuebing, kaynak videoları otomatik olarak uyarlanabilir bit hızı akışı (DASH/mp4) için en son ve en yaygın olarak desteklenen biçime dönüştürür
 * TÜM veriler hedef kovada saklanır, böylece kabı yok edebilir ve daha sonra açabilirsiniz
 * İlk dönüşüm için başlangıçta CPU için optimize edilmiş bir örnekte çalıştırmak ve ardından çalıştırmak için kullanışlıdır \
    on a much cheaper instance for 24/7/365 service.
 * Tamamen şifrelenmiş depolamayı destekler (uygulama tarafı şifreleme, anahtar yalnızca sizdedir)
 * Her zaman kaynaktan salt okunur, kaynak içeriği asla değiştirmeyin
 * Yeni medya dosyaları için otomatik ve manuel tarama
 * Ne kadar özel veya genel şeyler istiyorsunuz? Yuebing şunları destekler:
 * Tamamen özel: anonim kullanıcılara medya gösterilmez, yalnızca onaylanmış e-posta adresleri hesap oluşturabilir
 * Yarı özel: anonim kullanıcılara medya gösterilmez, ancak herkes bir kullanıcı hesabı oluşturabilir
 * Sınırlı kayıtla herkese açık: medya herkese gösterilir, ancak yalnızca onaylanmış e-posta adresleri hesap oluşturabilir
 * Tamamen herkese açık: medya herkese gösterilir ve herkes bir kullanıcı hesabı oluşturabilir
 * Tamamen uluslararasılaştırılmış! Kullanıcı tarafından görülebilen tüm metinler (ve diğer yerel ayara özgü şeyler) yerelleştirilmiş kaynaklardan gelir
 * [Topluluğa yardım edin, Yuebing'i yeni dillere çevirin!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Tam özellikli yönetici konsolu
 * **İtiraf ettiğim bir şey hâlâ tamamen berbat:**
 * "Keşif deneyimi", *bir dizin hiyerarşisinde gezinmeyi içerir*. Bu **çok kötü** ama bir yerden başlamamız gerekiyordu.
 * Uygun arama, etiketleme, öneriler vb. için destek ekleyeceğiz.
 * Tamam, aslında hala berbat olan bir sürü şey var ve bu tamamen 1.0 yazılım ama işe yarayan şeyler oldukça havalı
 * <a href="https://www.patreon.com/cobbzilla">**Desteklerinizle çok yakında**</a> :
 * Daha fazla medya türü için destek (ses, görüntü vb.)
 * Kullanıcı tarafından yüklenen medya
 * Yeni "kaynak türü": Başka bir Yuebing örneği!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Anonim kullanıcı özelliği (site anonim ziyaretçilere izin verecek şekilde yapılandırılmışsa)
 * Medyaya göz atın
 * Medyayı izleyin!
 * Hesap oluştur (site, hesap kaydına izin verecek şekilde yapılandırılmışsa)

 ## Oturum açmış kullanıcı özellikleri
 * Medyaya göz atın
 * Medyayı izleyin!
 * Yorum ekleyin, yorumunuzu düzenleyin, yorumunuzu silin!
 * Medya gibi (çok yakında!)
 * Arkadaşları davet etmek
 * Dili İngilizce veya Fransızca olarak ayarlayın (lütfen daha fazla çeviri ekleyin!)
 * Hesap bilgilerini düzenle
 * Hesabı sil, tüm yorumların dahil sana ait olan her şeyi siler

 ## Yönetici kullanıcı özellikleri
 * Medya meta verilerini düzenleyin, küçük resimleri görüntüleyin, seçilen küçük resmi değiştirin
 * Medya dönüştürme kuyruğunu ve iş durumunu görüntüleyin
 * Kaynak medyanın yeni taramalarını ve dizinlerini başlatın

 ## Sunucu/arka uç özellikleri
 * Geçici dostu, SIFIR kalıcı/önemli veriler kapsayıcı içinde saklanır.
 * Tüm kalıcı veriler hedef kovada kalıcıdır; aslında, veritabanımız olarak S3 kullanıyoruz
 * Yeni medya için kaynak kovanın otomatik periyodik taraması
 * Medya meta verilerini ekleyin ve değiştirin; düzenlemeler hedef klasörde saklanır, kaynak medya asla değiştirilmez
 * Yapılandırılabilir çıktı profilleri. Varsayılan, HD'den daha iyiden süper düşük bant genişliğine kadar kalite seviyelerini destekleyen dört profilli DASH-mp4'tür.
 * Kullanıcı hesabı bilgileri, isteğe bağlı olarak şifrelenmiş olarak hedef kovada da saklanır
 * Şifreleme anahtarı değiştirilirse, yönetici web yönetici konsolu ile kullanıcıları yeni anahtara taşıyabilir

 ## Kurulum
 `yuebing` docker, npm veya doğrudan kaynaktan yükleyebilir ve çalıştırabilirsiniz.

 ### liman işçisi
 Docker'ınız varsa, Yuebing'i hızlı bir şekilde kullanmaya başlayabilirsiniz:

    docker run -it cobbzilla/yuebing

 ### npm paketi
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### Kaynaktan
 Kaynaktan çalıştırmak için nodejs v16+ ve ipliğe ihtiyacınız olacak

    # Clone source and install dependencies
    git clone https://github.com/cobbzilla/yuebing.git
    cd yuebing
    yarn install

    # Use the 'yuebing' command from the git repo
    ./yuebing

    # Or, since you have the source, run any of the yarn scripts
    yarn docker-run-dev # Fastest build & startup, dev docker image
    yarn docker-run # Faster at runtime, production docker image

 Daha fazla bilgi için [geliştirici belgelerine](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) bakın

 ## Yapılandırma
 Yuebing ile oynamak için, hiçbir şeyi yapılandırmadan başlatmak sorun değil.
 `yuebing` çalıştırın ve başladığında minimum yapılandırmayı girmeniz istenecektir.

 Yuebing'i bir süre çalıştırmayı planlıyorsanız, bunun için [yapılandırma belgelerine](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) bakın.
 şeylerin nasıl kurulacağı hakkında daha fazla bilgi.

 ### nginx yapılandırması
 Yuebing yalnızca bir Nuxt uygulamasıdır ve nginx'i (veya başka bir web sunucusunu)
 SSL'yi işlemek, gerekirse hız sınırlaması vb.

 nginx kullanıyorsanız, kullanabileceğiniz bir [örnek yapılandırma](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) burada.

 ## Neden yuebing adı?
 [Tavşan Oolong](https://en.wikipedia.org/wiki/Oolong_(tavşan)) çok sevimli ve ünlüydü
 [erken internet meme](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong 2003 yılında öldü,
 kitlesel olarak popüler bir video hizmeti bile var olmadan iki yıl önce!

 Oolong'un halefinin adı Yuebing'di. Yuebing, Oolong kadar ünlü değildi ama bunun bir önemi var mıydı?
 Yuebing yine de başarılı oldu.

 Belki daha da ilginci, yuebing [mooncake](https://en.wikipedia.org/wiki/Mooncake) anlamına gelir.
 (Çince: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Japonca: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); ay kekleri çok lezzetlidir ve içinde bulunabilir.
 çok çeşitli tatlar ve stiller. Geleneksel bir bölgesel tarzın tadını çıkarın ya da çağdaştan egzotik bir pasta deneyin
 lezzetli bir şekilde keşfedilmemiş bölgeleri keşfeden fırıncılar! Gerçekten herkes için bir yuebing var!

</pre>
