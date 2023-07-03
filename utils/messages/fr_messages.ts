export default {
  id: 'fr',
  emoji: '🇫🇷',
  anonymous_user_name: 'mystérieux',
  welcome_public: 'Bienvenue sur {{ title }}!',
  welcome_user: 'Bienvenue sur {{ title }}, {{user.firstName ? user.firstName : user.email.includes("@") ? user.email.substring(0, user.email.indexOf("@")) : user.email}}',
  title_login: 'Connexion',
  title_register: 'Créer un compte',
  title_verifying: 'Vérification de votre compte...',
  title_requestPasswordReset: 'Réinitialisez votre mot de passe',
  title_resetPassword: 'Définir un nouveau mot de passe',
  title_verifying_ended: 'Vérification terminée',
  title_profile: 'Information sur le compte',
  button_profile: 'Mon compte',
  button_update: 'commettre',
  info_profile_update: 'Les informations de votre compte ont été mises à jour avec succès',
  button_reset_password: 'Réinitialisez votre mot de passe',
  button_delete_my_account: 'Supprimer mon compte (IMPOSSIBLE D\'ÊTRE ANNULÉ)',
  label_confirm_user_delete: 'Confirmez la suppression de votre compte. Cette action est irréversible!',
  label_email: 'E-mail',
  label_username: 'Nom d\'utilisateur',
  label_usernameOrEmail: 'Nom d\'utilisateur ou email',
  label_firstName: 'Prénom',
  label_lastName: 'Nom',
  label_name: 'Nom',
  label_password: 'Mot de passe',
  label_newPassword: 'Nouveau mot de passe',
  label_locale: 'Langue',
  label_token: 'Jeton de vérification',
  label_ctime: 'L\'eure de création',
  label_mtime: 'L\'heure modifiée',
  button_login: 'Connexion',
  button_logout: 'Se déconnecter',
  button_register: 'Créer un compte',
  button_forgot_password: 'Mot de passe oublié?',
  button_send_password_reset_email: 'Envoyer',
  button_set_new_password: 'Définir le mot de passe',
  info_password_reset_email_sent: 'Un e-mail a été envoyé à {{ email }}, vérifiez votre boîte de réception pour un lien pour réinitialiser votre mot de passe',
  info_password_reset_email_error: 'Une erreur s\'est produite et votre message n\'a peut-être pas été envoyé. Veuillez réessayer plus tard',
  info_password_reset_try_again: 'Réessayer',
  info_verify_token_error: 'Le jeton de vérification a expiré ou est autrement invalide',
  info_registration_not_allowed: 'L\'opérateur de {{ title }} a une création de compte désactivée',
  button_invite_friends: 'Invitez vos amis à {{ title }}!',
  label_friend_emails: 'Liste des e-mails séparés par des virgules ou des espaces',
  button_send_invitations: 'Envoyez des invitations',
  info_invite_friends_header: 'Invitez vos amis à {{ title }}!',
  info_invite_friends_subheader: 'Entrez quelques adresses e-mail ici et nous leur enverrons une invitation',
  info_invite_friends_limited_registration: 'L\'opérateur de {{ title }} a limité l\'inscription à des personnes spécifiques. Vous pouvez envoyer des invitations, mais ces utilisateurs doivent également être ajoutés à la liste approuvée des utilisateurs par l\'administrateur du site avant de pouvoir créer un compte avec succès',
  info_invite_friends_disabled_no_email: 'La fonctionnalité "inviter des amis" est désactivée car l\'e-mail n\'a pas été configuré sur {{ title }}',
  info_invite_friends_enabled_no_email: 'La fonctionnalité "inviter des amis" est activée mais l\'e-mail n\'a pas été configuré sur {{ title }}, elle ne peut donc pas être utilisée',
  info_invitation_success_results: 'Votre invitation a été envoyée avec succès à {{ successCount }}amis',
  info_invitation_error_results: 'Votre invitation n\'a pas pu être envoyée à {{ errorCount }}amis',
  label_search: 'Chercher',
  button_search: 'Chercher',
  label_sort: 'Trier par',
  label_sort_order: 'ordre',
  label_sort_ascending: 'croissant',
  label_sort_descending: 'décroissant',
  title_browsing_folder: 'Dossier: {{ folder }}',
  button_back_to: 'Retourner à {{ prefix }}',
  button_back_to_root_folder: 'Retour au niveau supérieur',
  info_search_no_results: 'Il y a quatre cent quatre raisons pour lesquelles quelque chose devrait être ici, mais il n\'y a rien ici',
  label_media_unprocessed: '(non transformé)',
  button_show_media_info: 'afficher les informations sur les médias',
  button_hide_media_info: 'masquer les informations sur les médias',
  button_show_thumbnails: 'affiche des vignettes',
  button_hide_thumbnails: 'masquer les vignettes',
  button_previous_thumbnail: 'précédent',
  button_next_thumbnail: 'suivant',
  thumbnail_alt_text: 'Image miniature pour {{name}}',
  label_selected_thumbnail: '~ vignette sélectionnée ~',
  button_select_thumbnail: 'sélectionnez cette vignette',
  info_no_thumbnails_found: '(aucune vignette trouvée)',
  button_show_metadata: 'afficher les métadonnées',
  button_hide_metadata: 'masquer les métadonnées',
  error_field_required: '{{ field }} est requis',
  error_field_invalid: '{{ field }} n\'est pas valide',
  error_field_regex: '{{ field }} n\'est pas valide',
  error_field_min: '{{ field }} est trop court',
  error_field_max: '{{ field }} est trop long',
  error_field_min_value: '{{ field }} est trop petit',
  error_field_max_value: '{{ field }} est trop grand',
  error_field_email: '{{ field }} n\'est pas une adresse e-mail valide',
  error_field_cannotDeleteSelf: 'Vous ne pouvez pas vous supprimer',
  error_field_readOnly: '{{ field }} est une source en lecture seule',
  error_field_alreadyExists: '{{ thing }} avec {{ field.toLowerCase() }} existe déjà',
  error_field_accountNotFound: 'Compte introuvable ou mot de passe incorrect',
  error_field_alreadyRegistered: 'Un compte avec ce {{ field.toLowerCase() }} existe déjà',
  error_field_registrationNotAllowed: 'L\'opérateur du site a désactivé la création de compte',
  error_field_url: '{{ field }} n\'est pas une URL valide',
  error_field_host: '{{ field }} n\'est pas un nom d\'hôte valide',
  error_field_locale: '{{ field }} n\'est pas un localité valide',
  error_field_volume: '{{ field }} n\'est pas un nom source. Utilisez uniquement des lettres, des chiffres, et ces caractères spéciaux: période (.), trait d\'union (-) et soulignement (_)',
  error_field_notFound: '{{ field }} ne pouvait pas être localisé',
  error_field_path: '{{ field }} is not a valid path',
  error_field_cannotMirrorToSame: 'La source de lecture et la source d\'écriture ne peut pas être la même',
  error_field_raw_hex: '{{ field }} n\'est pas un nombre hexadécimal (0x non autorisé ici)',
  error_field_hex: '{{ field }} n\'est pas un nombre hexadécimal',
  error_field_username: '{{ field }} n\'est pas un nom d\'utilisateur valide. Doit commencer par une lettre et ne contenir que des lettres, des chiffres, des traits de soulignement (_), des traits d\'union (-) et des points (.)',
  locale_en: 'Anglais',
  locale_es: 'Espagnol',
  locale_it: 'Italien',
  locale_fr: 'Français',
  locale_de: 'Allemand',
  locale_ar: 'Arabe',
  locale_bn: 'Bengali',
  locale_hi: 'Hindi',
  locale_ja: 'Japonais',
  locale_ko: 'Coréen',
  locale_pt: 'Portugais',
  locale_ru: 'Russe',
  locale_sw: 'Swahili',
  locale_zh: 'Chinois',
  label_date: '{{d}} {{MMM}} {{YYYY}}',
  label_date_short: '{{d}}/{{M}}/{{YYYY}}',
  label_date_and_time: '{{d}} {{MMM}} {{YYYY}} / {{h}}:{{m}}{{a}}',
  label_date_and_time_short: '{{d}}/{{M}}/{{YYYY}} {{h}}:{{m}}{{a}}',
  label_date_undefined: 'Date/heure non réglée',
  label_date_day_half_am: 'AM',
  label_date_day_half_pm: 'PM',
  label_date_day_0: 'dimanche',
  label_date_day_1: 'lundi',
  label_date_day_2: 'mardi',
  label_date_day_3: 'mercredi',
  label_date_day_4: 'jeudi',
  label_date_day_5: 'vendredi',
  label_date_day_6: 'samedi',
  label_date_day_short_0: 'dim.',
  label_date_day_short_1: 'lun.',
  label_date_day_short_2: 'mar.',
  label_date_day_short_3: 'mer.',
  label_date_day_short_4: 'jeu.',
  label_date_day_short_5: 'ven.',
  label_date_day_short_6: 'sam.',
  label_date_month_0: 'janvier',
  label_date_month_1: 'février',
  label_date_month_2: 'mars',
  label_date_month_3: 'avril',
  label_date_month_4: 'mai',
  label_date_month_5: 'juin',
  label_date_month_6: 'juillet',
  label_date_month_7: 'aout',
  label_date_month_8: 'septembre',
  label_date_month_9: 'octobre',
  label_date_month_10: 'novembre',
  label_date_month_11: 'décembre',
  label_date_month_short_0: 'janv.',
  label_date_month_short_1: 'févr.',
  label_date_month_short_2: 'mars',
  label_date_month_short_3: 'avr.',
  label_date_month_short_4: 'mai',
  label_date_month_short_5: 'juin',
  label_date_month_short_6: 'juil.',
  label_date_month_short_7: 'aout',
  label_date_month_short_8: 'sept.',
  label_date_month_short_9: 'oct.',
  label_date_month_short_10: 'nov.',
  label_date_month_short_11: 'déc.',
  label_date_month_number_0: '1',
  label_date_month_number_1: '2',
  label_date_month_number_2: '3',
  label_date_month_number_3: '3',
  label_date_month_number_4: '5',
  label_date_month_number_5: '6',
  label_date_month_number_6: '7',
  label_date_month_number_7: '8',
  label_date_month_number_8: '9',
  label_date_month_number_9: '10',
  label_date_month_number_10: '11',
  label_date_month_number_11: '12',
  label_duration_days: 'jours',
  label_duration_hours: 'heures',
  label_duration_minutes: 'minutes',
  label_duration_seconds: 'secondes',
  hint_readonly: '(ne peut pas être changé)',
  label_mediainfo_title: 'Titre',
  label_mediainfo_artist: 'Artiste',
  label_mediainfo_album_artist: 'Artiste de l\'album',
  label_mediainfo_author: 'Auteur / auteure',
  label_mediainfo_composer: 'Compositeur / compositrice',
  label_mediainfo_year: 'An',
  label_mediainfo_copyright: 'Droits d\'auteur',
  label_mediainfo_album: 'Album',
  label_mediainfo_movie: 'Film',
  label_mediainfo_description: 'La description',
  label_mediainfo_comment: 'Commentaire',
  label_mediainfo_genre: 'Genre',
  label_mediainfo_location: 'Emplacement',
  label_mediainfo_show: 'Émission',
  label_mediainfo_episode: 'Épisode',
  label_mediainfo_episode_sort: 'Épisode (pour le tri)',
  label_mediainfo_season: 'Saison télévisée',
  label_mediainfo_lyrics: 'Paroles',
  label_mediainfo_tags: 'Mots clés',
  label_mediainfo_duration: 'Durée',
  label_mediainfo_width: 'Largeur',
  label_mediainfo_height: 'Hauteur',
  label_mediainfo_size: 'Taille',
  label_mediainfo_videoTracks: 'Pistes vidéo',
  label_mediainfo_audioTracks: 'Pistes audio',
  label_mediainfo_format: 'Format',
  label_mediainfo_contentType: 'Type de contenu',
  label_mediainfo_bitRate: 'Débit binaire',
  label_mediainfo_frameRate: 'Fréquence d\'images',
  label_mediainfo_dateEncoded: 'Date encodée',
  button_admin: 'Configuration du site',
  admin_title_site_administration: '{{ title }} Administration',
  admin_title_manage_configuration: 'Configuration du système',
  admin_title_volume_administration: 'Administration des sources',
  admin_title_user_administration: 'Administration des utilisateurs',
  admin_title_migrate_data: 'Migrer les données',
  admin_title_transform_queue: 'File d\'attente de transformation multimédia',
  admin_title_site_administration_publicConfig: 'Configuration publique',
  admin_title_site_administration_privateConfig: 'Configuration privée',
  admin_button_save_config: 'Commettre des changements',
  admin_info_config_updated: 'Configuration du système à jour avec succès',
  admin_label_publicConfig_title: 'Titre du site',
  admin_label_publicConfig_siteUrl: 'URL du site',
  admin_label_publicConfig_public: 'Est-ce public?',
  admin_label_publicConfig_allowRegistration: 'Autoriser l\'inscription?',
  admin_label_publicConfig_limitRegistration: 'Limiter l\'inscription?',
  admin_label_publicConfig_inviteFriendsEnabled: 'Montrer «Inviter des amis» à des utilisateurs connectés?',
  admin_label_publicConfig_locales: 'Localités',
  admin_label_publicConfig_defaultLocale: 'Localité standard',
  admin_label_publicConfig_emailEnabled: 'Le courrier électronique est-il activé?',
  admin_label_publicConfig_timeout: 'Délais d\'expiration',
  admin_label_publicConfig_verify: 'Tempsage de jeton de vérification du compte',
  admin_label_publicConfig_resetPassword: 'Réinitialiser le temps mort de jeton de mot de passe',
  admin_label_privateConfig_admin: 'Paramètres d\'administrateur',
  admin_label_privateConfig_admin_user: 'Utilisateur d\'administrateur',
  admin_label_privateConfig_admin_user_email: 'E-mail',
  admin_label_privateConfig_admin_user_password: 'Mot de passe',
  admin_label_privateConfig_admin_user_firstName: 'Prénom',
  admin_label_privateConfig_admin_user_lastName: 'Nom',
  admin_label_privateConfig_admin_user_locale: 'Localité',
  admin_label_privateConfig_admin_overwrite: 'Écraser?',
  admin_label_privateConfig_email: 'Paramètres SMTP',
  admin_label_privateConfig_email_host: 'Hôte',
  admin_label_privateConfig_email_port: 'Port',
  admin_label_privateConfig_email_user: 'Nom d\'utilisateur',
  admin_label_privateConfig_email_password: 'Mot de passe',
  admin_label_privateConfig_email_secure: 'Sécurisé?',
  admin_label_privateConfig_email_fromEmail: 'Adresse e-mail de l\'expéditeur du système',
  admin_label_privateConfig_redis: 'Paramètres redis',
  admin_label_privateConfig_redis_host: 'Hôte',
  admin_label_privateConfig_redis_port: 'Port',
  admin_label_privateConfig_redis_flushAtStartup: 'Vider le cache à l\'heure de début?',
  admin_label_privateConfig_redis_listingCacheExpiration: 'Lister l\'expiration du cache',
  admin_label_privateConfig_redis_manifestCacheExpiration: 'Expiration de cache manifeste',
  admin_label_privateConfig_media: 'Support multimédia',
  admin_label_privateConfig_media_video: 'Vidéo',
  admin_label_privateConfig_media_video_allowedCommands: 'Commandes autorisées',
  admin_label_privateConfig_encryption: 'Paramètres de chiffrement',
  admin_label_privateConfig_encryption_key: 'Clé de cryptage',
  admin_label_privateConfig_encryption_iv: 'Vecteur d\'initialisation (VI)',
  admin_label_privateConfig_encryption_algo: 'Algorithme',
  admin_label_privateConfig_encryption_bcryptRounds: 'Balles de bcrypt',
  admin_label_privateConfig_session: 'Paramètres de session',
  admin_label_privateConfig_session_expiration: 'Expiration de la session',
  admin_label_privateConfig_autoscan: 'Paramètres de numérisation automatique',
  admin_label_privateConfig_autoscan_enabled: 'Activer la numérisation automatique?',
  admin_label_privateConfig_autoscan_interval: 'Intervalle de balayage régulier',
  admin_label_privateConfig_autoscan_initialDelay: 'Délai de balayage de démarrage',
  admin_label_privateConfig_autoscan_showTransformOutput: 'Sortie de transformation du journal?',
  admin_label_privateConfig_autoscan_cleanupTemporaryAssets: 'Nettoyer les fichiers temporaires?',
  admin_label_privateConfig_autoscan_deleteIncompleteUploads: 'Nettoyer les téléchargements incomplets?',
  admin_label_privateConfig_autoscan_concurrency: 'Concurrence',
  admin_label_total_user_count: '{{ totalUserCount }} utilisateurs au total',
  admin_button_delete_user: 'Supprimer l\'utilisateur',
  admin_label_confirm_user_delete: 'Veuillez confirmer la suppression de l\'utilisateur: {{ email }}',
  admin_button_add_volume: 'Ajouter une source multimédia',
  admin_title_add_volume: 'Ajouter une source multimédia',
  admin_button_delete_volume: 'Supprimer la source multimédia',
  admin_button_scan_volume: 'Analyse',
  admin_info_scan_scanning: 'En cours d\'analyse...',
  admin_info_scan_successful: 'L\'analyse a commencé avec succès',
  admin_info_scan_error: 'Une erreur s\'est produite pendant l\'analyse',
  admin_label_confirm_volume_delete: 'Veuillez confirmer la suppression de la source multimédia: {{ source }}',
  admin_info_volume_added: 'La nouvelle source \'{{ source }}\' a été ajoutée avec succès',
  admin_info_volume_add_error: 'Une erreur s\'est produite en ajoutant de la source \'{{ source }}\'',
  admin_label_volume_name: 'Nom de la source multimédia',
  admin_label_self_volume: '{{ title }} stockage',
  admin_label_volume_type: 'Type de source multimédia',
  admin_label_volume_readOnly: 'Mont en lecture seule?',
  admin_label_volume_cacheSize: 'Lister la taille du cache (zéro à désactiver)',
  admin_label_volume_encryption_enable: 'Activer le cryptage',
  admin_label_volume_encryption_key: 'Clé de cryptage',
  admin_label_volume_encryption_iv: 'Vecteur d\'initialisation (VI)',
  admin_label_volume_encryption_algo: 'Algorithme',
  label_volumeType_local: 'Disque local',
  label_volumeType_local_field_key: 'Répertoire de montage',
  label_volumeType_local_field_mode: 'Mode de création de fichiers / répertoires',
  label_volumeType_s3: 'Amazon S3',
  label_volumeType_s3_field_key: 'Clé d\'accès AWS',
  label_volumeType_s3_field_secret: 'Clé secrète AWS',
  label_volumeType_s3_field_bucket: 'Seau S3',
  label_volumeType_s3_field_region: 'Région AWS',
  label_volumeType_s3_field_prefix: 'Préfixe de seau',
  label_volumeType_s3_field_delimiter: 'Délimiteur',
  label_volumeType_b2: 'Backblaze B2',
  label_volumeType_b2_field_key: 'ID de clé',
  label_volumeType_b2_field_secret: 'Clé d\'application',
  label_volumeType_b2_field_bucket: 'ID de seau B2 (pas le nom)',
  label_volumeType_b2_field_partSize: 'Taille de la pièce',
  label_volumeType_b2_field_prefix: 'Préfixe de seau',
  label_volumeType_b2_field_delimiter: 'Délimiteur',
  admin_label_firstEvent: 'premier événement',
  admin_label_lastEvent: 'dernier événement',
  admin_label_eventTime: 'time',
  admin_label_eventName: 'événement',
  admin_label_eventDescription: 'description',
  admin_label_xformQueueEmpty: 'Aucune tâche active',
  admin_label_migration_noSources: 'Aucune source définie',
  admin_label_migration_results: 'Résultats de la migration:',
  admin_label_migration_readPath: 'Lire depuis le chemin (blanc pour racine du système de fichiers)',
  admin_label_readPath: 'Lire depuis le chemin',
  admin_label_migration_writePath: 'Écrire sur chemin (blanc pour racine du système de fichiers)',
  admin_label_writePath: 'Écrire sur chemin',
  admin_button_migrate_data: 'Migrer les données',
  admin_info_migration_success: 'Les données ont migré avec succès',
  admin_info_migration_error: 'Une erreur s\'est produite lors de la migration des données',
  http_invalid_request_method: 'La méthode de la demande HTTP {{ method }} n\'est pas prise en charge par ce point de terminaison',
  admin_label_publicConfig_timeout_verify: 'Délai d\'expiration du jeton de vérification de compte',
  admin_label_publicConfig_timeout_resetPassword: 'Réinitialiser le délai d\'expiration du jeton de mot de passe',
  admin_label_privateConfig_admin_user_username: 'Nom d\'utilisateur',
  label_configCategory: 'Catégorie de configurations',
  locale_id: 'indonésien',
  locale_ur: 'ourdou',
  locale_tl: 'tagalog',
  locale_pl: 'polonais',
  locale_vi: 'vietnamien',
  locale_ha: 'Haoussa',
  locale_mr: 'Marathi',
  locale_tr: 'turc',
  info_search_searching: '...',
  search_stop_words: 'un,sur,au-dessus,après,encore,contre,tous,suis,un,et,tout,ne,sont,pas,comme,à,être,parce que,été,avant,être,en-dessous,entre,les deux,mais, par, ne peut pas, ne peut pas, ne peut pas, n\'a pas, n\'a pas, fait, ne, ne, fait, ne, vers le bas, pendant, chaque, quelques, pour, de, plus loin, avait, n\'a pas, n\'a pas, n\'a pas, n\'a pas, il, il, il va, il est, elle, ici, voici, elle, elle-même, lui, lui-même, son, comment, comment va, je, je, je vais, je suis, j\'ai, si, dans, dans, est, n\'est pas, il, c\'est, c\'est, lui-même, allons, moi, plus, la plupart, ne doit pas, mon, moi-même, non, ni, pas, de, off, on, une fois, seulement, ou, autre, devrait, notre, nôtre nous-mêmes, dehors, sur, propre, même, ne doit pas, elle, elle, elle \'ll,she\'s, should, should not, so, some, such, than, that, that\'s, the, their, theirs, them, themselves, then, there, there\'s, these, they, they\'d, they\'d ,ils sont,ils ont,ce,ceux,à travers,aussi,sous,jusqu\'à,uct,utc,très,était,n\'était pas,nous,nous,nous,nous , nous avons, étions, n\'étions pas, quoi, quoi, quand, quand, où, où est, qui, tandis que, qui, qui est, avec qui, pourquoi, pourquoi, avec, ne, ne, ne, ne, ne, serait pas, toi , vous, vous, vous êtes, vous avez, votre, vos, vous-mêmes, vous-mêmes',
  label_header_comments: 'commentaires',
  label_header_no_comments: 'Avez-vous quelque chose à dire?',
  label_comment: 'ajouter un commentaire!',
  label_comment_modified: 'édité',
  label_updating_comment: 'mise à jour...',
  label_removing_comment: 'suppression...',
  button_add_comment: 'ajouter un commentaire',
  button_update_comment: 'mettre à jour le commentaire',
  admin_title_index_administration: 'Gérer les index',
  admin_button_reindex_volume: 'Réindexer',
  admin_info_reindex_indexing: 'Indexage...',
  admin_info_reindex_error: 'Une erreur s\'est produite lors de la réindexation : {{ e }}',
  admin_info_reindex_successful: 'La réindexation a démarré avec succès',
  admin_info_reindex_info_error: 'Une erreur s\'est produite lors de la lecture de l\'état de la réindexation : {{ e }}',
  admin_label_reindex_path: 'Source et chemin',
  admin_label_reindex_time: 'Temps',
  admin_label_reindex_status: 'Statut',
  admin_label_reindex_noResults: 'Aucun résultat de réindexation trouvé',
  footer_credit: '<a style="text-decoration: none;" href="https://github.com/cobbzilla/yuebing">Propulsé par 🥮 Yuebing</a>',
  info_search_indexes_building: 'Cette même recherche peut renvoyer plus de résultats à l\'avenir. Certains index de recherche sont en cours de reconstruction : {{ indexes }}',
  info_search_no_results_unverified: 'Pour voir les résultats de la recherche, veuillez vérifier votre compte en utilisant le lien envoyé à {{ email }}',
  label_metadata: 'métadonnées de fichier',
  label_mediainfo: 'fichier mediainfo',
  label_add_tag: 'Ajouter une étiquette',
  label_adding_tag: 'ajout de balise...',
  label_removing_tag: 'suppression de la balise...',
  label_scan_ignoreErrors: 'Ignorer les erreurs précédentes',
  label_scan_overwrite: 'écraser les fichiers existants',
  label_scan_reprocess: 'Retraiter',
  label_scan_reprocess_profiles: 'Retraiter ces profils',
  label_path: 'Chemin',
  label_select_all: 'Tout sélectionner',
  locale_text_list_separator: ',',
  admin_title_volume_browser: 'Parcourir les sources',
  admin_title_reindex_status: 'Statut d\'indexation',
  admin_button_browse_volume: 'Parcourir',
  admin_label_scan_config: 'Configurer l\'analyse : {{ source }}',
  admin_label_scan_olderThan: 'Ignorer les médias qui ont été traités après une date et une heure spécifiques',
  admin_button_delete_path: 'Effacer',
  admin_button_rebuildSearchIndex: 'Reconstruire l\'index de recherche',
  admin_button_rebuildSearchIndex_warning: 'Cela reconstruira les index de recherche sur toutes les sources et pourrait prendre beaucoup de temps',
  admin_info_path_delete: 'Suppression du chemin...',
  label_editor: 'Éditeur?',
  label_noCache: 'réinitialiser le cache ?',
  label_previous_page: 'page de résultats précédente',
  label_next_page: 'prochaine page de résultats',
  label_results_info: 'montrant les résultats {{ start }} à {{ end }} sur le total de {{ total }}',
  label_playback_quality: 'Qualité de lecture',
  label_playback_quality_auto: 'automatique',
  admin_label_privateConfig_redis_buildSearchIndexAtStartup: 'Créer des index de recherche au démarrage',
  locale_af: 'afrikaans',
  locale_sq: 'albanais',
  locale_am: 'Amharique',
  locale_hy: 'arménien',
  locale_az: 'azerbaïdjanais',
  locale_eu: 'Basque',
  locale_be: 'biélorusse',
  locale_bs: 'bosnien',
  locale_bg: 'bulgare',
  locale_ca: 'catalan',
  locale_ceb: 'Cebuano',
  locale_co: 'corse',
  locale_hr: 'croate',
  locale_cs: 'tchèque',
  locale_da: 'danois',
  locale_nl: 'Néerlandais',
  locale_eo: 'espéranto',
  locale_et: 'estonien',
  locale_fi: 'finlandais',
  locale_fy: 'frison',
  locale_gl: 'galicien',
  locale_ka: 'géorgien',
  locale_el: 'grec',
  locale_gu: 'Gujarati',
  locale_ht: 'Créole haïtien',
  locale_haw: 'hawaïen',
  locale_he: 'hébreu',
  locale_hmn: 'Hmong',
  locale_hu: 'hongrois',
  locale_is: 'islandais',
  locale_ig: 'Ibo',
  locale_ga: 'irlandais',
  locale_jv: 'Javanais',
  locale_kn: 'Kannada',
  locale_kk: 'Kazakh',
  locale_km: 'Khmer',
  locale_rw: 'Kinyarwanda',
  locale_ku: 'kurde',
  locale_ky: 'Kirghize',
  locale_lo: 'Laotien',
  locale_la: 'Latin',
  locale_lv: 'letton',
  locale_lt: 'lituanien',
  locale_lb: 'Luxembourgeois',
  locale_mk: 'Macédonien',
  locale_mg: 'malgache',
  locale_ms: 'malais',
  locale_ml: 'Malayalam',
  locale_mt: 'maltais',
  locale_mi: 'Maori',
  locale_mn: 'mongol',
  locale_my: 'Birmanie (birman)',
  locale_ne: 'Népalais',
  locale_no: 'norvégien',
  locale_ny: 'Nyanja (Chichewa)',
  locale_or: 'Odia (Oriya)',
  locale_ps: 'pachtou',
  locale_fa: 'persan',
  locale_pa: 'Pendjabi',
  locale_ro: 'roumain',
  locale_sm: 'Samoa',
  locale_gd: 'Gaélique écossais',
  locale_sr: 'serbe',
  locale_st: 'Sésotho',
  locale_sn: 'Shona',
  locale_sd: 'Sindhi',
  locale_si: 'Cinghalais (Cingalais)',
  locale_sk: 'slovaque',
  locale_sl: 'slovène',
  locale_so: 'somali',
  locale_su: 'Sundanais',
  locale_sv: 'suédois',
  locale_tg: 'tadjik',
  locale_ta: 'Tamil',
  locale_tt: 'tatar',
  locale_te: 'télougou',
  locale_th: 'thaïlandais',
  locale_tk: 'turkmène',
  locale_uk: 'ukrainien',
  locale_ug: 'Ouïghour',
  locale_uz: 'Ouzbek',
  locale_cy: 'gallois',
  locale_xh: 'Xhosa',
  locale_yi: 'yiddish',
  locale_yo: 'Yorouba',
  locale_zu: 'zoulou',
  label_mediainfo_audioLanguage: 'Langue (Audio)',
  label_mediainfo_videoLanguage: 'Langue (Vidéo)',
  label_mediainfo_textTrackLanguages: 'Langues (sous-titres)',
  label_mediainfo_videoTrackCount: 'Pistes vidéo',
  label_mediainfo_audioTrackCount: 'Pistes audio',
  label_mediainfo_textTrackCount: 'Pistes de texte'
}
