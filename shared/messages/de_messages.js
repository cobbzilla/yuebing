export default {
  id: 'de',
  emoji: '🇩🇪',
  anonymous_user_name: 'mysteriöser',
  welcome_public: 'Willkommen bei {{ title }}!',
  welcome_user: 'Willkommen bei {{ title }}, {{user.firstName || user.email.includes("@") ? user.email.substring(0, user.email.indexOf("@")) : user.email}}!',
  title_login: 'Einloggen',
  title_register: 'Anmeldung',
  title_verifying: 'Konto verifizieren...',
  title_requestPasswordReset: 'Passwort zurücksetzen',
  title_resetPassword: 'Legen Sie ein neues Passwort fest',
  title_verifying_ended: 'Überprüfung beendet',
  title_profile: 'Kontoinformationen',
  button_profile: 'Mein Konto',
  button_update: 'sparen',
  info_profile_update: 'Ihre Kontoinformationen wurden erfolgreich aktualisiert',
  button_reset_password: 'Passwort zurücksetzen',
  button_delete_my_account: 'Mein Konto löschen (kann nicht rückgängig gemacht werden)',
  label_confirm_user_delete: 'Bestätigen Sie die Löschung Ihres Kontos. Diese Aktion ist irreversibel!',
  label_email: 'Email',
  label_username: 'Nutzername',
  label_usernameOrEmail: 'Benutzername oder E-Mail-Adresse',
  label_firstName: 'Vorname',
  label_lastName: 'Nachname',
  label_name: 'Name',
  label_password: 'Passwort',
  label_newPassword: 'Neues Passwort',
  label_locale: 'Sprache',
  label_token: 'Bestätigungstoken',
  label_ctime: 'Erstellt',
  label_mtime: 'Geändert',
  button_login: 'Einloggen',
  button_logout: 'Austragen',
  button_register: 'Anmeldung',
  button_forgot_password: 'Haben Sie Ihr Passwort vergessen?',
  button_send_password_reset_email: 'Senden',
  button_set_new_password: 'Passwort festlegen',
  info_password_reset_email_sent: 'Eine E-Mail-Nachricht wurde an {{ email }} gesendet, suchen Sie in Ihrem Posteingang nach einem Link zum Zurücksetzen Ihres Passworts',
  info_password_reset_email_error: 'Ein Fehler ist aufgetreten und Ihre Nachricht wurde möglicherweise nicht gesendet. Bitte versuchen Sie es später erneut',
  info_password_reset_try_again: 'Versuchen Sie es nochmal',
  info_verify_token_error: 'Das Verifizierungstoken ist abgelaufen oder anderweitig ungültig',
  info_registration_not_allowed: 'Der Betreiber von {{ title }} hat die Kontoerstellung deaktiviert',
  button_invite_friends: 'Lade deine Freunde zu {{ title }} ein!',
  label_friend_emails: 'Durch Kommas oder Leerzeichen getrennte Liste von E-Mails',
  button_send_invitations: 'Einladungen verschicken',
  info_invite_friends_header: 'Lade deine Freunde zu {{ title }} ein!',
  info_invite_friends_subheader: 'Geben Sie hier einige E-Mail-Adressen ein und wir senden ihnen eine Einladung',
  info_invite_friends_limited_registration: 'Der Betreiber von {{ title }} hat die Registrierung auf bestimmte Personen beschränkt. Sie können gerne Einladungen senden, aber diese Benutzer müssen auch vom Site-Administrator zur genehmigten Benutzerliste hinzugefügt werden, bevor sie erfolgreich ein Konto erstellen können',
  info_invite_friends_disabled_no_email: 'Die Funktion "Freunde einladen" ist deaktiviert, da E-Mail nicht auf {{ title }} konfiguriert wurde',
  info_invite_friends_enabled_no_email: 'Die Funktion „Freunde einladen“ ist aktiviert, aber E-Mail wurde nicht auf {{ title }} konfiguriert, sodass sie nicht verwendet werden kann',
  info_invitation_success_results: 'Ihre Einladung wurde erfolgreich an {{ successCount }} Freunde gesendet',
  info_invitation_error_results: 'Ihre Einladung konnte nicht an {{ errorCount }} Freunde zugestellt werden',
  label_search: 'Suche',
  button_search: 'Suche',
  label_sort: 'Sortieren nach',
  label_sort_order: 'Befehl',
  label_sort_ascending: 'aufsteigend',
  label_sort_descending: 'absteigend',
  title_browsing_folder: 'Ordner: {{ folder }}',
  button_back_to: 'Zurück zu {{ prefix }}',
  button_back_to_root_folder: 'Zurück auf höchstem Niveau',
  info_search_no_results: 'Es gibt vierhundertvier Gründe, warum hier etwas sein sollte, aber hier ist nichts',
  label_media_unprocessed: '(unbearbeitet)',
  button_show_media_info: 'Medieninformationen anzeigen',
  button_hide_media_info: 'Medieninformationen ausblenden',
  button_show_thumbnails: 'Vorschaubilder anzeigen',
  button_hide_thumbnails: 'Miniaturansichten ausblenden',
  button_previous_thumbnail: 'früher',
  button_next_thumbnail: 'nächste',
  thumbnail_alt_text: 'Vorschaubild für {{ name }}',
  label_selected_thumbnail: '~ ausgewählt ~',
  button_select_thumbnail: 'Wählen Sie dieses Miniaturbild aus',
  info_no_thumbnails_found: '(keine Thumbnails gefunden)',
  button_show_metadata: 'Metadaten anzeigen',
  button_hide_metadata: 'Metadaten ausblenden',
  error_field_required: '{{ field }} ist erforderlich',
  error_field_invalid: '{{ field }} ist ungültig',
  error_field_regex: '{{ field }} ist ungültig',
  error_field_min: '{{ field }} ist zu kurz',
  error_field_max: '{{ field }} ist zu lang',
  error_field_min_value: '{{ field }} ist zu klein',
  error_field_max_value: '{{ field }} ist zu groß',
  error_field_email: '{{ field }} ist keine gültige E-Mail-Adresse',
  error_field_cannotDeleteSelf: 'Sie können sich nicht selbst löschen',
  error_field_alreadyExists: '{{ thing }} mit {{ field.toLowerCase() }} existiert bereits',
  error_field_readOnly: '{{ field }} ist schreibgeschützt',
  error_field_accountNotFound: 'Konto nicht gefunden oder Passwort falsch',
  error_field_alreadyRegistered: 'Ein Konto mit diesem {{ field.toLowerCase() }} existiert bereits',
  error_field_registrationNotAllowed: 'Der Seitenbetreiber hat die Kontoerstellung deaktiviert',
  error_field_url: '{{ field }} ist keine gültige URL',
  error_field_host: '{{ field }} ist kein gültiger Hostname',
  error_field_locale: '{{ field }} ist kein gültiges Gebietsschema',
  error_field_source: '{{ field }} ist kein Quellenname. Verwenden Sie nur Buchstaben, Zahlen und diese Sonderzeichen: Punkt (.), Bindestrich (-) und Unterstrich (_)',
  error_field_notFound: '{{ field }} konnte nicht gefunden werden',
  error_field_path: '{{ field }} ist kein gültiger Pfad',
  error_field_cannotMirrorToSame: 'Lesequelle und Schreibquelle dürfen nicht dieselbe Quelle sein',
  error_field_raw_hex: '{{ field }} ist keine Hexadezimalzahl (führendes 0x nicht erlaubt)',
  error_field_hex: '{{ field }} ist keine Hexadezimalzahl',
  error_field_username: '{{ field }} ist kein gültiger Benutzername. Muss mit einem Buchstaben beginnen und darf nur Buchstaben, Ziffern, Unterstriche (_), Bindestriche (-) und Punkte (.) enthalten.',
  locale_en: 'Englisch',
  locale_es: 'Spanisch',
  locale_it: 'Italienisch',
  locale_fr: 'Französisch',
  locale_de: 'Deutsch',
  locale_ar: 'Arabisch',
  locale_bn: 'Bengali',
  locale_hi: 'Hindi',
  locale_ja: 'Japanisch',
  locale_ko: 'Koreanisch',
  locale_pt: 'Portugiesisch',
  locale_ru: 'Russisch',
  locale_sw: 'Suaheli',
  locale_zh: 'Chinesisch',
  label_date: '{{MMM}} {{d}}, {{YYYY}}',
  label_date_short: '{{M}}/{{d}}/{{YYYY}}',
  label_date_and_time: '{{MMM}} {{d}}, {{YYYY}} / {{h}}:{{m}}{{a}}',
  label_date_and_time_short: '{{M}}/{{d}}/{{YYYY}} {{h}}:{{m}}{{a}}',
  label_date_undefined: 'Datum/Uhrzeit nicht eingestellt',
  label_date_day_half_am: 'BIN',
  label_date_day_half_pm: 'PN',
  label_date_day_0: 'Sonntag',
  label_date_day_1: 'Montag',
  label_date_day_2: 'Dienstag',
  label_date_day_3: 'Mittwoch',
  label_date_day_4: 'Donnerstag',
  label_date_day_5: 'Freitag',
  label_date_day_6: 'Samstag',
  label_date_day_short_0: 'Sonne',
  label_date_day_short_1: 'Mein',
  label_date_day_short_2: 'Di',
  label_date_day_short_3: 'Heiraten',
  label_date_day_short_4: 'Sammeln',
  label_date_day_short_5: 'Fr',
  label_date_day_short_6: 'Sa',
  label_date_month_0: 'Januar',
  label_date_month_1: 'Februar',
  label_date_month_2: 'Marsch',
  label_date_month_3: 'April',
  label_date_month_4: 'Kann',
  label_date_month_5: 'Juni',
  label_date_month_6: 'Juli',
  label_date_month_7: 'August',
  label_date_month_8: 'September',
  label_date_month_9: 'Oktober',
  label_date_month_10: 'November',
  label_date_month_11: 'Dezember',
  label_date_month_short_0: 'Jan',
  label_date_month_short_1: 'Feb',
  label_date_month_short_2: 'Beschädigen',
  label_date_month_short_3: 'Apr',
  label_date_month_short_4: 'Kann',
  label_date_month_short_5: 'Jun',
  label_date_month_short_6: 'Juli',
  label_date_month_short_7: 'Aug',
  label_date_month_short_8: 'Sep',
  label_date_month_short_9: 'Okt',
  label_date_month_short_10: 'Nov',
  label_date_month_short_11: 'Dez',
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
  label_duration_days: 'Tage',
  label_duration_hours: 'Std.',
  label_duration_minutes: 'Protokoll',
  label_duration_seconds: 'Sekunden',
  hint_readonly: '(schreibgeschützt)',
  label_mediainfo_title: 'Titel',
  label_mediainfo_artist: 'Künstler',
  label_mediainfo_album_artist: 'Album Künstler',
  label_mediainfo_author: 'Autor',
  label_mediainfo_composer: 'Komponist',
  label_mediainfo_year: 'Jahr',
  label_mediainfo_copyright: 'Urheberrechte ©',
  label_mediainfo_album: 'Album',
  label_mediainfo_movie: 'Film',
  label_mediainfo_description: 'Beschreibung',
  label_mediainfo_comment: 'Kommentar',
  label_mediainfo_genre: 'Genre',
  label_mediainfo_location: 'Ort',
  label_mediainfo_show: 'Zeigen',
  label_mediainfo_episode: 'Folge',
  label_mediainfo_episode_sort: 'Folge (sortieren)',
  label_mediainfo_season: 'Jahreszeit',
  label_mediainfo_lyrics: 'Text',
  label_mediainfo_tags: 'Stichworte',
  label_mediainfo_duration: 'Dauer',
  label_mediainfo_width: 'Breite',
  label_mediainfo_height: 'Höhe',
  label_mediainfo_size: 'Größe',
  label_mediainfo_videoTracks: 'Videospuren',
  label_mediainfo_audioTracks: 'Audiospuren',
  label_mediainfo_format: 'Format',
  label_mediainfo_contentType: 'Inhaltstyp',
  label_mediainfo_bitRate: 'Bitrate',
  label_mediainfo_frameRate: 'Bildrate',
  label_mediainfo_dateEncoded: 'Datum codiert',
  button_admin: 'Site-Konfiguration',
  admin_title_site_administration: '{{ title }} Verwaltung',
  admin_title_manage_configuration: 'Systemkonfiguration',
  admin_title_source_administration: 'Quellverwaltung',
  admin_title_user_administration: 'Benutzerverwaltung',
  admin_title_migrate_data: 'Daten migrieren',
  admin_title_transform_queue: 'Medienumwandlungswarteschlange',
  admin_title_site_administration_publicConfig: 'Öffentliche Konfiguration',
  admin_title_site_administration_privateConfig: 'Private Konfiguration',
  admin_button_save_config: 'Speichern',
  admin_info_config_updated: 'Systemkonfiguration erfolgreich aktualisiert',
  admin_label_publicConfig_title: 'Seitentitel',
  admin_label_publicConfig_siteUrl: 'Seiten-URL',
  admin_label_publicConfig_public: 'Öffentlichkeit?',
  admin_label_publicConfig_allowRegistration: 'Registrierung zulassen?',
  admin_label_publicConfig_limitRegistration: 'Registrierung einschränken',
  admin_label_publicConfig_inviteFriendsEnabled: 'Angemeldeten Benutzern „Freunde einladen“ anzeigen?',
  admin_label_publicConfig_locales: 'lokal',
  admin_label_publicConfig_defaultLocale: 'Standardgebietsschema',
  admin_label_publicConfig_emailEnabled: 'E-Mail aktiviert?',
  admin_label_publicConfig_timeout: 'Zeitüberschreitungen',
  admin_label_publicConfig_timeout_verify: 'Zeitüberschreitung des Kontobestätigungstokens',
  admin_label_publicConfig_timeout_resetPassword: 'Kennwort-Token-Timeout zurücksetzen',
  admin_label_privateConfig_admin: 'Administratoreinstellungen',
  admin_label_privateConfig_admin_user: 'Admin-Benutzer',
  admin_label_privateConfig_admin_user_email: 'Email',
  admin_label_privateConfig_admin_user_password: 'Passwort',
  admin_label_privateConfig_admin_user_firstName: 'Vorname',
  admin_label_privateConfig_admin_user_lastName: 'Nachname',
  admin_label_privateConfig_admin_user_locale: 'Lokal',
  admin_label_privateConfig_admin_overwrite: 'Überschreiben?',
  admin_label_privateConfig_email: 'SMTP-Einstellungen',
  admin_label_privateConfig_email_host: 'Gastgeber',
  admin_label_privateConfig_email_port: 'Hafen',
  admin_label_privateConfig_email_user: 'Nutzername',
  admin_label_privateConfig_email_password: 'Passwort',
  admin_label_privateConfig_email_secure: 'Sicher?',
  admin_label_privateConfig_email_fromEmail: 'E-Mail-Adresse des Systems',
  admin_label_privateConfig_redis: 'Redis-Einstellungen',
  admin_label_privateConfig_redis_host: 'Gastgeber',
  admin_label_privateConfig_redis_port: 'Hafen',
  admin_label_privateConfig_redis_flushAtStartup: 'Beim Start spülen?',
  admin_label_privateConfig_redis_listingCacheExpiration: 'Cache-Ablauf auflisten',
  admin_label_privateConfig_redis_manifestCacheExpiration: 'Manifest-Cache-Ablauf',
  admin_label_privateConfig_media: 'Medienunterstützung',
  admin_label_privateConfig_media_video: 'Video',
  admin_label_privateConfig_media_video_allowedCommands: 'Erlaubte Befehle',
  admin_label_privateConfig_encryption: 'Verschlüsselungseinstellungen',
  admin_label_privateConfig_encryption_key: 'Verschlüsselungsschlüssel',
  admin_label_privateConfig_encryption_iv: 'Initialisierungsvektor (IV)',
  admin_label_privateConfig_encryption_algo: 'Algorithmus',
  admin_label_privateConfig_encryption_bcryptRounds: 'Bcrypt-Runden',
  admin_label_privateConfig_session: 'Sitzungseinstellungen',
  admin_label_privateConfig_session_expiration: 'Session-Timeout',
  admin_label_privateConfig_autoscan: 'Autoscan-Einstellungen',
  admin_label_privateConfig_autoscan_enabled: 'Autoscan aktivieren',
  admin_label_privateConfig_autoscan_interval: 'Regelmäßiges Scan-Intervall',
  admin_label_privateConfig_autoscan_initialDelay: 'Start-Scan-Verzögerung',
  admin_label_privateConfig_autoscan_showTransformOutput: 'Log-Transformationsausgabe?',
  admin_label_privateConfig_autoscan_cleanupTemporaryAssets: 'Temporäre Dateien bereinigen?',
  admin_label_privateConfig_autoscan_deleteIncompleteUploads: 'Unvollständige Uploads bereinigen?',
  admin_label_privateConfig_autoscan_concurrency: 'Parallelität',
  admin_label_total_user_count: '{{ totalUserCount }} Gesamtzahl der Benutzer',
  admin_button_delete_user: 'Benutzer löschen',
  admin_label_confirm_user_delete: 'Bitte bestätigen Sie das Löschen des Benutzers: {{ email }}',
  label_configCategory: 'Konfigurationskategorie',
  admin_button_add_source: 'Quelle hinzufügen',
  admin_title_add_source: 'Quelle hinzufügen',
  admin_button_delete_source: 'Quelle löschen',
  admin_button_scan_source: 'Scan',
  admin_info_scan_scanning: 'Scannen...',
  admin_info_scan_successful: 'Der Scan wurde erfolgreich gestartet',
  admin_info_scan_error: 'Während des Scans ist ein Fehler aufgetreten',
  admin_label_confirm_source_delete: 'Bitte bestätigen Sie das Löschen der Quelle: {{ source }}',
  admin_info_source_added: 'Die neue Quelle „{{ source }}“ wurde erfolgreich hinzugefügt',
  admin_info_source_add_error: 'Beim Hinzufügen der Quelle \'{{ source }}\' ist ein Fehler aufgetreten',
  admin_label_source_name: 'Quellenname',
  admin_label_self_source: '{{ title }} Speicher',
  admin_label_source_type: 'Quelle Typ',
  admin_label_source_readOnly: 'Schreibgeschützt?',
  admin_label_source_cacheSize: 'Größe des Listen-Cache (null zum Deaktivieren)',
  admin_label_source_encryption_enable: 'Verschlüsselung aktivieren',
  admin_label_source_encryption_key: 'Verschlüsselungsschlüssel',
  admin_label_source_encryption_iv: 'Initialisierungsvektor (IV)',
  admin_label_source_encryption_algo: 'Algorithmus',
  label_sourceType_local: 'Lokales Dateisystem',
  label_sourceType_local_field_baseDir: 'Mount-Verzeichnis',
  label_sourceType_local_field_mode: 'Datei-/Verzeichniserstellungsmodus',
  label_sourceType_s3: 'Amazon S3',
  label_sourceType_s3_field_key: 'AWS-Zugriffsschlüssel',
  label_sourceType_s3_field_secret: 'AWS-Geheimschlüssel',
  label_sourceType_s3_field_bucket: 'S3-Eimer',
  label_sourceType_s3_field_region: 'AWS-Region',
  label_sourceType_s3_field_prefix: 'Bucket-Präfix',
  label_sourceType_s3_field_delimiter: 'Trennzeichen',
  label_sourceType_b2: 'Backblaze B2',
  label_sourceType_b2_field_key: 'Schlüssel-ID',
  label_sourceType_b2_field_secret: 'Anwendungsschlüssel',
  label_sourceType_b2_field_bucket: 'B2-Bucket-ID (nicht Name)',
  label_sourceType_b2_field_partSize: 'Teilegröße',
  label_sourceType_b2_field_prefix: 'Bucket-Präfix',
  label_sourceType_b2_field_delimiter: 'Trennzeichen',
  admin_label_firstEvent: 'erste Veranstaltung',
  admin_label_lastEvent: 'letzte Veranstaltung',
  admin_label_eventTime: 'Zeit',
  admin_label_eventName: 'Veranstaltung',
  admin_label_eventDescription: 'Bezeichnung',
  admin_label_xformQueueEmpty: 'Keine aktiven Jobs',
  admin_label_migration_noSources: 'Keine Quellen definiert',
  admin_label_migration_results: 'Migrationsergebnisse:',
  admin_label_migration_readSource: 'Quelle, aus der Daten migriert werden sollen',
  admin_label_migration_readPath: 'Aus Pfad lesen (leer für Dateisystem-Root)',
  admin_label_readSource: 'Quelle lesen',
  admin_label_readPath: 'Weg lesen',
  admin_label_migration_writeSource: 'Quelle zum Schreiben von Daten',
  admin_label_migration_writePath: 'In Pfad schreiben (leer für Dateisystem-Root)',
  admin_label_writeSource: 'Quelle schreiben',
  admin_label_writePath: 'Pfad schreiben',
  admin_button_migrate_data: 'Daten migrieren',
  admin_info_migration_success: 'Daten erfolgreich migriert',
  admin_info_migration_error: 'Beim Migrieren von Daten ist ein Fehler aufgetreten',
  http_invalid_request_method: 'Die HTTP-Anforderungsmethode {{ method }} wird von diesem Endpunkt nicht unterstützt',
  admin_label_privateConfig_admin_user_username: 'Nutzername'
}
