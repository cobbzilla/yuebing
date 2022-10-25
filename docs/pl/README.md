Yuebing
 ===========
 Yuebing to oprogramowanie typu open source do prowadzenia witryn do hostingu wideo.

 Yuebing automatycznie przygotowuje filmy źródłowe do przesyłania strumieniowego przy użyciu nowoczesnych formatów, które można odtwarzać na dowolnym
 urządzenie przez dowolne połączenie.

 Yuebing może używać Amazon S3 lub Backblaze B2 do przechowywania zaplecza i ma wiele zaawansowanych funkcji.

 ### Źródło
 * [yuebing na GitHubie](https://github.com/cobbzilla/yuebing)
 * [yuebing na npm](https://www.npmjs.com/package/yuebing)
 * [yuebing na DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

 # Przeczytaj to w innym języku
 Ten dokument README.md został przetłumaczony przez [hokeylization](https://github.com/cobbzilla/hokeylization) na
 wiele języków.

 Jestem pewien, że nie jest idealny, ale mam nadzieję, że to lepsze niż nic!

 [🇸🇦 Arabski](../ar/README.md)
 [🇧🇩 bengalski](../bn/README.md)
 [🇩🇪 Niemiecki](../de/README.md)
 [🇺🇸 Polski](../en/README.md)
 [🇪🇸 Hiszpański](../es/README.md)
 [🇫🇷 Francuski](../fr/README.md)
 [🇹🇩 Hausa](../ha/README.md)
 [🇮🇳 hindi](../hi/README.md)
 [🇮🇩 Indonezyjski](../id/README.md)
 [🇮🇹 Włoski](../it/README.md)
 [🇯🇵 Japoński](../ja/README.md)
 [🇰🇷 Koreański](../ko/README.md)
 [🇮🇳 Maranthi](../mr/README.md)
 [🇵🇱 Polski](../pl/README.md)
 [🇧🇷 Portugalski](../pt/README.md)
 [🇷🇺 Rosyjski](../ru/README.md)
 [🇰🇪 Suahili](../sw/README.md)
 [🇵🇭 Tagalog](../tl/README.md)
 [🇹🇷 Turecki](../tr/README.md)
 [🇵🇰 Urdu](../ur/README.md)
 [🇻🇳 Wietnamski](../vi/README.md)
 [🇨🇳 chiński](../zh/README.md)
 ----

 # Zawartość
 * [Inspiracja](#Inspiracja)
 * [Funkcje](#Funkcje)
 * [Instalacja](#Instalacja)
 * [Docker](#Docker)
 * [pakiet npm](#pakiet-npm)
 * [Od źródła](#Od-źródła)
 * [Konfiguracja](#Konfiguracja)
 * [konfiguracja nginx](#konfiguracja nginx)
 * [Dlaczego nazwa yuebing?](#Dlaczego nazwa-yuebing?)

 ## Inspiracja
 W zeszłym roku moja mama poświęciła mnóstwo czasu (i pieniędzy!) na uporządkowanie i digitalizację archiwum starych rodzinnych filmów.
 Niektóre z nich były dość stare, sięgały lat czterdziestych. Naprawdę piękne, klasyczne rzeczy.

 Chcieliśmy podzielić się nimi prywatnie z rodziną, ale *nie z wielkimi technologiami*.
 Wybór „darmowego” hostingu wideo od dużego dostawcy nie wchodził w grę.

 Czego szukaliśmy:
 * Samodzielny, ale całkowicie **łatwy w obsłudze** w obsłudze i utrzymaniu
 * Strumienie w nowoczesnych formatach wideo, w tym adaptacyjna szybkość transmisji bitów
 * Filmy są odtwarzane na dowolnym urządzeniu, komputerze lub telefonie komórkowym
 * Dzięki połączeniu o dużej przepustowości jakość wideo jest niesamowita; Lepiej Być Nie Może
 * **Nawet przy złym połączeniu** odtwarzanie jest przyzwoitej jakości i *nie przeskakuje ani nie buforuje*
 * Szyfrowana pamięć masowa, dzięki czemu można z pewną pewnością korzystać z rozwiązań do przechowywania w chmurze publicznej
 * Serwer bezstanowy: zachowaj wszystko, co ważne w pamięci masowej, która jest wysoce odporna
 * **Nie chcę się martwić o kopie zapasowe!**
 * *Miło było to mieć. Jak się okazuje, nic takiego nie ma. Yuebing tak!*
 * Po uruchomieniu potężnej instancji do transkodowania wszystkiego, zburz ją i uruchom coś tańszego na dłuższą metę
 * Możesz uruchomić Yuebing za mniej niż 10 USD/miesiąc; i miejmy nadzieję, że jeszcze mniej w przyszłości, gdy zoptymalizujemy ślad Yuebing

 Kilka tygodni zajęło mi zbadanie tego, co tam jest. Zacząłem znacznie rozluźniać moje wymagania, a mimo to
 nie mogłem znaleźć nic przyzwoitego. Przyjrzałem się kilku projektom open source, nie mówię które, bo wszystkie miały
 wiele rażących wad.

 Więc zdecydowałem, jak trudne może być? Podłączasz S3 do ffmpeg, umieszczasz na nim przyzwoicie nowoczesny frontend i gotowe, prawda?
 ... cóż, większość pracy zajęła kilka miesięcy, ale przerwanie było zbyt zabawne!
 Mam nadzieję, że Tobie też się spodoba!

 ### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Zróbmy bardzo proste hostowanie witryn wideo!**</a>

 ## Cechy
 * Przekształć wiadro filmów S3 (lub B2) w prywatną witrynę wideo dla przyjaciół i rodziny!
 * Połącz jeden lub więcej zasobników źródłowych z plikami raw media
 * Yuebing automatycznie transkoduje filmy źródłowe do najnowszego i najszerzej obsługiwanego formatu do przesyłania strumieniowego z adaptacyjną szybkością transmisji bitów (DASH/mp4)
 * WSZYSTKIE dane są przechowywane w zasobniku docelowym; możesz zniszczyć serwer, kiedy tylko chcesz
 * Przydatne do uruchomienia początkowo na instancji zoptymalizowanej pod kątem procesora w celu wstępnego transkodowania, a następnie uruchom \
    on a much cheaper instance for 24/7/365 service.
 * Obsługuje w pełni zaszyfrowane przechowywanie (szyfrowanie po stronie aplikacji, tylko Ty masz klucz)
 * Zawsze tylko do odczytu ze źródła, nigdy nie zmieniaj zawartości źródła
 * Automatyczne i ręczne skanowanie w poszukiwaniu nowych plików multimedialnych
 * Jak prywatne lub publiczne chcesz rzeczy? Yuebing obsługuje:
 * Całkowicie prywatne: żadne media nie są pokazywane anonimowym użytkownikom, tylko zatwierdzone adresy e-mail mogą tworzyć konta
 * Półprywatne: żadne media nie są pokazywane anonimowym użytkownikom, ale każdy może utworzyć konto użytkownika
 * Publiczne z ograniczoną rejestracją: media pokazywane wszystkim, ale tylko zatwierdzone adresy e-mail mogą tworzyć konta
 * Całkowicie publiczne: media pokazywane wszystkim i każdy może utworzyć konto użytkownika
 * W pełni umiędzynarodowiony! Cały tekst widoczny dla użytkownika (i inne rzeczy specyficzne dla lokalizacji) pochodzi ze zlokalizowanych zasobów
 * [Pomóż społeczności, przetłumacz Yuebing na nowe języki!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
 * W pełni funkcjonalna konsola administracyjna
 * Wyszukuj filmy według słów kluczowych lub z chmury tagów
 * <a href="https://www.patreon.com/cobbzilla">**Wkrótce z Twoim wsparciem**</a> :
 * Obsługa większej liczby typów mediów (audio, obrazy itp.)
 * Media przesłane przez użytkownika
 * Polubienia, udostępnienia i powiadomienia push
 * Nowy "typ źródła": kolejna instancja Yuebinga!
    * Federation between friendly instances: unified search, user accounts, etc

 ## Funkcja anonimowego użytkownika (jeśli witryna została skonfigurowana tak, aby zezwalać na anonimowych odwiedzających)
 * Przeglądaj multimedia
 * Oglądaj media!
 * Utwórz konto (jeśli witryna została skonfigurowana, aby umożliwić rejestrację konta)

 ## Funkcje zalogowanego użytkownika
 * Przeglądaj multimedia
 * Oglądaj media!
 * Dodaj komentarz, edytuj swój komentarz, usuń swój komentarz!
 * Zaprosić przyjaciół
 * Edytuj informacje o koncie
 * Usuń konto, usuwa wszystko, co należy do Ciebie, w tym wszystkie komentarze

 ## Funkcje administratora
 * Edytuj metadane multimediów, przeglądaj miniatury, zmień wybraną miniaturę
 * Zobacz kolejkę transformacji mediów i status zadania
 * Rozpocznij nowe skanowanie i indeksy mediów źródłowych

 ## Funkcje serwera/zaplecza
 * Przyjazne dla przejściowych, ZERO trwałych/ważnych danych jest przechowywanych w kontenerze.
 * Wszystkie trwałe dane są utrwalane w zasobniku docelowym; zasadniczo używamy S3 jako naszej bazy danych
 * Automatyczne okresowe skanowanie zasobnika źródłowego w poszukiwaniu nowych mediów
 * Dodawaj i zmieniaj metadane mediów; zmiany są przechowywane w zasobniku docelowym, media źródłowe nigdy nie są modyfikowane
 * Konfigurowalne profile wyjściowe. Domyślnie jest to DASH-mp4 z wieloma podprofilami
 * Informacje o koncie użytkownika są również przechowywane w zasobniku docelowym, opcjonalnie zaszyfrowane
 * Jeśli klucz szyfrowania zostanie zmieniony, administrator może przenieść użytkowników do nowego klucza za pomocą konsoli administratora sieci

 ## Instalacja
 Możesz zainstalować i uruchomić `yuebing` przez docker, npm lub bezpośrednio ze źródeł.

 ### Doker
 Jeśli masz platformę dokującą, możesz szybko rozpocząć korzystanie z Yuebing:

    docker run -it cobbzilla/yuebing

 ### pakiet npm
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

 ### Ze źródła
 Aby uruchomić ze źródła, potrzebujesz nodejs v16+ i przędzy

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

 Więcej informacji znajdziesz w [dokumentacji programistów](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md)

 ## Konfiguracja
 Aby bawić się z Yuebingiem, dobrze jest uruchomić go bez konfigurowania czegokolwiek.
 Uruchom `yuebing` , a po uruchomieniu zostaniesz poproszony o wprowadzenie minimalnej konfiguracji.

 Jeśli planujesz uruchomić Yuebing przez jakiś czas, zapoznaj się z [dokumentacją konfiguracyjną](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md)
 więcej informacji na temat konfiguracji.

 ### konfiguracja nginx
 Yuebing to aplikacja Nuxt i oczekuje, że umieścisz nginx (lub inny serwer WWW) w
 z przodu, aby obsługiwać SSL, w razie potrzeby ograniczanie szybkości itp.

 Jeśli używasz nginx, oto [przykładowa konfiguracja](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf), której możesz użyć.

 ## Dlaczego nazwa yuebing?
 [królik Oolong](https://en.wikipedia.org/wiki/Oolong_(królik)) był uroczym i sławnym
 [wczesny mem internetowy](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong zmarł w 2003 roku,
 dwa lata przed pojawieniem się pewnej popularnej usługi wideo!

 Następca Oolonga został nazwany Yuebing. Yuebing nie był tak sławny jak Oolong, ale czy to w ogóle miało znaczenie?
 Mimo to Yuebing odniósł sukces.

 Co może być bardziej interesujące, yuebing oznacza [mooncake](https://en.wikipedia.org/wiki/Mooncake)
 (chiński: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
 japoński: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); mooncakes są bardzo smaczne i można je znaleźć w
 szeroka gama smaków i stylów. Ciesz się tradycyjnym regionalnym stylem lub spróbuj egzotycznego ciasta z czasów współczesnych
 piekarze, którzy odkrywają cudownie niezbadane terytorium! Naprawdę każdy znajdzie coś dla siebie!

</pre>
