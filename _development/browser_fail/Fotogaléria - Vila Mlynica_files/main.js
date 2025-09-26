// Vila Mlynica - Main JavaScript

// Language support
const translations = {
  sk: {
    // Navigation
    'nav-home': 'Domov',
    'nav-accommodation': 'Ubytovanie',
    'nav-restaurant': 'Reštaurácia',
    'nav-virtual-tour': 'Virtuálna prehliadka',
    'nav-contact': 'Kontakt',
    'nav-book-now': 'Rezervovať',

    // Booking modal
    'booking-modal-title': 'Rezervácia - Vila Mlynica',
    'booking-modal-close': 'Zavrieť',

    // Page meta
    'page-title': 'Vila Mlynica - Ubytovanie vo Vysokých Tatrách',
    'page-description': 'Moderné ubytovanie v srdci Vysokých Tatier. Vila Mlynica ponúka komfortné izby a výbornú reštauráciu s nádherným výhľadom na hory.',

    // Hero section
    'hero-title': 'Vitajte vo Vile Mlynic    'hero-explore': 'Preskúmať izby',
    'hero-book': 'Rezervovať teraz',
    'hero-comfort': 'Luxusný komfort',
    'hero-comfort-desc': 'Moderné izby s nádherným výhľadom na hory',
    'hero-view-rooms': 'Pozrieť izby',
    'hero-dining': 'Výnimočné stolovanie',
    'hero-dining-desc': 'Regionálne špeciality a medzinárodná kuchyňa',
    'hero-view-menu': 'Pozrieť menu',
    'hero-aerial-view': 'Letecký pohľad',
    'hero-aerial-desc': 'Objavte krásu našej vily z vtáčej perspektívy',
    'hero-view-tour': 'Virtuálna prehliadka',
    'hero-surroundings': 'Okolie vily',
    'hero-surroundings-desc': 'Nádherná príroda Vysokých Tatier okolo našej vily',
    'hero-view-gallery': 'Pozrieť galériu',
    'hero-experience': 'Zážitok z pobytu',
    'hero-experience-desc': 'Vychutnajte si nezabudnuteľné chvíle v našej vile',
    'hero-view-restaurant': 'Naša reštaurácia',

    // Rooms section
    'rooms-title': 'Naše izby',
    'rooms-subtitle': 'Komfortné ubytovanie s nádherným výhľadom na Vysoké Tatry',
    'room-standard-title': 'Štandardná dvojlôžková izba',
    'room-standard-desc': 'Priestranná izba s manželskou posteľou a výhľadom na hory. Ideálna pre páry.',
    'room-family-title': 'Rodinný apartmán',
    'room-family-desc': 'Veľkorysý apartmán s oddelenými spálňami, ideálny pre rodiny s deťmi.',
    'room-luxury-title': 'Luxusný apartmán',
    'room-luxury-desc': 'Prémiový apartmán s panoramatickým výhľadom a všetkým luxusným vybavením.',
    'room-capacity': 'Kapacita: 4-6 osôb',
    'room-kitchenette': 'Kuchynský kút',
    'room-balcony': 'Balkón',
    'room-premium': 'Prémiové vybavenie',
    'room-jacuzzi': 'Jacuzzi',
    'room-panoramic': 'Panoramatický výhľad',
    'room-view-details': 'Viac informácií',
    'rooms-view-all': 'Zobraziť všetky izby',

    // Restaurant section
    'restaurant-title': 'Naša reštaurácia',
    'restaurant-description': 'Vychutnajte si autentické slovenské špeciality pripravené z najčerstvejších miestnych ingrediencií. Naša reštaurácia ponúka nezabudnuteľný kulinársky zážitok s nádherným výhľadom na Vysoké Tatry.',
    'restaurant-local': 'Miestne ingrediencie',
    'restaurant-traditional': 'Tradičné recepty',
    'restaurant-international': 'Medzinárodná kuchyňa',
    'restaurant-wine': 'Výberové vína',
    'restaurant-view-menu': 'Pozrieť menu',

    // Offers section
    'offers-title': 'Špeciálne ponuky',
    'offers-subtitle': 'Objavte naše exkluzívne balíčky a akcie',
    'offer-romantic-title': 'Romantický víkend',
    'offer-romantic-desc': 'Dva dni plné romantiky s večerou pri sviečkach, vínom a relaxom v luxusnom apartmáne.',
    'offer-romantic-dinner': 'Romantická večera',
    'offer-romantic-wine': 'Fľaša vína',
    'offer-romantic-breakfast': 'Raňajky do postele',
    'offer-winter-title': 'Zimný pobyt',
    'offer-winter-desc': 'Perfektný balíček pre milovníkov zimných športov s blízkosťou k lyžiarskym strediskám.',
    'offer-winter-ski': 'Skipasy v cene',
    'offer-winter-equipment': 'Výpožička vybavenia',
    'offer-winter-hot': 'Horúce nápoje',

    // Contact section
    'contact-title': 'Kontaktujte nás',
    'contact-description': 'Máte otázky alebo chcete urobiť rezerváciu? Sme tu pre vás!',
    'contact-address-title': 'Adresa:',
    'contact-email-title': 'Email:',
    'contact-phone-title': 'Telefón:',
    'contact-form-firstname': 'Meno',
    'contact-form-lastname': 'Priezvisko',
    'contact-form-email': 'Email',
    'contact-form-subject': 'Predmet',
    'contact-form-message': 'Správa',
    'contact-form-submit': 'Odoslať správu',
    'contact-form-firstname-error': 'Prosím zadajte vaše meno.',
    'contact-form-lastname-error': 'Prosím zadajte vaše priezvisko.',
    'contact-form-email-error': 'Prosím zadajte platný email.',
    'contact-form-subject-error': 'Prosím vyberte predmet správy.',
    'contact-form-message-error': 'Prosím napíšte vašu správu.',
    'contact-form-subject-placeholder': 'Vyberte predmet...',
    'contact-form-subject-reservation': 'Rezervácia',
    'contact-form-subject-information': 'Informácie',
    'contact-form-subject-complaint': 'Sťažnosť',
    'contact-form-subject-other': 'Iné',

    // Footer
    'footer-tagline': 'Váš domov v srdci Vysokých Tatier',
    'footer-rights': 'Všetky práva vyhradené.'
  },

  en: {
    // Navigation
    'nav-home': 'Home',
    'nav-accommodation': 'Accommodation',
    'nav-restaurant': 'Restaurant',
    'nav-virtual-tour': 'Virtual Tour',
    'nav-contact': 'Contact',
    'nav-book-now': 'Book Now',

    // Booking modal
    'booking-modal-title': 'Booking - Vila Mlynica',
    'booking-modal-close': 'Close',

    // Page meta
    'page-title': 'Vila Mlynica - Accommodation in High Tatras',
    'page-description': 'Modern accommodation in the heart of High Tatras. Vila Mlynica offers comfortable rooms and excellent restaurant with beautiful mountain views.',

    // Hero section
    'hero-title': 'Welcome to Vila Mlynica',
    'hero-subtitle': 'Your home in the heart of High Tatras',
    'hero-explore': 'Explore Rooms',
    'hero-book': 'Book Now',
    'hero-comfort': 'Luxury Comfort',
    'hero-comfort-desc': 'Modern rooms with beautiful mountain views',
    'hero-view-rooms': 'View Rooms',
    'hero-dining': 'Exceptional Dining',
    'hero-dining-desc': 'Regional specialties and international cuisine',
    'hero-view-menu': 'View Menu',
    'hero-aerial-view': 'Aerial View',
    'hero-aerial-desc': 'Discover the beauty of our villa from bird\'s eye perspective',
    'hero-view-tour': 'Virtual Tour',
    'hero-surroundings': 'Villa Surroundings',
    'hero-surroundings-desc': 'Beautiful nature of High Tatras around our villa',
    'hero-view-gallery': 'View Gallery',
    'hero-experience': 'Stay Experience',
    'hero-experience-desc': 'Enjoy unforgettable moments at our villa',
    'hero-view-restaurant': 'Our Restaurant',

    // Rooms section
    'rooms-title': 'Our Rooms',
    'rooms-subtitle': 'Comfortable accommodation with beautiful views of High Tatras',
    'room-standard-title': 'Standard Double Room',
    'room-standard-desc': 'Spacious room with double bed and mountain view. Perfect for couples.',
    'room-family-title': 'Family Suite',
    'room-family-desc': 'Generous suite with separate bedrooms, ideal for families with children.',
    'room-luxury-title': 'Luxury Suite',
    'room-luxury-desc': 'Premium suite with panoramic view and all luxury amenities.',
    'room-capacity': 'Capacity: 4-6 persons',
    'room-kitchenette': 'Kitchenette',
    'room-balcony': 'Balcony',
    'room-premium': 'Premium amenities',
    'room-jacuzzi': 'Jacuzzi',
    'room-panoramic': 'Panoramic view',
    'room-view-details': 'More Information',
    'rooms-view-all': 'View All Rooms',

    // Restaurant section
    'restaurant-title': 'Our Restaurant',
    'restaurant-description': 'Enjoy authentic Slovak specialties prepared from the freshest local ingredients. Our restaurant offers an unforgettable culinary experience with beautiful views of High Tatras.',
    'restaurant-local': 'Local ingredients',
    'restaurant-traditional': 'Traditional recipes',
    'restaurant-international': 'International cuisine',
    'restaurant-wine': 'Selected wines',
    'restaurant-view-menu': 'View Menu',

    // Offers section
    'offers-title': 'Special Offers',
    'offers-subtitle': 'Discover our exclusive packages and deals',
    'offer-romantic-title': 'Romantic Weekend',
    'offer-romantic-desc': 'Two days full of romance with candlelight dinner, wine and relaxation in luxury suite.',
    'offer-romantic-dinner': 'Romantic dinner',
    'offer-romantic-wine': 'Bottle of wine',
    'offer-romantic-breakfast': 'Breakfast in bed',
    'offer-winter-title': 'Winter Stay',
    'offer-winter-desc': 'Perfect package for winter sports lovers with proximity to ski resorts.',
    'offer-winter-ski': 'Ski passes included',
    'offer-winter-equipment': 'Equipment rental',
    'offer-winter-hot': 'Hot beverages',

    // Contact section
    'contact-title': 'Contact Us',
    'contact-description': 'Have questions or want to make a reservation? We are here for you!',
    'contact-address-title': 'Address:',
    'contact-email-title': 'Email:',
    'contact-phone-title': 'Phone:',
    'contact-form-firstname': 'First Name',
    'contact-form-lastname': 'Last Name',
    'contact-form-email': 'Email',
    'contact-form-subject': 'Subject',
    'contact-form-message': 'Message',
    'contact-form-submit': 'Send Message',
    'contact-form-firstname-error': 'Please enter your first name.',
    'contact-form-lastname-error': 'Please enter your last name.',
    'contact-form-email-error': 'Please enter a valid email.',
    'contact-form-subject-error': 'Please select a subject.',
    'contact-form-message-error': 'Please write your message.',
    'contact-form-subject-placeholder': 'Select subject...',
    'contact-form-subject-reservation': 'Reservation',
    'contact-form-subject-information': 'Information',
    'contact-form-subject-complaint': 'Complaint',
    'contact-form-subject-other': 'Other',

    // Footer
    'footer-tagline': 'Your home in the heart of High Tatras',
    'footer-rights': 'All rights reserved.'
  },

  hu: {
    // Navigation
    'nav-home': 'Főoldal',
    'nav-accommodation': 'Szállás',
    'nav-restaurant': 'Étterem',
    'nav-virtual-tour': 'Virtuális túra',
    'nav-contact': 'Kapcsolat',
    'nav-book-now': 'Foglalás',

    // Booking modal
    'booking-modal-title': 'Foglalás - Vila Mlynica',
    'booking-modal-close': 'Bezárás',

    // Page meta
    'page-title': 'Vila Mlynica - Szállás a Magas-Tátrában',
    'page-description': 'Modern szállás a Magas-Tátra szívében. A Vila Mlynica kényelmes szobákat és kiváló éttermet kínál gyönyörű hegyi kilátással.',

    // Hero section
    'hero-title': 'Üdvözöljük a Vila Mlynicában',
    'hero-subtitle': 'Az otthonuk a Magas-Tátra szívében',
    'hero-explore': 'Szobák felfedezése',
    'hero-book': 'Foglalás most',
    'hero-comfort': 'Luxus kényelem',
    'hero-comfort-desc': 'Modern szobák gyönyörű hegyi kilátással',
    'hero-view-rooms': 'Szobák megtekintése',
    'hero-dining': 'Kivételes étkezés',
    'hero-dining-desc': 'Regionálne specialitások és nemzetközi konyha',
    'hero-view-menu': 'Menü megtekintése',
    'hero-aerial-view': 'Légi kilátás',
    'hero-aerial-desc': 'Fedezze fel villánk szépségét madártávlatból',
    'hero-view-tour': 'Virtuálna prehliadka',
    'hero-surroundings': 'Villa környezete',
    'hero-surroundings-desc': 'A Magas-Tátra gyönyörű természete villánk körül',
    'hero-view-gallery': 'Galéria megtekintése',
    'hero-experience': 'Tartózkodás élménye',
    'hero-experience-desc': 'Élvezze a felejthetetlen pillanatokat villánkban',
    'hero-view-restaurant': 'Éttermünk',

    // Rooms section
    'rooms-title': 'Szobáink',
    'rooms-subtitle': 'Kényelmes szállás gyönyörű kilátással a Magas-Tátrára',
    'room-standard-title': 'Standard kétágyas szoba',
    'room-standard-desc': 'Tágas szoba franciaággyal és hegyi kilátással. Tökéletes párok számára.',
    'room-family-title': 'Családi lakosztály',
    'room-family-desc': 'Bőséges lakosztály külön hálószobákkal, ideális gyermekes családok számára.',
    'room-luxury-title': 'Luxus lakosztály',
    'room-luxury-desc': 'Prémium lakosztály panoráma kilátással és minden luxus felszereléssel.',
    'room-capacity': 'Kapacitás: 4-6 fő',
    'room-kitchenette': 'Konyhasarok',
    'room-balcony': 'Erkély',
    'room-premium': 'Prémium felszerelés',
    'room-jacuzzi': 'Jacuzzi',
    'room-panoramic': 'Panoráma kilátás',
    'room-view-details': 'További információk',
    'rooms-view-all': 'Összes szoba megtekintése',

    // Restaurant section
    'restaurant-title': 'Éttermünk',
    'restaurant-description': 'Élvezze az autentikus szlovák specialitásokat, amelyeket a legfrissebb helyi alapanyagokból készítünk. Éttermünk felejthetetlen kulináris élményt nyújt a Magas-Tátra gyönyörű kilátásával.',
    'restaurant-local': 'Helyi alapanyagok',
    'restaurant-traditional': 'Hagyományos receptek',
    'restaurant-international': 'Nemzetközi konyha',
    'restaurant-wine': 'Válogatott borok',
    'restaurant-view-menu': 'Menü megtekintése',

    // Offers section
    'offers-title': 'Különleges ajánlatok',
    'offers-subtitle': 'Fedezze fel exkluzív csomagjainkat és akcióinkat',
    'offer-romantic-title': 'Romantikus hétvége',
    'offer-romantic-desc': 'Két nap tele romantikával, gyertyafényes vacsorával, borral és relaxációval luxus lakosztályban.',
    'offer-romantic-dinner': 'Romantikus vacsora',
    'offer-romantic-wine': 'Egy üveg bor',
    'offer-romantic-breakfast': 'Reggeli az ágyban',
    'offer-winter-title': 'Téli tartózkodás',
    'offer-winter-desc': 'Tökéletes csomag téli sportok szerelmeseinek, síközpontok közelében.',
    'offer-winter-ski': 'Síbérletek az árban',
    'offer-winter-equipment': 'Felszerelés kölcsönzés',
    'offer-winter-hot': 'Forró italok',

    // Contact section
    'contact-title': 'Kapcsolat',
    'contact-description': 'Kérdései vannak alebo foglalni szeretne? Itt vagyunk Önnek!',
    'contact-address-title': 'Cím:',
    'contact-email-title': 'Email:',
    'contact-phone-title': 'Telefon:',
    'contact-form-firstname': 'Keresztnév',
    'contact-form-lastname': 'Vezetéknév',
    'contact-form-email': 'Email',
    'contact-form-subject': 'Tárgy',
    'contact-form-message': 'Üzenet',
    'contact-form-submit': 'Üzenet küldése',
    'contact-form-firstname-error': 'Kérjük, adja meg keresztnevét.',
    'contact-form-lastname-error': 'Kérjük, adja meg vezetéknevét.',
    'contact-form-email-error': 'Kérjük, adjon meg érvényes email címet.',
    'contact-form-subject-error': 'Kérjük, válasszon tárgyat.',
    'contact-form-message-error': 'Kérjük, írja meg üzenetét.',
    'contact-form-subject-placeholder': 'Válasszon tárgyat...',
    'contact-form-subject-reservation': 'Foglalás',
    'contact-form-subject-information': 'Információ',
    'contact-form-subject-complaint': 'Panasz',
    'contact-form-subject-other': 'Egyéb',

    // Footer
    'footer-tagline': 'Az otthonuk a Magas-Tátra szívében',
    'footer-rights': 'Minden jog fenntartva.'
  },

  pl: {
    // Navigation
    'nav-home': 'Strona główna',
    'nav-accommodation': 'Zakwaterowanie',
    'nav-restaurant': 'Restauracja',
    'nav-virtual-tour': 'Wirtualny spacer',
    'nav-contact': 'Kontakt',
    'nav-book-now': 'Zarezerwuj',

    // Booking modal
    'booking-modal-title': 'Rezerwacja - Vila Mlynica',
    'booking-modal-close': 'Zamknij',

    // Page meta
    'page-title': 'Vila Mlynica - Zakwaterowanie w Wysokich Tatrach',
    'page-description': 'Nowoczesne zakwaterowanie w sercu Wysokich Tatr. Vila Mlynica oferuje komfortowe pokoje i doskonałą restaurację z pięknym widokiem na góry.',

    // Hero section
    'hero-title': 'Witamy w Vila Mlynica',
    'hero-subtitle': 'Twój dom w sercu Wysokich Tatr',
    'hero-explore': 'Poznaj pokoje',
    'hero-book': 'Zarezerwuj teraz',
    'hero-comfort': 'Luksusowy komfort',
    'hero-comfort-desc': 'Nowoczesne pokoje z pięknym widokiem na góry',
    'hero-view-rooms': 'Zobacz pokoje',
    'hero-dining': 'Wyjątkowe posiłki',
    'hero-dining-desc': 'Regionalne specjały i kuchnia międzynarodowa',
    'hero-view-menu': 'Zobacz menu',
    'hero-aerial-view': 'Widok z lotu ptaka',
    'hero-aerial-desc': 'Odkryj piękno naszej willi z perspektywy ptaka',
    'hero-view-tour': 'Wirtualny spacer',
    'hero-surroundings': 'Otoczenie willi',
    'hero-surroundings-desc': 'Piękna przyroda Wysokich Tatr wokół naszej willi',
    'hero-view-gallery': 'Zobacz galerię',
    'hero-experience': 'Doświadczenie pobytu',
    'hero-experience-desc': 'Ciesz się niezapomnianymi chwilami w naszej willi',
    'hero-view-restaurant': 'Nasza restauracja',

    // Rooms section
    'rooms-title': 'Nasze pokoje',
    'rooms-subtitle': 'Komfortowe zakwaterowanie z pięknym widokiem na Wysokie Tatry',
    'room-standard-title': 'Standardowy pokój dwuosobowy',
    'room-standard-desc': 'Przestronny pokój z łożem małżeńskim i widokiem na góry. Idealny dla par.',
    'room-family-title': 'Apartament rodzinny',
    'room-family-desc': 'Przestronny apartament z oddzielnymi sypialniami, idealny dla rodzin z dziećmi.',
    'room-luxury-title': 'Apartament luksusowy',
    'room-luxury-desc': 'Ekskluzywny apartament z panoramicznym widokiem i wszystkimi luksusowymi udogodnieniami.',
    'room-capacity': 'Pojemność: 4-6 osób',
    'room-kitchenette': 'Aneks kuchenny',
    'room-balcony': 'Balkon',
    'room-premium': 'Wyposażenie premium',
    'room-jacuzzi': 'Jacuzzi',
    'room-panoramic': 'Widok panoramiczny',
    'room-view-details': 'Więcej informacji',
    'rooms-view-all': 'Zobacz wszystkie pokoje',

    // Restaurant section
    'restaurant-title': 'Nasza restauracja',
    'restaurant-description': 'Ciesz się autentycznymi słowackimi specjałami przygotowanymi z najświeższych lokalnych składników. Nasza restauracja oferuje niezapomniane doznania kulinarne z pięknym widokiem na Wysokie Tatry.',
    'restaurant-local': 'Lokalne składniki',
    'restaurant-traditional': 'Tradycyjne przepisy',
    'restaurant-international': 'Kuchnia międzynarodowa',
    'restaurant-wine': 'Wybrane wina',
    'restaurant-view-menu': 'Zobacz menu',

    // Offers section
    'offers-title': 'Oferty specjalne',
    'offers-subtitle': 'Odkryj nasze ekskluzywne pakiety i promocje',
    'offer-romantic-title': 'Romantyczny weekend',
    'offer-romantic-desc': 'Dwa dni pełne romantyzmu z kolacją przy świecach, winem i relaksem w luksusowym apartamencie.',
    'offer-romantic-dinner': 'Romantyczna kolacja',
    'offer-romantic-wine': 'Butelka wina',
    'offer-romantic-breakfast': 'Śniadanie do łóżka',
    'offer-winter-title': 'Pobyt zimowy',
    'offer-winter-desc': 'Idealny pakiet dla miłośników sportów zimowych z bliskością do stoków narciarskich.',
    'offer-winter-ski': 'Karnety narciarskie w cenie',
    'offer-winter-equipment': 'Wypożyczenie sprzętu',
    'offer-winter-hot': 'Gorące napoje',

    // Contact section
    'contact-title': 'Skontaktuj się z nami',
    'contact-description': 'Masz pytania alebo chcesz dokonać rezerwacji? Jesteśmy tu dla Ciebie!',
    'contact-address-title': 'Adres:',
    'contact-email-title': 'Email:',
    'contact-phone-title': 'Telefon:',
    'contact-form-firstname': 'Imię',
    'contact-form-lastname': 'Nazwisko',
    'contact-form-email': 'Email',
    'contact-form-subject': 'Temat',
    'contact-form-message': 'Wiadomość',
    'contact-form-submit': 'Wyślij wiadomość',
    'contact-form-firstname-error': 'Proszę podać swoje imię.',
    'contact-form-lastname-error': 'Proszę podać swoje nazwisko.',
    'contact-form-email-error': 'Proszę podać prawidłowy email.',
    'contact-form-subject-error': 'Proszę wybrać temat wiadomości.',
    'contact-form-message-error': 'Proszę napisać swoją wiadomość.',
    'contact-form-subject-placeholder': 'Wybierz temat...',
    'contact-form-subject-reservation': 'Rezerwacja',
    'contact-form-subject-information': 'Informacje',
    'contact-form-subject-complaint': 'Reklamacja',
    'contact-form-subject-other': 'Inne',

    // Gallery section
    'gallery-title': 'Nasze otoczenie',
    'gallery-subtitle': 'Zobacz piękne otoczenie naszej willi w sercu Wysokich Tatr',
    'gallery-view-tour': 'Wirtualny spacer',

    // Footer
    'footer-tagline': 'Twój dom w sercu Wysokich Tatr',
    'footer-rights': 'Wszelkie prawa zastrzeżone.'
  },

  de: {
    // Navigation
    'nav-home': 'Startseite',
    'nav-accommodation': 'Unterkunft',
    'nav-restaurant': 'Restaurant',
    'nav-virtual-tour': 'Virtuelle Tour',
    'nav-contact': 'Kontakt',
    'nav-book-now': 'Buchen',

    // Booking modal
    'booking-modal-title': 'Buchung - Vila Mlynica',
    'booking-modal-close': 'Schließen',

    // Page meta
    'page-title': 'Vila Mlynica - Unterkunft in der Hohen Tatra',
    'page-description': 'Moderne Unterkunft im Herzen der Hohen Tatra. Vila Mlynica bietet komfortable Zimmer und ein ausgezeichnetes Restaurant mit herrlichem Blick auf die Berge.',

    // Hero section
    'hero-title': 'Willkommen in der Vila Mlynica',
    'hero-subtitle': 'Ihr Zuhause im Herzen der Hohen Tatra',
    'hero-explore': 'Zimmer erkunden',
    'hero-book': 'Jetzt buchen',
    'hero-comfort': 'Luxuriöser Komfort',
    'hero-comfort-desc': 'Moderne Zimmer mit herrlichem Blick auf die Berge',
    'hero-view-rooms': 'Zimmer ansehen',
    'hero-dining': 'Außergewöhnliche Küche',
    'hero-dining-desc': 'Regionale Spezialitäten und internationale Küche',
    'hero-view-menu': 'Speisekarte ansehen',
    'hero-aerial-view': 'Luftaufnahme',
    'hero-aerial-desc': 'Entdecken Sie die Schönheit unserer Villa aus der Vogelperspektive',
    'hero-view-tour': 'Virtuelle Tour',
    'hero-surroundings': 'Villa-Umgebung',
    'hero-surroundings-desc': 'Wunderschöne Natur der Hohen Tatra rund um unsere Villa',
    'hero-view-gallery': 'Galerie ansehen',
    'hero-experience': 'Aufenthaltserlebnis',
    'hero-experience-desc': 'Genießen Sie unvergessliche Momente in unserer Villa',
    'hero-view-restaurant': 'Unser Restaurant',

    // Rooms section
    'rooms-title': 'Unsere Zimmer',
    'rooms-subtitle': 'Komfortable Unterkunft mit herrlichem Blick auf die Hohe Tatra',
    'room-standard-title': 'Standard Doppelzimmer',
    'room-standard-desc': 'Geräumiges Zimmer mit Doppelbett und Bergblick. Ideal für Paare.',
    'room-family-title': 'Familien-Apartment',
    'room-family-desc': 'Großzügiges Apartment mit separaten Schlafzimmern, ideal für Familien mit Kindern.',
    'room-luxury-title': 'Luxus-Apartment',
    'room-luxury-desc': 'Exklusives Apartment mit Panoramablick und allen luxuriösen Annehmlichkeiten.',
    'room-capacity': 'Kapazität: 4-6 Personen',
    'room-kitchenette': 'Küchenzeile',
    'room-balcony': 'Balkon',
    'room-premium': 'Premium-Ausstattung',
    'room-jacuzzi': 'Jacuzzi',
    'room-panoramic': 'Panoramablick',
    'room-view-details': 'Mehr Informationen',
    'rooms-view-all': 'Alle Zimmer ansehen',

    // Restaurant section
    'restaurant-title': 'Unser Restaurant',
    'restaurant-description': 'Genießen Sie authentische slowakische Spezialitäten, zubereitet aus den frischesten lokalen Zutaten. Unser Restaurant bietet ein unvergessliches kulinarisches Erlebnis mit herrlichem Blick auf die Hohe Tatra.',
    'restaurant-local': 'Lokale Zutaten',
    'restaurant-traditional': 'Traditionelle Rezepte',
    'restaurant-international': 'Internationale Küche',
    'restaurant-wine': 'Ausgewählte Weine',
    'restaurant-view-menu': 'Speisekarte ansehen',

    // Offers section
    'offers-title': 'Spezielle Angebote',
    'offers-subtitle': 'Entdecken Sie unsere exklusiven Pakete und Aktionen',
    'offer-romantic-title': 'Romantisches Wochenende',
    'offer-romantic-desc': 'Zwei Tage voller Romantik mit Candlelight-Dinner, Wein und Entspannung im Luxus-Apartment.',
    'offer-romantic-dinner': 'Romantisches Abendessen',
    'offer-romantic-wine': 'Flasche Wein',
    'offer-romantic-breakfast': 'Frühstück ans Bett',
    'offer-winter-title': 'Winteraufenthalt',
    'offer-winter-desc': 'Das perfekte Paket für Wintersportliebhaber mit Nähe zu Skigebieten.',
    'offer-winter-ski': 'Skipässe inklusive',
    'offer-winter-equipment': 'Ausrüstungsverleih',
    'offer-winter-hot': 'Heiße Getränke',

    // Contact section
    'contact-title': 'Kontaktieren Sie uns',
    'contact-description': 'Haben Sie Fragen oder möchten Sie eine Buchung vornehmen? Wir sind für Sie da!',
    'contact-address-title': 'Adresse:',
    'contact-email-title': 'E-Mail:',
    'contact-phone-title': 'Telefon:',
    'contact-form-firstname': 'Vorname',
    'contact-form-lastname': 'Nachname',
    'contact-form-email': 'E-Mail',
    'contact-form-subject': 'Betreff',
    'contact-form-message': 'Nachricht',
    'contact-form-submit': 'Nachricht senden',
    'contact-form-firstname-error': 'Bitte geben Sie Ihren Vornamen ein.',
    'contact-form-lastname-error': 'Bitte geben Sie Ihren Nachnamen ein.',
    'contact-form-email-error': 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    'contact-form-subject-error': 'Bitte wählen Sie einen Betreff für Ihre Nachricht.',
    'contact-form-message-error': 'Bitte schreiben Sie Ihre Nachricht.',
    'contact-form-subject-placeholder': 'Betreff wählen...',
    'contact-form-subject-reservation': 'Buchung',
    'contact-form-subject-information': 'Informationen',
    'contact-form-subject-complaint': 'Beschwerde',
    'contact-form-subject-other': 'Sonstiges',

    // Gallery section
    'gallery-title': 'Unsere Umgebung',
    'gallery-subtitle': 'Sehen Sie die wunderschöne Umgebung unserer Villa im Herzen der Hohen Tatra',
    'gallery-view-tour': 'Virtuelle Tour',

    // Footer
    'footer-tagline': 'Ihr Zuhause im Herzen der Hohen Tatra',
    'footer-rights': 'Alle Rechte vorbehalten.'
  }
};

