export default {
  id: 'tr',
  emoji: '🇹🇷',
  anonymous_user_name: 'gizemli olan',
  welcome_public: '{{ title }} hoş geldiniz!',
  welcome_user: '{{ title }} , {{user.firstName || user.email.includes("@") ? user.email.substring(0, user.email.indexOf("@")) : user.email}} hoş geldiniz!',
  title_login: 'Kayıt olmak',
  title_register: 'Üye olmak',
  title_verifying: 'Hesap doğrulanıyor...',
  title_requestPasswordReset: 'Şifreyi yenile',
  title_resetPassword: 'Yeni bir şifre belirleyin',
  title_verifying_ended: 'Doğrulama sona erdi',
  title_profile: 'Hesap Bilgileri',
  button_profile: 'Hesabım',
  button_update: 'kaydetmek',
  info_profile_update: 'Hesap bilgileriniz başarıyla güncellendi',
  button_reset_password: 'Şifreyi yenile',
  button_delete_my_account: 'Hesabımı sil (GERİ ALINAMAZ)',
  label_confirm_user_delete: 'Hesabınızın silinmesini onaylayın. Bu eylem geri döndürülemez!',
  label_email: 'E-posta',
  label_username: 'Kullanıcı adı',
  label_usernameOrEmail: 'Kullanıcı adı ya da email',
  label_firstName: 'İlk adı',
  label_lastName: 'Soy isim',
  label_name: 'İsim',
  label_password: 'Şifre',
  label_newPassword: 'Yeni Şifre',
  label_locale: 'Dil',
  label_token: 'Doğrulama jetonu',
  label_ctime: 'oluşturuldu',
  label_mtime: 'Değiştirilmiş',
  button_login: 'Kayıt olmak',
  button_logout: 'Oturumu Kapat',
  button_register: 'Üye olmak',
  button_forgot_password: 'Parolanızı mı unuttunuz?',
  button_send_password_reset_email: 'Göndermek',
  button_set_new_password: 'Şifreyi belirle',
  info_password_reset_email_sent: '{{ email }} adresine bir e-posta mesajı gönderildi, şifrenizi sıfırlamak için bir bağlantı için gelen kutunuzu kontrol edin',
  info_password_reset_email_error: 'Bir hata oluştu ve mesajınız gönderilmemiş olabilir. Lütfen daha sonra tekrar deneyiniz',
  info_password_reset_try_again: 'Tekrar deneyin',
  info_verify_token_error: 'Doğrulama jetonunun süresi doldu veya başka bir şekilde geçersiz',
  info_registration_not_allowed: '{{ title }} operatörü hesap oluşturmayı devre dışı bıraktı',
  button_invite_friends: 'Arkadaşlarınızı {{ title }} davet edin!',
  label_friend_emails: 'Virgül veya boşluklarla ayrılmış e-posta listesi',
  button_send_invitations: 'davetiye gönder',
  info_invite_friends_header: 'Arkadaşlarınızı {{ title }} davet edin!',
  info_invite_friends_subheader: 'Buraya birkaç e-posta adresi girin, onlara bir davetiye gönderelim',
  info_invite_friends_limited_registration: '{{ title }} operatörünün belirli kişilerle sınırlı kaydı vardır. Davet gönderebilirsiniz, ancak bu kullanıcıların başarılı bir şekilde hesap oluşturabilmeleri için site yöneticisi tarafından onaylanan kullanıcı listesine de eklenmesi gerekir.',
  info_invite_friends_disabled_no_email: '&quot;Arkadaşlarını davet et&quot; özelliği devre dışı bırakıldı çünkü e-posta {{ title }} tarihinde yapılandırılmadı',
  info_invite_friends_enabled_no_email: '&quot;Arkadaşlarını davet et&quot; özelliği etkin ancak e-posta {{ title }} tarihinde yapılandırılmamış, bu nedenle kullanılamaz',
  info_invitation_success_results: 'Davetiniz başarıyla {{ successCount }} arkadaşınıza gönderildi',
  info_invitation_error_results: 'Davetiniz {{ errorCount }} arkadaşınıza teslim edilemedi',
  label_search: 'Arama',
  button_search: 'Arama',
  label_sort: 'Göre sırala',
  label_sort_order: 'Emir',
  label_sort_ascending: 'artan',
  label_sort_descending: 'Azalan',
  title_browsing_folder: 'Klasör: {{ folder }}',
  button_back_to: '{{ prefix }} sayfasına geri dön',
  button_back_to_root_folder: 'En üst seviyeye geri dön',
  info_search_no_results: 'Bir şeyin burada olması için dört yüz dört neden var, ama burada hiçbir şey yok',
  label_media_unprocessed: '(işlenmemiş)',
  button_show_media_info: 'medya bilgilerini göster',
  button_hide_media_info: 'medya bilgilerini gizle',
  button_show_thumbnails: 'küçük resimleri göster',
  button_hide_thumbnails: 'küçük resimleri gizle',
  button_previous_thumbnail: 'öncesi',
  button_next_thumbnail: 'sonraki',
  thumbnail_alt_text: '{{ name }} için küçük resim',
  label_selected_thumbnail: '~ seçili ~',
  button_select_thumbnail: 'bu küçük resmi seç',
  info_no_thumbnails_found: '(küçük resim bulunamadı)',
  button_show_metadata: 'meta verileri göster',
  button_hide_metadata: 'meta verileri gizle',
  error_field_required: '{{ field }} gerekli',
  error_field_invalid: '{{ field }} geçerli değil',
  error_field_regex: '{{ field }} geçerli değil',
  error_field_min: '{{ field }} çok kısa',
  error_field_max: '{{ field }} çok uzun',
  error_field_min_value: '{{ field }} çok küçük',
  error_field_max_value: '{{ field }} çok büyük',
  error_field_email: '{{ field }} geçerli bir e-posta adresi değil',
  error_field_cannotDeleteSelf: 'kendini silemezsin',
  error_field_alreadyExists: '{{ thing }} ile {{ field.toLowerCase() }} zaten var',
  error_field_readOnly: '{{ field }} salt okunurdur',
  error_field_accountNotFound: 'Hesap bulunamadı veya şifre yanlış',
  error_field_alreadyRegistered: 'Bu {{ field.toLowerCase() }} ile bir hesap zaten var',
  error_field_registrationNotAllowed: 'Site operatörü hesap oluşturmayı devre dışı bıraktı',
  error_field_url: '{{ field }} geçerli bir URL değil',
  error_field_host: '{{ field }} geçerli bir ana bilgisayar adı değil',
  error_field_locale: '{{ field }} geçerli bir yerel ayar değil',
  error_field_source: '{{ field }} bir kaynak adı değil. Yalnızca harfleri, sayıları ve şu özel karakterleri kullanın: nokta (.), kısa çizgi (-) ve alt çizgi (_)',
  error_field_notFound: '{{ field }} bulunamadı',
  error_field_path: '{{ field }} geçerli bir yol değil',
  error_field_cannotMirrorToSame: 'Kaynak okuma ve yazma kaynağı aynı kaynak olamaz',
  error_field_raw_hex: '{{ field }} onaltılık bir sayı değil (baştaki 0x&#39;e izin verilmez)',
  error_field_hex: '{{ field }} onaltılık bir sayı değil',
  error_field_username: '{{ field }} geçerli bir kullanıcı adı değil. Bir harfle başlamalı ve yalnızca harf, sayı, alt çizgi (_), kısa çizgi (-) ve nokta (.) içermelidir.',
  locale_en: 'ingilizce',
  locale_es: 'İspanyol',
  locale_it: 'İtalyan',
  locale_fr: 'Fransızca',
  locale_de: 'Almanca',
  locale_ar: 'Arapça',
  locale_bn: 'Bengalce',
  locale_hi: 'Hintçe',
  locale_id: 'Endonezya dili',
  locale_ja: 'Japonca',
  locale_ko: 'Koreli',
  locale_pl: 'Lehçe',
  locale_pt: 'Portekizce',
  locale_ru: 'Rusça',
  locale_ur: 'Urduca',
  locale_sw: 'Svahili',
  locale_tl: 'Tagalog',
  locale_vi: 'Vietnam',
  locale_zh: 'Çince',
  label_date: '{{MMM}} {{d}} , {{YYYY}}',
  label_date_short: '{{M}} / {{d}} / {{YYYY}}',
  label_date_and_time: '{{MMM}} {{d}} , {{YYYY}} / {{h}} : {{m}} {{a}}',
  label_date_and_time_short: '{{M}} / {{d}} / {{YYYY}} {{h}} : {{m}} {{a}}',
  label_date_undefined: 'Tarih/saat ayarlanmadı',
  label_date_day_half_am: 'AM',
  label_date_day_half_pm: 'ÖĞLEDEN SONRA',
  label_date_day_0: 'Pazar',
  label_date_day_1: 'Pazartesi',
  label_date_day_2: 'Salı',
  label_date_day_3: 'Çarşamba',
  label_date_day_4: 'Perşembe',
  label_date_day_5: 'Cuma',
  label_date_day_6: 'Cumartesi',
  label_date_day_short_0: 'Güneş',
  label_date_day_short_1: 'Pzt',
  label_date_day_short_2: 'sal',
  label_date_day_short_3: 'evlenmek',
  label_date_day_short_4: 'Per',
  label_date_day_short_5: 'Cuma',
  label_date_day_short_6: 'Oturdu',
  label_date_month_0: 'Ocak',
  label_date_month_1: 'Şubat',
  label_date_month_2: 'Mart',
  label_date_month_3: 'Nisan',
  label_date_month_4: 'Mayıs',
  label_date_month_5: 'Haziran',
  label_date_month_6: 'Temmuz',
  label_date_month_7: 'Ağustos',
  label_date_month_8: 'Eylül',
  label_date_month_9: 'Ekim',
  label_date_month_10: 'Kasım',
  label_date_month_11: 'Aralık',
  label_date_month_short_0: 'Ocak',
  label_date_month_short_1: 'Şubat',
  label_date_month_short_2: 'Mart',
  label_date_month_short_3: 'Nisan',
  label_date_month_short_4: 'Mayıs',
  label_date_month_short_5: 'Haziran',
  label_date_month_short_6: 'Temmuz',
  label_date_month_short_7: 'ağustos',
  label_date_month_short_8: 'Eylül',
  label_date_month_short_9: 'Ekim',
  label_date_month_short_10: 'kasım',
  label_date_month_short_11: 'Aralık',
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
  label_duration_days: 'günler',
  label_duration_hours: 'saat',
  label_duration_minutes: 'dakika',
  label_duration_seconds: 'saniye',
  hint_readonly: '(Sadece oku)',
  label_mediainfo_title: 'Başlık',
  label_mediainfo_artist: 'Sanatçı',
  label_mediainfo_album_artist: 'Albüm sanatçısı',
  label_mediainfo_author: 'Yazar',
  label_mediainfo_composer: 'Besteci',
  label_mediainfo_year: 'Yıl',
  label_mediainfo_copyright: 'Telif hakkı',
  label_mediainfo_album: 'Albüm',
  label_mediainfo_movie: 'Film',
  label_mediainfo_description: 'Tanım',
  label_mediainfo_comment: 'Yorum',
  label_mediainfo_genre: 'Tür',
  label_mediainfo_location: 'Konum',
  label_mediainfo_show: 'Göstermek',
  label_mediainfo_episode: 'Bölüm',
  label_mediainfo_episode_sort: 'Bölüm (sıralama)',
  label_mediainfo_season: 'Mevsim',
  label_mediainfo_lyrics: 'Şarkı sözleri',
  label_mediainfo_tags: 'Etiketler',
  label_mediainfo_duration: 'Süre',
  label_mediainfo_width: 'Genişlik',
  label_mediainfo_height: 'Yükseklik',
  label_mediainfo_size: 'Boyut',
  label_mediainfo_videoTracks: 'Video Parçaları',
  label_mediainfo_audioTracks: 'Ses Parçaları',
  label_mediainfo_format: 'Biçim',
  label_mediainfo_contentType: 'İçerik türü',
  label_mediainfo_bitRate: 'Bit Hızı',
  label_mediainfo_frameRate: 'Kare hızı',
  label_mediainfo_dateEncoded: 'Tarih Kodlanmış',
  button_admin: 'Site yapılandırması',
  admin_title_site_administration: '{{ title }} Yönetim',
  admin_title_manage_configuration: 'Sistem yapılandırması',
  admin_title_source_administration: 'Kaynak Yönetimi',
  admin_title_user_administration: 'Kullanıcı yönetimi',
  admin_title_migrate_data: 'Verileri Taşıma',
  admin_title_transform_queue: 'Medya Dönüştürme Sırası',
  admin_title_site_administration_publicConfig: 'Genel Yapılandırma',
  admin_title_site_administration_privateConfig: 'Özel Yapılandırma',
  admin_button_save_config: 'Kaydetmek',
  admin_info_config_updated: 'Sistem yapılandırması başarıyla güncellendi',
  admin_label_publicConfig_title: 'Site Başlığı',
  admin_label_publicConfig_siteUrl: 'Site URL&#39;si',
  admin_label_publicConfig_public: 'Halk?',
  admin_label_publicConfig_allowRegistration: 'Kayda İzin Verilsin mi?',
  admin_label_publicConfig_limitRegistration: 'Kayıt Sınırı',
  admin_label_publicConfig_inviteFriendsEnabled: 'Giriş yapmış kullanıcılara &#39;Arkadaş Davet Et&#39; gösterilsin mi?',
  admin_label_publicConfig_locales: 'yerel ayarlar',
  admin_label_publicConfig_defaultLocale: 'Varsayılan Yerel Ayar',
  admin_label_publicConfig_emailEnabled: 'E-posta Etkinleştirildi mi?',
  admin_label_publicConfig_timeout: 'zaman aşımları',
  admin_label_publicConfig_timeout_verify: 'Hesap Doğrulama Simgesi Zaman Aşımı',
  admin_label_publicConfig_timeout_resetPassword: 'Parola Simgesi Zaman Aşımını Sıfırla',
  admin_label_privateConfig_admin: 'Yönetici Ayarları',
  admin_label_privateConfig_admin_user: 'Yönetici Kullanıcı',
  admin_label_privateConfig_admin_user_email: 'E-posta',
  admin_label_privateConfig_admin_user_username: 'Kullanıcı adı',
  admin_label_privateConfig_admin_user_password: 'Şifre',
  admin_label_privateConfig_admin_user_firstName: 'İlk adı',
  admin_label_privateConfig_admin_user_lastName: 'Soy isim',
  admin_label_privateConfig_admin_user_locale: 'yerel',
  admin_label_privateConfig_admin_overwrite: 'Üzerine yazılsın mı?',
  admin_label_privateConfig_email: 'SMTP Ayarları',
  admin_label_privateConfig_email_host: 'Ev sahibi',
  admin_label_privateConfig_email_port: 'Liman',
  admin_label_privateConfig_email_user: 'Kullanıcı adı',
  admin_label_privateConfig_email_password: 'Şifre',
  admin_label_privateConfig_email_secure: 'Güvenli?',
  admin_label_privateConfig_email_fromEmail: 'Sistem e-posta adresi',
  admin_label_privateConfig_redis: 'Redis Ayarları',
  admin_label_privateConfig_redis_host: 'Ev sahibi',
  admin_label_privateConfig_redis_port: 'Liman',
  admin_label_privateConfig_redis_flushAtStartup: 'Başlangıçta yıkama?',
  admin_label_privateConfig_redis_listingCacheExpiration: 'Liste önbelleği süre sonu',
  admin_label_privateConfig_redis_manifestCacheExpiration: 'Manifest önbellek sona erme',
  admin_label_privateConfig_media: 'Medya Desteği',
  admin_label_privateConfig_media_video: 'Video',
  admin_label_privateConfig_media_video_allowedCommands: 'İzin verilen komutlar',
  admin_label_privateConfig_encryption: 'Şifreleme Ayarları',
  admin_label_privateConfig_encryption_key: 'Şifreleme anahtarı',
  admin_label_privateConfig_encryption_iv: 'Başlatma Vektörü (IV)',
  admin_label_privateConfig_encryption_algo: 'algoritma',
  admin_label_privateConfig_encryption_bcryptRounds: 'Bcrypt turları',
  admin_label_privateConfig_session: 'Oturum Ayarları',
  admin_label_privateConfig_session_expiration: 'Oturum zaman aşımına uğradı',
  admin_label_privateConfig_autoscan: 'Otomatik Tarama Ayarları',
  admin_label_privateConfig_autoscan_enabled: 'Otomatik taramayı etkinleştir',
  admin_label_privateConfig_autoscan_interval: 'Düzenli tarama aralığı',
  admin_label_privateConfig_autoscan_initialDelay: 'Başlangıç tarama gecikmesi',
  admin_label_privateConfig_autoscan_showTransformOutput: 'Günlük dönüştürme çıktısı?',
  admin_label_privateConfig_autoscan_cleanupTemporaryAssets: 'Geçici dosyaları temizle?',
  admin_label_privateConfig_autoscan_deleteIncompleteUploads: 'Eksik yüklemeler temizlensin mi?',
  admin_label_privateConfig_autoscan_concurrency: 'eşzamanlılık',
  admin_label_total_user_count: '{{ totalUserCount }} toplam kullanıcı',
  admin_button_delete_user: 'Kullanıcıyı sil',
  admin_label_confirm_user_delete: 'Lütfen kullanıcının silinmesini onaylayın: {{ email }}',
  label_configCategory: 'Yapılandırma kategorisi',
  admin_button_add_source: 'Kaynak ekle',
  admin_title_add_source: 'Kaynak ekle',
  admin_button_delete_source: 'Kaynağı Sil',
  admin_button_scan_source: 'Tarama',
  admin_info_scan_scanning: 'Tarama...',
  admin_info_scan_successful: 'Tarama başarıyla başladı',
  admin_info_scan_error: 'Tarama sırasında bir hata oluştu',
  admin_label_confirm_source_delete: 'Lütfen kaynağın silinmesini onaylayın: {{ source }}',
  admin_info_source_added: 'Yeni kaynak &#39; {{ source }} &#39; başarıyla eklendi',
  admin_info_source_add_error: '&#39; {{ source }} &#39; kaynağı eklenirken bir hata oluştu',
  admin_label_source_name: 'Kaynak Adı',
  admin_label_self_source: '{{ title }} depolama',
  admin_label_source_type: 'kaynak tipi',
  admin_label_source_readOnly: 'Sadece oku?',
  admin_label_source_cacheSize: 'Önbellek boyutunu listeleme (devre dışı bırakmak için sıfır)',
  admin_label_source_encryption_enable: 'Şifrelemeyi etkinleştir',
  admin_label_source_encryption_key: 'Şifreleme anahtarı',
  admin_label_source_encryption_iv: 'Başlatma vektörü (IV)',
  admin_label_source_encryption_algo: 'algoritma',
  label_sourceType_local: 'Yerel dosya sistemi',
  label_sourceType_local_field_key: 'Dizini bağla',
  label_sourceType_local_field_mode: 'Dosya/dizin oluşturma modu',
  label_sourceType_s3: 'Amazon S3',
  label_sourceType_s3_field_key: 'AWS Erişim Anahtarı',
  label_sourceType_s3_field_secret: 'AWS Gizli Anahtarı',
  label_sourceType_s3_field_bucket: 'S3 Kova',
  label_sourceType_s3_field_region: 'AWS Bölgesi',
  label_sourceType_s3_field_prefix: 'Paket Öneki',
  label_sourceType_s3_field_delimiter: 'sınırlayıcı',
  label_sourceType_b2: 'Arkadan alev B2',
  label_sourceType_b2_field_key: 'Anahtar Kimliği',
  label_sourceType_b2_field_secret: 'Uygulama Anahtarı',
  label_sourceType_b2_field_bucket: 'B2 Paket Kimliği (ad değil)',
  label_sourceType_b2_field_partSize: 'Parça boyutu',
  label_sourceType_b2_field_prefix: 'Paket Öneki',
  label_sourceType_b2_field_delimiter: 'sınırlayıcı',
  admin_label_firstEvent: 'ilk olay',
  admin_label_lastEvent: 'son olay',
  admin_label_eventTime: 'zaman',
  admin_label_eventName: 'Etkinlik',
  admin_label_eventDescription: 'tanım',
  admin_label_xformQueueEmpty: 'Etkin iş yok',
  admin_label_migration_noSources: 'Kaynak tanımlanmadı',
  admin_label_migration_results: 'Taşıma sonuçları:',
  admin_label_migration_readSource: 'Verilerin taşınacağı kaynak',
  admin_label_migration_readPath: 'Yoldan oku (dosya sistemi kökü için boş)',
  admin_label_readSource: 'Kaynak oku',
  admin_label_readPath: 'Yolu oku',
  admin_label_migration_writeSource: 'Verilerin yazılacağı kaynak',
  admin_label_migration_writePath: 'Yola yaz (dosya sistemi kökü için boş)',
  admin_label_writeSource: 'Kaynak yaz',
  admin_label_writePath: 'yolu yaz',
  admin_button_migrate_data: 'Verileri Taşıma',
  admin_info_migration_success: 'Veriler başarıyla taşındı',
  admin_info_migration_error: 'Veriler taşınırken bir hata oluştu',
  http_invalid_request_method: 'HTTP istek yöntemi {{ method }} bu uç nokta tarafından desteklenmiyor',
  locale_ha: 'Hausa',
  locale_mr: 'Marathi',
  locale_tr: 'Türk',
  info_search_searching: '...',
  search_stop_words: 'bir,hakkında,yukarıda,sonra,tekrar,karşı,hepsi,am,bir,ve,herhangi,are,are,as,ol,çünkü,oldu,önce,olmak,aşağıda,arasında,her ikisi,ama, tarafından,yapılamaz,yapılamaz,olabilir,yapılamaz,yaptı,yapmadı,yaptı,yapmaz,yapma,yapma,aşağı,sırasında,her,birkaç,için,den,ileri,vardı, sahip değil, sahip değil, sahip değil, sahip, o, o, o,o,o,burada,işte,onun,kendisi,o,kendisi,onun,nasıl,nasıl, ben, ben, ben, ben, ben, ben,eğer,içine,is,is,is,it,it,it,kendisi,haydi,ben,daha,çoğu,mustn\'t, benim,kendim,hayır,ne,değil,of,off,on,bir kez,sadece,veya,diğer,olmalı,bizim,bizim kendimiz,dışarı,bitti,kendi,aynı,shan\'t,o,o,o O,olmalı,olmalı,olmamalı,bazı,böyle,daha,bu,bu,onların,onların,onlar,kendileri,o zaman,orada,bunlar,onlar,onlar,onlar ,onlar,onlar,bu,bunlar,üzerinden,to,çok,altında,kadar,yukarı,uct,utc,çok,oldu, değildi,biz,biz,biz,biz ,biz,biz, değildik,ne,ne,ne zaman,ne zaman,nerede,nerede,hangi,kime,kim,kim,kimin,neden,neden,ile,yapmayacak,olur,olmaz,sen , sen, sen, sen, sen, sen, senin, senin, kendin, kendin',
  label_header_comments: 'Yorumlar',
  label_header_no_comments: 'Söyleyecek bir şeyin var mı?',
  label_comment: 'yorum ekle!',
  label_comment_modified: 'düzenlenmiş',
  label_updating_comment: 'güncelleniyor...',
  label_removing_comment: 'kaldırılıyor...',
  button_add_comment: 'yorum ekle',
  button_update_comment: 'yorumu güncelle',
  admin_title_index_administration: 'Dizinleri Yönet',
  admin_button_reindex_source: 'yeniden indeksleme',
  admin_info_reindex_indexing: 'Dizine ekleniyor...',
  admin_info_reindex_error: 'Yeniden indeksleme sırasında bir hata oluştu: {{ e }}',
  admin_info_reindex_successful: 'Yeniden indeksleme başarıyla başladı',
  admin_info_reindex_info_error: 'Yeniden indekslemenin durumu okunurken bir hata oluştu: {{ e }}',
  admin_label_reindex_path: 'Kaynak ve yol',
  admin_label_reindex_time: 'Zaman',
  admin_label_reindex_status: 'Durum',
  admin_label_reindex_noResults: 'Yeniden indeksleme sonucu bulunamadı',
  footer_credit: '<a style="text-decoration: none;" href="https://github.com/cobbzilla/yuebing">🥮 Yuebing tarafından desteklenmektedir</a>',
  info_search_indexes_building: 'Bu aynı arama gelecekte daha fazla sonuç döndürebilir. Bazı arama dizinleri yeniden oluşturuluyor: {{ indexes }}',
  info_search_no_results_unverified: 'Arama sonuçlarını görmek için lütfen {{ email }} adresine gönderilen bağlantıyı kullanarak hesabınızı doğrulayın.',
  label_metadata: 'dosya meta verileri',
  label_mediainfo: 'dosya medya bilgisi',
  label_add_tag: 'etiket ekle',
  label_adding_tag: 'etiket ekleniyor...',
  label_removing_tag: 'etiket kaldırılıyor...',
  label_scan_ignoreErrors: 'Önceki hataları yoksay',
  label_scan_overwrite: 'Mevcut dosyaların üzerine yaz',
  label_scan_reprocess: 'yeniden işleme',
  label_scan_reprocess_profiles: 'Bu profilleri yeniden işleyin',
  label_path: 'Yol',
  label_select_all: 'Hepsini seç',
  locale_text_list_separator: ',',
  admin_title_source_browser: 'Kaynaklara Gözat',
  admin_title_reindex_status: 'İndeksleme Durumu',
  admin_button_browse_source: 'Araştır',
  admin_label_scan_config: 'Taramayı Yapılandır: {{ source }}',
  admin_label_scan_olderThan: 'Belirli bir tarih ve saatten sonra işlenen medyayı yoksay',
  admin_button_delete_path: 'Silmek',
  admin_button_rebuildSearchIndex: 'Arama Dizinini Yeniden Oluştur',
  admin_button_rebuildSearchIndex_warning: 'Bu, tüm kaynaklardaki arama dizinlerini yeniden oluşturacak ve çok uzun zaman alabilir',
  admin_info_path_delete: 'Yol siliniyor...',
  label_editor: 'Editör?',
  label_noCache: 'önbelleği sıfırla?',
  label_previous_page: 'önceki sonuç sayfası',
  label_next_page: 'sonraki sonuç sayfası',
  label_results_info: '{{ start }} ile {{ end }} toplam {{ total }} sonuçları gösteriliyor',
  label_playback_quality: 'oynatma kalitesi',
  label_playback_quality_auto: 'otomatik',
  admin_label_privateConfig_redis_buildSearchIndexAtStartup: 'Başlangıçta arama dizinleri oluşturun',
  locale_af: 'Afrikaans',
  locale_sq: 'Arnavut',
  locale_am: 'Amharca',
  locale_hy: 'Ermeni',
  locale_az: 'Azerice',
  locale_eu: 'Bask',
  locale_be: 'Belarusça',
  locale_bs: 'Boşnakça',
  locale_bg: 'Bulgarca',
  locale_ca: 'Katalanca',
  locale_ceb: 'Cebuano',
  locale_co: 'Korsikalı',
  locale_hr: 'Hırvat',
  locale_cs: 'Çek',
  locale_da: 'Danimarkalı',
  locale_nl: 'Flemenkçe',
  locale_eo: 'Esperanto',
  locale_et: 'Estonyalı',
  locale_fi: 'Fince',
  locale_fy: 'Frizce',
  locale_gl: 'Galiçyaca',
  locale_ka: 'Gürcü',
  locale_el: 'Yunan',
  locale_gu: 'Gujarati',
  locale_ht: 'Haiti Kreyolu',
  locale_haw: 'Hawaii dili',
  locale_he: 'İbranice',
  locale_hmn: 'Hmong',
  locale_hu: 'Macarca',
  locale_is: 'İzlandaca',
  locale_ig: 'İbo',
  locale_ga: 'İrlandalı',
  locale_jv: 'Cava',
  locale_kn: 'Kannada',
  locale_kk: 'Kazak',
  locale_km: 'Khmer',
  locale_rw: 'Kinyarwanda',
  locale_ku: 'Kürt',
  locale_ky: 'Kırgız',
  locale_lo: 'Laos',
  locale_la: 'Latince',
  locale_lv: 'Letonca',
  locale_lt: 'Litvanyalı',
  locale_lb: 'Lüksemburgca',
  locale_mk: 'makedonca',
  locale_mg: 'Madagaskar',
  locale_ms: 'Malayca',
  locale_ml: 'Malayalam',
  locale_mt: 'Malta',
  locale_mi: 'Maori',
  locale_mn: 'Moğolca',
  locale_my: 'Myanmar (Burmaca)',
  locale_ne: 'Nepalce',
  locale_no: 'Norveççe',
  locale_ny: 'Nyanja (Çiçeva)',
  locale_or: 'Odia (Ortaya)',
  locale_ps: 'Peştuca',
  locale_fa: 'Farsça',
  locale_pa: 'Pencapça',
  locale_ro: 'Romence',
  locale_sm: 'Samoalı',
  locale_gd: 'İskoç Galcesi',
  locale_sr: 'Sırpça',
  locale_st: 'Sesotho',
  locale_sn: 'Shona',
  locale_sd: 'Sintçe',
  locale_si: 'Sinhala (Singala)',
  locale_sk: 'Slovak',
  locale_sl: 'Slovence',
  locale_so: 'Somalili',
  locale_su: 'Sundan dili',
  locale_sv: 'İsveççe',
  locale_tg: 'Tacikçe',
  locale_ta: 'Tamilce',
  locale_tt: 'Tatar',
  locale_te: 'Telugu',
  locale_th: 'Tayland',
  locale_tk: 'Türkmen',
  locale_uk: 'Ukrayna',
  locale_ug: 'Uygur',
  locale_uz: 'Özbekçe',
  locale_cy: 'Galce',
  locale_xh: 'Xhosa',
  locale_yi: 'Yidiş',
  locale_yo: 'Yoruba',
  locale_zu: 'Zulu',
  label_mediainfo_audioLanguage: 'Dil (Ses)',
  label_mediainfo_videoLanguage: 'Dil (Video)',
  label_mediainfo_textTrackLanguages: 'Diller (Altyazılar)',
  label_mediainfo_videoTrackCount: 'Video Parçaları',
  label_mediainfo_audioTrackCount: 'Ses Parçaları',
  label_mediainfo_textTrackCount: 'Metin İzleri'
}
