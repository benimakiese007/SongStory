/**
 * SongStory — Static-First Data Layer
 */

let SONGS_DATA = [
    {
        "id": "dead-presidents-ii",
        "title": "Dead Presidents II",
        "artist_id": "jay-z",
        "genre": "Rap",
        "year": 1996,
        "url": "songs/jay-z/dead-presidents-ii.html",
        "cover_url": "images/covers/dead-presidents-ii-cover.webp",
        "tags": ["Classique", "New York", "Mafioso Rap"],
        "description": "L'un des plus grands morceaux de l'histoire du hip-hop, extrait de l'album Reasonable Doubt."
    },
    {
        "id": "demain-cest-loin",
        "title": "Demain, C'est Loin",
        "artist_id": "iam",
        "genre": "Rap",
        "year": 1997,
        "url": "songs/iam/demain-cest-loin.html",
        "cover_url": "images/covers/demain-cest-loin-cover.webp",
        "tags": ["Classique", "Marseille", "Rap Conscient"],
        "description": "Le morceau le plus emblématique du rap français, une immersion brutale et poétique dans le quotidien des quartiers nord de Marseille."
    },
    {
        "id": "back-to-back",
        "title": "Back to Back",
        "artist_id": "drake",
        "genre": "Rap",
        "year": 2015,
        "url": "songs/drake/back-to-back.html",
        "cover_url": "images/covers/back-to-back-cover.webp",
        "tags": ["Beef", "Diss Track"],
        "description": "Le diss track massif qui a redéfini les règles du beef à l'ère des réseaux sociaux."
    },
    {
        "id": "family-matters",
        "title": "Family Matters",
        "artist_id": "drake",
        "genre": "Rap",
        "year": 2024,
        "url": "songs/drake/family-matters.html",
        "cover_url": "images/covers/family-matters-cover.webp",
        "tags": ["beef", "2024"],
        "description": "La réponse massive de Drake au conflit de 2024."
    },
    {
        "id": "push-ups",
        "title": "Push Ups",
        "artist_id": "drake",
        "genre": "Rap",
        "year": 2024,
        "url": "songs/drake/push-ups.html",
        "cover_url": "images/covers/push-ups-cover.webp",
        "tags": ["beef"],
        "description": "Le premier coup de semonce officiel de Drake dans le beef de 2024."
    },
    {
        "id": "taylor-made-freestyle",
        "title": "Taylor Made Freestyle",
        "artist_id": "drake",
        "genre": "Rap",
        "year": 2024,
        "url": "songs/drake/taylor-made-freestyle.html",
        "cover_url": "images/covers/taylor-made-freestyle-cover.webp",
        "tags": ["beef", "IA"],
        "description": "Le morceau controversé utilisant l'IA pour imiter Tupac et Snoop Dogg."
    },
    {
        "id": "stan",
        "title": "Stan",
        "artist_id": "eminem",
        "genre": "Rap",
        "year": 2000,
        "url": "songs/eminem/stan.html",
        "cover_url": "images/covers/stan-cover.webp",
        "tags": ["storytelling"],
        "description": "Un chef-d'œuvre de narration explorant l'obsession d'un fan."
    },
    {
        "id": "7-minute-drill",
        "title": "7 Minute Drill",
        "artist_id": "j-cole",
        "genre": "Rap",
        "year": 2024,
        "url": "songs/j-cole/7-minute-drill.html",
        "cover_url": "images/covers/7-minutes-drill-cover.webp",
        "tags": ["beef"],
        "description": ""
    },
    {
        "id": "might-delete-later",
        "title": "Might Delete Later (Excuses)",
        "artist_id": "j-cole",
        "genre": "Rap",
        "year": 2024,
        "url": "songs/j-cole/might-delete-later.html",
        "cover_url": "images/covers/might-delete-later-excuses-cover.webp",
        "tags": [],
        "description": ""
    },
    {
        "id": "power",
        "title": "Power",
        "artist_id": "kanye-west",
        "genre": "Rap",
        "year": 2010,
        "url": "songs/kanye-west/power.html",
        "cover_url": "images/covers/power-cover.webp",
        "tags": ["storytelling"],
        "description": ""
    },
    {
        "id": "6-16-in-LA",
        "title": "6:16 in LA",
        "artist_id": "kendrick-lamar",
        "genre": "Rap",
        "year": 2024,
        "url": "songs/kendrick-lamar/6-16-in-LA.html",
        "cover_url": "images/covers/6-16-in-la.webp",
        "tags": ["beef"],
        "description": ""
    },
    {
        "id": "euphoria",
        "title": "Euphoria",
        "artist_id": "kendrick-lamar",
        "genre": "Rap",
        "year": 2024,
        "url": "songs/kendrick-lamar/euphoria.html",
        "cover_url": "images/covers/euphoria-cover.webp",
        "tags": ["beef"],
        "description": ""
    },
    {
        "id": "meet-the-grahams",
        "title": "Meet the Grahams",
        "artist_id": "kendrick-lamar",
        "genre": "Rap",
        "year": 2024,
        "url": "songs/kendrick-lamar/meet-the-grahams.html",
        "cover_url": "images/covers/meet-the-graham-cover.webp",
        "tags": ["beef"],
        "description": ""
    },
    {
        "id": "not-like-us",
        "title": "Not Like Us",
        "artist_id": "kendrick-lamar",
        "genre": "Rap",
        "year": 2024,
        "url": "songs/kendrick-lamar/not-like-us.html",
        "cover_url": "images/covers/not-like-us-cover.webp",
        "tags": ["beef"],
        "description": ""
    },
    {
        "id": "lettre-a-la-republique",
        "title": "Lettre à la République",
        "artist_id": "kery-james",
        "genre": "Rap Conscient",
        "year": 2012,
        "url": "songs/kery-james/lettre-a-la-republique.html",
        "cover_url": "images/covers/lettre-a-la-republique-cover.webp",
        "tags": ["politique", "rap conscient"],
        "description": ""
    },
    {
        "id": "dont-laik",
        "title": "Don't Laïk",
        "artist_id": "medine",
        "genre": "Rap Conscient",
        "year": 2012,
        "url": "songs/medine/dont-laik.html",
        "cover_url": "images/covers/dont-laik-cover.webp",
        "tags": ["politique", "rap conscient"],
        "description": ""
    },
    {
        "id": "menace-de-mort",
        "title": "Menace de Mort",
        "artist_id": "youssoupha",
        "genre": "Rap Conscient",
        "year": 2009,
        "url": "songs/youssoupha/menace-de-mort.html",
        "cover_url": "images/covers/menace-de-mort-cover.webp",
        "tags": ["politique", "rap conscient"],
        "description": ""
    },
    {
        "id": "solaar-pleure",
        "title": "Solaar Pleure",
        "artist_id": "mc-solaar",
        "genre": "Rap",
        "year": 2001,
        "url": "songs/mc-solaar/solaar-pleure.html",
        "cover_url": "images/covers/solaar-pleure-cover.webp",
        "tags": ["Classique", "Poésie"],
        "description": "Un retour mystique et philosophique du poète du rap français."
    },
    {
        "id": "hit-em-up",
        "title": "Hit 'Em Up",
        "artist_id": "2pac",
        "genre": "Rap",
        "year": 1996,
        "url": "songs/2pac/hit-em-up.html",
        "cover_url": "images/covers/hit-em-up-cover.webp",
        "tags": ["Beef", "West Coast", "Diss Track"],
        "description": "Le diss track le plus féroce de l'histoire du hip-hop."
    },
    {
        "id": "ny-state-of-mind",
        "title": "NY State of Mind",
        "artist_id": "nas",
        "genre": "Rap",
        "year": 1994,
        "url": "songs/nas/ny-state-of-mind.html",
        "cover_url": "images/covers/ny-state-of-mind-cover.webp",
        "tags": ["Classique", "Storytelling", "New York"],
        "description": "Une immersion cinématographique dans les rues de Queensbridge."
    },
    {
        "id": "this-is-america",
        "title": "This Is America",
        "artist_id": "childish-gambino",
        "genre": "Rap",
        "year": 2018,
        "url": "songs/childish-gambino/this-is-america.html",
        "cover_url": "images/covers/this-is-america-cover.webp",
        "tags": ["Social", "Provocateur"],
        "description": "Une critique virulente de la société américaine moderne."
    },
    {
        "id": "alright",
        "title": "Alright",
        "artist_id": "kendrick-lamar",
        "genre": "Rap",
        "year": 2015,
        "url": "songs/kendrick-lamar/alright.html",
        "cover_url": "images/covers/alright-cover.webp",
        "tags": ["Hymne", "Espoir"],
        "description": "Un cri de ralliement pour la résilience et le changement."
    },
    {
        "id": "notes-pour-trop-tard",
        "title": "Notes Pour Trop Tard",
        "artist_id": "orelsan",
        "genre": "Rap",
        "year": 2017,
        "url": "songs/orelsan/notes-pour-trop-tard.html",
        "cover_url": "images/covers/notes-pour-trop-tard-cover.webp",
        "tags": ["Introspection", "Storytelling"],
        "description": "Une lettre poignante adressée à son moi plus jeune."
    },
    {
        "id": "laisse-pas-traisner-ton-fils",
        "title": "Laisse Pas Traîner Ton Fils",
        "artist_id": "supreme-ntm",
        "genre": "Rap",
        "year": 1998,
        "url": "songs/supreme-ntm/laisse-pas-traisner-ton-fils.html",
        "cover_url": "images/covers/laisse-pas-traisner-ton-fils-cover.webp",
        "tags": ["Classique", "Social"],
        "description": "Un plaidoyer puissant sur la responsabilité parentale."
    },
    {
        "id": "both-sides-of-a-smile",
        "title": "Both Sides Of A Smile",
        "artist_id": "dave",
        "genre": "Rap",
        "year": 2021,
        "url": "songs/dave/both-sides-of-a-smile.html",
        "cover_url": "images/covers/both-sides-of-a-smile-cover.webp",
        "tags": ["Storytelling", "James Blake"],
        "description": "Une collaboration profonde explorant la dualité de la réussite et de la souffrance."
    }
];

