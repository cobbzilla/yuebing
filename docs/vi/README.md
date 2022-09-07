Yuebing 🥮
 ==========
 Yuebing là phần mềm mã nguồn mở để chạy các trang web lưu trữ video.

 Nó tự động chuyển mã nguồn video của bạn sang các định dạng phát trực tuyến hiện đại, có thể phát trên bất kỳ
 thiết bị qua bất kỳ kết nối nào.

 Yuebing có thể sử dụng Amazon S3 hoặc Backblaze B2 để lưu trữ phụ trợ và có nhiều tính năng nâng cao.

 ### Nguồn
 * [yuebing trên GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing trên npm](https://www.npmjs.com/package/yuebing)
 * [yuebing trên DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Đọc sách này bằng ngôn ngữ khác
 Tài liệu README.md này đã được dịch, qua [hokeyption](https://github.com/cobbzilla/hokeyption), sang
 nhiều ngôn ngữ khác nhau.

 Tôi chắc chắn rằng nó không hoàn hảo, nhưng tôi hy vọng nó còn hơn không!

 [🇸🇦 tiếng Ả Rập](docs / ar / README.md)
 [🇧🇩 Tiếng Bengali](docs / bn / README.md)
 [🇩🇪 tiếng Đức](docs / de / README.md)
 [🇺🇸 Tiếng Anh](docs / en / README.md)
 [🇪🇸 Tiếng Tây Ban Nha](docs / es / README.md)
 [🇫🇷 Tiếng Pháp](docs / fr / README.md)
 [🇹🇩 Hausa](docs / ha / README.md)
 [🇮🇳 Hindi](docs / hi / README.md)
 [🇮🇩 tiếng Indonesia](docs / id / README.md)
 [🇮🇹 Tiếng Ý](docs / it / README.md)
 [🇯🇵 Tiếng Nhật](docs / ja / README.md)
 [🇰🇷 Tiếng Hàn](docs / ko / README.md)
 [🇮🇳 Maranthi](docs / mr / README.md)
 [🇵🇱 Tiếng Ba Lan](docs / pl / README.md)
 [🇧🇷 tiếng Bồ Đào Nha](docs / pt / README.md)
 [🇷🇺 tiếng Nga](docs / ru / README.md)
 [🇰🇪 Swahili](docs / sw / README.md)
 [🇵🇭 Tagalog](docs / tl / README.md)
 [🇹🇷 tiếng Thổ Nhĩ Kỳ](docs / tr / README.md)
 [🇵🇰 Urdu](docs / ur / README.md)
 [🇻🇳 Tiếng Việt](docs / vi / README.md)
 [🇨🇳 Tiếng Trung](docs / zh / README.md)
 ----

 # Nội dung
 * [Inspiration](# Inspiration)
 * [Tính năng tính năng)
 * [Cài đặt](# Cài đặt)
 * [Docker](# Docker)
 * [gói npm](# gói-npm)
 * [Từ nguồn](# Từ nguồn)
 * [Cấu hình](# Cấu hình)
 * [nginx config](# nginx-config)
 * [Tại sao lại có tên là yuebing?](# Why-the-name-yuebing?)

 ## Nguồn cảm hứng
 Năm ngoái, mẹ tôi đã dành rất nhiều thời gian (và tiền bạc!) Để sắp xếp và số hóa kho lưu trữ các video gia đình cũ.
 Một số trong số này khá cũ, có từ những năm 1950. Thực sự đẹp, công cụ cổ điển.

 Chúng tôi muốn chia sẻ những điều này một cách riêng tư với gia đình, nhưng * không phải với công nghệ lớn *.
 Việc sử dụng dịch vụ lưu trữ video "miễn phí" từ một nhà cung cấp lớn là điều không cần bàn cãi.

 Những gì chúng tôi đang tìm kiếm:
 * Tự lưu trữ, nhưng hoàn toàn ** dễ dàng thực hiện ** để chạy và bảo trì
 * Luồng ở các định dạng video hiện đại, bao gồm cả tốc độ bit thích ứng
 * Video phát trên mọi thiết bị, máy tính để bàn hoặc điện thoại di động
 * Với kết nối băng thông cao, chất lượng video thật tuyệt vời; Tốt như nó học được
 * ** Ngay cả khi kết nối kém **, phát lại có chất lượng tốt và * không bỏ qua hoặc đệm *
 * Lưu trữ được mã hóa, do đó có thể tự tin sử dụng các giải pháp lưu trữ đám mây công cộng
 * Máy chủ không trạng thái: duy trì mọi thứ quan trọng đối với bộ nhớ có khả năng phục hồi cao
 * ** Tôi không muốn lo lắng về việc sao lưu! **
 * * Đây là một điều tốt đẹp để có. Hóa ra không có gì ngoài kia có bất cứ thứ gì như thế này. Yuebing! *
 * Sau khi chạy một phiên bản mạnh mẽ để chuyển mã mọi thứ, hãy xé nhỏ nó và chạy thứ gì đó rẻ hơn về lâu dài
 * Bạn có thể chạy Yuebing với mức phí dưới $ 10 / tháng; và hy vọng sẽ ít hơn khi chúng tôi tối ưu hóa dấu chân của Yuebing

 Tôi đã mất vài tuần để khảo sát những gì ở ngoài đó. Tôi bắt đầu nới lỏng các yêu cầu của mình, và vẫn
 không tìm thấy gì tử tế. Tôi đã xem xét một số dự án mã nguồn mở, tôi không nói điều đó vì tất cả chúng đều có
 nhiều lỗi rõ ràng.

 Vì vậy, tôi đã quyết định, nó có thể khó đến mức nào? Bạn kết nối S3 với ffmpeg, đặt một giao diện người dùng rất hiện đại vào nó, và bạn đã hoàn tất,
 bên phải?

 .... uh, OK, tính đến thời điểm này là khoảng một tháng, nhưng vui quá! Tôi hy vọng bạn cũng thích nó!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">** Hãy làm cho các trang web video tự lưu trữ trở nên cực kỳ dễ dàng! **</a>

 ## Đặc trưng
 * Biến bộ chứa S3 với video thành một trang web video riêng tư cho bạn bè và gia đình!
 * Kết nối một hoặc nhiều nhóm nguồn cung cấp các tệp phương tiện thô
 * Yuebing tự động chuyển mã nguồn video sang định dạng mới nhất và được hỗ trợ rộng rãi nhất để phát trực tuyến tốc độ bit thích ứng (DASH / mp4)
 * TẤT CẢ dữ liệu được lưu trữ trong nhóm đích, vì vậy bạn có thể hủy vùng chứa và đưa lên sau
 * Hữu ích khi chạy ban đầu trên phiên bản được CPU tối ưu hóa cho lần chuyển đổi ban đầu, sau đó chạy \
    on a much cheaper instance for 24/7/365 service.
 * Hỗ trợ bộ nhớ được mã hóa hoàn toàn (mã hóa phía ứng dụng, chỉ bạn có khóa)
 * Luôn chỉ đọc từ nguồn, không bao giờ thay đổi nội dung nguồn
 * Tự động và quét thủ công cho các tệp phương tiện mới
 * Bạn muốn những thứ riêng tư hay công khai như thế nào? Yuebing hỗ trợ:
 * Hoàn toàn riêng tư: không có phương tiện nào hiển thị cho người dùng ẩn danh, chỉ những địa chỉ email được chấp thuận mới có thể tạo tài khoản
 * Nửa riêng tư: không có phương tiện nào được hiển thị cho người dùng ẩn danh, nhưng bất kỳ ai cũng có thể tạo tài khoản người dùng
 * Công khai với đăng ký hạn chế: phương tiện hiển thị cho mọi người, nhưng chỉ những địa chỉ email được chấp thuận mới có thể tạo tài khoản
 * Hoàn toàn công khai: phương tiện được hiển thị cho mọi người và bất kỳ ai cũng có thể tạo tài khoản người dùng
 * Hoàn toàn quốc tế hóa! Tất cả văn bản người dùng có thể nhìn thấy (và các nội dung cụ thể theo ngôn ngữ khác) đều đến từ các tài nguyên đã bản địa hóa
 * [Giúp cộng đồng, dịch Yuebing sang các ngôn ngữ mới!](Https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * Bảng điều khiển quản trị đầy đủ tính năng
 * ** Một điều tôi thừa nhận là vẫn hoàn toàn tệ: **
 * "Trải nghiệm khám phá" bao gồm * điều hướng hệ thống phân cấp thư mục *. Đó là ** siêu khập khiễng **, nhưng chúng tôi phải bắt đầu từ đâu đó.
 * Chúng tôi sẽ bổ sung hỗ trợ cho tìm kiếm, gắn thẻ, đề xuất phù hợp, v.v.
 * OK, thực sự có rất nhiều thứ vẫn còn tệ và đây hoàn toàn là phần mềm 1.0, nhưng những thứ hoạt động khá tuyệt
 * <a href="https://www.patreon.com/cobbzilla">** Sắp ra mắt với sự hỗ trợ của bạn **</a> :
 * Hỗ trợ nhiều loại phương tiện hơn (âm thanh, hình ảnh, v.v.)
 * Phương tiện do người dùng tải lên
 * "Loại nguồn" mới: Một phiên bản Yuebing khác!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Tính năng người dùng ẩn danh (nếu trang web đã được định cấu hình để cho phép khách truy cập ẩn danh)
 * Duyệt phương tiện
 * Xem phương tiện truyền thông!
 * Tạo tài khoản (nếu trang web đã được cấu hình để cho phép đăng ký tài khoản)

 ## Tính năng người dùng đã đăng nhập
 * Duyệt phương tiện
 * Xem phương tiện truyền thông!
 * Thêm nhận xét, chỉnh sửa nhận xét của bạn, xóa nhận xét của bạn!
 * Như phương tiện truyền thông (sắp ra mắt!)
 * Mời bạn bè
 * Đặt ngôn ngữ sang tiếng Anh hoặc tiếng Pháp (vui lòng thêm các bản dịch khác!)
 * Chỉnh sửa thông tin tài khoản
 * Xóa tài khoản, xóa mọi thứ của bạn bao gồm tất cả các nhận xét của bạn

 ## Tính năng người dùng quản trị
 * Chỉnh sửa siêu dữ liệu phương tiện, xem hình thu nhỏ, thay đổi hình thu nhỏ đã chọn
 * Xem hàng đợi chuyển đổi phương tiện và trạng thái công việc
 * Bắt đầu quét và lập chỉ mục mới của phương tiện nguồn

 ## Tính năng máy chủ / phụ trợ
 * Thân thiện tạm thời, KHÔNG lưu trữ dữ liệu liên tục / quan trọng trong vùng chứa.
 * Tất cả dữ liệu lâu bền được lưu giữ trong nhóm đích; về cơ bản, chúng tôi sử dụng S3 làm cơ sở dữ liệu của mình
 * Tự động quét định kỳ nhóm nguồn cho phương tiện mới
 * Thêm và thay đổi siêu dữ liệu phương tiện; các chỉnh sửa được lưu trữ trên nhóm đích, phương tiện nguồn không bao giờ được sửa đổi
 * Cấu hình đầu ra có thể định cấu hình. Mặc định là DASH-mp4 với bốn cấu hình, hỗ trợ các mức chất lượng từ băng thông tốt hơn HD đến siêu thấp
 * Thông tin tài khoản người dùng cũng được lưu trữ trên nhóm đích, được mã hóa tùy chọn
 * Nếu khóa mã hóa được thay đổi, quản trị viên có thể di chuyển người dùng sang khóa mới bằng bảng điều khiển dành cho quản trị viên web

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
 Để chạy từ nguồn, bạn sẽ cần nodejs v16 + và sợi

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
 Chạy `yuebing` và bạn sẽ được nhắc nhập cấu hình tối thiểu khi nó bắt đầu.

 Nếu bạn định chạy Yuebing trong một thời gian, hãy xem [tài liệu cấu hình](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) cho
 thêm thông tin về cách thiết lập mọi thứ.

 ### cấu hình nginx
 Yuebing chỉ đơn thuần là một ứng dụng Nuxt và mong rằng bạn sẽ đặt nginx (hoặc một số máy chủ web khác) vào
 phía trước nó để xử lý SSL, giới hạn tốc độ nếu cần, v.v.

 Nếu bạn đang sử dụng nginx, đây là [cấu hình mẫu](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) bạn có thể sử dụng.

 ## Tại sao lại có tên là yuebing?
 [Oolong the Rabbit](https://en.wikipedia.org/wiki/Oolong_ (thỏ)) là một người đáng yêu và nổi tiếng
 [meme internet sớm](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong mất năm 2003,
 hai năm trước khi một dịch vụ video phổ biến rộng rãi nhất định thậm chí còn tồn tại!

 Người kế vị Oolong tên là Yuebing. Yuebing gần như không nổi tiếng bằng Oolong, nhưng điều đó có quan trọng không?
 Yuebing dù sao cũng thành công.

 Có lẽ thú vị hơn, yuebing có nghĩa là [bánh trung thu](https://en.wikipedia.org/wiki/Mooncake)
 (Tiếng Trung: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 Tiếng Nhật: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); bánh trung thu rất ngon và có thể tìm thấy ở
 một loạt các hương vị và phong cách. Thưởng thức phong cách vùng lâu đời hoặc thử một loại bánh mới lạ từ đương đại
 những người thợ làm bánh đang khám phá lãnh thổ ngon lành chưa được khám phá! Thực sự có một yuebing cho tất cả mọi người!

</pre>