// Current language
let currentLanguage = 'sk';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

// Initialize application
function initializeApp() {
  initializeNavbar();
  initializeVideo();
  initializeScrollEffects();
  initializeContactForm();
  initializeBackToTop();
  initializeLanguage();
  initializeAnimations();
  initMobileOptimizations();
  initializeVideoOptimization();
}

// Navbar functionality
function initializeNavbar() {
  const navbar = document.getElementById('mainNavbar');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  // Navbar scroll effect (optimized for performance)
  let ticking = false;
  function updateNavbarOnScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (navbar) {
          if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });

  // Active link highlighting
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      // Add active class to clicked link
      this.classList.add('active');

      // Close mobile menu
      const navbarCollapse = document.getElementById('navbarNav');
      if (navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      }
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - navbar.offsetHeight;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Simple Video functionality for single hero video
function initializeVideo() {
  const videoContainer = document.querySelector('.hero-video-container');
  if (videoContainer) {
    const video = videoContainer.querySelector('video');

    if (video) {
      // Preload video for smooth playback
      video.preload = 'auto';

      // Set up video properties
      video.addEventListener('loadeddata', () => {
        video.currentTime = 0;
      });

      // Handle video loading errors
      video.addEventListener('error', function() {
        console.log('Video failed to load, showing fallback image');
        const fallbackImg = this.nextElementSibling;
        if (fallbackImg && fallbackImg.tagName === 'IMG') {
          fallbackImg.style.display = 'block';
          this.style.display = 'none';
        }
      });

      // Handle visibility changes (pause video when tab is not active)
      document.addEventListener('visibilitychange', function() {
        if (video) {
          if (document.hidden) {
            video.pause();
          } else {
            video.play().catch(error => {
              console.log('Video autoplay prevented:', error);
            });
          }
        }
      });

      // Optimize for mobile - reduce video quality on slow connections
      if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          video.preload = 'metadata';
        }
      }

      // Ensure video plays properly
      video.addEventListener('canplay', function() {
        if (this.paused) {
          this.play().catch(err => {
            console.log('Video autoplay prevented:', err);
          });
        }
      });

      // Start video after a short delay
      setTimeout(() => {
        video.play().catch(err => {
          console.log('Video autoplay prevented:', err);
        });
      }, 500);
    }
  }
}



