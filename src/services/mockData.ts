import { Category, Product, Post, Page, Order, PublicSetting, ProductAvailability } from '../types/database';

export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Vejce z volného chovu',
    slug: 'vejce',
    description: 'Čerstvá vejce od spokojených slepic z travnatého výběhu s pestrou stravou.',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'cat-2',
    name: 'Domácí zavařeniny & med',
    slug: 'domaci-potraviny',
    description: 'Povidla, marmelády z vlastního ovoce a poctivý včelí med bez přidané chemie.',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'cat-3',
    name: 'Sezónní ovoce & ořechy',
    slug: 'ovoce-zelenina',
    description: 'Sklizeň z našich sadů, záhonů a starých odrůd ovocných stromů.',
    sort_order: 3,
    is_active: true,
  },
  {
    id: 'cat-4',
    name: 'Pečení na zakázku',
    slug: 'peceni',
    description: 'Tradiční kynuté koláče a buchty pečené z našich vajec a poctivého másla.',
    sort_order: 4,
    is_active: true,
  },
  {
    id: 'cat-5',
    name: 'Přírodní bylinná kosmetika',
    slug: 'kosmetika',
    description: 'Ručně vyráběná mýdla a balzámy z bylin nasbíraných na okolních loukách.',
    sort_order: 5,
    is_active: true,
  },
  {
    id: 'cat-6',
    name: 'Dřevěné výrobky z dílny',
    slug: 'rukodelne',
    description: 'Masivní krájecí desky a kuchyňské doplňky z lokálního tvrdého dřeva.',
    sort_order: 6,
    is_active: true,
  },
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    category_id: 'cat-1',
    name: 'Čerstvá vejce z volného výběhu (10 ks)',
    slug: 'domaci-vejce-10ks',
    short_description: 'Balení 10 ks čerstvých vajec od slepic pasoucích se na zelené louce.',
    description: 'Naše slepice mají celodenní přístup k rozlehlému travnatému výběhu plnému jetele a bylin. Krmíme výhradně vlastním obilím, vojtěškou a minerály bez chemických příměsí a hormonů. Vejce mají sytě žlutý žloutek a pevnou skořápku.',
    price: 85,
    unit: 'balení (10 ks)',
    is_active: true,
    is_featured: true,
    is_seasonal: false,
    allow_preorder: true,
    preorder_limit: 100,
    is_made_to_order: false,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-1',
        product_id: 'prod-1',
        storage_path: 'products/eggs.jpg',
        url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=1000&auto=format&fit=crop',
        alt_text: 'Čerstvá domácí vejce v ošatce',
        is_primary: true,
        sort_order: 1,
      },
      {
        id: 'img-1-2',
        product_id: 'prod-1',
        storage_path: 'products/eggs-nest.jpg',
        url: 'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?q=80&w=1000&auto=format&fit=crop',
        alt_text: 'Slepice ve volném výběhu',
        is_primary: false,
        sort_order: 2,
      },
    ],
    inventory: {
      product_id: 'prod-1',
      quantity_on_hand: 28,
      quantity_reserved: 6,
      quantity_preordered: 0,
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'prod-2',
    category_id: 'cat-2',
    name: 'Květový med z lesních luk',
    slug: 'kvetovy-med-lesni',
    short_description: '100% surový nefiltrovaný med z našich vlastních včelstev na okraji doubravy.',
    description: 'Poctivý lesní a luční med vytáčený za studena. Obsahuje nektar z divokých malin, ostružin, lipových květů a lučního kvítí. Vyniká plnou květinovou chutí a přirozeným obsahem enzymů.',
    price: 210,
    unit: 'sklenice (950 g)',
    is_active: true,
    is_featured: true,
    is_seasonal: false,
    allow_preorder: false,
    is_made_to_order: false,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-2',
        product_id: 'prod-2',
        storage_path: 'products/honey.jpg',
        url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1000&auto=format&fit=crop',
        alt_text: 'Sklenice se zlatavým medem',
        is_primary: true,
        sort_order: 1,
      },
    ],
    inventory: {
      product_id: 'prod-2',
      quantity_on_hand: 14,
      quantity_reserved: 2,
      quantity_preordered: 0,
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'prod-3',
    category_id: 'cat-2',
    name: 'Staročeská švestková povidla bez cukru',
    slug: 'svestkova-povidla-bez-cukru',
    short_description: 'Tažená v měděném kotli více než 18 hodin pouze z vyzrálých švestek.',
    description: 'Tradiční receptura našich babiček. Povidla jsou vařena pomalu z odpeckovaných pozdních švestek z našeho starého sadu, bez přidaného cukru a konzervantů. Hustá, přirozeně sladkokyselá a voňavá.',
    price: 135,
    unit: 'sklenice (370 ml)',
    is_active: true,
    is_featured: false,
    is_seasonal: false,
    allow_preorder: false,
    is_made_to_order: false,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-3',
        product_id: 'prod-3',
        storage_path: 'products/jam.jpg',
        url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=1000&auto=format&fit=crop',
        alt_text: 'Domácí švestková povidla ve sklenici',
        is_primary: true,
        sort_order: 1,
      },
    ],
    inventory: {
      product_id: 'prod-3',
      quantity_on_hand: 9,
      quantity_reserved: 0,
      quantity_preordered: 0,
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'prod-4',
    category_id: 'cat-4',
    name: 'Kynutý borůvkový koláč s máslovou drobenkou',
    slug: 'kynuty-boruvkovy-kolac',
    short_description: 'Tradiční velký plech koláče z kynutého těsta s lesními borůvkami a máslem.',
    description: 'Pečeme na objednávku v den předání. Používáme čerstvá vejce z našeho chovu, farmářské máslo, špaldovou mouku a poctivou vrstvu borůvek bohatě posypanou křupavou máslovou drobenkou.',
    price: 420,
    unit: 'celý plech (~1.6 kg)',
    is_active: true,
    is_featured: true,
    is_seasonal: false,
    allow_preorder: false,
    is_made_to_order: true,
    lead_time_days_min: 1,
    lead_time_days_max: 3,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-4',
        product_id: 'prod-4',
        storage_path: 'products/cake.jpg',
        url: 'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop',
        alt_text: 'Čerstvě upečený borůvkový koláč s drobenkou',
        is_primary: true,
        sort_order: 1,
      },
    ],
    inventory: {
      product_id: 'prod-4',
      quantity_on_hand: 0,
      quantity_reserved: 0,
      quantity_preordered: 0,
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'prod-5',
    category_id: 'cat-3',
    name: 'Čerstvé zahradní jahody (předobjednávka)',
    slug: 'zahradni-jahody-predobjednavka',
    short_description: 'Sladké, voňavé jahody pěstované na slunném svahu bez pesticidů.',
    description: 'Přijímáme předobjednávky na první červnovou sklizeň našich velkoplodých jahod odrůdy Korona a Senga Sengana. Sbíráme brzy ráno v plné zralosti pro maximální chuť a šťavnatost.',
    price: 140,
    unit: 'košík (1 kg)',
    is_active: true,
    is_featured: true,
    is_seasonal: true,
    season_start_month: 6,
    season_end_month: 7,
    season_notes: 'Hlavní sklizeň probíhá od začátku do konce června podle slunečného počasí.',
    allow_preorder: true,
    preorder_limit: 80,
    expected_available_at: '2026-06-05',
    is_made_to_order: false,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-5',
        product_id: 'prod-5',
        storage_path: 'products/strawberries.jpg',
        url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=1000&auto=format&fit=crop',
        alt_text: 'Košík čerstvě natrhaných zralých jahod',
        is_primary: true,
        sort_order: 1,
      },
    ],
    inventory: {
      product_id: 'prod-5',
      quantity_on_hand: 0,
      quantity_reserved: 0,
      quantity_preordered: 24,
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'prod-6',
    category_id: 'cat-6',
    name: 'Masivní krájecí prkénko z ořešáku',
    slug: 'krajeci-prkenko-oresak',
    short_description: 'Ručně broušené kuchyňské prkénko ošetřené včelím voskem a lněným olejem.',
    description: 'Vyrobeno z jednoho kusu sušeného ořechového dřeva z naší zahrady. Každý kus má unikátní kresbu letokruhů a sražené hrany pro pohodlný úchop. Ošetřeno zdravotně nezávadným olejem a naším včelím voskem.',
    price: 850,
    unit: '1 ks (~40 × 25 cm)',
    is_active: true,
    is_featured: false,
    is_seasonal: false,
    allow_preorder: false,
    is_made_to_order: true,
    lead_time_days_min: 5,
    lead_time_days_max: 10,
    sort_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-6',
        product_id: 'prod-6',
        storage_path: 'products/cutting-board.jpg',
        url: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?q=80&w=1000&auto=format&fit=crop',
        alt_text: 'Dřevěné servírovací prkénko z masivního dřeva',
        is_primary: true,
        sort_order: 1,
      },
    ],
    inventory: {
      product_id: 'prod-6',
      quantity_on_hand: 0,
      quantity_reserved: 0,
      quantity_preordered: 0,
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'prod-7',
    category_id: 'cat-5',
    name: 'Bylinný měsíčkový balzám s včelím voskem',
    slug: 'mesickovy-balzam',
    short_description: 'Jemná mastička z květů měsíčku lékařského na suchou pokožku a ruce.',
    description: 'Květy měsíčku macerované v za studena lisovaném mandlovém oleji spojené s čistým včelím voskem z našich úlů. Bez parfemace a chemických přísad. Vynikající na namáhané ruce po práci na zahradě.',
    price: 165,
    unit: 'dóza (50 ml)',
    is_active: true,
    is_featured: false,
    is_seasonal: false,
    allow_preorder: false,
    is_made_to_order: false,
    sort_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-7',
        product_id: 'prod-7',
        storage_path: 'products/salve.jpg',
        url: 'https://images.unsplash.com/photo-1608248597359-00f3c5f49e48?q=80&w=1000&auto=format&fit=crop',
        alt_text: 'Přírodní bylinná mast a sušené bylinky',
        is_primary: true,
        sort_order: 1,
      },
    ],
    inventory: {
      product_id: 'prod-7',
      quantity_on_hand: 11,
      quantity_reserved: 1,
      quantity_preordered: 0,
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'prod-8',
    category_id: 'cat-3',
    name: 'Podzimní jablka Rubinola (ze starého sadu)',
    slug: 'podzimni-jablka-rubinola',
    short_description: 'Šťavnatá, přirozeně sladká jablka pěstovaná bez syntetických postřiků.',
    description: 'Oblíbená česká odrůda odolná vůči strupovitosti. Vhodná k přímému jídlu, moštování i sušení na křížaly.',
    price: 45,
    unit: 'kg',
    is_active: true,
    is_featured: false,
    is_seasonal: true,
    season_start_month: 9,
    season_end_month: 11,
    season_notes: 'Dostupné v době podzimní sklizně od září do listopadu.',
    allow_preorder: false,
    is_made_to_order: false,
    sort_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-8',
        product_id: 'prod-8',
        storage_path: 'products/apples.jpg',
        url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=1000&auto=format&fit=crop',
        alt_text: 'Červená jablka v bedýnce',
        is_primary: true,
        sort_order: 1,
      },
    ],
    inventory: {
      product_id: 'prod-8',
      quantity_on_hand: 0,
      quantity_reserved: 0,
      quantity_preordered: 0,
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'prod-9',
    category_id: 'cat-2',
    name: 'Bylinný sirup z mladých smrkových výhonků',
    slug: 'smrkovy-sirup-vypary',
    short_description: 'Tradiční hustý sirup vrstvený s třtinovým cukrem a citronem.',
    description: 'Vyrábíme každé jaro z čerstvých jarních smrkových výhonků sbíraných v čistých podhorských lesích. Výborný do čaje, s perlivou vodou nebo jako podpora při nachlazení.',
    price: 155,
    unit: 'láhev (250 ml)',
    is_active: true,
    is_featured: false,
    is_seasonal: true,
    season_start_month: 5,
    season_end_month: 6,
    season_notes: 'Výroba probíhá v květnu po rašení mladých výhonků.',
    allow_preorder: true,
    preorder_limit: 30,
    expected_available_at: '2026-05-20',
    is_made_to_order: false,
    sort_order: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-9',
        product_id: 'prod-9',
        storage_path: 'products/syrup.jpg',
        url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop',
        alt_text: 'Láhev s bylinkovým sirupem',
        is_primary: true,
        sort_order: 1,
      },
    ],
    inventory: {
      product_id: 'prod-9',
      quantity_on_hand: 0,
      quantity_reserved: 0,
      quantity_preordered: 8,
      updated_at: new Date().toISOString(),
    },
  },
];

