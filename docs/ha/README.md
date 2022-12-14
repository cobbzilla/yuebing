Yuebing ð¥®
 =========
 Yuebing software ce ta buÉe tushen don gudanar da rukunin yanar gizon bidiyo.

 Yuebing yana shirya bidiyon tushen ku ta atomatik don yawo ta amfani da tsarin zamani, ana iya kunna kowane
 na'urar akan kowane haÉi.

 Yuebing na iya amfani da Amazon S3 ko Backblaze B2 don ajiyar baya, kuma yana da fasali da yawa.

 ### Source
 * [yuebing akan GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing akan npm](https://www.npmjs.com/package/yuebing)
 * [yuebing akan DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Karanta wannan a wani yare
 An fassara wannan takaddar README.md, ta [hokeylization](https://github.com/cobbzilla/hokeylization), zuwa
 harsuna da yawa.

 Na tabbata ba cikakke ba ne, amma ina fata ya fi komai kyau!

 [ð¸ð¦ Larabci](../ar/README.md)
 [ð§ð© Bengali](../bn/README.md)
 [ð©ðª Jamusanci](../de/README.md)
 [ðºð¸ Turanci](../ha/README.md)
 [ðªð¸ Mutanen Espanya](../es/README.md)
 [ð«ð· Faransanci](../fr/README.md)
 [ð¹ð© Hausa](../ha/README.md)
 [ð®ð³ Hindi](../hi/README.md)
 [ð®ð© Indonesian](../id/README.md)
 [ð®ð¹ Italiyanci](../it/README.md)
 [ð¯ðµ Jafananci](../ja/README.md)
 [ð°ð· Korean](../ko/README.md)
 [ð®ð³ Maranthi](../mr/README.md)
 [ðµð± Yaren mutanen Poland](../pl/README.md)
 [ð§ð· Portuguese](../pt/README.md)
 [ð·ðº Rashanci](../ru/README.md)
 [ð°ðª Swahili](../sw/README.md)
 [ðµð­ Tagalog](../tl/README.md)
 [ð¹ð· Baturke](../tr/README.md)
 [ðµð° Urdu](../ur/README.md)
 [ð»ð³ Vietnamese](../vi/README.md)
 [ð¨ð³ Sinanci](../zh/README.md)
 ----

 # Abubuwan ciki
 * [Wahayi](#Wahayi)
 * [Features](#Features)
 * [Shigarwa](#Shigarwa)
 * [Docker](#Docker)
 * [kunshin npm](#npm-kunshin)
 * [Daga tushe](#Daga-source)
 * [Tsarin aiki](#Tsarin)
 * [Nginx config](#nginx-config)
 * [Me yasa sunan yuebing?](#Why-the-name-yuebing?)

 ## Wahayi
 A bara mahaifiyata ta kashe ton na lokaci (da kuÉi!) don tsarawa da Æididdige tarihin tsoffin bidiyon iyali.
 Wasu daga cikin waÉannan sun tsufa sosai, sun koma shekarun 1940. Kyawawan gaske, kayan gargajiya.

 Mun so mu raba waÉannan tare da dangi, amma *ba tare da manyan fasaha ba*.
 Tafi tare da "free" bidiyo hosting daga babban mai bada ya kasance daga tebur.

 Abin da muke nema:
 * Mai Éaukar nauyin kai, amma gabaÉaya ** hannu-kashe mai sauÆi *** don gudu da kulawa
 * Yawo a cikin tsarin bidiyo na zamani, gami da daidaita bitrate
 * Bidiyo suna wasa akan kowace na'ura, tebur ko wayar hannu
 * Tare da babban haÉin bandwidth, ingancin bidiyo yana da ban mamaki; da kyau yadda ake samu
 ** Ko da tare da mummunan haÉin gwiwa ***, sake kunnawa yana da inganci mai kyau kuma * baya tsallakewa ko Éoyewa*
 * Ma'ajiyar rufaffiyar, don haka iya amfani da hanyoyin ajiyar girgije na jama'a tare da wasu kwarin gwiwa
 * Uwar garken da ba ta da Æasa: nace duk wani abu mai mahimmanci ga ajiya mai juriya sosai
 **Bana son damuwa game da madadin!**
 * Wannan abu ne mai kyau don samun. Kamar yadda ya fito babu wani abu kamar wannan. Yuebing ya!*
 * Bayan gudanar da misalin naman sa don canza komai, tarwatsa shi kuma gudanar da wani abu mai rahusa na dogon lokaci
 * Kuna iya gudanar da Yuebing a Æasa da $10 / wata; kuma da fatan har ma da rage kan hanya yayin da muke inganta sawun Yuebing

 Na Éauki makonni biyu don bincika abin da ke can. Na fara sassauta buÆatu na sosai, kuma har yanzu
 ba zai iya samun wani abu mai kyau ba. Na kalli ayyukan buÉaÉÉen maÉuÉÉuka da yawa, ba na faÉi wanne ne saboda duk suna da su
 mahara kyalli flaws.

 Don haka, na yanke shawarar, yaya wuya zai kasance? Kuna waya da S3 zuwa ffmpeg, sanya gaba mai kyau na zamani a kai, kuma kun gama, daidai?
 ... da kyau, uh, yawancin aikin ya Éauki watanni biyu, amma yana da daÉi da yawa don tsayawa!
 Ina fatan ku ma ku ji daÉinsa!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Bari mu sanya gidajen yanar gizon bidiyo masu Éaukar nauyin kansu su zama masu sauÆi!**</a>

 ## Fasali
 * Canza guga na bidiyo S3 (ko B2) zuwa rukunin bidiyo na sirri don abokai da dangi!
 * HaÉa buckets guda Éaya ko fiye da ke ba da fayilolin mai jarida danye
 * Yuebing yana canza bidiyo ta atomatik zuwa sabon tsari kuma mafi yawan tallafi don yawowar bitrate (DASH/mp4)
 * DUKAN bayanan ana adana su a cikin bokitin manufa; za ku iya lalata uwar garken a duk lokacin da kuke so
 * Yana da amfani don yin aiki da farko akan ingantaccen misali na CPU don fassarar farko, sannan kunna \
    on a much cheaper instance for 24/7/365 service.
 * Yana goyan bayan cikakken rufaffen ajiya (rufin-gefen app, kawai kuna da maÉallin)
 * Koyaushe karantawa-kawai daga tushe, kar a taÉa canza abun ciki na tushe
 * Bincike ta atomatik da hannu don sabbin fayilolin mai jarida
 * Yaya kuke son abubuwa na sirri ko na jama'a? Yuebing yana goyan bayan:
 * GabaÉaya masu zaman kansu: babu kafofin watsa labarai da aka nuna ga masu amfani da ba a san su ba, adiresoshin imel da aka yarda kawai zasu iya ÆirÆirar asusu
 * Semi-private: babu kafofin watsa labarai da aka nuna ga masu amfani da ba a san su ba, amma kowa na iya ÆirÆirar asusun mai amfani
 * Jama'a tare da iyakanceccen rajista: kafofin watsa labarai da aka nuna ga kowa, amma amintattun adiresoshin imel kawai zasu iya ÆirÆirar asusu
 * GabaÉaya jama'a: kafofin watsa labarai da aka nuna ga kowa, kuma kowa na iya ÆirÆirar asusun mai amfani
 * Cikakken duniya! Duk rubutun ganuwa mai amfani (da sauran Æayyadaddun Æayyadaddun yanki) sun fito ne daga albarkatun gida
 * [Taimakawa al'umma, fassara Yuebing zuwa sababbin harsuna!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Cikakkun na'ura mai sarrafa na'ura
 * Bincika bidiyo ta keywords, ko daga alamar girgije
 <a href="https://www.patreon.com/cobbzilla">**Zan zo nan ba da jimawa ba tare da tallafin ku**</a> :
 * Taimako don Æarin nau'ikan kafofin watsa labarai (audio, hotuna, da sauransu)
 * Mai amfani da aka Éora kafofin watsa labarai
 * So, rabawa, da sanarwar turawa
 * Sabon "nau'in tushe": Wani misalin Yuebing!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Siffar mai amfani da ba a san su ba (idan an saita rukunin yanar gizon don ba da izinin baÆi ba a san su ba)
 * Binciken kafofin watsa labarai
 * Kalli kafofin watsa labarai!
 * ÆirÆiri asusu (idan an saita rukunin yanar gizon don ba da izinin rajistar asusu)

 ## Fasalolin mai amfani da aka shiga
 * Binciken kafofin watsa labarai
 * Kalli kafofin watsa labarai!
 * Æara sharhi, gyara sharhin ku, share sharhinku!
 * Gayyato abokai
 * Gyara bayanan asusu
 * Share asusu, yana goge duk abin da ke naku gami da duk maganganun ku

 ## Abubuwan masu amfani da admin
 * Shirya metadata na kafofin watsa labarai, duba takaitaccen siffofi, canza babban takaitaccen siffofi
 * Duba jerin gwano mai canza labarai da matsayin aiki
 * Fara sabon bincike da fihirisar kafofin watsa labarai na tushe

 ## Sabar uwar garken/baya
 * Abokai na wucin gadi, ZERO naci / mahimman bayanai ana adana su a cikin akwati.
 * Duk bayanai masu Éorewa suna dagewa a cikin bokitin manufa; da gaske, muna amfani da S3 azaman bayanan mu
 * Bincike ta atomatik na bokitin tushe don sabbin kafofin watsa labarai
 * Æara kuma canza metadata mai jarida; Ana adana gyare-gyare a kan guga mai zuwa, kafofin watsa labarai ba a taÉa yin gyare-gyare ba
 * Bayanan martaba masu daidaitawa. Default shine DASH-mp4 tare da Æananan bayanan martaba masu yawa
 * Ana kuma adana bayanan asusun mai amfani a kan guga mai zuwa, rufaffen zaÉi na zaÉi
 * Idan an canza maÉallin Éoyewa, mai gudanarwa na iya Æaura masu amfani zuwa sabon maÉalli tare da na'ura mai sarrafa yanar gizo

 ## Shigarwa
 Kuna iya shigar da kunna `yuebing` ta hanyar docker, npm ko kai tsaye daga tushe.

 ### Docker
 Idan kuna da docker, zaku iya farawa da Yuebing da sauri:

    docker run -it cobbzilla/yuebing

 Kunshin ### npm
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### Daga tushe
 Don gudu daga tushe, kuna buÆatar nodejs v16+ da yarn

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

 Duba [docs developer](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) don Æarin bayani

 ## Kanfigareshan
 Don yin wasa tare da Yuebing, yana da kyau a fara shi ba tare da saita komai ba.
 Gudu `yuebing` kuma za a sa ka shigar da Æaramin tsari lokacin da ya fara.

 Idan kuna shirin tafiyar da Yuebing na Éan lokaci, duba [docs na daidaitawa](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) don
 Æarin bayani kan yadda ake saita abubuwa.

 ### nginx config
 Yuebing app ne na Nuxt, kuma yana tsammanin zaku saka nginx (ko wasu sabar gidan yanar gizo) a ciki.
 gabansa don sarrafa SSL, iyakance Æimar idan an buÆata, da sauransu.

 Idan kana amfani da nginx, ga [samfurin config](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) zaka iya amfani dashi.

 ## Me yasa sunan yuebing?
 [Oolong the zomo](https://en.wikipedia.org/wiki/Oolong_(zomo)) kyakkyawa ne kuma sananne
 [farkon intanet meme](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong ya mutu a shekara ta 2003.
 shekaru biyu kafin wani sanannen sabis na bidiyo ya wanzu!

 An kira magajin Oolong Yuebing. Yuebing bai kusan shahara kamar Oolong ba, amma shin hakan ma yana da mahimmanci?
 Yuebing ya yi nasara duk da haka.

 WataÆila mafi ban sha'awa, yuebing yana nufin [mooncake](https://en.wikipedia.org/wiki/Mooncake)
 ( Sinanci: [æé¥¼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Jafananci: [æé¤](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); mooncakes suna da daÉi sosai kuma ana iya samun su a ciki
 nau'ikan dandano da salo iri-iri. Yi farin ciki da salon yanki na lokaci-girmamawa, ko gwada kek mai ban mamaki daga zamani
 masu yin burodi waÉanda ke binciken yanki mai daÉi da ba a tantance ba! Akwai gaske yuebing ga kowa da kowa!

</pre>