let ARTISTS_DATA = [
    {
        "id": "kendrick-lamar",
        "name": "Kendrick Lamar",
        "genre": "Hip-Hop",
        "country": "USA",
        "bio": "L'un des paroliers les plus influents de sa génération, connu pour ses récits complexes et ses thèmes sociaux.",
        "influence": "",
        "url": "artists/kendrick-lamar.html",
        "photo_url": "images/artists/kendrick-lamar-pp.webp",
        "tags": []
    },
    {
        "id": "drake",
        "name": "Drake",
        "genre": "Hip-Hop/R&B",
        "country": "Canada",
        "bio": "La superstar mondiale qui domine les charts avec son mélange unique de rap mélodique et de R&B.",
        "influence": "",
        "url": "artists/drake.html",
        "photo_url": "images/artists/drake-pp.webp",
        "tags": []
    },
    {
        "id": "eminem",
        "name": "Eminem",
        "genre": "Hip-Hop",
        "country": "USA",
        "bio": "Le génie technique du Rap de Détroit, célèbre pour ses rimes complexes et son alter ego Slim Shady.",
        "influence": "",
        "url": "artists/eminem.html",
        "photo_url": "images/artists/eminem-pp.webp",
        "tags": []
    },
    {
        "id": "nas",
        "name": "Nas",
        "genre": "Hip-Hop",
        "country": "USA",
        "bio": "Le poète de Queensbridge, considéré comme l'un des plus grands paroliers de tous les temps.",
        "influence": "",
        "url": "artists/nas.html",
        "photo_url": "images/artists/nas-pp.webp",
        "tags": []
    },
    {
        "id": "2pac",
        "name": "2Pac",
        "genre": "Hip-Hop",
        "country": "USA",
        "bio": "L'icône éternelle qui a donné une voix aux sans-voix à travers sa poésie et son charisme unique.",
        "influence": "",
        "url": "artists/tupac-shakur.html",
        "photo_url": "images/artists/2pac-pp.webp",
        "tags": []
    },
    {
        "id": "jay-z",
        "name": "Jay-Z",
        "genre": "Hip-Hop",
        "country": "USA",
        "bio": "L'entrepreneur et lyriciste hors pair qui a transformé le hip-hop en un empire mondial.",
        "influence": "",
        "url": "artists/jay-z.html",
        "photo_url": "images/artists/jay-z-pp.webp",
        "tags": []
    },
    {
        "id": "kanye-west",
        "name": "Kanye West",
        "genre": "Hip-Hop",
        "country": "USA",
        "bio": "L'un des producteurs et artistes les plus innovants du 21ème siècle, repoussant sans cesse les limites du son.",
        "influence": "",
        "url": "artists/kanye-west.html",
        "photo_url": "images/artists/ye-pp.webp",
        "tags": []
    },
    {
        "id": "childish-gambino",
        "name": "Childish Gambino",
        "genre": "Hip-Hop/Soul",
        "country": "USA",
        "bio": "L'artiste polyvalent qui explore les thèmes de l'identité noire avec une créativité sans limites.",
        "influence": "",
        "url": "artists/childish-gambino.html",
        "photo_url": "images/artists/childish-gambino-pp.webp",
        "tags": []
    },
    {
        "id": "iam",
        "name": "IAM",
        "genre": "Rap",
        "country": "France",
        "bio": "Le groupe mythique de Marseille qui a élevé le rap français au rang d'art poétique et philosophique.",
        "influence": "",
        "url": "artists/iam.html",
        "photo_url": "images/artists/iam-pp.webp",
        "tags": []
    },
    {
        "id": "supreme-ntm",
        "name": "Suprême NTM",
        "genre": "Rap",
        "country": "France",
        "bio": "L'énergie brute du 93, incarnant la contestation sociale et la puissance scénique du rap français.",
        "influence": "",
        "url": "artists/supreme-ntm.html",
        "photo_url": "images/artists/supreme-ntm-pp.webp",
        "tags": []
    },
    {
        "id": "mc-solaar",
        "name": "MC Solaar",
        "genre": "Rap",
        "country": "France",
        "bio": "Le poète du rap français, pionnier du lyrisme et du style \"cool\" qui a marqué toute une époque.",
        "influence": "",
        "url": "artists/mc-solaar.html",
        "photo_url": "images/artists/mc-solaar-pp.webp",
        "tags": []
    },
    {
        "id": "orelsan",
        "name": "Orelsan",
        "genre": "Rap",
        "country": "France",
        "bio": "Le storyteller de la classe moyenne française, maître de l'autodérision et de la mélancolie du quotidien.",
        "influence": "",
        "url": "artists/orelsan.html",
        "photo_url": "images/artists/orelsan-pp.webp",
        "tags": []
    },
    {
        "id": "kery-james",
        "name": "Kery James",
        "genre": "Rap Conscient",
        "country": "France",
        "bio": "Une figure majeure du rap français, pilier du rap politique et engagé depuis plus de deux décennies.",
        "influence": "",
        "url": "artists/kery-james.html",
        "photo_url": "images/artists/kery-james-pp.webp",
        "tags": []
    },
    {
        "id": "medine",
        "name": "Médine",
        "genre": "Rap Conscient",
        "country": "France",
        "bio": "Reconnu pour sa poésie et son intelligence lyricale, il se définit comme un \"arabophone de la laïcité\".",
        "influence": "",
        "url": "artists/medine.html",
        "photo_url": "images/artists/medine-pp.webp",
        "tags": []
    },
    {
        "id": "youssoupha",
        "name": "Youssoupha",
        "genre": "Rap Conscient",
        "country": "France / RDC",
        "bio": "Surnommé le \"Lyriciste Bantou\", il est réputé pour la richesse de son vocabulaire et son écriture très ciselée.",
        "influence": "",
        "url": "artists/youssoupha.html",
        "photo_url": "images/artists/youssoupha-pp.webp",
        "tags": []
    },
    {
        "id": "j-cole",
        "name": "J. Cole",
        "genre": "Hip-Hop",
        "country": "USA",
        "bio": "Le conteur de Fayetteville, reconnu pour son introspection et son refus des artifices du star-system.",
        "influence": "",
        "url": "artists/j-cole.html",
        "photo_url": "images/artists/j.cole-pp.webp",
        "tags": []
    },
    {
        "id": "dave",
        "name": "Dave",
        "genre": "Rap",
        "country": "UK",
        "bio": "Le prodige de Streatham, connu pour son intelligence lyricale hors norme et ses récits poignants sur la société et l'identité.",
        "photo_url": "images/artists/dave-pp.webp",
        "url": "artists/dave.html"
    }
];