// Video optimization and responsive behavior
function initializeVideoOptimization() {
  // Set initial dynamic viewport height
  setDynamicVH();

  // Eliminate empty spaces
  eliminateVideoSpaces();

  // Optimize video display
  optimizeVideoDisplay();

  // Adjust video heights
  adjustVideoHeight();

  // Set up event listeners for responsive behavior
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      setDynamicVH();
      eliminateVideoSpaces();
      adjustVideoHeight();
      optimizeVideoDisplay();
    }, 100);
  }, { passive: true });

  // Handle orientation changes
  window.addEventListener('orientationchange', function() {
    setTimeout(function() {
      setDynamicVH();
      eliminateVideoSpaces();
      adjustVideoHeight();
      optimizeVideoDisplay();
    }, 300);
  });

  // Ensure videos are properly sized when they load
  document.addEventListener('loadedmetadata', function(e) {
    if (e.target.tagName === 'VIDEO') {
      setTimeout(() => {
        eliminateVideoSpaces();
        adjustVideoHeight();
      }, 100);
    }
  }, true);

  // Handle visibility changes (when returning to tab)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      setTimeout(function() {
        setDynamicVH();
        eliminateVideoSpaces();
        adjustVideoHeight();
      }, 100);
    }
  });

  // Initial call after a short delay to ensure DOM is ready
  setTimeout(function() {
    setDynamicVH();
    eliminateVideoSpaces();
    adjustVideoHeight();
    optimizeVideoDisplay();
  }, 100);
}

