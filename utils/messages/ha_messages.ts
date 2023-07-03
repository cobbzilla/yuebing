export default {
  id: 'ha',
  emoji: '🇹🇩',
  anonymous_user_name: 'm',
  welcome_public: 'Barka da zuwa {{ title }} !',
  welcome_user: 'Barka da zuwa {{ title }} , {{user.firstName || user.email.includes("@") ? user.email.substring(0, user.email.indexOf("@")) : user.email}} !',
  title_login: 'Shiga',
  title_register: 'Shiga',
  title_verifying: 'Tabbatar da asusun...',
  title_requestPasswordReset: 'Sake saita kalmar wucewa',
  title_resetPassword: 'Saita sabon kalmar sirri',
  title_verifying_ended: 'Tabbatarwa ya ƙare',
  title_profile: 'Bayanin Asusu',
  button_profile: 'Asusu na',
  button_update: 'ajiye',
  info_profile_update: 'An yi nasarar sabunta bayanan asusun ku',
  button_reset_password: 'Sake saita kalmar wucewa',
  button_delete_my_account: 'Share asusuna (Ba za a iya soke)',
  label_confirm_user_delete: 'Tabbatar da goge asusun ku. Wannan aikin ba zai yuwu ba!',
  label_email: 'Imel',
  label_username: 'Sunan mai amfani',
  label_usernameOrEmail: 'Sunan mai amfani ko imel',
  label_firstName: 'Sunan rana',
  label_lastName: 'Sunan mahaifa',
  label_name: 'Suna',
  label_password: 'Kalmar wucewa',
  label_newPassword: 'Sabuwar kalmar sirri',
  label_locale: 'Harshe',
  label_token: 'Alamar tabbatarwa',
  label_ctime: 'Ƙirƙiri',
  label_mtime: 'Gyara',
  button_login: 'Shiga',
  button_logout: 'Fita',
  button_register: 'Shiga',
  button_forgot_password: 'manta da kalmar shigar ki?',
  button_send_password_reset_email: 'Aika',
  button_set_new_password: 'Saita Kalmar wucewa',
  info_password_reset_email_sent: 'An aika saƙon imel zuwa {{ email }} , duba akwatin saƙon saƙo don hanyar haɗi don sake saita kalmar wucewa',
  info_password_reset_email_error: 'An sami kuskure kuma ƙila ba a aika saƙon ku ba. Da fatan za a sake gwadawa daga baya',
  info_password_reset_try_again: 'Gwada kuma',
  info_verify_token_error: 'Alamar tabbatarwa ta ƙare ko kuma ba ta da inganci',
  info_registration_not_allowed: 'Mai aiki na {{ title }} ya kashe ƙirƙira asusu',
  button_invite_friends: 'Gayyato abokanka zuwa {{ title }} !',
  label_friend_emails: 'Jerin imel ɗin da aka raba ta waƙafi ko sarari',
  button_send_invitations: 'Aika gayyata',
  info_invite_friends_header: 'Gayyato abokanka zuwa {{ title }} !',
  info_invite_friends_subheader: 'Shigar da wasu adiresoshin imel a nan kuma za mu aika musu gayyata',
  info_invite_friends_limited_registration: 'Mai aiki na {{ title }} yana da iyakataccen rajista ga takamaiman mutane. Kuna marhabin da aika gayyata, amma waɗannan masu amfani kuma dole ne a ƙara su cikin jerin amintattun masu amfani da mai gudanar da rukunin yanar gizon kafin su sami nasarar ƙirƙirar asusu cikin nasara.',
  info_invite_friends_disabled_no_email: 'An kashe fasalin &quot;gayyatar abokai&quot; saboda ba a saita imel a ranar {{ title }}',
  info_invite_friends_enabled_no_email: 'An kunna fasalin &quot;gayyatar abokai&quot; amma ba a saita imel a ranar {{ title }} ba, don haka ba za a iya amfani da shi ba.',
  info_invitation_success_results: 'An yi nasarar aika gayyatar ku zuwa abokai {{ successCount }}',
  info_invitation_error_results: 'An kasa isar da gayyatar ga abokai {{ errorCount }}',
  label_search: 'Bincika',
  button_search: 'Bincika',
  label_sort: 'Kasa',
  label_sort_order: 'Oda',
  label_sort_ascending: 'hawan hawa',
  label_sort_descending: 'saukowa',
  title_browsing_folder: 'Jaka: {{ folder }}',
  button_back_to: 'Komawa {{ prefix }}',
  button_back_to_root_folder: 'Komawa zuwa babban matakin',
  info_search_no_results: 'Akwai dalilai dari hudu da hudu cewa wani abu ya kamata a nan, amma babu komai a nan',
  label_media_unprocessed: '(ba a sarrafa)',
  button_show_media_info: 'nuna bayanan kafofin watsa labarai',
  button_hide_media_info: 'boye bayanan kafofin watsa labarai',
  button_show_thumbnails: 'nuna babban hoto',
  button_hide_thumbnails: 'boye babban hoto',
  button_previous_thumbnail: 'baya',
  button_next_thumbnail: 'na gaba',
  thumbnail_alt_text: 'Hoton ɗan yatsa na {{ name }}',
  label_selected_thumbnail: '~ zaba ~',
  button_select_thumbnail: 'zaɓi wannan ɗan yatsa',
  info_no_thumbnails_found: '(ba a sami babban hoto ba)',
  button_show_metadata: 'nuna metadata',
  button_hide_metadata: 'boye metadata',
  error_field_required: '{{ field }} ana buƙata',
  error_field_invalid: '{{ field }} ba shi da inganci',
  error_field_regex: '{{ field }} ba shi da inganci',
  error_field_min: '{{ field }} gajere ne sosai',
  error_field_max: '{{ field }} yayi tsayi da yawa',
  error_field_min_value: '{{ field }} ya yi kankanta sosai',
  error_field_max_value: '{{ field }} yayi girma da yawa',
  error_field_email: '{{ field }} ba ingantaccen adireshin imel ba ne',
  error_field_cannotDeleteSelf: 'Ba za ku iya share kanku ba',
  error_field_alreadyExists: '{{ thing }} tare da {{ field.toLowerCase() }} tuni ya wanzu',
  error_field_readOnly: '{{ field }} karantawa-kawai',
  error_field_accountNotFound: 'Ba a samo asusu ba ko kalmar sirri ba daidai ba',
  error_field_alreadyRegistered: 'Akwai asusu mai wannan {{ field.toLowerCase() }}',
  error_field_registrationNotAllowed: 'Ma&#39;aikacin rukunin yanar gizon ya kashe ƙirƙirar asusun',
  error_field_url: '{{ field }} ba ingantaccen URL ba ne',
  error_field_host: '{{ field }} ba ingantaccen suna ba ne',
  error_field_locale: '{{ field }} ba ingantaccen yanki bane',
  error_field_volume: '{{ field }} ba sunan tushe ba ne. Yi amfani da haruffa kawai, lambobi, da waɗannan haruffa na musamman: lokaci (.), saƙa (-) da ƙaranci (_)',
  error_field_notFound: '{{ field }} ba za a iya gano shi ba',
  error_field_path: '{{ field }} ba hanya ce mai inganci ba',
  error_field_cannotMirrorToSame: 'Madogarar karantawa da tushe ba za su iya zama tushe ɗaya ba',
  error_field_raw_hex: '{{ field }} ba lambar hexadecimal ba ce (ba a yarda da jagorar 0x)',
  error_field_hex: '{{ field }} ba lambar hexadecimal ba ce',
  error_field_username: '{{ field }} ba ingantaccen sunan mai amfani ba ne. Dole ne a fara da harafi kuma ya ƙunshi haruffa kawai, lambobi, ƙararraki (_), saƙa (-) da dige (.)',
  locale_en: 'Turanci',
  locale_es: 'Mutanen Espanya',
  locale_it: 'Italiyanci',
  locale_fr: 'Faransanci',
  locale_de: 'Jamusanci',
  locale_ar: 'Larabci',
  locale_bn: 'Bengali',
  locale_hi: 'Hindi',
  locale_id: 'Indonesiya',
  locale_ja: 'Jafananci',
  locale_ko: 'Yaren Koriya',
  locale_pl: 'Yaren mutanen Poland',
  locale_pt: 'Fotigal',
  locale_ru: 'Rashanci',
  locale_ur: 'Urdu',
  locale_sw: 'Harshen Swahili',
  locale_tl: 'Tagalog',
  locale_vi: 'Vietnamese',
  locale_zh: 'Sinanci',
  label_date: '{{MMM}} {{d}} , {{YYYY}}',
  label_date_short: '{{M}} / {{d}} / {{YYYY}}',
  label_date_and_time: '{{MMM}} {{d}} , {{YYYY}} / {{h}} : {{m}} {{a}}',
  label_date_and_time_short: '{{M}} / {{d}} / {{YYYY}} {{h}} : {{m}} {{a}}',
  label_date_undefined: 'Kwanan wata/lokaci ba a saita ba',
  label_date_day_half_am: 'AM',
  label_date_day_half_pm: 'PM',
  label_date_day_0: 'Lahadi',
  label_date_day_1: 'Litinin',
  label_date_day_2: 'Talata',
  label_date_day_3: 'Laraba',
  label_date_day_4: 'Alhamis',
  label_date_day_5: 'Juma&#39;a',
  label_date_day_6: 'Asabar',
  label_date_day_short_0: 'Rana',
  label_date_day_short_1: 'Litinin',
  label_date_day_short_2: 'Talata',
  label_date_day_short_3: 'Laraba',
  label_date_day_short_4: 'Thu',
  label_date_day_short_5: 'Juma&#39;a',
  label_date_day_short_6: 'Sat',
  label_date_month_0: 'Janairu',
  label_date_month_1: 'Fabrairu',
  label_date_month_2: 'Maris',
  label_date_month_3: 'Afrilu',
  label_date_month_4: 'Mayu',
  label_date_month_5: 'Yuni',
  label_date_month_6: 'Yuli',
  label_date_month_7: 'Agusta',
  label_date_month_8: 'Satumba',
  label_date_month_9: 'Oktoba',
  label_date_month_10: 'Nuwamba',
  label_date_month_11: 'Disamba',
  label_date_month_short_0: 'Jan',
  label_date_month_short_1: 'Feb',
  label_date_month_short_2: 'Mar',
  label_date_month_short_3: 'Afrilu',
  label_date_month_short_4: 'Mayu',
  label_date_month_short_5: 'Jun',
  label_date_month_short_6: 'Jul',
  label_date_month_short_7: 'Agusta',
  label_date_month_short_8: 'Satumba',
  label_date_month_short_9: 'Oct',
  label_date_month_short_10: 'Nov',
  label_date_month_short_11: 'Dec',
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
  label_duration_days: 'kwanaki',
  label_duration_hours: 'hours',
  label_duration_minutes: 'mintuna',
  label_duration_seconds: 'seconds',
  hint_readonly: '(karanta-kawai)',
  label_mediainfo_title: 'Take',
  label_mediainfo_artist: 'Mawaƙi',
  label_mediainfo_album_artist: 'Album Artist',
  label_mediainfo_author: 'Marubuci',
  label_mediainfo_composer: 'Mawaƙiya',
  label_mediainfo_year: 'Shekara',
  label_mediainfo_copyright: 'Haƙƙin mallaka',
  label_mediainfo_album: 'Album',
  label_mediainfo_movie: 'Fim',
  label_mediainfo_description: 'Bayani',
  label_mediainfo_comment: 'Sharhi',
  label_mediainfo_genre: 'Salon',
  label_mediainfo_location: 'Wuri',
  label_mediainfo_show: 'Nuna',
  label_mediainfo_episode: 'Episode',
  label_mediainfo_episode_sort: 'Episode (nau&#39;i)',
  label_mediainfo_season: 'Kaka',
  label_mediainfo_lyrics: 'Waƙoƙi',
  label_mediainfo_tags: 'Tags',
  label_mediainfo_duration: 'Tsawon lokaci',
  label_mediainfo_width: 'Nisa',
  label_mediainfo_height: 'Tsayi',
  label_mediainfo_size: 'Girman',
  label_mediainfo_videoTracks: 'Waƙoƙin Bidiyo',
  label_mediainfo_audioTracks: 'Waƙoƙin Sauti',
  label_mediainfo_format: 'Tsarin',
  label_mediainfo_contentType: 'Nau&#39;in Abun ciki',
  label_mediainfo_bitRate: 'Bit Rate',
  label_mediainfo_frameRate: 'Matsakaicin Tsari',
  label_mediainfo_dateEncoded: 'Kwanan wata Rufewa',
  button_admin: 'Kanfigareshan Yanar Gizo',
  admin_title_site_administration: '{{ title }} Gudanarwa',
  admin_title_manage_configuration: 'Tsarin Tsari',
  admin_title_volume_administration: 'Gudanarwar Madogararsa',
  admin_title_user_administration: 'Gudanarwar Mai Amfani',
  admin_title_migrate_data: 'Ƙaura Data',
  admin_title_transform_queue: 'Hanyar Canja Mai jarida',
  admin_title_site_administration_publicConfig: 'Tsarin Jama&#39;a',
  admin_title_site_administration_privateConfig: 'Kanfigareshan Mai zaman kansa',
  admin_button_save_config: 'Ajiye',
  admin_info_config_updated: 'Anyi nasarar sabunta tsarin tsarin',
  admin_label_publicConfig_title: 'Taken Yanar Gizo',
  admin_label_publicConfig_siteUrl: 'URL na yanar gizo',
  admin_label_publicConfig_public: 'Jama&#39;a?',
  admin_label_publicConfig_allowRegistration: 'Izinin Yin Rajista?',
  admin_label_publicConfig_limitRegistration: 'Iyakance Rijista',
  admin_label_publicConfig_inviteFriendsEnabled: 'Nuna &#39;Gayyatar Abokai&#39; zuwa masu amfani da suka shiga?',
  admin_label_publicConfig_locales: 'Yankuna',
  admin_label_publicConfig_defaultLocale: 'Mahalli na asali',
  admin_label_publicConfig_emailEnabled: 'An Kunna Imel?',
  admin_label_publicConfig_timeout: 'Lokaci ya ƙare',
  admin_label_publicConfig_timeout_verify: 'Lokacin Tabbatar da Asusu',
  admin_label_publicConfig_timeout_resetPassword: 'Sake saita Alamar Kalmar wucewa',
  admin_label_privateConfig_admin: 'Saitunan Gudanarwa',
  admin_label_privateConfig_admin_user: 'Admin User',
  admin_label_privateConfig_admin_user_email: 'Imel',
  admin_label_privateConfig_admin_user_username: 'Sunan mai amfani',
  admin_label_privateConfig_admin_user_password: 'Kalmar wucewa',
  admin_label_privateConfig_admin_user_firstName: 'Sunan rana',
  admin_label_privateConfig_admin_user_lastName: 'Sunan mahaifa',
  admin_label_privateConfig_admin_user_locale: 'Yanki',
  admin_label_privateConfig_admin_overwrite: 'Rubutu?',
  admin_label_privateConfig_email: 'Saitunan SMTP',
  admin_label_privateConfig_email_host: 'Mai watsa shiri',
  admin_label_privateConfig_email_port: 'Port',
  admin_label_privateConfig_email_user: 'Sunan mai amfani',
  admin_label_privateConfig_email_password: 'Kalmar wucewa',
  admin_label_privateConfig_email_secure: 'Amintacce?',
  admin_label_privateConfig_email_fromEmail: 'Adireshin imel na tsarin',
  admin_label_privateConfig_redis: 'Redis Saituna',
  admin_label_privateConfig_redis_host: 'Mai watsa shiri',
  admin_label_privateConfig_redis_port: 'Port',
  admin_label_privateConfig_redis_flushAtStartup: 'Flush a farawa?',
  admin_label_privateConfig_redis_listingCacheExpiration: 'Ƙarewar lissafin cache',
  admin_label_privateConfig_redis_manifestCacheExpiration: 'Bayyana ƙarewar cache',
  admin_label_privateConfig_media: 'Taimakon Mai jarida',
  admin_label_privateConfig_media_video: 'Bidiyo',
  admin_label_privateConfig_media_video_allowedCommands: 'Umarni da aka yarda',
  admin_label_privateConfig_encryption: 'Saitunan ɓoyewa',
  admin_label_privateConfig_encryption_key: 'Maɓallin ɓoyewa',
  admin_label_privateConfig_encryption_iv: 'Farawa Vector (IV)',
  admin_label_privateConfig_encryption_algo: 'Algorithm',
  admin_label_privateConfig_encryption_bcryptRounds: 'Bcrypt zagaye',
  admin_label_privateConfig_session: 'Saitunan Zama',
  admin_label_privateConfig_session_expiration: 'Lokaci ya ƙare',
  admin_label_privateConfig_autoscan: 'Saitunan Autoscan',
  admin_label_privateConfig_autoscan_enabled: 'Kunna autoscan',
  admin_label_privateConfig_autoscan_interval: 'Tazarar bincike na yau da kullun',
  admin_label_privateConfig_autoscan_initialDelay: 'Jinkirin fara dubawa',
  admin_label_privateConfig_autoscan_showTransformOutput: 'Shiga fitarwa fitarwa?',
  admin_label_privateConfig_autoscan_cleanupTemporaryAssets: 'Tsaftace fayilolin wucin gadi?',
  admin_label_privateConfig_autoscan_deleteIncompleteUploads: 'Ana share abubuwan da ba su cika ba?',
  admin_label_privateConfig_autoscan_concurrency: 'Concurrency',
  admin_label_total_user_count: '{{ totalUserCount }} jimlar masu amfani',
  admin_button_delete_user: 'Share Mai amfani',
  admin_label_confirm_user_delete: 'Da fatan za a tabbatar da goge mai amfani: {{ email }}',
  label_configCategory: 'Rukunin daidaitawa',
  admin_button_add_volume: 'Ƙara Source',
  admin_title_add_volume: 'Ƙara Source',
  admin_button_delete_volume: 'Share Source',
  admin_button_scan_volume: 'Duba',
  admin_info_scan_scanning: 'Ana dubawa...',
  admin_info_scan_successful: 'An yi nasarar fara binciken',
  admin_info_scan_error: 'An sami kuskure yayin dubawa',
  admin_label_confirm_volume_delete: 'Da fatan za a tabbatar da goge tushen: {{ source }}',
  admin_info_volume_added: 'An yi nasarar ƙara sabuwar tushen &#39; {{ source }} &#39;',
  admin_info_volume_add_error: 'An sami kuskure wajen ƙara tushen&#39; {{ source }} &#39;',
  admin_label_volume_name: 'Tushen Sunan',
  admin_label_self_volume: '{{ title }} ajiya',
  admin_label_volume_type: 'Nau&#39;in Tushen',
  admin_label_volume_readOnly: 'Karanta-kawai?',
  admin_label_volume_cacheSize: 'Girman cache jeri (sifili don kashewa)',
  admin_label_volume_encryption_enable: 'Kunna boye-boye',
  admin_label_volume_encryption_key: 'Maɓallin ɓoyewa',
  admin_label_volume_encryption_iv: 'Farawa vector (IV)',
  admin_label_volume_encryption_algo: 'Algorithm',
  label_volumeType_local: 'Tsarin fayil na gida',
  label_volumeType_local_field_key: 'Dutsen directory',
  label_volumeType_local_field_mode: 'Yanayin ƙirƙirar fayil/directory',
  label_volumeType_s3: 'Amazon S3',
  label_volumeType_s3_field_key: 'Maɓallin Shiga AWS',
  label_volumeType_s3_field_secret: 'Maɓallin Sirrin AWS',
  label_volumeType_s3_field_bucket: 'S3 Bukata',
  label_volumeType_s3_field_region: 'Yankin AWS',
  label_volumeType_s3_field_prefix: 'Prefix na guga',
  label_volumeType_s3_field_delimiter: 'Mai iyaka',
  label_volumeType_b2: 'Bayanan Bayani na B2',
  label_volumeType_b2_field_key: 'Mabuɗin ID',
  label_volumeType_b2_field_secret: 'Maɓallin Aikace-aikace',
  label_volumeType_b2_field_bucket: 'B2 Bucket ID (ba suna)',
  label_volumeType_b2_field_partSize: 'Girman sashi',
  label_volumeType_b2_field_prefix: 'Prefix na guga',
  label_volumeType_b2_field_delimiter: 'Mai iyaka',
  admin_label_firstEvent: 'taron farko',
  admin_label_lastEvent: 'taron karshe',
  admin_label_eventTime: 'lokaci',
  admin_label_eventName: 'taron',
  admin_label_eventDescription: 'bayanin',
  admin_label_xformQueueEmpty: 'Babu ayyuka masu aiki',
  admin_label_migration_noSources: 'Babu wata ma&#39;ana da aka bayyana',
  admin_label_migration_results: 'Sakamakon ƙaura:',
  admin_label_migration_readPath: 'Karanta daga hanya (blank don tushen tsarin fayil)',
  admin_label_readPath: 'Karanta hanya',
  admin_label_migration_writePath: 'Rubuta zuwa hanya (blank don tushen tsarin fayil)',
  admin_label_writePath: 'Rubuta hanya',
  admin_button_migrate_data: 'Ƙaura Data',
  admin_info_migration_success: 'Bayanai sun yi nasarar ƙaura',
  admin_info_migration_error: 'An sami kuskure yayin ƙaura bayanai',
  http_invalid_request_method: 'Hanyar buƙatar HTTP {{ method }} ba ta da goyan bayan wannan ƙarshen ƙarshen',
  locale_ha: 'Hausa',
  locale_mr: 'Marathi',
  locale_tr: 'Baturke',
  info_search_searching: '...',
  search_stop_words: 'a, game da, sama, bayan, sake, gaba da, duk, am, an, da, wani, ba, kamar yadda, a, zama, domin, kasance, kafin, kasancewa, kasa, tsakanin, biyu, amma, ta, ba zai iya, ba zai iya, ba zai iya, ba zai iya, ba, ba zai iya, yi, ba, yi, yi, bã ya, yi, kada, kasa, a lokacin, kowane, \'yan, domin, daga, kara, da, da, ba, ba, ba, da, ba, da, shi, ya so, zai, ya, ta, nan, nan, nata, kanta, shi, kansa, nasa, yaya, yaya, i, i, i, i\'m, i\'ve, if, in, in, is, is, is ba, it, it\'s, its, kanta, let\'s, me, more, most, must not, ni, kaina, a\'a, ko, ba, na, kashe, sau ɗaya, kawai, ko, wasu, ya kamata, namu, kanmu, fita, kan, namu, ɗaya, ba, ta, ta, ta, \', ita, bai kamata ba, don haka, wasu, irin wannan, waccan, wato, nasu, nasu, su, da kansu, sannan, akwai, akwai, waɗannan, za su, za su, za su. , su ne, suna da, wannan, waɗancan, ta, zuwa, ma, ƙarƙashin, har, up, uct,utc, sosai, ya kasance, ba, mu, za mu, za mu, muna. , mun kasance, ba, me, menene, yaushe, yaushe, ina, ina, wane, alhalin, wane, wane, wane, me ya sa, me ya sa, me ya sa, tare da, ba za, ba, ba za ku, ba , za ku, ku, ku, ku, ku, ku, ku, kanku, kanku',
  label_header_comments: 'Sharhi',
  label_header_no_comments: 'Kuna da abin da za ku ce?',
  label_comment: 'ƙara sharhi!',
  label_comment_modified: 'gyara',
  label_updating_comment: 'ana sabuntawa...',
  label_removing_comment: 'cire...',
  button_add_comment: 'ƙara sharhi',
  button_update_comment: 'sabunta sharhi',
  admin_title_index_administration: 'Sarrafa Fihirisa',
  admin_button_reindex_volume: 'Reindex',
  admin_info_reindex_indexing: 'Firidi...',
  admin_info_reindex_error: 'Kuskure ya faru yayin sake fasalin: {{ e }}',
  admin_info_reindex_successful: 'An yi nasarar fara reindexing',
  admin_info_reindex_info_error: 'An sami kuskure karanta matsayin reindexing: {{ e }}',
  admin_label_reindex_path: 'Tushen da hanya',
  admin_label_reindex_time: 'Lokaci',
  admin_label_reindex_status: 'Matsayi',
  admin_label_reindex_noResults: 'Ba a sami sakamakon sake fiddawa ba',
  footer_credit: '<a style="text-decoration: none;" href="https://github.com/cobbzilla/yuebing">An ƙarfafa shi ta 🥮 Yuebing</a>',
  info_search_indexes_building: 'Wannan bincike ɗaya na iya dawo da ƙarin sakamako a nan gaba. Ana sake gina wasu alamomin bincike: {{ indexes }}',
  info_search_no_results_unverified: 'Don ganin sakamakon bincike, da fatan za a tabbatar da asusunku ta amfani da hanyar haɗin da aka aika zuwa {{ email }}',
  label_metadata: 'fayil metadata',
  label_mediainfo: 'fayil mediainfo',
  label_add_tag: 'Ƙara tag',
  label_adding_tag: 'ƙara tag...',
  label_removing_tag: 'cire tag...',
  label_scan_ignoreErrors: 'Yi watsi da kurakuran da suka gabata',
  label_scan_overwrite: 'Rubuta fayilolin da ke akwai',
  label_scan_reprocess: 'Maimaita tsari',
  label_scan_reprocess_profiles: 'Sake sarrafa waɗannan bayanan martaba',
  label_path: 'Hanya',
  label_select_all: 'Zaɓi Duk',
  locale_text_list_separator: ',',
  admin_title_volume_browser: 'Binciko Sources',
  admin_title_reindex_status: 'Matsayin Fihirisa',
  admin_button_browse_volume: 'lilo',
  admin_label_scan_config: 'Sanya Scan: {{ source }}',
  admin_label_scan_olderThan: 'Yi watsi da kafofin watsa labarai waɗanda aka sarrafa bayan takamaiman kwanan wata da lokaci',
  admin_button_delete_path: 'Share',
  admin_button_rebuildSearchIndex: 'Sake Gina Fihirisar Bincike',
  admin_button_rebuildSearchIndex_warning: 'Wannan zai sake gina firikwensin nema a duk tushe kuma yana iya ɗaukar lokaci mai tsawo',
  admin_info_path_delete: 'Ana share hanya...',
  label_editor: 'Edita?',
  label_noCache: 'sake saita cache?',
  label_previous_page: 'shafi na baya na sakamako',
  label_next_page: 'shafi na gaba na sakamako',
  label_results_info: 'yana nuna sakamako {{ start }} zuwa {{ end }} na {{ total }} duka',
  label_playback_quality: 'ingancin sake kunnawa',
  label_playback_quality_auto: 'atomatik',
  admin_label_privateConfig_redis_buildSearchIndexAtStartup: 'Gina fihirisar bincike yayin farawa',
  locale_af: 'Afrikaans',
  locale_sq: 'Albaniya',
  locale_am: 'Amharic',
  locale_hy: 'Armenian',
  locale_az: 'Azabaijan',
  locale_eu: 'Basque',
  locale_be: 'Belarushiyanci',
  locale_bs: 'Bosniya',
  locale_bg: 'Bulgarian',
  locale_ca: 'Catalan',
  locale_ceb: 'Cebuano',
  locale_co: 'Corsican',
  locale_hr: 'Croatian',
  locale_cs: 'Czech',
  locale_da: 'Danish',
  locale_nl: 'Yaren mutanen Holland',
  locale_eo: 'Esperanto',
  locale_et: 'Estoniya',
  locale_fi: 'Finnish',
  locale_fy: 'Farisa',
  locale_gl: 'Galiciyan',
  locale_ka: 'Jojin',
  locale_el: 'Girkanci',
  locale_gu: 'Gujarati',
  locale_ht: 'Haitian Creole',
  locale_haw: 'Hawaiian',
  locale_he: 'Ibrananci',
  locale_hmn: 'Hmong',
  locale_hu: 'Harshen Hungary',
  locale_is: 'Icelandic',
  locale_ig: 'Igbo',
  locale_ga: 'Irish',
  locale_jv: 'Yawanci',
  locale_kn: 'Kannada',
  locale_kk: 'Kazakh',
  locale_km: 'Khmer',
  locale_rw: 'Kinyarwanda',
  locale_ku: 'Kurdish',
  locale_ky: 'Kyrgyzstan',
  locale_lo: 'Lao',
  locale_la: 'Latin',
  locale_lv: 'Latvia',
  locale_lt: 'Lithuaniyanci',
  locale_lb: 'Luxembourgish',
  locale_mk: 'Makidoniya',
  locale_mg: 'Malagasy',
  locale_ms: 'Malay',
  locale_ml: 'Malayalam',
  locale_mt: 'Maltase',
  locale_mi: 'Maori',
  locale_mn: 'Mongolian',
  locale_my: 'Myanmar (Burma)',
  locale_ne: 'Nepali',
  locale_no: 'Yaren mutanen Norway',
  locale_ny: 'Nyaja (Chichewa)',
  locale_or: 'Odia (Oriya)',
  locale_ps: 'Pashto',
  locale_fa: 'Farisa',
  locale_pa: 'Punjabi',
  locale_ro: 'Romanian',
  locale_sm: 'Samoan',
  locale_gd: 'Scots Gaelic',
  locale_sr: 'Serbian',
  locale_st: 'Sesotho',
  locale_sn: 'Shona',
  locale_sd: 'Sindhi',
  locale_si: 'Sinhala (Sinhalese)',
  locale_sk: 'Slovak',
  locale_sl: 'Harshen Sloveniya',
  locale_so: 'Somaliya',
  locale_su: 'Sundanci',
  locale_sv: 'Yaren mutanen Sweden',
  locale_tg: 'Tajik',
  locale_ta: 'Tamil',
  locale_tt: 'Tatar',
  locale_te: 'Telugu',
  locale_th: 'Thai',
  locale_tk: 'Turkmen',
  locale_uk: 'Ukrainian',
  locale_ug: 'Uygur',
  locale_uz: 'Uzbek',
  locale_cy: 'Welsh',
  locale_xh: 'Hosa',
  locale_yi: 'Yadish',
  locale_yo: 'Yarbawa',
  locale_zu: 'Zulu',
  label_mediainfo_audioLanguage: 'Harshe (Audio)',
  label_mediainfo_videoLanguage: 'Harshe (Bidiyo)',
  label_mediainfo_textTrackLanguages: 'Harsuna (Subtitles)',
  label_mediainfo_videoTrackCount: 'Waƙoƙin Bidiyo',
  label_mediainfo_audioTrackCount: 'Waƙoƙin Sauti',
  label_mediainfo_textTrackCount: 'Rubutun Waƙoƙi'
}