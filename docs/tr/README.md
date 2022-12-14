Yuebing ??幼
 ==========
 Yuebing, video bar覺nd覺rma sitelerini 癟al覺??t覺rmak i癟in a癟覺k kaynakl覺 bir yaz覺l覺md覺r.

 Yuebing, kaynak videolar覺n覺z覺 herhangi bir videoda oynat覺labilen modern formatlar覺 kullanarak ak覺?? i癟in otomatik olarak haz覺rlar.
 cihaz覺 herhangi bir ba??lant覺 羹zerinden

 Yuebing, arka u癟 depolamas覺 i癟in Amazon S3 veya Backblaze B2'yi kullanabilir ve bir癟ok geli??mi?? 繹zelli??e sahiptir.

 ### Kaynak
 * [GitHub'da yuebing](https://github.com/cobbzilla/yuebing)
 * [npm'de yuebing](https://www.npmjs.com/package/yuebing)
 * [DockerHub'da yuebing](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Bunu ba??ka bir dilde oku
 Bu README.md belgesi [hokeylization](https://github.com/cobbzilla/hokeylization) arac覺l覺??覺yla ??u dile 癟evrildi:
 bir癟ok dil.

 M羹kemmel olmad覺??覺na eminim ama umar覺m hi癟 yoktan iyidir!

 [???賅??? Arap癟a](../ar/README.md)
 [???攻??? Bengalce](../bn/README.md)
 [???拎??? Almanca](../de/README.md)
 [???綾??? 襤ngilizce](../en/README.md)
 [???返??? 襤spanyolca](../es/README.md)
 [???恫??? Frans覺zca](../fr/README.md)
 [癟i癟ek](../ha/README.md)
 [???氣??? Hint癟e](../hi/README.md)
 [???氣??? Endonezyaca](../id/README.md)
 [???氣??? 襤talyanca](../it/README.md)
 [???荊??? Japonca](../ja/README.md)
 [???埠??? Korean](../ko/README.md)
 [???氣??? Maranthi](../mr/README.md)
 [???蛤??? Leh癟e](../pl/README.md)
 [???攻??? Portekizce](../pt/README.md)
 [???痰??? Rus癟a](../ru/README.md)
 [???埠??? Svahili](../sw/README.md)
 [???蛤??? Tagalog](../tl/README.md)
 [???屢??? Turkish](../tr/README.md)
 [???蛤??? Urduca](../ur/README.md)
 [???鳶??? Vietnamca](../vi/README.md)
 [???劾??? ??ince](../zh/README.md)
 ----

 # 襤癟indekiler
 * [襤lham](#襤lham)
 * [??zellikler 繹zellikler)
 * [Kurulum](#Kurulum)
 * [Docker](#Docker)
 * [npm paketi](#npm paketi)
 * [Kaynaktan](#Kaynaktan)
 * [Yap覺land覺rma](#Yap覺land覺rma)
 * [nginx yap覺land覺rmas覺](#nginx-config)
 * [Neden yuebing ad覺?](#Neden-yuebing-ad覺?)

 ## Esin
 Ge癟en y覺l annem eski aile videolar覺ndan olu??an bir ar??ivi d羹zenlemek ve dijitalle??tirmek i癟in tonlarca zaman (ve para!) harcad覺.
 Bunlardan baz覺lar覺 olduk癟a eskiydi, 1940'lara kadar uzan覺yordu. Ger癟ekten g羹zel, klasik ??eyler.

 Bunlar覺 aileyle 繹zel olarak payla??mak istedik ama *b羹y羹k teknolojiyle de??il*.
 B羹y羹k bir sa??lay覺c覺dan "羹cretsiz" video bar覺nd覺rma hizmeti almak masan覺n d覺??覺ndayd覺.

 Arad覺??覺m覺z ??ey:
 * Kendi kendine bar覺nd覺r覺l覺r, ancak 癟al覺??t覺r覺lmas覺 ve bak覺m覺 tamamen **elde olmadan kolay**
 * Uyarlanabilir bit h覺z覺 dahil modern video formatlar覺nda ak覺??lar
 * Videolar herhangi bir cihazda, masa羹st羹nde veya mobilde oynat覺l覺r
 * Y羹ksek bant geni??li??ine sahip bir ba??lant覺yla video kalitesi harikad覺r; ald覺??覺 kadar iyi
 * **K繹t羹 bir ba??lant覺yla** bile oynatma kalitesi iyi ve *atlama yapm覺yor veya ara belle??e alm覺yor*
 * ??ifreli depolama, b繹ylece genel bulut depolama 癟繹z羹mlerini biraz g羹venle kullanabilir
 * Durum bilgisi olmayan sunucu: depolama i癟in 繹nemli olan her ??eyi y羹ksek d羹zeyde diren癟li olarak s羹rd羹r羹n
 * **Yedekleme konusunda endi??elenmek istemiyorum!**
 * *Bunun olmas覺 g羹zeldi. G繹r羹n羹??e g繹re hi癟bir ??ey b繹yle bir ??ey yok. Yuebing yapar!*
 * Her ??eyi d繹n羹??t羹rmek i癟in g羹癟l羹 bir 繹rnek 癟al覺??t覺rd覺ktan sonra, onu par癟alay覺n ve uzun vadede daha ucuz bir ??ey 癟al覺??t覺r覺n
 * Yuebing'i ayda 10$'覺n alt覺nda 癟al覺??t覺rabilirsiniz; ve umar覺m Yuebing'in ayak izini optimize ederken daha da az yol al覺r覺z

 Orada ne oldu??unu ara??t覺rmak i癟in birka癟 hafta u??ra??t覺m. Gereksinimlerimi b羹y羹k 繹l癟羹de gev??etmeye ba??lad覺m ve hala
 d羹zg羹n bir ??ey bulamad覺. Birka癟 a癟覺k kaynak projesine bakt覺m, hangisi oldu??unu s繹ylemiyorum 癟羹nk羹 hepsinin
 birden fazla g繹ze 癟arpan kusur.

 Ve karar verdim, ne kadar zor olabilir? S3'羹 ffmpeg'e ba??lad覺n覺z, 羹zerine olduk癟a modern bir 繹n u癟 koydunuz ve i??iniz bitti, de??il mi?
 ...pekala, uh, i??in b羹y羹k k覺sm覺 birka癟 ay s羹rd羹, ama durmas覺 癟ok e??lenceliydi!
 Umar覺m siz de e??lenirsiniz!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Kendi kendini bar覺nd覺ran video sitelerini 癟ok kolay hale getirelim!**</a>

 ## ??zellikler
 * Bir S3 (veya B2) kova videosunu arkada??lar覺n覺z ve aileniz i癟in 繹zel bir video sitesine d繹n羹??t羹r羹n!
 * Ham medya dosyalar覺 sa??layan bir veya daha fazla kaynak paketi ba??lay覺n
 * Yuebing, kaynak videolar覺 otomatik olarak uyarlanabilir bit h覺z覺 ak覺??覺 (DASH/mp4) i癟in en son ve en yayg覺n olarak desteklenen bi癟ime d繹n羹??t羹r羹r
 * T??M veriler hedef kovada saklan覺r; sunucuyu istedi??in zaman yok edebilirsin
 * 襤lk kod d繹n羹??t羹rme i癟in ba??lang覺癟ta CPU i癟in optimize edilmi?? bir 繹rnekte 癟al覺??t覺rmak ve ard覺ndan 癟al覺??t覺rmak i癟in kullan覺??l覺d覺r \
    on a much cheaper instance for 24/7/365 service.
 * Tamamen ??ifrelenmi?? depolamay覺 destekler (uygulama taraf覺 ??ifreleme, anahtar yaln覺zca sizdedir)
 * Her zaman kaynaktan salt okunur, kaynak i癟eri??i asla de??i??tirmeyin
 * Yeni medya dosyalar覺 i癟in otomatik ve manuel tarama
 * Ne kadar 繹zel veya genel ??eyler istiyorsunuz? Yuebing ??unlar覺 destekler:
 * Tamamen 繹zel: anonim kullan覺c覺lara medya g繹sterilmez, yaln覺zca onaylanm覺?? e-posta adresleri hesap olu??turabilir
 * Yar覺 繹zel: anonim kullan覺c覺lara medya g繹sterilmez, ancak herkes bir kullan覺c覺 hesab覺 olu??turabilir
 * S覺n覺rl覺 kay覺tla herkese a癟覺k: medya herkese g繹sterilir, ancak yaln覺zca onaylanm覺?? e-posta adresleri hesap olu??turabilir
 * Tamamen herkese a癟覺k: medya herkese g繹sterilir ve herkes bir kullan覺c覺 hesab覺 olu??turabilir
 * Tamamen uluslararas覺la??t覺r覺lm覺??! Kullan覺c覺 taraf覺ndan g繹r羹lebilen t羹m metinler (ve di??er yerel ayara 繹zg羹 ??eyler) yerelle??tirilmi?? kaynaklardan gelir
 * [Toplulu??a yard覺m edin, Yuebing'i yeni dillere 癟evirin!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Tam 繹zellikli y繹netici konsolu
 * Videolar覺 anahtar kelimelere g繹re veya etiket bulutundan aray覺n
 * <a href="https://www.patreon.com/cobbzilla">**Desteklerinizle 癟ok yak覺nda**</a> :
 * Daha fazla medya t羹r羹 i癟in destek (ses, g繹r羹nt羹 vb.)
 * Kullan覺c覺 taraf覺ndan y羹klenen medya
 * Be??eniler, payla??覺mlar ve push bildirimleri
 * Yeni "kaynak t羹r羹": Ba??ka bir Yuebing 繹rne??i!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Anonim kullan覺c覺 繹zelli??i (site anonim ziyaret癟ilere izin verecek ??ekilde yap覺land覺r覺lm覺??sa)
 * Medyaya g繹z at覺n
 * Medyay覺 izleyin!
 * Hesap olu??tur (site, hesap kayd覺na izin verecek ??ekilde yap覺land覺r覺lm覺??sa)

 ## Oturum a癟m覺?? kullan覺c覺 繹zellikleri
 * Medyaya g繹z at覺n
 * Medyay覺 izleyin!
 * Yorum ekleyin, yorumunuzu d羹zenleyin, yorumunuzu silin!
 * Arkada??lar覺 davet etmek
 * Hesap bilgilerini d羹zenle
 * Hesab覺 sil, t羹m yorumlar覺n dahil sana ait olan her ??eyi siler

 ## Y繹netici kullan覺c覺 繹zellikleri
 * Medya meta verilerini d羹zenleyin, k羹癟羹k resimleri g繹r羹nt羹leyin, se癟ilen k羹癟羹k resmi de??i??tirin
 * Medya d繹n羹??t羹rme kuyru??unu ve i?? durumunu g繹r羹nt羹leyin
 * Kaynak medyan覺n yeni taramalar覺n覺 ve dizinlerini ba??lat覺n

 ## Sunucu/arka u癟 繹zellikleri
 * Ge癟ici dostu, SIFIR kal覺c覺/繹nemli veriler kapsay覺c覺 i癟inde saklan覺r.
 * T羹m kal覺c覺 veriler hedef kovada kal覺c覺d覺r; asl覺nda, veritaban覺m覺z olarak S3 kullan覺yoruz
 * Yeni medya i癟in kaynak kovan覺n otomatik periyodik taramas覺
 * Medya meta verilerini ekleyin ve de??i??tirin; d羹zenlemeler hedef klas繹rde saklan覺r, kaynak medya asla de??i??tirilmez
 * Yap覺land覺r覺labilir 癟覺kt覺 profilleri. Varsay覺lan, birden 癟ok alt profilli DASH-mp4't羹r
 * Kullan覺c覺 hesab覺 bilgileri, iste??e ba??l覺 olarak ??ifrelenmi?? olarak hedef kovada da saklan覺r
 * ??ifreleme anahtar覺 de??i??tirilirse, y繹netici web y繹netici konsolu ile kullan覺c覺lar覺 yeni anahtara ta??覺yabilir

 ## Kurulum
 `yuebing` docker, npm veya do??rudan kaynaktan y羹kleyebilir ve 癟al覺??t覺rabilirsiniz.

 ### liman i??癟isi
 Docker'覺n覺z varsa, Yuebing'i h覺zl覺 bir ??ekilde kullanmaya ba??layabilirsiniz:

    docker run -it cobbzilla/yuebing

 ### npm paketi
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### Kaynaktan
 Kaynaktan 癟al覺??t覺rmak i癟in nodejs v16+ ve ipli??e ihtiyac覺n覺z olacak

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

 Daha fazla bilgi i癟in [geli??tirici belgelerine](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) bak覺n

 ## Yap覺land覺rma
 Yuebing ile oynamak i癟in, hi癟bir ??eyi yap覺land覺rmadan ba??latmak sorun de??il.
 `yuebing` 癟al覺??t覺r覺n ve ba??lad覺??覺nda minimum yap覺land覺rmay覺 girmeniz istenecektir.

 Yuebing'i bir s羹re 癟al覺??t覺rmay覺 planl覺yorsan覺z, bunun i癟in [yap覺land覺rma belgelerine](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) bak覺n.
 ??eylerin nas覺l kurulaca??覺 hakk覺nda daha fazla bilgi.

 ### nginx yap覺land覺rmas覺
 Yuebing bir Nuxt uygulamas覺d覺r ve nginx'i (veya ba??ka bir web sunucusunu)
 SSL'yi i??lemek, gerekirse h覺z s覺n覺rlamas覺 vb.

 nginx kullan覺yorsan覺z, kullanabilece??iniz bir [繹rnek yap覺land覺rma](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) burada.

 ## Neden yuebing ad覺?
 [Tav??an Oolong](https://en.wikipedia.org/wiki/Oolong_(tav??an)) 癟ok sevimli ve 羹nl羹yd羹
 [erken internet meme](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong 2003 y覺l覺nda 繹ld羹,
 kitlesel olarak pop羹ler bir video hizmeti bile var olmadan iki y覺l 繹nce!

 Oolong'un halefinin ad覺 Yuebing'di. Yuebing, Oolong kadar 羹nl羹 de??ildi ama bunun bir 繹nemi var m覺yd覺?
 Yuebing yine de ba??ar覺l覺 oldu.

 Belki daha da ilginci, yuebing [mooncake](https://en.wikipedia.org/wiki/Mooncake) anlam覺na gelir.
 (??ince: [???擖奭(https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Japonca: [???擗?](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); ay kekleri 癟ok lezzetlidir ve i癟inde bulunabilir.
 癟ok 癟e??itli tatlar ve stiller. Geleneksel bir b繹lgesel tarz覺n tad覺n覺 癟覺kar覺n ya da 癟a??da??tan egzotik bir pasta deneyin
 lezzetli bir ??ekilde ke??fedilmemi?? b繹lgeleri ke??feden f覺r覺nc覺lar! Ger癟ekten herkes i癟in bir yuebing var!

</pre>
