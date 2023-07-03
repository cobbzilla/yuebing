export default {
  id: 'en',

  // language icons
  emoji: '🇺🇸',

  // titles and labels
  anonymous_user_name: 'mysterious one',
  welcome_public: 'Welcome to {{ title }}!',
  welcome_user: 'Welcome to {{ title }}, {{user.firstName || user.email.includes("@") ? user.email.substring(0, user.email.indexOf("@")) : user.email}}!',
  title_login: 'Sign In',
  title_register: 'Sign Up',
  title_verifying: 'Verifying account...',
  title_requestPasswordReset: 'Reset password',
  title_resetPassword: 'Set a new password',
  title_verifying_ended: 'Verification ended',
  title_profile: 'Account Information',
  button_profile: 'My Account',
  button_update: 'save',
  info_profile_update: 'Your account information was successfully updated',
  button_reset_password: 'Reset password',
  button_delete_my_account: 'Delete my account (CANNOT BE UNDONE)',
  label_confirm_user_delete: 'Confirm deletion of your account. This action is irreversible!',
  label_email: 'Email',
  label_username: 'Username',
  label_usernameOrEmail: 'Username or email',
  label_firstName: 'First Name',
  label_lastName: 'Last Name',
  label_name: 'Name',
  label_password: 'Password',
  label_newPassword: 'New password',
  label_locale: 'Language',
  label_token: 'Verification token',
  label_verified: 'Verified',
  label_ctime: 'Created',
  label_mtime: 'Modified',
  label_editor: 'Editor?',
  button_login: 'Sign In',
  button_logout: 'Sign Out',
  button_register: 'Sign Up',
  button_forgot_password: 'Forgot your password?',
  button_send_password_reset_email: 'Send',
  button_set_new_password: 'Set Password',
  info_password_reset_email_sent: 'An email message was sent to {{ email }}, check your inbox for a link to reset your password',
  info_password_reset_email_error: 'An error occurred and your message may not have been sent. Please try again later',
  info_password_reset_try_again: 'Try again',
  info_verify_token_error: 'The verification token has expired or is otherwise invalid',
  info_registration_not_allowed: 'The operator of {{ title }} has disabled account creation',
  button_invite_friends: 'Invite your friends to {{ title }}!',
  label_friend_emails: 'List of emails separated by commas or spaces',
  button_send_invitations: 'Send invitations',
  info_invite_friends_header: 'Invite your friends to {{ title }}!',
  info_invite_friends_subheader: 'Enter some email addresses here and we\'ll send them an invitation',
  info_invite_friends_limited_registration: 'The operator of {{ title }} has limited registration to specific people. You are welcome to send invites, but these users must also be added the the approved list of users by the site administrator before they\'ll be able to successfully create an account',
  info_invite_friends_disabled_no_email: 'The "invite friends" feature is disabled because email hasn\'t been configured on {{ title }}',
  info_invite_friends_enabled_no_email: 'The "invite friends" feature is enabled but email hasn\'t been configured on {{ title }}, so it can\'t be used',
  info_invitation_success_results: 'Your invitation was successfully sent to {{ successCount }} friends',
  info_invitation_error_results: 'Your invitation could not be delivered to {{ errorCount }} friends',

  label_search: 'Search',
  button_search: 'Search',
  label_noCache: 'reset cache?',
  label_sort: 'Sort by',
  label_sort_order: 'Order',
  label_sort_ascending: 'ascending',
  label_sort_descending: 'descending',
  footer_credit: '<a style="text-decoration: none;" href="https://github.com/cobbzilla/yuebing">Powered by 🥮 Yuebing</a>',

  // media browsing
  title_browsing_folder: 'Folder: {{ folder }}',
  label_previous_page: 'previous page of results',
  label_next_page: 'next page of results',
  label_results_info: 'showing results {{ start }} to {{ end }} of {{ total }} total',
  button_back_to: 'Back to {{ prefix }}',
  button_back_to_root_folder: 'Back to top-level',
  info_search_searching: '...',
  info_search_indexes_building: 'This same search may return more results in the future. Some search indexes are being rebuilt: {{ indexes }}',
  info_search_no_results: 'There are four hundred and four reasons that something should be here, but there\'s nothing here',
  info_search_no_results_unverified: 'To see search results, please verify your account using the link sent to {{ email }}',
  search_stop_words: 'a,about,above,after,again,against,all,am,an,and,any,are,aren\'t,as,at,be,because,been,before,being,below,between,both,but,by,can\'t,cannot,could,couldn\'t,did,didn\'t,do,does,doesn\'t,doing,don\'t,down,during,each,few,for,from,further,had,hadn\'t,has,hasn\'t,have,haven\'t,having,he,he\'d,he\'ll,he\'s,her,here,here\'s,hers,herself,him,himself,his,how,how\'s,i,i\'d,i\'ll,i\'m,i\'ve,if,in,into,is,isn\'t,it,it\'s,its,itself,let\'s,me,more,most,mustn\'t,my,myself,no,nor,not,of,off,on,once,only,or,other,ought,our,ours \tourselves,out,over,own,same,shan\'t,she,she\'d,she\'ll,she\'s,should,shouldn\'t,so,some,such,tag,than,that,that\'s,the,their,theirs,them,themselves,then,there,there\'s,these,they,they\'d,they\'ll,they\'re,they\'ve,this,those,through,to,too,under,until,up,uct,utc,very,was,wasn\'t,we,we\'d,we\'ll,we\'re,we\'ve,were,weren\'t,what,what\'s,when,when\'s,where,where\'s,which,while,who,who\'s,whom,why,why\'s,with,won\'t,would,wouldn\'t,you,you\'d,you\'ll,you\'re,you\'ve,your,yours,yourself,yourselves',
  label_media_unprocessed: '(unprocessed)',
  button_show_media_info: 'show media info',
  button_hide_media_info: 'hide media info',
  button_show_thumbnails: 'show thumbnails',
  button_hide_thumbnails: 'hide thumbnails',
  button_previous_thumbnail: 'previous',
  button_next_thumbnail: 'next',
  thumbnail_alt_text: 'thumbnail image for {{ name }}',
  label_selected_thumbnail: '~ selected ~',
  button_select_thumbnail: 'select this thumbnail',
  info_no_thumbnails_found: '(no thumbnails found)',
  button_show_metadata: 'show metadata',
  button_hide_metadata: 'hide metadata',
  label_metadata: 'file metadata',
  label_mediainfo: 'file mediainfo',
  label_add_tag: 'Add tag',
  label_header_comments: 'Comments',
  label_header_no_comments: 'Do you have something to say?',
  label_comment: 'add a comment!',
  label_comment_modified: 'edited',
  label_updating_comment: 'updating...',
  label_removing_comment: 'removing...',
  button_add_comment: 'add comment',
  button_update_comment: 'update comment',
  label_adding_tag: 'adding tag...',
  label_removing_tag: 'removing tag...',
  label_scan_ignoreErrors: 'Ignore previous errors',
  label_scan_overwrite: 'Overwrite existing files',
  label_scan_reprocess: 'Reprocess',
  label_scan_reprocess_profiles: 'Reprocess these profiles',
  label_path: 'Path',
  label_select_all: 'Select All',
  label_playback_quality: 'Playback quality',
  label_playback_quality_auto: 'automatic',

  // vee-validate error types
  error_field_required: '{{ field }} is required',
  error_field_invalid: '{{ field }} is not valid',
  error_field_regex: '{{ field }} is not valid',
  error_field_min: '{{ field }} is too short',
  error_field_max: '{{ field }} is too long',
  error_field_min_value: '{{ field }} is too small',
  error_field_max_value: '{{ field }} is too large',
  error_field_email: '{{ field }} is not a valid email address',
  error_field_cannotDeleteSelf: 'You cannot delete yourself',
  error_field_alreadyExists: '{{ field.toLowerCase() }} already exists',
  error_field_readOnly: '{{ field }} is read-only',
  error_field_accountNotFound: 'Account not found or password incorrect',
  error_field_alreadyRegistered: 'An account with this {{ field.toLowerCase() }} already exists',
  error_field_registrationNotAllowed: 'The site operator has disabled account creation',
  error_field_url: '{{ field }} is not a valid URL',
  error_field_host: '{{ field }} is not a valid hostname',
  error_field_locale: '{{ field }} is not a valid locale',
  error_field_volume: '{{ field }} is not a data volume name. Use only letters, numbers, and these special characters: period (.), hyphen (-) and underscore (_)',
  error_field_notFound: '{{ field }} could not be located',
  error_field_path: '{{ field }} is not a valid path',
  error_field_cannotMirrorToSame: 'The data volume for reading cannot be the same as the data volume for writing',
  error_field_raw_hex: '{{ field }} is not a hexadecimal number (leading 0x not allowed)',
  error_field_hex: '{{ field }} is not a hexadecimal number',
  error_field_username: '{{ field }} is not a valid username. Must start with a letter and contain only letters, numbers, underscores (_), hyphens (-) and dots (.)',

  // All locale names
  locale_af: 'Afrikaans',
  locale_sq: 'Albanian',
  locale_am: 'Amharic',
  locale_ar: 'Arabic',
  locale_hy: 'Armenian',
  locale_az: 'Azerbaijani',
  locale_eu: 'Basque',
  locale_be: 'Belarusian',
  locale_bn: 'Bengali',
  locale_bs: 'Bosnian',
  locale_bg: 'Bulgarian',
  locale_ca: 'Catalan',
  locale_ceb: 'Cebuano',
  locale_zh: 'Chinese',
  locale_co: 'Corsican',
  locale_hr: 'Croatian',
  locale_cs: 'Czech',
  locale_da: 'Danish',
  locale_nl: 'Dutch',
  locale_en: 'English',
  locale_eo: 'Esperanto',
  locale_et: 'Estonian',
  locale_fi: 'Finnish',
  locale_fr: 'French',
  locale_fy: 'Frisian',
  locale_gl: 'Galician',
  locale_ka: 'Georgian',
  locale_de: 'German',
  locale_el: 'Greek',
  locale_gu: 'Gujarati',
  locale_ht: 'Haitian Creole',
  locale_ha: 'Hausa',
  locale_haw: 'Hawaiian',
  locale_he: 'Hebrew',
  locale_hi: 'Hindi',
  locale_hmn: 'Hmong',
  locale_hu: 'Hungarian',
  locale_is: 'Icelandic',
  locale_ig: 'Igbo',
  locale_id: 'Indonesian',
  locale_ga: 'Irish',
  locale_it: 'Italian',
  locale_ja: 'Japanese',
  locale_jv: 'Javanese',
  locale_kn: 'Kannada',
  locale_kk: 'Kazakh',
  locale_km: 'Khmer',
  locale_rw: 'Kinyarwanda',
  locale_ko: 'Korean',
  locale_ku: 'Kurdish',
  locale_ky: 'Kyrgyz',
  locale_lo: 'Lao',
  locale_la: 'Latin',
  locale_lv: 'Latvian',
  locale_lt: 'Lithuanian',
  locale_lb: 'Luxembourgish',
  locale_mk: 'Macedonian',
  locale_mg: 'Malagasy',
  locale_ms: 'Malay',
  locale_ml: 'Malayalam',
  locale_mt: 'Maltese',
  locale_mi: 'Maori',
  locale_mr: 'Marathi',
  locale_mn: 'Mongolian',
  locale_my: 'Myanmar (Burmese)',
  locale_ne: 'Nepali',
  locale_no: 'Norwegian',
  locale_ny: 'Nyanja (Chichewa)',
  locale_or: 'Odia (Oriya)',
  locale_ps: 'Pashto',
  locale_fa: 'Persian',
  locale_pl: 'Polish',
  locale_pt: 'Portuguese (Portugal, Brazil)',
  locale_pa: 'Punjabi',
  locale_ro: 'Romanian',
  locale_ru: 'Russian',
  locale_sm: 'Samoan',
  locale_gd: 'Scots Gaelic',
  locale_sr: 'Serbian',
  locale_st: 'Sesotho',
  locale_sn: 'Shona',
  locale_sd: 'Sindhi',
  locale_si: 'Sinhala (Sinhalese)',
  locale_sk: 'Slovak',
  locale_sl: 'Slovenian',
  locale_so: 'Somali',
  locale_es: 'Spanish',
  locale_su: 'Sundanese',
  locale_sw: 'Swahili',
  locale_sv: 'Swedish',
  locale_tl: 'Tagalog (Filipino)',
  locale_tg: 'Tajik',
  locale_ta: 'Tamil',
  locale_tt: 'Tatar',
  locale_te: 'Telugu',
  locale_th: 'Thai',
  locale_tr: 'Turkish',
  locale_tk: 'Turkmen',
  locale_uk: 'Ukrainian',
  locale_ur: 'Urdu',
  locale_ug: 'Uyghur',
  locale_uz: 'Uzbek',
  locale_vi: 'Vietnamese',
  locale_cy: 'Welsh',
  locale_xh: 'Xhosa',
  locale_yi: 'Yiddish',
  locale_yo: 'Yoruba',
  locale_zu: 'Zulu',

  // When printing an array/list of things for the end user, this will be the argument to String.join()
  locale_text_list_separator: ', ',

  // Date/Calendar names
  label_date: '{{MMM}} {{d}}, {{YYYY}}',
  label_date_short: '{{M}}/{{d}}/{{YYYY}}',
  label_date_and_time: '{{MMM}} {{d}}, {{YYYY}} / {{h}}:{{m}}{{a}}',
  label_date_and_time_short: '{{M}}/{{d}}/{{YYYY}} {{h}}:{{m}}{{a}}',
  label_date_undefined: 'Date/time not set',
  label_date_day_half_am: 'AM',
  label_date_day_half_pm: 'PM',
  label_date_day_0: 'Sunday',
  label_date_day_1: 'Monday',
  label_date_day_2: 'Tuesday',
  label_date_day_3: 'Wednesday',
  label_date_day_4: 'Thursday',
  label_date_day_5: 'Friday',
  label_date_day_6: 'Saturday',
  label_date_day_short_0: 'Sun',
  label_date_day_short_1: 'Mon',
  label_date_day_short_2: 'Tue',
  label_date_day_short_3: 'Wed',
  label_date_day_short_4: 'Thu',
  label_date_day_short_5: 'Fri',
  label_date_day_short_6: 'Sat',
  label_date_month_0: 'January',
  label_date_month_1: 'February',
  label_date_month_2: 'March',
  label_date_month_3: 'April',
  label_date_month_4: 'May',
  label_date_month_5: 'June',
  label_date_month_6: 'July',
  label_date_month_7: 'August',
  label_date_month_8: 'September',
  label_date_month_9: 'October',
  label_date_month_10: 'November',
  label_date_month_11: 'December',
  label_date_month_short_0: 'Jan',
  label_date_month_short_1: 'Feb',
  label_date_month_short_2: 'Mar',
  label_date_month_short_3: 'Apr',
  label_date_month_short_4: 'May',
  label_date_month_short_5: 'Jun',
  label_date_month_short_6: 'Jul',
  label_date_month_short_7: 'Aug',
  label_date_month_short_8: 'Sep',
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

  label_duration_days: 'days',
  label_duration_hours: 'hours',
  label_duration_minutes: 'minutes',
  label_duration_seconds: 'seconds',

  hint_readonly: '(read-only)',

  // mediainfo fields
  label_mediainfo_title: 'Title',
  label_mediainfo_artist: 'Artist',
  label_mediainfo_album_artist: 'Album Artist',
  label_mediainfo_author: 'Author',
  label_mediainfo_composer: 'Composer',
  label_mediainfo_year: 'Year',
  label_mediainfo_copyright: 'Copyright',
  label_mediainfo_album: 'Album',
  label_mediainfo_movie: 'Movie',
  label_mediainfo_description: 'Description',
  label_mediainfo_comment: 'Comment',
  label_mediainfo_genre: 'Genre',
  label_mediainfo_location: 'Location',
  label_mediainfo_show: 'Show',
  label_mediainfo_episode: 'Episode',
  label_mediainfo_episode_sort: 'Episode (sort)',
  label_mediainfo_season: 'Season',
  label_mediainfo_lyrics: 'Lyrics',
  label_mediainfo_tags: 'Tags',
  label_mediainfo_duration: 'Duration',
  label_mediainfo_width: 'Width',
  label_mediainfo_height: 'Height',
  label_mediainfo_size: 'Size',
  label_mediainfo_audioLanguage: 'Language (Audio)',
  label_mediainfo_videoLanguage: 'Language (Video)',
  label_mediainfo_textTrackLanguages: 'Languages (Subtitles)',
  label_mediainfo_videoTrackCount: 'Video Tracks',
  label_mediainfo_audioTrackCount: 'Audio Tracks',
  label_mediainfo_textTrackCount: 'Text Tracks',
  label_mediainfo_format: 'Format',
  label_mediainfo_contentType: 'Content Type',
  label_mediainfo_bitRate: 'Bit Rate',
  label_mediainfo_frameRate: 'Frame Rate',
  label_mediainfo_dateEncoded: 'Date Encoded',

  // System Administration
  button_admin: 'Site Configuration',
  admin_title_site_administration: '{{ title }} Administration',
  admin_title_manage_configuration: 'System Configuration',
  admin_title_volume_administration: 'Manage Data Volumes',
  admin_title_library_administration: 'Manage Libraries',
  admin_title_volume_browser: 'Browse Sources',
  admin_title_user_administration: 'Manage Users',
  admin_title_migrate_data: 'Migrate Data',
  admin_title_transform_queue: 'Media Transform Queue',
  admin_title_index_administration: 'Manage Indexes',
  admin_title_reindex_status: 'Indexing Status',

  // Site Administration
  admin_title_site_administration_publicConfig: 'Public Configuration',
  admin_title_site_administration_privateConfig: 'Private Configuration',
  admin_button_save_config: 'Save',
  admin_info_config_updated: 'System configuration successfully updated',
  admin_label_publicConfig_title: 'Site Title',
  admin_label_publicConfig_siteUrl: 'Site URL',
  admin_label_publicConfig_public: 'Public?',
  admin_label_publicConfig_allowRegistration: 'Allow Registration?',
  admin_label_publicConfig_limitRegistration: 'Limit Registration',
  admin_label_publicConfig_inviteFriendsEnabled: 'Show \'Invite Friends\' to logged-in users?',
  admin_label_publicConfig_locales: 'Locales',
  admin_label_publicConfig_defaultLocale: 'Default Locale',
  admin_label_publicConfig_emailEnabled: 'Email Enabled?',
  admin_label_publicConfig_timeout: 'Timeouts',
  admin_label_publicConfig_timeout_verify: 'Account Verification Token Timeout',
  admin_label_publicConfig_timeout_resetPassword: 'Reset Password Token Timeout',
  admin_label_privateConfig_admin: 'Administrator Settings',
  admin_label_privateConfig_admin_user: 'Admin User',
  admin_label_privateConfig_admin_user_email: 'Email',
  admin_label_privateConfig_admin_user_username: 'Username',
  admin_label_privateConfig_admin_user_password: 'Password',
  admin_label_privateConfig_admin_user_firstName: 'First Name',
  admin_label_privateConfig_admin_user_lastName: 'Last Name',
  admin_label_privateConfig_admin_user_locale: 'Locale',
  admin_label_privateConfig_admin_overwrite: 'Overwrite?',
  admin_label_privateConfig_email: 'SMTP Settings',
  admin_label_privateConfig_email_host: 'Host',
  admin_label_privateConfig_email_port: 'Port',
  admin_label_privateConfig_email_user: 'Username',
  admin_label_privateConfig_email_password: 'Password',
  admin_label_privateConfig_email_secure: 'Secure?',
  admin_label_privateConfig_email_fromEmail: 'System email address',
  admin_label_privateConfig_redis: 'Redis Settings',
  admin_label_privateConfig_redis_host: 'Host',
  admin_label_privateConfig_redis_port: 'Port',
  admin_label_privateConfig_redis_flushAtStartup: 'Flush at startup?',
  admin_label_privateConfig_redis_listingCacheExpiration: 'Listing cache expiration',
  admin_label_privateConfig_redis_manifestCacheExpiration: 'Manifest cache expiration',
  admin_label_privateConfig_redis_buildSearchIndexAtStartup: 'Build search indexes upon startup',
  admin_label_privateConfig_media: 'Media Support',
  admin_label_privateConfig_media_video: 'Video',
  admin_label_privateConfig_media_video_allowedCommands: 'Allowed commands',
  admin_label_privateConfig_encryption: 'Encryption Settings',
  admin_label_privateConfig_encryption_key: 'Encryption Key',
  admin_label_privateConfig_encryption_iv: 'Initialization Vector (IV)',
  admin_label_privateConfig_encryption_algo: 'Algorithm',
  admin_label_privateConfig_encryption_bcryptRounds: 'Bcrypt rounds',
  admin_label_privateConfig_session: 'Session Settings',
  admin_label_privateConfig_session_expiration: 'Session timeout',
  admin_label_privateConfig_autoscan: 'Autoscan Settings',
  admin_label_privateConfig_autoscan_enabled: 'Enable autoscan',
  admin_label_privateConfig_autoscan_interval: 'Regular scan interval',
  admin_label_privateConfig_autoscan_initialDelay: 'Startup scan delay',
  admin_label_privateConfig_autoscan_showTransformOutput: 'Log transform output?',
  admin_label_privateConfig_autoscan_cleanupTemporaryAssets: 'Clean up temporary files?',
  admin_label_privateConfig_autoscan_deleteIncompleteUploads: 'Clean up incomplete uploads?',
  admin_label_privateConfig_autoscan_concurrency: 'Concurrency',

  // User Administration
  admin_title_account_administration: 'Manage User Accounts',
  admin_label_user: 'user account',
  admin_label_total_user_count: '{{ totalUserCount }} total users',
  admin_button_add_user: 'Add New User',
  admin_button_delete_user: 'Delete User',
  admin_label_confirm_user_delete: 'Please confirm deletion of the user: {{ id }}',

  label_configCategory: 'Configuration category',

  // Generic orm labels
  admin_label_actions: 'Actions',
  admin_info_added: 'New {{ type }} successfully created: {{ id }}',
  admin_info_add_error: 'Error adding new {{ type }} {{ id }}: {{ error }}',
  admin_info_edited: '{{ type }} successfully edited: {{ id }}',
  admin_info_edit_error: 'Error editing {{ type }} {{ id }}: {{ error }}',
  admin_button_add: 'Add New {{ type }}',
  admin_button_edit: 'Edit {{ type }}',
  admin_button_view: 'View {{ type }}',
  admin_button_delete: 'Remove {{ type }}',

  // Library Administration
  admin_title_add_library: 'Add Library',
  admin_button_add_library: 'Add Library',
  admin_title_update_library: 'Update Library',
  admin_button_update_library: 'Update Library',
  admin_title_delete_library: 'Delete Library',
  admin_button_delete_library: 'Delete Library',
  admin_label_confirm_library_delete: 'Please confirm deletion of the library \'{{ library }}\'',
  admin_info_library_added: 'The new library \'{{ library }}\' was successfully added',
  admin_info_library_updated: 'The new library \'{{ library }}\' was successfully updated',
  admin_info_library_deleted: 'The library \'{{ library }}\' was successfully removed',
  admin_info_library_add_error: 'An error occurred adding the library',
  admin_label_library_name: 'Library Name',
  admin_label_library_sources: 'Source Volumes',
  admin_label_library_destinations: 'Destination Volumes',

  // Data Volume Administration
  admin_label_volume: 'Data Volume',
  admin_button_add_volume: 'Add Data Volume',
  admin_title_add_volume: 'Add Data Volume',
  admin_button_delete_volume: 'Delete Data Volume',
  admin_button_browse_volume: 'Browse',
  admin_button_scan_volume: 'Scan',
  admin_label_scan_config: 'Configure Scan: {{ volume }}',
  admin_label_scan_olderThan: 'Ignore media that has been processed after a specific date and time',
  admin_info_scan_scanning: 'Scanning...',
  admin_info_scan_successful: 'The scan has successfully started',
  admin_info_scan_error: 'An error occurred during the scan: {{ e }}',
  admin_button_reindex_volume: 'Reindex',
  admin_button_delete_path: 'Delete',
  admin_button_rebuildSearchIndex: 'Rebuild Search Index',
  admin_button_rebuildSearchIndex_warning: 'This will rebuild search indexes across all sources and could take a very long time',
  admin_info_reindex_indexing: 'Indexing...',
  admin_info_reindex_error: 'An error occurred during the reindexing: {{ e }}',
  admin_info_reindex_successful: 'The reindexing has successfully started',
  admin_info_reindex_info_error: 'An error occurred reading the status of the reindexing: {{ e }}',
  admin_label_reindex_path: 'Source and path',
  admin_label_reindex_time: 'Time',
  admin_label_reindex_status: 'Status',
  admin_label_reindex_noResults: 'No reindexing results found',
  admin_info_path_delete: 'Deleting path...',
  admin_label_confirm_volume_delete: 'Please confirm deletion of the data volume: {{ id }}',
  admin_info_volume_added: 'The new data volume \'{{ id }}\' was successfully added',
  admin_info_volume_deleted: 'The new data volume \'{{ id }}\' was successfully removed',
  admin_info_volume_add_error: 'An error occurred adding data volume \'{{ id }}\'',
  admin_label_volume_name: 'Data Volume Name',
  admin_label_self_volume: '{{ title }} storage',
  admin_label_volume_type: 'Data Volume Type',
  admin_label_volume_mount: 'Source or Destination?',
  admin_label_volume_mount_header: 'Source/Destination',
  admin_label_volume_mount_source: 'Source (read-only)',
  admin_label_volume_mount_destination: 'Destination (read/write)',
  admin_label_volume_system: 'System Volume',
  admin_label_volume_system_hint: 'Makes this a bootable volume: keep system files in sync with this system',
  admin_button_unsync_system_volume: 'Un-synchronize',
  admin_button_unsync_system_volume_hint: 'Remove system files from remote volume and stop synchronization. The remote volume will no longer be bootable.',
  admin_label_volume_cacheSize: 'Listing cache size (zero to disable)',
  admin_label_volume_encryptionEnable: 'Enable encryption',
  admin_label_volume_encryptionKey: 'Encryption key',
  admin_label_volume_encryptionIV: 'Initialization vector (IV)',
  admin_label_volume_encryptionAlgo: 'Algorithm',
  label_volumeType_system: 'System Storage',
  label_volumeType_local: 'Local filesystem',
  label_volumeType_local_field_key: 'Mount directory',
  label_volumeType_local_field_mode: 'File/directory creation mode',
  label_volumeType_s3: 'Amazon S3',
  label_volumeType_s3_field_key: 'AWS Access Key',
  label_volumeType_s3_field_secret: 'AWS Secret Key',
  label_volumeType_s3_field_bucket: 'S3 Bucket',
  label_volumeType_s3_field_region: 'AWS Region',
  label_volumeType_s3_field_prefix: 'Bucket Prefix',
  label_volumeType_s3_field_delimiter: 'Delimiter',
  label_volumeType_b2: 'Backblaze B2',
  label_volumeType_b2_field_key: 'Key ID',
  label_volumeType_b2_field_secret: 'Application Key',
  label_volumeType_b2_field_bucket: 'B2 Bucket ID (not name)',
  label_volumeType_b2_field_partSize: 'Part size',
  label_volumeType_b2_field_prefix: 'Bucket Prefix',
  label_volumeType_b2_field_delimiter: 'Delimiter',

  // Transform Queue
  admin_label_firstEvent: 'first event',
  admin_label_lastEvent: 'last event',
  admin_label_eventTime: 'time',
  admin_label_eventName: 'event',
  admin_label_eventDescription: 'description',
  admin_label_xformQueueEmpty: 'No active jobs',

  // User Migration
  admin_label_migration_noVolumes: 'No data volumes defined',
  admin_label_migration_results: 'Migration results:',
  admin_label_migration_readVolume: 'Data volume to migrate data from',
  admin_label_migration_readPath: 'Read from path (blank for filesystem root)',
  admin_label_readVolume: 'Read data volume',
  admin_label_readPath: 'Read path',
  admin_label_migration_writeVolume: 'Data volume to write data into',
  admin_label_migration_writePath: 'Write to path (blank for filesystem root)',
  admin_label_writeVolume: 'Write data volume',
  admin_label_writePath: 'Write path',
  admin_button_migrate_data: 'Migrate Data',
  admin_info_migration_success: 'Data successfully migrated',
  admin_info_migration_error: 'An error occurred while migrating data',

  // Low-level errors
  http_invalid_request_method: 'The HTTP request method {{ method }} is not supported by this endpoint',

  // Shell script messages
  shell_ensure_work_dir: 'No YB_WORK_DIR environment variable was defined. Please enter a directory path for YB_WORK_DIR.\nIf you don\'t enter a value within {{ timeout }} seconds, the default value of {{ default_work_dir }} will be used.\n\nEnter YB_WORK_DIR [default {{ default_work_dir }}]',
  shell_ensure_admin_email: '\nThe YB_ADMIN_EMAIL environment variable is not defined or is empty.\nPlease enter an email address for the admin user',
  shell_admin_email_invalid: '\n *** Not a valid email address: {{ YB_ADMIN_EMAIL }}',
  shell_admin_email_undefined: '\nThe YB_ADMIN_EMAIL environment variable must be defined',
  shell_ensure_admin_password: '\nThe YB_ADMIN_PASSWORD environment variable is not defined or is empty.\nPlease enter a password for the admin user',
  shell_admin_password_undefined: '\nThe YB_ADMIN_PASSWORD environment variable must be defined',
  shell_default_storage_used: '\nNo YB_DEST_TYPE environment variable was defined, so the local directory {{ YB_DEST_KEY }} will be used for writing files.\nYou can configure cloud-storage destinations from the web administration console.',
  shell_default_storage_error: '\nNo YB_DEST_TYPE environment variable was defined, and neither the default local directory ({{ YB_DEFAULT_DEST }}) nor the fallback directory ({{ YB_FALLBACK_DEST }}) could be created and/or written to',

  // Feature flags
  label_flags: 'Feature flags',
  flag_welcome_email: 'Send a welcome email with a verification link',
  flag_can_comment: 'Enable commenting',
  flag_can_tag: 'Enable tagging',
  flag_can_edit_metadata: 'Enable editing metadata',
  flag_can_set_thumbnail: 'Enable setting thumbnail image'
}