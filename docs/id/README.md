Yuebing
 ===========
 Yuebing adalah perangkat lunak sumber terbuka untuk menjalankan situs hosting video.

 Ini secara otomatis mentranskode video sumber Anda ke format streaming modern, dapat dimainkan di mana saja
 perangkat melalui koneksi apa pun.

 Yuebing dapat menggunakan Amazon S3 atau Backblaze B2 untuk penyimpanan backend, dan memiliki banyak fitur lanjutan.

 ### Sumber
 * [yuebing di GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing di npm](https://www.npmjs.com/package/yuebing)
 * [yuebing di DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Isi
 * [Inspirasi](#Inspirasi)
 * [Fitur](#Fitur)
 * [Pemasangan](#Pemasangan)
 * [Docker](#Docker)
 * [paket npm](#npm-paket)
 * [Dari sumber](#Dari-sumber)
 * [Konfigurasi](#Konfigurasi)
 * [konfigurasi nginx](#nginx-config)
 * [Kenapa namanya yuebing?](#Kenapa-nama-yuebing?)

 ## Inspirasi
 Tahun lalu ibu saya menghabiskan banyak waktu (dan uang!) untuk mengatur dan mendigitalkan arsip video keluarga lama.
 Beberapa di antaranya cukup tua, kembali ke tahun 1950-an. Cantik banget, barang klasik.

 Kami ingin membagikan ini secara pribadi dengan keluarga, tetapi *tidak dengan teknologi besar*.
 Pergi dengan hosting video "gratis" dari penyedia utama tidak cocok.

 Apa yang kami cari:
 * Di-host sendiri, tetapi sepenuhnya **mudah digunakan** untuk dijalankan dan dipelihara
 * Streaming dalam format video modern, termasuk bitrate adaptif
 * Video diputar di perangkat apa pun, desktop, atau seluler
 * Dengan koneksi bandwidth tinggi, kualitas video luar biasa; sebaik yang didapat
 * **Bahkan dengan koneksi yang buruk**, kualitas pemutarannya lumayan dan *tidak melewati atau buffer*
 * Penyimpanan terenkripsi, sehingga dapat menggunakan solusi penyimpanan cloud publik dengan percaya diri
 * Server tanpa kewarganegaraan: mempertahankan apa pun yang penting untuk penyimpanan yang sangat tangguh
 * **Saya tidak ingin khawatir tentang pencadangan!**
 * * Ini bagus untuk dimiliki. Ternyata tidak ada yang seperti ini. Yuebing melakukannya!*
 * Setelah menjalankan instance yang gemuk untuk mentranskode semuanya, meruntuhkannya dan menjalankan sesuatu yang lebih murah untuk jangka panjang
 * Anda dapat menjalankan Yuebing dengan harga di bawah $10/bulan; dan semoga lebih sedikit lagi saat kami mengoptimalkan jejak Yuebing

 Saya mengambil beberapa minggu untuk mensurvei apa yang ada di luar sana. Saya mulai sangat melonggarkan persyaratan saya, dan tetap saja
 tidak dapat menemukan apa pun yang layak. Saya melihat beberapa proyek open source, saya tidak mengatakan yang mana karena semuanya memiliki
 banyak kekurangan yang mencolok.

 Jadi, saya memutuskan, seberapa sulitkah itu? Anda menyambungkan S3 ke ffmpeg, memasang frontend modern yang sopan, dan selesai,
 Baik?

 .... eh, oke, saya sekitar satu bulan pada saat ini, tapi itu terlalu menyenangkan! Saya harap Anda menikmatinya juga!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Mari buat situs video yang menghosting sendiri menjadi sangat mudah!**</a>

 ## Fitur
 * Ubah ember S3 dengan video menjadi situs video pribadi untuk teman dan keluarga!
 * Hubungkan satu atau lebih ember sumber yang menyediakan file media mentah
 * Yuebing secara otomatis mentranskode video sumber ke format terbaru dan paling banyak didukung untuk streaming bitrate adaptif (DASH/mp4)
 * SEMUA data disimpan di ember tujuan, sehingga Anda dapat menghancurkan wadah dan membawanya nanti
 * Berguna untuk menjalankan awalnya pada instance yang dioptimalkan CPU untuk transformasi awal, lalu jalankan \
    on a much cheaper instance for 24/7/365 service.
 * Mendukung penyimpanan terenkripsi sepenuhnya (enkripsi sisi aplikasi, hanya Anda yang memiliki kuncinya)
 * Selalu baca-saja dari sumber, jangan pernah mengubah konten sumber
 * Pemindaian otomatis dan manual untuk file media baru
 * Seberapa pribadi atau publik yang Anda inginkan? Yuebing mendukung:
 * Benar-benar pribadi: tidak ada media yang ditampilkan kepada pengguna anonim, hanya alamat email yang disetujui yang dapat membuat akun
 * Semi-pribadi: tidak ada media yang ditampilkan kepada pengguna anonim, tetapi siapa pun dapat membuat akun pengguna
 * Publik dengan pendaftaran terbatas: media ditampilkan kepada semua orang, tetapi hanya alamat email yang disetujui yang dapat membuat akun
 * Benar-benar publik: media ditampilkan kepada semua orang, dan siapa pun dapat membuat akun pengguna
 * Sepenuhnya diinternasionalkan! Semua teks yang terlihat oleh pengguna (dan hal-hal khusus lokal lainnya) berasal dari sumber daya yang dilokalkan
 * [Bantu komunitas, terjemahkan Yuebing ke bahasa baru!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Konsol admin berfitur lengkap
 * **Satu hal yang saya akui masih benar-benar menyebalkan:**
 * "Pengalaman penemuan" terdiri dari *menavigasi hierarki direktori*. Itu **sangat lumpuh**, tapi kami harus memulai dari suatu tempat.
 * Kami akan menambahkan dukungan untuk pencarian yang tepat, penandaan, saran, dll.
 * Oke, sebenarnya ada banyak hal yang masih menyebalkan, dan ini benar-benar perangkat lunak 1.0, tetapi hal-hal yang berfungsi cukup keren
 * <a href="https://www.patreon.com/cobbzilla">**Segera hadir dengan dukungan Anda**</a> :
 * Dukungan untuk lebih banyak jenis media (audio, gambar, dll)
 * Media yang diunggah pengguna
 * "Jenis sumber" baru: Contoh Yuebing lainnya!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Fitur pengguna anonim (jika situs telah dikonfigurasi untuk mengizinkan pengunjung anonim)
 * Jelajahi media
 * Perhatikan media!
 * Buat akun (jika situs telah dikonfigurasi untuk memungkinkan pendaftaran akun)

 ## Fitur pengguna yang masuk
 * Jelajahi media
 * Perhatikan media!
 * Tambahkan komentar, edit komentar Anda, hapus komentar Anda!
 * Suka media (segera hadir!)
 * Mengundang teman-teman
 * Atur bahasa ke bahasa Inggris atau Prancis (tambahkan lebih banyak terjemahan!)
 * Edit info akun
 * Hapus akun, hapus semua milik Anda termasuk semua komentar Anda

 ## Fitur pengguna admin
 * Edit metadata media, lihat thumbnail, ubah thumbnail yang dipilih
 * Lihat antrian transformasi media dan status pekerjaan
 * Mulai pemindaian dan indeks media sumber baru

 ## Fitur server/backend
 * Data persisten/penting NOL yang ramah sementara disimpan di dalam wadah.
 * Semua data tahan lama disimpan di bucket tujuan; pada dasarnya, kami menggunakan S3 sebagai database kami
 * Pemindaian berkala otomatis ember sumber untuk media baru
 * Tambahkan dan ubah metadata media; suntingan disimpan di keranjang tujuan, media sumber tidak pernah dimodifikasi
 * Profil keluaran yang dapat dikonfigurasi. Standarnya adalah DASH-mp4 dengan empat profil, mendukung tingkat kualitas dari yang lebih baik dari HD hingga bandwidth super rendah
 * Info akun pengguna juga disimpan di keranjang tujuan, dienkripsi secara opsional
 * Jika kunci enkripsi diubah, admin dapat memigrasikan pengguna ke kunci baru dengan konsol admin web

 ## Instalasi
 Anda dapat menginstal dan menjalankan `yuebing` melalui buruh pelabuhan, npm atau langsung dari sumber.

 ### buruh pelabuhan
 Jika Anda memiliki buruh pelabuhan, Anda dapat memulai Yuebing dengan cepat:

    docker run -it cobbzilla/yuebing

 ### paket npm
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### Dari sumber
 Untuk menjalankan dari sumber, Anda memerlukan nodejs v16+ dan yarn

    # Clone source and install dependencies
    git clone https://github.com/cobbzilla/yuebing.git
    cd yuebing
    yarn install

    # Use the 'yuebing' command from the git repo
    ./yuebing

    # Or, since you have the source, run any of the yarn scripts
    yarn docker-run-dev # Fastest build & startup, dev docker image
    yarn docker-run # Faster at runtime, production docker image

 Lihat [dokumen pengembang](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) untuk info lebih lanjut

 ## Konfigurasi
 Untuk bermain-main dengan Yuebing, tidak apa-apa untuk memulainya tanpa mengonfigurasi apa pun.
 Jalankan `yuebing` dan Anda akan diminta untuk memasukkan konfigurasi minimal saat dimulai.

 Jika Anda berencana menjalankan Yuebing untuk sementara waktu, lihat [dokumen konfigurasi](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) untuk
 info lebih lanjut tentang cara mengatur segalanya.

 ### konfigurasi nginx
 Yuebing hanyalah aplikasi Nuxt, dan berharap Anda akan memasukkan nginx (atau server web lain)
 depannya untuk menangani SSL, pembatasan tarif jika diperlukan, dll.

 Jika Anda menggunakan nginx, berikut adalah [konfigurasi sampel](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) yang dapat Anda gunakan.

 ## Kenapa namanya yuebing?
 [Oolong si kelinci](https://en.wikipedia.org/wiki/Oolong_(rabbit)) adalah hewan yang menggemaskan dan terkenal
 [meme internet awal](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong meninggal pada tahun 2003,
 dua tahun sebelum layanan video yang sangat populer bahkan ada!

 Pengganti Oolong bernama Yuebing. Yuebing hampir tidak setenar Oolong, tapi apakah itu penting?
 Yuebing tetap berhasil.

 Mungkin yang lebih menarik, yuebing berarti [kue bulan](https://en.wikipedia.org/wiki/Mooncake)
 (Hanzi: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Jepang: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); kue bulan sangat enak dan dapat ditemukan di
 berbagai macam rasa dan gaya. Nikmati gaya daerah yang dihormati, atau coba kue eksotis dari kontemporer
 tukang roti yang menjelajahi wilayah yang belum dipetakan dengan nikmat! Benar-benar ada yuebing untuk semua orang!

</pre>