export const initialPosts: Post[] = [
  {
    id: 'post-1',
    title: 'Jaro na hospodářství: Slepice na zelené pastvině a začátek výsevů',
    slug: 'jaro-na-hospodarstvi-slepice-na-zeleni',
    perex: 'S prvními teplejšími dny se naše hejno slepic přesunulo na čerstvý jetelový výběh a začínáme s jarními pracemi na záhonech.',
    content: `Jaro je pro nás vždy nejkrásnějším a zároveň nejrušnějším obdobím roku. Po zimních měsících, kdy slepice trávily více času v prostorném kurníku s hlubokou podestýlkou, se celý travnatý výběh zazelenal a děvčata mají neomezený přístup k čerstvému jeteli, mladé trávě a hmyzu.

### Jak to poznáte na vejcích?
Pastva na zeleném má okamžitý vliv na kvalitu snášky. Žloutky mají přirozenou, hluboce oranžovo-žlutou barvu díky karotenoidům z čerstvých bylin a bílek je hustý a pevný. Vejce sbíráme dvakrát denně a okamžitě je třídíme do kartonů.

### Práce ve skleníku a na záhonech
Zároveň jsme už vyseli první ranou zeleninu, ředkvičky a bylinky. Připravujeme sazenice jahod a těšíme se na první letošní úrodu!`,
    cover_image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000&auto=format&fit=crop',
    status: 'published',
    published_at: '2026-03-28T09:00:00Z',
    created_at: '2026-03-28T09:00:00Z',
    updated_at: '2026-03-28T09:00:00Z',
  },
  {
    id: 'post-2',
    title: 'Jak správně skladovat čerstvá vajíčka z volného chovu',
    slug: 'jak-spravne-skladovat-cerstva-vajicka',
    perex: 'Pár praktických rad, proč naše vejce neumýváme, jak dlouho vydrží čerstvá a zda patří do lednice špičkou dolů.',
    content: `Často se nás ptáte, jak nejlépe uchovat vajíčka, která si u nás vyzvednete. Zde je několik zásad, které zaručí jejich dokonalou čerstvost a chuť:

1. **Neomývejte skořápku před uskladněním** – Čerstvě snesené vejce má na povrchu přirozenou ochrannou kutikulu, která brání pronikání bakterií a vysychání. Pokud vejce omyjete vodou, tuto vrstvu smyjete.
2. **Skladujte špičkou dolů** – Na tupém konci vejce se nachází vzduchová komůrka. Když je vejce uloženo špičkou dolů, žloutek zůstává přirozeně ve středu a komůrka netlačí na obsah.
3. **Stálá teplota 5–8 °C** – Vyhněte se častým změnám teplot (např. v přihrádce ve dveřích chladničky, kde teplota kolísá při každém otevření).

Čerstvá vejce od nás mají trvanlivost minimálně 28 dní od data snášky.`,
    cover_image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=1000&auto=format&fit=crop',
    status: 'published',
    published_at: '2026-03-15T14:30:00Z',
    created_at: '2026-03-15T14:30:00Z',
    updated_at: '2026-03-15T14:30:00Z',
  },
  {
    id: 'post-3',
    title: 'Předobjednávky na jarní jahody spuštěny',
    slug: 'predobjednavky-na-jarni-jahody-spusteny',
    perex: 'Kapacita pro první sklizeň jahod je otevřena. Jahody sbíráme v den předání pro dokonalou chuť a aroma.',
    content: `Naše jahodiště letos krásně přezimovalo a první květy slibují bohatou úrodu. Protože jahody trháme výhradně v plné zralosti přímo před výdejem, je kapacita každého sklizňového dne omezená.

Rezervujte si své košíky s předstihem v našem digitálním katalogu. O přesném termínu vyzvednutí vás budeme informovat s několikadenním předstihem podle počasí a dozrávání.`,
    cover_image: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?q=80&w=1000&auto=format&fit=crop',
    status: 'published',
    published_at: '2026-03-01T10:00:00Z',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
];

export const initialPages: Record<string, Page> = {
  'o-hospodarstvi': {
    id: 'page-1',
    slug: 'o-hospodarstvi',
    title: 'O našem hospodářství',
    meta_description: 'Malé rodinné hospodářství hospodařící v souladu s přírodou, s důrazem na pohodu zvířat a poctivou ruční práci.',
    hero_image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=1200&auto=format&fit=crop',
    content: `Jsme malé rodinné hospodářství ležící v malebné krajině na pomezí luk a dubových lesů. Naším cílem není masová průmyslová produkce, ale poctivý vztah k půdě, zvířatům a lidem, kteří naše výrobky konzumují.

### Naše filozofie
Věříme, že nejlepší jídlo vzniká tam, kde je dostatek času, péče a respektu k přirozeným cyklům přírody. Nepoužíváme syntetické postřiky ani průmyslová hnojiva. Půdu vyživujeme vlastním kompostem a střídáním plodin.

### Co u nás najdete
- **Volný chov slepic** s rozlehlým travnatým výběhem.
- **Starý ovocný sad** s tradičními krajovými odrůdami jabloní, hrušní a švestek.
- **Včelnici** situovanou na kraji lesa s bohatou pestrostí lučních a lesních květů.
- **Domácí dílnu a pekárnu**, kde zpracováváme suroviny v malých šaržích s láskou k řemeslu.

### Jak u nás nakoupit
Naše hospodářství funguje na principu osobního předání a přímého kontaktu. Přes tento digitální web si můžete produkty prohlédnout, rezervovat nebo předobjednat. Po potvrzení objednávky vám připravíme balíček přímo k vyzvednutí ze dvora.`,
    updated_at: new Date().toISOString(),
  },
  'nase-slepice': {
    id: 'page-2',
    slug: 'nase-slepice',
    title: 'Naše slepice a volný chov',
    meta_description: 'Poznejte náš hejno slepic, jejich život ve volném travnatém výběhu, přirozenou stravu a péči o jejich pohodu.',
    hero_image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1200&auto=format&fit=crop',
    content: `Základem našeho hospodářství je hejno spokojených slepic. Od začátku jsme věděli, že nechceme kompromisy v jejich životních podmínkách.

### Život pod širým nebem
Naše slepice mají od ranního kuropění až do soumraku k dispozici rozsáhlý oplocený výběh se starými stromy, které jim poskytují přirozený stín a ochranu před dravci. Mohou se volně popelit v suché zemině (což je jejich přirozená péče o peří), hrabat v trávě a lovit hmyz.

### Jaké plemena u nás žijí?
V našem hejnu máme pestrou směsici tradičních a odolných plemen:
- **Česká zlatá kropenka** – naše národní otužilé plemeno s vynikající shánčlivostí.
- **Maranska** – francouzské plemeno snášející krásná tmavě čokoládová vejce.
- **Vlaškay koroptví** – živé a aktivní slepice s bílými vajíčky.
- **Araukana** – zajímavé bezocasé slepičky, které snášejí tyrkysově modrozelená vajíčka.

Díky této pestrosti je každé balení vajec z našeho dvora barevnou mozaikou přírody!

### Poctivé krmení bez chemie
Kromě toho, co si samy nasbírají na pastvině, dostávají naše slepičky směs z našeho pšenice, ječmene, kukuřice, hrachu a drcených vaječných skořápek pro dostatek vápníku. Nikdy nepoužíváme sójové šroty ani umělá barviva žloutků.`,
    updated_at: new Date().toISOString(),
  },
};

export const initialOrders: Order[] = [
  {
    id: 'ord-1',
    order_number: 'R-2026-00042',
    type: 'reservation',
    status: 'pending',
    customer_name: 'Marie Nováková',
    customer_email: 'marie.novakova@email.cz',
    customer_phone: '+420 777 123 456',
    customer_note: 'Mohu se stavit v pátek odpoledne kolem 16:00?',
    total_price: 255,
    expected_ready_date: '2026-04-03',
    pickup_info: 'Výdej ze dvora, zvonek Hospodářství',
    admin_notes: null,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    items: [
      {
        id: 'item-1',
        order_id: 'ord-1',
        product_id: 'prod-1',
        product_name: 'Čerstvá vejce z volného výběhu (10 ks)',
        quantity: 2,
        unit_price: 85,
        total_price: 170,
        item_type: 'reservation',
        unit: 'balení (10 ks)',
      },
      {
        id: 'item-2',
        order_id: 'ord-1',
        product_id: 'prod-1',
        product_name: 'Čerstvá vejce z volného výběhu (10 ks)',
        quantity: 1,
        unit_price: 85,
        total_price: 85,
        item_type: 'reservation',
        unit: 'balení (10 ks)',
      },
    ],
  },
  {
    id: 'ord-2',
    order_number: 'R-2026-00041',
    type: 'reservation',
    status: 'confirmed',
    customer_name: 'Petr Svoboda',
    customer_email: 'svoboda.p@seznam.cz',
    customer_phone: '+420 608 987 654',
    customer_note: 'Děkuji, vezmu si i vlastní tašku.',
    total_price: 420,
    expected_ready_date: '2026-04-02',
    pickup_info: 'Připraveno v chladicím boxu ve výdejně',
    admin_notes: 'Potvrzeno telefonicky',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    items: [
      {
        id: 'item-3',
        order_id: 'ord-2',
        product_id: 'prod-2',
        product_name: 'Květový med z lesních luk',
        quantity: 2,
        unit_price: 210,
        total_price: 420,
        item_type: 'reservation',
        unit: 'sklenice (950 g)',
      },
    ],
  },
  {
    id: 'ord-3',
    order_number: 'R-2026-00039',
    type: 'mixed',
    status: 'ready',
    customer_name: 'Jana Kratochvílová',
    customer_email: 'jana.k@volny.cz',
    customer_phone: '+420 721 555 888',
    customer_note: 'Koláč na rodinnou oslavu.',
    total_price: 590,
    expected_ready_date: '2026-04-01',
    pickup_info: 'Upečeno ráno, zabaleno v krabici na koláč.',
    admin_notes: 'Koláč upečen a nachystán.',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    items: [
      {
        id: 'item-4',
        order_id: 'ord-3',
        product_id: 'prod-4',
        product_name: 'Kynutý borůvkový koláč s máslovou drobenkou',
        quantity: 1,
        unit_price: 420,
        total_price: 420,
        item_type: 'made_to_order',
        unit: 'celý plech (~1.6 kg)',
      },
      {
        id: 'item-5',
        order_id: 'ord-3',
        product_id: 'prod-1',
        product_name: 'Čerstvá vejce z volného výběhu (10 ks)',
        quantity: 2,
        unit_price: 85,
        total_price: 170,
        item_type: 'reservation',
        unit: 'balení (10 ks)',
      },
    ],
  },
];

export const initialSettings: PublicSetting[] = [
  { id: 's-1', key: 'farm_name', value: 'Luční Dvůr – Rodinné Hospodářství', description: 'Název hospodářství' },
  { id: 's-2', key: 'address', value: 'Luční 14, 538 03 Heřmanův Městec', description: 'Adresa pro osobní odběr' },
  { id: 's-3', key: 'phone', value: '+420 732 112 233', description: 'Kontaktní telefon' },
  { id: 's-4', key: 'email', value: 'info@lucnidvur.cz', description: 'Kontaktní e-mail' },
  { id: 's-5', key: 'pickup_hours', value: 'Čtvrtek & Pátek 14:00–18:00, Sobota 9:00–12:00 (nebo dle domluvy)', description: 'Výdejní doba' },
  { id: 's-6', key: 'banner_text', value: 'Vajíčka sbíráme denně • Čerstvý výdej přímo ze dvora po potvrzení rezervace', description: 'Informační lišta' },
];

// Helper to compute availability from mock inventory and product fields:
export function computeMockAvailability(product: Product): ProductAvailability {
  const currentMonth = new Date().getMonth() + 1;
  const onHand = product.inventory?.quantity_on_hand || 0;
  const reserved = product.inventory?.quantity_reserved || 0;
  const availableQty = Math.max(0, onHand - reserved);

  if (!product.is_active) {
    return {
      status: 'unavailable',
      available_quantity: 0,
      unit: product.unit,
      allow_preorder: false,
    };
  }

  if (product.is_made_to_order) {
    return {
      status: 'made_to_order',
      available_quantity: 99,
      unit: product.unit,
      allow_preorder: false,
      lead_time_days_min: product.lead_time_days_min || 2,
      lead_time_days_max: product.lead_time_days_max || 5,
    };
  }

  if (product.is_seasonal) {
    const inSeason =
      product.season_start_month && product.season_end_month
        ? currentMonth >= product.season_start_month && currentMonth <= product.season_end_month
        : true;

    if (!inSeason) {
      if (product.allow_preorder) {
        const preordered = product.inventory?.quantity_preordered || 0;
        const limit = product.preorder_limit || 50;
        const remaining = Math.max(0, limit - preordered);
        return {
          status: 'preorder',
          available_quantity: 0,
          unit: product.unit,
          allow_preorder: true,
          preorder_remaining: remaining,
          expected_available_at: product.expected_available_at || undefined,
        };
      }
      return {
        status: 'out_of_season',
        available_quantity: 0,
        unit: product.unit,
        allow_preorder: false,
      };
    }
  }

  if (availableQty > 0) {
    return {
      status: 'available',
      available_quantity: availableQty,
      unit: product.unit,
      allow_preorder: false,
    };
  }

  if (product.allow_preorder) {
    const preordered = product.inventory?.quantity_preordered || 0;
    const limit = product.preorder_limit || 50;
    const remaining = Math.max(0, limit - preordered);
    return {
      status: 'preorder',
      available_quantity: 0,
      unit: product.unit,
      allow_preorder: true,
      preorder_remaining: remaining,
      expected_available_at: product.expected_available_at || undefined,
    };
  }

  return {
    status: 'sold_out',
    available_quantity: 0,
    unit: product.unit,
    allow_preorder: false,
  };
}
