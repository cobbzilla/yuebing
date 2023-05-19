Yuebing 🥮
 ==========
 Yuebing ist eine Open-Source-Software zum Betreiben von Video-Hosting-Sites.

 Yuebing bereitet Ihre Quellvideos automatisch für das Streaming in modernen Formaten vor, die auf jedem Gerät abspielbar sind
 Gerät über eine beliebige Verbindung.

 Yuebing kann entweder Amazon S3 oder Backblaze B2 als Backend-Speicher verwenden und verfügt über viele erweiterte Funktionen.

 ### Quelle
 * [yuebing auf GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing auf npm](https://www.npmjs.com/package/yuebing)
 * [yuebing auf DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Lesen Sie dies in einer anderen Sprache
 Dieses README.md-Dokument wurde über [hokeylization](https://github.com/cobbzilla/hokeylization) in übersetzt
 viele Sprachen.

 Ich bin mir sicher, dass es nicht perfekt ist, aber ich hoffe, es ist besser als nichts!

 [🇸🇦 Arabisch](../ar/README.md)
 [🇧🇩 Bengali](../bn/README.md)
 [🇩🇪 Deutsch](../de/README.md)
 [🇺🇸 Englisch](../en/README.md)
 [🇪🇸 Spanisch](../es/README.md)
 [🇫🇷 Französisch](../fr/README.md)
 [🇹🇩 Hausa](../ha/README.md)
 [🇮🇳 Hindi](../hi/README.md)
 [🇮🇩 Indonesisch](../id/README.md)
 [🇮🇹 Italienisch](../it/README.md)
 [🇯🇵 Japanisch](../ja/README.md)
 [🇰🇷 Koreanisch](../ko/README.md)
 [🇮🇳 Marathi](../mr/README.md)
 [🇵🇱 Polnisch](../pl/README.md)
 [🇧🇷 Portugiesisch](../pt/README.md)
 [🇷🇺 Russisch](../ru/README.md)
 [🇰🇪 Suaheli](../sw/README.md)
 [🇵🇭 Tagalog](../tl/README.md)
 [🇹🇷 Türkisch](../tr/README.md)
 [🇵🇰 Urdu](../ur/README.md)
 [🇻🇳 Vietnamesisch](../vi/README.md)
 [🇨🇳 Chinesisch](../zh/README.md)
 ----

 # Inhalt
 * [Inspiration](#Inspiration)
 * [Funktionen](#Funktionen)
 * [Installation](#Installation)
 * [Docker](#Docker)
 * [npm-Paket](#npm-paket)
 * [Aus Quelle](#From-Quelle)
 * [Konfiguration](#Konfiguration)
 * [nginx config](#nginx-config)
 * [Warum der Name Yuebing?](#Why-the-name-yuebing?)

 ## Inspiration
 Letztes Jahr hat meine Mutter viel Zeit (und Geld!) darauf verwendet, ein Archiv alter Familienvideos zu organisieren und zu digitalisieren.
 Einige davon waren ziemlich alt und reichten bis in die 1940er Jahre zurück. Wirklich schöne, klassische Sachen.

 Wir wollten diese privat mit der Familie teilen, aber *nicht mit Big Tech*.
 Die Entscheidung für „kostenloses“ Video-Hosting bei einem großen Anbieter kam nicht in Frage.

 Was wir gesucht haben:
 * Selbstgehostet, aber völlig unkompliziert in der Ausführung und Wartung
 * Streams in modernen Videoformaten, einschließlich adaptiver Bitrate
 * Videos werden auf jedem Gerät, Desktop oder Mobilgerät abgespielt
 * Bei einer Verbindung mit hoher Bandbreite ist die Videoqualität fantastisch; besser geht's nicht
 * **Selbst bei einer schlechten Verbindung** ist die Wiedergabe in ordentlicher Qualität und *springt nicht und puffert nicht*
 * Verschlüsselter Speicher, sodass öffentliche Cloud-Speicherlösungen mit einiger Sicherheit verwendet werden können
 * Zustandsloser Server: Behalten Sie alles Wichtige im Speicher bei, der äußerst belastbar ist
 * **Ich möchte mir keine Sorgen um Backups machen!**
 * *Das war schön zu haben. Wie sich herausstellt, gibt es nichts Vergleichbares. Yuebing tut es!*
 * Nachdem Sie eine leistungsstarke Instanz ausgeführt haben, um alles zu transkodieren, bauen Sie sie ab und führen Sie auf lange Sicht etwas billigeres aus
 * Sie können Yuebing für weniger als 10 $/Monat betreiben; und hoffentlich noch weniger, wenn wir Yuebings Fußabdruck optimieren

 Ich habe ein paar Wochen gebraucht, um zu untersuchen, was da draußen war. Ich fing an, meine Anforderungen stark zu lockern, und zwar immer noch
 Konnte nichts Anständiges finden. Ich habe mir mehrere Open-Source-Projekte angeschaut, ich sage nicht welches, weil sie alle hatten
 mehrere eklatante Mängel.

 Also entschied ich, wie schwer könnte es sein? Sie verbinden S3 mit ffmpeg, fügen ein einigermaßen modernes Frontend hinzu und schon sind Sie fertig, oder?
 ... nun ja, der Großteil der Arbeit hat ein paar Monate gedauert, aber es hat zu viel Spaß gemacht, um damit aufzuhören!
 Ich hoffe, es gefällt euch auch!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Lassen Sie uns das Selbsthosten von Videoseiten ganz einfach machen!**</a>

 ## Merkmale
 * Verwandeln Sie einen S3- (oder B2-)Bucket voller Videos in eine private Video-Site für Freunde und Familie!
 * Verbinden Sie einen oder mehrere Quell-Buckets, die Rohmediendateien bereitstellen
 * Yuebing transkodiert Quellvideos automatisch in das neueste und am weitesten verbreitete Format für adaptives Bitraten-Streaming (DASH/mp4).
 * ALLE Daten werden im Ziel-Bucket gespeichert; Sie können den Server jederzeit zerstören
 * Nützlich für die anfängliche Ausführung auf einer CPU-optimierten Instanz für die anfängliche Transkodierung. Führen Sie dann \ aus.
    on a much cheaper instance for 24/7/365 service.
 * Unterstützt vollständig verschlüsselten Speicher (App-seitige Verschlüsselung, nur Sie haben den Schlüssel)
 * Immer schreibgeschützt aus der Quelle, niemals Quellinhalt ändern
 * Automatisches und manuelles Scannen nach neuen Mediendateien
 * Wie privat oder öffentlich möchten Sie die Dinge? Yuebing unterstützt:
 * Völlig privat: Anonymen Benutzern werden keine Medien angezeigt, nur genehmigte E-Mail-Adressen können Konten erstellen
 * Halbprivat: Anonymen Benutzern werden keine Medien angezeigt, aber jeder kann ein Benutzerkonto erstellen
 * Öffentlich mit eingeschränkter Registrierung: Medien werden allen angezeigt, aber nur genehmigte E-Mail-Adressen können Konten erstellen
 * Völlig öffentlich: Medien werden allen angezeigt und jeder kann ein Benutzerkonto erstellen
 * Vollständig internationalisiert! Der gesamte für den Benutzer sichtbare Text (und andere gebietsschemaspezifische Inhalte) stammt aus lokalisierten Ressourcen
 * [Helfen Sie der Community, übersetzen Sie Yuebing in neue Sprachen!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Voll ausgestattete Admin-Konsole
 * Durchsuchen Sie Videos nach Schlüsselwörtern oder aus der Tag-Cloud
 * <a href="https://www.patreon.com/cobbzilla">**Demnächst mit Ihrer Unterstützung**</a> :
 * Unterstützung für weitere Medientypen (Audio, Bilder usw.)
 * Vom Benutzer hochgeladene Medien
 * Likes, Shares und Push-Benachrichtigungen
 * Neuer „Quellentyp“: Eine weitere Yuebing-Instanz!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Anonyme Benutzerfunktion (wenn die Site so konfiguriert wurde, dass anonyme Besucher zugelassen werden)
 * Medien durchsuchen
 * Medien ansehen!
 * Konto erstellen (wenn die Site so konfiguriert wurde, dass die Kontoregistrierung möglich ist)

 ## Funktionen für angemeldete Benutzer
 * Medien durchsuchen
 * Medien ansehen!
 * Fügen Sie einen Kommentar hinzu, bearbeiten Sie Ihren Kommentar, löschen Sie Ihren Kommentar!
 * Freunde einladen
 * Kontoinformationen bearbeiten
 * Konto löschen, löscht alles, was Ihnen gehört, einschließlich aller Ihrer Kommentare

 ## Admin-Benutzerfunktionen
 * Medienmetadaten bearbeiten, Miniaturansichten anzeigen, ausgewählte Miniaturansichten ändern
 * Medientransformationswarteschlange und Auftragsstatus anzeigen
 * Starten Sie neue Scans und Indizes der Quellmedien

 ## Server-/Backend-Funktionen
 * Transientenfreundlich, NULL persistente/wichtige Daten werden im Container gespeichert.
 * Alle dauerhaften Daten bleiben im Ziel-Bucket erhalten; Im Wesentlichen verwenden wir S3 als unsere Datenbank
 * Automatisches regelmäßiges Scannen des Quell-Buckets nach neuen Medien
 * Medienmetadaten hinzufügen und ändern; Änderungen werden im Ziel-Bucket gespeichert, Quellmedien werden nie geändert
 * Konfigurierbare Ausgabeprofile. Standardmäßig ist DASH-mp4 mit mehreren Unterprofilen
 * Benutzerkontoinformationen werden auch im Ziel-Bucket gespeichert, optional verschlüsselt
 * Wenn der Verschlüsselungsschlüssel geändert wird, kann der Administrator Benutzer über die Web-Administratorkonsole auf den neuen Schlüssel migrieren

 ## Installation
 Sie können `yuebing` über Docker, npm oder direkt aus dem Quellcode installieren und ausführen.

 ### Docker
 Wenn Sie Docker haben, können Sie schnell mit Yuebing loslegen:

    docker run -it cobbzilla/yuebing

 ### npm-Paket
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### Aus der Quelle
 Zum Ausführen aus dem Quellcode benötigen Sie NodeJS v16+ und Garn

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

 Weitere Informationen finden Sie in den [Entwicklerdokumenten](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md).

 ## Aufbau
 Um mit Yuebing herumzuspielen, ist es in Ordnung, es zu starten, ohne etwas zu konfigurieren.
 Führen Sie `yuebing` aus und Sie werden beim Start aufgefordert, die minimale Konfiguration einzugeben.

 Wenn Sie vorhaben, Yuebing für eine Weile auszuführen, lesen Sie die [Konfigurationsdokumente](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) für
 Weitere Informationen zur Einrichtung.

 ### Nginx-Konfiguration
 Yuebing ist eine Nuxt-App und erwartet, dass Sie Nginx (oder einen anderen Webserver) installieren
 davor, um SSL, ggf. Ratenbegrenzung usw. zu verwalten.

 Wenn Sie Nginx verwenden, finden Sie hier eine [Beispielkonfiguration](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf), die Sie verwenden können.

 ## Warum der Name Yuebing?
 [Oolong der Hase](https://en.wikipedia.org/wiki/Oolong_(rabbit)) war ein bezaubernder und berühmter Hase
 [frühes Internet-Meme](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong starb im Jahr 2003,
 zwei Jahre bevor es einen bestimmten äußerst beliebten Videodienst überhaupt gab!

 Oolongs Nachfolger hieß Yuebing. Yuebing war bei weitem nicht so berühmt wie Oolong, aber spielte das überhaupt eine Rolle?
 Yuebing hatte dennoch Erfolg.

 Vielleicht noch interessanter: Yuebing bedeutet [Mondkuchen](https://en.wikipedia.org/wiki/Mooncake)
 (Chinesisch: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Japanisch: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); Mooncakes sind sehr lecker und können in gefunden werden
 eine große Vielfalt an Geschmacksrichtungen und Stilen. Genießen Sie einen altbewährten regionalen Stil oder probieren Sie einen exotischen Kuchen von Contemporary
 Bäcker, die köstliches Neuland erkunden! Da gibt es wirklich Jubel für alle!

</pre>