let GLOSSARY = {
    "beef": "Un conflit ouvert entre deux ou plusieurs artistes, s'exprimant généralement à travers des diss tracks.",
    "diss track": "Un morceau de musique spécifiquement créé pour attaquer ou ridiculiser un autre artiste.",
    "flow": "Le rythme, la cadence et l'articulation d'un rappeur sur une instru.",
    "ghostwriter": "Une personne qui écrit des paroles pour un autre artiste sans être créditée publiquement.",
    "storytelling": "L'art de raconter une histoire à travers les paroles d'une chanson.",
    "punchline": "Une phrase forte, souvent humoristique ou percutante, destinée à marquer l'auditeur."
};

const BEEF_TIMELINE = [
    { date: 'Jan 2012', side: 'kendrick', actor: 'Kendrick Lamar', type: 'track', tag: 'track', title: 'Control (Big Sean) — La déclaration de guerre', text: 'Sur le morceau "Control" de Big Sean, Kendrick lâche un couplet historique dans lequel il nomme explicitement ses rivaux, dont J. Cole, Big K.R.I.T., Meek Mill, et d\'autres, les défiant tous de s\'améliorer. Drake n\'est pas nommé mais la hiérarchie est posée.', link: null },
    { date: '2015-2018', side: 'context', actor: 'Contexte', type: 'event', tag: 'event', title: 'Tension silencieuse — Deux royaumes, un trône', text: 'Durant cette période, les deux artistes dominent le rap mondial chacun à leur façon. Les comparaisons sont constantes dans la presse et sur les réseaux. Une rivalité implicite s\'installe, alimentée notamment par des interviews ambiguës des deux camps.', link: null },
    { date: 'Oct 2023', side: 'both', actor: 'Drake ft. J. Cole', type: 'track', tag: 'track', title: 'First Person Shooter — L\'étincelle', text: '"Like a generational talent, only four of us" — J. Cole ne cite que 4 rappeurs de sa génération. L\'omission de Kendrick est perçue comme volontaire et provoque une réaction immédiate sur les réseaux. La guerre de mots est imminente.', link: null },
    { date: 'Déc 2023', side: 'drake', actor: 'Drake', type: 'track', tag: 'track', title: 'For All The Dogs — Les piques indirectes', text: 'Sur son album "For All The Dogs", Drake glisse plusieurs piques que les fans interprètent comme visant Kendrick. L\'atmosphère est électrisée, chaque ligne est disséquée sur les forums.', link: null },
    { date: 'Jan 2024', side: 'kendrick', actor: 'Kendrick Lamar', type: 'track', tag: 'track', title: 'Like That (Future & Metro Boomin) — Le premier coup', text: '"F*ck the big three, it\'s just big me" — Sur ce featuring, Kendrick répond directement à la phrase de J. Cole et déclare la guerre ouverte à Drake. L\'internet explose. C\'est le début officiel du beef.', link: null },
    { date: 'Mars 2024', side: 'drake', actor: 'Drake', type: 'track', tag: 'track', title: 'Push Ups — La contre-attaque', text: 'Drake répond avec "Push Ups", attaquant le physique de Kendrick ("shorty"), ses ventes, et son label. Il tente de ridiculiser son rival en le diminuant.', link: null },
    { date: 'Avr 2024', side: 'drake', actor: 'Drake', type: 'track', tag: 'track', title: 'Taylor Made Freestyle — La provocation par l\'IA', text: 'Drake utilise des voix générées par IA de Tupac et Snoop Dogg pour narguer Kendrick et le forcer à répondre. Le morceau sera plus tard supprimé sous la menace de poursuites de l\'Estate de Tupac.', link: 'songs/drake/taylor-made-freestyle.html' },
    { date: 'Avr 2024', side: 'kendrick', actor: 'Kendrick Lamar', type: 'track', tag: 'track', title: 'Euphoria — Le génie entre en scène', text: '6 minutes 22 secondes. Kendrick démantèle Drake méthodiquement — son image, ses enfants, ses origines, son authenticité. Considéré comme l\'une des meilleures diss tracks de l\'histoire du rap. Drake n\'a aucune réponse à cette hauteur.', link: 'songs/kendrick-lamar/euphoria.html' },
    { date: 'Avr 2024', side: 'kendrick', actor: 'Kendrick Lamar', type: 'track', tag: 'track', title: '6:16 in LA — La pression ne s\'arrête pas', text: 'Kendrick sort un deuxième morceau le même mois, maintenant une cadence implacable. Il accuse Drake d\'utiliser l\'IA pour imiter des voix d\'artistes.', link: 'songs/kendrick-lamar/6-16-in-LA.html' },
    { date: 'Mai 2024', side: 'drake', actor: 'Drake', type: 'track', tag: 'track', title: 'Family Matters — La contre-offensive massive', text: '7 minutes de réponse. Drake attaque la relation de Kendrick, ses enfants, et tente de retourner chaque accusation. Il pense livrer le coup fatal. Mais 30 minutes après…', link: 'songs/drake/family-matters.html' },
    { date: '3 Mai 2024', side: 'kendrick', actor: 'Kendrick Lamar', type: 'track', tag: 'track', title: 'Meet The Grahams — La bombe atomique', text: 'Publiée 30 minutes après "Family Matters", cette lettre ouverte à la famille de Drake contient des accusations extrêmement graves. La riposte est immédiate et bouleverse l\'internet.', link: 'songs/kendrick-lamar/meet-the-grahams.html' },
    { date: '4 Mai 2024', side: 'kendrick', actor: 'Kendrick Lamar', type: 'track', tag: 'victory', title: 'Not Like Us — L\'hymne de victoire', text: '"Certified Lover Boy? Certified Pedophile." Ce titre devient viral en quelques heures, tourne en boucle dans les clubs et sur les réseaux. C\'est un phénomène culturel. Drake ne répondra jamais de façon convaincante.', link: 'songs/kendrick-lamar/not-like-us.html' },
    { date: 'Juin 2024', side: 'both', actor: 'Réaction mondiale', type: 'event', tag: 'event', title: 'Le verdict de la rue — Kendrick gagne le beef', text: '"Not Like Us" est classé #1 aux États-Unis, au Canada, en Australie et dans plusieurs pays. Tous les sondages, médias spécialisés et artistes s\'accordent : Kendrick a remporté le beef haut la main. Drake choisit le silence.', link: null },
    { date: 'Fév 2025', side: 'kendrick', actor: 'Kendrick Lamar', type: 'event', tag: 'victory', title: 'Super Bowl LIX — La consécration ultime', text: 'Kendrick Lamar est choisi pour se produire au Super Bowl LIX. Il performe "Not Like Us" devant 123 millions de téléspectateurs, la plus grande scène du monde, entérinant définitivement sa victoire dans le débat public.', link: null },
];

