Yuebing 🥮
 ==========
 Yuebing to oprogramowanie typu open source do obsługi witryn hostingowych wideo.

 Yuebing automatycznie przygotowuje źródłowe filmy do przesyłania strumieniowego przy użyciu nowoczesnych formatów, które można odtwarzać na dowolnym urządzeniu
 urządzenie przez dowolne połączenie.

 Yuebing może używać Amazon S3 lub Backblaze B2 do przechowywania zaplecza i ma wiele zaawansowanych funkcji.

 ### Źródło
 * [yuebing na GitHub](https://github.com/cobbzilla/yuebing)
 * [yuebing na npm](https://www.npmjs.com/package/yuebing)
 * [yuebing na DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Przeczytaj to w innym języku
 Ten dokument README.md został przetłumaczony za pomocą [hokeylization](https://github.com/cobbzilla/hokeylization) na
 wiele języków.

 Na pewno nie jest idealnie, ale mam nadzieję, że lepsze to niż nic!

 [🇸🇦arabski](../ar/README.md)
 [🇧🇩 bengalski](../bn/README.md)
 [🇩🇪 niemiecki](../de/README.md)
 [🇺🇸 angielski](../en/README.md)
 [🇪🇸 hiszpański](../es/README.md)
 [🇫🇷 francuski](../fr/README.md)
 [🇹🇩Hausa](../ha/README.md)
 [🇮🇳 Hindi](../hi/README.md)
 [🇮🇩 indonezyjski](../id/README.md)
 [🇮🇹 włoski](../it/README.md)
 [🇯🇵 japoński](../ja/README.md)
 [🇰🇷Koreański](../ko/README.md)
 [🇮🇳 Marathi](../mr/README.md)
 [🇵🇱 polski](../pl/README.md)
 [🇧🇷 portugalski](../pt/README.md)
 [🇷🇺 rosyjski](../ru/README.md)
 [🇰🇪 Suahili](../sw/README.md)
 [🇵🇭 tagalog](../tl/README.md)
 [🇹🇷 Turecki](../tr/README.md)
 [🇵🇰 Urdu](../ur/README.md)
 [🇻🇳 wietnamski](../vi/README.md)
 [🇨🇳 chiński](../zh/README.md)
 ----

 # Spis treści
 * [Inspiracja](#Inspiracja)
 * [Funkcje](#Funkcje)
 * [Instalacja](#Instalacja)
 * [Docker](#Docker)
 * [pakiet npm](#pakiet npm)
 * [Ze źródła](#Ze-źródła)
 * [Konfiguracja](#Konfiguracja)
 * [konfiguracja nginx](#konfiguracja nginx)
 * [Dlaczego nazwa yuebing?](#Dlaczego-nazwa-yuebing?)

 ## Inspiracja
 W zeszłym roku moja mama poświęciła mnóstwo czasu (i pieniędzy!), aby uporządkować i zdigitalizować archiwum starych rodzinnych filmów.
 Niektóre z nich były dość stare, sięgające lat czterdziestych. Naprawdę piękne, klasyczne rzeczy.

 Chcieliśmy prywatnie podzielić się nimi z rodziną, ale *nie z wielką technologią*.
 Korzystanie z „darmowego” hostingu wideo od głównego dostawcy nie wchodziło w grę.

 Czego szukaliśmy:
 * Samodzielnie hostowany, ale całkowicie **łatwy w obsłudze** w obsłudze i utrzymaniu
 * Strumienie w nowoczesnych formatach wideo, w tym adaptacyjna szybkość transmisji bitów
 * Filmy są odtwarzane na dowolnym urządzeniu, komputerze stacjonarnym lub telefonie komórkowym
 * Dzięki połączeniu o dużej przepustowości jakość wideo jest niesamowita; Lepiej Być Nie Może
 * **Nawet przy złym połączeniu** odtwarzanie jest przyzwoitej jakości i *nie przeskakuje ani nie buforuje*
 * Szyfrowana pamięć masowa, dzięki czemu można z pewnym zaufaniem korzystać z rozwiązań do przechowywania w chmurze publicznej
 * Serwer bezstanowy: przechowuj wszystko, co ważne, w wysoce odpornej pamięci masowej
 * **Nie chcę się martwić o kopie zapasowe!**
 * * Miło było to mieć. Jak się okazuje, nic takiego nie ma. Yuebing tak!*
 * Po uruchomieniu potężnej instancji w celu transkodowania wszystkiego, zburz ją i uruchom coś tańszego na dłuższą metę
 * Możesz uruchomić Yuebing za mniej niż 10 USD miesięcznie; i miejmy nadzieję, że jeszcze mniej w przyszłości, gdy zoptymalizujemy ślad Yuebing

 Poświęciłem kilka tygodni na zbadanie, co tam jest. Zacząłem znacznie złagodzić moje wymagania i nadal
 nie mógł znaleźć nic porządnego. Przyjrzałem się kilku projektom open source, nie powiem, które, ponieważ wszystkie miały
 liczne rażące wady.

 Więc zdecydowałem, jak trudne to może być? Podłączasz S3 do ffmpeg, umieszczasz na nim przyzwoicie nowoczesną nakładkę i gotowe, prawda?
 ... cóż, uh, większość pracy zajęła kilka miesięcy, ale było zbyt zabawnie, żeby przestać!
 Mam nadzieję, że Tobie też się spodoba!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Sprawmy, by samoobsługowe witryny wideo były bardzo łatwe!**</a>

 ## Cechy
 * Przekształć wiadro filmów S3 (lub B2) w prywatną witrynę wideo dla przyjaciół i rodziny!
 * Podłącz jeden lub więcej zasobników źródłowych dostarczających surowe pliki multimedialne
 * YueBing automatycznie transkoduje źródłowe wideo do najnowszego i najszerzej obsługiwanego formatu strumieniowania z adaptacyjną przepływnością (DASH/mp4)
 * WSZYSTKIE dane są przechowywane w zasobniku docelowym; możesz zniszczyć serwer kiedy tylko chcesz
 * Przydatne do początkowego uruchamiania na instancji zoptymalizowanej pod kątem procesora w celu wstępnego transkodowania, a następnie uruchomienia \
    on a much cheaper instance for 24/7/365 service.
 * Obsługuje w pełni zaszyfrowaną pamięć masową (szyfrowanie po stronie aplikacji, tylko Ty masz klucz)
 * Zawsze tylko do odczytu ze źródła, nigdy nie zmieniaj treści źródła
 * Automatyczne i ręczne skanowanie w poszukiwaniu nowych plików multimedialnych
 * Jak prywatne lub publiczne chcesz rzeczy? Yuebing obsługuje:
 * Całkowicie prywatne: żadne media nie są pokazywane anonimowym użytkownikom, tylko zatwierdzone adresy e-mail mogą tworzyć konta
 * Półprywatny: żadne media nie są pokazywane anonimowym użytkownikom, ale każdy może utworzyć konto użytkownika
 * Publiczny z ograniczoną rejestracją: multimedia są widoczne dla wszystkich, ale tylko zatwierdzone adresy e-mail mogą tworzyć konta
 * Całkowicie publiczne: media wyświetlane wszystkim i każdy może utworzyć konto użytkownika
 * W pełni umiędzynarodowiony! Cały tekst widoczny dla użytkownika (i inne elementy specyficzne dla ustawień regionalnych) pochodzi ze zlokalizowanych zasobów
 * [Pomóż społeczności, przetłumacz Yuebing na nowe języki!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * W pełni funkcjonalna konsola administracyjna
 * Wyszukuj filmy według słów kluczowych lub z chmury tagów
 * <a href="https://www.patreon.com/cobbzilla">**Już wkrótce dzięki Twojemu wsparciu**</a> :
 * Obsługa większej liczby typów multimediów (audio, obrazy itp.)
 * Media przesłane przez użytkowników
 * Polubienia, akcje i powiadomienia push
 * Nowy „typ źródła”: kolejna instancja Yuebing!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Funkcja anonimowego użytkownika (jeśli witryna została skonfigurowana tak, aby zezwalać na anonimowych gości)
 * Przeglądaj multimedia
 * Oglądaj multimedia!
 * Utwórz konto (jeśli witryna została skonfigurowana tak, aby zezwalała na rejestrację konta)

 ## Funkcje zalogowanego użytkownika
 * Przeglądaj multimedia
 * Oglądaj multimedia!
 * Dodaj komentarz, edytuj swój komentarz, usuń swój komentarz!
 * Zaprosić przyjaciół
 * Edytuj informacje o koncie
 * Usuń konto, usuwa wszystko, co należy do Ciebie, w tym wszystkie Twoje komentarze

 ## Funkcje administratora
 * Edytuj metadane multimediów, przeglądaj miniatury, zmieniaj wybraną miniaturę
 * Zobacz kolejkę transformacji mediów i status zadania
 * Rozpocznij nowe skanowanie i indeksy nośników źródłowych

 ## Funkcje serwera/zaplecza
 * Przyjazne przejściowo, ZERO trwałych/ważnych danych jest przechowywanych w kontenerze.
 * Wszystkie trwałe dane są utrwalane w zasobniku docelowym; zasadniczo używamy S3 jako naszej bazy danych
 * Automatyczne okresowe skanowanie zasobnika źródłowego w poszukiwaniu nowych mediów
 * Dodawaj i zmieniaj metadane mediów; zmiany są przechowywane w zasobniku docelowym, nośniki źródłowe nigdy nie są modyfikowane
 * Konfigurowalne profile wyjściowe. Domyślnie jest to DASH-mp4 z wieloma podprofilami
 * Informacje o koncie użytkownika są również przechowywane w zasobniku docelowym, opcjonalnie zaszyfrowane
 * Jeśli klucz szyfrowania zostanie zmieniony, administrator może przeprowadzić migrację użytkowników do nowego klucza za pomocą internetowej konsoli administracyjnej

 ## Instalacja
 Możesz zainstalować i uruchomić `yuebing` przez docker, npm lub bezpośrednio ze źródła.

 ### Doker
 Jeśli masz dokera, możesz szybko zacząć korzystać z Yuebinga:

    docker run -it cobbzilla/yuebing

 ### pakiet npm
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### Ze źródła
 Aby uruchomić ze źródła, potrzebujesz nodejs v16 + i przędzy

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

 Zobacz [dokumenty dla programistów](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md), aby uzyskać więcej informacji

 ## Konfiguracja
 Aby pobawić się Yuebingiem, można go uruchomić bez konfigurowania czegokolwiek.
 Uruchom `yuebing` , a po uruchomieniu zostaniesz poproszony o wprowadzenie minimalnej konfiguracji.

 Jeśli planujesz uruchomić Yuebing przez jakiś czas, zobacz [dokumenty konfiguracyjne](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) dla
 więcej informacji na temat konfiguracji.

 ### konfiguracja nginx
 Yuebing to aplikacja Nuxt i oczekuje, że umieścisz nginx (lub inny serwer WWW) w
 z przodu do obsługi protokołu SSL, ograniczania szybkości w razie potrzeby itp.

 Jeśli używasz nginx, oto [przykładowa konfiguracja](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf), której możesz użyć.

 ## Dlaczego nazwa yuebing?
 [Królik Oolong](https://en.wikipedia.org/wiki/Oolong_(królik)) był uroczym i sławnym
 [wczesny mem internetowy](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong zmarł w 2003 roku,
 dwa lata przed istnieniem pewnego masowo popularnego serwisu wideo!

 Następca Oolonga został nazwany Yuebing. Yuebing nie był tak sławny jak Oolong, ale czy to miało jakiekolwiek znaczenie?
 Mimo to Yuebingowi się udało.

 Być może, co ciekawsze, yuebing oznacza [ciasto księżycowe](https://en.wikipedia.org/wiki/ciasto księżycowe)
 (Chiński: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 japoński: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); ciastka księżycowe są bardzo smaczne i można je znaleźć w
 różnorodność smaków i stylów. Ciesz się uświęconym tradycją stylem regionalnym lub spróbuj egzotycznego ciasta ze współczesności
 piekarzy, którzy eksplorują rozkosznie niezbadane terytorium! Jest naprawdę yuebing dla każdego!

</pre>
