export default {
  id: 'ur',
  emoji: '🇵🇰',
  anonymous_user_name: 'پراسرار ایک',
  welcome_public: '{{ title }} میں خوش آمدید!',
  welcome_user: 'میں خوش آمدید {{ title }} ، {{user.firstName || user.email.includes("@") ? user.email.substring(0, user.email.indexOf("@")) : user.email}} !',
  title_login: 'سائن ان',
  title_register: 'سائن اپ',
  title_verifying: 'اکاؤنٹ کی تصدیق ہو رہی ہے...',
  title_requestPasswordReset: 'پاس ورڈ ری سیٹ',
  title_resetPassword: 'نیا پاس ورڈ سیٹ کریں۔',
  title_verifying_ended: 'تصدیق ختم ہو گئی۔',
  title_profile: 'اکاؤنٹ کی معلومات',
  button_profile: 'میرا اکاونٹ',
  button_update: 'محفوظ کریں',
  info_profile_update: 'آپ کے اکاؤنٹ کی معلومات کو کامیابی کے ساتھ اپ ڈیٹ کر دیا گیا تھا۔',
  button_reset_password: 'پاس ورڈ ری سیٹ',
  button_delete_my_account: 'میرا اکاؤنٹ حذف کریں (واپس نہیں کیا جا سکتا)',
  label_confirm_user_delete: 'اپنے اکاؤنٹ کو حذف کرنے کی تصدیق کریں۔ یہ عمل ناقابل واپسی ہے!',
  label_email: 'ای میل',
  label_username: 'صارف نام',
  label_usernameOrEmail: 'اسم رکنیت یا ای میل',
  label_firstName: 'پہلا نام',
  label_lastName: 'آخری نام',
  label_name: 'نام',
  label_password: 'پاس ورڈ',
  label_newPassword: 'نیا پاس ورڈ',
  label_locale: 'زبان',
  label_token: 'تصدیقی ٹوکن',
  label_ctime: 'بنایا',
  label_mtime: 'ترمیم شدہ',
  button_login: 'سائن ان',
  button_logout: 'باہر جائیں',
  button_register: 'سائن اپ',
  button_forgot_password: 'اپنا پاس ورڈ بھول گئے؟',
  button_send_password_reset_email: 'بھیجیں',
  button_set_new_password: 'پاس ورڈ رکھیں',
  info_password_reset_email_sent: 'ایک ای میل پیغام {{ email }} پر بھیجا گیا تھا، اپنا پاس ورڈ دوبارہ ترتیب دینے کے لیے لنک کے لیے اپنا ان باکس چیک کریں۔',
  info_password_reset_email_error: 'ایک خرابی پیش آگئی اور ممکن ہے آپ کا پیغام نہیں بھیجا گیا ہو۔ براہ کرم کچھ دیر بعد کوشش کریں',
  info_password_reset_try_again: 'دوبارہ کوشش کریں',
  info_verify_token_error: 'تصدیقی ٹوکن کی میعاد ختم ہو چکی ہے یا دوسری صورت میں غلط ہے۔',
  info_registration_not_allowed: '{{ title }} کے آپریٹر نے اکاؤنٹ بنانے کو غیر فعال کر دیا ہے۔',
  button_invite_friends: 'اپنے دوستوں کو {{ title }} پر مدعو کریں!',
  label_friend_emails: 'کوما یا خالی جگہوں سے الگ کی گئی ای میلز کی فہرست',
  button_send_invitations: 'دعوت نامے بھیجیں۔',
  info_invite_friends_header: 'اپنے دوستوں کو {{ title }} پر مدعو کریں!',
  info_invite_friends_subheader: 'یہاں کچھ ای میل پتے درج کریں اور ہم انہیں دعوت نامہ بھیجیں گے۔',
  info_invite_friends_limited_registration: '{{ title }} کے آپریٹر کے پاس مخصوص لوگوں تک محدود رجسٹریشن ہے۔ آپ کو دعوت نامے بھیجنے کا خیرمقدم ہے، لیکن ان صارفین کو سائٹ کے منتظم کے ذریعے صارفین کی منظور شدہ فہرست میں شامل کرنا ضروری ہے اس سے پہلے کہ وہ کامیابی سے اکاؤنٹ بنا سکیں۔',
  info_invite_friends_disabled_no_email: '&quot;دوستوں کو مدعو کریں&quot; کی خصوصیت غیر فعال ہے کیونکہ ای میل کو {{ title }} پر کنفیگر نہیں کیا گیا ہے۔',
  info_invite_friends_enabled_no_email: '&quot;دوستوں کو مدعو کریں&quot; کی خصوصیت فعال ہے لیکن ای میل کو {{ title }} پر کنفیگر نہیں کیا گیا ہے، اس لیے اسے استعمال نہیں کیا جا سکتا',
  info_invitation_success_results: 'آپ کا دعوت نامہ کامیابی کے ساتھ {{ successCount }} دوستوں کو بھیج دیا گیا۔',
  info_invitation_error_results: 'آپ کا دعوت نامہ {{ errorCount }} دوستوں تک نہیں پہنچایا جا سکا',
  label_search: 'تلاش کریں۔',
  button_search: 'تلاش کریں۔',
  label_sort: 'ترتیب دیں',
  label_sort_order: 'ترتیب',
  label_sort_ascending: 'چڑھتے ہوئے',
  label_sort_descending: 'نزول',
  title_browsing_folder: 'فولڈر: {{ folder }}',
  button_back_to: '{{ prefix }} پر واپس',
  button_back_to_root_folder: 'واپس اوپر کی سطح پر',
  info_search_no_results: 'چار سو چار وجوہات ہیں کہ یہاں کچھ ہونا چاہیے، لیکن یہاں کچھ نہیں ہے۔',
  label_media_unprocessed: '(غیر عمل شدہ)',
  button_show_media_info: 'میڈیا کی معلومات دکھائیں۔',
  button_hide_media_info: 'میڈیا کی معلومات چھپائیں۔',
  button_show_thumbnails: 'تھمب نیلز دکھائیں۔',
  button_hide_thumbnails: 'تھمب نیلز چھپائیں',
  button_previous_thumbnail: 'پچھلے',
  button_next_thumbnail: 'اگلے',
  thumbnail_alt_text: '{{ name }} کے لیے تھمب نیل تصویر',
  label_selected_thumbnail: '~ منتخب ~',
  button_select_thumbnail: 'اس تھمب نیل کو منتخب کریں۔',
  info_no_thumbnails_found: '(کوئی تھمب نیل نہیں ملے)',
  button_show_metadata: 'میٹا ڈیٹا دکھائیں',
  button_hide_metadata: 'میٹا ڈیٹا چھپائیں',
  error_field_required: '{{ field }} کی ضرورت ہے۔',
  error_field_invalid: '{{ field }} درست نہیں ہے۔',
  error_field_regex: '{{ field }} درست نہیں ہے۔',
  error_field_min: '{{ field }} بہت چھوٹا ہے۔',
  error_field_max: '{{ field }} بہت لمبا ہے۔',
  error_field_min_value: '{{ field }} بہت چھوٹا ہے۔',
  error_field_max_value: '{{ field }} بہت بڑا ہے۔',
  error_field_email: '{{ field }} ایک درست ای میل پتہ نہیں ہے۔',
  error_field_cannotDeleteSelf: 'آپ خود کو حذف نہیں کر سکتے',
  error_field_alreadyExists: '{{ thing }} کے ساتھ {{ field.toLowerCase() }} پہلے سے موجود ہے۔',
  error_field_readOnly: '{{ field }} صرف پڑھنے کے لیے ہے۔',
  error_field_accountNotFound: 'اکاؤنٹ نہیں ملا یا پاس ورڈ غلط ہے۔',
  error_field_alreadyRegistered: 'اس {{ field.toLowerCase() }} کے ساتھ ایک اکاؤنٹ پہلے سے موجود ہے۔',
  error_field_registrationNotAllowed: 'سائٹ آپریٹر نے اکاؤنٹ بنانے کو غیر فعال کر دیا ہے۔',
  error_field_url: '{{ field }} ایک درست URL نہیں ہے۔',
  error_field_host: '{{ field }} ایک درست میزبان نام نہیں ہے۔',
  error_field_locale: '{{ field }} ایک درست مقام نہیں ہے۔',
  error_field_source: '{{ field }} ماخذ کا نام نہیں ہے۔ صرف حروف، اعداد، اور یہ خاص حروف استعمال کریں: پیریڈ (.)، ہائفن (-) اور انڈر سکور (_)',
  error_field_notFound: '{{ field }} کا پتہ نہیں چل سکا',
  error_field_path: '{{ field }} ایک درست راستہ نہیں ہے۔',
  error_field_cannotMirrorToSame: 'ماخذ پڑھنے اور لکھنے کا ذریعہ ایک ہی ذریعہ نہیں ہو سکتا',
  error_field_raw_hex: '{{ field }} ایک ہیکساڈیسیمل نمبر نہیں ہے (لیڈنگ 0x کی اجازت نہیں ہے)',
  error_field_hex: '{{ field }} ایک ہیکسا ڈیسیمل نمبر نہیں ہے۔',
  error_field_username: '{{ field }} ایک درست صارف نام نہیں ہے۔ ایک حرف سے شروع ہونا چاہیے اور اس میں صرف حروف، نمبر، انڈر سکور (_)، ہائفنز (-) اور نقطے (.) شامل ہونا چاہیے۔',
  locale_en: 'انگریزی',
  locale_es: 'ہسپانوی',
  locale_it: 'اطالوی',
  locale_fr: 'فرانسیسی',
  locale_de: 'جرمن',
  locale_ar: 'عربی',
  locale_bn: 'بنگالی',
  locale_hi: 'ہندی',
  locale_id: 'انڈونیشین',
  locale_ja: 'جاپانی',
  locale_ko: 'کورین',
  locale_pl: 'پولش',
  locale_pt: 'پرتگالی',
  locale_ru: 'روسی',
  locale_ur: 'اردو',
  locale_sw: 'سواحلی',
  locale_tl: 'ٹیگالوگ',
  locale_vi: 'ویتنامی',
  locale_zh: 'چینی',
  label_date: '{{MMM}} {{d}} ، {{YYYY}}',
  label_date_short: '{{M}} / {{d}} / {{YYYY}}',
  label_date_and_time: '{{MMM}} {{d}} ، {{YYYY}} / {{h}} : {{m}} {{a}}',
  label_date_and_time_short: '{{M}} / {{d}} / {{YYYY}} {{h}} : {{m}} {{a}}',
  label_date_undefined: 'تاریخ/وقت مقرر نہیں ہے۔',
  label_date_day_half_am: 'AM',
  label_date_day_half_pm: 'پی ایم',
  label_date_day_0: 'اتوار',
  label_date_day_1: 'پیر',
  label_date_day_2: 'منگل',
  label_date_day_3: 'بدھ',
  label_date_day_4: 'جمعرات',
  label_date_day_5: 'جمعہ',
  label_date_day_6: 'ہفتہ',
  label_date_day_short_0: 'سورج',
  label_date_day_short_1: 'پیر',
  label_date_day_short_2: 'منگل',
  label_date_day_short_3: 'بدھ',
  label_date_day_short_4: 'جمعرات',
  label_date_day_short_5: 'جمعہ',
  label_date_day_short_6: 'سات',
  label_date_month_0: 'جنوری',
  label_date_month_1: 'فروری',
  label_date_month_2: 'مارچ',
  label_date_month_3: 'اپریل',
  label_date_month_4: 'مئی',
  label_date_month_5: 'جون',
  label_date_month_6: 'جولائی',
  label_date_month_7: 'اگست',
  label_date_month_8: 'ستمبر',
  label_date_month_9: 'اکتوبر',
  label_date_month_10: 'نومبر',
  label_date_month_11: 'دسمبر',
  label_date_month_short_0: 'جنوری',
  label_date_month_short_1: 'فروری',
  label_date_month_short_2: 'مارچ',
  label_date_month_short_3: 'اپریل',
  label_date_month_short_4: 'مئی',
  label_date_month_short_5: 'جون',
  label_date_month_short_6: 'جولائی',
  label_date_month_short_7: 'اگست',
  label_date_month_short_8: 'ستمبر',
  label_date_month_short_9: 'اکتوبر',
  label_date_month_short_10: 'نومبر',
  label_date_month_short_11: 'دسمبر',
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
  label_duration_days: 'دن',
  label_duration_hours: 'گھنٹے',
  label_duration_minutes: 'منٹ',
  label_duration_seconds: 'سیکنڈ',
  hint_readonly: '(صرف پڑھو)',
  label_mediainfo_title: 'عنوان',
  label_mediainfo_artist: 'فنکار',
  label_mediainfo_album_artist: 'البم آرٹسٹ',
  label_mediainfo_author: 'مصنف',
  label_mediainfo_composer: 'کمپوزر',
  label_mediainfo_year: 'سال',
  label_mediainfo_copyright: 'کاپی رائٹ',
  label_mediainfo_album: 'البم',
  label_mediainfo_movie: 'فلم',
  label_mediainfo_description: 'تفصیل',
  label_mediainfo_comment: 'تبصرہ',
  label_mediainfo_genre: 'نوع',
  label_mediainfo_location: 'مقام',
  label_mediainfo_show: 'دکھائیں۔',
  label_mediainfo_episode: 'قسط',
  label_mediainfo_episode_sort: 'قسط (ترتیب)',
  label_mediainfo_season: 'موسم',
  label_mediainfo_lyrics: 'بول',
  label_mediainfo_tags: 'ٹیگز',
  label_mediainfo_duration: 'دورانیہ',
  label_mediainfo_width: 'چوڑائی',
  label_mediainfo_height: 'اونچائی',
  label_mediainfo_size: 'سائز',
  label_mediainfo_videoTracks: 'ویڈیو ٹریکس',
  label_mediainfo_audioTracks: 'آڈیو ٹریکس',
  label_mediainfo_format: 'فارمیٹ',
  label_mediainfo_contentType: 'مواد کی قسم',
  label_mediainfo_bitRate: 'بٹ ریٹ',
  label_mediainfo_frameRate: 'فریم کی شرح',
  label_mediainfo_dateEncoded: 'انکوڈ کی تاریخ',
  button_admin: 'سائٹ کی ترتیب',
  admin_title_site_administration: '{{ title }} انتظامیہ',
  admin_title_manage_configuration: 'سسٹم کنفیگریشن',
  admin_title_source_administration: 'ماخذ انتظامیہ',
  admin_title_user_administration: 'یوزر ایڈمنسٹریشن',
  admin_title_migrate_data: 'ڈیٹا منتقل کریں۔',
  admin_title_transform_queue: 'میڈیا ٹرانسفارم قطار',
  admin_title_site_administration_publicConfig: 'پبلک کنفیگریشن',
  admin_title_site_administration_privateConfig: 'پرائیویٹ کنفیگریشن',
  admin_button_save_config: 'محفوظ کریں۔',
  admin_info_config_updated: 'سسٹم کنفیگریشن کامیابی کے ساتھ اپ ڈیٹ ہو گئی۔',
  admin_label_publicConfig_title: 'ویب سائٹ کا عنوان',
  admin_label_publicConfig_siteUrl: 'سائٹ کا URL',
  admin_label_publicConfig_public: 'عوام؟',
  admin_label_publicConfig_allowRegistration: 'رجسٹریشن کی اجازت دیں؟',
  admin_label_publicConfig_limitRegistration: 'رجسٹریشن کی حد',
  admin_label_publicConfig_inviteFriendsEnabled: 'لاگ ان صارفین کو &#39;دوستوں کو مدعو کریں&#39; دکھائیں؟',
  admin_label_publicConfig_locales: 'مقامی',
  admin_label_publicConfig_defaultLocale: 'ڈیفالٹ لوکل',
  admin_label_publicConfig_emailEnabled: 'ای میل فعال ہے؟',
  admin_label_publicConfig_timeout: 'ٹائم آؤٹ',
  admin_label_publicConfig_timeout_verify: 'اکاؤنٹ کی تصدیق کا ٹوکن ٹائم آؤٹ',
  admin_label_publicConfig_timeout_resetPassword: 'پاس ورڈ ٹوکن ٹائم آؤٹ کو دوبارہ ترتیب دیں۔',
  admin_label_privateConfig_admin: 'ایڈمنسٹریٹر کی ترتیبات',
  admin_label_privateConfig_admin_user: 'ایڈمن صارف',
  admin_label_privateConfig_admin_user_email: 'ای میل',
  admin_label_privateConfig_admin_user_username: 'صارف نام',
  admin_label_privateConfig_admin_user_password: 'پاس ورڈ',
  admin_label_privateConfig_admin_user_firstName: 'پہلا نام',
  admin_label_privateConfig_admin_user_lastName: 'آخری نام',
  admin_label_privateConfig_admin_user_locale: 'لوکیل',
  admin_label_privateConfig_admin_overwrite: 'اوور رائٹ؟',
  admin_label_privateConfig_email: 'SMTP ترتیبات',
  admin_label_privateConfig_email_host: 'میزبان',
  admin_label_privateConfig_email_port: 'بندرگاہ',
  admin_label_privateConfig_email_user: 'صارف نام',
  admin_label_privateConfig_email_password: 'پاس ورڈ',
  admin_label_privateConfig_email_secure: 'محفوظ؟',
  admin_label_privateConfig_email_fromEmail: 'سسٹم ای میل ایڈریس',
  admin_label_privateConfig_redis: 'ریڈیس سیٹنگز',
  admin_label_privateConfig_redis_host: 'میزبان',
  admin_label_privateConfig_redis_port: 'بندرگاہ',
  admin_label_privateConfig_redis_flushAtStartup: 'شروع میں فلش؟',
  admin_label_privateConfig_redis_listingCacheExpiration: 'کیش کی میعاد ختم ہونے کی فہرست',
  admin_label_privateConfig_redis_manifestCacheExpiration: 'مینی فیسٹ کیشے کی میعاد ختم',
  admin_label_privateConfig_media: 'میڈیا سپورٹ',
  admin_label_privateConfig_media_video: 'ویڈیو',
  admin_label_privateConfig_media_video_allowedCommands: 'اجازت شدہ احکامات',
  admin_label_privateConfig_encryption: 'خفیہ کاری کی ترتیبات',
  admin_label_privateConfig_encryption_key: 'خفیہ کاری کی کلید',
  admin_label_privateConfig_encryption_iv: 'ابتدائی ویکٹر (IV)',
  admin_label_privateConfig_encryption_algo: 'الگورتھم',
  admin_label_privateConfig_encryption_bcryptRounds: 'Bcrypt راؤنڈ',
  admin_label_privateConfig_session: 'سیشن کی ترتیبات',
  admin_label_privateConfig_session_expiration: 'دورانیہ ختم ہو گیا',
  admin_label_privateConfig_autoscan: 'آٹو اسکین کی ترتیبات',
  admin_label_privateConfig_autoscan_enabled: 'آٹو اسکین کو فعال کریں۔',
  admin_label_privateConfig_autoscan_interval: 'باقاعدہ اسکین وقفہ',
  admin_label_privateConfig_autoscan_initialDelay: 'سٹارٹ اپ اسکین میں تاخیر',
  admin_label_privateConfig_autoscan_showTransformOutput: 'لاگ ٹرانسفارم آؤٹ پٹ؟',
  admin_label_privateConfig_autoscan_cleanupTemporaryAssets: 'عارضی فائلوں کو صاف کریں؟',
  admin_label_privateConfig_autoscan_deleteIncompleteUploads: 'نامکمل اپ لوڈز کو صاف کریں؟',
  admin_label_privateConfig_autoscan_concurrency: 'ہم آہنگی',
  admin_label_total_user_count: '{{ totalUserCount }} کل صارفین',
  admin_button_delete_user: 'صارف کو حذف کریں۔',
  admin_label_confirm_user_delete: 'براہ کرم صارف کے حذف ہونے کی تصدیق کریں: {{ email }}',
  label_configCategory: 'ترتیب کا زمرہ',
  admin_button_add_source: 'ماخذ شامل کریں۔',
  admin_title_add_source: 'ماخذ شامل کریں۔',
  admin_button_delete_source: 'ماخذ کو حذف کریں۔',
  admin_button_scan_source: 'اسکین کریں۔',
  admin_info_scan_scanning: 'سکین ہو رہا ہے...',
  admin_info_scan_successful: 'اسکین کامیابی سے شروع ہو گیا ہے۔',
  admin_info_scan_error: 'اسکین کے دوران ایک خرابی پیش آگئی',
  admin_label_confirm_source_delete: 'براہ کرم ماخذ کو حذف کرنے کی تصدیق کریں: {{ source }}',
  admin_info_source_added: 'نیا ماخذ &#39; {{ source }} &#39; کامیابی کے ساتھ شامل کر دیا گیا تھا۔',
  admin_info_source_add_error: 'ماخذ &#39; {{ source }} &#39; شامل کرنے میں ایک خرابی پیش آگئی',
  admin_label_source_name: 'ماخذ کا نام',
  admin_label_self_source: '{{ title }} اسٹوریج',
  admin_label_source_type: 'ماخذ کی قسم',
  admin_label_source_readOnly: 'صرف پڑھو؟',
  admin_label_source_cacheSize: 'فہرست سازی کیشے کا سائز (غیر فعال کرنے کے لیے صفر)',
  admin_label_source_encryption_enable: 'خفیہ کاری کو فعال کریں۔',
  admin_label_source_encryption_key: 'خفیہ کاری کی کلید',
  admin_label_source_encryption_iv: 'ابتدائی ویکٹر (IV)',
  admin_label_source_encryption_algo: 'الگورتھم',
  label_sourceType_local: 'مقامی فائل سسٹم',
  label_sourceType_local_field_key: 'ماؤنٹ ڈائرکٹری',
  label_sourceType_local_field_mode: 'فائل/ڈائریکٹری بنانے کا موڈ',
  label_sourceType_s3: 'ایمیزون S3',
  label_sourceType_s3_field_key: 'AWS رسائی کلید',
  label_sourceType_s3_field_secret: 'AWS خفیہ کلید',
  label_sourceType_s3_field_bucket: 'S3 بالٹی',
  label_sourceType_s3_field_region: 'AWS علاقہ',
  label_sourceType_s3_field_prefix: 'بالٹی کا سابقہ',
  label_sourceType_s3_field_delimiter: 'حد بندی کرنے والا',
  label_sourceType_b2: 'بیک بلیز B2',
  label_sourceType_b2_field_key: 'کلیدی ID',
  label_sourceType_b2_field_secret: 'درخواست کی کلید',
  label_sourceType_b2_field_bucket: 'B2 بالٹی ID (نام نہیں)',
  label_sourceType_b2_field_partSize: 'حصہ سائز',
  label_sourceType_b2_field_prefix: 'بالٹی کا سابقہ',
  label_sourceType_b2_field_delimiter: 'حد بندی کرنے والا',
  admin_label_firstEvent: 'پہلا واقعہ',
  admin_label_lastEvent: 'آخری واقعہ',
  admin_label_eventTime: 'وقت',
  admin_label_eventName: 'تقریب',
  admin_label_eventDescription: 'تفصیل',
  admin_label_xformQueueEmpty: 'کوئی فعال ملازمتیں نہیں ہیں۔',
  admin_label_migration_noSources: 'کوئی ذرائع کی وضاحت نہیں کی گئی۔',
  admin_label_migration_results: 'نقل مکانی کے نتائج:',
  admin_label_migration_readSource: 'ڈیٹا کو منتقل کرنے کے لیے ماخذ',
  admin_label_migration_readPath: 'راستے سے پڑھیں (فائل سسٹم روٹ کے لیے خالی)',
  admin_label_readSource: 'ماخذ پڑھیں',
  admin_label_readPath: 'راستہ پڑھیں',
  admin_label_migration_writeSource: 'ڈیٹا لکھنے کے لیے ماخذ',
  admin_label_migration_writePath: 'راستے پر لکھیں (فائل سسٹم روٹ کے لیے خالی)',
  admin_label_writeSource: 'ماخذ لکھیں۔',
  admin_label_writePath: 'راستہ لکھیں۔',
  admin_button_migrate_data: 'ڈیٹا منتقل کریں۔',
  admin_info_migration_success: 'ڈیٹا کامیابی کے ساتھ منتقل ہو گیا۔',
  admin_info_migration_error: 'ڈیٹا منتقل کرتے وقت ایک خرابی پیش آگئی',
  http_invalid_request_method: 'HTTP درخواست کا طریقہ {{ method }} اس اختتامی نقطہ سے تعاون یافتہ نہیں ہے۔',
  locale_ha: 'ہاؤسا',
  locale_mr: 'مرانتھی',
  locale_tr: 'ترکی',
  info_search_searching: '...',
  search_stop_words: 'ایک،کے بارے میں،اوپر،بعد میں،دوبارہ،سب کے خلاف،میں،ایک،اور،کوئی،ہیں،نہیں،جیسے،پر،ہو،کیونکہ،پہلے،ہونا،نیچے،درمیان،دونوں،لیکن کی طرف سے، نہیں کر سکتا، نہیں کر سکتا، نہیں کر سکتا، نہیں، کیا، نہیں کیا، کیا، کرتا ہے، نہیں کرتا، کرنا، نہیں، نیچے، دوران، ہر، چند، کے لیے، سے، آگے، تھا، نہیں تھا، نہیں تھا، نہیں تھا، نہیں تھا، نہیں تھا، وہ، وہ، کرے گا، وہ، وہ، یہاں، یہاں، اس کا، خود، وہ، خود، اس کا، کیسے، کیسے، میں، میں، کروں گا، میں، ہوں، میں، اگر، میں، میں، ہے، نہیں، یہ، یہ، خود، چلو، مجھے، مزید، سب سے زیادہ، نہیں، میری،خود،نہ،نہ،نہ،کی،آف،آن،ایک بار،صرف،یا،دوسرے،چاہئے،ہمارا،خود،باہر،پر،اپنا،ایک جیسا،نہیں،وہ،وہ،وہ \'،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،،، وہ ہیں ,ہم تھے آپ، آپ کریں گے، آپ ہوں گے، آپ کے پاس، آپ کا، آپ کا، آپ کو، خود کو',
  label_header_comments: 'تبصرے',
  label_header_no_comments: 'کیا آپ کو کچھ کہنا ہے؟',
  label_comment: 'تبصرہ شامل کریں!',
  label_comment_modified: 'ترمیم شدہ',
  label_updating_comment: 'اپ ڈیٹ کر رہا ہے...',
  label_removing_comment: 'ہٹا رہا ہے...',
  button_add_comment: 'تبصرہ شامل کریں',
  button_update_comment: 'تبصرہ اپ ڈیٹ کریں',
  admin_title_index_administration: 'اشاریہ جات کا نظم کریں۔',
  admin_button_reindex_source: 'ری انڈیکس',
  admin_info_reindex_indexing: 'اشاریہ سازی...',
  admin_info_reindex_error: 'دوبارہ ترتیب دینے کے دوران ایک خرابی پیش آگئی: {{ e }}',
  admin_info_reindex_successful: 'دوبارہ ترتیب دینا کامیابی سے شروع ہو گیا ہے۔',
  admin_info_reindex_info_error: 'دوبارہ ترتیب دینے کی حیثیت کو پڑھنے میں ایک خرابی پیش آگئی: {{ e }}',
  admin_label_reindex_path: 'ذریعہ اور راستہ',
  admin_label_reindex_time: 'وقت',
  admin_label_reindex_status: 'حالت',
  admin_label_reindex_noResults: 'دوبارہ ترتیب دینے کے کوئی نتائج نہیں ملے',
  footer_credit: '<a style="text-decoration: none;" href="https://github.com/cobbzilla/yuebing">🥮 Yuebing کے ذریعے تقویت یافتہ</a>',
  info_search_indexes_building: 'یہی تلاش مستقبل میں مزید نتائج دے سکتی ہے۔ کچھ تلاش کے اشاریہ جات دوبارہ بنائے جا رہے ہیں: {{ indexes }}',
  info_search_no_results_unverified: 'تلاش کے نتائج دیکھنے کے لیے، براہ کرم {{ email }} پر بھیجے گئے لنک کا استعمال کرتے ہوئے اپنے اکاؤنٹ کی تصدیق کریں۔',
  label_metadata: 'فائل میٹا ڈیٹا',
  label_mediainfo: 'میڈیا کی معلومات فائل کریں۔',
  label_add_tag: 'ٹیگ شامل کریں۔',
  label_adding_tag: 'ٹیگ شامل کیا جا رہا ہے...',
  label_removing_tag: 'ٹیگ ہٹا رہا ہے...',
  label_scan_ignoreErrors: 'پچھلی غلطیوں کو نظر انداز کریں۔',
  label_scan_overwrite: 'موجودہ فائلوں کو اوور رائٹ کریں۔',
  label_scan_reprocess: 'دوبارہ عمل',
  label_scan_reprocess_profiles: 'ان پروفائلز پر دوبارہ عمل کریں۔',
  label_path: 'راستہ',
  label_select_all: 'تمام منتخب کریں',
  locale_text_list_separator: '،',
  admin_title_source_browser: 'ذرائع کو براؤز کریں۔',
  admin_title_reindex_status: 'اشاریہ سازی کی حیثیت',
  admin_button_browse_source: 'براؤز کریں۔',
  admin_label_scan_config: 'اسکین ترتیب دیں: {{ source }}',
  admin_label_scan_olderThan: 'میڈیا کو نظر انداز کریں جس پر ایک مخصوص تاریخ اور وقت کے بعد کارروائی کی گئی ہو۔',
  admin_button_delete_path: 'حذف کریں۔',
  admin_button_rebuildSearchIndex: 'سرچ انڈیکس کو دوبارہ بنائیں',
  admin_button_rebuildSearchIndex_warning: 'یہ تمام ذرائع میں تلاش کے اشاریہ جات کو دوبارہ بنائے گا اور اس میں کافی وقت لگ سکتا ہے۔',
  admin_info_path_delete: 'راستہ حذف ہو رہا ہے...',
  label_editor: 'ایڈیٹر؟',
  label_noCache: 'کیشے کو دوبارہ ترتیب دیں؟',
  label_previous_page: 'نتائج کا پچھلا صفحہ',
  label_next_page: 'نتائج کا اگلا صفحہ',
  label_results_info: 'کل {{ start }} کے {{ end }} سے {{ total }} تک نتائج دکھا رہے ہیں۔',
  label_playback_quality: 'پلے بیک کا معیار',
  label_playback_quality_auto: 'خودکار',
  admin_label_privateConfig_redis_buildSearchIndexAtStartup: 'شروع ہونے پر تلاش کے اشاریہ جات بنائیں',
  locale_af: 'افریقی',
  locale_sq: 'البانوی',
  locale_am: 'امہاری',
  locale_hy: 'آرمینیائی',
  locale_az: 'آذربائیجانی',
  locale_eu: 'باسکی',
  locale_be: 'بیلاروسی',
  locale_bs: 'بوسنیائی',
  locale_bg: 'بلغاریائی',
  locale_ca: 'کاتالان',
  locale_ceb: 'سیبوانو',
  locale_co: 'کورسیکن',
  locale_hr: 'کروشین',
  locale_cs: 'چیک',
  locale_da: 'ڈینش',
  locale_nl: 'ڈچ',
  locale_eo: 'ایسپرانٹو',
  locale_et: 'اسٹونین',
  locale_fi: 'فنش',
  locale_fy: 'فریسیئن',
  locale_gl: 'گالیشین',
  locale_ka: 'جارجیائی',
  locale_el: 'یونانی',
  locale_gu: 'گجراتی',
  locale_ht: 'ہیٹی کریول',
  locale_haw: 'ہوائی',
  locale_he: 'عبرانی',
  locale_hmn: 'ہمونگ',
  locale_hu: 'ہنگری',
  locale_is: 'آئس لینڈی',
  locale_ig: 'اگبو',
  locale_ga: 'آئرش',
  locale_jv: 'جاویانی',
  locale_kn: 'کنڑ',
  locale_kk: 'قازق',
  locale_km: 'خمیر',
  locale_rw: 'کنیاروانڈا',
  locale_ku: 'کرد',
  locale_ky: 'کرغیز',
  locale_lo: 'لاؤ',
  locale_la: 'لاطینی',
  locale_lv: 'لیٹوین',
  locale_lt: 'لتھوانیائی',
  locale_lb: 'لکسمبرگش',
  locale_mk: 'مقدونیائی',
  locale_mg: 'ملاگاسی',
  locale_ms: 'مالائی',
  locale_ml: 'ملیالم',
  locale_mt: 'مالٹیز',
  locale_mi: 'ماوری',
  locale_mn: 'منگول',
  locale_my: 'میانمار (برمی)',
  locale_ne: 'نیپالی',
  locale_no: 'ناروے',
  locale_ny: 'نیانجا (چیچیوا)',
  locale_or: 'اوڈیا (اڑیہ)',
  locale_ps: 'پشتو',
  locale_fa: 'فارسی',
  locale_pa: 'پنجابی',
  locale_ro: 'رومانیہ',
  locale_sm: 'سامون',
  locale_gd: 'اسکاٹس گیلک',
  locale_sr: 'سربیائی',
  locale_st: 'سیسوتھو',
  locale_sn: 'شونا',
  locale_sd: 'سندھی',
  locale_si: 'سنہالا (سنہالی)',
  locale_sk: 'سلوواک',
  locale_sl: 'سلووینیائی',
  locale_so: 'صومالی',
  locale_su: 'سنڈانی',
  locale_sv: 'سویڈش',
  locale_tg: 'تاجک',
  locale_ta: 'تامل',
  locale_tt: 'تاتار',
  locale_te: 'تیلگو',
  locale_th: 'تھائی',
  locale_tk: 'ترکمان',
  locale_uk: 'یوکرینی',
  locale_ug: 'ایغور',
  locale_uz: 'ازبک',
  locale_cy: 'ویلش',
  locale_xh: 'ژوسا',
  locale_yi: 'یدش',
  locale_yo: 'یوروبا',
  locale_zu: 'زولو',
  label_mediainfo_audioLanguage: 'زبان (آڈیو)',
  label_mediainfo_videoLanguage: 'زبان (ویڈیو)',
  label_mediainfo_textTrackLanguages: 'زبانیں (سب ٹائٹلز)',
  label_mediainfo_videoTrackCount: 'ویڈیو ٹریکس',
  label_mediainfo_audioTrackCount: 'آڈیو ٹریکس',
  label_mediainfo_textTrackCount: 'ٹیکسٹ ٹریکس'
}
