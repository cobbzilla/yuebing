Yuebing 🥮
 ==========
 Yuebing es un software de código abierto para ejecutar sitios de alojamiento de videos.

 Yuebing prepara automáticamente sus videos de origen para la transmisión utilizando formatos modernos, reproducibles en cualquier
 dispositivo a través de cualquier conexión.

 Yuebing puede usar Amazon S3 o Backblaze B2 para el almacenamiento de back-end y tiene muchas características avanzadas.

 ### Fuente
 * [yuebing en GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing en npm](https://www.npmjs.com/package/yuebing)
 * [yuebing en DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Leer esto en otro idioma
 Este documento README.md ha sido traducido, a través de [hokeylization](https://github.com/cobbzilla/hokeylization), a
 muchos lenguajes.

 Estoy seguro de que no es perfecto, ¡pero espero que sea mejor que nada!

 [🇸🇦 Árabe](../ar/README.md)
 [🇧🇩 bengalí](../bn/README.md)
 [🇩🇪 Alemán](../de/README.md)
 [🇺🇸 Español](../es/README.md)
 [🇪🇸 Español](../es/README.md)
 [🇫🇷 Francés](../fr/README.md)
 [🇹🇩 Hausa](../ha/README.md)
 [🇮🇳 hindi](../hi/README.md)
 [🇮🇩 Indonesio](../id/README.md)
 [🇮🇹 Italiano](../it/README.md)
 [🇯🇵 Japonés](../ja/README.md)
 [🇰🇷 Coreano](../ko/README.md)
 [🇮🇳 Marathi](../mr/README.md)
 [🇵🇱 Polaco](../pl/README.md)
 [🇧🇷 Portugués](../pt/README.md)
 [🇷🇺 Ruso](../ru/README.md)
 [🇰🇪 Suajili](../sw/README.md)
 [🇵🇭 Tagalo](../tl/README.md)
 [🇹🇷 Turco](../tr/README.md)
 [🇵🇰 Urdu](../ur/README.md)
 [🇻🇳 Vietnamita](../vi/README.md)
 [🇨🇳 Chino](../zh/README.md)
 ----

 # Contenidos
 * [Inspiración](#Inspiración)
 * [Funciones funciones)
 * [Instalación](#Instalación)
 * [Docker](#Docker)
 * [paquete npm](#paquete npm)
 * [De la fuente](#De-la-fuente)
 * [Configuración](#Configuración)
 * [configuración nginx](#nginx-config)
 * [¿Por qué el nombre yuebing?](#¿Por qué-el-nombre-yuebing?)

 ## Inspiración
 El año pasado, mi madre dedicó mucho tiempo (¡y dinero!) a organizar y digitalizar un archivo de viejos videos familiares.
 Algunos de estos eran bastante antiguos, remontándose a la década de 1940. Cosas realmente hermosas, clásicas.

 Queríamos compartir esto en privado con la familia, pero *no con la gran tecnología*.
 Ir con alojamiento de video "gratuito" de un proveedor importante estaba fuera de la mesa.

 Lo que estábamos buscando:
 * Autohospedado, pero totalmente **sin intervención** de ejecutar y mantener
 * Transmisiones en formatos de video modernos, incluida la tasa de bits adaptable
 * Los videos se reproducen en cualquier dispositivo, computadora de escritorio o móvil
 * Con una conexión de gran ancho de banda, la calidad del video es increíble; Mejor imposible
 * **Incluso con una mala conexión**, la reproducción es de calidad decente y *no salta ni almacena en búfer*
 * Almacenamiento encriptado, por lo que puede usar soluciones de almacenamiento en la nube pública con cierta confianza
 * Servidor sin estado: persiste cualquier cosa importante para el almacenamiento que sea altamente resistente
 * ** ¡No quiero preocuparme por las copias de seguridad! **
 * * Fue agradable tenerlo. Resulta que nada por ahí tiene algo como esto. Yuebing lo hace!*
 * Después de ejecutar una instancia robusta para transcodificar todo, desmóntela y ejecute algo más económico a largo plazo
 * Puedes ejecutar Yuebing por menos de $10/mes; y, con suerte, aún menos en el futuro a medida que optimizamos la huella de Yuebing

 Me tomé un par de semanas para examinar lo que había por ahí. Empecé a relajar mucho mis requisitos, y todavía
 No pude encontrar nada decente. Observé varios proyectos de código abierto, no digo cuáles porque todos tenían
 múltiples defectos evidentes.

 Entonces, decidí, ¿qué tan difícil podría ser? Conectas S3 a ffmpeg, le pones una interfaz decentemente moderna y listo, ¿verdad?
 ... bueno, la mayor parte del trabajo tomó un par de meses, ¡pero fue demasiado divertido para detenerlo!
 ¡Espero que tú también lo disfrutes!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**¡Hagamos que los sitios de videos con alojamiento propio sean súper fáciles!**</a>

 ## Características
 * ¡Transforme un cubo de videos S3 (o B2) en un sitio de videos privado para amigos y familiares!
 * Conecte uno o más cubos de origen que proporcionen archivos de medios sin procesar
 * Yuebing transcodifica automáticamente los videos de origen al formato más reciente y más compatible para la transmisión de tasa de bits adaptativa (DASH/mp4)
 * TODOS los datos se almacenan en el cubo de destino; puedes destruir el servidor cuando quieras
 * Útil para ejecutar inicialmente en una instancia optimizada para CPU para la transcodificación inicial, luego ejecutar \
    on a much cheaper instance for 24/7/365 service.
 * Admite almacenamiento completamente encriptado (cifrado del lado de la aplicación, solo usted tiene la clave)
 * Siempre de solo lectura desde la fuente, nunca cambie el contenido de la fuente
 * Escaneo automático y manual de nuevos archivos multimedia
 * ¿Qué tan privadas o públicas quieres las cosas? Yuebing admite:
 * Totalmente privado: no se muestran medios a usuarios anónimos, solo las direcciones de correo electrónico aprobadas pueden crear cuentas
 * Semiprivado: no se muestran medios a usuarios anónimos, pero cualquiera puede crear una cuenta de usuario
 * Público con registro limitado: los medios se muestran a todos, pero solo las direcciones de correo electrónico aprobadas pueden crear cuentas
 * Totalmente público: los medios se muestran a todos y cualquiera puede crear una cuenta de usuario
 * Totalmente internacionalizado! Todo el texto visible para el usuario (y otras cosas específicas de la configuración regional) proviene de recursos localizados
 * [¡Ayuda a la comunidad, traduce Yuebing a nuevos idiomas!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Consola de administración con todas las funciones
 * Buscar videos por palabras clave o desde la nube de etiquetas
 * <a href="https://www.patreon.com/cobbzilla">**Próximamente con su apoyo**</a> :
 * Soporte para más tipos de medios (audio, imágenes, etc.)
 * Medios subidos por el usuario
 * Me gusta, acciones y notificaciones push
 * Nuevo "tipo de fuente": ¡Otra instancia de Yuebing!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Función de usuario anónimo (si el sitio se ha configurado para permitir visitantes anónimos)
 * Explorar medios
 * ¡Mira los medios!
 * Crear cuenta (si el sitio ha sido configurado para permitir el registro de cuentas)

 ## Funciones de usuario registrado
 * Explorar medios
 * ¡Mira los medios!
 * ¡Agregue un comentario, edite su comentario, elimine su comentario!
 * Invitar a amigos
 * Editar información de la cuenta
 * Eliminar cuenta, elimina todo lo que es tuyo, incluidos todos tus comentarios.

 ## Características del usuario administrador
 * Editar metadatos de medios, ver miniaturas, cambiar la miniatura seleccionada
 * Ver la cola de transformación de medios y el estado del trabajo
 * Iniciar nuevos escaneos e índices de los medios de origen

 ## Funciones de servidor/backend
 * Los datos CERO persistentes/importantes aptos para transitorios se almacenan dentro del contenedor.
 * Todos los datos duraderos se conservan en el depósito de destino; esencialmente, usamos S3 como nuestra base de datos
 * Escaneo periódico automático del cubo de origen para nuevos medios
 * Agregar y cambiar metadatos de medios; las ediciones se almacenan en el depósito de destino, los medios de origen nunca se modifican
 * Perfiles de salida configurables. El valor predeterminado es DASH-mp4 con múltiples subperfiles
 * La información de la cuenta de usuario también se almacena en el depósito de destino, opcionalmente encriptada
 * Si se cambia la clave de cifrado, el administrador puede migrar a los usuarios a la nueva clave con la consola de administración web

 ## Instalación
 Puede instalar y ejecutar `yuebing` a través de docker, npm o directamente desde la fuente.

 ### ventana acoplable
 Si tiene Docker, puede comenzar a usar Yuebing rápidamente:

    docker run -it cobbzilla/yuebing

 Paquete ### npm
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### Desde la fuente
 Para ejecutar desde la fuente, necesitará nodejs v16+ e yarn

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

 Consulte los [documentos del desarrollador](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) para obtener más información.

 ## Configuración
 Para jugar con Yuebing, está bien iniciarlo sin configurar nada.
 Ejecute `yuebing` y se le pedirá que ingrese la configuración mínima cuando se inicie.

 Si planea ejecutar Yuebing por un tiempo, consulte los [documentos de configuración](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) para
 más información sobre cómo configurar las cosas.

 ### configuración nginx
 Yuebing es una aplicación de Nuxt y espera que coloque nginx (o algún otro servidor web) en
 frente a él para manejar SSL, limitación de velocidad si es necesario, etc.

 Si usa nginx, aquí hay una [configuración de muestra](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) que puede usar.

 ## ¿Por qué el nombre yuebing?
 [El conejo Oolong](https://en.wikipedia.org/wiki/Oolong_(rabbit)) era un adorable y famoso
 [meme temprano de Internet](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong murió en 2003,
 ¡dos años antes de que existiera cierto servicio de video masivamente popular!

 El sucesor de Oolong se llamaba Yuebing. Yuebing no era tan famoso como Oolong, pero ¿importaba eso?
 Sin embargo, Yuebing tuvo éxito.

 Quizás lo más interesante es que yuebing significa [pastel de luna](https://en.wikipedia.org/wiki/Mooncake)
 (Chino: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Japonés: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); los pasteles de luna son muy sabrosos y se pueden encontrar en
 una gran variedad de sabores y estilos. Disfrute de un estilo regional tradicional o pruebe un pastel exótico de la cocina contemporánea.
 ¡Panaderos que están explorando un territorio deliciosamente desconocido! ¡Realmente hay un yuebing para todos!

</pre>
