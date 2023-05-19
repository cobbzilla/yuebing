Yuebing 🥮
 ==========
 Yuebing adalah perangkat lunak sumber terbuka untuk menjalankan situs hosting video.

 Yuebing secara otomatis menyiapkan video sumber Anda untuk streaming menggunakan format modern, dapat diputar di mana saja
 perangkat melalui koneksi apa pun.

 Yuebing dapat menggunakan Amazon S3 atau Backblaze B2 untuk penyimpanan backend, dan memiliki banyak fitur lanjutan.

 ### Sumber
 * [yuebing di GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing di npm](https://www.npmjs.com/package/yuebing)
 * [yuebing di DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Baca ini dalam bahasa lain
 Dokumen README.md ini telah diterjemahkan, melalui [hokeylization](https://github.com/cobbzilla/hokeylization), menjadi
 banyak bahasa.

 Saya yakin itu tidak sempurna, tapi saya harap ini lebih baik daripada tidak sama sekali!

 [🇸🇦 Bahasa Arab](../ar/README.md)
 [🇧🇩 Bengali](../bn/README.md)
 [🇩🇪 Jerman](../de/README.md)
 [🇺🇸 English](../id/README.md)
 [🇪🇸 Spanyol](../es/README.md)
 [🇫🇷 Prancis](../fr/README.md)
 [🇹🇩 Hausa](../ha/README.md)
 [🇮🇳 Hindi](../hi/README.md)
 [🇮🇩 Bahasa Indonesia](../id/README.md)
 [🇮🇹 Italia](../it/README.md)
 [🇯🇵 Bahasa Jepang](../ja/README.md)
 [🇰🇷 Korea](../ko/README.md)
 [🇮🇳 Marathi](../mr/README.md)
 [🇵🇱 Polandia](../pl/README.md)
 [🇧🇷 Portugis](../pt/README.md)
 [🇷🇺 Rusia](../ru/README.md)
 [🇰🇪 Swahili](../sw/README.md)
 [🇵🇭 Tagalog](../tl/README.md)
 [🇹🇷 Turki](../tr/README.md)
 [🇵🇰 Urdu](../ur/README.md)
 [🇻🇳 Vietnam](../vi/README.md)
 [🇨🇳 Mandarin](../zh/README.md)
 ----

 # Isi
 * [Inspirasi](#Inspirasi)
 * [Fitur](#Fitur)
 * [Instalasi](#Instalasi)
 * [Docker](#Docker)
 * [paket npm](#paket-npm)
 * [Dari sumber](#Dari-sumber)
 * [Konfigurasi](#Konfigurasi)
 * [konfigurasi nginx](#nginx-config)
 * [Kenapa namanya yuebing?](#Kenapa-nama-yuebing?)

 ## Inspirasi
 Tahun lalu ibu saya menghabiskan banyak waktu (dan uang!) untuk mengatur dan mendigitalkan arsip video keluarga lama.
 Beberapa di antaranya cukup tua, kembali ke tahun 1940-an. Sangat indah, barang klasik.

 Kami ingin membagikannya secara pribadi dengan keluarga, tetapi *tidak dengan teknologi besar*.
 Pergi dengan hosting video "gratis" dari penyedia utama tidak masuk akal.

 Apa yang kami cari:
 * Dihosting sendiri, tetapi benar-benar **mudah lepas tangan** untuk dijalankan dan dipelihara
 * Streaming dalam format video modern, termasuk kecepatan bit adaptif
 * Video diputar di perangkat apa pun, desktop, atau seluler
 * Dengan koneksi bandwidth tinggi, kualitas video luar biasa; sebaik yang didapat
 * **Bahkan dengan koneksi yang buruk**, pemutaran berkualitas baik dan *tidak melewatkan atau buffer*
 * Penyimpanan terenkripsi, sehingga dapat menggunakan solusi penyimpanan cloud publik dengan percaya diri
 * Server tanpa negara: menyimpan apa pun yang penting untuk penyimpanan yang sangat tangguh
 * **Saya tidak ingin khawatir tentang backup!**
 * * Ini bagus untuk dimiliki. Ternyata tidak ada yang seperti ini. Yuebing melakukannya!*
 * Setelah menjalankan instance yang kuat untuk mentranskode semuanya, hancurkan dan jalankan sesuatu yang lebih murah untuk jangka panjang
 * Anda dapat menjalankan Yuebing di bawah $10/bulan; dan mudah-mudahan lebih sedikit lagi di jalan karena kami mengoptimalkan jejak Yuebing

 Saya mengambil beberapa minggu untuk mensurvei apa yang ada di luar sana. Saya mulai sangat melonggarkan persyaratan saya, dan tetap saja
 tidak dapat menemukan apa pun yang layak. Saya melihat beberapa proyek open source, saya tidak mengatakan yang mana karena semuanya punya
 beberapa cacat mencolok.

 Jadi, saya memutuskan, seberapa sulitkah itu? Anda menyambungkan S3 ke ffmpeg, memasang frontend yang cukup modern, dan selesai, bukan?
 ... yah, uh, sebagian besar pekerjaan memakan waktu beberapa bulan, tapi terlalu menyenangkan untuk dihentikan!
 Saya harap Anda juga menikmatinya!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Mari jadikan situs video self-hosting menjadi sangat mudah!**</a>

 ## Fitur
 * Ubah sekumpulan video S3 (atau B2) menjadi situs video pribadi untuk teman dan keluarga!
 * Hubungkan satu atau lebih ember sumber yang menyediakan file media mentah
 * Yuebing secara otomatis mentranskode video sumber ke format terbaru dan paling banyak didukung untuk streaming kecepatan bit adaptif (DASH/mp4)
 * SEMUA data disimpan di bucket tujuan; Anda dapat menghancurkan server kapan pun Anda mau
 * Berguna untuk menjalankan awalnya pada instans yang dioptimalkan CPU untuk transcoding awal, lalu jalankan \
    on a much cheaper instance for 24/7/365 service.
 * Mendukung penyimpanan terenkripsi sepenuhnya (enkripsi sisi aplikasi, hanya Anda yang memiliki kuncinya)
 * Selalu baca-saja dari sumber, jangan pernah mengubah konten sumber
 * Pemindaian otomatis dan manual untuk file media baru
 * Seberapa pribadi atau publik yang Anda inginkan? Yuebing mendukung:
 * Sepenuhnya pribadi: tidak ada media yang ditampilkan kepada pengguna anonim, hanya alamat email yang disetujui yang dapat membuat akun
 * Semi-pribadi: tidak ada media yang ditampilkan kepada pengguna anonim, tetapi siapa pun dapat membuat akun pengguna
 * Publik dengan pendaftaran terbatas: media diperlihatkan kepada semua orang, tetapi hanya alamat email yang disetujui yang dapat membuat akun
 * Benar-benar publik: media diperlihatkan kepada semua orang, dan siapa saja dapat membuat akun pengguna
 * Sepenuhnya internasional! Semua teks yang terlihat oleh pengguna (dan hal-hal khusus lokal lainnya) berasal dari sumber daya yang dilokalkan
 * [Bantu komunitas, terjemahkan Yuebing ke bahasa baru!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Konsol admin berfitur lengkap
 * Cari video berdasarkan kata kunci, atau dari tag cloud
 * <a href="https://www.patreon.com/cobbzilla">**Segera hadir dengan dukungan Anda**</a> :
 * Dukungan untuk lebih banyak jenis media (audio, gambar, dll)
 * Media yang diunggah pengguna
 * Suka, bagikan, dan pemberitahuan push
 * "Jenis sumber" baru: Contoh Yuebing lainnya!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Fitur pengguna anonim (jika situs telah dikonfigurasi untuk mengizinkan pengunjung anonim)
 * Jelajahi media
 * Tonton media!
 * Buat akun (jika situs telah dikonfigurasi untuk mengizinkan pendaftaran akun)

 ## Fitur pengguna yang masuk
 * Jelajahi media
 * Tonton media!
 * Tambahkan komentar, edit komentar Anda, hapus komentar Anda!
 * Mengundang teman-teman
 * Edit info akun
 * Hapus akun, hapus semua milik Anda termasuk semua komentar Anda

 ## Fitur pengguna admin
 * Edit metadata media, lihat thumbnail, ubah thumbnail yang dipilih
 * Lihat antrian transformasi media dan status pekerjaan
 * Mulai pemindaian dan indeks baru dari media sumber

 ## Fitur server/backend
 * Ramah sementara, NOL gigih/data penting disimpan di dalam wadah.
 * Semua data tahan lama disimpan di bucket tujuan; intinya, kami menggunakan S3 sebagai basis data kami
 * Pemindaian periodik otomatis ember sumber untuk media baru
 * Menambah dan mengubah metadata media; hasil edit disimpan di bucket tujuan, media sumber tidak pernah dimodifikasi
 * Profil keluaran yang dapat dikonfigurasi. Standarnya adalah DASH-mp4 dengan banyak sub-profil
 * Info akun pengguna juga disimpan di bucket tujuan, dienkripsi secara opsional
 * Jika kunci enkripsi diubah, admin dapat memindahkan pengguna ke kunci baru dengan konsol admin web

 ## Instalasi
 Anda dapat menginstal dan menjalankan `yuebing` melalui buruh pelabuhan, npm atau langsung dari sumber.

 ### Docker
 Jika Anda memiliki buruh pelabuhan, Anda dapat memulai dengan Yuebing dengan cepat:

    docker run -it cobbzilla/yuebing

 Paket ### npm
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### Dari sumber
 Untuk menjalankan dari sumber, Anda memerlukan nodejs v16+ dan benang

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

 Lihat [dokumen developer](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) untuk info lebih lanjut

 ## Konfigurasi
 Untuk bermain-main dengan Yuebing, tidak apa-apa memulainya tanpa mengonfigurasi apa pun.
 Jalankan `yuebing` dan Anda akan diminta untuk memasukkan konfigurasi minimal saat dijalankan.

 Jika Anda berencana menjalankan Yuebing untuk sementara waktu, lihat [dokumen konfigurasi](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) untuk
 info lebih lanjut tentang cara mengatur semuanya.

 ### konfigurasi nginx
 Yuebing adalah aplikasi Nuxt, dan mengharapkan Anda memasukkan nginx (atau server web lainnya)
 depannya untuk menangani SSL, pembatasan tarif jika diperlukan, dll.

 Jika Anda menggunakan nginx, berikut adalah [contoh konfigurasi](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) yang dapat Anda gunakan.

 ## Kenapa namanya yuebing?
 [Oolong si kelinci](https://en.wikipedia.org/wiki/Oolong_(kelinci)) adalah hewan yang menggemaskan dan terkenal
 [meme internet awal](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong meninggal pada tahun 2003,
 dua tahun sebelum layanan video tertentu yang sangat populer bahkan ada!

 Penerus Oolong bernama Yuebing. Yuebing tidak setenar Oolong, tapi apakah itu penting?
 Yuebing tetap berhasil.

 Mungkin yang lebih menarik, yuebing artinya [kue bulan](https://en.wikipedia.org/wiki/Mooncake)
 (Cina: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Jepang: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); kue bulan sangat enak dan dapat ditemukan di
 berbagai macam rasa dan gaya. Nikmati gaya daerah yang tak lekang oleh waktu, atau coba kue eksotis dari kontemporer
 tukang roti yang menjelajahi wilayah yang belum dipetakan dengan nikmat! Benar-benar ada yuebing untuk semua orang!

</pre>