// Dynamic viewport height calculation for mobile browsers
function setDynamicVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // Adjust dynamic vh based on device characteristics
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const aspectRatio = screenWidth / screenHeight;

  let dynamicVhMultiplier = 100;

  // Adjust based on screen size and orientation
  if (screenWidth <= 414) { // Small phones
    dynamicVhMultiplier = 65;
  } else if (screenWidth <= 576) { // Larger phones
    dynamicVhMultiplier = 70;
  } else if (screenWidth <= 768) { // Small tablets
    dynamicVhMultiplier = 85;
  } else if (screenWidth <= 1024) { // Tablets
    dynamicVhMultiplier = 95;
  }

  // Landscape adjustments
  if (aspectRatio > 1.5 && screenHeight <= 600) {
    dynamicVhMultiplier = 100;
  }

  // Very tall devices
  if (screenHeight > 900 && screenWidth <= 768) {
    dynamicVhMultiplier = 90;
  }

  const dynamicVh = vh * dynamicVhMultiplier;
  document.documentElement.style.setProperty('--dynamic-vh', `${dynamicVh}px`);
}

// Video aspect ratio optimization
function optimizeVideoDisplay() {
  const videos = document.querySelectorAll('.video-slide video, .hero-video-container video');

  videos.forEach(video => {
    // Ensure video loads properly
    video.addEventListener('loadedmetadata', function() {
      const videoAspectRatio = this.videoWidth / this.videoHeight;
      const screenAspectRatio = window.innerWidth / window.innerHeight;

      // Always use cover to prevent empty spaces
      this.style.objectFit = 'cover';
      this.style.objectPosition = 'center center';

      // Adjust position based on aspect ratios for better framing
      if (videoAspectRatio > screenAspectRatio * 1.2) {
        this.style.objectPosition = 'center center';
      } else if (videoAspectRatio < screenAspectRatio * 0.8) {
        this.style.objectPosition = 'center top';
      }

      // Ensure no empty spaces by setting exact dimensions
      const container = this.closest('.video-slide') || this.closest('.hero-video-container');
      if (container) {
        const containerHeight = container.offsetHeight;
        if (containerHeight > 0) {
          this.style.minHeight = `${containerHeight}px`;
          this.style.height = `${containerHeight}px`;
        }
      }
    });

    // Handle video loading errors
    video.addEventListener('error', function() {
      console.log('Video failed to load, showing fallback image');
      const fallbackImg = this.nextElementSibling;
      if (fallbackImg && fallbackImg.tagName === 'IMG') {
        fallbackImg.style.display = 'block';
        this.style.display = 'none';
      }
    });

    // Ensure video plays properly on mobile
    video.addEventListener('canplay', function() {
      if (this.paused) {
        this.play().catch(e => {
          console.log('Video autoplay prevented:', e);
        });
      }
    });
  });
}

