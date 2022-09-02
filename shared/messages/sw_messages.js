export default {
  id: 'sw',
  emoji: '🇰🇪',
  anonymous_user_name: 'moja ya ajabu',
  welcome_public: 'Karibu kwenye {{ title }}!',
  welcome_user: 'Karibu kwa {{ title }}, {{user.firstName || user.email.includes("@") ? user.email.substring(0, user.email.indexOf("@")) : user.email}}!',
  title_login: 'Weka sahihi',
  title_register: 'Jisajili',
  title_verifying: 'Inathibitisha akaunti...',
  title_requestPasswordReset: 'Weka upya nenosiri',
  title_resetPassword: 'Weka nenosiri jipya',
  title_verifying_ended: 'Uthibitishaji umeisha',
  title_profile: 'Taarifa za Akaunti',
  button_profile: 'Akaunti yangu',
  button_update: 'kuokoa',
  info_profile_update: 'Maelezo ya akaunti yako yalisasishwa kwa ufanisi',
  button_reset_password: 'Weka upya nenosiri',
  button_delete_my_account: 'Futa akaunti yangu (HAIWEZI KUTENDEWA)',
  label_confirm_user_delete: 'Thibitisha kufutwa kwa akaunti yako. Kitendo hiki hakiwezi kutenduliwa!',
  label_email: 'Barua pepe',
  label_username: 'Jina la mtumiaji',
  label_usernameOrEmail: 'Jina la mtumiaji au barua pepe',
  label_firstName: 'Jina la kwanza',
  label_lastName: 'Jina la familia',
  label_name: 'Jina',
  label_password: 'Nenosiri',
  label_newPassword: 'Nenosiri mpya',
  label_locale: 'Lugha',
  label_token: 'Tokeni ya uthibitishaji',
  label_ctime: 'Imeundwa',
  label_mtime: 'Imebadilishwa',
  button_login: 'Weka sahihi',
  button_logout: 'Toka',
  button_register: 'Jisajili',
  button_forgot_password: 'Umesahau nenosiri yako?',
  button_send_password_reset_email: 'Tuma',
  button_set_new_password: 'Weka Nenosiri',
  info_password_reset_email_sent: 'Barua pepe ilitumwa kwa {{ email }}, angalia kisanduku pokezi chako ili kupata kiungo cha kuweka upya nenosiri lako',
  info_password_reset_email_error: 'Hitilafu imetokea na huenda ujumbe wako haujatumwa. Tafadhali jaribu tena baadae',
  info_password_reset_try_again: 'Jaribu tena',
  info_verify_token_error: 'Tokeni ya uthibitishaji imekwisha muda wake au si sahihi',
  info_registration_not_allowed: 'Opereta wa {{ title }} amezima uundaji wa akaunti',
  button_invite_friends: 'Alika marafiki zako kwenye {{ title }}!',
  label_friend_emails: 'Orodha ya barua pepe zilizotenganishwa na koma au nafasi',
  button_send_invitations: 'Tuma mialiko',
  info_invite_friends_header: 'Alika marafiki zako kwenye {{ title }}!',
  info_invite_friends_subheader: 'Weka baadhi ya anwani za barua pepe hapa na tutawatumia mwaliko',
  info_invite_friends_limited_registration: 'Opereta wa {{ title }} ana usajili mdogo kwa watu mahususi. Unakaribishwa kutuma mialiko, lakini watumiaji hawa lazima pia waongezwe orodha iliyoidhinishwa ya watumiaji na msimamizi wa tovuti kabla wataweza kuunda akaunti kwa ufanisi.',
  info_invite_friends_disabled_no_email: 'Kipengele cha "alika marafiki" kimezimwa kwa sababu barua pepe haijasanidiwa kwenye {{ title }}',
  info_invite_friends_enabled_no_email: 'Kipengele cha "alika marafiki" kimewashwa lakini barua pepe haijasanidiwa kwenye {{ title }}, kwa hivyo haiwezi kutumika.',
  info_invitation_success_results: 'Mwaliko wako umetumwa kwa marafiki {{ successCount }}',
  info_invitation_error_results: 'Mwaliko wako haukuweza kuwasilishwa kwa marafiki {{ errorCount }}',
  label_search: 'Tafuta',
  button_search: 'Tafuta',
  label_sort: 'Panga kwa',
  label_sort_order: 'Agizo',
  label_sort_ascending: 'kupanda',
  label_sort_descending: 'kushuka',
  title_browsing_folder: 'Folda: {{ folda }}',
  button_back_to: 'Rudi kwa {{ kiambishi awali }}',
  button_back_to_root_folder: 'Rudi kwa kiwango cha juu',
  info_search_no_results: 'Kuna sababu mia nne na nne kwamba kitu kinapaswa kuwa hapa, lakini hakuna kitu hapa',
  label_media_unprocessed: '(haijachakatwa)',
  button_show_media_info: 'onyesha habari za media',
  button_hide_media_info: 'ficha habari za media',
  button_show_thumbnails: 'onyesha vijipicha',
  button_hide_thumbnails: 'ficha vijipicha',
  button_previous_thumbnail: 'uliopita',
  button_next_thumbnail: 'ijayo',
  thumbnail_alt_text: 'kijipicha cha {{ jina }}',
  label_selected_thumbnail: '~ selected ~',
  button_select_thumbnail: 'chagua kijipicha hiki',
  info_no_thumbnails_found: '(hakuna vijipicha vilivyopatikana)',
  button_show_metadata: 'onyesha metadata',
  button_hide_metadata: 'ficha metadata',
  error_field_required: '{{ uga }} inahitajika',
  error_field_invalid: '{{ uga }} si halali',
  error_field_regex: '{{ uga }} si halali',
  error_field_min: '{{ field }} ni fupi mno',
  error_field_max: '{{ field }} ni ndefu sana',
  error_field_min_value: '{{ field }} ni ndogo sana',
  error_field_max_value: '{{ field }} ni kubwa mno',
  error_field_email: '{{ field }} si anwani halali ya barua pepe',
  error_field_cannotDeleteSelf: 'Huwezi kufuta mwenyewe',
  error_field_alreadyExists: '{{ thing }} yenye {{field.toLowerCase() }} tayari ipo',
  error_field_readOnly: '{{ field }} ni ya kusoma tu',
  error_field_accountNotFound: 'Akaunti haijapatikana au nenosiri si sahihi',
  error_field_alreadyRegistered: 'Akaunti iliyo na {{ field.toLowerCase() }} tayari ipo',
  error_field_registrationNotAllowed: 'Opereta wa tovuti amezima uundaji wa akaunti',
  error_field_url: '{{ field }} si URL halali',
  error_field_host: '{{ field }} si jina halali la mpangishaji',
  error_field_locale: '{{ field }} si lugha halali',
  error_field_source: '{{ field }} si jina la chanzo. Tumia herufi, nambari na herufi hizi maalum pekee: kipindi (.), kistari (-) na kistari (_)',
  error_field_notFound: '{{ field }} haikuweza kupatikana',
  error_field_path: '{{ field }} si njia sahihi',
  error_field_cannotMirrorToSame: 'Chanzo cha kusoma na kuandika hakiwezi kuwa chanzo sawa',
  error_field_raw_hex: '{{ uga }} si nambari ya heksadesimali (inayoongoza kwa 0x hairuhusiwi)',
  error_field_hex: '{{ field }} si nambari ya heksadesimali',
  error_field_username: '{{ field }} si jina la mtumiaji halali. Lazima ianze na herufi na iwe na herufi, nambari, mistari chini (_), vistari (-) na vitone (.)',
  locale_en: 'Kiingereza (Marekani)',
  locale_es: 'Kihispania',
  locale_it: 'Kiitaliano',
  locale_fr: 'Kifaransa',
  locale_de: 'Kijerumani',
  locale_ar: 'Kiarabu',
  locale_bn: 'Kibengali',
  locale_hi: 'Hapana',
  locale_ja: 'Kijapani',
  locale_ko: 'Kikorea',
  locale_pt: 'Kireno',
  locale_ru: 'Kirusi',
  locale_zh: 'Kichina',
  locale_sw: 'Kiswahili',
  label_date: '{{MMM}} {{d}}, {{YYYY}}',
  label_date_short: '{{M}}/{{d}}/{{YYYY}}',
  label_date_and_time: '{{MMM}} {{d}}, {{YYYY}} / {{h}}:{{m}}{{a}}',
  label_date_and_time_short: '{{M}}/{{d}}/{{YYYY}} {{h}}:{{m}}{{a}}',
  label_date_undefined: 'Tarehe/saa haijawekwa',
  label_date_day_half_am: 'AM',
  label_date_day_half_pm: 'PM',
  label_date_day_0: 'Jumapili',
  label_date_day_1: 'Jumatatu',
  label_date_day_2: 'Jumanne',
  label_date_day_3: 'Jumatano',
  label_date_day_4: 'Alhamisi',
  label_date_day_5: 'Ijumaa',
  label_date_day_6: 'Jumamosi',
  label_date_day_short_0: 'Jua',
  label_date_day_short_1: 'Yangu',
  label_date_day_short_2: 'Jumanne',
  label_date_day_short_3: 'Jumatano',
  label_date_day_short_4: 'Kusanya',
  label_date_day_short_5: 'Ijumaa',
  label_date_day_short_6: 'Sat',
  label_date_month_0: 'Januari',
  label_date_month_1: 'Februari',
  label_date_month_2: 'Machi',
  label_date_month_3: 'Aprili',
  label_date_month_4: 'Mei',
  label_date_month_5: 'Juni',
  label_date_month_6: 'Julai',
  label_date_month_7: 'Agosti',
  label_date_month_8: 'Septemba',
  label_date_month_9: 'Oktoba',
  label_date_month_10: 'Novemba',
  label_date_month_11: 'Desemba',
  label_date_month_short_0: 'Jan',
  label_date_month_short_1: 'Feb',
  label_date_month_short_2: 'Machi',
  label_date_month_short_3: 'Apr',
  label_date_month_short_4: 'Mei',
  label_date_month_short_5: 'Juni',
  label_date_month_short_6: 'Julai',
  label_date_month_short_7: 'Aug',
  label_date_month_short_8: 'Sep',
  label_date_month_short_9: 'Okt',
  label_date_month_short_10: 'Nov',
  label_date_month_short_11: 'Des',
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
  label_duration_days: 'siku',
  label_duration_hours: 'masaa',
  label_duration_minutes: 'dakika',
  label_duration_seconds: 'sekunde',
  hint_readonly: '(kusoma pekee)',
  label_mediainfo_title: 'Kichwa',
  label_mediainfo_artist: 'Msanii',
  label_mediainfo_album_artist: 'Msanii wa Albamu',
  label_mediainfo_author: 'Mwandishi',
  label_mediainfo_composer: 'Mtunzi',
  label_mediainfo_year: 'Mwaka',
  label_mediainfo_copyright: 'Hakimiliki',
  label_mediainfo_album: 'Albamu',
  label_mediainfo_movie: 'Filamu',
  label_mediainfo_description: 'Maelezo',
  label_mediainfo_comment: 'Maoni',
  label_mediainfo_genre: 'Aina',
  label_mediainfo_location: 'Mahali',
  label_mediainfo_show: 'Onyesha',
  label_mediainfo_episode: 'Kipindi',
  label_mediainfo_episode_sort: 'Kipindi (panga)',
  label_mediainfo_season: 'Msimu',
  label_mediainfo_lyrics: 'Maneno ya Nyimbo',
  label_mediainfo_tags: 'Lebo',
  label_mediainfo_duration: 'Muda',
  label_mediainfo_width: 'Upana',
  label_mediainfo_height: 'Urefu',
  label_mediainfo_size: 'Ukubwa',
  label_mediainfo_videoTracks: 'Nyimbo za Video',
  label_mediainfo_audioTracks: 'Nyimbo za Sauti',
  label_mediainfo_format: 'Umbizo',
  label_mediainfo_contentType: 'Aina ya Maudhui',
  label_mediainfo_bitRate: 'Kiwango kidogo',
  label_mediainfo_frameRate: 'Kiwango cha Fremu',
  label_mediainfo_dateEncoded: 'Tarehe Iliyosimbwa',
  button_admin: 'Usanidi wa Tovuti',
  admin_title_site_administration: '{{ title }} Utawala',
  admin_title_manage_configuration: 'Usanidi wa Mfumo',
  admin_title_source_administration: 'Utawala wa Chanzo',
  admin_title_user_administration: 'Utawala wa Mtumiaji',
  admin_title_migrate_data: 'Hamisha Data',
  admin_title_transform_queue: 'Foleni ya Kubadilisha Vyombo vya Habari',
  admin_title_site_administration_publicConfig: 'Usanidi wa Umma',
  admin_title_site_administration_privateConfig: 'Usanidi wa Kibinafsi',
  admin_button_save_config: 'Hifadhi',
  admin_info_config_updated: 'Mipangilio ya mfumo imesasishwa',
  admin_label_publicConfig_title: 'Kichwa cha Tovuti',
  admin_label_publicConfig_siteUrl: 'URL ya tovuti',
  admin_label_publicConfig_public: 'Umma?',
  admin_label_publicConfig_allowRegistration: 'Ruhusu Usajili?',
  admin_label_publicConfig_limitRegistration: 'Usajili wa Kikomo',
  admin_label_publicConfig_inviteFriendsEnabled: 'Onyesha \'Alika Marafiki\' kwa watumiaji walioingia?',
  admin_label_publicConfig_locales: 'mtaa',
  admin_label_publicConfig_defaultLocale: 'Maeneo Chaguomsingi',
  admin_label_publicConfig_emailEnabled: 'Barua pepe Imewashwa?',
  admin_label_publicConfig_timeout: 'Muda umeisha',
  admin_label_publicConfig_timeout_verify: 'Muda wa Tokeni ya Uthibitishaji wa Akaunti',
  admin_label_publicConfig_timeout_resetPassword: 'Weka upya Muda wa Tokeni ya Nenosiri',
  admin_label_privateConfig_admin: 'Mipangilio ya Msimamizi',
  admin_label_privateConfig_admin_user: 'Mtumiaji Msimamizi',
  admin_label_privateConfig_admin_user_email: 'Barua pepe',
  admin_label_privateConfig_admin_user_password: 'Nenosiri',
  admin_label_privateConfig_admin_user_firstName: 'Jina la kwanza',
  admin_label_privateConfig_admin_user_lastName: 'Jina la familia',
  admin_label_privateConfig_admin_user_locale: 'Ndani',
  admin_label_privateConfig_admin_overwrite: 'Ungependa kufuta?',
  admin_label_privateConfig_email: 'Mipangilio ya SMTP',
  admin_label_privateConfig_email_host: 'Mwenyeji',
  admin_label_privateConfig_email_port: 'Bandari',
  admin_label_privateConfig_email_user: 'Jina la mtumiaji',
  admin_label_privateConfig_email_password: 'Nenosiri',
  admin_label_privateConfig_email_secure: 'Je, uko salama?',
  admin_label_privateConfig_email_fromEmail: 'Anwani ya barua pepe ya mfumo',
  admin_label_privateConfig_redis: 'Redis Mipangilio',
  admin_label_privateConfig_redis_host: 'Mwenyeji',
  admin_label_privateConfig_redis_port: 'Bandari',
  admin_label_privateConfig_redis_flushAtStartup: 'Je, ungependa kuanza?',
  admin_label_privateConfig_redis_listingCacheExpiration: 'Muda wa kuisha kwa akiba',
  admin_label_privateConfig_redis_manifestCacheExpiration: 'Onyesha mwisho wa muda wa akiba',
  admin_label_privateConfig_media: 'Usaidizi wa Vyombo vya Habari',
  admin_label_privateConfig_media_video: 'Video',
  admin_label_privateConfig_media_video_allowedCommands: 'Amri zinazoruhusiwa',
  admin_label_privateConfig_encryption: 'Mipangilio ya Usimbaji',
  admin_label_privateConfig_encryption_key: 'Ufunguo wa Usimbaji',
  admin_label_privateConfig_encryption_iv: 'Vekta ya Kuanzisha (IV)',
  admin_label_privateConfig_encryption_algo: 'Algorithm',
  admin_label_privateConfig_encryption_bcryptRounds: 'Bcrypt raundi',
  admin_label_privateConfig_session: 'Mipangilio ya Kikao',
  admin_label_privateConfig_session_expiration: 'Muda wa kikao umekwisha',
  admin_label_privateConfig_autoscan: 'Changanua kiotomatiki Mipangilio',
  admin_label_privateConfig_autoscan_enabled: 'Washa uchanganuzi kiotomatiki',
  admin_label_privateConfig_autoscan_interval: 'Muda wa skanning mara kwa mara',
  admin_label_privateConfig_autoscan_initialDelay: 'Kuchelewa kwa skanning ya kuanza',
  admin_label_privateConfig_autoscan_showTransformOutput: 'Toleo la kubadilisha kumbukumbu?',
  admin_label_privateConfig_autoscan_cleanupTemporaryAssets: 'Je, ungependa kusafisha faili za muda?',
  admin_label_privateConfig_autoscan_deleteIncompleteUploads: 'Je, ungependa kusafisha upakiaji ambao haujakamilika?',
  admin_label_privateConfig_autoscan_concurrency: 'Concurrency',
  admin_label_total_user_count: '{{ totalUserCount }} jumla ya watumiaji',
  admin_button_delete_user: 'Futa Mtumiaji',
  admin_label_confirm_user_delete: 'Tafadhali thibitisha kufutwa kwa mtumiaji: {{ barua pepe }}',
  label_configCategory: 'Kategoria ya usanidi',
  admin_button_add_source: 'Ongeza Chanzo',
  admin_title_add_source: 'Ongeza Chanzo',
  admin_button_delete_source: 'Futa Chanzo',
  admin_button_scan_source: 'Changanua',
  admin_info_scan_scanning: 'Inachanganua...',
  admin_info_scan_successful: 'Uchanganuzi umeanza',
  admin_info_scan_error: 'Hitilafu ilitokea wakati wa utafutaji',
  admin_label_confirm_source_delete: 'Tafadhali thibitisha kufutwa kwa chanzo: {{ source }}',
  admin_info_source_added: 'Chanzo kipya \'{{chanzo }}\' kiliongezwa kwa ufanisi',
  admin_info_source_add_error: 'Hitilafu imetokea wakati wa kuongeza chanzo \'{{ source }}\'',
  admin_label_source_name: 'Jina la Chanzo',
  admin_label_self_source: '{{ title }} hifadhi',
  admin_label_source_type: 'Aina ya Chanzo',
  admin_label_source_readOnly: 'Kusoma pekee?',
  admin_label_source_cacheSize: 'Saizi ya akiba ya orodha (ziro ili kuzima)',
  admin_label_source_encryption_enable: 'Washa usimbaji fiche',
  admin_label_source_encryption_key: 'Kitufe cha usimbaji fiche',
  admin_label_source_encryption_iv: 'Vekta ya uanzishaji (IV)',
  admin_label_source_encryption_algo: 'Algorithm',
  label_sourceType_local: 'Mfumo wa faili wa ndani',
  label_sourceType_local_field_baseDir: 'Weka saraka',
  label_sourceType_local_field_mode: 'Hali ya kuunda faili/saraka',
  label_sourceType_s3: 'Amazon S3',
  label_sourceType_s3_field_key: 'Ufunguo wa Ufikiaji wa AWS',
  label_sourceType_s3_field_secret: 'Ufunguo wa Siri wa AWS',
  label_sourceType_s3_field_bucket: 'Ndoo ya S3',
  label_sourceType_s3_field_region: 'Mkoa wa AWS',
  label_sourceType_s3_field_prefix: 'Kiambishi awali cha ndoo',
  label_sourceType_s3_field_delimiter: 'Delimiter',
  label_sourceType_b2: 'Backblaze B2',
  label_sourceType_b2_field_key: 'Kitambulisho muhimu',
  label_sourceType_b2_field_secret: 'Ufunguo wa Maombi',
  label_sourceType_b2_field_bucket: 'Kitambulisho cha Ndoo ya B2 (sio jina)',
  label_sourceType_b2_field_partSize: 'Ukubwa wa sehemu',
  label_sourceType_b2_field_prefix: 'Kiambishi awali cha ndoo',
  label_sourceType_b2_field_delimiter: 'Delimiter',
  admin_label_firstEvent: 'tukio la kwanza',
  admin_label_lastEvent: 'tukio la mwisho',
  admin_label_eventTime: 'wakati',
  admin_label_eventName: 'tukio',
  admin_label_eventDescription: 'maelezo',
  admin_label_xformQueueEmpty: 'Hakuna kazi zinazoendelea',
  admin_label_migration_noSources: 'Hakuna vyanzo vilivyofafanuliwa',
  admin_label_migration_results: 'Matokeo ya uhamiaji:',
  admin_label_migration_readSource: 'Chanzo cha kuhamisha data kutoka',
  admin_label_migration_readPath: 'Soma kutoka kwa njia (tupu kwa mzizi wa mfumo wa faili)',
  admin_label_readSource: 'Soma chanzo',
  admin_label_readPath: 'Soma njia',
  admin_label_migration_writeSource: 'Chanzo cha kuandikia data',
  admin_label_migration_writePath: 'Andika kwa njia (tupu kwa mzizi wa mfumo wa faili)',
  admin_label_writeSource: 'Andika chanzo',
  admin_label_writePath: 'Andika njia',
  admin_button_migrate_data: 'Hamisha Data',
  admin_info_migration_success: 'Data imehamishwa',
  admin_info_migration_error: 'Hitilafu ilitokea wakati wa kuhamisha data',
  http_invalid_request_method: 'Mbinu ya ombi la HTTP {{ method }} haitumiki katika sehemu hii ya mwisho'
}
