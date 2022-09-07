Yuebing 🥮
 ===========
 Yuebing ni programu huria ya kuendesha tovuti za upangishaji video.

 Hubadilisha kiotomatiki video zako chanzo hadi umbizo la kisasa la utiririshaji, linaloweza kuchezwa kwenye yoyote
 kifaa juu ya uhusiano wowote.

 Yuebing inaweza kutumia Amazon S3 au Backblaze B2 kwa hifadhi ya nyuma, na ina vipengele vingi vya kina.

 ### Chanzo
 * [yuebing kwenye GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing on npm](https://www.npmjs.com/package/yuebing)
 * [yuebing kwenye DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Soma hii kwa lugha nyingine
 Hati hii ya README.md imetafsiriwa, kupitia [hokeylization](https://github.com/cobbzilla/hokeylization), hadi
 lugha nyingi tofauti.

 Nina hakika sio kamili, lakini natumai ni bora kuliko chochote!

 [🇸🇦 Kiarabu](hati/ar/README.md)
 [🇧🇩 Kibengali](hati/bn/README.md)
 [🇩🇪 Kijerumani](../de/README.md)
 [🇺🇸 Kiingereza]( hati/sw/README.md)
 [🇪🇸 Kihispania](hati/es/README.md)
 [🇫🇷 Kifaransa](../fr/README.md)
 [🇹🇩 Kihausa](hati/ha/README.md)
 [🇮🇳 Kihindi](hati/hi/README.md)
 [🇮🇩 Kiindonesia](hati/id/README.md)
 [🇮🇹 Kiitaliano](hati/it/README.md)
 [🇯🇵 Kijapani](hati/ja/README.md)
 [🇰🇷 Kikorea](hati/ko/README.md)
 [🇮🇳 Maranthi](hati/mr/README.md)
 [🇵🇱 Kipolandi](hati/pl/README.md)
 [🇧🇷 Kireno](hati/pt/README.md)
 [🇷🇺 Kirusi](hati/ru/README.md)
 [🇰🇪 Kiswahili](hati/sw/README.md)
 [🇵🇭 Tagalog](../tl/README.md)
 [🇹🇷 Kituruki](hati/tr/README.md)
 [🇵🇰 Kiurdu](hati/ur/README.md)
 [🇻🇳 Kivietinamu](hati/vi/README.md)
 [🇨🇳 Kichina](hati/zh/README.md)
 ----

 # Yaliyomo
 * [Msukumo](#Msukumo)
 * [Vipengele](#Vipengele)
 * [Usakinishaji](#Usakinishaji)
 * [Docker](#Docker)
 * [npm package](#npm-furushi)
 * [Kutoka chanzo](#Kutoka-chanzo)
 * [Usanidi](#Usanidi)
 * [usanidi wa nginx](#nginx-config)
 * [Kwa nini jina yuebing?](#Kwa nini-jina-yuebing?)

 ##Msukumo
 Mwaka jana mama yangu alitumia toni ya muda (na pesa!) kupanga na kuweka kumbukumbu kwenye kumbukumbu ya video za zamani za familia.
 Baadhi yao walikuwa wazee sana, kuanzia miaka ya 1950. Mambo mazuri sana, ya classic.

 Tulitaka kushiriki haya kwa faragha na familia, lakini *sio kwa teknolojia kubwa*.
 Kwenda na upangishaji video "bila malipo" kutoka kwa mtoa huduma mkuu hakukuwa kwenye jedwali.

 Tulichokuwa tunatafuta:
 * Inajipangisha mwenyewe, lakini **kutoa mikono ni rahisi** kuendesha na kudumisha
 * Inatiririsha katika umbizo la kisasa la video, ikiwa ni pamoja na bitrate inayobadilika
 * Video hucheza kwenye kifaa chochote, kompyuta ya mezani au rununu
 * Kwa muunganisho wa data-bandwidth ya juu, ubora wa video ni wa kushangaza; nzuri kama inavyopata
 * **Hata ukiwa na muunganisho mbaya**, uchezaji ni ubora unaostahiki na *hakuruki au kuakibisha*
 * Hifadhi iliyosimbwa kwa njia fiche, kwa hivyo inaweza kutumia suluhisho za uhifadhi wa wingu wa umma kwa ujasiri fulani
 * Seva isiyo na uraia: dumisha kitu chochote muhimu kwa hifadhi ambacho kinaweza kustahimili hali ya juu
 **Sitaki kuwa na wasiwasi kuhusu nakala rudufu!**
 **Hii ilikuwa nzuri kuwa nayo. Kama ni zamu nje hakuna kitu kama hiki. Yuebing anafanya hivyo!*
 * Baada ya kuendesha mfano wa nyama ili kupitisha kila kitu, kibomoe na uendeshe kitu cha bei nafuu kwa muda mrefu
 * Unaweza kuendesha Yuebing kwa chini ya $10/mwezi; na tunatumai hata kidogo barabarani tunapoboresha nyayo za Yuebing

 Nilichukua wiki kadhaa kuchunguza kile kilichokuwa huko nje. Nilianza kupumzika sana mahitaji yangu, na bado
 hakuweza kupata chochote cha heshima. Niliangalia miradi kadhaa ya chanzo wazi, sisemi ni ipi kwa sababu wote walikuwa nayo
 kasoro nyingi za kung'aa.

 Kwa hiyo, niliamua, inaweza kuwa ngumu kiasi gani? Unaweka waya S3 kwa ffmpeg, weka sehemu ya mbele ya kisasa juu yake, na umemaliza,
 haki?

 .... uh, Sawa, nina karibu mwezi mmoja kwa wakati huu, lakini inafurahisha sana! Natumai unaifurahia pia!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Hebu tufanye tovuti za kujipangia video kuwa rahisi sana!**</a>

 ## Vipengele
 * Badilisha ndoo ya S3 na video kuwa tovuti ya kibinafsi ya video kwa marafiki na familia!
 * Unganisha ndoo moja au zaidi chanzo kutoa faili ghafi za midia
 * Yuebing hupitisha msimbo wa video kiotomatiki hadi umbizo la hivi punde zaidi na linalotumika zaidi kwa utiririshaji wa kasi wa biti (DASH/mp4)
 * Data ZOTE huhifadhiwa kwenye ndoo lengwa, ili uweze kuharibu kontena na kuileta baadaye
 * Inafaa kwa kukimbia mwanzoni kwa mfano ulioboreshwa na CPU kwa mabadiliko ya awali, kisha endesha \
    on a much cheaper instance for 24/7/365 service.
 * Inasaidia uhifadhi uliosimbwa kikamilifu (usimbuaji wa upande wa programu, ni wewe tu una ufunguo)
 * Soma-tu kutoka kwa chanzo kila wakati, usiwahi kubadilisha maudhui ya chanzo
 * Uchanganuzi wa kiotomatiki na mwongozo kwa faili mpya za media
 * Je! Unataka mambo ya kibinafsi au ya umma? Yuebing inasaidia:
 * Faragha kabisa: hakuna maudhui yanayoonyeshwa kwa watumiaji wasiojulikana, ni anwani za barua pepe zilizoidhinishwa pekee zinazoweza kuunda akaunti
 * Ya faragha: hakuna media inayoonyeshwa kwa watumiaji wasiojulikana, lakini mtu yeyote anaweza kuunda akaunti ya mtumiaji
 * Hadharani kwa usajili mdogo: maudhui yanayoonyeshwa kwa kila mtu, lakini ni anwani za barua pepe zilizoidhinishwa pekee zinazoweza kuunda akaunti
 * Hadharani kabisa: media inayoonyeshwa kwa kila mtu, na mtu yeyote anaweza kuunda akaunti ya mtumiaji
 * Kikamilifu kimataifa! Maandishi yote yanayoonekana na mtumiaji (na mambo mengine mahususi ya eneo) hutoka kwenye rasilimali zilizojanibishwa
 * [Isaidie jumuiya, kutafsiri Yuebing hadi lugha mpya!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Kiweko kamili cha msimamizi
 **Jambo moja ninakiri bado ni mbaya kabisa:**
 * "Ugunduzi" unajumuisha *kuelekeza safu ya saraka*. Hiyo ni ** super lame **, lakini ilibidi kuanza mahali fulani.
 * Tutaongeza usaidizi kwa utafutaji sahihi, kuweka lebo, mapendekezo, n.k.
 * Sawa, kuna mambo mengi ambayo bado ni duni, na hii ni programu 1.0 kabisa, lakini mambo yanayofanya kazi ni mazuri sana.
 <a href="https://www.patreon.com/cobbzilla">**Inakuja hivi karibuni kwa usaidizi wako**</a> :
 * Msaada kwa aina zaidi za media (sauti, picha, nk)
 * Midia iliyopakiwa na mtumiaji
 * "Aina mpya ya chanzo": Mfano mwingine wa Yuebing!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Kipengele cha mtumiaji asiyejulikana (ikiwa tovuti imesanidiwa kuruhusu wageni wasiojulikana)
 * Vinjari media
 * Tazama media!
 * Unda akaunti (ikiwa tovuti imeundwa ili kuruhusu usajili wa akaunti)

 ## Vipengele vya mtumiaji aliyeingia
 * Vinjari media
 * Tazama media!
 * Ongeza maoni, hariri maoni yako, futa maoni yako!
 * Kama media (inakuja hivi karibuni!)
 * Alika marafiki
 * Weka lugha kwa Kiingereza au Kifaransa (tafadhali ongeza tafsiri zaidi!)
 * Badilisha maelezo ya akaunti
 * Futa akaunti, futa kila kitu ambacho ni chako pamoja na maoni yako yote

 ## Vipengele vya mtumiaji wa msimamizi
 * Badilisha metadata ya media, tazama vijipicha, badilisha kijipicha kilichochaguliwa
 * Tazama foleni ya kubadilisha media na hali ya kazi
 * Anzisha skana mpya na faharisi za media chanzo

 ## Vipengele vya seva/nyuma
 * Data ya muda mfupi, data endelevu/muhimu huhifadhiwa ndani ya chombo.
 * Data yote ya kudumu inadumishwa kwenye ndoo lengwa; kimsingi, tunatumia S3 kama hifadhidata yetu
 * Uchanganuzi wa mara kwa mara wa ndoo ya chanzo kwa media mpya
 * Ongeza na ubadilishe metadata ya media; Uhariri huhifadhiwa kwenye ndoo lengwa, midia ya chanzo haibadilishwi kamwe
 * Profaili za pato zinazoweza kusanidiwa. Chaguomsingi ni DASH-mp4 yenye wasifu nne, zinazosaidia viwango vya ubora kutoka bora kuliko HD hadi kipimo data cha chini sana.
 * Maelezo ya akaunti ya mtumiaji pia huhifadhiwa kwenye ndoo lengwa, yakiwa yamesimbwa kwa hiari
 * Ufunguo wa usimbaji ukibadilishwa, msimamizi anaweza kuhamisha watumiaji hadi kwa ufunguo mpya kwa kutumia kiweko cha msimamizi wa wavuti

 ## Ufungaji
 Unaweza kusakinisha na kuendesha `yuebing` kupitia kizimbani, npm au moja kwa moja kutoka kwa chanzo.

 ### Docker
 Ikiwa unayo docker, unaweza kuanza na Yuebing haraka:

    docker run -it cobbzilla/yuebing

 ### npm kifurushi
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### Kutoka kwa chanzo
 Ili kukimbia kutoka kwa chanzo, utahitaji nodejs v16+ na uzi

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

 Tazama [hati za wasanidi programu](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) kwa maelezo zaidi

 ## Usanidi
 Ili kucheza karibu na Yuebing, ni sawa kuianzisha bila kusanidi chochote.
 Endesha `yuebing` na utaombwa kuweka usanidi mdogo utakapoanza.

 Ikiwa unapanga kuendesha Yuebing kwa muda, angalia [hati za usanidi](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) za
 habari zaidi juu ya jinsi ya kuweka mambo.

 ### nginx usanidi
 Yuebing ni programu ya Nuxt tu, na inatarajia kuwa utaweka nginx (au seva nyingine ya wavuti) ndani.
 mbele yake kushughulikia SSL, kupunguza kiwango ikiwa inahitajika, nk.

 Ikiwa unatumia nginx, hapa kuna [sampuli ya usanidi](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) unaweza kutumia.

 ## Kwa nini jina yuebing?
 [Oolong sungura](https://en.wikipedia.org/wiki/Oolong_(sungura)) alikuwa sungura wa kupendeza na maarufu.
 [meme ya awali ya mtandao](https://duckduckgo.com/?q=oolong+sungura&ia=images&iax=images). Oolong alikufa mnamo 2003.
 miaka miwili kabla ya huduma fulani maarufu ya video hata kuwepo!

 Mrithi wa Oolong aliitwa Yuebing. Yuebing hakuwa maarufu kama Oolong, lakini je!
 Yuebing alifaulu hata hivyo.

 Labda cha kufurahisha zaidi, yuebing inamaanisha [mooncake](https://en.wikipedia.org/wiki/Mooncake)
 (Kichina: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Kijapani: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); mooncakes ni kitamu sana na inaweza kupatikana ndani
 aina mbalimbali za ladha na mitindo. Furahia mtindo wa kikanda unaoheshimiwa kwa wakati, au jaribu keki ya kigeni kutoka kwa kisasa
 waokaji wanaovinjari eneo la kupendeza ambalo halijajulikana! Kwa kweli kuna furaha kwa kila mtu!

</pre>