// Responsive video height adjustment
function adjustVideoHeight() {
  const heroSection = document.querySelector('.hero-section');
  const videoContainer = document.querySelector('.hero-video-container');

  if (heroSection && videoContainer) {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const aspectRatio = viewportWidth / viewportHeight;

    // Calculate optimal height based on device characteristics
    let heightMultiplier = 1.0;

    if (viewportWidth <= 414) {
      heightMultiplier = 0.65;
    } else if (viewportWidth <= 576) {
      heightMultiplier = 0.70;
    } else if (viewportWidth <= 768) {
      heightMultiplier = 0.85;
    } else if (viewportWidth <= 1024) {
      heightMultiplier = 0.95;
    }

    // Landscape adjustments
    if (aspectRatio > 1.5 && viewportHeight <= 600) {
      heightMultiplier = 1.0;
    }

    // Very tall devices
    if (viewportHeight > 900 && viewportWidth <= 768) {
      heightMultiplier = 0.90;
    }

    const targetHeight = viewportHeight * heightMultiplier;

    // Apply styles to prevent empty spaces
    heroSection.style.minHeight = `${targetHeight}px`;
    heroSection.style.maxHeight = `${targetHeight}px`;
    heroSection.style.height = `${targetHeight}px`;

    videoContainer.style.minHeight = `${targetHeight}px`;
    videoContainer.style.maxHeight = `${targetHeight}px`;
    videoContainer.style.height = `${targetHeight}px`;

    const video = videoContainer.querySelector('video');
    const videoSlide = videoContainer.querySelector('.video-slide');

    if (video) {
      video.style.minHeight = `${targetHeight}px`;
      video.style.height = `${targetHeight}px`;
      video.style.maxHeight = `${targetHeight}px`;
      video.style.width = '100%';
      video.style.objectFit = 'cover';
      video.style.objectPosition = 'center center';
    }

    if (videoSlide) {
      videoSlide.style.minHeight = `${targetHeight}px`;
      videoSlide.style.height = `${targetHeight}px`;
      videoSlide.style.maxHeight = `${targetHeight}px`;
      videoSlide.style.overflow = 'hidden';
    }

    // Update CSS custom property for consistency
    document.documentElement.style.setProperty('--calculated-height', `${targetHeight}px`);
  }
}

