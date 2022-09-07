Yuebing 🥮
 ==========
 Ang Yuebing ay open-source na software para sa pagpapatakbo ng mga site ng pagho-host ng video.

 Awtomatiko nitong tina-transcode ang iyong mga pinagmulang video sa mga modernong format ng streaming, na puwedeng laruin sa alinman
 device sa anumang koneksyon.

 Maaaring gamitin ni Yuebing ang Amazon S3 o Backblaze B2 para sa backend na storage, at mayroong maraming advanced na feature.

 ### Pinagmulan
 * [yuebing sa GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing sa npm](https://www.npmjs.com/package/yuebing)
 * [yuebing sa DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Nilalaman
 * [Inspirasyon](#Inspirasyon)
 * [Mga Tampok](#Mga Tampok)
 * [Pag-install](#Pag-install)
 * [Docker](#Docker)
 * [npm package](#npm-package)
 * [Mula sa pinagmulan](#From-source)
 * [Configuration](#Configuration)
 * [nginx config](#nginx-config)
 * [Bakit yuebing ang pangalan?](#Why-the-name-yuebing?)

 ## Inspirasyon
 Noong nakaraang taon ang aking ina ay gumugol ng isang toneladang oras (at pera!) upang ayusin at i-digitize ang isang archive ng mga lumang video ng pamilya.
 Ang ilan sa mga ito ay medyo matanda na, pabalik noong dekada ng 1950. Talagang maganda, klasikong bagay.

 Gusto naming pribadong ibahagi ang mga ito sa pamilya, ngunit *hindi sa malaking teknolohiya*.
 Ang pagpunta sa "libre" na pagho-host ng video mula sa isang pangunahing provider ay hindi dapat gawin.

 Ano ang hinahanap namin:
 * Self-host, ngunit ganap na **madaling gamitin** upang tumakbo at mapanatili
 * Mga stream sa modernong mga format ng video, kabilang ang adaptive bitrate
 * Nagpe-play ang mga video sa anumang device, desktop o mobile
 * Sa isang high-bandwidth na koneksyon, ang kalidad ng video ay kahanga-hanga; kasing ganda nito
 * **Kahit na may masamang koneksyon**, ang pag-playback ay disenteng kalidad at *hindi lumalaktaw o buffer*
 * Naka-encrypt na storage, kaya nagagamit ang mga pampublikong solusyon sa cloud storage nang may kumpiyansa
 * Stateless server: ipagpatuloy ang anumang bagay na mahalaga sa storage na lubos na nababanat
 * **Ayokong mag-alala tungkol sa mga backup!**
 ** Ito ay isang magandang magkaroon. Bilang ito ay lumiliko out walang anumang bagay na tulad nito. Si Yuebing!*
 * Pagkatapos magpatakbo ng isang malakas na instance para i-transcode ang lahat, sirain ito at magpatakbo ng isang bagay na mas mura para sa pangmatagalan
 * Maaari mong patakbuhin ang Yuebing nang mas mababa sa $10/buwan; at sana ay mas kaunti pa habang na-optimize natin ang footprint ni Yuebing

 Nagtagal ako ng ilang linggo para suriin kung ano ang nasa labas. Sinimulan kong i-relax nang husto ang aking mga kinakailangan, at gayon pa man
 walang mahanap na disente. Tumingin ako sa ilang mga open source na proyekto, hindi ko sinasabi kung alin dahil mayroon silang lahat
 maramihang nakasisilaw na mga bahid.

 Kaya, nagpasya ako, gaano kahirap ito? I-wire up mo ang S3 sa ffmpeg, ilagay ang isang disenteng modernong frontend dito, at tapos ka na,
 tama ba?

 .... uh, OK, halos isang buwan na ako sa puntong ito, pero sobrang saya! Sana ay mag-enjoy ka rin!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Gawin nating napakadali ang pagho-host ng mga video site!**</a>

 ## Mga Tampok
 * Ibahin ang anyo ng isang S3 bucket na may mga video sa isang pribadong video site para sa mga kaibigan at pamilya!
 * Ikonekta ang isa o higit pang source bucket na nagbibigay ng mga raw media file
 * Awtomatikong tina-transcode ni Yuebing ang mga source na video sa pinakabago at pinaka-tinatanggap na suportadong format para sa adaptive bitrate streaming (DASH/mp4)
 * LAHAT ng data ay nakaimbak sa patutunguhang bucket, kaya maaari mong sirain ang lalagyan at ilabas ito sa ibang pagkakataon
 * Kapaki-pakinabang para sa pagtakbo sa simula sa isang instance na na-optimize ng CPU para sa paunang pagbabago, pagkatapos ay patakbuhin ang \
    on a much cheaper instance for 24/7/365 service.
 * Sinusuportahan ang ganap na naka-encrypt na storage (app-side encryption, ikaw lang ang may susi)
 * Palaging read-only mula sa pinagmulan, huwag baguhin ang pinagmulang nilalaman
 * Awtomatiko at manu-manong pag-scan para sa mga bagong media file
 * Gaano ka pribado o pampubliko ang gusto mo ng mga bagay? Sinusuportahan ni Yuebing:
 * Ganap na pribado: walang media na ipinapakita sa mga hindi kilalang user, tanging mga aprubadong email address lang ang makakagawa ng mga account
 * Semi-private: walang media na ipinapakita sa mga hindi kilalang user, ngunit kahit sino ay maaaring gumawa ng user account
 * Pampubliko na may limitadong pagpaparehistro: media na ipinapakita sa lahat, ngunit ang mga aprubadong email address lamang ang makakagawa ng mga account
 * Ganap na pampubliko: media na ipinapakita sa lahat, at sinuman ay maaaring lumikha ng isang user account
 * Ganap na internationalized! Lahat ng text na nakikita ng user (at iba pang bagay na partikular sa lokal) ay nagmumula sa mga lokal na mapagkukunan
 * [Tulungan ang komunidad, isalin ang Yuebing sa mga bagong wika!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Full-feature na admin console
 * **Isang bagay na inaamin ko ay nakakainis pa rin:**
 * Ang "karanasan sa pagtuklas" ay binubuo sa *pag-navigate sa isang hierarchy ng direktoryo*. Iyon ay **sobrang pilay**, ngunit kailangan naming magsimula sa isang lugar.
 * Magdaragdag kami ng suporta para sa tamang paghahanap, pag-tag, mga mungkahi, atbp.
 * OK, mayroon talagang maraming bagay na hindi maganda, at ito ay ganap na 1.0 software, ngunit ang mga bagay na gumagana ay medyo cool.
 * <a href="https://www.patreon.com/cobbzilla">**Malapit na kasama ang iyong suporta**</a> :
 * Suporta para sa higit pang mga uri ng media (audio, mga imahe, atbp)
 * Media na na-upload ng user
 * Bagong "uri ng pinagmulan": Isa pang halimbawa ng Yuebing!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Anonymous na tampok ng user (kung ang site ay na-configure upang payagan ang mga hindi kilalang bisita)
 * Mag-browse ng media
 * Manood ng media!
 * Lumikha ng account (kung ang site ay na-configure upang payagan ang pagpaparehistro ng account)

 ## Mga feature ng user na naka-log in
 * Mag-browse ng media
 * Manood ng media!
 * Magdagdag ng komento, i-edit ang iyong komento, tanggalin ang iyong komento!
 * Tulad ng media (paparating na!)
 * Mag-imbita ng mga kaibigan
 * Itakda ang wika sa Ingles o Pranses (mangyaring magdagdag ng higit pang mga pagsasalin!)
 * I-edit ang impormasyon ng account
 * Tanggalin ang account, tanggalin ang lahat ng bagay na sa iyo kasama ang lahat ng iyong mga komento

 ## Mga tampok ng user ng admin
 * I-edit ang metadata ng media, tingnan ang mga thumbnail, baguhin ang napiling thumbnail
 * Tingnan ang media transform queue at katayuan ng trabaho
 * Magsimula ng mga bagong pag-scan at pag-index ng source media

 ## Mga tampok ng server/backend
 * Transient-friendly, ZERO persistent/important data ay naka-store sa loob ng container.
 * Ang lahat ng matibay na data ay nananatili sa patutunguhang bucket; esensyal, ginagamit namin ang S3 bilang aming database
 * Awtomatikong pana-panahong pag-scan ng source bucket para sa bagong media
 * Magdagdag at baguhin ang media metadata; Ang mga pag-edit ay iniimbak sa patutunguhang bucket, ang pinagmulang media ay hindi kailanman nababago
 * Nako-configure ang mga profile ng output. Ang default ay DASH-mp4 na may apat na profile, na sumusuporta sa mga antas ng kalidad mula sa mas mahusay kaysa sa HD hanggang sa napakababang bandwidth
 * Ang impormasyon ng user account ay nakaimbak din sa patutunguhang bucket, opsyonal na naka-encrypt
 * Kung binago ang encryption key, maaaring ilipat ng admin ang mga user sa bagong key gamit ang web admin console

 ## Pag-install
 Maaari mong i-install at patakbuhin `yuebing` pamamagitan ng docker, npm o direkta mula sa pinagmulan.

 ### Docker
 Kung mayroon kang docker, maaari kang magsimula sa Yuebing nang mabilis:

    docker run -it cobbzilla/yuebing

 ### npm package
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### Mula sa pinagmulan
 Upang tumakbo mula sa pinagmulan, kakailanganin mo ng mga nodejs v16+ at sinulid

    # Clone source and install dependencies
    git clone https://github.com/cobbzilla/yuebing.git
    cd yuebing
    yarn install

    # Use the 'yuebing' command from the git repo
    ./yuebing

    # Or, since you have the source, run any of the yarn scripts
    yarn docker-run-dev # Fastest build & startup, dev docker image
    yarn docker-run # Faster at runtime, production docker image

 Tingnan ang [mga doc ng developer](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) para sa higit pang impormasyon

 ## Configuration
 Para makipaglaro kay Yuebing, mainam na simulan ito nang hindi nagko-configure ng anuman.
 Patakbuhin `yuebing` at ipo-prompt kang ipasok ang minimal na config kapag nagsimula ito.

 Kung plano mong patakbuhin ang Yuebing saglit, tingnan ang [configuration docs](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) para sa
 higit pang impormasyon sa kung paano i-set up ang mga bagay.

 ### nginx config
 Ang Yuebing ay isang Nuxt app lamang, at inaasahan na maglalagay ka ng nginx (o ilang iba pang web server) sa
 harap nito upang pangasiwaan ang SSL, paglilimita sa rate kung kinakailangan, atbp.

 Kung gumagamit ka ng nginx, narito ang isang [sample config](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) na magagamit mo.

 ## Bakit yuebing ang pangalan?
 [Oolong the rabbit](https://en.wikipedia.org/wiki/Oolong_(rabbit)) ay isang kaibig-ibig at sikat
 [maagang internet meme](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Namatay si Oolong noong 2003,
 dalawang taon bago umiral ang isang partikular na sikat na serbisyo ng video!

 Ang kahalili ni Oolong ay pinangalanang Yuebing. Si Yuebing ay hindi kasing sikat ni Oolong, ngunit mahalaga ba iyon?
 Gayunpaman, nagtagumpay si Yuebing.

 Marahil mas kawili-wili, ang ibig sabihin ng yuebing ay [mooncake](https://en.wikipedia.org/wiki/Mooncake)
 (Intsik: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Japanese: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); Ang mga mooncake ay napakasarap at makikita sa
 isang malawak na iba't ibang mga lasa at estilo. Mag-enjoy sa istilong rehiyonal na pinarangalan ng panahon, o subukan ang kakaibang cake mula sa kontemporaryo
 mga panadero na nag-e-explore ng masarap na teritoryong wala sa mapa! Tunay na may yuebing para sa lahat!

</pre>
