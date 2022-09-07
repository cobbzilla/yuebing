유빙 🥮
 ===========
 Yuebing은 비디오 호스팅 사이트를 실행하기 위한 오픈 소스 소프트웨어입니다.

 소스 비디오를 최신 스트리밍 형식으로 자동 트랜스코딩하여 모든 기기에서 재생할 수 있습니다.
 모든 연결을 통해 장치.

 Yuebing은 백엔드 스토리지에 Amazon S3 또는 Backblaze B2를 사용할 수 있으며 많은 고급 기능이 있습니다.

 ### 원천
 * [GitHub의 yebing](https://github.com/cobbzilla/yebing)
 * [npm의 유빙](https://www.npmjs.com/package/yuebing)
 * [DockerHub에서 yebing](https://hub.docker.com/repository/docker/cobbzilla/yebing)

 # 내용물
 * [인스피레이션](#인스피레이션)
 * [기능](#기능)
 * [설치](#설치)
 * [도커](#도커)
 * [npm 패키지](#npm-패키지)
 * [출처 출처](#출처 출처)
 * [설정](#설정)
 * [nginx 설정](#nginx-config)
 * [왜 이름이 위빙일까?](#위에빙 이름이 왜?)

 ## 영감
 작년에 우리 엄마는 오래된 가족 비디오 아카이브를 정리하고 디지털화하는 데 엄청난 시간과 돈을 투자했습니다.
 이들 중 일부는 1950년대로 거슬러 올라가는 꽤 오래된 것입니다. 정말 아름답고 고전적인 것들.

 우리는 이것을 가족과 개인적으로 공유하고 싶었지만 *대형 기술팀과는 공유하지 않았습니다*.
 주요 제공업체의 "무료" 비디오 호스팅을 사용하는 것은 불가능했습니다.

 우리가 찾고 있던 것:
 * 자체 호스팅되지만 실행 및 유지 관리가 완전히 **손쉽고**
 * 적응형 비트 전송률을 포함한 최신 비디오 형식의 스트림
 * 비디오는 모든 장치, 데스크톱 또는 모바일에서 재생됩니다.
 * 고대역폭 연결로 비디오 품질이 굉장합니다. 이보다 더 좋을 순 없다
 * **연결 상태가 좋지 않아도** 재생 품질이 양호하고 *건너뛰거나 버퍼링되지 않습니다*
 * 암호화된 스토리지, 따라서 어느 정도 자신 있게 공용 클라우드 스토리지 솔루션을 사용할 수 있습니다.
 * Stateless 서버: 복원력이 높은 스토리지에 중요한 모든 것을 유지
 * **백업 걱정은 하고 싶지 않습니다!**
 * *이게 있어서 좋았습니다. 밝혀진 바에 따르면 이와 같은 것은 없습니다. Yuebing은 않습니다!*
 * 모든 것을 트랜스코딩하기 위해 강력한 인스턴스를 실행한 후, 이를 분해하고 장기적으로 더 저렴한 것을 실행하십시오.
 * Yuebing은 월 $10 미만으로 실행할 수 있습니다. 우리가 Yuebing의 발자국을 최적화함에 따라 앞으로 더 줄어들기를 바랍니다.

 나는 그곳에 무엇이 있는지 조사하기 위해 몇 주를 보냈습니다. 나는 내 요구 사항을 크게 완화하기 시작했지만 여전히
 괜찮은 것을 찾을 수 없었습니다. 여러 오픈 소스 프로젝트를 살펴보았지만 모두
 여러 눈에 띄는 결함.

 그래서 결정했습니다. 얼마나 힘들까요? S3를 ffmpeg에 연결하고 최신 프론트엔드를 추가하면 완료됩니다.
 오른쪽?

 .... 어, 좋아, 이 시점에서 나는 약 한 달이지만 너무 재미있다! 당신도 그것을 즐기시기 바랍니다!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**자체 호스팅 비디오 사이트를 매우 쉽게 만들자!**</a>

 ## 특징
 * 동영상이 포함된 S3 버킷을 친구 및 가족을 위한 비공개 동영상 사이트로 변환하세요!
 * 원시 미디어 파일을 제공하는 하나 이상의 소스 버킷 연결
 * Yuebing은 소스 비디오를 적응형 비트 전송률 스트리밍(DASH/mp4)을 위해 가장 널리 지원되는 최신 형식으로 자동 트랜스코딩합니다.
 * 모든 데이터는 대상 버킷에 저장되므로 컨테이너를 파괴하고 나중에 가져올 수 있습니다.
 * 초기 변환을 위해 CPU 최적화 인스턴스에서 처음 실행한 다음 \
    on a much cheaper instance for 24/7/365 service.
 * 완전히 암호화된 스토리지 지원(앱 측 암호화, 키만 있음)
 * 항상 소스에서 읽기 전용이며 소스 내용을 변경하지 않습니다.
 * 새 미디어 파일에 대한 자동 및 수동 검색
 * 얼마나 사적인 것을 원하십니까, 아니면 공적으로 원하십니까? Yuebing은 다음을 지원합니다.
 * 완전히 비공개: 익명의 사용자에게 미디어가 표시되지 않으며 승인된 이메일 주소만 계정을 생성할 수 있습니다.
 * 반 비공개: 익명의 사용자에게 미디어가 표시되지 않지만 누구나 사용자 계정을 만들 수 있습니다.
 * 등록이 제한된 공개: 모든 사람에게 미디어가 표시되지만 승인된 이메일 주소만 계정을 만들 수 있습니다.
 * 완전 공개: 모든 사람에게 표시되는 미디어, 누구나 사용자 계정을 만들 수 있음
 * 완전히 국제화! 사용자가 볼 수 있는 모든 텍스트(및 기타 로케일별 항목)는 현지화된 리소스에서 가져옵니다.
 * [커뮤니티를 돕고 Yuebing을 새로운 언어로 번역하세요!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * 모든 기능을 갖춘 관리 콘솔
 * **내가 인정하는 한 가지는 여전히 완전히 형편없다:**
 * "검색 경험"은 *디렉토리 계층 구조 탐색*으로 구성됩니다. 그것은 **매우 절름발이**지만 우리는 어딘가에서 시작해야 했습니다.
 * 적절한 검색, 태그 지정, 제안 등에 대한 지원을 추가할 예정입니다.
 * 좋습니다. 실제로 여전히 형편없는 것들이 많이 있습니다. 이것은 완전히 1.0 소프트웨어이지만 작동하는 것들은 꽤 멋집니다.
 * <a href="https://www.patreon.com/cobbzilla">**지원 예정**</a> :
 * 더 많은 미디어 유형 지원(오디오, 이미지 등)
 * 사용자 업로드 미디어
 * 새로운 "소스 유형": 또 다른 Yuebing 인스턴스!
    * Federation between friendly instances: unified search, user accounts, etc

 ## 익명 사용자 기능(사이트가 익명 방문자를 허용하도록 구성된 경우)
 * 미디어 탐색
 * 미디어 시청!
 * 계정 생성(사이트가 계정 등록을 허용하도록 구성된 경우)

 ## 로그인한 사용자 기능
 * 미디어 탐색
 * 미디어 시청!
 * 댓글 추가, 댓글 수정, 댓글 삭제!
 * 미디어 좋아요(곧 제공될 예정입니다!)
 * 친구를 초대
 * 언어를 영어 또는 프랑스어로 설정하십시오(더 많은 번역을 추가하세요!)
 * 계정 정보 수정
 * 계정 삭제, 모든 댓글을 포함하여 귀하의 모든 것을 삭제합니다.

 ## 관리자 사용자 기능
 * 미디어 메타데이터 편집, 썸네일 보기, 선택한 썸네일 변경
 * 미디어 변환 대기열 및 작업 상태 보기
 * 소스 미디어의 새로운 스캔 및 인덱스 시작

 ## 서버/백엔드 기능
 * 임시 친화적인 ZERO 영구/중요 데이터는 컨테이너 내에 저장됩니다.
 * 모든 영구 데이터는 대상 버킷에 유지됩니다. 기본적으로 S3를 데이터베이스로 사용합니다.
 * 새 미디어에 대한 소스 버킷의 자동 주기적 스캔
 * 미디어 메타데이터 추가 및 변경 편집 내용은 대상 버킷에 저장되며 소스 미디어는 수정되지 않습니다.
 * 구성 가능한 출력 프로필. 기본값은 4개의 프로필이 있는 DASH-mp4이며 HD보다 우수한 품질에서 초저 대역폭에 이르기까지 품질 수준을 지원합니다.
 * 사용자 계정 정보도 대상 버킷에 저장되며 선택적으로 암호화됩니다.
 * 암호화 키가 변경되면 관리자는 웹 관리 콘솔을 사용하여 사용자를 새 키로 마이그레이션할 수 있습니다.

 ## 설치
 docker, npm을 통해 또는 소스에서 직접 `yuebing` 을 설치하고 실행할 수 있습니다.

 ### 도커
 docker가 있으면 Yuebing을 빠르게 시작할 수 있습니다.

    docker run -it cobbzilla/yuebing

 ### npm 패키지
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### 출처에서
 소스에서 실행하려면 nodejs v16+ 및 yarn이 필요합니다.

    # Clone source and install dependencies
    git clone https://github.com/cobbzilla/yuebing.git
    cd yuebing
    yarn install

    # Use the 'yuebing' command from the git repo
    ./yuebing

    # Or, since you have the source, run any of the yarn scripts
    yarn docker-run-dev # Fastest build & startup, dev docker image
    yarn docker-run # Faster at runtime, production docker image

 자세한 내용은 [개발자 문서](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md)를 참조하세요.

 ## 구성
 Yuebing을 가지고 놀려면 아무 것도 구성하지 않고 시작하는 것이 좋습니다.
 `yuebing` 을 실행하면 시작할 때 최소 구성을 입력하라는 메시지가 표시됩니다.

 잠시 동안 Yuebing을 실행할 계획이라면 [구성 문서](https://github.com/cobbzilla/yebing/blob/master/docs/config.md)를 참조하세요.
 설정 방법에 대한 추가 정보.

 ### nginx 설정
 Yuebing은 단지 Nuxt 앱이며 nginx(또는 다른 웹 서버)를
 SSL, 필요한 경우 속도 제한 등을 처리하기 위해 앞에 있습니다.

 nginx를 사용하는 경우 사용할 수 있는 [샘플 구성](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf)이 있습니다.

 ## 이름이 왜 유빙일까요?
 [우롱토끼](https://en.wikipedia.org/wiki/Oolong_(토끼)) 귀엽고 유명했어요
 [초기 인터넷 밈](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). 우롱은 2003년에 사망했고,
 엄청난 인기를 누리고 있는 어떤 비디오 서비스가 존재하기 2년 전!

 Oolong의 후계자는 Yuebing으로 명명되었습니다. Yuebing은 Oolong만큼 유명하지 않았지만 그것이 중요합니까?
 그래도 Yuebing은 성공했습니다.

 더 흥미롭게도 yuebing은 [mooncake](https://en.wikipedia.org/wiki/Mooncake)를 의미합니다.
 (중국어: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 일본어: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); 월병은 매우 맛있고 다음에서 찾을 수 있습니다.
 다양한 맛과 스타일. 유서 깊은 지역 스타일을 즐기거나 현대의 이국적인 케이크를 맛보십시오.
 맛있는 미지의 영역을 탐험하는 제빵사! 진정으로 모든 사람을 위한 유빙이 있습니다!

</pre>