// Scroll effects
function initializeScrollEffects() {
  // Add scroll-based animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);

  // Observe sections for animations
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  // Observe cards for staggered animations
  document.querySelectorAll('.card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    observer.observe(card);
  });
}

// Contact form functionality
function initializeContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate form
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    // Simulate form submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Odosielanie...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Show success message
      alert('Správa bola úspešne odoslaná!');

      // Reset form
      form.reset();
      form.classList.remove('was-validated');

      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });

  // Real-time validation
  form.querySelectorAll('.form-control, .form-select').forEach(input => {
    input.addEventListener('blur', function() {
      if (this.checkValidity()) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
      } else {
        this.classList.remove('is-valid');
        this.classList.add('is-invalid');
      }
    });
  });
}

// Back to top button
function initializeBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Language functionality
function initializeLanguage() {
  // Get language from localStorage or default to Slovak
  const savedLanguage = localStorage.getItem('vila-mlynica-language') || 'sk';
  changeLanguage(savedLanguage);
}

// Change language function
function changeLanguage(lang) {
  if (!translations[lang]) return;

  currentLanguage = lang;
  localStorage.setItem('vila-mlynica-language', lang);

  // Update HTML lang attribute
  document.documentElement.lang = lang;

  // Update current language display
  const currentLangElement = document.getElementById('currentLang');
  if (currentLangElement) {
    currentLangElement.textContent = lang.toUpperCase();
  }

  // Update all translatable elements
  document.querySelectorAll('[data-lang]').forEach(element => {
    const key = element.getAttribute('data-lang');
    if (translations[lang][key]) {
      if (element.tagName === 'INPUT' && element.type === 'text') {
        element.placeholder = translations[lang][key];
      } else if (element.tagName === 'OPTION') {
        element.textContent = translations[lang][key];
      } else {
        element.textContent = translations[lang][key];
      }
    }
  });

  // Update page title and meta description
  const title = document.querySelector('title[data-lang]');
  const description = document.querySelector('meta[name="description"][data-lang]');

  if (title && translations[lang]['page-title']) {
    title.textContent = translations[lang]['page-title'];
  }

  if (description && translations[lang]['page-description']) {
    description.setAttribute('content', translations[lang]['page-description']);
  }
}

