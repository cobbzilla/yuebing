export default {
  id: 'es',
  emoji: '🇪🇸',
  anonymous_user_name: 'misterioso',
  welcome_public: '¡Bienvenido a {{ title }}!',
  welcome_user: 'Bienvenido a {{ title }}, {{user.firstName || usuario.email.includes("@") ? usuario.email.substring(0, usuario.email.indexOf("@")) : usuario.email}}!',
  title_login: 'Registrarse',
  title_register: 'Inscribirse',
  title_verifying: 'Verificando cuenta...',
  title_requestPasswordReset: 'Restablecer la contraseña',
  title_resetPassword: 'Establecer una nueva contraseña',
  title_verifying_ended: 'Verificación finalizada',
  title_profile: 'Información de la cuenta',
  button_profile: 'Mi cuenta',
  button_update: 'ahorrar',
  info_profile_update: 'La información de su cuenta se actualizó correctamente',
  button_reset_password: 'Restablecer la contraseña',
  button_delete_my_account: 'Eliminar mi cuenta (NO SE PUEDE DESHACER)',
  label_confirm_user_delete: 'Confirma la eliminación de tu cuenta. ¡Esta acción es irreversible!',
  label_email: 'Correo electrónico',
  label_username: 'Nombre de usuario',
  label_usernameOrEmail: 'Nombre de usuario o correo electrónico',
  label_firstName: 'Primer nombre',
  label_lastName: 'Apellido',
  label_name: 'Nombre',
  label_password: 'Clave',
  label_newPassword: 'Nueva contraseña',
  label_locale: 'Idioma',
  label_token: 'token de verificación',
  label_ctime: 'Creado',
  label_mtime: 'Modificado',
  button_login: 'Registrarse',
  button_logout: 'Desconectar',
  button_register: 'Inscribirse',
  button_forgot_password: '¿Olvidaste tu contraseña?',
  button_send_password_reset_email: 'Enviar',
  button_set_new_password: 'Configurar la clave',
  info_password_reset_email_sent: 'Se envió un mensaje de correo electrónico a {{ email }}, busque en su bandeja de entrada un enlace para restablecer su contraseña',
  info_password_reset_email_error: 'Ocurrió un error y es posible que su mensaje no haya sido enviado. Por favor, inténtelo de nuevo más tarde',
  info_password_reset_try_again: 'Intentar otra vez',
  info_verify_token_error: 'El token de verificación ha caducado o no es válido',
  info_registration_not_allowed: 'El operador de {{ title }} ha inhabilitado la creación de cuenta',
  button_invite_friends: '¡Invita a tus amigos a {{ title }}!',
  label_friend_emails: 'Lista de correos electrónicos separados por comas o espacios',
  button_send_invitations: 'Enviar invitaciones',
  info_invite_friends_header: '¡Invita a tus amigos a {{ title }}!',
  info_invite_friends_subheader: 'Ingrese algunas direcciones de correo electrónico aquí y les enviaremos una invitación.',
  info_invite_friends_limited_registration: 'El operador de {{ title }} tiene registro limitado a personas específicas. Puede enviar invitaciones, pero el administrador del sitio también debe agregar estos usuarios a la lista aprobada de usuarios antes de que puedan crear una cuenta correctamente.',
  info_invite_friends_disabled_no_email: 'La función "invitar amigos" está inhabilitada porque el correo electrónico no se configuró en {{ title }}',
  info_invite_friends_enabled_no_email: 'La función "invitar a amigos" está habilitada pero el correo electrónico no se ha configurado en {{ title }}, por lo que no se puede usar',
  info_invitation_success_results: 'Su invitación fue enviada con éxito a {{ successCount }} amigos',
  info_invitation_error_results: 'Su invitación no se pudo enviar a {{ errorCount }} amigos',
  label_search: 'Búsqueda',
  button_search: 'Búsqueda',
  label_sort: 'Ordenar por',
  label_sort_order: 'Ordenar',
  label_sort_ascending: 'ascendente',
  label_sort_descending: 'descendiendo',
  title_browsing_folder: 'Carpeta: {{ folder }}',
  button_back_to: 'Volver a {{ prefix }}',
  button_back_to_root_folder: 'Volver al nivel superior',
  info_search_no_results: 'Hay cuatrocientas cuatro razones por las que algo debería estar aquí, pero no hay nada aquí.',
  label_media_unprocessed: '(sin procesar)',
  button_show_media_info: 'mostrar información multimedia',
  button_hide_media_info: 'ocultar información multimedia',
  button_show_thumbnails: 'Mostrar miniaturas',
  button_hide_thumbnails: 'ocultar miniaturas',
  button_previous_thumbnail: 'anterior',
  button_next_thumbnail: 'Siguiente',
  thumbnail_alt_text: 'imagen en miniatura de {{ name }}',
  label_selected_thumbnail: '~ seleccionado ~',
  button_select_thumbnail: 'seleccione esta miniatura',
  info_no_thumbnails_found: '(no se encontraron miniaturas)',
  button_show_metadata: 'mostrar metadatos',
  button_hide_metadata: 'ocultar metadatos',
  error_field_required: '{{ Se requiere campo',
  error_field_invalid: '{{ field }} no es válido',
  error_field_regex: '{{ field }} no es válido',
  error_field_min: '{{ field }} es demasiado corto',
  error_field_max: '{{ field }} es demasiado largo',
  error_field_min_value: '{{ field }} es demasiado pequeño',
  error_field_max_value: '{{ field }} es demasiado grande',
  error_field_email: '{{ field }} no es una dirección de correo electrónico válida',
  error_field_cannotDeleteSelf: 'No puedes borrarte a ti mismo',
  error_field_alreadyExists: '{{ cosa }} con {{ campo.toLowerCase() }} ya existe',
  error_field_readOnly: '{{ field }} es de solo lectura',
  error_field_accountNotFound: 'Cuenta no encontrada o contraseña incorrecta',
  error_field_alreadyRegistered: 'Ya existe una cuenta con este {{ field.toLowerCase() }}',
  error_field_registrationNotAllowed: 'El operador del sitio ha deshabilitado la creación de cuentas.',
  error_field_url: '{{ field }} no es una URL válida',
  error_field_host: '{{ field }} no es un nombre de host válido',
  error_field_locale: '{{ field }} no es una configuración regional válida',
  error_field_volume: '{{ field }} no es un nombre de fuente. Use solo letras, números y estos caracteres especiales: punto (.), guión (-) y guión bajo (_)',
  error_field_notFound: '{{ field }} no se pudo ubicar',
  error_field_path: '{{ field }} no es una ruta válida',
  error_field_cannotMirrorToSame: 'La fuente de lectura y la fuente de escritura no pueden ser la misma fuente',
  error_field_raw_hex: '{{ field }} no es un número hexadecimal (no se permite 0x inicial)',
  error_field_hex: '{{ field }} no es un número hexadecimal',
  error_field_username: '{{ field }} no es un nombre de usuario válido. Debe comenzar con una letra y contener solo letras, números, guiones bajos (_), guiones (-) y puntos (.)',
  locale_en: 'Inglés',
  locale_es: 'Español',
  locale_it: 'Italiano',
  locale_fr: 'Francés',
  locale_de: 'Alemana',
  locale_ar: 'Arábica',
  locale_bn: 'Bengalí',
  locale_hi: 'Hindi',
  locale_ja: 'Japonés',
  locale_ko: 'Coreano',
  locale_pt: 'Portugués',
  locale_ru: 'Ruso',
  locale_sw: 'Swahili',
  locale_zh: 'Chino',
  label_date: '{{MMM}} {{d}}, {{YYYY}}',
  label_date_short: '{{M}}/{{d}}/{{YYYY}}',
  label_date_and_time: '{{MMM}} {{d}}, {{YYYY}} / {{h}}:{{m}}{{a}}',
  label_date_and_time_short: '{{M}}/{{d}}/{{YYYY}} {{h}}:{{m}}{{a}}',
  label_date_undefined: 'Fecha/hora no configurada',
  label_date_day_half_am: 'SOY',
  label_date_day_half_pm: 'PM',
  label_date_day_0: 'Domingo',
  label_date_day_1: 'Lunes',
  label_date_day_2: 'martes',
  label_date_day_3: 'miércoles',
  label_date_day_4: 'jueves',
  label_date_day_5: 'Viernes',
  label_date_day_6: 'sábado',
  label_date_day_short_0: 'Sol',
  label_date_day_short_1: 'Mi',
  label_date_day_short_2: 'Mar',
  label_date_day_short_3: 'Casarse',
  label_date_day_short_4: 'Recoger',
  label_date_day_short_5: 'Vie',
  label_date_day_short_6: 'Se sentó',
  label_date_month_0: 'enero',
  label_date_month_1: 'Febrero',
  label_date_month_2: 'Marzo',
  label_date_month_3: 'Abril',
  label_date_month_4: 'Mayo',
  label_date_month_5: 'Junio',
  label_date_month_6: 'Julio',
  label_date_month_7: 'Agosto',
  label_date_month_8: 'Septiembre',
  label_date_month_9: 'Octubre',
  label_date_month_10: 'Noviembre',
  label_date_month_11: 'Diciembre',
  label_date_month_short_0: 'Ene',
  label_date_month_short_1: 'Feb',
  label_date_month_short_2: 'Mar',
  label_date_month_short_3: 'Abr',
  label_date_month_short_4: 'Mayo',
  label_date_month_short_5: 'Jun',
  label_date_month_short_6: 'Jul',
  label_date_month_short_7: 'Ago',
  label_date_month_short_8: 'Sep',
  label_date_month_short_9: 'Oct',
  label_date_month_short_10: 'Nov',
  label_date_month_short_11: 'Dic',
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
  label_duration_days: 'días',
  label_duration_hours: 'horas',
  label_duration_minutes: 'minutos',
  label_duration_seconds: 'segundos',
  hint_readonly: '(solo lectura)',
  label_mediainfo_title: 'title',
  label_mediainfo_artist: 'Artista',
  label_mediainfo_album_artist: 'Artista de un album',
  label_mediainfo_author: 'Autor',
  label_mediainfo_composer: 'Compositor',
  label_mediainfo_year: 'Año',
  label_mediainfo_copyright: 'Derechos de autor',
  label_mediainfo_album: 'Álbum',
  label_mediainfo_movie: 'Película',
  label_mediainfo_description: 'Descripción',
  label_mediainfo_comment: 'Comentario',
  label_mediainfo_genre: 'Género',
  label_mediainfo_location: 'Ubicación',
  label_mediainfo_show: 'Espectáculo',
  label_mediainfo_episode: 'Episodio',
  label_mediainfo_episode_sort: 'Episodio (ordenar)',
  label_mediainfo_season: 'Temporada',
  label_mediainfo_lyrics: 'Letra',
  label_mediainfo_tags: 'Etiquetas',
  label_mediainfo_duration: 'Duración',
  label_mediainfo_width: 'Ancho',
  label_mediainfo_height: 'Altura',
  label_mediainfo_size: 'Tamaño',
  label_mediainfo_videoTracks: 'Pistas de vídeo',
  label_mediainfo_audioTracks: 'Pistas de audio',
  label_mediainfo_format: 'Formato',
  label_mediainfo_contentType: 'Tipo de contenido',
  label_mediainfo_bitRate: 'Tasa de bits',
  label_mediainfo_frameRate: 'Cuadros por segundo',
  label_mediainfo_dateEncoded: 'Fecha codificada',
  button_admin: 'Configuración del sitio',
  admin_title_site_administration: '{{ title }} Administración',
  admin_title_manage_configuration: 'Configuración del sistema',
  admin_title_volume_administration: 'Administración de fuentes',
  admin_title_user_administration: 'Administración de Usuario',
  admin_title_migrate_data: 'Migrar datos',
  admin_title_transform_queue: 'Cola de transformación de medios',
  admin_title_site_administration_publicConfig: 'Configuración pública',
  admin_title_site_administration_privateConfig: 'Configuración privada',
  admin_button_save_config: 'Ahorrar',
  admin_info_config_updated: 'Configuración del sistema actualizada con éxito',
  admin_label_publicConfig_title: 'title del sitio',
  admin_label_publicConfig_siteUrl: 'Sitio URL',
  admin_label_publicConfig_public: '¿Público?',
  admin_label_publicConfig_allowRegistration: '¿Permitir registro?',
  admin_label_publicConfig_limitRegistration: 'Límite de registro',
  admin_label_publicConfig_inviteFriendsEnabled: '¿Mostrar \'Invitar amigos\' a los usuarios registrados?',
  admin_label_publicConfig_locales: 'Locales',
  admin_label_publicConfig_defaultLocale: 'Configuración regional predeterminada',
  admin_label_publicConfig_emailEnabled: '¿Correo electrónico habilitado?',
  admin_label_publicConfig_timeout: 'Tiempos de espera',
  admin_label_publicConfig_timeout_verify: 'Tiempo de espera del token de verificación de cuenta',
  admin_label_publicConfig_timeout_resetPassword: 'Restablecer tiempo de espera del token de contraseña',
  admin_label_privateConfig_admin: 'Configuración del administrador',
  admin_label_privateConfig_admin_user: 'Usuario administrador',
  admin_label_privateConfig_admin_user_email: 'Correo electrónico',
  admin_label_privateConfig_admin_user_password: 'Clave',
  admin_label_privateConfig_admin_user_firstName: 'Primer nombre',
  admin_label_privateConfig_admin_user_lastName: 'Apellido',
  admin_label_privateConfig_admin_user_locale: 'Local',
  admin_label_privateConfig_admin_overwrite: '¿Sobrescribir?',
  admin_label_privateConfig_email: 'Configuración SMTP',
  admin_label_privateConfig_email_host: 'Anfitrión',
  admin_label_privateConfig_email_port: 'Puerto',
  admin_label_privateConfig_email_user: 'Nombre de usuario',
  admin_label_privateConfig_email_password: 'Clave',
  admin_label_privateConfig_email_secure: '¿Seguro?',
  admin_label_privateConfig_email_fromEmail: 'Dirección de correo electrónico del sistema',
  admin_label_privateConfig_redis: 'Configuración de Redis',
  admin_label_privateConfig_redis_host: 'Anfitrión',
  admin_label_privateConfig_redis_port: 'Puerto',
  admin_label_privateConfig_redis_flushAtStartup: '¿Descargar al inicio?',
  admin_label_privateConfig_redis_listingCacheExpiration: 'Expiración de caché de lista',
  admin_label_privateConfig_redis_manifestCacheExpiration: 'Expiración de caché de manifiesto',
  admin_label_privateConfig_media: 'Soporte de medios',
  admin_label_privateConfig_media_video: 'Video',
  admin_label_privateConfig_media_video_allowedCommands: 'Comandos permitidos',
  admin_label_privateConfig_encryption: 'Configuración de cifrado',
  admin_label_privateConfig_encryption_key: 'Clave de encriptación',
  admin_label_privateConfig_encryption_iv: 'Vector de inicialización (IV)',
  admin_label_privateConfig_encryption_algo: 'Algoritmo',
  admin_label_privateConfig_encryption_bcryptRounds: 'rondas de criptas',
  admin_label_privateConfig_session: 'Configuración de la sesión',
  admin_label_privateConfig_session_expiration: 'Hora de término de la sesión',
  admin_label_privateConfig_autoscan: 'Configuración de escaneo automático',
  admin_label_privateConfig_autoscan_enabled: 'Habilitar escaneo automático',
  admin_label_privateConfig_autoscan_interval: 'Intervalo de escaneo regular',
  admin_label_privateConfig_autoscan_initialDelay: 'Retraso en el escaneo de inicio',
  admin_label_privateConfig_autoscan_showTransformOutput: '¿Salida de transformación de registro?',
  admin_label_privateConfig_autoscan_cleanupTemporaryAssets: '¿Limpiar archivos temporales?',
  admin_label_privateConfig_autoscan_deleteIncompleteUploads: '¿Limpiar cargas incompletas?',
  admin_label_privateConfig_autoscan_concurrency: 'concurrencia',
  admin_label_total_user_count: '{{ totalUserCount }} usuarios totales',
  admin_button_delete_user: 'Borrar usuario',
  admin_label_confirm_user_delete: 'Confirme la eliminación del usuario: {{ email }}',
  label_configCategory: 'Categoría de configuración',
  admin_button_add_volume: 'Agregue una fuente',
  admin_title_add_volume: 'Agregue una fuente',
  admin_button_delete_volume: 'Eliminar fuente',
  admin_button_scan_volume: 'Escanear',
  admin_info_scan_scanning: 'Exploración...',
  admin_info_scan_successful: 'El escaneo ha comenzado con éxito',
  admin_info_scan_error: 'Ocurrió un error durante el escaneo.',
  admin_label_confirm_volume_delete: 'Confirme la eliminación de la fuente: {{ source }}',
  admin_info_volume_added: 'La nueva fuente \'{{ source }}\' se agregó con éxito',
  admin_info_volume_add_error: 'Se produjo un error al agregar la fuente \'{{ source }}\'',
  admin_label_volume_name: 'Nombre de la fuente',
  admin_label_self_volume: '{{ title }} almacenamiento',
  admin_label_volume_type: 'tipo de fuente',
  admin_label_volume_readOnly: '¿Solo lectura?',
  admin_label_volume_cacheSize: 'Listado de tamaño de caché (cero para deshabilitar)',
  admin_label_volume_encryption_enable: 'Habilitar el cifrado',
  admin_label_volume_encryption_key: 'Clave de encriptación',
  admin_label_volume_encryption_iv: 'Vector de inicialización (IV)',
  admin_label_volume_encryption_algo: 'Algoritmo',
  label_volumeType_local: 'sistema de archivos local',
  label_volumeType_local_field_key: 'directorio de montaje',
  label_volumeType_local_field_mode: 'Modo de creación de archivos/directorios',
  label_volumeType_s3: 'Amazonas S3',
  label_volumeType_s3_field_key: 'Clave de acceso de AWS',
  label_volumeType_s3_field_secret: 'Clave secreta de AWS',
  label_volumeType_s3_field_bucket: 'Cubo S3',
  label_volumeType_s3_field_region: 'Región de AWS',
  label_volumeType_s3_field_prefix: 'Prefijo de cubeta',
  label_volumeType_s3_field_delimiter: 'delimitador',
  label_volumeType_b2: 'Backblaze B2',
  label_volumeType_b2_field_key: 'ID de clave',
  label_volumeType_b2_field_secret: 'Clave de aplicación',
  label_volumeType_b2_field_bucket: 'Id. de segmento B2 (no nombre)',
  label_volumeType_b2_field_partSize: 'Tamaño de la pieza',
  label_volumeType_b2_field_prefix: 'Prefijo de cubeta',
  label_volumeType_b2_field_delimiter: 'delimitador',
  admin_label_firstEvent: 'primer evento',
  admin_label_lastEvent: 'último evento',
  admin_label_eventTime: 'tiempo',
  admin_label_eventName: 'evento',
  admin_label_eventDescription: 'descripción',
  admin_label_xformQueueEmpty: 'Sin trabajos activos',
  admin_label_migration_noSources: 'No hay fuentes definidas',
  admin_label_migration_results: 'Resultados de la migración:',
  admin_label_migration_readPath: 'Leer desde la ruta (en blanco para la raíz del sistema de archivos)',
  admin_label_readPath: 'Ruta de lectura',
  admin_label_migration_writePath: 'Escribir en la ruta (en blanco para la raíz del sistema de archivos)',
  admin_label_writePath: 'Ruta de escritura',
  admin_button_migrate_data: 'Migrar datos',
  admin_info_migration_success: 'Datos migrados con éxito',
  admin_info_migration_error: 'Ocurrió un error al migrar datos',
  http_invalid_request_method: 'Este punto final no admite el método de solicitud HTTP {{ method }}',
  admin_label_privateConfig_admin_user_username: 'Nombre de usuario',
  locale_id: 'indonesio',
  locale_ur: 'urdu',
  locale_tl: 'tagalo',
  locale_pl: 'Polaco',
  locale_vi: 'vietnamita',
  locale_ha: 'Hausa',
  locale_mr: 'Marathi',
  locale_tr: 'turco',
  info_search_searching: '...',
  search_stop_words: 'a,acerca de,arriba,después,de nuevo,contra,todos,soy,un,y,cualquiera,son,no,como,en,ser,porque,estado,antes,estar,abajo,entre,ambos,pero, por,no,puede,no,pudo,no,hizo,no,hace,hace,no,hace,no,abajo,durante,cada,pocos,para,desde,más,tenía, no tenía, tiene, no tiene, tiene, no tiene, él, él, él, él, ella, aquí, aquí está, ella, ella, él, él, él, cómo, cómo, yo, yo, yo, yo, yo, yo, yo, yo, yo, yo, yo, yo, yo, yo, yo, yo, yo, yo, yo, yo, yo, yo, yo mi,yo,no,ni,no,de,apagado,encendido,una vez,solo,o,otro,debería,nuestro,nuestro \'ll,she\'s, should, shouldn\'t, so, some, such, than, that, that\'s, the, they, they, they, they, they, they, they, they, they, they\'d, they\'d, they\'ll ,son,tienen,esto,aquellos,a través,hasta,demasiado,debajo,hasta,arriba,uct,utc,muy,era,no,nosotros,nosotros,estaremos,estamos ,hemos,estuvimos,no,qué,qué,cuándo,cuándo,dónde,dónde,cuál,mientras,quién,quién,quién,por qué,por qué,con,no,podría,no,usted ,ustedes,ustedes,ustedes,ustedes,ustedes',
  label_header_comments: 'Comentarios',
  label_header_no_comments: '¿Tienes algo que decir?',
  label_comment: '¡añadir un comentario!',
  label_comment_modified: 'editado',
  label_updating_comment: 'actualizando...',
  label_removing_comment: 'quitando...',
  button_add_comment: 'agregar comentario',
  button_update_comment: 'actualizar comentario',
  admin_title_index_administration: 'Administrar índices',
  admin_button_reindex_volume: 'reindexar',
  admin_info_reindex_indexing: 'Indexación...',
  admin_info_reindex_error: 'Ocurrió un error durante la reindexación: {{ e }}',
  admin_info_reindex_successful: 'La reindexación ha comenzado con éxito',
  admin_info_reindex_info_error: 'Ocurrió un error al leer el estado de la reindexación: {{ e }}',
  admin_label_reindex_path: 'fuente y camino',
  admin_label_reindex_time: 'Tiempo',
  admin_label_reindex_status: 'Estado',
  admin_label_reindex_noResults: 'No se encontraron resultados de reindexación',
  footer_credit: '<a style="text-decoration: none;" href="https://github.com/cobbzilla/yuebing">Desarrollado por 🥮 Yuebing</a>',
  info_search_indexes_building: 'Esta misma búsqueda puede arrojar más resultados en el futuro. Se están reconstruyendo algunos índices de búsqueda: {{ indexes }}',
  info_search_no_results_unverified: 'Para ver los resultados de la búsqueda, verifique su cuenta usando el enlace enviado a {{ email }}',
  label_metadata: 'metadatos del archivo',
  label_mediainfo: 'archivo mediainfo',
  label_add_tag: 'Añadir etiqueta',
  label_adding_tag: 'agregando etiqueta...',
  label_removing_tag: 'quitando etiqueta...',
  label_scan_ignoreErrors: 'Ignorar errores anteriores',
  label_scan_overwrite: 'sobrescribir archivos existentes',
  label_scan_reprocess: 'reprocesar',
  label_scan_reprocess_profiles: 'Reprocesar estos perfiles',
  label_path: 'Sendero',
  label_select_all: 'Seleccionar todo',
  locale_text_list_separator: ',',
  admin_title_volume_browser: 'Explorar fuentes',
  admin_title_reindex_status: 'Estado de indexación',
  admin_button_browse_volume: 'Navegar',
  admin_label_scan_config: 'Configurar escaneo: {{ source }}',
  admin_label_scan_olderThan: 'Ignorar los medios que se han procesado después de una fecha y hora específicas',
  admin_button_delete_path: 'Borrar',
  admin_button_rebuildSearchIndex: 'Reconstruir índice de búsqueda',
  admin_button_rebuildSearchIndex_warning: 'Esto reconstruirá los índices de búsqueda en todas las fuentes y podría llevar mucho tiempo.',
  admin_info_path_delete: 'Borrando ruta...',
  label_editor: '¿Editor?',
  label_noCache: 'restablecer caché?',
  label_previous_page: 'página anterior de resultados',
  label_next_page: 'siguiente página de resultados',
  label_results_info: 'mostrando resultados {{ start }} a {{ end }} de {{ total }} total',
  label_playback_quality: 'Calidad de reproducción',
  label_playback_quality_auto: 'automático',
  admin_label_privateConfig_redis_buildSearchIndexAtStartup: 'Crear índices de búsqueda al inicio',
  locale_af: 'africaans',
  locale_sq: 'albanés',
  locale_am: 'amárico',
  locale_hy: 'armenio',
  locale_az: 'azerbaiyano',
  locale_eu: 'vasco',
  locale_be: 'bielorruso',
  locale_bs: 'bosnio',
  locale_bg: 'búlgaro',
  locale_ca: 'catalán',
  locale_ceb: 'cebuano',
  locale_co: 'corso',
  locale_hr: 'croata',
  locale_cs: 'checo',
  locale_da: 'danés',
  locale_nl: 'Holandés',
  locale_eo: 'esperanto',
  locale_et: 'estonio',
  locale_fi: 'finlandés',
  locale_fy: 'frisio',
  locale_gl: 'gallego',
  locale_ka: 'georgiano',
  locale_el: 'Griego',
  locale_gu: 'guyaratí',
  locale_ht: 'criollo haitiano',
  locale_haw: 'hawaiano',
  locale_he: 'hebreo',
  locale_hmn: 'hmong',
  locale_hu: 'húngaro',
  locale_is: 'islandés',
  locale_ig: 'igbo',
  locale_ga: 'irlandesa',
  locale_jv: 'javanés',
  locale_kn: 'Canadá',
  locale_kk: 'kazajo',
  locale_km: 'jemer',
  locale_rw: 'Kinyarwanda',
  locale_ku: 'kurdo',
  locale_ky: 'kirguís',
  locale_lo: 'laosiano',
  locale_la: 'latín',
  locale_lv: 'letón',
  locale_lt: 'lituano',
  locale_lb: 'luxemburgués',
  locale_mk: 'macedónio',
  locale_mg: 'madagascarí',
  locale_ms: 'malayo',
  locale_ml: 'Malayalam',
  locale_mt: 'maltés',
  locale_mi: 'maorí',
  locale_mn: 'mongol',
  locale_my: 'Myanmar (birmano)',
  locale_ne: 'nepalí',
  locale_no: 'noruego',
  locale_ny: 'Nyanja (Chichewa)',
  locale_or: 'Odia (Oriya)',
  locale_ps: 'pastún',
  locale_fa: 'persa',
  locale_pa: 'punjabi',
  locale_ro: 'rumano',
  locale_sm: 'samoano',
  locale_gd: 'gaélico escocés',
  locale_sr: 'serbio',
  locale_st: 'sesotho',
  locale_sn: 'Shona',
  locale_sd: 'Sindhi',
  locale_si: 'cingalés (cingalés)',
  locale_sk: 'eslovaco',
  locale_sl: 'esloveno',
  locale_so: 'somalí',
  locale_su: 'sundanés',
  locale_sv: 'sueco',
  locale_tg: 'tayiko',
  locale_ta: 'tamil',
  locale_tt: 'tártaro',
  locale_te: 'telugu',
  locale_th: 'tailandés',
  locale_tk: 'turkmeno',
  locale_uk: 'ucranio',
  locale_ug: 'uigur',
  locale_uz: 'uzbeco',
  locale_cy: 'galés',
  locale_xh: 'Xhosa',
  locale_yi: 'yídish',
  locale_yo: 'yoruba',
  locale_zu: 'zulú',
  label_mediainfo_audioLanguage: 'Idioma (audio)',
  label_mediainfo_videoLanguage: 'Idioma (Vídeo)',
  label_mediainfo_textTrackLanguages: 'Idiomas (Subtítulos)',
  label_mediainfo_videoTrackCount: 'Pistas de vídeo',
  label_mediainfo_audioTrackCount: 'Pistas de audio',
  label_mediainfo_textTrackCount: 'Pistas de texto'
}
