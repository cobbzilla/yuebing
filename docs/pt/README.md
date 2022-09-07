Yuebing 🥮
 ==========
 Yuebing é um software de código aberto para executar sites de hospedagem de vídeo.

 Ele transcodifica automaticamente seus vídeos de origem em formatos de streaming modernos, reproduzíveis em qualquer
 dispositivo em qualquer conexão.

 O Yuebing pode usar o Amazon S3 ou o Backblaze B2 para armazenamento de back-end e possui muitos recursos avançados.

 ### Fonte
 * [yuebing no GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing on npm](https://www.npmjs.com/package/yuebing)
 * [yuebing no DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Conteúdo
 * [Inspiração](#Inspiração)
 * [Recursos](#Recursos)
 * [Instalação](#Instalação)
 * [Docker](#Docker)
 * [pacote npm](#npm-package)
 * [Da fonte](#From-source)
 * [Configuração](#Configuração)
 * [nginx config](#nginx-config)
 * [Por que o nome yuebing?](#Por-que-o-nome-yuebing?)

 ## Inspiração
 No ano passado, minha mãe gastou muito tempo (e dinheiro!) para organizar e digitalizar um arquivo de vídeos antigos de família.
 Alguns destes eram bastante antigos, remontando à década de 1950. Muito lindo, material clássico.

 Queríamos compartilhá-los em particular com a família, mas *não com a grande tecnologia*.
 Ir com hospedagem de vídeo "gratuita" de um grande provedor estava fora de questão.

 O que estávamos procurando:
 * Auto-hospedado, mas totalmente **simplesmente fácil** de executar e manter
 * Streams em formatos de vídeo modernos, incluindo taxa de bits adaptável
 * Os vídeos são reproduzidos em qualquer dispositivo, desktop ou celular
 * Com uma conexão de alta largura de banda, a qualidade do vídeo é incrível; O melhor que pode ser
 * **Mesmo com uma conexão ruim**, a reprodução tem qualidade decente e *não pula ou armazena em buffer*
 * Armazenamento criptografado, portanto, capaz de usar soluções de armazenamento em nuvem pública com alguma confiança
 * Servidor sem estado: persista qualquer coisa importante para armazenamento que seja altamente resiliente
 * **Não quero me preocupar com backups!**
 * *Este foi um bom ter. Acontece que nada lá fora tem algo assim. Yuebing sim!*
 * Depois de executar uma instância robusta para transcodificar tudo, destrua-a e execute algo mais barato a longo prazo
 * Você pode executar o Yuebing por menos de US$ 10/mês; e esperamos ainda menos no futuro, pois otimizamos a pegada da Yuebing

 Levei algumas semanas para pesquisar o que estava lá fora. Comecei a relaxar bastante minhas exigências, e ainda
 poderia encontrar nada decente. Eu olhei para vários projetos de código aberto, não estou dizendo quais porque todos eles tinham
 múltiplas falhas gritantes.

 Então, eu decidi, quão difícil poderia ser? Você conecta o S3 ao ffmpeg, coloca um frontend decentemente moderno nele e pronto,
 certo?

 .... uh, OK, estou cerca de um mês neste momento, mas é muito divertido! Espero que você goste também!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Vamos tornar os sites de vídeo auto-hospedados super fáceis!**</a>

 ## Características
 * Transforme um bucket S3 com vídeos em um site de vídeo privado para amigos e familiares!
 * Conecte um ou mais buckets de origem fornecendo arquivos de mídia brutos
 * O Yuebing transcodifica automaticamente os vídeos de origem para o formato mais recente e mais amplamente suportado para streaming de taxa de bits adaptável (DASH/mp4)
 * TODOS os dados são armazenados no bucket de destino, então você pode destruir o container e trazê-lo mais tarde
 * Útil para executar inicialmente em uma instância otimizada para CPU para a transformação inicial e, em seguida, execute \
    on a much cheaper instance for 24/7/365 service.
 * Suporta armazenamento totalmente criptografado (criptografia do lado do aplicativo, somente você tem a chave)
 * Sempre somente leitura da fonte, nunca altere o conteúdo da fonte
 * Verificação automática e manual de novos arquivos de mídia
 * Quão privado ou público você quer as coisas? Yuebing suporta:
 * Totalmente privado: nenhuma mídia é exibida para usuários anônimos, apenas endereços de e-mail aprovados podem criar contas
 * Semi-privado: nenhuma mídia é exibida para usuários anônimos, mas qualquer pessoa pode criar uma conta de usuário
 * Público com registro limitado: mídia exibida para todos, mas apenas endereços de e-mail aprovados podem criar contas
 * Totalmente público: mídia exibida para todos, e qualquer pessoa pode criar uma conta de usuário
 * Totalmente internacionalizado! Todo o texto visível ao usuário (e outras coisas específicas de localidade) vem de recursos localizados
 * [Ajude a comunidade, traduza o Yuebing para novos idiomas!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Console de administração completo
 * **Uma coisa que eu admito ainda é uma merda:**
 * A "experiência de descoberta" consiste em *navegar em uma hierarquia de diretórios*. Isso é **super coxo**, mas tínhamos que começar de algum lugar.
 * Adicionaremos suporte para pesquisa, marcação, sugestões, etc.
 * OK, na verdade tem muita coisa que ainda é uma porcaria, e isso é software totalmente 1.0, mas o material que funciona é bem legal
 * <a href="https://www.patreon.com/cobbzilla">**Em breve com seu apoio**</a> :
 * Suporte para mais tipos de mídia (áudio, imagens, etc)
 * Mídia carregada pelo usuário
 * Novo "tipo de fonte": Outra instância Yuebing!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Recurso de usuário anônimo (se o site foi configurado para permitir visitantes anônimos)
 * Navegue pela mídia
 * Assista mídia!
 * Criar conta (caso o site tenha sido configurado para permitir o registro de conta)

 ## Recursos do usuário conectado
 * Navegue pela mídia
 * Assista mídia!
 * Adicione um comentário, edite seu comentário, exclua seu comentário!
 * Curta mídia (em breve!)
 * Convide amigos
 * Defina o idioma para inglês ou francês (adicione mais traduções!)
 * Editar informações da conta
 * Excluir conta, exclui tudo o que é seu, incluindo todos os seus comentários

 ## Recursos do usuário administrador
 * Edite metadados de mídia, visualize miniaturas, altere a miniatura selecionada
 * Veja a fila de transformação de mídia e o status do trabalho
 * Inicie novas varreduras e índices de mídia de origem

 ## Recursos de servidor/backend
 * Dados persistentes/importantes ZERO amigáveis a transitórios são armazenados dentro do contêiner.
 * Todos os dados duráveis são mantidos no bucket de destino; essencialmente, usamos o S3 como nosso banco de dados
 * Verificação periódica automática do bucket de origem para novas mídias
 * Adicionar e alterar metadados de mídia; as edições são armazenadas no bucket de destino, a mídia de origem nunca é modificada
 * Perfis de saída configuráveis. O padrão é DASH-mp4 com quatro perfis, suportando níveis de qualidade de melhor que HD a largura de banda super baixa
 * As informações da conta do usuário também são armazenadas no bucket de destino, opcionalmente criptografadas
 * Se a chave de criptografia for alterada, o administrador poderá migrar os usuários para a nova chave com o console de administração da web

 ## Instalação
 Você pode instalar e executar `yuebing` via docker, npm ou diretamente da fonte.

 ### Docker
 Se você tiver o docker, poderá começar a usar o Yuebing rapidamente:

    docker run -it cobbzilla/yuebing

 ### pacote npm
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### Da fonte
 Para executar a partir da fonte, você precisará do nodejs v16+ e yarn

    # Clone source and install dependencies
    git clone https://github.com/cobbzilla/yuebing.git
    cd yuebing
    yarn install

    # Use the 'yuebing' command from the git repo
    ./yuebing

    # Or, since you have the source, run any of the yarn scripts
    yarn docker-run-dev # Fastest build & startup, dev docker image
    yarn docker-run # Faster at runtime, production docker image

 Consulte os [documentos do desenvolvedor](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) para obter mais informações

 ## Configuração
 Para brincar com o Yuebing, não há problema em iniciá-lo sem configurar nada.
 Execute `yuebing` e você será solicitado a inserir a configuração mínima quando iniciar.

 Se você planeja executar o Yuebing por um tempo, consulte os [documentos de configuração](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) para
 mais informações sobre como configurar as coisas.

 ### configuração do nginx
 Yuebing é apenas um aplicativo Nuxt e espera que você coloque nginx (ou algum outro servidor web) em
 frente dele para lidar com SSL, limitação de taxa, se necessário, etc.

 Se você estiver usando o nginx, aqui está uma [configuração de amostra](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) que você pode usar.

 ## Por que o nome yuebing?
 [Oolong o coelho](https://en.wikipedia.org/wiki/Oolong_(rabbit)) era um adorável e famoso
 [primeiro meme da internet](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong morreu em 2003,
 dois anos antes de um certo serviço de vídeo massivamente popular existir!

 O sucessor de Oolong foi nomeado Yuebing. Yuebing não era tão famoso quanto Oolong, mas isso importava?
 Yuebing conseguiu, no entanto.

 Talvez mais interessante, yubing significa [mooncake](https://en.wikipedia.org/wiki/Mooncake)
 (chinês: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Japonês: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); mooncakes são muito saborosos e podem ser encontrados em
 uma grande variedade de sabores e estilos. Desfrute de um estilo regional consagrado pelo tempo ou experimente um bolo exótico de
 padeiros que estão explorando um território deliciosamente inexplorado! Há realmente um yuebing para todos!

</pre>
