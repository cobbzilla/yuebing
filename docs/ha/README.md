Yuebing 🥮
 =========
 Yuebing software ce ta buɗe tushen don gudanar da rukunin yanar gizon bidiyo.

 Yana canza bidiyon tushen ku ta atomatik zuwa tsarin yawo na zamani, wanda za'a iya kunnawa akan kowane
 na'urar akan kowane haɗi.

 Yuebing na iya amfani da Amazon S3 ko Backblaze B2 don ajiyar baya, kuma yana da fasali da yawa.

 ### Source
 * [yuebing akan GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing akan npm](https://www.npmjs.com/package/yuebing)
 * [yuebing akan DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

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
 A bara mahaifiyata ta kashe ton na lokaci (da kuɗi!) don tsarawa da ƙididdige tarihin tsoffin bidiyon iyali.
 Wasu daga cikin waɗannan sun tsufa sosai, sun koma shekarun 1950. Kyawawan gaske, kayan gargajiya.

 Mun so mu raba waɗannan tare da dangi, amma *ba tare da manyan fasaha ba*.
 Tafi tare da "free" bidiyo hosting daga babban mai bada ya kasance daga tebur.

 Abin da muke nema:
 * Mai ɗaukar nauyin kai, amma gabaɗaya ** hannu-kashe mai sauƙi *** don gudu da kulawa
 * Yawo a cikin tsarin bidiyo na zamani, gami da daidaita bitrate
 * Bidiyo suna wasa akan kowace na'ura, tebur ko wayar hannu
 * Tare da babban haɗin bandwidth, ingancin bidiyo yana da ban mamaki; da kyau yadda ake samu
 ** Ko da tare da mummunan haɗin gwiwa ***, sake kunnawa yana da inganci mai kyau kuma * baya tsallakewa ko ɓoyewa*
 * Ma'ajiyar rufaffiyar, don haka iya amfani da hanyoyin ajiyar girgije na jama'a tare da wasu kwarin gwiwa
 * Uwar garken da ba ta da ƙasa: nace duk wani abu mai mahimmanci ga ajiya mai juriya sosai
 **Bana son damuwa game da madadin!**
 * Wannan abu ne mai kyau don samun. Kamar yadda ya fito babu wani abu kamar wannan. Yuebing ya!*
 * Bayan gudanar da misalin naman sa don canza komai, tarwatsa shi kuma gudanar da wani abu mai rahusa na dogon lokaci
 * Kuna iya gudanar da Yuebing a ƙasa da $10 / wata; kuma da fatan har ma da rage kan hanya yayin da muke inganta sawun Yuebing

 Na ɗauki makonni biyu don bincika abin da ke can. Na fara sassauta buƙatu na sosai, kuma har yanzu
 ba zai iya samun wani abu mai kyau ba. Na kalli ayyukan buɗaɗɗen maɓuɓɓuka da yawa, ba na faɗi wanne ne saboda duk suna da su
 mahara kyalli flaws.

 Don haka, na yanke shawarar, yaya wuya zai kasance? Kuna waya da S3 zuwa ffmpeg, sanya gaba mai kyau na zamani a kai, kuma kun gama,
 dama?

 .... uh, OK, Ina kusan wata guda a wannan lokacin, amma yana da ban sha'awa sosai! Ina fatan ku ma ku ji daɗinsa!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Bari mu sanya gidajen yanar gizon bidiyo masu ɗaukar nauyin kansu su zama masu sauƙi!**</a>

 ## Fasali
 * Canza guga S3 tare da bidiyo zuwa rukunin bidiyo mai zaman kansa don abokai da dangi!
 * Haɗa buckets guda ɗaya ko fiye da ke ba da fayilolin mai jarida danye
 * Yuebing yana canza bidiyo ta atomatik zuwa sabon tsari kuma mafi yawan tallafi don yawowar bitrate (DASH/mp4)
 * Duk bayanan ana adana su a cikin bokitin da aka nufa, don haka zaku iya lalata akwati ku kawo daga baya
 * Yana da amfani don gudana da farko akan ingantaccen misali na CPU don canjin farko, sannan kunna \
    on a much cheaper instance for 24/7/365 service.
 * Yana goyan bayan cikakken rufaffen ajiya (rufin-gefen app, kawai kuna da maɓallin)
 * Koyaushe karantawa-kawai daga tushe, kar a taɓa canza abun ciki na tushe
 * Bincike ta atomatik da hannu don sabbin fayilolin mai jarida
 * Yaya kuke son abubuwa na sirri ko na jama'a? Yuebing yana goyan bayan:
 * Gabaɗaya masu zaman kansu: babu kafofin watsa labarai da aka nuna ga masu amfani da ba a san su ba, adiresoshin imel da aka yarda kawai zasu iya ƙirƙirar asusu
 * Semi-private: babu kafofin watsa labarai da aka nuna ga masu amfani da ba a san su ba, amma kowa na iya ƙirƙirar asusun mai amfani
 * Jama'a tare da iyakanceccen rajista: kafofin watsa labarai da aka nuna ga kowa, amma amintattun adiresoshin imel kawai zasu iya ƙirƙirar asusu
 * Gabaɗaya jama'a: kafofin watsa labarai da aka nuna ga kowa, kuma kowa na iya ƙirƙirar asusun mai amfani
 * Cikakken duniya! Duk rubutun ganuwa mai amfani (da sauran ƙayyadaddun ƙayyadaddun yanki) sun fito ne daga albarkatun gida
 * [Taimakawa al'umma, fassara Yuebing zuwa sababbin harsuna!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Cikakkun na'ura mai sarrafa na'ura
 **Abu daya da na yarda har yanzu yana tsotsa:**
 * "Kwarewar ganowa" ta ƙunshi * kewaya matsayi na directory *. Wannan shine *super gurgu**, amma sai mun fara wani wuri.
 * Za mu ƙara goyan baya don bincike mai kyau, yiwa alama, shawarwari, da sauransu.
 * Yayi, a zahiri akwai abubuwa da yawa waɗanda har yanzu suna tsotsewa, kuma wannan software ce gabaɗaya 1.0, amma kayan da ke aiki suna da kyau sosai.
 <a href="https://www.patreon.com/cobbzilla">**Zan zo nan ba da jimawa ba tare da tallafin ku**</a> :
 * Taimako don ƙarin nau'ikan kafofin watsa labarai (audio, hotuna, da sauransu)
 * Mai amfani da aka ɗora kafofin watsa labarai
 * Sabon "nau'in tushe": Wani misalin Yuebing!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Siffar mai amfani da ba a san su ba (idan an saita rukunin yanar gizon don ba da izinin baƙi ba a san su ba)
 * Binciken kafofin watsa labarai
 * Kalli kafofin watsa labarai!
 * Ƙirƙiri asusu (idan an saita rukunin yanar gizon don ba da izinin rajistar asusu)

 ## Fasalolin mai amfani da aka shiga
 * Binciken kafofin watsa labarai
 * Kalli kafofin watsa labarai!
 * Ƙara sharhi, gyara sharhin ku, share sharhinku!
 * Kamar kafofin watsa labarai (mai zuwa nan ba da jimawa ba!)
 * Gayyato abokai
 * Saita harshe zuwa Ingilishi ko Faransanci (da fatan za a ƙara ƙarin fassarori!)
 * Gyara bayanan asusu
 * Share asusu, yana goge duk abin da ke naku gami da duk maganganun ku

 ## Abubuwan masu amfani da admin
 * Shirya metadata na kafofin watsa labarai, duba takaitaccen siffofi, canza babban takaitaccen siffofi
 * Duba jerin gwano mai canza labarai da matsayin aiki
 * Fara sabon bincike da fihirisar kafofin watsa labarai na tushe

 ## Sabar uwar garken/baya
 * Abokai na wucin gadi, ZERO naci / mahimman bayanai ana adana su a cikin akwati.
 * Duk bayanai masu ɗorewa suna dagewa a cikin bokitin manufa; da gaske, muna amfani da S3 azaman bayanan mu
 * Bincike ta atomatik na bokitin tushe don sabbin kafofin watsa labarai
 * Ƙara kuma canza metadata mai jarida; Ana adana gyare-gyare a kan guga mai zuwa, kafofin watsa labarai ba a taɓa yin gyare-gyare ba
 * Bayanan martaba masu daidaitawa. Default shine DASH-mp4 tare da bayanan martaba guda huɗu, yana tallafawa matakan inganci daga mafi kyawun-HD zuwa babban-ƙananan bandwidth
 * Ana kuma adana bayanan asusun mai amfani a kan guga mai zuwa, rufaffen zaɓi na zaɓi
 * Idan an canza maɓallin ɓoyewa, mai gudanarwa na iya ƙaura masu amfani zuwa sabon maɓalli tare da na'ura mai sarrafa yanar gizo

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
 Don gudu daga tushe, kuna buƙatar nodejs v16+ da yarn

    # Clone source and install dependencies
    git clone https://github.com/cobbzilla/yuebing.git
    cd yuebing
    yarn install

    # Use the 'yuebing' command from the git repo
    ./yuebing

    # Or, since you have the source, run any of the yarn scripts
    yarn docker-run-dev # Fastest build & startup, dev docker image
    yarn docker-run # Faster at runtime, production docker image

 Duba [docs developer](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) don ƙarin bayani

 ## Kanfigareshan
 Don yin wasa tare da Yuebing, yana da kyau a fara shi ba tare da saita komai ba.
 Gudu `yuebing` kuma za a sa ka shigar da ƙaramin tsari lokacin da ya fara.

 Idan kuna shirin tafiyar da Yuebing na ɗan lokaci, duba [docs na daidaitawa](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) don
 ƙarin bayani kan yadda ake saita abubuwa.

 ### nginx config
 Yuebing app ne kawai na Nuxt, kuma yana tsammanin za ku saka nginx (ko wasu sabar gidan yanar gizo) a ciki.
 gabansa don sarrafa SSL, iyakance ƙimar idan an buƙata, da sauransu.

 Idan kana amfani da nginx, ga [samfurin config](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) zaka iya amfani dashi.

 ## Me yasa sunan yuebing?
 [Oolong the zomo](https://en.wikipedia.org/wiki/Oolong_(zomo)) kyakkyawa ne kuma sananne
 [farkon intanet meme](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong ya mutu a shekara ta 2003.
 shekaru biyu kafin wani sanannen sabis na bidiyo ya wanzu!

 An kira magajin Oolong Yuebing. Yuebing bai kusan shahara kamar Oolong ba, amma shin hakan ma yana da mahimmanci?
 Yuebing ya yi nasara duk da haka.

 Wataƙila mafi ban sha'awa, yuebing yana nufin [mooncake](https://en.wikipedia.org/wiki/Mooncake)
 ( Sinanci: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Jafananci: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); mooncakes suna da daɗi sosai kuma ana iya samun su a ciki
 nau'ikan dandano da salo iri-iri. Yi farin ciki da salon yanki na lokaci-girmamawa, ko gwada kek mai ban mamaki daga zamani
 masu yin burodi waɗanda ke binciken yanki mai daɗi da ba a tantance ba! Akwai gaske yuebing ga kowa da kowa!

</pre>
