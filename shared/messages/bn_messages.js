export default {
  id: 'bn',
  emoji: '🇧🇩',
  anonymous_user_name: 'রহস্যময় এক',
  welcome_public: '{{ title }} এ স্বাগতম!',
  welcome_user: 'স্বাগতম {{ title }}, {{user.firstName || user.email.includes("@")? user.email.substring(0, user.email.indexOf("@")): user.email}}!',
  title_login: 'সাইন ইন করুন',
  title_register: 'নিবন্ধন করুন',
  title_verifying: 'অ্যাকাউন্ট যাচাই করা হচ্ছে...',
  title_requestPasswordReset: 'পাসওয়ার্ড রিসেট করুন',
  title_resetPassword: 'একটি নতুন পাসওয়ার্ড সেট করুন',
  title_verifying_ended: 'যাচাইকরণ শেষ হয়েছে',
  title_profile: 'হিসাবের তথ্য',
  button_profile: 'আমার অ্যাকাউন্ট',
  button_update: 'সংরক্ষণ',
  info_profile_update: 'আপনার অ্যাকাউন্ট তথ্য সফলভাবে আপডেট করা হয়েছে',
  button_reset_password: 'পাসওয়ার্ড রিসেট করুন',
  button_delete_my_account: 'আমার অ্যাকাউন্ট মুছুন (পূর্বাবস্থায় ফেরানো যাবে না)',
  label_confirm_user_delete: 'আপনার অ্যাকাউন্ট মুছে ফেলা নিশ্চিত করুন. এই কর্ম অপরিবর্তনীয়!',
  label_email: 'ইমেইল',
  label_username: 'ব্যবহারকারীর নাম',
  label_usernameOrEmail: 'ব্যবহারকারী নাম বা ইমেল',
  label_firstName: 'নামের প্রথম অংশ',
  label_lastName: 'নামের শেষাংশ',
  label_name: 'নাম',
  label_password: 'পাসওয়ার্ড',
  label_newPassword: 'নতুন পাসওয়ার্ড',
  label_locale: 'ভাষা',
  label_token: 'যাচাইকরণ টোকেন',
  label_ctime: 'তৈরি হয়েছে',
  label_mtime: 'পরিবর্তিত',
  button_login: 'সাইন ইন করুন',
  button_logout: 'সাইন আউট',
  button_register: 'নিবন্ধন করুন',
  button_forgot_password: 'আপনি কি পাসওয়ার্ড ভুলে গেছেন?',
  button_send_password_reset_email: 'পাঠান',
  button_set_new_password: 'পাসওয়ার্ড সেট করুন',
  info_password_reset_email_sent: 'একটি ইমেল বার্তা {{ email }} এ পাঠানো হয়েছিল, আপনার পাসওয়ার্ড পুনরায় সেট করার জন্য একটি লিঙ্কের জন্য আপনার ইনবক্সটি দেখুন৷',
  info_password_reset_email_error: 'একটি ত্রুটি ঘটেছে এবং আপনার বার্তা পাঠানো নাও হতে পারে৷ অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন',
  info_password_reset_try_again: 'আবার চেষ্টা করুন',
  info_verify_token_error: 'যাচাইকরণ টোকেনের মেয়াদ শেষ হয়ে গেছে বা অন্যথায় অবৈধ',
  info_registration_not_allowed: '{{ title }}-এর অপারেটর অ্যাকাউন্ট তৈরি বন্ধ করে দিয়েছে৷',
  button_invite_friends: 'আপনার বন্ধুদের আমন্ত্রণ জানান {{ title }}!',
  label_friend_emails: 'কমা বা স্পেস দিয়ে আলাদা করা ইমেলের তালিকা',
  button_send_invitations: 'আমন্ত্রণ পাঠান',
  info_invite_friends_header: 'আপনার বন্ধুদের আমন্ত্রণ জানান {{ title }}!',
  info_invite_friends_subheader: 'এখানে কিছু ইমেল ঠিকানা লিখুন এবং আমরা তাদের একটি আমন্ত্রণ পাঠাব',
  info_invite_friends_limited_registration: '{{ title }} এর অপারেটরের নির্দিষ্ট লোকেদের জন্য সীমিত নিবন্ধন রয়েছে৷ আপনাকে আমন্ত্রণ পাঠাতে স্বাগত জানাই, তবে এই ব্যবহারকারীদের অবশ্যই একটি অ্যাকাউন্ট তৈরি করতে সক্ষম হওয়ার আগে সাইট অ্যাডমিনিস্ট্রেটরের দ্বারা অনুমোদিত ব্যবহারকারীদের তালিকা যোগ করতে হবে',
  info_invite_friends_disabled_no_email: '"বন্ধুদের আমন্ত্রণ জানান" বৈশিষ্ট্যটি নিষ্ক্রিয় করা হয়েছে কারণ ইমেলটি {{ title }}-এ কনফিগার করা হয়নি',
  info_invite_friends_enabled_no_email: '"বন্ধুদের আমন্ত্রণ জানান" বৈশিষ্ট্যটি সক্রিয় করা হয়েছে কিন্তু ইমেলটি {{ title }}-এ কনফিগার করা হয়নি, তাই এটি ব্যবহার করা যাবে না',
  info_invitation_success_results: 'আপনার আমন্ত্রণটি সফলভাবে {{ successCount }} বন্ধুদের কাছে পাঠানো হয়েছে৷',
  info_invitation_error_results: 'আপনার আমন্ত্রণটি {{ errorCount }} বন্ধুদের কাছে বিতরণ করা যায়নি৷',
  label_search: 'অনুসন্ধান করুন',
  button_search: 'অনুসন্ধান করুন',
  label_sort: 'ক্রমানুসার',
  label_sort_order: 'অর্ডার',
  label_sort_ascending: 'আরোহী',
  label_sort_descending: 'অবরোহী',
  title_browsing_folder: 'ফোল্ডার: {{ ফোল্ডার }}',
  button_back_to: '{{ উপসর্গ }}-এ ফিরে যান',
  button_back_to_root_folder: 'শীর্ষ স্তরে ফিরে যান',
  info_search_no_results: 'চারশত চারটি কারণ আছে যে এখানে কিছু হওয়া উচিত, কিন্তু এখানে কিছুই নেই',
  label_media_unprocessed: '(প্রক্রিয়াহীন)',
  button_show_media_info: 'মিডিয়া তথ্য দেখান',
  button_hide_media_info: 'মিডিয়া তথ্য লুকান',
  button_show_thumbnails: 'থাম্বনেল দেখান',
  button_hide_thumbnails: 'থাম্বনেইল লুকান',
  button_previous_thumbnail: 'আগে',
  button_next_thumbnail: 'পরবর্তী',
  thumbnail_alt_text: '{{ name }}-এর থাম্বনেইল ছবি',
  label_selected_thumbnail: '~ নির্বাচিত ~',
  button_select_thumbnail: 'এই থাম্বনেল নির্বাচন করুন',
  info_no_thumbnails_found: '(কোন থাম্বনেইল পাওয়া যায়নি)',
  button_show_metadata: 'মেটাডেটা দেখান',
  button_hide_metadata: 'মেটাডেটা লুকান',
  error_field_required: '{{ আপনি উত্তর দিবেন না',
  error_field_invalid: '{{ক্ষেত্র}} বৈধ নয়৷',
  error_field_regex: '{{ক্ষেত্র}} বৈধ নয়৷',
  error_field_min: '{{ক্ষেত্র}} খুবই ছোট',
  error_field_max: '{{ ক্ষেত্র }} অনেক লম্বা৷',
  error_field_min_value: '{{ক্ষেত্র}} খুবই ছোট',
  error_field_max_value: '{{ ক্ষেত্র }} খুব বড়',
  error_field_email: '{{ ক্ষেত্র }} একটি বৈধ ইমেল ঠিকানা নয়৷',
  error_field_cannotDeleteSelf: 'আপনি নিজেকে মুছে ফেলতে পারবেন না',
  error_field_alreadyExists: '{{ field.toLowerCase() }} সহ {{ জিনিস }} ইতিমধ্যেই বিদ্যমান',
  error_field_readOnly: '{{ ক্ষেত্র }} শুধুমাত্র পঠনযোগ্য',
  error_field_accountNotFound: 'অ্যাকাউন্ট পাওয়া যায়নি বা পাসওয়ার্ড ভুল',
  error_field_alreadyRegistered: 'এই {{ field.toLowerCase() }} এর একটি অ্যাকাউন্ট আগে থেকেই বিদ্যমান',
  error_field_registrationNotAllowed: 'সাইট অপারেটর অ্যাকাউন্ট তৈরি অক্ষম করেছে৷',
  error_field_url: '{{ ক্ষেত্র }} একটি বৈধ URL নয়৷',
  error_field_host: '{{ ক্ষেত্র }} একটি বৈধ হোস্টনাম নয়৷',
  error_field_locale: '{{ ক্ষেত্র }} একটি বৈধ লোকেল নয়৷',
  error_field_source: '{{ক্ষেত্র }} একটি উৎসের নাম নয়। শুধুমাত্র অক্ষর, সংখ্যা এবং এই বিশেষ অক্ষরগুলি ব্যবহার করুন: পিরিয়ড (.), হাইফেন (-) এবং আন্ডারস্কোর (_)',
  error_field_notFound: '{{ ক্ষেত্র }} সনাক্ত করা যায়নি',
  error_field_path: '{{ ক্ষেত্র }} একটি বৈধ পথ নয়৷',
  error_field_cannotMirrorToSame: 'রিড সোর্স এবং রাইট সোর্স একই সোর্স হতে পারে না',
  error_field_raw_hex: '{{ ক্ষেত্র }} একটি হেক্সাডেসিমেল সংখ্যা নয় (লিডিং 0x অনুমোদিত নয়)',
  error_field_hex: '{{ক্ষেত্র }} একটি হেক্সাডেসিমেল সংখ্যা নয়',
  error_field_username: '{{ ক্ষেত্র }} একটি বৈধ ব্যবহারকারীর নাম নয়৷ একটি অক্ষর দিয়ে শুরু করতে হবে এবং শুধুমাত্র অক্ষর, সংখ্যা, আন্ডারস্কোর (_), হাইফেন (-) এবং বিন্দু (.) থাকতে হবে',
  locale_en: 'ইংরেজি',
  locale_es: 'স্পেনীয়',
  locale_it: 'ইতালীয়',
  locale_fr: 'ফরাসি',
  locale_de: 'জার্মান',
  locale_ar: 'আরবি',
  locale_bn: 'বাংলা',
  locale_hi: 'হিন্দি',
  locale_ja: 'জাপানিজ',
  locale_ko: 'কোরিয়ান',
  locale_pt: 'পর্তুগীজ',
  locale_ru: 'রাশিয়ান',
  locale_sw: 'সোয়াহিলি',
  locale_zh: 'চাইনিজ',
  label_date: '{{MMM}} {{d}}, {{YYYY}}',
  label_date_short: '{{M}}/{{d}}/{{YYYY}}',
  label_date_and_time: '{{MMM}} {{d}}, {{YYYY}} / {{h}}:{{m}}{{a}}',
  label_date_and_time_short: '{{M}}/{{d}}/{{YYYY}} {{h}}:{{m}}{{a}}',
  label_date_undefined: 'তারিখ/সময় সেট করা হয়নি',
  label_date_day_half_am: 'এএম',
  label_date_day_half_pm: 'পিএম',
  label_date_day_0: 'রবিবার',
  label_date_day_1: 'সোমবার',
  label_date_day_2: 'মঙ্গলবার',
  label_date_day_3: 'বুধবার',
  label_date_day_4: 'বৃহস্পতিবার',
  label_date_day_5: 'শুক্রবার',
  label_date_day_6: 'শনিবার',
  label_date_day_short_0: 'সূর্য',
  label_date_day_short_1: 'আমার',
  label_date_day_short_2: 'মঙ্গল',
  label_date_day_short_3: 'বুধ',
  label_date_day_short_4: 'সংগ্রহ করুন',
  label_date_day_short_5: 'শুক্র',
  label_date_day_short_6: 'শনি',
  label_date_month_0: 'জানুয়ারি',
  label_date_month_1: 'ফেব্রুয়ারি',
  label_date_month_2: 'মার্চ',
  label_date_month_3: 'এপ্রিল',
  label_date_month_4: 'মে',
  label_date_month_5: 'জুন',
  label_date_month_6: 'জুলাই',
  label_date_month_7: 'আগস্ট',
  label_date_month_8: 'সেপ্টেম্বর',
  label_date_month_9: 'অক্টোবর',
  label_date_month_10: 'নভেম্বর',
  label_date_month_11: 'ডিসেম্বর',
  label_date_month_short_0: 'জানুয়ারী',
  label_date_month_short_1: 'ফেব্রুয়ারী',
  label_date_month_short_2: 'মার',
  label_date_month_short_3: 'এপ্রিল',
  label_date_month_short_4: 'মে',
  label_date_month_short_5: 'জুন',
  label_date_month_short_6: 'জুল',
  label_date_month_short_7: 'অগাস্ট',
  label_date_month_short_8: 'সেপ্টেম্বর',
  label_date_month_short_9: 'অক্টো',
  label_date_month_short_10: 'নভেম্বর',
  label_date_month_short_11: 'ডিসেম্বর',
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
  label_duration_days: 'দিন',
  label_duration_hours: 'ঘন্টার',
  label_duration_minutes: 'মিনিট',
  label_duration_seconds: 'সেকেন্ড',
  hint_readonly: '(শুধুমাত্র পাঠযোগ্য)',
  label_mediainfo_title: 'শিরোনাম',
  label_mediainfo_artist: 'শিল্পী',
  label_mediainfo_album_artist: 'অ্যালবাম শিল্পী',
  label_mediainfo_author: 'লেখক',
  label_mediainfo_composer: 'সুরকার',
  label_mediainfo_year: 'বছর',
  label_mediainfo_copyright: 'কপিরাইট',
  label_mediainfo_album: 'অ্যালবাম',
  label_mediainfo_movie: 'সিনেমা',
  label_mediainfo_description: 'বর্ণনা',
  label_mediainfo_comment: 'মন্তব্য করুন',
  label_mediainfo_genre: 'ধারা',
  label_mediainfo_location: 'অবস্থান',
  label_mediainfo_show: 'দেখান',
  label_mediainfo_episode: 'পর্ব',
  label_mediainfo_episode_sort: 'পর্ব (বাছাই)',
  label_mediainfo_season: 'মৌসম',
  label_mediainfo_lyrics: 'গানের কথা',
  label_mediainfo_tags: 'ট্যাগ',
  label_mediainfo_duration: 'সময়কাল',
  label_mediainfo_width: 'প্রস্থ',
  label_mediainfo_height: 'উচ্চতা',
  label_mediainfo_size: 'আকার',
  label_mediainfo_videoTracks: 'ভিডিও ট্র্যাক',
  label_mediainfo_audioTracks: 'অডিও ট্র্যাক',
  label_mediainfo_format: 'বিন্যাস',
  label_mediainfo_contentType: 'বিষয়বস্তুর প্রকার',
  label_mediainfo_bitRate: 'বিট রেট',
  label_mediainfo_frameRate: 'চক্রের হার',
  label_mediainfo_dateEncoded: 'তারিখ এনকোড করা হয়েছে',
  button_admin: 'সাইট কনফিগারেশন',
  admin_title_site_administration: '{{ title }} প্রশাসন',
  admin_title_manage_configuration: 'সিস্টেম কনফিগারেশন',
  admin_title_source_administration: 'উৎস প্রশাসন',
  admin_title_user_administration: 'ব্যবহারকারী প্রশাসন',
  admin_title_migrate_data: 'ডেটা মাইগ্রেট করুন',
  admin_title_transform_queue: 'মিডিয়া ট্রান্সফর্ম কিউ',
  admin_title_site_administration_publicConfig: 'পাবলিক কনফিগারেশন',
  admin_title_site_administration_privateConfig: 'ব্যক্তিগত কনফিগারেশন',
  admin_button_save_config: 'সংরক্ষণ',
  admin_info_config_updated: 'সিস্টেম কনফিগারেশন সফলভাবে আপডেট করা হয়েছে৷',
  admin_label_publicConfig_title: 'সাইট শিরোনাম',
  admin_label_publicConfig_siteUrl: 'সাইট URL টি',
  admin_label_publicConfig_public: 'পাবলিক?',
  admin_label_publicConfig_allowRegistration: 'নিবন্ধনের অনুমতি দেবেন?',
  admin_label_publicConfig_limitRegistration: 'সীমা নিবন্ধন',
  admin_label_publicConfig_inviteFriendsEnabled: 'লগ ইন করা ব্যবহারকারীদের \'বন্ধুদের আমন্ত্রণ\' দেখাবেন?',
  admin_label_publicConfig_locales: 'স্থানীয়',
  admin_label_publicConfig_defaultLocale: 'ডিফল্ট লোকেল',
  admin_label_publicConfig_emailEnabled: 'ইমেল সক্রিয়?',
  admin_label_publicConfig_timeout: 'টাইমআউট',
  admin_label_publicConfig_timeout_verify: 'অ্যাকাউন্ট যাচাইকরণ টোকেন সময়সীমা',
  admin_label_publicConfig_timeout_resetPassword: 'পাসওয়ার্ড টোকেন টাইমআউট রিসেট করুন',
  admin_label_privateConfig_admin: 'অ্যাডমিনিস্ট্রেটর সেটিংস',
  admin_label_privateConfig_admin_user: 'অ্যাডমিন ব্যবহারকারী',
  admin_label_privateConfig_admin_user_email: 'ইমেইল',
  admin_label_privateConfig_admin_user_password: 'পাসওয়ার্ড',
  admin_label_privateConfig_admin_user_firstName: 'নামের প্রথম অংশ',
  admin_label_privateConfig_admin_user_lastName: 'নামের শেষাংশ',
  admin_label_privateConfig_admin_user_locale: 'স্থানীয়',
  admin_label_privateConfig_admin_overwrite: 'ওভাররাইট করবেন?',
  admin_label_privateConfig_email: 'SMTP সেটিংস',
  admin_label_privateConfig_email_host: 'হোস্ট',
  admin_label_privateConfig_email_port: 'বন্দর',
  admin_label_privateConfig_email_user: 'ব্যবহারকারীর নাম',
  admin_label_privateConfig_email_password: 'পাসওয়ার্ড',
  admin_label_privateConfig_email_secure: 'নিরাপদ?',
  admin_label_privateConfig_email_fromEmail: 'সিস্টেম ইমেল ঠিকানা',
  admin_label_privateConfig_redis: 'রিডিস সেটিংস',
  admin_label_privateConfig_redis_host: 'হোস্ট',
  admin_label_privateConfig_redis_port: 'বন্দর',
  admin_label_privateConfig_redis_flushAtStartup: 'শুরুতে ফ্লাশ?',
  admin_label_privateConfig_redis_listingCacheExpiration: 'তালিকা ক্যাশে মেয়াদ শেষ',
  admin_label_privateConfig_redis_manifestCacheExpiration: 'ম্যানিফেস্ট ক্যাশে মেয়াদ শেষ',
  admin_label_privateConfig_media: 'মিডিয়া সমর্থন',
  admin_label_privateConfig_media_video: 'ভিডিও',
  admin_label_privateConfig_media_video_allowedCommands: 'অনুমোদিত আদেশ',
  admin_label_privateConfig_encryption: 'এনক্রিপশন সেটিংস',
  admin_label_privateConfig_encryption_key: 'এনক্রিপশন কী',
  admin_label_privateConfig_encryption_iv: 'ইনিশিয়ালাইজেশন ভেক্টর (IV)',
  admin_label_privateConfig_encryption_algo: 'অ্যালগরিদম',
  admin_label_privateConfig_encryption_bcryptRounds: 'Bcrypt রাউন্ড',
  admin_label_privateConfig_session: 'সেশন সেটিংস',
  admin_label_privateConfig_session_expiration: 'সময় সময়সীমার',
  admin_label_privateConfig_autoscan: 'অটোস্ক্যান সেটিংস',
  admin_label_privateConfig_autoscan_enabled: 'অটোস্ক্যান সক্ষম করুন',
  admin_label_privateConfig_autoscan_interval: 'নিয়মিত স্ক্যান ব্যবধান',
  admin_label_privateConfig_autoscan_initialDelay: 'স্টার্টআপ স্ক্যান বিলম্ব',
  admin_label_privateConfig_autoscan_showTransformOutput: 'লগ রূপান্তর আউটপুট?',
  admin_label_privateConfig_autoscan_cleanupTemporaryAssets: 'অস্থায়ী ফাইলগুলি পরিষ্কার করবেন?',
  admin_label_privateConfig_autoscan_deleteIncompleteUploads: 'অসম্পূর্ণ আপলোড পরিষ্কার করুন?',
  admin_label_privateConfig_autoscan_concurrency: 'সঙ্গতি',
  admin_label_total_user_count: '{{ totalUserCount }} মোট ব্যবহারকারী',
  admin_button_delete_user: 'ব্যবহারকারী মুছুন',
  admin_label_confirm_user_delete: 'অনুগ্রহ করে ব্যবহারকারীর মুছে ফেলা নিশ্চিত করুন: {{ email }}',
  label_configCategory: 'কনফিগারেশন বিভাগ',
  admin_button_add_source: 'উৎস যোগ করুন',
  admin_title_add_source: 'উৎস যোগ করুন',
  admin_button_delete_source: 'উৎস মুছুন',
  admin_button_scan_source: 'স্ক্যান',
  admin_info_scan_scanning: 'স্ক্যান করা হচ্ছে...',
  admin_info_scan_successful: 'স্ক্যান সফলভাবে শুরু হয়েছে',
  admin_info_scan_error: 'স্ক্যান করার সময় একটি ত্রুটি ঘটেছে৷',
  admin_label_confirm_source_delete: 'অনুগ্রহ করে উৎসটি মুছে ফেলা নিশ্চিত করুন: {{ source }}',
  admin_info_source_added: 'নতুন উৎস \'{{ source }}\' সফলভাবে যোগ করা হয়েছে',
  admin_info_source_add_error: 'উৎস \'{{ source }}\' যোগ করার সময় একটি ত্রুটি ঘটেছে',
  admin_label_source_name: 'উৎসের নাম',
  admin_label_self_source: '{{ title }} স্টোরেজ',
  admin_label_source_type: 'উত্স প্রকার',
  admin_label_source_readOnly: 'শুধুমাত্র পাঠযোগ্য?',
  admin_label_source_cacheSize: 'তালিকার ক্যাশে আকার (অক্ষম করতে শূন্য)',
  admin_label_source_encryption_enable: 'এনক্রিপশন সক্ষম করুন',
  admin_label_source_encryption_key: 'এনক্রিপশন কী',
  admin_label_source_encryption_iv: 'ইনিশিয়ালাইজেশন ভেক্টর (IV)',
  admin_label_source_encryption_algo: 'অ্যালগরিদম',
  label_sourceType_local: 'স্থানীয় ফাইল সিস্টেম',
  label_sourceType_local_field_baseDir: 'মাউন্ট ডিরেক্টরি',
  label_sourceType_local_field_mode: 'ফাইল/ডিরেক্টরি তৈরির মোড',
  label_sourceType_s3: 'আমাজন S3',
  label_sourceType_s3_field_key: 'AWS অ্যাক্সেস কী',
  label_sourceType_s3_field_secret: 'AWS সিক্রেট কী',
  label_sourceType_s3_field_bucket: 'S3 বালতি',
  label_sourceType_s3_field_region: 'AWS অঞ্চল',
  label_sourceType_s3_field_prefix: 'বালতি উপসর্গ',
  label_sourceType_s3_field_delimiter: 'ডিলিমিটার',
  label_sourceType_b2: 'ব্যাকব্লেজ B2',
  label_sourceType_b2_field_key: 'কী আইডি',
  label_sourceType_b2_field_secret: 'অ্যাপ্লিকেশন কী',
  label_sourceType_b2_field_bucket: 'B2 বাকেট আইডি (নাম নয়)',
  label_sourceType_b2_field_partSize: 'অংশের আকার',
  label_sourceType_b2_field_prefix: 'বালতি উপসর্গ',
  label_sourceType_b2_field_delimiter: 'ডিলিমিটার',
  admin_label_firstEvent: 'প্রথম ঘটনা',
  admin_label_lastEvent: 'শেষ ঘটনা',
  admin_label_eventTime: 'সময়',
  admin_label_eventName: 'ঘটনা',
  admin_label_eventDescription: 'বর্ণনা',
  admin_label_xformQueueEmpty: 'কোনো সক্রিয় কাজ নেই',
  admin_label_migration_noSources: 'কোন উৎস সংজ্ঞায়িত',
  admin_label_migration_results: 'মাইগ্রেশন ফলাফল:',
  admin_label_migration_readSource: 'থেকে ডেটা স্থানান্তরিত করার উৎস',
  admin_label_migration_readPath: 'পাথ থেকে পড়ুন (ফাইল সিস্টেম রুটের জন্য ফাঁকা)',
  admin_label_readSource: 'উৎস পড়ুন',
  admin_label_readPath: 'পথ পড়ুন',
  admin_label_migration_writeSource: 'তথ্য লিখতে উৎস',
  admin_label_migration_writePath: 'পাথে লিখুন (ফাইল সিস্টেম রুটের জন্য ফাঁকা)',
  admin_label_writeSource: 'উৎস লিখুন',
  admin_label_writePath: 'পথ লিখুন',
  admin_button_migrate_data: 'ডেটা মাইগ্রেট করুন',
  admin_info_migration_success: 'ডেটা সফলভাবে স্থানান্তরিত হয়েছে৷',
  admin_info_migration_error: 'ডেটা স্থানান্তর করার সময় একটি ত্রুটি ঘটেছে৷',
  http_invalid_request_method: 'HTTP অনুরোধ পদ্ধতি {{ method }} এই এন্ডপয়েন্ট দ্বারা সমর্থিত নয়',
  admin_label_privateConfig_admin_user_username: 'ব্যবহারকারীর নাম',
  locale_id: 'ইন্দোনেশিয়ান',
  locale_ur: 'উর্দু',
  locale_tl: 'তাগালগ',
  locale_pl: 'পোলিশ',
  locale_vi: 'ভিয়েতনামী'
}