유에빙🥮
 ==========
 Yuebing은 비디오 호스팅 사이트를 운영하기 위한 오픈 소스 소프트웨어입니다.

 Yuebing은 최신 형식을 사용하여 스트리밍할 소스 비디오를 자동으로 준비하여 모든 장치에서 재생할 수 있습니다.
 모든 연결을 통해 장치.

 Yuebing은 백엔드 스토리지에 Amazon S3 또는 Backblaze B2를 사용할 수 있으며 많은 고급 기능이 있습니다.

 ### 원천
 * [GitHub의 yuebing](https://github.com/cobbzilla/yuebing)
 * [npm의 yuebing](https://www.npmjs.com/package/yuebing)
 * [DockerHub의 yuebing](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # 이것을 다른 언어로 읽으십시오
 이 README.md 문서는 [hokeylization](https://github.com/cobbzilla/hokeylization)을 통해 다음으로 번역되었습니다.
 많은 언어.

 완벽하지는 않지만 없는 것보다는 낫기를 바랍니다!

 [🇸🇦 아랍어](../ar/README.md)
 [🇧🇩 벵골어](../bn/README.md)
 [🇩🇪 독일어](../de/README.md)
 [🇺🇸 영어](../en/README.md)
 [🇪🇸 스페인어](../es/README.md)
 [🇫🇷 프랑스어](../fr/README.md)
 [🇹🇩 하우사어](../ha/README.md)
 [🇮🇳 힌디어](../hi/README.md)
 [🇮🇩 인도네시아어](../id/README.md)
 [🇮🇹 이탈리아어](../it/README.md)
 [🇯🇵 일본어](../ja/README.md)
 [🇰🇷한국어](../ko/README.md)
 [🇮🇳 마라티어](../mr/README.md)
 [🇵🇱 폴란드어](../pl/README.md)
 [🇧🇷포르투갈어](../pt/README.md)
 [🇷🇺 러시아어](../ru/README.md)
 [🇰🇪 스와힐리어](../sw/README.md)
 [🇵🇭 타갈로그어](../tl/README.md)
 [🇹🇷 터키어](../tr/README.md)
 [🇵🇰 우르두어](../ur/README.md)
 [🇻🇳 베트남어](../vi/README.md)
 [🇨🇳 중국어](../zh/README.md)
 ----

 # 내용물
 * [영감](#영감)
 * [특징](#특징)
 * [설치](#설치)
 * [도커](#도커)
 * [npm 패키지](#npm-package)
 * [출처에서](#출처에서)
 * [구성](#구성)
 * [nginx 구성](#nginx-config)
 * [이름이 왜 유빙인가요?](#유빙이라는 이름이 왜요?)

 ## 영감
 작년에 엄마는 오래된 가족 비디오 아카이브를 정리하고 디지털화하는 데 엄청난 시간과 돈을 들였습니다.
 이들 중 일부는 1940년대까지 거슬러 올라가는 상당히 오래된 것이었습니다. 정말 아름답고 고전적인 것들.

 우리는 이것을 가족과 개인적으로 공유하고 싶었지만 *대형 기술과는 공유하지 않았습니다*.
 주요 공급자의 "무료" 비디오 호스팅을 사용하는 것은 불가능했습니다.

 우리가 찾고 있던 것:
 * 자체 호스팅되지만 실행 및 유지 관리가 완전히 **손쉬운**
 * 적응형 비트 전송률을 포함한 최신 비디오 형식의 스트림
 * 비디오는 모든 장치, 데스크톱 또는 모바일에서 재생됩니다.
 * 고대역폭 연결로 비디오 품질이 뛰어납니다. 이보다 더 좋을 순 없다
 * **연결 상태가 좋지 않은 경우에도** 재생 품질이 양호하며 *건너뛰거나 버퍼링되지 않습니다*
 * 암호화된 스토리지로 퍼블릭 클라우드 스토리지 솔루션을 안심하고 사용할 수 있습니다.
 * 상태 비저장 서버: 복원력이 뛰어난 스토리지에 중요한 모든 것을 유지합니다.
 * **백업에 대해 걱정하고 싶지 않습니다!**
 * *이것은 가지고 있어서 좋았습니다. 밝혀진 바에 따르면 이와 같은 것은 없습니다. 유에빙이 그렇습니다!*
 * 강력한 인스턴스를 실행하여 모든 것을 트랜스코딩한 후 이를 해체하고 장기적으로 더 저렴한 것을 실행하십시오.
 * 월 $10 미만으로 Yuebing을 실행할 수 있습니다. Yuebing의 설치 공간을 최적화함에 따라 앞으로 더 줄어들기를 바랍니다.

 나는 거기에 무엇이 있는지 조사하는 데 몇 주가 걸렸습니다. 요구 사항을 크게 완화하기 시작했지만 여전히
 괜찮은 것을 찾을 수 없습니다. 여러 오픈 소스 프로젝트를 살펴봤는데 모두
 여러 눈에 띄는 결함.

 그래서 저는 결정했습니다. 얼마나 어려울 수 있습니까? S3를 ffmpeg에 연결하고 최신 프런트엔드를 배치하면 완료됩니다.
 ... 글쎄, 어, 작업의 대부분은 몇 달이 걸렸지 만 멈추기에는 너무 재미있었습니다!
 당신도 그것을 즐기시기 바랍니다!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**셀프 호스팅 비디오 사이트를 아주 쉽게 만들어 봅시다!**</a>

 ## 특징
 * S3(또는 B2) 비디오 버킷을 친구와 가족을 위한 비공개 비디오 사이트로 변환하십시오!
 * 원시 미디어 파일을 제공하는 하나 이상의 소스 버킷 연결
 * Yuebing은 소스 비디오를 적응형 비트 전송률 스트리밍(DASH/mp4)을 위해 가장 광범위하게 지원되는 최신 형식으로 자동 트랜스코딩합니다.
 * 모든 데이터는 대상 버킷에 저장됩니다. 원할 때마다 서버를 파괴할 수 있습니다.
 * 초기 트랜스코딩을 위해 CPU 최적화 인스턴스에서 처음 실행한 다음 \
    on a much cheaper instance for 24/7/365 service.
 * 완전히 암호화된 저장소 지원(앱 측 암호화, 사용자만 키 보유)
 * 항상 소스에서 읽기 전용, 소스 내용을 변경하지 않음
 * 새 미디어 파일에 대한 자동 및 수동 스캔
 * 얼마나 비공개 또는 공개를 원하십니까? Yuebing 지원:
 * 완전히 비공개: 익명 사용자에게 미디어가 표시되지 않으며 승인된 이메일 주소만 계정을 만들 수 있습니다.
 * Semi-private: 익명 사용자에게 미디어가 표시되지 않지만 누구나 사용자 계정을 만들 수 있습니다.
 * 등록이 제한된 공개: 모든 사람에게 미디어가 표시되지만 승인된 이메일 주소만 계정을 만들 수 있습니다.
 * 완전 공개: 모든 사람에게 미디어가 표시되며 누구나 사용자 계정을 만들 수 있습니다.
 * 완전 국제화! 사용자에게 보이는 모든 텍스트(및 기타 로케일 관련 항목)는 현지화된 리소스에서 가져옵니다.
 * [커뮤니티를 돕고 Yuebing을 새로운 언어로 번역하세요!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * 모든 기능을 갖춘 관리 콘솔
 * 키워드 또는 태그 클라우드에서 비디오 검색
 * <a href="https://www.patreon.com/cobbzilla">**여러분의 지원과 함께 곧 출시 예정**</a> :
 * 더 많은 미디어 유형(오디오, 이미지 등) 지원
 * 사용자 업로드 미디어
 * 좋아요, 공유 및 푸시 알림
 * 새로운 "소스 유형": 또 다른 Yuebing 인스턴스!
    * Federation between friendly instances: unified search, user accounts, etc

 ## 익명 사용자 기능(사이트가 익명 방문자를 허용하도록 구성된 경우)
 * 미디어 찾아보기
 * 미디어 시청!
 * 계정 만들기(사이트가 계정 등록을 허용하도록 구성된 경우)

 ## 로그인 사용자 기능
 * 미디어 찾아보기
 * 미디어 시청!
 * 댓글 추가, 댓글 수정, 댓글 삭제!
 * 친구를 초대
 * 계정 정보 수정
 * 계정 삭제, 모든 댓글을 포함하여 귀하의 모든 항목 삭제

 ## 관리 사용자 기능
 * 미디어 메타데이터 편집, 썸네일 보기, 선택한 썸네일 변경
 * 미디어 변환 대기열 및 작업 상태 보기
 * 소스 미디어의 새로운 스캔 및 인덱스 시작

 ## 서버/백엔드 기능
 * 임시 친화적인 ZERO 영구/중요 데이터는 컨테이너 내에 저장됩니다.
 * 모든 내구성 데이터는 대상 버킷에 유지됩니다. 기본적으로 S3를 데이터베이스로 사용합니다.
 * 새로운 미디어에 대한 소스 버킷의 자동 주기적 스캔
 * 미디어 메타데이터 추가 및 변경 편집 내용은 대상 버킷에 저장되며 소스 미디어는 절대 수정되지 않습니다.
 * 구성 가능한 출력 프로필. 기본값은 여러 하위 프로필이 있는 DASH-mp4입니다.
 * 사용자 계정 정보는 대상 버킷에도 저장되며 선택적으로 암호화됩니다.
 * 암호화 키가 변경되면 관리자는 웹 관리 콘솔을 통해 사용자를 새 키로 마이그레이션할 수 있습니다.

 ## 설치
 docker, npm 또는 소스에서 직접 `yuebing` 설치하고 실행할 수 있습니다.

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

 ### 소스에서
 소스에서 실행하려면 nodejs v16+ 및 원사가 필요합니다.

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

 자세한 내용은 [개발자 문서](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md)를 참조하세요.

 ## 구성
 Yuebing을 가지고 놀려면 아무것도 구성하지 않고 시작하는 것이 좋습니다.
 `yuebing` 실행하면 시작할 때 최소 구성을 입력하라는 메시지가 표시됩니다.

 한동안 Yuebing을 실행할 계획이라면 [구성 문서](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md)에서 자세한 내용을 확인하세요.
 설정 방법에 대한 자세한 정보.

 ### nginx 구성
 Yuebing은 Nuxt 앱이며 nginx(또는 다른 웹 서버)를
 SSL, 필요한 경우 속도 제한 등을 처리하기 위해 전면에 있습니다.

 nginx를 사용하는 경우 사용할 수 있는 [샘플 구성](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf)이 있습니다.

 ## 이름이 유빙인 이유는?
 [우롱 토끼](https://en.wikipedia.org/wiki/Oolong_(토끼))는 사랑스럽고 유명했습니다.
 [초기 인터넷 밈](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). 우롱은 2003년에 사망했고,
 어떤 대인기 비디오 서비스가 존재하기 2년 전!

 Oolong의 후계자는 Yuebing으로 지명되었습니다. Yuebing은 Oolong만큼 유명하지는 않았지만 그게 문제가 되었나요?
 그럼에도 불구하고 Yuebing은 성공했습니다.

 더 흥미롭게도 유빙은 [월병](https://en.wikipedia.org/wiki/Mooncake)을 의미합니다.
 (중국어: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 일본어: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); 월병은 매우 맛있고 다음에서 찾을 수 있습니다.
 다양한 맛과 스타일. 유서 깊은 지역 스타일을 즐기거나 현대적인 이국적인 케이크를 맛보십시오.
 미지의 영역을 맛있게 탐험하는 제빵사 여러분! 진정으로 모두를 위한 유빙이 있습니다!

</pre>
