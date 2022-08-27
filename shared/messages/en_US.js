export default {
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
  label_firstName: 'First Name',
  label_lastName: 'Last Name',
  label_name: 'Name',
  label_email: 'Email',
  label_password: 'Password',
  label_newPassword: 'New password',
  label_locale: 'Language',
  label_token: 'Verification token',
  label_ctime: 'Created',
  label_mtime: 'Modified',
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
  label_sort: 'Sort by',
  label_sort_order: 'Order',
  label_sort_ascending: 'ascending',
  label_sort_descending: 'descending',

  // media browsing
  title_browsing_folder: 'Folder: {{ folder }}',
  button_back_to: 'Back to {{ prefix }}',
  button_back_to_root_folder: 'Back to top-level',
  info_search_no_results: 'There are four hundred and four reasons that something should be here, but there\'s nothing here',
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
  error_field_alreadyExists: '{{ thing }} with {{ field }} already exists',
  error_field_readOnly: '{{ field }} is read-only',
  error_field_accountNotFound: 'Account not found or password incorrect',
  error_field_url: '{{ field }} is not a valid URL',
  error_field_host: '{{ field }} is not a valid hostname',
  error_field_locale: '{{ field }} is not a valid locale',
  error_field_source: '{{ field }} is not a source name. Use only letters, numbers, and these special characters: period (.), hyphen (-) and underscore (_)',
  error_field_notFound: '{{ field }} could not be located',
  error_field_path: '{{ field }} is not a valid path',
  error_field_cannotMirrorToSame: 'Read source and write source cannot be the same source',

  // Locale names -- add more translations if other locales are added
  locale_en_US: 'English (US)',
  locale_es_US: 'Spanish (US)',
  locale_es_ES: 'Spanish',
  locale_it_IT: 'Italian',
  locale_fr_FR: 'French',
  locale_de_DE: 'German',
  locale_en_GB: 'English (GB)',

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
  label_mediainfo_videoTracks: 'Video Tracks',
  label_mediainfo_audioTracks: 'Audio Tracks',
  label_mediainfo_format: 'Format',
  label_mediainfo_contentType: 'Content Type',
  label_mediainfo_bitRate: 'Bit Rate',
  label_mediainfo_frameRate: 'Frame Rate',
  label_mediainfo_dateEncoded: 'Date Encoded',

  // System Administration
  button_admin: 'Site Configuration',
  admin_title_site_administration: '{{ title }} Administration',
  admin_title_manage_configuration: 'System Configuration',
  admin_title_source_administration: 'Source Administration',
  admin_title_user_administration: 'User Administration',
  admin_title_migrate_data: 'Migrate Data',
  admin_title_transform_queue: 'Media Transform Queue',

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
  admin_label_privateConfig_autoscan_showTransformOutput: 'Log transform output',
  admin_label_privateConfig_autoscan_concurrency: 'Concurrency',

  // User Administration
  admin_label_total_user_count: '{{ totalUserCount }} total users',
  admin_button_delete_user: 'Delete User',
  admin_label_confirm_user_delete: 'Please confirm deletion of the user: {{ email }}',

  label_configCategory: 'Configuration category',

  // Source Administration
  admin_button_add_source: 'Add Source',
  admin_title_add_source: 'Add Source',
  admin_button_delete_source: 'Delete Source',
  admin_button_scan_source: 'Scan',
  admin_info_scan_scanning: 'Scanning...',
  admin_info_scan_successful: 'The scan has successfully started',
  admin_info_scan_error: 'An error occurred during the scan',
  admin_label_confirm_source_delete: 'Please confirm deletion of the source: {{ source }}',
  admin_info_source_added: 'The new source \'{{ source }}\' was successfully added',
  admin_info_source_add_error: 'An error occurred adding source \'{{ source }}\'',
  admin_label_source_name: 'Source Name',
  admin_label_self_source: '{{ title }} storage',
  admin_label_source_type: 'Source Type',
  admin_label_source_readOnly: 'Read-only?',
  admin_label_source_cacheSize: 'Listing cache size (zero to disable)',
  admin_label_source_encryption_enable: 'Enable encryption',
  admin_label_source_encryption_key: 'Encryption key',
  admin_label_source_encryption_iv: 'Initialization vector (IV)',
  admin_label_source_encryption_algo: 'Algorithm',
  label_sourceType_s3: 'Amazon S3',
  label_sourceType_local: 'Local filesystem',
  label_sourceType_local_field_baseDir: 'Mount directory',
  label_sourceType_local_field_mode: 'File/directory creation mode',
  label_sourceType_s3_field_key: 'AWS Access Key',
  label_sourceType_s3_field_secret: 'AWS Secret Key',
  label_sourceType_s3_field_bucket: 'S3 Bucket',
  label_sourceType_s3_field_region: 'AWS Region',
  label_sourceType_s3_field_prefix: 'Bucket Prefix',
  label_sourceType_s3_field_delimiter: 'Delimiter',

  // Transform Queue
  admin_label_firstEvent: 'first event',
  admin_label_lastEvent: 'last event',
  admin_label_eventTime: 'time',
  admin_label_eventName: 'event',
  admin_label_eventDescription: 'description',
  admin_label_xformQueueEmpty: 'No active jobs',

  // User Migration
  admin_label_migration_noSources: 'No sources defined',
  admin_label_migration_results: 'Migration results:',
  admin_label_migration_readSource: 'Source to migrate data from',
  admin_label_migration_readPath: 'Read from path (blank for filesystem root)',
  admin_label_readSource: 'Read source',
  admin_label_readPath: 'Read path',
  admin_label_migration_writeSource: 'Source to write data into',
  admin_label_migration_writePath: 'Write to path (blank for filesystem root)',
  admin_label_writeSource: 'Write source',
  admin_label_writePath: 'Write path',
  admin_button_migrate_data: 'Migrate Data',
  admin_info_migration_success: 'Data successfully migrated',
  admin_info_migration_error: 'An error occurred while migrating data',

  // Low-level errors
  http_invalid_request_method: 'The HTTP request method {{ method }} is not supported by this endpoint'
}