// Animations
function initializeAnimations() {
  // Add entrance animations to cards
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    setTimeout(() => {
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// Enhanced Mobile Support and Touch Optimization
function initMobileOptimizations() {
  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isMobile || isTouch) {
    document.body.classList.add('mobile-device');

    // Add device-specific classes
    if (isIOS) document.body.classList.add('ios-device');
  }

  // Dynamic viewport height for mobile browsers (fixes iOS Safari issue)
  function setDynamicVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  setDynamicVH();

  // Handle viewport changes
  window.addEventListener('resize', setDynamicVH);
  window.addEventListener('orientationchange', () => {
    setTimeout(setDynamicVH, 500);
  });

  if (isMobile || isTouch) {
    // Optimize touch interactions
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('touchstart', function() {
        this.style.transform = 'scale(1.02)';
      });

      item.addEventListener('touchend', function() {
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
      });
    });

    // Prevent zoom on form inputs for iOS
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (input.style.fontSize === '' || parseFloat(input.style.fontSize) < 16) {
        input.style.fontSize = '16px';
      }
    });

    // Optimize video for mobile
    const video = document.querySelector('.hero-video-container video');
    if (video) {
      // Pause video when page is not visible (battery optimization)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          video.pause();
        } else if (video.paused) {
          video.play().catch(() => {});
        }
      });
    }
  }

  // Auto-close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    const navbar = document.getElementById('navbarNav');
    const toggler = document.querySelector('.navbar-toggler');

    if (navbar && navbar.classList.contains('show')) {
      if (!navbar.contains(e.target) && !toggler.contains(e.target)) {
        navbar.classList.remove('show');
        toggler.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Touch optimization for navigation links
  if (isTouch) {
    const navLinks = document.querySelectorAll('.nav-link, .btn');
    navLinks.forEach(link => {
      link.addEventListener('touchstart', function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      });

      link.addEventListener('touchend', function() {
        setTimeout(() => {
          this.style.backgroundColor = '';
        }, 150);
      });
    });
  }

  // Optimize image loading on mobile
  if (isMobile) {
    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
      img.loading = 'lazy';
    });
  }

  // Handle orientation changes
  window.addEventListener('orientationchange', function() {
    setTimeout(() => {
      // Recalculate carousel height if needed
      const carousel = document.querySelector('.hero-section');
      if (carousel) {
        carousel.style.height = window.innerHeight < 600 ? '60vh' : '80vh';
      }
    }, 500);
  });

  // Improve button accessibility on touch devices
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    });

    btn.addEventListener('touchend', function() {
      setTimeout(() => {
        this.style.transform = '';
      }, 100);
    });
  });
}