if (typeof window !== 'undefined') {
    window.BEEF_TIMELINE = BEEF_TIMELINE;
}

// ─── Supabase Integration ───────────────────────────────

window.loadAppDataFromSupabase = async () => {
    if (!window.ss_supabase) {
        console.warn("Supabase client not found. Using static fallback.");
        return;
    }

    try {
        const { data: songs, error: sErr } = await window.ss_supabase
            .from('songs')
            .select('*')
            .order('created_at', { ascending: false });

        const { data: artists, error: aErr } = await window.ss_supabase
            .from('artists')
            .select('*')
            .order('name', { ascending: true });

        if (sErr || aErr) throw (sErr || aErr);

        if (songs && songs.length > 0) SONGS_DATA = songs;
        if (artists && artists.length > 0) ARTISTS_DATA = artists;

        console.log("Data successfully synced from Supabase.");
        
        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('ss:dataready'));
    } catch (e) {
        console.error("Supabase sync failed:", e);
    }
};

// Auto-run sync if on main site. CMS handles its own sync.
if (!window.location.pathname.includes('admin.html')) {
    // Wait for Supabase client to be ready (usually fast but async script load)
    const checkSupabase = setInterval(() => {
        if (window.ss_supabase) {
            window.loadAppDataFromSupabase();
            clearInterval(checkSupabase);
        }
    }, 100);
    // Timeout after 3s
    setTimeout(() => clearInterval(checkSupabase), 3000);
}
