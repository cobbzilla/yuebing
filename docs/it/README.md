Yuebing 🥮
 ===========
 Yuebing è un software open source per l'esecuzione di siti di hosting video.

 Transcodifica automaticamente i tuoi video sorgente in moderni formati di streaming, riproducibili su qualsiasi
 dispositivo su qualsiasi connessione.

 Yuebing può utilizzare Amazon S3 o Backblaze B2 per l'archiviazione back-end e dispone di molte funzionalità avanzate.

 ### Fonte
 * [yuebing su GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing su npm](https://www.npmjs.com/package/yuebing)
 * [yuebing su DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Contenuti
 * [Ispirazione](#Ispirazione)
 * [Caratteristiche](#Caratteristiche)
 * [Installazione](#Installazione)
 * [Docker](#Docker)
 * [pacchetto npm](pacchetto #npm)
 * [Da fonte](#Da-fonte)
 * [Configurazione](#Configurazione)
 * [nginx config](#nginx-config)
 * [Perché il nome yuebing?](#Perché-il-nome-yuebing?)

 ## Ispirazione
 L'anno scorso mia madre ha speso un sacco di tempo (e denaro!) Per organizzare e digitalizzare un archivio di vecchi video di famiglia.
 Alcuni di questi erano piuttosto vecchi, risalenti agli anni '50. Roba davvero bella, classica.

 Volevamo condividerli privatamente con la famiglia, ma *non con la grande tecnologia*.
 Andare con l'hosting video "gratuito" da un importante provider era fuori discussione.

 Cosa cercavamo:
 * Self-hosted, ma totalmente **semplice** da gestire e mantenere
 * Streaming in formati video moderni, incluso il bitrate adattivo
 * I video vengono riprodotti su qualsiasi dispositivo, desktop o mobile
 * Con una connessione ad alta larghezza di banda, la qualità video è eccezionale; così come viene
 * **Anche con una cattiva connessione**, la riproduzione è di qualità decente e *non salta o bufferizza*
 * Archiviazione crittografata, quindi in grado di utilizzare soluzioni di archiviazione su cloud pubblico con una certa sicurezza
 * Server senza stato: salva tutto ciò che è importante nell'archiviazione che è altamente resiliente
 * **Non voglio preoccuparmi dei backup!**
 * *Questo è stato bello da avere. A quanto pare niente là fuori ha qualcosa di simile. Yuebing sì!*
 * Dopo aver eseguito un'istanza robusta per transcodificare tutto, abbattila ed esegui qualcosa di più economico a lungo termine
 * Puoi eseguire Yuebing per meno di $ 10 al mese; e, si spera, anche meno lungo la strada mentre ottimizziamo l'impronta di Yuebing

 Ho impiegato un paio di settimane per esaminare cosa c'era là fuori. Ho iniziato a rilassare notevolmente le mie esigenze, e ancora
 non ho trovato niente di decente. Ho esaminato diversi progetti open source, non dico quale perché tutti avevano
 molteplici difetti evidenti.

 Quindi, ho deciso, quanto potrebbe essere difficile? Connetti S3 a ffmpeg, ci metti un frontend decentemente moderno e il gioco è fatto,
 Giusto?

 .... uh, OK, ho circa un mese a questo punto, ma è troppo divertente! Spero che ti piaccia anche tu!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Rendiamo i siti di video self-hosting super facili!**</a>

 ## Caratteristiche
 * Trasforma un bucket S3 con video in un sito di video privato per amici e familiari!
 * Collega uno o più bucket di origine che forniscono file multimediali grezzi
 * Yuebing transcodifica automaticamente i video sorgente nel formato più recente e ampiamente supportato per lo streaming adattivo del bitrate (DASH/mp4)
 * TUTTI i dati sono archiviati nel bucket di destinazione, quindi puoi distruggere il container e richiamarlo in un secondo momento
 * Utile per l'esecuzione inizialmente su un'istanza ottimizzata per la CPU per la trasformazione iniziale, quindi eseguire \
    on a much cheaper instance for 24/7/365 service.
 * Supporta l'archiviazione completamente crittografata (crittografia lato app, solo tu hai la chiave)
 * Sempre di sola lettura dalla fonte, non modificare mai il contenuto della fonte
 * Scansione automatica e manuale per nuovi file multimediali
 * Quanto privato o pubblico vuoi le cose? Yuebing supporta:
 * Totalmente privato: nessun supporto mostrato agli utenti anonimi, solo gli indirizzi e-mail approvati possono creare account
 * Semi-privato: nessun supporto mostrato agli utenti anonimi, ma chiunque può creare un account utente
 * Pubblico con registrazione limitata: i media vengono mostrati a tutti, ma solo gli indirizzi email approvati possono creare account
 * Totalmente pubblico: i media vengono mostrati a tutti e chiunque può creare un account utente
 * Completamente internazionalizzato! Tutto il testo visibile dall'utente (e altri elementi specifici della locale) proviene da risorse localizzate
 * [Aiuta la comunità, traduci Yuebing in nuove lingue!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Console di amministrazione completa
 * **Una cosa che ammetto fa ancora schifo:**
 * L'"esperienza di scoperta" consiste nel *navigare una gerarchia di directory*. Questo è **super zoppo**, ma da qualche parte dovevamo iniziare.
 * Aggiungeremo il supporto per una corretta ricerca, tagging, suggerimenti, ecc.
 * OK, in realtà ci sono molte cose che fanno ancora schifo, e questo è totalmente un software 1.0, ma le cose che funzionano sono piuttosto interessanti
 * <a href="https://www.patreon.com/cobbzilla">**Prossimamente con il tuo supporto**</a> :
 * Supporto per più tipi di media (audio, immagini, ecc.)
 * Supporti caricati dall'utente
 * Nuovo "tipo di sorgente": un'altra istanza di Yuebing!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Funzione utente anonimo (se il sito è stato configurato per consentire visitatori anonimi)
 * Sfoglia i media
 * Guarda i media!
 * Crea account (se il sito è stato configurato per consentire la registrazione dell'account)

 ## Funzionalità dell'utente che ha effettuato l'accesso
 * Sfoglia i media
 * Guarda i media!
 * Aggiungi un commento, modifica il tuo commento, elimina il tuo commento!
 * Mi piace media (in arrivo!)
 * Invita gli amici
 * Imposta la lingua su inglese o francese (aggiungi altre traduzioni!)
 * Modifica le informazioni sull'account
 * Elimina account, elimina tutto ciò che è tuo inclusi tutti i tuoi commenti

 ## Funzionalità dell'utente amministratore
 * Modifica i metadati multimediali, visualizza le miniature, cambia la miniatura selezionata
 * Visualizza la coda di trasformazione dei supporti e lo stato del lavoro
 * Avvia nuove scansioni e indici dei media di origine

 ## Funzionalità server/backend
 * I dati transitori/importanti ZERO persistenti vengono archiviati all'interno del contenitore.
 * Tutti i dati durevoli vengono mantenuti nel bucket di destinazione; essenzialmente, utilizziamo S3 come nostro database
 * Scansione periodica automatica del bucket di origine per nuovi media
 * Aggiungi e modifica i metadati multimediali; le modifiche vengono archiviate nel bucket di destinazione, il supporto di origine non viene mai modificato
 * Profili di output configurabili. L'impostazione predefinita è DASH-mp4 con quattro profili, che supportano livelli di qualità da migliore dell'HD a larghezza di banda super-bassa
 * Anche le informazioni sull'account utente vengono archiviate nel bucket di destinazione, opzionalmente crittografate
 * Se la chiave di crittografia viene modificata, l'amministratore può migrare gli utenti alla nuova chiave con la console di amministrazione web

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

    # Or, since you have the source, run any of the yarn scripts
    yarn docker-run-dev # Fastest build & startup, dev docker image
    yarn docker-run # Faster at runtime, production docker image

 Vedere i [documenti per sviluppatori](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) per maggiori informazioni

 ## Configurazione
 Per giocare con Yuebing, va bene avviarlo senza configurare nulla.
 Esegui `yuebing` e ti verrà chiesto di inserire la configurazione minima all'avvio.

 Se prevedi di eseguire Yuebing per un po', consulta i [documenti di configurazione](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) per
 maggiori informazioni su come impostare le cose.

 ### configurazione di nginx
 Yuebing è semplicemente un'app Nuxt e si aspetta che tu metta nginx (o qualche altro server web) in
 di fronte ad esso per gestire SSL, limitazione della velocità se necessario, ecc.

 Se stai usando nginx, ecco una [configurazione di esempio](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) che puoi usare.

 ## Perché il nome yuebing?
 [Oolong il coniglio](https://en.wikipedia.org/wiki/Oolong_(coniglio)) era un adorabile e famoso
 [meme Internet iniziale](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong è morto nel 2003,
 due anni prima che esistesse un certo servizio video estremamente popolare!

 Il successore di Oolong si chiamava Yuebing. Yuebing non era famoso quanto Oolong, ma aveva importanza?
 Yuebing ci riuscì comunque.

 Forse più interessante, yuebing significa [mooncake](https://en.wikipedia.org/wiki/Mooncake)
 (Cinese: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Giapponese: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); i mooncakes sono molto gustosi e si possono trovare
 un'ampia varietà di gusti e stili. Goditi uno stile regionale antico o prova una torta esotica dal gusto contemporaneo
 fornai che stanno esplorando un territorio deliziosamente inesplorato! C'è davvero uno yuebing per tutti!

</pre>
