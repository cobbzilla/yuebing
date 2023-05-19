🥮
 ==========
 Yuebing, video barındırma sitelerini çalıştırmak için açık kaynaklı bir yazılımdır.

 Yuebing, herhangi bir platformda oynatılabilen modern formatları kullanarak kaynak videolarınızı akış için otomatik olarak hazırlar.
 herhangi bir bağlantı üzerinden cihaz.

 Yuebing, arka uç depolama için Amazon S3 veya Backblaze B2'yi kullanabilir ve birçok gelişmiş özelliğe sahiptir.

 ### Kaynak
 * [GitHub'da yuebing](https://github.com/cobbzilla/yuebing)
 * [npm'de yuebing](https://www.npmjs.com/package/yuebing)
 * [DockerHub'da yuebing](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Bunu başka bir dilde okuyun
 Bu README.md belgesi [hokeylization](https://github.com/cobbzilla/hokeylization) aracılığıyla şu dile çevrilmiştir:
 birçok dil.

 Mükemmel olmadığına eminim ama umarım hiç yoktan iyidir!

 [🇸🇦 Arapça](../ar/README.md)
 [🇧🇩 Bengalce](../bn/README.md)
 [🇩🇪 Almanca](../de/README.md)
 [🇺🇸 Türkçe](../en/README.md)
 [🇪🇸 İspanyolca](../es/README.md)
 [🇫🇷 Fransızca](../fr/README.md)
 [🇹🇩 Hausa](../ha/README.md)
 [🇮🇳 Hintçe](../hi/README.md)
 [🇮🇩 Endonezce](../id/README.md)
 [🇮🇹 İtalyanca](../it/README.md)
 [🇯🇵 Japonca](../ja/README.md)
 [🇰🇷 Korece](../ko/README.md)
 [🇮🇳 Marathi](../mr/README.md)
 [🇵🇱 Lehçe](../pl/README.md)
 [🇧🇷 Portekizce](../pt/README.md)
 [🇷🇺 Rusça](../ru/README.md)
 [🇰🇪 Svahili](../sw/README.md)
 [🇵🇭 Tagalogca](../tl/README.md)
 [🇹🇷 Türkçe](../tr/README.md)
 [🇵🇰 Urduca](../ur/README.md)
 [🇻🇳 Vietnamca](../vi/README.md)
 [🇨🇳 Çince](../zh/README.md)
 ----

 # içindekiler
 * [İlham](#İlham)
 * [Özellikler özellikler)
 * [Kurulum](#Kurulum)
 * [Docker](#Docker)
 * [npm paketi](#npm paketi)
 * [Kaynaktan](#Kaynaktan)
 * [Yapılandırma](#Yapılandırma)
 * [nginx yapılandırması](#nginx yapılandırması)
 * [Neden yuebing adı?](#Neden yuebing-adı?)

 ## Esin
 Geçen yıl annem eski aile videolarından oluşan bir arşivi düzenlemek ve dijital hale getirmek için tonlarca zaman (ve para!) harcadı.
 Bunlardan bazıları oldukça eskiydi, 1940'lara kadar uzanıyordu. Gerçekten güzel, klasik şeyler.

 Bunları ailemizle özel olarak paylaşmak istedik, ancak *büyük teknolojiyle değil*.
 Büyük bir sağlayıcıdan "ücretsiz" video barındırma hizmeti almak söz konusu değildi.

 Ne arıyorduk:
 * Kendi kendine barındırılan, ancak çalıştırılması ve bakımı tamamen **uygulamalı kolay**
 * Uyarlanabilir bit hızı da dahil olmak üzere modern video formatlarında akışlar
 * Videolar herhangi bir cihazda, masaüstünde veya mobilde oynatılır
 * Yüksek bant genişliğine sahip bir bağlantıyla video kalitesi harikadır; olabildiğince iyi
 * **Kötü bir bağlantıyla bile**, oynatma makul kalitededir ve *atlama veya arabelleğe alma yapmaz*
 * Şifreli depolama, böylece genel bulut depolama çözümlerini biraz güvenle kullanabilir
 * Durum bilgisiz sunucu: son derece esnek olan depolama için önemli olan her şeyi sürdürün
 * **Yedekleme konusunda endişelenmek istemiyorum!**
 * *Buna sahip olmak güzeldi. Görünüşe göre hiçbir şey yok, bunun gibi bir şey yok. Yuebing yapar!*
 * Her şeyin kodunu dönüştürmek için güçlü bir örneği çalıştırdıktan sonra, onu parçalara ayırın ve uzun vadede daha ucuz bir şey çalıştırın
 * Yuebing'i ayda 10 doların altında çalıştırabilirsiniz; ve umarım Yuebing'in ayak izini optimize ederken daha da az yol kat ederiz

 Orada ne olduğunu araştırmak için birkaç haftamı harcadım. Gereksinimlerimi büyük ölçüde gevşetmeye başladım ve hala
 düzgün bir şey bulamadı. Birkaç açık kaynak projesine baktım, hangisi olduğunu söylemiyorum çünkü hepsinde
 birden fazla göze batan kusur.

 Ben de karar verdim, ne kadar zor olabilir? S3'ü ffmpeg'e bağlarsınız, üzerine oldukça modern bir ön uç koyarsınız ve işiniz biter, değil mi?
 ... işin büyük kısmı birkaç ay sürdü, ama durmak çok eğlenceliydi!
 Umarım siz de beğenirsiniz!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Haydi kendi kendini barındıran video sitelerini çok kolay hale getirelim!**</a>

 ## Özellikler
 * Bir S3 (veya B2) video kovasını arkadaşlarınız ve aileniz için özel bir video sitesine dönüştürün!
 * Ham medya dosyaları sağlayan bir veya daha fazla kaynak grubu bağlayın
 * Yuebing, uyarlanabilir bit hızı akışı (DASH/mp4) için kaynak videoları otomatik olarak en son ve en yaygın olarak desteklenen biçime dönüştürür
 * TÜM veriler hedef klasörde saklanır; sunucuyu istediğin zaman yok edebilirsin
 * Başlangıçta, ilk kod dönüştürme için CPU için optimize edilmiş bir örnekte çalıştırmak, ardından \ komutunu çalıştırmak için kullanışlıdır
    on a much cheaper instance for 24/7/365 service.
 * Tamamen şifrelenmiş depolamayı destekler (uygulama tarafı şifreleme, yalnızca sizde anahtar vardır)
 * Her zaman kaynaktan salt okunur, kaynak içeriğini asla değiştirmeyin
 * Yeni medya dosyaları için otomatik ve manuel tarama
 * Ne kadar özel ya da kamusal şeyler istersiniz? Yuebing şunları destekler:
 * Tamamen gizli: anonim kullanıcılara medya gösterilmez, yalnızca onaylı e-posta adresleri hesap oluşturabilir
 * Yarı özel: anonim kullanıcılara medya gösterilmez, ancak herkes bir kullanıcı hesabı oluşturabilir
 * Sınırlı kayıtla herkese açık: medya herkese gösterilir, ancak yalnızca onaylı e-posta adresleri hesap oluşturabilir
 * Tamamen herkese açık: medya herkese gösterilir ve herkes bir kullanıcı hesabı oluşturabilir
 * Tamamen uluslararası! Kullanıcı tarafından görülebilen tüm metinler (ve yerel ayarlara özgü diğer öğeler) yerelleştirilmiş kaynaklardan gelir
 * [Topluluğa yardım edin, Yuebing'i yeni dillere çevirin!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Tam özellikli yönetici konsolu
 * Videoları anahtar kelimelere göre veya etiket bulutundan arayın
 * <a href="https://www.patreon.com/cobbzilla">**Desteğinizle çok yakında**</a> :
 * Daha fazla medya türü için destek (ses, resim vb.)
 * Kullanıcı tarafından yüklenen medya
 * Beğeniler, paylaşımlar ve push bildirimleri
 * Yeni "kaynak türü": Başka bir Yuebing örneği!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Anonim kullanıcı özelliği (site, anonim ziyaretçilere izin verecek şekilde yapılandırılmışsa)
 * Medyaya göz atın
 * Medyayı izleyin!
 * Hesap oluştur (site hesap kaydına izin verecek şekilde yapılandırılmışsa)

 ## Oturum açmış kullanıcı özellikleri
 * Medyaya göz atın
 * Medyayı izleyin!
 * Yorum ekle, yorumunu düzenle, yorumunu sil!
 * Arkadaşları davet etmek
 * Hesap bilgilerini düzenle
 * Hesabı sil, tüm yorumlarınız dahil size ait olan her şeyi siler

 ## Yönetici kullanıcı özellikleri
 * Medya meta verilerini düzenleyin, küçük resimleri görüntüleyin, seçilen küçük resmi değiştirin
 * Medya dönüştürme kuyruğunu ve iş durumunu görüntüleyin
 * Kaynak ortamın yeni taramalarını ve dizinlerini başlatın

 ## Sunucu/arka uç özellikleri
 * Geçici dostu, SIFIR kalıcı/önemli veriler kapsayıcı içinde depolanır.
 * Tüm kalıcı veriler hedef klasörde tutulur; esasen, S3'ü veritabanımız olarak kullanıyoruz
 * Yeni medya için kaynak paketin otomatik periyodik olarak taranması
 * Medya meta verilerini ekleyin ve değiştirin; düzenlemeler hedef grupta depolanır, kaynak medya asla değiştirilmez
 * Yapılandırılabilir çıkış profilleri. Varsayılan, birden fazla alt profil içeren DASH-mp4'tür
 * Kullanıcı hesabı bilgileri, isteğe bağlı olarak şifrelenmiş olarak hedef klasörde de depolanır
 * Şifreleme anahtarı değiştirilirse yönetici, web yönetici konsolu ile kullanıcıları yeni anahtara taşıyabilir

 ## Kurulum
 `yuebing` docker, npm veya doğrudan kaynaktan yükleyip çalıştırabilirsiniz.

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
 Kaynaktan çalıştırmak için nodejs v16+ ve yarn gerekir

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

 Daha fazla bilgi için [geliştirici belgelerine](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) bakın

 ## Yapılandırma
 Yuebing ile oynamak için, hiçbir şey yapılandırmadan başlatmak sorun değil.
 `yuebing` çalıştırın ve başladığında minimum yapılandırmayı girmeniz istenecektir.

 Yuebing'i bir süre çalıştırmayı planlıyorsanız, [yapılandırma belgelerine](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) bakın.
 nasıl ayarlanacağı hakkında daha fazla bilgi.

 ### nginx yapılandırması
 Yuebing bir Nuxt uygulamasıdır ve içine nginx (veya başka bir web sunucusu) koymanızı bekler.
 SSL'yi işlemek için önü, gerekirse hız sınırlaması vb.

 Nginx kullanıyorsanız kullanabileceğiniz bir [örnek yapılandırma](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) burada.

 ## Neden yuebing adı?
 [Tavşan Oolong](https://en.wikipedia.org/wiki/Oolong_(tavşan)) sevimli ve ünlüydü
 [erken internet meme](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong 2003 yılında öldü.
 çok popüler olan belirli bir video hizmetinin varlığından iki yıl önce!

 Oolong'un halefinin adı Yuebing'di. Yuebing, Oolong kadar ünlü değildi ama bunun bir önemi var mıydı?
 Yuebing yine de başardı.

 Belki de daha ilginci, yuebing [mooncake](https://en.wikipedia.org/wiki/Mooncake) anlamına gelir.
 (Çince: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Japonca: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); ay çöreği çok lezzetlidir ve bulunabilir
 çok çeşitli tatlar ve stiller. Zamana saygı duyan bölgesel bir tarzın tadını çıkarın ya da çağdaş bir pastadan egzotik bir pasta deneyin.
 lezzetli bir şekilde keşfedilmemiş bölgeleri keşfeden fırıncılar! Gerçekten herkes için bir yuebing var!

</pre>
