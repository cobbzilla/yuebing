Yuebing 🥮
 ==========
 Yuebing ist eine Open-Source-Software zum Ausführen von Video-Hosting-Sites.

 Yuebing bereitet Ihre Quellvideos automatisch für das Streaming mit modernen Formaten vor, die auf jedem abspielbar sind
 Gerät über eine beliebige Verbindung.

 Yuebing kann entweder Amazon S3 oder Backblaze B2 als Backend-Speicher verwenden und verfügt über viele erweiterte Funktionen.

 ### Quelle
 * [yuebing auf GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing auf npm](https://www.npmjs.com/package/yuebing)
 * [yuebing auf DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Lesen Sie dies in einer anderen Sprache
 Dieses README.md-Dokument wurde über [hokeylization](https://github.com/cobbzilla/hokeylization) übersetzt in
 viele Sprachen.

 Ich bin sicher, es ist nicht perfekt, aber ich hoffe, es ist besser als nichts!

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
 [🇮🇳 Maranthi](../mr/README.md)
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
 * [npm-Paket](#npm-Paket)
 * [Von Quelle](#Von-Quelle)
 * [Konfiguration](#Konfiguration)
 * [nginx-Konfiguration](#nginx-config)
 * [Warum der Name Yuebing?](#Warum-der-Name-Yuebing?)

 ## Inspiration
 Letztes Jahr hat meine Mutter eine Menge Zeit (und Geld!) aufgewendet, um ein Archiv alter Familienvideos zu organisieren und zu digitalisieren.
 Einige davon waren ziemlich alt und gingen bis in die 1940er Jahre zurück. Wirklich schöne, klassische Sachen.

 Wir wollten diese privat mit der Familie teilen, aber *nicht mit Big Tech*.
 Sich für „kostenloses“ Videohosting eines großen Anbieters zu entscheiden, war vom Tisch.

 Was wir gesucht haben:
 * Selbst gehostet, aber völlig **benutzerfreundlich** zu betreiben und zu warten
 * Streams in modernen Videoformaten, einschließlich adaptiver Bitrate
 * Videos spielen auf jedem Gerät, Desktop oder Handy
 * Bei einer Verbindung mit hoher Bandbreite ist die Videoqualität fantastisch; besser geht's nicht
 * **Auch bei einer schlechten Verbindung** ist die Wiedergabe in anständiger Qualität und *springt oder puffert nicht*
 * Verschlüsselter Speicher, daher in der Lage, öffentliche Cloud-Speicherlösungen mit einem gewissen Vertrauen zu verwenden
 * Zustandsloser Server: Behalten Sie alles bei, was für den hochstabilen Speicher wichtig ist
 * **Ich will mir keine Sorgen um Backups machen!**
 * *Das war schön zu haben. Wie sich herausstellt, gibt es nichts dergleichen. Yuebing tut es!*
 * Nachdem Sie eine kräftige Instanz ausgeführt haben, um alles zu transcodieren, reißen Sie sie ab und führen Sie auf lange Sicht etwas Billigeres aus
 * Sie können Yuebing für weniger als 10 $/Monat betreiben; und hoffentlich noch weniger in der Zukunft, wenn wir Yuebings Fußabdruck optimieren

 Ich nahm mir ein paar Wochen Zeit, um zu überblicken, was da draußen war. Ich fing an, meine Anforderungen stark zu lockern, und immer noch
 konnte nichts anständiges finden. Ich habe mir mehrere Open-Source-Projekte angesehen, ich sage nicht welche, weil sie alle hatten
 mehrere eklatante Mängel.

 Also entschied ich, wie schwer könnte es sein? Sie verdrahten S3 mit ffmpeg, setzen ein anständig modernes Frontend darauf und Sie sind fertig, richtig?
 ... nun, äh, der Großteil der Arbeit hat ein paar Monate gedauert, aber es hat zu viel Spaß gemacht, um aufzuhören!
 Ich hoffe es gefällt euch auch!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Machen wir das Selbsthosten von Videoseiten supereinfach!**</a>

 ## Merkmale
 * Verwandeln Sie einen S3- (oder B2-) Eimer mit Videos in eine private Video-Site für Freunde und Familie!
 * Verbinden Sie einen oder mehrere Quell-Buckets, die Rohmediendateien bereitstellen
 * Yuebing transkodiert Quellvideos automatisch in das neueste und am weitesten verbreitete unterstützte Format für Streaming mit adaptiver Bitrate (DASH/mp4)
 * ALLE Daten werden im Ziel-Bucket gespeichert; Sie können den Server zerstören, wann immer Sie wollen
 * Nützlich für die anfängliche Ausführung auf einer CPU-optimierten Instanz für die anfängliche Transcodierung, dann Ausführen von \
    on a much cheaper instance for 24/7/365 service.
 * Unterstützt vollständig verschlüsselte Speicherung (App-seitige Verschlüsselung, nur Sie haben den Schlüssel)
 * Immer schreibgeschützt von der Quelle, Quellinhalt niemals ändern
 * Automatisches und manuelles Scannen nach neuen Mediendateien
 * Wie privat oder öffentlich möchten Sie die Dinge? Yuebing unterstützt:
 * Völlig privat: Anonymen Benutzern werden keine Medien angezeigt, nur genehmigte E-Mail-Adressen können Konten erstellen
 * Halbprivat: Anonymen Benutzern werden keine Medien angezeigt, aber jeder kann ein Benutzerkonto erstellen
 * Öffentlich mit eingeschränkter Registrierung: Medien werden allen angezeigt, aber nur genehmigte E-Mail-Adressen können Konten erstellen
 * Völlig öffentlich: Medien werden allen angezeigt, und jeder kann ein Benutzerkonto erstellen
 * Vollständig internationalisiert! Alle für den Benutzer sichtbaren Texte (und andere gebietsschemaspezifische Inhalte) stammen aus lokalisierten Ressourcen
 * [Helfen Sie der Community, übersetzen Sie Yuebing in neue Sprachen!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Voll funktionsfähige Verwaltungskonsole
 * Suchen Sie Videos nach Schlüsselwörtern oder aus der Tag-Cloud
 * <a href="https://www.patreon.com/cobbzilla">**Demnächst mit Ihrer Unterstützung**</a> :
 * Unterstützung für mehr Medientypen (Audio, Bilder usw.)
 * Vom Benutzer hochgeladene Medien
 * Likes, Shares und Push-Benachrichtigungen
 * Neuer "Quellentyp": Eine weitere Yuebing-Instanz!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Funktion für anonyme Benutzer (wenn die Website so konfiguriert wurde, dass anonyme Besucher zugelassen werden)
 * Medien durchsuchen
 * Medien ansehen!
 * Konto erstellen (wenn die Website so konfiguriert wurde, dass sie die Kontoregistrierung zulässt)

 ## Funktionen für angemeldete Benutzer
 * Medien durchsuchen
 * Medien ansehen!
 * Fügen Sie einen Kommentar hinzu, bearbeiten Sie Ihren Kommentar, löschen Sie Ihren Kommentar!
 * Freunde einladen
 * Kontoinformationen bearbeiten
 * Konto löschen, löscht alles, was Ihnen gehört, einschließlich aller Ihrer Kommentare

 ## Admin-Benutzerfunktionen
 * Medienmetadaten bearbeiten, Miniaturansichten anzeigen, ausgewählte Miniaturansichten ändern
 * Zeigen Sie die Medienumwandlungswarteschlange und den Auftragsstatus an
 * Starten Sie neue Scans und Indizes von Quellmedien

 ## Server-/Backend-Funktionen
 * Transientenfreundliche, NULL persistente/wichtige Daten werden im Container gespeichert.
 * Alle dauerhaften Daten werden im Ziel-Bucket gespeichert; Im Wesentlichen verwenden wir S3 als unsere Datenbank
 * Automatisches regelmäßiges Scannen des Quell-Buckets nach neuen Medien
 * Medienmetadaten hinzufügen und ändern; Änderungen werden im Ziel-Bucket gespeichert, Quellmedien werden nie geändert
 * Konfigurierbare Ausgabeprofile. Standard ist DASH-mp4 mit mehreren Unterprofilen
 * Benutzerkontoinformationen werden auch im Ziel-Bucket gespeichert, optional verschlüsselt
 * Wenn der Verschlüsselungsschlüssel geändert wird, kann der Administrator Benutzer mit der Web-Admin-Konsole auf den neuen Schlüssel migrieren

 ## Installation
 Sie können `yuebing` über Docker, npm oder direkt von der Quelle installieren und ausführen.

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

 ### Von der Quelle
 Um von der Quelle auszuführen, benötigen Sie nodejs v16+ und Garn

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

 Weitere Informationen finden Sie in der [Entwicklerdokumentation](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md).

 ## Aufbau
 Um mit Yuebing herumzuspielen, ist es in Ordnung, es zu starten, ohne etwas zu konfigurieren.
 Führen Sie `yuebing` aus und Sie werden beim Start aufgefordert, die minimale Konfiguration einzugeben.

 Wenn Sie Yuebing für eine Weile ausführen möchten, lesen Sie die [Konfigurationsdokumentation](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) für
 weitere Informationen zur Einrichtung.

 ### nginx-Konfiguration
 Yuebing ist eine Nuxt-App und erwartet, dass Sie nginx (oder einen anderen Webserver) installieren
 davor, um SSL zu handhaben, bei Bedarf eine Ratenbegrenzung usw.

 Wenn Sie nginx verwenden, finden Sie hier eine [Beispielkonfiguration](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf), die Sie verwenden können.

 ## Warum der Name Yuebing?
 [Oolong the rabbit](https://en.wikipedia.org/wiki/Oolong_(rabbit)) war ein entzückender und berühmter
 [frühes Internet-Meme](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong starb 2003,
 zwei Jahre, bevor ein gewisser äußerst beliebter Videodienst überhaupt existierte!

 Oolongs Nachfolger hieß Yuebing. Yuebing war nicht annähernd so berühmt wie Oolong, aber spielte das überhaupt eine Rolle?
 Yuebing gelang es dennoch.

 Vielleicht interessanter, yuebing bedeutet [Mondkuchen](https://en.wikipedia.org/wiki/Mooncake)
 (Chinesisch: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Japanisch: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); Mondkuchen sind sehr lecker und zu finden in
 eine große Vielfalt an Geschmacksrichtungen und Stilrichtungen. Genießen Sie einen altehrwürdigen regionalen Stil oder probieren Sie einen exotischen Kuchen aus der Gegenwart
 Bäcker, die köstliches Neuland erkunden! Es gibt wirklich ein Yuebing für jeden!

</pre>
