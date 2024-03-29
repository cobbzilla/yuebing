export default {
  id: 'pt',
  emoji: '🇧🇷',
  anonymous_user_name: 'um misterioso',
  welcome_public: 'Bem-vindo ao {{ title }}!',
  welcome_user: 'Bem-vindo ao {{ title }}, {{user.firstName || user.email.includes("@") ? user.email.substring(0, user.email.indexOf("@")) : user.email}}!',
  title_login: 'Entrar',
  title_register: 'Inscrever-se',
  title_verifying: 'Verificando conta...',
  title_requestPasswordReset: 'Redefinir senha',
  title_resetPassword: 'Definir uma nova senha',
  title_verifying_ended: 'Verificação encerrada',
  title_profile: 'Informação da conta',
  button_profile: 'Minha conta',
  button_update: 'Salve ',
  info_profile_update: 'As informações da sua conta foram atualizadas com sucesso',
  button_reset_password: 'Redefinir senha',
  button_delete_my_account: 'Excluir minha conta (NÃO PODE SER DESFEITA)',
  label_confirm_user_delete: 'Confirme a exclusão da sua conta. Esta ação é irreversível!',
  label_email: 'E-mail',
  label_username: 'Nome de usuário',
  label_usernameOrEmail: 'Nome de usuário ou email',
  label_firstName: 'Primeiro nome',
  label_lastName: 'Sobrenome',
  label_name: 'Nome',
  label_password: 'Senha',
  label_newPassword: 'Nova Senha',
  label_locale: 'Linguagem',
  label_token: 'Token de verificação',
  label_ctime: 'Criada',
  label_mtime: 'Modificado',
  button_login: 'Entrar',
  button_logout: 'Sair',
  button_register: 'Inscrever-se',
  button_forgot_password: 'Esqueceu sua senha?',
  button_send_password_reset_email: 'Mandar',
  button_set_new_password: 'Configurar senha',
  info_password_reset_email_sent: 'Uma mensagem de e-mail foi enviada para {{ email }}, verifique sua caixa de entrada para um link para redefinir sua senha',
  info_password_reset_email_error: 'Ocorreu um erro e sua mensagem pode não ter sido enviada. Por favor, tente novamente mais tarde',
  info_password_reset_try_again: 'Tente novamente',
  info_verify_token_error: 'O token de verificação expirou ou é inválido',
  info_registration_not_allowed: 'O operador de {{ title }} desativou a criação de conta',
  button_invite_friends: 'Convide seus amigos para {{ title }}!',
  label_friend_emails: 'Lista de emails separados por vírgulas ou espaços',
  button_send_invitations: 'Enviar convites',
  info_invite_friends_header: 'Convide seus amigos para {{ title }}!',
  info_invite_friends_subheader: 'Digite alguns endereços de e-mail aqui e enviaremos um convite',
  info_invite_friends_limited_registration: 'O operador de {{ title }} limitou o registro a pessoas específicas. Você pode enviar convites, mas esses usuários também devem ser adicionados à lista de usuários aprovados pelo administrador do site antes de poderem criar uma conta com êxito',
  info_invite_friends_disabled_no_email: 'O recurso "convidar amigos" está desativado porque o e-mail não foi configurado em {{ title }}',
  info_invite_friends_enabled_no_email: 'O recurso "convidar amigos" está ativado, mas o e-mail não foi configurado em {{ title }}, portanto, não pode ser usado',
  info_invitation_success_results: 'Seu convite foi enviado com sucesso para {{ successCount }} amigos',
  info_invitation_error_results: 'Não foi possível entregar seu convite para {{ errorCount }} amigos',
  label_search: 'Procurar',
  button_search: 'Procurar',
  label_sort: 'Ordenar por',
  label_sort_order: 'Ordem',
  label_sort_ascending: 'ascendente',
  label_sort_descending: 'descendente',
  title_browsing_folder: 'Pasta: {{ folder }}',
  button_back_to: 'Voltar para {{ prefix }}',
  button_back_to_root_folder: 'Voltar ao nível superior',
  info_search_no_results: 'Há quatrocentas e quatro razões pelas quais algo deveria estar aqui, mas não há nada aqui',
  label_media_unprocessed: '(não processado)',
  button_show_media_info: 'mostrar informações de mídia',
  button_hide_media_info: 'ocultar informações de mídia',
  button_show_thumbnails: 'mostrar miniaturas',
  button_hide_thumbnails: 'ocultar miniaturas',
  button_previous_thumbnail: 'anterior',
  button_next_thumbnail: 'próximo',
  thumbnail_alt_text: 'imagem em miniatura para {{ name }}',
  label_selected_thumbnail: '~selecionado~',
  button_select_thumbnail: 'selecione esta miniatura',
  info_no_thumbnails_found: '(nenhuma miniatura encontrada)',
  button_show_metadata: 'mostrar metadados',
  button_hide_metadata: 'ocultar metadados',
  error_field_required: '{{ field }} é obrigatório',
  error_field_invalid: '{{ field }} não é válido',
  error_field_regex: '{{ field }} não é válido',
  error_field_min: '{{ field }} é muito curto',
  error_field_max: '{{ field }} é muito longo',
  error_field_min_value: '{{ field }} é muito pequeno',
  error_field_max_value: '{{ field }} é muito grande',
  error_field_email: '{{ field }} não é um endereço de e-mail válido',
  error_field_cannotDeleteSelf: 'Você não pode se excluir',
  error_field_alreadyExists: '{{ thing }} com {{ field.toLowerCase() }} já existe',
  error_field_readOnly: '{{ field }} é somente leitura',
  error_field_accountNotFound: 'Conta não encontrada ou senha incorreta',
  error_field_alreadyRegistered: 'Já existe uma conta com este {{ field.toLowerCase() }}',
  error_field_registrationNotAllowed: 'O operador do site desativou a criação de conta',
  error_field_url: '{{ field }} não é um URL válido',
  error_field_host: '{{ field }} não é um nome de host válido',
  error_field_locale: '{{ field }} não é uma localidade válida',
  error_field_source: '{{ field }} não é um nome de origem. Use apenas letras, números e estes caracteres especiais: ponto (.), hífen (-) e sublinhado (_)',
  error_field_notFound: '{{ field }} não pôde ser localizado',
  error_field_path: '{{ field }} não é um caminho válido',
  error_field_cannotMirrorToSame: 'A fonte de leitura e a fonte de gravação não podem ser a mesma fonte',
  error_field_raw_hex: '{{ field }} não é um número hexadecimal (0x inicial não permitido)',
  error_field_hex: '{{ field }} não é um número hexadecimal',
  error_field_username: '{{ field }} não é um nome de usuário válido. Deve começar com uma letra e conter apenas letras, números, sublinhados (_), hífens (-) e pontos (.)',
  locale_en: 'Inglês',
  locale_es: 'Espanhol',
  locale_it: 'Italiano',
  locale_fr: 'Francês',
  locale_de: 'Alemão',
  locale_ar: 'Árabe',
  locale_bn: 'Bengali',
  locale_hi: 'Hindi',
  locale_ja: 'Japonês',
  locale_ko: 'Coreano',
  locale_pt: 'Português',
  locale_ru: 'Russa',
  locale_sw: 'Suaíli',
  locale_zh: 'Chinês',
  label_date: '{{MMM}} {{d}}, {{YYYY}}',
  label_date_short: '{{M}}/{{d}}/{{YYYY}}',
  label_date_and_time: '{{MMM}} {{d}}, {{YYYY}} / {{h}}:{{m}}{{a}}',
  label_date_and_time_short: '{{M}}/{{d}}/{{YYYY}} {{h}}:{{m}}{{a}}',
  label_date_undefined: 'Data/hora não definida',
  label_date_day_half_am: 'SOU',
  label_date_day_half_pm: 'PM',
  label_date_day_0: 'Domingo',
  label_date_day_1: 'Segunda-feira',
  label_date_day_2: 'Terça-feira',
  label_date_day_3: 'Quarta-feira',
  label_date_day_4: 'Quinta-feira',
  label_date_day_5: 'Sexta-feira',
  label_date_day_6: 'Sábado',
  label_date_day_short_0: 'Sol',
  label_date_day_short_1: 'Meu',
  label_date_day_short_2: 'ter',
  label_date_day_short_3: 'qua',
  label_date_day_short_4: 'Coletar',
  label_date_day_short_5: 'sex',
  label_date_day_short_6: 'Sentado',
  label_date_month_0: 'Janeiro',
  label_date_month_1: 'Fevereiro',
  label_date_month_2: 'Marchar',
  label_date_month_3: 'abril',
  label_date_month_4: 'Poderia',
  label_date_month_5: 'Junho',
  label_date_month_6: 'Julho',
  label_date_month_7: 'Agosto',
  label_date_month_8: 'Setembro',
  label_date_month_9: 'Outubro',
  label_date_month_10: 'novembro',
  label_date_month_11: 'dezembro',
  label_date_month_short_0: 'janeiro',
  label_date_month_short_1: 'fevereiro',
  label_date_month_short_2: 'março',
  label_date_month_short_3: 'abril',
  label_date_month_short_4: 'Poderia',
  label_date_month_short_5: 'junho',
  label_date_month_short_6: 'julho',
  label_date_month_short_7: 'agosto',
  label_date_month_short_8: 'setembro',
  label_date_month_short_9: 'Outubro',
  label_date_month_short_10: 'novembro',
  label_date_month_short_11: 'dezembro',
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
  label_duration_days: 'dias',
  label_duration_hours: 'horas',
  label_duration_minutes: 'minutos',
  label_duration_seconds: 'segundos',
  hint_readonly: '(somente leitura)',
  label_mediainfo_title: 'Título',
  label_mediainfo_artist: 'Artista',
  label_mediainfo_album_artist: 'Álbum do artista',
  label_mediainfo_author: 'Autor',
  label_mediainfo_composer: 'Compositor',
  label_mediainfo_year: 'Ano',
  label_mediainfo_copyright: 'direito autoral',
  label_mediainfo_album: 'Álbum',
  label_mediainfo_movie: 'Filme',
  label_mediainfo_description: 'Descrição',
  label_mediainfo_comment: 'Comente',
  label_mediainfo_genre: 'Gênero',
  label_mediainfo_location: 'Localização',
  label_mediainfo_show: 'mostrar',
  label_mediainfo_episode: 'Episódio',
  label_mediainfo_episode_sort: 'Episódio (ordenar)',
  label_mediainfo_season: 'Estação',
  label_mediainfo_lyrics: 'Letra da música',
  label_mediainfo_tags: 'Tag',
  label_mediainfo_duration: 'Duração',
  label_mediainfo_width: 'Largura',
  label_mediainfo_height: 'Altura',
  label_mediainfo_size: 'Tamanho',
  label_mediainfo_videoTracks: 'Faixas de vídeo',
  label_mediainfo_audioTracks: 'Faixas de áudio',
  label_mediainfo_format: 'Formato',
  label_mediainfo_contentType: 'Tipo de conteúdo',
  label_mediainfo_bitRate: 'Taxa de bits',
  label_mediainfo_frameRate: 'Taxa de quadros',
  label_mediainfo_dateEncoded: 'Data Codificada',
  button_admin: 'Configuração do site',
  admin_title_site_administration: '{{ title }} Administração',
  admin_title_manage_configuration: 'Configuração do sistema',
  admin_title_source_administration: 'Administração de origem',
  admin_title_user_administration: 'Administração do usuário',
  admin_title_migrate_data: 'Migrar dados',
  admin_title_transform_queue: 'Fila de transformação de mídia',
  admin_title_site_administration_publicConfig: 'Configuração pública',
  admin_title_site_administration_privateConfig: 'Configuração privada',
  admin_button_save_config: 'Salvar',
  admin_info_config_updated: 'Configuração do sistema atualizada com sucesso',
  admin_label_publicConfig_title: 'titulo do site',
  admin_label_publicConfig_siteUrl: 'URL do site',
  admin_label_publicConfig_public: 'Público?',
  admin_label_publicConfig_allowRegistration: 'Permitir registro?',
  admin_label_publicConfig_limitRegistration: 'Limite de registro',
  admin_label_publicConfig_inviteFriendsEnabled: 'Mostrar \'Convidar amigos\' para usuários logados?',
  admin_label_publicConfig_locales: 'local',
  admin_label_publicConfig_defaultLocale: 'Local padrão',
  admin_label_publicConfig_emailEnabled: 'E-mail ativado?',
  admin_label_publicConfig_timeout: 'Tempos limite',
  admin_label_publicConfig_timeout_verify: 'Tempo limite do token de verificação de conta',
  admin_label_publicConfig_timeout_resetPassword: 'Redefinir o tempo limite do token de senha',
  admin_label_privateConfig_admin: 'Configurações do administrador',
  admin_label_privateConfig_admin_user: 'Usuário administrador',
  admin_label_privateConfig_admin_user_email: 'E-mail',
  admin_label_privateConfig_admin_user_password: 'Senha',
  admin_label_privateConfig_admin_user_firstName: 'Primeiro nome',
  admin_label_privateConfig_admin_user_lastName: 'Sobrenome',
  admin_label_privateConfig_admin_user_locale: 'Local',
  admin_label_privateConfig_admin_overwrite: 'Substituir?',
  admin_label_privateConfig_email: 'Configurações de SMTP',
  admin_label_privateConfig_email_host: 'Hospedeiro',
  admin_label_privateConfig_email_port: 'Porta',
  admin_label_privateConfig_email_user: 'Nome de usuário',
  admin_label_privateConfig_email_password: 'Senha',
  admin_label_privateConfig_email_secure: 'Seguro?',
  admin_label_privateConfig_email_fromEmail: 'Endereço de e-mail do sistema',
  admin_label_privateConfig_redis: 'Configurações do Redis',
  admin_label_privateConfig_redis_host: 'Hospedeiro',
  admin_label_privateConfig_redis_port: 'Porta',
  admin_label_privateConfig_redis_flushAtStartup: 'Lavar na inicialização?',
  admin_label_privateConfig_redis_listingCacheExpiration: 'Expiração do cache da listagem',
  admin_label_privateConfig_redis_manifestCacheExpiration: 'Expiração de cache de manifesto',
  admin_label_privateConfig_media: 'Suporte de mídia',
  admin_label_privateConfig_media_video: 'Vídeo',
  admin_label_privateConfig_media_video_allowedCommands: 'Comandos permitidos',
  admin_label_privateConfig_encryption: 'Configurações de criptografia',
  admin_label_privateConfig_encryption_key: 'Chave de encriptação',
  admin_label_privateConfig_encryption_iv: 'Vetor de inicialização (IV)',
  admin_label_privateConfig_encryption_algo: 'Algoritmo',
  admin_label_privateConfig_encryption_bcryptRounds: 'Bcrypt rodadas',
  admin_label_privateConfig_session: 'Configurações da sessão',
  admin_label_privateConfig_session_expiration: 'Sessão expirada',
  admin_label_privateConfig_autoscan: 'Configurações de verificação automática',
  admin_label_privateConfig_autoscan_enabled: 'Ativar verificação automática',
  admin_label_privateConfig_autoscan_interval: 'Intervalo de verificação regular',
  admin_label_privateConfig_autoscan_initialDelay: 'Atraso da verificação de inicialização',
  admin_label_privateConfig_autoscan_showTransformOutput: 'Saída de transformação de log?',
  admin_label_privateConfig_autoscan_cleanupTemporaryAssets: 'Limpar arquivos temporários?',
  admin_label_privateConfig_autoscan_deleteIncompleteUploads: 'Limpar uploads incompletos?',
  admin_label_privateConfig_autoscan_concurrency: 'Simultaneidade',
  admin_label_total_user_count: '{{ totalUserCount }} total de usuários',
  admin_button_delete_user: 'Deletar usuário',
  admin_label_confirm_user_delete: 'Confirme a exclusão do usuário: {{ email }}',
  label_configCategory: 'Categoria de configuração',
  admin_button_add_source: 'Adicionar fonte',
  admin_title_add_source: 'Adicionar fonte',
  admin_button_delete_source: 'Excluir origem',
  admin_button_scan_source: 'Varredura',
  admin_info_scan_scanning: 'Digitalizando...',
  admin_info_scan_successful: 'A verificação foi iniciada com sucesso',
  admin_info_scan_error: 'Ocorreu um erro durante a verificação',
  admin_label_confirm_source_delete: 'Confirme a exclusão da fonte: {{ source }}',
  admin_info_source_added: 'A nova fonte \'{{ source }}\' foi adicionada com sucesso',
  admin_info_source_add_error: 'Ocorreu um erro ao adicionar a fonte \'{{ source }}\'',
  admin_label_source_name: 'Nome da fonte',
  admin_label_self_source: '{{ title }} armazenamento',
  admin_label_source_type: 'Tipo de fonte',
  admin_label_source_readOnly: 'Somente leitura?',
  admin_label_source_cacheSize: 'Listando o tamanho do cache (zero para desabilitar)',
  admin_label_source_encryption_enable: 'Ativar criptografia',
  admin_label_source_encryption_key: 'Chave de encriptação',
  admin_label_source_encryption_iv: 'Vetor de inicialização (IV)',
  admin_label_source_encryption_algo: 'Algoritmo',
  label_sourceType_local: 'Sistema de arquivos local',
  label_sourceType_local_field_key: 'Diretório de montagem',
  label_sourceType_local_field_mode: 'Modo de criação de arquivo/diretório',
  label_sourceType_s3: 'Amazon S3',
  label_sourceType_s3_field_key: 'Chave de acesso da AWS',
  label_sourceType_s3_field_secret: 'Chave secreta da AWS',
  label_sourceType_s3_field_bucket: 'Balde S3',
  label_sourceType_s3_field_region: 'Região da AWS',
  label_sourceType_s3_field_prefix: 'Prefixo do intervalo',
  label_sourceType_s3_field_delimiter: 'Delimitador',
  label_sourceType_b2: 'Backblaze B2',
  label_sourceType_b2_field_key: 'Código da chave',
  label_sourceType_b2_field_secret: 'Chave do aplicativo',
  label_sourceType_b2_field_bucket: 'ID do bucket B2 (não nome)',
  label_sourceType_b2_field_partSize: 'Tamanho da peça',
  label_sourceType_b2_field_prefix: 'Prefixo do intervalo',
  label_sourceType_b2_field_delimiter: 'Delimitador',
  admin_label_firstEvent: 'primeiro evento',
  admin_label_lastEvent: 'Último evento',
  admin_label_eventTime: 'Tempo',
  admin_label_eventName: 'evento',
  admin_label_eventDescription: 'Descrição',
  admin_label_xformQueueEmpty: 'Nenhum trabalho ativo',
  admin_label_migration_noSources: 'Nenhuma fonte definida',
  admin_label_migration_results: 'Resultados da migração:',
  admin_label_migration_readSource: 'Origem para migrar dados de',
  admin_label_migration_readPath: 'Ler do caminho (em branco para raiz do sistema de arquivos)',
  admin_label_readSource: 'Ler fonte',
  admin_label_readPath: 'Caminho de leitura',
  admin_label_migration_writeSource: 'Fonte para gravar dados',
  admin_label_migration_writePath: 'Gravar no caminho (em branco para raiz do sistema de arquivos)',
  admin_label_writeSource: 'Fonte de gravação',
  admin_label_writePath: 'Escrever caminho',
  admin_button_migrate_data: 'Migrar dados',
  admin_info_migration_success: 'Dados migrados com sucesso',
  admin_info_migration_error: 'Ocorreu um erro ao migrar os dados',
  http_invalid_request_method: 'O método de solicitação HTTP {{ method }} não é compatível com este endpoint',
  admin_label_privateConfig_admin_user_username: 'Nome de usuário',
  locale_id: 'indonésio',
  locale_ur: 'urdu',
  locale_tl: 'Tagalo',
  locale_pl: 'polonês',
  locale_vi: 'vietnamita',
  locale_ha: 'Hauçá',
  locale_mr: 'Marathi',
  locale_tr: 'turco',
  info_search_searching: '...',
  search_stop_words: 'a,sobre,acima,depois de,novamente,contra,todos,sou,um,e,qualquer,estão,não são,como,em,ser,porque,ser,antes,ser,abaixo,entre,ambos,mas, por,não pode,não pode,poderia,não poderia,fez,não fez,faz,não,faz,não,para baixo,durante,cada,poucos,para,de,adicional,tinha, não teve,tem,não tem,tem,não tem,tendo,ele,ele,ele vai,ele é,ela,aqui,aqui está,dela,ela mesma,ele mesmo,seu,como,como está, eu, eu, eu, eu sou, eu tenho, se, em, em, é, não é, é, é, é, em si, vamos, eu, mais, a maioria, não deve, meu,eu mesmo,não,nem,não,de,desligado,ligado,uma vez,somente,ou,outro,deveria,nosso,nosso nós mesmos,fora,sobre,próprio,o mesmo,não,ela,ela,ela \'ll,ela é,deveria,não deveria,assim,algum,tal,que,isso,é,o,seu,deles,eles,eles,então,há,estes,eles,eles,eles,eles ,eles são,eles,este,aqueles,através de,para,também,sob,até,até,uct,utc,muito,foi,não era,nós,nós,nós,nós,estamos ,nós, fomos, não fomos, o que, o que é, quando, quando, onde, onde, qual, enquanto, quem, quem é, quem, por que, por que, com, não, faria, não, você ,você, você, você, você, você, seu, seu, você mesmo, você mesmo',
  label_header_comments: 'Comentários',
  label_header_no_comments: 'Você tem algo a dizer?',
  label_comment: 'Adicione um comentário!',
  label_comment_modified: 'editado',
  label_updating_comment: 'atualizando...',
  label_removing_comment: 'removendo...',
  button_add_comment: 'adicionar comentário',
  button_update_comment: 'atualizar comentário',
  admin_title_index_administration: 'Gerenciar índices',
  admin_button_reindex_source: 'Reindexar',
  admin_info_reindex_indexing: 'Indexando...',
  admin_info_reindex_error: 'Ocorreu um erro durante a reindexação: {{ e }}',
  admin_info_reindex_successful: 'A reindexação foi iniciada com sucesso',
  admin_info_reindex_info_error: 'Ocorreu um erro ao ler o status da reindexação: {{ e }}',
  admin_label_reindex_path: 'Origem e caminho',
  admin_label_reindex_time: 'Tempo',
  admin_label_reindex_status: 'Status',
  admin_label_reindex_noResults: 'Nenhum resultado de reindexação encontrado',
  footer_credit: '<a style="text-decoration: none;" href="https://github.com/cobbzilla/yuebing">Desenvolvido por 🥮 Yuebing</a>',
  info_search_indexes_building: 'Essa mesma pesquisa pode retornar mais resultados no futuro. Alguns índices de pesquisa estão sendo reconstruídos: {{ indexes }}',
  info_search_no_results_unverified: 'Para ver os resultados da pesquisa, verifique sua conta usando o link enviado para {{ email }}',
  label_metadata: 'metadados de arquivo',
  label_mediainfo: 'arquivo mediainfo',
  label_add_tag: 'Adicionar etiqueta',
  label_adding_tag: 'adicionando etiqueta...',
  label_removing_tag: 'removendo etiqueta...',
  label_scan_ignoreErrors: 'Ignorar erros anteriores',
  label_scan_overwrite: 'Sobrescrever arquivos existentes',
  label_scan_reprocess: 'Reprocessar',
  label_scan_reprocess_profiles: 'Reprocessar esses perfis',
  label_path: 'Caminho',
  label_select_all: 'Selecionar tudo',
  locale_text_list_separator: ',',
  admin_title_source_browser: 'Procurar fontes',
  admin_title_reindex_status: 'Status de indexação',
  admin_button_browse_source: 'Navegar',
  admin_label_scan_config: 'Configurar verificação: {{ source }}',
  admin_label_scan_olderThan: 'Ignorar mídia que foi processada após uma data e hora específicas',
  admin_button_delete_path: 'Excluir',
  admin_button_rebuildSearchIndex: 'Reconstruir índice de pesquisa',
  admin_button_rebuildSearchIndex_warning: 'Isso reconstruirá os índices de pesquisa em todas as fontes e pode levar muito tempo',
  admin_info_path_delete: 'Excluindo caminho...',
  label_editor: 'Editor?',
  label_noCache: 'redefinir o cache?',
  label_previous_page: 'página anterior de resultados',
  label_next_page: 'próxima página de resultados',
  label_results_info: 'mostrando resultados {{ start }} a {{ end }} de {{ total }} total',
  label_playback_quality: 'Qualidade de reprodução',
  label_playback_quality_auto: 'automático',
  admin_label_privateConfig_redis_buildSearchIndexAtStartup: 'Crie índices de pesquisa na inicialização',
  locale_af: 'afrikaans',
  locale_sq: 'albanês',
  locale_am: 'amárico',
  locale_hy: 'armênio',
  locale_az: 'azerbaijano',
  locale_eu: 'basco',
  locale_be: 'bielorrusso',
  locale_bs: 'bósnio',
  locale_bg: 'búlgaro',
  locale_ca: 'catalão',
  locale_ceb: 'cebuano',
  locale_co: 'corso',
  locale_hr: 'croata',
  locale_cs: 'tcheco',
  locale_da: 'dinamarquês',
  locale_nl: 'Holandês',
  locale_eo: 'esperanto',
  locale_et: 'estoniano',
  locale_fi: 'finlandês',
  locale_fy: 'frísio',
  locale_gl: 'galego',
  locale_ka: 'georgiano',
  locale_el: 'grego',
  locale_gu: 'Gujarati',
  locale_ht: 'crioulo haitiano',
  locale_haw: 'havaiano',
  locale_he: 'hebraico',
  locale_hmn: 'Hmong',
  locale_hu: 'húngaro',
  locale_is: 'islandês',
  locale_ig: 'Igbo',
  locale_ga: 'irlandês',
  locale_jv: 'javanês',
  locale_kn: 'Kannada',
  locale_kk: 'cazaque',
  locale_km: 'Khmer',
  locale_rw: 'Kinyarwanda',
  locale_ku: 'curdo',
  locale_ky: 'Quirguistão',
  locale_lo: 'Laos',
  locale_la: 'latim',
  locale_lv: 'letão',
  locale_lt: 'lituano',
  locale_lb: 'luxemburguês',
  locale_mk: 'macedônio',
  locale_mg: 'malgaxe',
  locale_ms: 'malaio',
  locale_ml: 'malaiala',
  locale_mt: 'maltês',
  locale_mi: 'maori',
  locale_mn: 'mongol',
  locale_my: 'Mianmar (birmanês)',
  locale_ne: 'nepalês',
  locale_no: 'norueguês',
  locale_ny: 'Nianja (Chichewa)',
  locale_or: 'Odia (Oriya)',
  locale_ps: 'pashto',
  locale_fa: 'persa',
  locale_pa: 'punjabi',
  locale_ro: 'romena',
  locale_sm: 'samoano',
  locale_gd: 'gaélico escocês',
  locale_sr: 'sérvio',
  locale_st: 'Sesotho',
  locale_sn: 'Shona',
  locale_sd: 'sindi',
  locale_si: 'Sinhala (cingalês)',
  locale_sk: 'eslovaco',
  locale_sl: 'esloveno',
  locale_so: 'somali',
  locale_su: 'sundanês',
  locale_sv: 'sueco',
  locale_tg: 'tadjique',
  locale_ta: 'tâmil',
  locale_tt: 'tártaro',
  locale_te: 'Telugu',
  locale_th: 'tailandês',
  locale_tk: 'turcomano',
  locale_uk: 'ucraniano',
  locale_ug: 'Uigur',
  locale_uz: 'uzbeque',
  locale_cy: 'galês',
  locale_xh: 'Xhosa',
  locale_yi: 'iídiche',
  locale_yo: 'iorubá',
  locale_zu: 'zulu',
  label_mediainfo_audioLanguage: 'Idioma (áudio)',
  label_mediainfo_videoLanguage: 'Idioma (vídeo)',
  label_mediainfo_textTrackLanguages: 'Idiomas (Legendas)',
  label_mediainfo_videoTrackCount: 'Faixas de vídeo',
  label_mediainfo_audioTrackCount: 'Faixas de áudio',
  label_mediainfo_textTrackCount: 'Faixas de texto'
}
