Yuebing 🥮
 ==========
 Yuebing è un software open source per l'esecuzione di siti di hosting video.

 Yuebing prepara automaticamente i tuoi video sorgente per lo streaming utilizzando formati moderni, riproducibili su qualsiasi
 dispositivo su qualsiasi connessione.

 Yuebing può utilizzare Amazon S3 o Backblaze B2 per l'archiviazione back-end e dispone di molte funzionalità avanzate.

 ### Fonte
 * [yuebing su GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing su npm](https://www.npmjs.com/package/yuebing)
 * [yuebing su DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Leggi questo in un'altra lingua
 Questo documento README.md è stato tradotto, tramite [hokeylization](https://github.com/cobbzilla/hokeylization), in
 molte lingue.

 Sono certo che non è perfetto, ma spero che sia meglio di niente!

 [🇸🇦 Arabo](../ar/README.md)
 [🇧🇩 Bengali](../bn/README.md)
 [🇩🇪 Tedesco](../de/README.md)
 [🇺🇸 Inglese](../en/README.md)
 [🇪🇸 Spagnolo](../es/README.md)
 [🇫🇷 Francese](../fr/README.md)
 [🇹🇩 Hausa](../ha/README.md)
 [🇮🇳 Hindi](../hi/README.md)
 [🇮🇩 Indonesiano](../id/README.md)
 [🇮🇹 Italiano](../it/README.md)
 [🇯🇵 Giapponese](../ja/README.md)
 [🇰🇷 coreano](../ko/README.md)
 [🇮🇳 Marathi](../mr/README.md)
 [🇵🇱 Polacco](../pl/README.md)
 [🇧🇷 Portoghese](../pt/README.md)
 [🇷🇺 Russo](../ru/README.md)
 [🇰🇪 Swahili](../sw/README.md)
 [🇵🇭 Tagalog](../tl/README.md)
 [🇹🇷 Turco](../tr/README.md)
 [🇵🇰 Urdu](../ur/README.md)
 [🇻🇳 Vietnamita](../vi/README.md)
 [🇨🇳 Cinese](../zh/README.md)
 ----

 # Contenuti
 * [Ispirazione](#Ispirazione)
 * [Caratteristiche](#Caratteristiche)
 * [Installazione](#Installazione)
 * [Docker](#Docker)
 * [pacchetto npm](#pacchetto npm)
 * [Dalla fonte](#From-source)
 * [Configurazione](#Configurazione)
 * [configurazione nginx](#nginx-config)
 * [Perché il nome yuebing?](#Perché-il-nome-yuebing?)

 ## Ispirazione
 L'anno scorso mia madre ha speso un sacco di tempo (e denaro!) per organizzare e digitalizzare un archivio di vecchi video di famiglia.
 Alcuni di questi erano piuttosto vecchi, risalenti agli anni '40. Roba davvero bella e classica.

 Volevamo condividerli privatamente con la famiglia, ma *non con la grande tecnologia*.
 Andare con l'hosting video "gratuito" di un importante provider era fuori discussione.

 Cosa stavamo cercando:
 * Self-hosted, ma totalmente **facile** da eseguire e mantenere
 * Streaming in formati video moderni, incluso il bitrate adattivo
 * I video vengono riprodotti su qualsiasi dispositivo, desktop o mobile
 * Con una connessione ad alta larghezza di banda, la qualità video è eccezionale; così come viene
 * **Anche con una cattiva connessione**, la riproduzione è di qualità decente e *non salta o bufferizza*
 * Archiviazione crittografata, quindi in grado di utilizzare soluzioni di archiviazione su cloud pubblico con una certa sicurezza
 * Server stateless: persiste qualsiasi elemento importante per lo storage altamente resiliente
 * **Non voglio preoccuparmi dei backup!**
 * *È stato bello averlo. A quanto pare niente là fuori ha qualcosa di simile. Yuebing sì!*
 * Dopo aver eseguito un'istanza robusta per transcodificare tutto, abbattila ed esegui qualcosa di più economico a lungo termine
 * Puoi eseguire Yuebing per meno di $ 10 al mese; e si spera ancora meno lungo la strada mentre ottimizziamo l'impronta di Yuebing

 Ho impiegato un paio di settimane per esaminare cosa c'era là fuori. Ho iniziato a rilassare notevolmente le mie esigenze, e ancora
 trovato niente di decente. Ho esaminato diversi progetti open source, non dico quali perché li avevano tutti
 molteplici difetti evidenti.

 Quindi, ho deciso, quanto potrebbe essere difficile? Colleghi S3 a ffmpeg, ci metti un frontend decentemente moderno e il gioco è fatto, giusto?
 ... beh, il grosso del lavoro ha richiesto un paio di mesi, ma è stato troppo divertente fermarsi!
 Spero che piaccia anche a te!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Semplifichiamo i siti di video self-hosting!**</a>

 ## Caratteristiche
 * Trasforma un bucket di video S3 (o B2) in un sito di video privato per amici e familiari!
 * Collega uno o più bucket di origine fornendo file multimediali non elaborati
 * Yuebing transcodifica automaticamente i video sorgente nel formato più recente e più ampiamente supportato per lo streaming a bitrate adattivo (DASH/mp4)
 * TUTTI i dati sono archiviati nel bucket di destinazione; puoi distruggere il server quando vuoi
 * Utile per l'esecuzione iniziale su un'istanza ottimizzata per la CPU per la transcodifica iniziale, quindi eseguire \
    on a much cheaper instance for 24/7/365 service.
 * Supporta l'archiviazione completamente crittografata (crittografia lato app, solo tu hai la chiave)
 * Sempre di sola lettura dalla fonte, non modificare mai il contenuto della fonte
 * Scansione automatica e manuale per nuovi file multimediali
 * Quanto vuoi che siano private o pubbliche le cose? Yuebing supporta:
 * Totalmente privato: nessun media mostrato agli utenti anonimi, solo gli indirizzi email approvati possono creare account
 * Semi-privato: nessun media mostrato agli utenti anonimi, ma chiunque può creare un account utente
 * Pubblico con registrazione limitata: i media vengono mostrati a tutti, ma solo gli indirizzi email approvati possono creare account
 * Totalmente pubblico: i media vengono mostrati a tutti e chiunque può creare un account utente
 * Completamente internazionalizzato! Tutto il testo visibile all'utente (e altre cose specifiche della locale) proviene da risorse localizzate
 * [Aiuta la comunità, traduci Yuebing in nuove lingue!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Console di amministrazione completa
 * Cerca video per parole chiave o da tag cloud
 * <a href="https://www.patreon.com/cobbzilla">**Prossimamente con il tuo supporto**</a> :
 * Supporto per più tipi di media (audio, immagini, ecc.)
 * Supporti caricati dall'utente
 * Mi piace, condivisioni e notifiche push
 * Nuovo "tipo di sorgente": un'altra istanza di Yuebing!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Funzione utente anonimo (se il sito è stato configurato per consentire visitatori anonimi)
 * Sfoglia i media
 * Guarda i media!
 * Crea account (se il sito è stato configurato per consentire la registrazione dell'account)

 ## Funzionalità utente connesso
 * Sfoglia i media
 * Guarda i media!
 * Aggiungi un commento, modifica il tuo commento, elimina il tuo commento!
 * Invita gli amici
 * Modifica le informazioni sull'account
 * Elimina account, elimina tutto ciò che è tuo inclusi tutti i tuoi commenti

 ## Funzionalità utente amministratore
 * Modifica i metadati multimediali, visualizza le miniature, modifica la miniatura selezionata
 * Visualizza la coda di trasformazione dei media e lo stato del lavoro
 * Avvia nuove scansioni e indici dei supporti di origine

 ## Funzionalità server/backend
 * All'interno del contenitore vengono archiviati ZERO dati persistenti/importanti compatibili con i transitori.
 * Tutti i dati durevoli vengono mantenuti nel bucket di destinazione; essenzialmente, usiamo S3 come nostro database
 * Scansione periodica automatica del bucket di origine per nuovi media
 * Aggiungere e modificare i metadati multimediali; le modifiche vengono archiviate nel bucket di destinazione, il supporto di origine non viene mai modificato
 * Profili di output configurabili. L'impostazione predefinita è DASH-mp4 con più sottoprofili
 * Le informazioni sull'account utente vengono archiviate anche nel bucket di destinazione, facoltativamente crittografate
 * Se la chiave di crittografia viene modificata, l'amministratore può migrare gli utenti alla nuova chiave con la console di amministrazione web

 ## Installazione
 Puoi installare ed eseguire `yuebing` tramite docker, npm o direttamente dal sorgente.

 ### Docker
 Se hai docker, puoi iniziare rapidamente con Yuebing:

    docker run -it cobbzilla/yuebing

 ### pacchetto npm
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### Dalla fonte
 Per eseguire dal sorgente, avrai bisogno di nodejs v16+ e yarn

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

 Consulta la [documentazione per gli sviluppatori](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) per maggiori informazioni

 ## Configurazione
 Per giocare con Yuebing, va bene avviarlo senza configurare nulla.
 Esegui `yuebing` e ti verrà chiesto di inserire la configurazione minima all'avvio.

 Se prevedi di eseguire Yuebing per un po', consulta la [documentazione di configurazione](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) per
 maggiori informazioni su come impostare le cose.

 ### configurazione nginx
 Yuebing è un'app Nuxt e si aspetta che tu inserisca nginx (o qualche altro server web)
 davanti per gestire SSL, limitare la velocità se necessario, ecc.

 Se stai usando nginx, ecco una [configurazione di esempio](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) che puoi usare.

 ## Perché il nome yuebing?
 [Oolong il coniglio](https://en.wikipedia.org/wiki/Oolong_(rabbit)) era un adorabile e famoso
 [primo meme di Internet](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong è morto nel 2003,
 due anni prima che esistesse un certo servizio video estremamente popolare!

 Il successore di Oolong si chiamava Yuebing. Yuebing non era famoso quanto Oolong, ma aveva importanza?
 Yuebing è riuscito comunque.

 Forse più interessante, yuebing significa [mooncake](https://en.wikipedia.org/wiki/Mooncake)
 (Cinese: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Giapponese: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); i mooncakes sono molto gustosi e si possono trovare in
 un'ampia varietà di sapori e stili. Goditi uno stile regionale consacrato dal tempo o prova una torta esotica dal contemporaneo
 fornai che stanno esplorando un territorio deliziosamente inesplorato! C'è davvero uno yuebing per tutti!

</pre>
