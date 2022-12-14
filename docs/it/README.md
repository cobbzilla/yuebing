Yuebing ๐ฅฎ
 ===========
 Yuebing รจ un software open source per l'esecuzione di siti di hosting video.

 Yuebing prepara automaticamente i tuoi video sorgente per lo streaming utilizzando formati moderni, riproducibili su qualsiasi
 dispositivo su qualsiasi connessione.

 Yuebing puรฒ utilizzare Amazon S3 o Backblaze B2 per l'archiviazione back-end e dispone di molte funzionalitร  avanzate.

 ### Fonte
 * [yuebing su GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing su npm](https://www.npmjs.com/package/yuebing)
 * [yuebing su DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Leggi questo in un'altra lingua
 Questo documento README.md รจ stato tradotto, tramite [hokeylization](https://github.com/cobbzilla/hokeylization), in
 molte lingue.

 Sono certa che non sia perfetto, ma spero sia meglio di niente!

 [๐ธ๐ฆ Arabo](../ar/README.md)
 [๐ง๐ฉ Bengali](../bn/README.md)
 [๐ฉ๐ช Tedesco](../de/README.md)
 [๐บ๐ธ Inglese](../en/README.md)
 [๐ช๐ธ Spagnolo](../es/README.md)
 [๐ซ๐ท Francese](../fr/README.md)
 [๐น๐ฉ Hausa](../ha/README.md)
 [๐ฎ๐ณ Hindi](../hi/README.md)
 [๐ฎ๐ฉ Indonesiano](../id/README.md)
 [๐ฎ๐น Italiano](../it/README.md)
 [๐ฏ๐ต Giapponese](../ja/README.md)
 [๐ฐ๐ท Coreano](../ko/README.md)
 [๐ฎ๐ณ Maranthi](../mr/README.md)
 [๐ต๐ฑ Polacco](../pl/README.md)
 [๐ง๐ท Portoghese](../pt/README.md)
 [๐ท๐บ Russo](../ru/README.md)
 [๐ฐ๐ช Swahili](../sw/README.md)
 [๐ต๐ญ Tagalog](../tl/README.md)
 [๐น๐ท Turco](../tr/README.md)
 [๐ต๐ฐ Urdu](../ur/README.md)
 [๐ป๐ณ Vietnamita](../vi/README.md)
 [๐จ๐ณ Cinese](../zh/README.md)
 ----

 # Contenuti
 * [Ispirazione](#Ispirazione)
 * [Caratteristiche](#Caratteristiche)
 * [Installazione](#Installazione)
 * [Docker](#Docker)
 * [pacchetto npm](pacchetto #npm)
 * [Da fonte](#Da-fonte)
 * [Configurazione](#Configurazione)
 * [nginx config](#nginx-config)
 * [Perchรฉ il nome yuebing?](#Perchรฉ-il-nome-yuebing?)

 ## Ispirazione
 L'anno scorso mia madre ha speso un sacco di tempo (e denaro!) Per organizzare e digitalizzare un archivio di vecchi video di famiglia.
 Alcuni di questi erano piuttosto vecchi, risalenti agli anni '40. Roba davvero bella, classica.

 Volevamo condividerli privatamente con la famiglia, ma *non con la grande tecnologia*.
 Andare con l'hosting video "gratuito" da un importante provider era fuori discussione.

 Cosa cercavamo:
 * Self-hosted, ma totalmente **semplice** da gestire e mantenere
 * Streaming in formati video moderni, incluso il bitrate adattivo
 * I video vengono riprodotti su qualsiasi dispositivo, desktop o mobile
 * Con una connessione ad alta larghezza di banda, la qualitร  video รจ eccezionale; cosรฌ come viene
 * **Anche con una cattiva connessione**, la riproduzione รจ di qualitร  decente e *non salta o bufferizza*
 * Archiviazione crittografata, quindi in grado di utilizzare soluzioni di archiviazione su cloud pubblico con una certa sicurezza
 * Server senza stato: salva tutto ciรฒ che รจ importante nell'archiviazione che รจ altamente resiliente
 * **Non voglio preoccuparmi dei backup!**
 * *Questo รจ stato bello da avere. A quanto pare niente lร  fuori ha qualcosa di simile. Yuebing sรฌ!*
 * Dopo aver eseguito un'istanza robusta per transcodificare tutto, abbattila ed esegui qualcosa di piรน economico a lungo termine
 * Puoi eseguire Yuebing per meno di $ 10 al mese; e, si spera, anche meno lungo la strada mentre ottimizziamo l'impronta di Yuebing

 Ho impiegato un paio di settimane per esaminare cosa c'era lร  fuori. Ho iniziato a rilassare notevolmente le mie esigenze, e ancora
 non ho trovato niente di decente. Ho esaminato diversi progetti open source, non dico quale perchรฉ tutti avevano
 molteplici difetti evidenti.

 Quindi, ho deciso, quanto potrebbe essere difficile? Connetti S3 a ffmpeg, ci metti un frontend decentemente moderno e il gioco รจ fatto, giusto?
 ... beh, la maggior parte del lavoro ha richiesto un paio di mesi, ma รจ stato troppo divertente fermarlo!
 Spero che ti piaccia anche tu!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Rendiamo i siti di video self-hosting super facili!**</a>

 ## Caratteristiche
 * Trasforma un secchio di video S3 (o B2) in un sito di video privato per amici e familiari!
 * Collega uno o piรน bucket di origine che forniscono file multimediali grezzi
 * Yuebing transcodifica automaticamente i video sorgente nel formato piรน recente e ampiamente supportato per lo streaming adattivo del bitrate (DASH/mp4)
 * TUTTI i dati sono archiviati nel bucket di destinazione; puoi distruggere il server quando vuoi
 * Utile per l'esecuzione inizialmente su un'istanza ottimizzata per la CPU per la transcodifica iniziale, quindi eseguire \
    on a much cheaper instance for 24/7/365 service.
 * Supporta l'archiviazione completamente crittografata (crittografia lato app, solo tu hai la chiave)
 * Sempre di sola lettura dalla fonte, non modificare mai il contenuto della fonte
 * Scansione automatica e manuale per nuovi file multimediali
 * Quanto privato o pubblico vuoi le cose? Yuebing supporta:
 * Totalmente privato: nessun supporto mostrato agli utenti anonimi, solo gli indirizzi e-mail approvati possono creare account
 * Semi-privato: nessun supporto mostrato agli utenti anonimi, ma chiunque puรฒ creare un account utente
 * Pubblico con registrazione limitata: i media vengono mostrati a tutti, ma solo gli indirizzi email approvati possono creare account
 * Totalmente pubblico: i media vengono mostrati a tutti e chiunque puรฒ creare un account utente
 * Completamente internazionalizzato! Tutto il testo visibile dall'utente (e altri elementi specifici della locale) proviene da risorse localizzate
 * [Aiuta la comunitร , traduci Yuebing in nuove lingue!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Console di amministrazione completa
 * Cerca video per parole chiave o da tag cloud
 * <a href="https://www.patreon.com/cobbzilla">**Prossimamente con il tuo supporto**</a> :
 * Supporto per piรน tipi di media (audio, immagini, ecc.)
 * Supporti caricati dall'utente
 * Mi piace, condivisioni e notifiche push
 * Nuovo "tipo di sorgente": un'altra istanza di Yuebing!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Funzione utente anonimo (se il sito รจ stato configurato per consentire visitatori anonimi)
 * Sfoglia i media
 * Guarda i media!
 * Crea account (se il sito รจ stato configurato per consentire la registrazione dell'account)

 ## Funzionalitร  dell'utente che ha effettuato l'accesso
 * Sfoglia i media
 * Guarda i media!
 * Aggiungi un commento, modifica il tuo commento, elimina il tuo commento!
 * Invita gli amici
 * Modifica le informazioni sull'account
 * Elimina account, elimina tutto ciรฒ che รจ tuo inclusi tutti i tuoi commenti

 ## Funzionalitร  dell'utente amministratore
 * Modifica i metadati multimediali, visualizza le miniature, cambia la miniatura selezionata
 * Visualizza la coda di trasformazione dei supporti e lo stato del lavoro
 * Avvia nuove scansioni e indici dei media di origine

 ## Funzionalitร  server/backend
 * I dati transitori/importanti ZERO persistenti vengono archiviati all'interno del contenitore.
 * Tutti i dati durevoli vengono mantenuti nel bucket di destinazione; essenzialmente, utilizziamo S3 come nostro database
 * Scansione periodica automatica del bucket di origine per nuovi media
 * Aggiungi e modifica i metadati multimediali; le modifiche vengono archiviate nel bucket di destinazione, il supporto di origine non viene mai modificato
 * Profili di output configurabili. L'impostazione predefinita รจ DASH-mp4 con piรน sottoprofili
 * Anche le informazioni sull'account utente vengono archiviate nel bucket di destinazione, opzionalmente crittografate
 * Se la chiave di crittografia viene modificata, l'amministratore puรฒ migrare gli utenti alla nuova chiave con la console di amministrazione web

 ## Installazione
 Puoi installare ed eseguire `yuebing` tramite docker, npm o direttamente dal sorgente.

 ### Docker
 Se hai la finestra mobile, puoi iniziare rapidamente con Yuebing:

    docker run -it cobbzilla/yuebing

 Pacchetto ### npm
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

 Vedere i [documenti per sviluppatori](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) per maggiori informazioni

 ## Configurazione
 Per giocare con Yuebing, va bene avviarlo senza configurare nulla.
 Esegui `yuebing` e ti verrร  chiesto di inserire la configurazione minima all'avvio.

 Se prevedi di eseguire Yuebing per un po', consulta i [documenti di configurazione](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) per
 maggiori informazioni su come impostare le cose.

 ### configurazione di nginx
 Yuebing รจ un'app Nuxt e si aspetta che metti nginx (o qualche altro server web) in
 di fronte ad esso per gestire SSL, limitazione della velocitร  se necessario, ecc.

 Se stai usando nginx, ecco una [configurazione di esempio](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) che puoi usare.

 ## Perchรฉ il nome yuebing?
 [Oolong il coniglio](https://en.wikipedia.org/wiki/Oolong_(coniglio)) era un adorabile e famoso
 [meme Internet iniziale](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong รจ morto nel 2003,
 due anni prima che esistesse un certo servizio video estremamente popolare!

 Il successore di Oolong si chiamava Yuebing. Yuebing non era famoso quanto Oolong, ma aveva importanza?
 Yuebing ci riuscรฌ comunque.

 Forse piรน interessante, yuebing significa [mooncake](https://en.wikipedia.org/wiki/Mooncake)
 (Cinese: [ๆ้ฅผ](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Giapponese: [ๆ้ค](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); i mooncake sono molto gustosi e si possono trovare
 un'ampia varietร  di gusti e stili. Goditi uno stile regionale antico o prova una torta esotica dal gusto contemporaneo
 fornai che stanno esplorando un territorio deliziosamente inesplorato! C'รจ davvero uno yuebing per tutti!

</pre>
