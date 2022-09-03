export default {
  id: 'it',
  emoji: '🇮🇹',
  anonymous_user_name: 'misterioso',
  welcome_public: 'Benvenuto in {{ title }}!',
  welcome_user: 'Benvenuto in {{ title }}, {{user.firstName || user.email.includes("@") ? user.email.substring(0, user.email.indexOf("@")) : user.email}}!',
  title_login: 'Registrazione',
  title_register: 'Iscrizione',
  title_verifying: 'Verifica dell\'account...',
  title_requestPasswordReset: 'Resetta la password',
  title_resetPassword: 'Imposta una nuova password',
  title_verifying_ended: 'Verifica terminata',
  title_profile: 'Informazioni account',
  button_profile: 'Il mio account',
  button_update: 'Salva',
  info_profile_update: 'Le informazioni sul tuo account sono state aggiornate correttamente',
  button_reset_password: 'Resetta la password',
  button_delete_my_account: 'Elimina il mio account (NON PUÒ ESSERE ANNULLATO)',
  label_confirm_user_delete: 'Conferma la cancellazione del tuo account. Questa azione è irreversibile!',
  label_email: 'E-mail',
  label_username: 'Nome utente',
  label_usernameOrEmail: 'Nome utente o email',
  label_firstName: 'Nome di battesimo',
  label_lastName: 'Cognome',
  label_name: 'Nome',
  label_password: 'Parola d\'ordine',
  label_newPassword: 'Nuova password',
  label_locale: 'Lingua',
  label_token: 'Token di verifica',
  label_ctime: 'Creato',
  label_mtime: 'Modificata',
  button_login: 'Registrazione',
  button_logout: 'Disconnessione',
  button_register: 'Iscrizione',
  button_forgot_password: 'Hai dimenticato la password?',
  button_send_password_reset_email: 'Inviare',
  button_set_new_password: 'Impostare la password',
  info_password_reset_email_sent: 'È stato inviato un messaggio di posta elettronica a {{ email }}, controlla la posta in arrivo per trovare un collegamento per reimpostare la password',
  info_password_reset_email_error: 'Si è verificato un errore e il tuo messaggio potrebbe non essere stato inviato. Per favore riprova più tardi',
  info_password_reset_try_again: 'Riprova',
  info_verify_token_error: 'Il token di verifica è scaduto o non è altrimenti valido',
  info_registration_not_allowed: 'L\'operatore di {{ title }} ha disabilitato la creazione dell\'account',
  button_invite_friends: 'Invita i tuoi amici a {{ title }}!',
  label_friend_emails: 'Elenco di email separate da virgole o spazi',
  button_send_invitations: 'Invia inviti',
  info_invite_friends_header: 'Invita i tuoi amici a {{ title }}!',
  info_invite_friends_subheader: 'Inserisci qui alcuni indirizzi email e invieremo loro un invito',
  info_invite_friends_limited_registration: 'L\'operatore di {{ title }} ha una registrazione limitata a persone specifiche. Puoi inviare inviti, ma questi utenti devono anche essere aggiunti all\'elenco di utenti approvati dall\'amministratore del sito prima che possano creare correttamente un account',
  info_invite_friends_disabled_no_email: 'La funzione "invita amici" è disabilitata perché l\'email non è stata configurata su {{ title }}',
  info_invite_friends_enabled_no_email: 'La funzione "invita amici" è abilitata ma l\'email non è stata configurata su {{ title }}, quindi non può essere utilizzata',
  info_invitation_success_results: 'Il tuo invito è stato inviato con successo a {{ successCount }} amici',
  info_invitation_error_results: 'Impossibile recapitare il tuo invito a {{ errorCount }} amici',
  label_search: 'Ricerca',
  button_search: 'Ricerca',
  label_sort: 'Ordina per',
  label_sort_order: 'Ordine',
  label_sort_ascending: 'ascendente',
  label_sort_descending: 'discendente',
  title_browsing_folder: 'Cartella: {{ cartella }}',
  button_back_to: 'Torna a {{ prefisso }}',
  button_back_to_root_folder: 'Torna al livello superiore',
  info_search_no_results: 'Ci sono quattrocentoquattro ragioni per cui qualcosa dovrebbe essere qui, ma non c\'è niente qui',
  label_media_unprocessed: '(non processato)',
  button_show_media_info: 'mostra le informazioni sui media',
  button_hide_media_info: 'nascondi le informazioni sui media',
  button_show_thumbnails: 'mostra le miniature',
  button_hide_thumbnails: 'nascondere le miniature',
  button_previous_thumbnail: 'precedente',
  button_next_thumbnail: 'prossimo',
  thumbnail_alt_text: 'immagine in miniatura per {{ name }}',
  label_selected_thumbnail: '~ selezionato ~',
  button_select_thumbnail: 'seleziona questa miniatura',
  info_no_thumbnails_found: '(nessuna miniatura trovata)',
  button_show_metadata: 'mostra i metadati',
  button_hide_metadata: 'nascondere i metadati',
  error_field_required: '{{ field }} è obbligatiorio',
  error_field_invalid: '{{ field }} non è valido',
  error_field_regex: '{{ field }} non è valido',
  error_field_min: '{{ field }} è troppo corto',
  error_field_max: '{{ field }} è troppo lungo',
  error_field_min_value: '{{ field }} è troppo piccolo',
  error_field_max_value: '{{ field }} è troppo grande',
  error_field_email: '{{ field }} non è un indirizzo email valido',
  error_field_cannotDeleteSelf: 'Non puoi cancellarti',
  error_field_alreadyExists: '{{ thing }} con {{ field.toLowerCase() }} esiste già',
  error_field_readOnly: '{{ field }} è di sola lettura',
  error_field_accountNotFound: 'Account non trovato o password errata',
  error_field_alreadyRegistered: 'Esiste già un account con questo {{ field.toLowerCase() }}',
  error_field_registrationNotAllowed: 'L\'operatore del sito ha disabilitato la creazione dell\'account',
  error_field_url: '{{ field }} non è un URL valido',
  error_field_host: '{{ field }} non è un nome host valido',
  error_field_locale: '{{ field }} non è una locale valida',
  error_field_source: '{{ field }} non è un nome di origine. Utilizzare solo lettere, numeri e questi caratteri speciali: punto (.), trattino (-) e trattino basso (_)',
  error_field_notFound: 'Impossibile individuare {{ field }}',
  error_field_path: '{{ field }} non è un percorso valido',
  error_field_cannotMirrorToSame: 'L\'origine di lettura e l\'origine di scrittura non possono essere la stessa origine',
  error_field_raw_hex: '{{ field }} non è un numero esadecimale (iniziale 0x non consentito)',
  error_field_hex: '{{ field }} non è un numero esadecimale',
  error_field_username: '{{ field }} non è un nome utente valido. Deve iniziare con una lettera e contenere solo lettere, numeri, trattini bassi (_), trattini (-) e punti (.)',
  locale_en: 'Inglese',
  locale_es: 'Spagnolo',
  locale_it: 'Italiano',
  locale_fr: 'Francese',
  locale_de: 'Tedesco',
  locale_ar: 'Arabo',
  locale_bn: 'Bengalese',
  locale_hi: 'Hindi',
  locale_ja: 'Giapponese',
  locale_ko: 'Coreano',
  locale_pt: 'Portoghese',
  locale_ru: 'Russo',
  locale_sw: 'Swahili',
  locale_zh: 'Cinese',
  label_date: '{{MMM}} {{d}}, {{YYYY}}',
  label_date_short: '{{M}}/{{d}}/{{YYYY}}',
  label_date_and_time: '{{MMM}} {{d}}, {{YYYY}} / {{h}}:{{m}}{{a}}',
  label_date_and_time_short: '{{M}}/{{d}}/{{YYYY}} {{h}}:{{m}}{{a}}',
  label_date_undefined: 'Data/ora non impostate',
  label_date_day_half_am: 'SONO',
  label_date_day_half_pm: 'PM',
  label_date_day_0: 'Domenica',
  label_date_day_1: 'Lunedi',
  label_date_day_2: 'Martedì',
  label_date_day_3: 'Mercoledì',
  label_date_day_4: 'Giovedì',
  label_date_day_5: 'Venerdì',
  label_date_day_6: 'Sabato',
  label_date_day_short_0: 'Sole',
  label_date_day_short_1: 'Mio',
  label_date_day_short_2: 'mar',
  label_date_day_short_3: 'mer',
  label_date_day_short_4: 'Raccogliere',
  label_date_day_short_5: 'Ven',
  label_date_day_short_6: 'Sab',
  label_date_month_0: 'Gennaio',
  label_date_month_1: 'febbraio',
  label_date_month_2: 'Marzo',
  label_date_month_3: 'aprile',
  label_date_month_4: 'Maggio',
  label_date_month_5: 'Giugno',
  label_date_month_6: 'Luglio',
  label_date_month_7: 'agosto',
  label_date_month_8: 'settembre',
  label_date_month_9: 'ottobre',
  label_date_month_10: 'novembre',
  label_date_month_11: 'Dicembre',
  label_date_month_short_0: 'gen',
  label_date_month_short_1: 'febbraio',
  label_date_month_short_2: 'mar',
  label_date_month_short_3: 'aprile',
  label_date_month_short_4: 'Maggio',
  label_date_month_short_5: 'giu',
  label_date_month_short_6: 'lug',
  label_date_month_short_7: 'agosto',
  label_date_month_short_8: 'sett',
  label_date_month_short_9: 'ottobre',
  label_date_month_short_10: 'nov',
  label_date_month_short_11: 'dic',
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
  label_duration_days: 'giorni',
  label_duration_hours: 'ore',
  label_duration_minutes: 'minuti',
  label_duration_seconds: 'secondi',
  hint_readonly: '(sola lettura)',
  label_mediainfo_title: 'Titolo',
  label_mediainfo_artist: 'Artista',
  label_mediainfo_album_artist: 'Artista dell\'album',
  label_mediainfo_author: 'Autore',
  label_mediainfo_composer: 'Compositore',
  label_mediainfo_year: 'Anno',
  label_mediainfo_copyright: 'Diritto d\'autore',
  label_mediainfo_album: 'Album',
  label_mediainfo_movie: 'Film',
  label_mediainfo_description: 'Descrizione',
  label_mediainfo_comment: 'Commento',
  label_mediainfo_genre: 'Genere',
  label_mediainfo_location: 'Posizione',
  label_mediainfo_show: 'Mostrare',
  label_mediainfo_episode: 'Episodio',
  label_mediainfo_episode_sort: 'Episodio (ordina)',
  label_mediainfo_season: 'Stagione',
  label_mediainfo_lyrics: 'Testi',
  label_mediainfo_tags: 'Tag',
  label_mediainfo_duration: 'Durata',
  label_mediainfo_width: 'Larghezza',
  label_mediainfo_height: 'Altezza',
  label_mediainfo_size: 'Dimensione',
  label_mediainfo_videoTracks: 'Tracce video',
  label_mediainfo_audioTracks: 'Tracce audio',
  label_mediainfo_format: 'Formato',
  label_mediainfo_contentType: 'Tipo di contenuto',
  label_mediainfo_bitRate: 'Bit rate',
  label_mediainfo_frameRate: 'Frequenza dei fotogrammi',
  label_mediainfo_dateEncoded: 'Data codificata',
  button_admin: 'Configurazione del sito',
  admin_title_site_administration: '{{ title }} Amministrazione',
  admin_title_manage_configuration: 'Configurazione di sistema',
  admin_title_source_administration: 'Amministrazione della fonte',
  admin_title_user_administration: 'Amministrazione utenti',
  admin_title_migrate_data: 'Migrare i dati',
  admin_title_transform_queue: 'Coda di trasformazione multimediale',
  admin_title_site_administration_publicConfig: 'Configurazione pubblica',
  admin_title_site_administration_privateConfig: 'Configurazione privata',
  admin_button_save_config: 'Salva',
  admin_info_config_updated: 'Configurazione del sistema aggiornata correttamente',
  admin_label_publicConfig_title: 'Titolo del sito',
  admin_label_publicConfig_siteUrl: 'indirizzo del sito',
  admin_label_publicConfig_public: 'Pubblico?',
  admin_label_publicConfig_allowRegistration: 'Consenti registrazione?',
  admin_label_publicConfig_limitRegistration: 'Limita la registrazione',
  admin_label_publicConfig_inviteFriendsEnabled: 'Mostra "Invita amici" agli utenti che hanno effettuato l\'accesso?',
  admin_label_publicConfig_locales: 'Locale',
  admin_label_publicConfig_defaultLocale: 'Locale predefinito',
  admin_label_publicConfig_emailEnabled: 'E-mail abilitata?',
  admin_label_publicConfig_timeout: 'Timeout',
  admin_label_publicConfig_timeout_verify: 'Timeout del token di verifica dell\'account',
  admin_label_publicConfig_timeout_resetPassword: 'Reimposta il timeout del token della password',
  admin_label_privateConfig_admin: 'Impostazioni amministratore',
  admin_label_privateConfig_admin_user: 'Utente amministratore',
  admin_label_privateConfig_admin_user_email: 'E-mail',
  admin_label_privateConfig_admin_user_password: 'Parola d\'ordine',
  admin_label_privateConfig_admin_user_firstName: 'Nome di battesimo',
  admin_label_privateConfig_admin_user_lastName: 'Cognome',
  admin_label_privateConfig_admin_user_locale: 'Locale',
  admin_label_privateConfig_admin_overwrite: 'Sovrascrivere?',
  admin_label_privateConfig_email: 'Impostazioni SMTP',
  admin_label_privateConfig_email_host: 'Ospite',
  admin_label_privateConfig_email_port: 'Porta',
  admin_label_privateConfig_email_user: 'Nome utente',
  admin_label_privateConfig_email_password: 'Parola d\'ordine',
  admin_label_privateConfig_email_secure: 'Sicuro?',
  admin_label_privateConfig_email_fromEmail: 'Indirizzo e-mail di sistema',
  admin_label_privateConfig_redis: 'Impostazioni Redis',
  admin_label_privateConfig_redis_host: 'Ospite',
  admin_label_privateConfig_redis_port: 'Porta',
  admin_label_privateConfig_redis_flushAtStartup: 'Lavare all\'avvio?',
  admin_label_privateConfig_redis_listingCacheExpiration: 'Scadenza della cache dell\'elenco',
  admin_label_privateConfig_redis_manifestCacheExpiration: 'Scadenza della cache manifesta',
  admin_label_privateConfig_media: 'Supporto multimediale',
  admin_label_privateConfig_media_video: 'video',
  admin_label_privateConfig_media_video_allowedCommands: 'Comandi consentiti',
  admin_label_privateConfig_encryption: 'Impostazioni di crittografia',
  admin_label_privateConfig_encryption_key: 'Chiave di codifica',
  admin_label_privateConfig_encryption_iv: 'Vettore di inizializzazione (IV)',
  admin_label_privateConfig_encryption_algo: 'Algoritmo',
  admin_label_privateConfig_encryption_bcryptRounds: 'Bcrypt tondi',
  admin_label_privateConfig_session: 'Impostazioni di sessione',
  admin_label_privateConfig_session_expiration: 'Timeout della sessione',
  admin_label_privateConfig_autoscan: 'Impostazioni di scansione automatica',
  admin_label_privateConfig_autoscan_enabled: 'Abilita scansione automatica',
  admin_label_privateConfig_autoscan_interval: 'Intervallo di scansione regolare',
  admin_label_privateConfig_autoscan_initialDelay: 'Ritardo della scansione all\'avvio',
  admin_label_privateConfig_autoscan_showTransformOutput: 'Log di trasformazione dell\'output?',
  admin_label_privateConfig_autoscan_cleanupTemporaryAssets: 'Pulire i file temporanei?',
  admin_label_privateConfig_autoscan_deleteIncompleteUploads: 'Ripulire i caricamenti incompleti?',
  admin_label_privateConfig_autoscan_concurrency: 'Concorrenza',
  admin_label_total_user_count: '{{ totalUserCount }} utenti totali',
  admin_button_delete_user: 'Elimina utente',
  admin_label_confirm_user_delete: 'Conferma l\'eliminazione dell\'utente: {{ email }}',
  label_configCategory: 'Categoria di configurazione',
  admin_button_add_source: 'Aggiungi sorgente',
  admin_title_add_source: 'Aggiungi sorgente',
  admin_button_delete_source: 'Elimina fonte',
  admin_button_scan_source: 'Scansione',
  admin_info_scan_scanning: 'Scansione...',
  admin_info_scan_successful: 'La scansione è iniziata correttamente',
  admin_info_scan_error: 'Si è verificato un errore durante la scansione',
  admin_label_confirm_source_delete: 'Conferma l\'eliminazione della fonte: {{ source }}',
  admin_info_source_added: 'La nuova fonte \'{{ source }}\' è stata aggiunta con successo',
  admin_info_source_add_error: 'Si è verificato un errore durante l\'aggiunta dell\'origine \'{{ source }}\'',
  admin_label_source_name: 'Nome sorgente',
  admin_label_self_source: '{{ title }} spazio di archiviazione',
  admin_label_source_type: 'Tipo di origine',
  admin_label_source_readOnly: 'Sola lettura?',
  admin_label_source_cacheSize: 'Dimensione della cache dell\'elenco (zero per disabilitare)',
  admin_label_source_encryption_enable: 'Abilita crittografia',
  admin_label_source_encryption_key: 'Chiave di codifica',
  admin_label_source_encryption_iv: 'Vettore di inizializzazione (IV)',
  admin_label_source_encryption_algo: 'Algoritmo',
  label_sourceType_local: 'Filesystem locale',
  label_sourceType_local_field_baseDir: 'Monta la directory',
  label_sourceType_local_field_mode: 'Modalità di creazione di file/directory',
  label_sourceType_s3: 'Amazon S3',
  label_sourceType_s3_field_key: 'Chiave di accesso AWS',
  label_sourceType_s3_field_secret: 'Chiave segreta AWS',
  label_sourceType_s3_field_bucket: 'Secchio S3',
  label_sourceType_s3_field_region: 'Regione AWS',
  label_sourceType_s3_field_prefix: 'Prefisso del secchio',
  label_sourceType_s3_field_delimiter: 'Delimitatore',
  label_sourceType_b2: 'Backblaze B2',
  label_sourceType_b2_field_key: 'ID chiave',
  label_sourceType_b2_field_secret: 'Chiave dell\'applicazione',
  label_sourceType_b2_field_bucket: 'ID secchio B2 (non nome)',
  label_sourceType_b2_field_partSize: 'Dimensione della parte',
  label_sourceType_b2_field_prefix: 'Prefisso del secchio',
  label_sourceType_b2_field_delimiter: 'Delimitatore',
  admin_label_firstEvent: 'primo evento',
  admin_label_lastEvent: 'ultimo evento',
  admin_label_eventTime: 'volta',
  admin_label_eventName: 'evento',
  admin_label_eventDescription: 'descrizione',
  admin_label_xformQueueEmpty: 'Nessun lavoro attivo',
  admin_label_migration_noSources: 'Nessuna fonte definita',
  admin_label_migration_results: 'Risultati della migrazione:',
  admin_label_migration_readSource: 'Sorgente da cui migrare i dati',
  admin_label_migration_readPath: 'Leggi dal percorso (vuoto per la radice del filesystem)',
  admin_label_readSource: 'Leggi la fonte',
  admin_label_readPath: 'Leggi percorso',
  admin_label_migration_writeSource: 'Sorgente in cui scrivere i dati',
  admin_label_migration_writePath: 'Scrivi nel percorso (vuoto per la radice del filesystem)',
  admin_label_writeSource: 'Scrivi sorgente',
  admin_label_writePath: 'Scrivi percorso',
  admin_button_migrate_data: 'Migrare i dati',
  admin_info_migration_success: 'Migrazione dei dati riuscita',
  admin_info_migration_error: 'Si è verificato un errore durante la migrazione dei dati',
  http_invalid_request_method: 'Il metodo di richiesta HTTP {{ method }} non è supportato da questo endpoint',
  admin_label_privateConfig_admin_user_username: 'Nome utente',
  locale_id: 'indonesiano',
  locale_ur: 'Urdu'
}