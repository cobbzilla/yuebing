Yuebing 🥮
 ==========
 Yuebing est un logiciel open source pour l'exécution de sites d'hébergement vidéo.

 Yuebing prépare automatiquement vos vidéos source pour le streaming en utilisant des formats modernes, lisibles sur n'importe quel
 périphérique sur n'importe quelle connexion.

 Yuebing peut utiliser Amazon S3 ou Backblaze B2 pour le stockage backend et possède de nombreuses fonctionnalités avancées.

 ### La source
 * [yuebing sur GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing sur npm](https://www.npmjs.com/package/yuebing)
 * [yuebing sur DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Lire ceci dans une autre langue
 Ce document README.md a été traduit, via [hokeylization](https://github.com/cobbzilla/hokeylization), en
 de nombreuses langues.

 Je suis certain que ce n'est pas parfait, mais j'espère que c'est mieux que rien !

 [🇸🇦 Arabe](../ar/README.md)
 [🇧🇩 bengali](../bn/README.md)
 [🇩🇪 allemand](../de/README.md)
 [🇺🇸 Anglais](../en/README.md)
 [🇪🇸 Espagnol](../es/README.md)
 [🇫🇷 Français](../fr/README.md)
 [🇹🇩 Haoussa](../ha/README.md)
 [🇮🇳 Hindi](../hi/README.md)
 [🇮🇩 Indonésien](../id/README.md)
 [🇮🇹 Italien](../it/README.md)
 [🇯🇵 japonais](../ja/README.md)
 [🇰🇷 coréen](../ko/README.md)
 [🇮🇳 Maranthi](../mr/README.md)
 [🇵🇱 polonais](../pl/README.md)
 [🇧🇷 portugais](../pt/README.md)
 [🇷🇺 russe](../ru/README.md)
 [🇰🇪 Swahili](../sw/README.md)
 [🇵🇭 Tagalog](../tl/README.md)
 [🇹🇷 Turc](../tr/README.md)
 [🇵🇰 Ourdou](../ur/README.md)
 [🇻🇳 Vietnamien](../vi/README.md)
 [🇨🇳 chinois](../zh/README.md)
 ----

 # Contenu
 * [Inspiration](#Inspiration)
 * [Fonctionnalités](#Fonctionnalités)
 * [Installation](#Installation)
 * [Docker](#Docker)
 * [paquet npm](#paquet-npm)
 * [Depuis la source](#Depuis la source)
 * [Configuration](#Configuration)
 * [configuration nginx](#nginx-config)
 * [Pourquoi le nom yuebing ?](#Pourquoi-le-nom-yuebing ?)

 ## Inspiration
 L'année dernière, ma mère a passé beaucoup de temps (et d'argent !) à organiser et à numériser une archive de vieilles vidéos familiales.
 Certains d'entre eux étaient assez anciens, remontant aux années 1940. Vraiment beau, des trucs classiques.

 Nous voulions les partager en privé avec la famille, mais *pas avec les grandes technologies*.
 Aller avec l'hébergement vidéo "gratuit" d'un fournisseur majeur n'était pas envisageable.

 Ce que nous recherchions :
 * Auto-hébergé, mais totalement ** facile ** à exécuter et à entretenir
 * Flux dans les formats vidéo modernes, y compris le débit binaire adaptatif
 * Les vidéos sont lues sur n'importe quel appareil, ordinateur de bureau ou mobile
 * Avec une connexion haut débit, la qualité vidéo est impressionnante ; aussi bon que possible
 * **Même avec une mauvaise connexion**, la lecture est de bonne qualité et *ne saute ni ne met en mémoire tampon*
 * Stockage crypté, donc capable d'utiliser des solutions de stockage dans le cloud public en toute confiance
 * Serveur sans état : conservez tout ce qui est important pour un stockage hautement résilient
 * **Je ne veux pas me soucier des sauvegardes !**
 * * C'était un plaisir d'avoir. Il s'avère que rien là-bas n'a quelque chose comme ça. Yuebing le fait !*
 * Après avoir exécuté une instance costaud pour tout transcoder, démontez-la et exécutez quelque chose de moins cher à long terme
 * Vous pouvez exécuter Yuebing pour moins de 10 $/mois ; et, espérons-le, encore moins à mesure que nous optimisons l'empreinte de Yuebing

 J'ai pris quelques semaines pour étudier ce qui se passait. J'ai commencé à assouplir considérablement mes exigences, et encore
 n'a rien pu trouver de convenable. J'ai regardé plusieurs projets open source, je ne dis pas lesquels car ils avaient tous
 multiples défauts flagrants.

 Alors, j'ai décidé, à quel point cela pouvait-il être difficile? Vous connectez S3 à ffmpeg, y mettez une interface moderne et vous avez terminé, n'est-ce pas ?
 ... eh bien, euh, le gros du travail a pris quelques mois, mais c'était trop amusant pour s'arrêter !
 J'espère que vous l'apprécierez aussi !

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">** Rendons les sites vidéo auto-hébergés super faciles ! **</a>

 ## Fonctionnalités
 * Transformez un ensemble de vidéos S3 (ou B2) en un site vidéo privé pour vos amis et votre famille !
 * Connectez un ou plusieurs buckets sources fournissant des fichiers multimédias bruts
 * Yuebing transcode automatiquement les vidéos source dans le format le plus récent et le plus largement pris en charge pour le streaming à débit binaire adaptatif (DASH/mp4)
 * TOUTES les données sont stockées dans le compartiment de destination ; vous pouvez détruire le serveur quand vous le souhaitez
 * Utile pour s'exécuter initialement sur une instance optimisée pour le processeur pour le transcodage initial, puis exécutez \
    on a much cheaper instance for 24/7/365 service.
 * Prend en charge le stockage entièrement crypté (cryptage côté application, vous seul avez la clé)
 * Toujours en lecture seule à partir de la source, ne modifiez jamais le contenu de la source
 * Analyse automatique et manuelle des nouveaux fichiers multimédias
 * Dans quelle mesure voulez-vous que les choses soient privées ou publiques ? Yuebing prend en charge :
 * Totalement privé : aucun média montré aux utilisateurs anonymes, seules les adresses e-mail approuvées peuvent créer des comptes
 * Semi-privé : aucun média n'est montré aux utilisateurs anonymes, mais n'importe qui peut créer un compte d'utilisateur
 * Public avec inscription limitée : médias affichés à tous, mais seules les adresses e-mail approuvées peuvent créer des comptes
 * Totalement public : médias affichés à tout le monde, et n'importe qui peut créer un compte utilisateur
 * Entièrement internationalisé ! Tout le texte visible par l'utilisateur (et d'autres éléments spécifiques aux paramètres régionaux) provient de ressources localisées
 * [Aidez la communauté, traduisez Yuebing dans de nouvelles langues !](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Console d'administration complète
 * Rechercher des vidéos par mots-clés ou à partir d'un nuage de tags
 * <a href="https://www.patreon.com/cobbzilla">**Bientôt disponible avec votre soutien**</a> :
 * Prise en charge de plusieurs types de médias (audio, images, etc.)
 * Médias téléchargés par l'utilisateur
 * Aime, partage et notifications push
 * Nouveau "type de source" : une autre instance de Yuebing !
    * Federation between friendly instances: unified search, user accounts, etc

 ## Fonctionnalité d'utilisateur anonyme (si le site a été configuré pour autoriser les visiteurs anonymes)
 * Parcourir les médias
 * Regardez les médias !
 * Créer un compte (si le site a été configuré pour permettre l'enregistrement d'un compte)

 ## Fonctionnalités utilisateur connecté
 * Parcourir les médias
 * Regardez les médias !
 * Ajoutez un commentaire, modifiez votre commentaire, supprimez votre commentaire !
 * Inviter des amis
 * Modifier les informations de compte
 * Supprimer le compte, supprime tout ce qui vous appartient, y compris tous vos commentaires

 ## Fonctionnalités de l'utilisateur administrateur
 * Modifier les métadonnées des médias, afficher les vignettes, modifier la vignette sélectionnée
 * Afficher la file d'attente de transformation des médias et l'état du travail
 * Démarrer de nouveaux scans et index des médias source

 ## Fonctionnalités serveur/backend
 * Transient-friendly, ZERO persistant/importantes données sont stockées dans le conteneur.
 * Toutes les données durables sont conservées dans le compartiment de destination ; essentiellement, nous utilisons S3 comme base de données
 * Analyse périodique automatique du compartiment source pour les nouveaux médias
 * Ajouter et modifier les métadonnées des médias ; les modifications sont stockées sur le compartiment de destination, le média source n'est jamais modifié
 * Profils de sortie configurables. La valeur par défaut est DASH-mp4 avec plusieurs sous-profils
 * Les informations de compte utilisateur sont également stockées sur le compartiment de destination, éventuellement cryptées
 * Si la clé de chiffrement est modifiée, l'administrateur peut migrer les utilisateurs vers la nouvelle clé avec la console d'administration Web

 ## Installation
 Vous pouvez installer et exécuter `yuebing` via docker, npm ou directement depuis la source.

 ### Docker
 Si vous avez docker, vous pouvez commencer rapidement avec Yuebing :

    docker run -it cobbzilla/yuebing

 ### paquet npm
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### De la source
 Pour exécuter à partir de la source, vous aurez besoin de nodejs v16 + et de fil

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

 Voir la [documentation développeur](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) pour plus d'informations

 ## Configuration
 Pour jouer avec Yuebing, c'est bien de le démarrer sans rien configurer.
 Exécutez `yuebing` et vous serez invité à entrer la configuration minimale au démarrage.

 Si vous prévoyez d'exécuter Yuebing pendant un certain temps, consultez la [documentation de configuration](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) pour
 plus d'informations sur la façon de configurer les choses.

 ### configuration nginx
 Yuebing est une application Nuxt et s'attend à ce que vous mettiez nginx (ou un autre serveur Web) dans
 devant pour gérer SSL, limiter le débit si nécessaire, etc.

 Si vous utilisez nginx, voici un [exemple de configuration](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) que vous pouvez utiliser.

 ## Pourquoi le nom yuebing ?
 [Oolong le lapin](https://en.wikipedia.org/wiki/Oolong_(lapin)) était un adorable et célèbre
 [premiers mèmes Internet](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong est décédé en 2003,
 deux ans avant qu'un certain service vidéo massivement populaire n'existe !

 Le successeur d'Oolong s'appelait Yuebing. Yuebing n'était pas aussi célèbre qu'Oolong, mais est-ce que cela avait de l'importance ?
 Yuebing réussit néanmoins.

 Peut-être plus intéressant, yuebing signifie [gâteau de lune](https://en.wikipedia.org/wiki/Mooncake)
 (Chinois : [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Japonais : [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)) ; les gâteaux de lune sont très savoureux et peuvent être trouvés dans
 une grande variété de saveurs et de styles. Savourez un style régional séculaire ou essayez un gâteau exotique de cuisine contemporaine
 boulangers qui explorent un territoire délicieusement inexploré ! Il y a vraiment un yuebing pour tout le monde!

</pre>
