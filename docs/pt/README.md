Yuebing 🥮
 ==========
 Yuebing é um software de código aberto para executar sites de hospedagem de vídeo.

 Yuebing prepara automaticamente seus vídeos de origem para streaming usando formatos modernos, reproduzíveis em qualquer
 dispositivo em qualquer conexão.

 Yuebing pode usar Amazon S3 ou Backblaze B2 para armazenamento de back-end e possui muitos recursos avançados.

 ### Fonte
 * [yuebing no GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing no npm](https://www.npmjs.com/package/yuebing)
 * [yuebing no DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Leia isso em outro idioma
 Este documento README.md foi traduzido, via [hokeylization](https://github.com/cobbzilla/hokeylization), para
 muitos idiomas.

 Tenho certeza de que não é perfeito, mas espero que seja melhor do que nada!

 [🇸🇦 Árabe](../ar/README.md)
 [🇧🇩 Bengali](../bn/README.md)
 [🇩🇪 Alemão](../de/README.md)
 [🇧🇷 Português](../en/README.md)
 [🇪🇸 Espanhol](../es/README.md)
 [🇫🇷 Francês](../fr/README.md)
 [🇹🇩 Hausa](../ha/README.md)
 [🇮🇳 Hindi](../hi/README.md)
 [🇮🇩 indonésio](../id/README.md)
 [🇮🇹 Italiano](../it/README.md)
 [🇯🇵 Japonês](../ja/README.md)
 [🇰🇷 Coreano](../ko/README.md)
 [🇮🇳 Marathi](../mr/README.md)
 [🇵🇱 Polonês](../pl/README.md)
 [🇧🇷 Português](../pt/README.md)
 [🇷🇺 Russo](../ru/README.md)
 [🇰🇪 Swahili](../sw/README.md)
 [🇵🇭 Tagalo](../tl/README.md)
 [🇹🇷 Turco](../tr/README.md)
 [🇵🇰 Urdu](../ur/README.md)
 [🇻🇳 Vietnamita](../vi/README.md)
 [🇨🇳 chinês](../zh/README.md)
 ----

 # Conteúdo
 * [Inspiração](#Inspiração)
 * [Recursos](#Recursos)
 * [Instalação](#Instalação)
 * [Docker](#Docker)
 * [pacote npm](#pacote npm)
 * [Da fonte](#Da fonte)
 * [Configuração](#Configuração)
 * [nginx config](#nginx-config)
 * [Por que o nome yuebing?](#Por que o nome-yuebing?)

 ## Inspiração
 No ano passado, minha mãe gastou muito tempo (e dinheiro!) Para organizar e digitalizar um arquivo de vídeos antigos de família.
 Alguns deles eram bastante antigos, remontando à década de 1940. Coisas clássicas realmente lindas.

 Queríamos compartilhá-los em particular com a família, mas *não com grandes tecnologias*.
 Escolher a hospedagem de vídeo "gratuita" de um grande provedor estava fora de questão.

 O que estávamos procurando:
 * Auto-hospedado, mas totalmente **fácil de executar e manter**
 * Streams em formatos de vídeo modernos, incluindo taxa de bits adaptável
 * Os vídeos são reproduzidos em qualquer dispositivo, desktop ou celular
 * Com uma conexão de alta largura de banda, a qualidade do vídeo é incrível; O melhor que pode ser
 * **Mesmo com uma conexão ruim**, a reprodução é de qualidade decente e *não pula ou armazena em buffer*
 * Armazenamento criptografado, portanto, capaz de usar soluções de armazenamento em nuvem pública com alguma confiança
 * Servidor sem estado: persista qualquer coisa importante no armazenamento que seja altamente resiliente
 * **Não quero me preocupar com backups!**
 * *Foi bom ter isso. Acontece que nada lá fora tem algo assim. Yuebing sim!*
 * Depois de executar uma instância robusta para transcodificar tudo, destrua-a e execute algo mais barato a longo prazo
 * Você pode executar o Yuebing por menos de $ 10/mês; e esperamos que ainda menos no futuro, pois otimizamos a pegada de Yuebing

 Levei algumas semanas para pesquisar o que havia lá fora. Comecei a relaxar bastante minhas exigências e ainda
 poderia encontrar nada decente. Pesquisei vários projetos de código aberto, não vou dizer quais porque todos tinham
 múltiplas falhas gritantes.

 Então, eu decidi, quão difícil poderia ser? Você conecta o S3 ao ffmpeg, coloca um front-end decentemente moderno nele e pronto, certo?
 ... bem, a maior parte do trabalho levou alguns meses, mas foi divertido demais para parar!
 Espero que gostem também!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Vamos tornar os sites de vídeo auto-hospedados superfáceis!**</a>

 ## Características
 * Transforme um balde de vídeos S3 (ou B2) em um site de vídeo privado para amigos e familiares!
 * Conecte um ou mais baldes de origem fornecendo arquivos de mídia brutos
 * Yuebing transcodifica automaticamente os vídeos de origem para o formato mais recente e amplamente suportado para streaming de taxa de bits adaptável (DASH/mp4)
 * TODOS os dados são armazenados no balde de destino; você pode destruir o servidor sempre que quiser
 * Útil para execução inicial em uma instância otimizada para CPU para a transcodificação inicial e, em seguida, execute \
    on a much cheaper instance for 24/7/365 service.
 * Suporta armazenamento totalmente criptografado (criptografia do lado do aplicativo, somente você tem a chave)
 * Sempre somente leitura da fonte, nunca altere o conteúdo da fonte
 * Verificação automática e manual de novos arquivos de mídia
 * Quão privado ou público você quer as coisas? Yuebing suporta:
 * Totalmente privado: nenhuma mídia é exibida para usuários anônimos, apenas endereços de e-mail aprovados podem criar contas
 * Semiprivado: nenhuma mídia exibida para usuários anônimos, mas qualquer um pode criar uma conta de usuário
 * Público com registro limitado: mídia exibida para todos, mas apenas endereços de e-mail aprovados podem criar contas
 * Totalmente público: mídia mostrada para todos, e qualquer um pode criar uma conta de usuário
 * Totalmente internacionalizado! Todo o texto visível ao usuário (e outras coisas específicas da localidade) vem de recursos localizados
 * [Ajude a comunidade, traduza Yuebing para novos idiomas!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Console de administração completo
 * Pesquise vídeos por palavras-chave ou na nuvem de tags
 * <a href="https://www.patreon.com/cobbzilla">**Em breve com o seu apoio**</a> :
 * Suporte para mais tipos de mídia (áudio, imagens, etc)
 * Mídia carregada pelo usuário
 * Curtidas, compartilhamentos e notificações push
 * Novo "tipo de fonte": Outra instância do Yuebing!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Recurso de usuário anônimo (caso o site tenha sido configurado para permitir visitantes anônimos)
 * Navegar na mídia
 *Assista a mídia!
 * Criar conta (caso o site tenha sido configurado para permitir cadastro de conta)

 ## Recursos do usuário logado
 * Navegar na mídia
 *Assista a mídia!
 * Adicione um comentário, edite seu comentário, exclua seu comentário!
 * Convide amigos
 * Editar informações da conta
 * Excluir conta, exclui tudo o que é seu, incluindo todos os seus comentários

 ## Recursos do usuário administrador
 * Edite metadados de mídia, visualize miniaturas, altere a miniatura selecionada
 * Veja a fila de transformação de mídia e o status do trabalho
 * Iniciar novas varreduras e índices de mídia de origem

 ## Recursos de servidor/back-end
 * Dados persistentes/importantes ZERO amigáveis a transientes são armazenados dentro do contêiner.
 * Todos os dados duráveis são mantidos no balde de destino; essencialmente, usamos o S3 como nosso banco de dados
 * Varredura periódica automática do balde de origem para novas mídias
 * Adicionar e alterar metadados de mídia; as edições são armazenadas no bucket de destino, a mídia de origem nunca é modificada
 * Perfis de saída configuráveis. O padrão é DASH-mp4 com vários subperfis
 * As informações da conta do usuário também são armazenadas no bucket de destino, opcionalmente criptografadas
 * Se a chave de criptografia for alterada, o administrador pode migrar os usuários para a nova chave com o console de administração da web

 ## Instalação
 Você pode instalar e executar `yuebing` via docker, npm ou diretamente da fonte.

 ### Docker
 Se você possui o docker, pode começar a usar o Yuebing rapidamente:

    docker run -it cobbzilla/yuebing

 ### pacote npm
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### Da fonte
 Para executar a partir da fonte, você precisará do nodejs v16+ e do yarn

    # Clone source and install dependencies
    git clone https://github.com/cobbzilla/yuebing.git
    cd yuebing
    yarn install

    # Use the 'yuebing' command from the git repo
    ./yuebing

    # Or, since you have the source, run any of the `yarn` scripts
    yarn docker-run-dev # Fastest build & startup, dev docker image
    yarn docker-run # Faster at runtime, production docker image
    yarn dev # Run yuebing locally in dev mode
    yarn build # Build yuebing locally for production mode
    yarn start # Start yuebing locally in production mode

 Consulte os [documentos do desenvolvedor](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) para obter mais informações

 ## Configuração
 Para brincar com o Yuebing, tudo bem iniciá-lo sem configurar nada.
 Execute `yuebing` e você será solicitado a inserir a configuração mínima quando iniciar.

 Se você planeja executar o Yuebing por um tempo, consulte os [documentos de configuração](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) para
 mais informações sobre como configurar as coisas.

 ### configuração nginx
 Yuebing é um aplicativo Nuxt e espera que você coloque nginx (ou algum outro servidor web) em
 frente dele para lidar com SSL, limitação de taxa, se necessário, etc.

 Se você estiver usando nginx, aqui está um [exemplo de configuração](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) que você pode usar.

 ## Por que o nome yuebing?
 [Oolong o coelho](https://en.wikipedia.org/wiki/Oolong_(coelho)) era um adorável e famoso
 [primeiro meme da internet](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong morreu em 2003,
 dois anos antes de um determinado serviço de vídeo extremamente popular existir!

 O sucessor de Oolong foi nomeado Yuebing. Yuebing não era tão famoso quanto Oolong, mas isso importava?
 Yuebing conseguiu, no entanto.

 Talvez mais interessante, yuebing significa [mooncake](https://en.wikipedia.org/wiki/Mooncake)
 (Chinês: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Japonês: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); mooncakes são muito saborosos e podem ser encontrados em
 uma grande variedade de sabores e estilos. Desfrute de um estilo regional consagrado pelo tempo ou experimente um bolo exótico de
 padeiros que estão explorando um território deliciosamente desconhecido! Há verdadeiramente um yuebing para todos!

</pre>