// Call mobile optimizations when DOM is ready
document.addEventListener('DOMContentLoaded', initMobileOptimizations);

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful');
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed');
      });
  });
}

// Export functions for use in other files
window.VilaMLynica = {
  changeLanguage,
  currentLanguage: () => currentLanguage,
  translations
};

// Eliminate empty spaces under videos
function eliminateVideoSpaces() {
  const heroSection = document.querySelector('.hero-section');
  const videoContainer = document.querySelector('.hero-video-container');

  if (heroSection) {
    // Remove any potential margins or padding that could create spaces
    heroSection.style.margin = '0';
    heroSection.style.padding = '0';
    heroSection.style.display = 'flex';
    heroSection.style.flexDirection = 'column';
  }

  if (videoContainer) {
    videoContainer.style.margin = '0';
    videoContainer.style.padding = '0';
    videoContainer.style.height = '100%';
    videoContainer.style.overflow = 'hidden';
    videoContainer.style.display = 'flex';
    videoContainer.style.alignItems = 'stretch';
    videoContainer.style.justifyContent = 'center';

    const videoSlide = videoContainer.querySelector('.video-slide');
    const video = videoContainer.querySelector('video');

    if (videoSlide) {
      videoSlide.style.margin = '0';
      videoSlide.style.padding = '0';
      videoSlide.style.width = '100%';
      videoSlide.style.height = '100%';
      videoSlide.style.display = 'flex';
      videoSlide.style.overflow = 'hidden';
    }

    if (video) {
      video.style.margin = '0';
      video.style.padding = '0';
      video.style.border = 'none';
      video.style.outline = 'none';
      video.style.display = 'block';
      video.style.verticalAlign = 'top';
      video.style.lineHeight = '0';
    }
  }

  // Force a reflow to apply changes
  heroSection?.offsetHeight;
}
