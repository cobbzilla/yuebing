Nguyệt Băng 🥮
 ==========
 Yuebing là phần mềm mã nguồn mở để chạy các trang web lưu trữ video.

 Yuebing tự động chuẩn bị các video nguồn của bạn để phát trực tuyến bằng các định dạng hiện đại, có thể phát trên mọi
 thiết bị qua bất kỳ kết nối nào.

 Yuebing có thể sử dụng Amazon S3 hoặc Backblaze B2 để lưu trữ phụ trợ và có nhiều tính năng nâng cao.

 ### Nguồn
 * [yuebing trên GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing trên npm](https://www.npmjs.com/package/yuebing)
 * [yuebing trên DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Đọc cái này bằng ngôn ngữ khác
 Tài liệu README.md này đã được dịch qua [hokeylization](https://github.com/cobbzilla/hokeylization), thành
 nhiều ngôn ngữ.

 Tôi chắc chắn rằng nó không hoàn hảo, nhưng tôi hy vọng nó tốt hơn là không có gì!

 [🇸🇦 tiếng Ả Rập](../ar/README.md)
 [🇧🇩 Tiếng Bengal](../bn/README.md)
 [🇩🇪 Tiếng Đức](../de/README.md)
 [🇺🇸 Tiếng Anh](../en/README.md)
 [🇪🇸 Tiếng Tây Ban Nha](../es/README.md)
 [🇫🇷 Tiếng Pháp](../fr/README.md)
 [🇹🇩 Hausa](../ha/README.md)
 [🇮🇳 Tiếng Hindi](../hi/README.md)
 [🇮🇩 Tiếng Indonesia](../id/README.md)
 [🇮🇹 tiếng Ý](../it/README.md)
 [🇯🇵 Tiếng Nhật](../ja/README.md)
 [🇰🇷 Tiếng Hàn](../ko/README.md)
 [🇮🇳 Tiếng Marathi](../mr/README.md)
 [🇵🇱 Tiếng Ba Lan](../pl/README.md)
 [🇧🇷 Tiếng Bồ Đào Nha](../pt/README.md)
 [🇷🇺 Tiếng Nga](../ru/README.md)
 [🇰🇪 Tiếng Swahili](../sw/README.md)
 [🇵🇭 Tagalog](../tl/README.md)
 [🇹🇷 Tiếng Thổ Nhĩ Kỳ](../tr/README.md)
 [🇵🇰 tiếng Urdu](../ur/README.md)
 [🇻🇳 Tiếng Việt](../vi/README.md)
 [🇨🇳 Tiếng Trung](../zh/README.md)
 ----

 # nội dung
 * [Cảm hứng](#Cảm hứng)
 * [Tính năng tính năng)
 * [Cài đặt](#Cài đặt)
 * [Docker](#Docker)
 * [gói npm](#npm-gói)
 * [Từ nguồn](#Từ-nguồn)
 * [Cấu hình](#Cấu hình)
 * [nginx config](#nginx-config)
 * [Tại sao tên là yuebing?](#Tại sao-tên-yuebing?)

 ## Cảm hứng
 Năm ngoái, mẹ tôi đã dành rất nhiều thời gian (và tiền bạc!) để tổ chức và số hóa kho lưu trữ các video cũ của gia đình.
 Một số trong số này đã khá cũ, có từ những năm 1940. Thực sự đẹp, công cụ cổ điển.

 Chúng tôi muốn chia sẻ những điều này một cách riêng tư với gia đình, nhưng *không phải với công nghệ lớn*.
 Sử dụng dịch vụ lưu trữ video "miễn phí" từ một nhà cung cấp lớn là điều không cần bàn cãi.

 Những gì chúng tôi đang tìm kiếm:
 * Tự lưu trữ, nhưng hoàn toàn **dễ dàng thực hiện** để chạy và bảo trì
 * Truyền phát ở các định dạng video hiện đại, bao gồm tốc độ bit thích ứng
 * Video phát trên mọi thiết bị, máy tính để bàn hoặc thiết bị di động
 * Với kết nối băng thông cao, chất lượng video thật tuyệt vời; Tốt như nó học được
 * **Ngay cả khi kết nối kém**, chất lượng phát lại vẫn ở mức khá và *không bỏ qua hoặc đệm*
 * Lưu trữ được mã hóa, do đó có thể yên tâm sử dụng các giải pháp lưu trữ đám mây công cộng
 * Máy chủ không trạng thái: duy trì mọi thứ quan trọng để lưu trữ có khả năng phục hồi cao
 * **Tôi không muốn lo lắng về các bản sao lưu!**
 * * Đây là một tốt đẹp để có. Hóa ra không có gì ngoài kia có bất cứ thứ gì như thế này. Yuebing có!*
 * Sau khi chạy một phiên bản mạnh mẽ để chuyển mã mọi thứ, hãy phá bỏ nó và chạy thứ gì đó rẻ hơn trong thời gian dài
 * Bạn có thể chạy Yuebing với giá dưới $10/tháng; và hy vọng sẽ ít hơn khi chúng tôi tối ưu hóa dấu chân của Yuebing

 Tôi đã mất một vài tuần để khảo sát những gì ở ngoài đó. Tôi bắt đầu nới lỏng rất nhiều yêu cầu của mình, và vẫn
 không thể tìm thấy bất cứ điều gì đàng hoàng. Tôi đã xem xét một số dự án mã nguồn mở, tôi không nói dự án nào bởi vì tất cả chúng đều có
 nhiều lỗ hổng rõ ràng.

 Vì vậy, tôi quyết định, nó có thể khó đến mức nào? Bạn kết nối S3 với ffmpeg, đặt giao diện người dùng hiện đại cho nó, và bạn đã hoàn tất, phải không?
 ... à, uh, phần lớn công việc mất vài tháng, nhưng quá thú vị để dừng lại!
 Tôi hy vọng bạn cũng thích nó!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Hãy biến các trang web tự lưu trữ video trở nên cực kỳ dễ dàng!**</a>

 ## Đặc trưng
 * Biến một nhóm video S3 (hoặc B2) thành một trang web video riêng tư cho bạn bè và gia đình!
 * Kết nối một hoặc nhiều nhóm nguồn cung cấp tệp phương tiện thô
 * Yuebing tự động chuyển mã nguồn video sang định dạng mới nhất và được hỗ trợ rộng rãi nhất để truyền phát tốc độ bit thích ứng (DASH/mp4)
 * TẤT CẢ dữ liệu được lưu trữ trong thùng đích; bạn có thể phá hủy máy chủ bất cứ khi nào bạn muốn
 * Hữu ích khi chạy ban đầu trên phiên bản được tối ưu hóa cho CPU cho quá trình chuyển mã ban đầu, sau đó chạy \
    on a much cheaper instance for 24/7/365 service.
 * Hỗ trợ lưu trữ được mã hóa hoàn toàn (mã hóa phía ứng dụng, chỉ bạn mới có khóa)
 * Luôn chỉ đọc từ nguồn, không bao giờ thay đổi nội dung nguồn
 * Quét tự động và thủ công các tệp phương tiện mới
 * Bạn muốn mọi thứ riêng tư hay công khai như thế nào? Yuebing hỗ trợ:
 * Hoàn toàn riêng tư: không có phương tiện nào được hiển thị cho người dùng ẩn danh, chỉ những địa chỉ email được phê duyệt mới có thể tạo tài khoản
 * Bán riêng tư: không có phương tiện nào được hiển thị cho người dùng ẩn danh, nhưng bất kỳ ai cũng có thể tạo tài khoản người dùng
 * Công khai với đăng ký hạn chế: phương tiện được hiển thị cho mọi người, nhưng chỉ những địa chỉ email được phê duyệt mới có thể tạo tài khoản
 * Hoàn toàn công khai: phương tiện được hiển thị cho mọi người và bất kỳ ai cũng có thể tạo tài khoản người dùng
 * Hoàn toàn quốc tế hóa! Tất cả văn bản mà người dùng có thể nhìn thấy (và nội dung dành riêng cho ngôn ngữ khác) đến từ các tài nguyên được bản địa hóa
 * [Trợ giúp cộng đồng, dịch Yuebing sang ngôn ngữ mới!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Bảng điều khiển quản trị đầy đủ tính năng
 * Tìm kiếm video theo từ khóa hoặc từ đám mây thẻ
 * <a href="https://www.patreon.com/cobbzilla">**Sắp có sự hỗ trợ của bạn**</a> :
 * Hỗ trợ nhiều loại phương tiện hơn (âm thanh, hình ảnh, v.v.)
 * Phương tiện do người dùng tải lên
 * Lượt thích, chia sẻ và thông báo đẩy
 * "Loại nguồn" mới: Một phiên bản Yuebing khác!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Tính năng người dùng ẩn danh (nếu trang web đã được định cấu hình để cho phép khách truy cập ẩn danh)
 * Duyệt phương tiện truyền thông
 * Xem phương tiện truyền thông!
 * Tạo tài khoản (nếu site đã được cấu hình cho phép đăng ký tài khoản)

 ## Tính năng người dùng đã đăng nhập
 * Duyệt phương tiện truyền thông
 * Xem phương tiện truyền thông!
 * Thêm một bình luận, chỉnh sửa bình luận của bạn, xóa bình luận của bạn!
 * Mời bạn bè
 * Chỉnh sửa thông tin tài khoản
 * Xóa tài khoản, xóa mọi thứ thuộc về bạn bao gồm tất cả nhận xét của bạn

 ## Tính năng người dùng quản trị
 * Chỉnh sửa siêu dữ liệu phương tiện, xem hình thu nhỏ, thay đổi hình thu nhỏ đã chọn
 * Xem hàng đợi chuyển đổi phương tiện và trạng thái công việc
 * Bắt đầu quét mới và lập chỉ mục phương tiện nguồn

 ## Tính năng máy chủ/phụ trợ
 * Thân thiện với môi trường tạm thời, KHÔNG có dữ liệu liên tục/quan trọng nào được lưu trữ trong vùng chứa.
 * Tất cả dữ liệu lâu bền được lưu giữ trong thùng đích; về cơ bản, chúng tôi sử dụng S3 làm cơ sở dữ liệu của mình
 * Tự động quét định kỳ nhóm nguồn cho phương tiện mới
 * Thêm và thay đổi siêu dữ liệu phương tiện; các chỉnh sửa được lưu trữ trên bộ chứa đích, phương tiện nguồn không bao giờ bị sửa đổi
 * Cấu hình đầu ra cấu hình. Mặc định là DASH-mp4 với nhiều tiểu sử
 * Thông tin tài khoản người dùng cũng được lưu trữ trên thùng đích, được mã hóa tùy chọn
 * Nếu khóa mã hóa bị thay đổi, quản trị viên có thể di chuyển người dùng sang khóa mới bằng bảng điều khiển dành cho quản trị viên web

 ## Cài đặt
 Bạn có thể cài đặt và chạy `yuebing` thông qua docker, npm hoặc trực tiếp từ nguồn.

 ### Docker
 Nếu bạn có docker, bạn có thể nhanh chóng bắt đầu với Yuebing:

    docker run -it cobbzilla/yuebing

 ### gói npm
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### Từ nguồn
 Để chạy từ nguồn, bạn sẽ cần nodejs v16+ và yarn

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

 Xem [tài liệu dành cho nhà phát triển](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) để biết thêm thông tin

 ## Cấu hình
 Để chơi với Yuebing, bạn có thể khởi động nó mà không cần cấu hình bất cứ thứ gì.
 Chạy `yuebing` và bạn sẽ được nhắc nhập cấu hình tối thiểu khi khởi động.

 Nếu bạn định chạy Yuebing trong một thời gian, hãy xem [tài liệu cấu hình](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) để biết
 thêm thông tin về cách thiết lập mọi thứ.

 ### cấu hình nginx
 Yuebing là một ứng dụng Nuxt và hy vọng rằng bạn sẽ đặt nginx (hoặc một số máy chủ web khác) vào
 phía trước để xử lý SSL, giới hạn tốc độ nếu cần, v.v.

 Nếu bạn đang sử dụng nginx, đây là [cấu hình mẫu](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) mà bạn có thể sử dụng.

 ## Tại sao tên Yuebing?
 [Thỏ Oolong](https://en.wikipedia.org/wiki/Oolong_(rabbit)) là một chú thỏ đáng yêu và nổi tiếng
 [meme internet thời kỳ đầu](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong chết năm 2003,
 hai năm trước khi một dịch vụ video phổ biến ồ ạt nào đó tồn tại!

 Người kế vị của Oolong được đặt tên là Yuebing. Yuebing gần như không nổi tiếng như Oolong, nhưng điều đó có quan trọng không?
 Yuebing dù sao cũng thành công.

 Có lẽ thú vị hơn, yuebing có nghĩa là [bánh trung thu](https://en.wikipedia.org/wiki/Mooncake)
 (Tiếng Trung: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Tiếng Nhật: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); bánh trung thu rất ngon và có thể tìm thấy ở
 một loạt các hương vị và phong cách. Thưởng thức phong cách địa phương được tôn vinh theo thời gian hoặc thử một loại bánh lạ từ đương đại
 những người thợ làm bánh đang khám phá lãnh thổ ngon lành chưa được khám phá! Thực sự có một yuebing cho tất cả mọi người!

</pre>
