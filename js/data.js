/**
 * SongStory — Central Data Store
 * Single source of truth for all songs and artists.
 * Used by: search overlay, library filters, recommendations.
 */

const SONGS_DATA = [
    {
        id: 'bohemian-rhapsody',
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        artistId: 'queen',
        genre: 'Rock',
        year: 1975,
        tags: ['rock', 'classique', 'storytelling', 'identité'],
        description: "L'opéra-rock qui a redéfini les limites de la musique populaire.",
        url: 'single-song.html?id=bohemian-rhapsody',
        artistUrl: 'artists/queen.html',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        spotifyId: '4u7EnebtmKWzUH433cf5Qv',
        appleMusicId: '1440811094',
        album: 'A Night at the Opera',
        duration: '5:55',
        bpm: '~72',
        content: [
            {
                time: 0,
                lyrics: [
                    "Is this the real life? Is this just fantasy?",
                    "Caught in a landslide, no escape from reality",
                    "Open your eyes, look up to the skies and see",
                    "I'm just a poor boy, I need no sympathy",
                    "Because I'm easy come, easy go, little high, little low",
                    "Any way the wind blows doesn't really matter to me, to me"
                ],
                analysis: `
                    <span class="text-white font-medium block mb-1">L'Ouverture A Cappella :</span>
                    <p>Le morceau s'ouvre sur une interrogation ontologique vertigineuse. Freddie Mercury pose la question de la frontière entre la réalité et l'illusion. L'harmonie vocale complexe crée une atmosphère onirique quasi-religieuse.</p>
                `
            },
            {
                time: 50,
                lyrics: [
                    "Mama, just killed a man",
                    "Put a gun against his head, pulled my trigger, now he's dead",
                    "Mama, life had just begun",
                    "But now I've gone and thrown it all away"
                ],
                analysis: `
                    <span class="text-amber-400 font-medium block mb-1">L'Aveu Tragique :</span>
                    <p>L'entrée poignante du piano marque le début de la ballade. Le "meurtre" avoué à la mère est la clé de voûte émotionnelle de la chanson. Beaucoup l'interprètent comme une allégorie de la mort de son ancienne identité.</p>
                `
            },
            {
                time: 115,
                lyrics: [
                    "Mama, ooh, didn't mean to make you cry",
                    "If I'm not back again this time tomorrow",
                    "Carry on, carry on as if nothing really matters"
                ],
                analysis: `
                    <span class="text-white font-medium block mb-1">Culpabilité et Résignation :</span>
                    <p>Le protagoniste exprime de profonds regrets face à la souffrance infligée à sa mère. L'injonction "carry on" montre une volonté de ne pas être un fardeau.</p>
                `
            },
            {
                time: 140,
                lyrics: [
                    "Too late, my time has come",
                    "Sends shivers down my spine, body's aching all the time",
                    "Goodbye, everybody, I've got to go",
                    "Gotta leave you all behind and face the truth"
                ],
                analysis: `
                    <span class="text-white font-medium block mb-1">Face à l'Inéluctable :</span>
                    <p>L'urgence se fait sentir. Le personnage doit affronter les conséquences de ses actes. Le solo de guitare lyrique de Brian May sert de pont émotionnel vers la section opéra.</p>
                `
            },
            {
                time: 185,
                lyrics: [
                    "I see a little silhouetto of a man",
                    "Scaramouche, Scaramouche, will you do the Fandango?",
                    "Thunderbolt and lightning, very, very frightening me",
                    "(Galileo) Galileo, (Galileo) Galileo, Galileo Figaro magnifico"
                ],
                analysis: `
                    <span class="text-white font-medium block mb-1">La Descente aux Enfers (Opéra) :</span>
                    <p>Tranchant net avec la ballade, la section opéra invoque des personnages de la Commedia dell'arte. Le protagoniste est jugé dans une parodie de tribunal céleste.</p>
                `
            },
            {
                time: 210,
                lyrics: [
                    "I'm just a poor boy, nobody loves me",
                    "He's just a poor boy from a poor family",
                    "Spare him his life from this monstrosity",
                    "Easy come, easy go, will you let me go?",
                    "Bismillah! No, we will not let you go (Let him go!)"
                ],
                analysis: `
                    <span class="text-white font-medium block mb-1">Le Conflit Spirituel :</span>
                    <p>Deux chœurs s'affrontent : l'un défend l'accusé, l'autre le condamne. L'invocation "Bismillah" illustre le conflit religieux interne.</p>
                `
            },
            {
                time: 245,
                lyrics: [
                    "So you think you can stone me and spit in my eye?",
                    "So you think you can love me and leave me to die?",
                    "Oh, baby, can't do this to me, baby",
                    "Just gotta get out, just gotta get right outta here"
                ],
                analysis: `
                    <span class="text-white font-medium block mb-1">L'Explosion Riff / Hard Rock :</span>
                    <p>Le chaos choral s'arrête sur le riff rageur de Brian May. C'est le cri de révolte final contre ceux qui le jugent ou le trahissent.</p>
                `
            },
            {
                time: 300,
                lyrics: [
                    "Nothing really matters, anyone can see",
                    "Nothing really matters",
                    "Nothing really matters to me",
                    "Anyway the wind blows..."
                ],
                analysis: `
                    <span class="text-white font-medium block mb-1">Apaisement et Nihilisme Final :</span>
                    <p>Après la tempête, la tension retombe. Le protagoniste est épuisé. La chanson boucle sur une note nihiliste et mystérieuse.</p>
                `
            }
        ]
    },
    {
        id: 'macarena',
        title: 'Macarena : L\'illusion amoureuse',
        artist: 'Damso',
        artistId: 'damso',
        genre: 'Rap',
        year: 2017,
        tags: ['rap', 'storytelling', 'mélancolie', 'rupture'],
        description: "Décryptage d'un classique. Comment le texte contraste avec la production.",
        url: 'songs/macarena.html',
        artistUrl: 'artists/damso.html',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        spotifyId: '54rA01Z4K7tF8lJro6PqT4',
        appleMusicId: '1220790479',
    },
    {
        id: 'euphoria',
        title: 'Euphoria',
        artist: 'Kendrick Lamar',
        artistId: 'kendrick-lamar',
        genre: 'Beef',
        year: 2024,
        tags: ['beef', 'rap', 'politique', 'confrontation'],
        description: "Analyse méthodique de la réponse chirurgicale visant Drake.",
        url: 'songs/euphoria.html',
        artistUrl: 'artists/kendrick-lamar.html',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        spotifyId: '77DRzu7ERs0TX3roZlicpa',
        appleMusicId: '1742782833',
    },
    {
        id: 'black',
        title: 'Black',
        artist: 'Dave',
        artistId: 'dave',
        genre: 'Rap Conscient',
        year: 2019,
        tags: ['rap', 'conscient', 'identité', 'politique'],
        description: "Décryptage d'un hymne à la fierté noire et à l'identité.",
        url: 'songs/black.html',
        artistUrl: 'artists/dave.html',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        spotifyId: '3uFWGGfI0s5Hn7O604C88G',
        appleMusicId: '1454536735',
    },
    {
        id: 'fairchild',
        title: 'Fairchild',
        artist: 'Dave',
        artistId: 'dave',
        genre: 'Rap Conscient',
        year: 2019,
        tags: ['rap', 'conscient', 'storytelling', 'justice'],
        description: "Un récit poignant sur les inégalités sociales et la justice.",
        url: 'songs/fairchild.html',
        artistUrl: 'artists/dave.html',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        spotifyId: '4oQcE1r92bO8p6wN7r0D96',
        appleMusicId: '1714088924',
    },
    {
        id: 'push-ups',
        title: 'Push Ups',
        artist: 'Drake',
        artistId: 'drake',
        genre: 'Beef',
        year: 2024,
        tags: ['beef', 'rap', 'diss track'],
        description: "La réponse musclée de Drake à ses détracteurs.",
        url: 'songs/push-ups.html',
        artistUrl: 'artists/drake.html',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        spotifyId: '0cKk8BjmCMKzE0J21nZ25G',
        appleMusicId: '1742141867',
    },
    {
        id: 'family-matters',
        title: 'Family Matters',
        artist: 'Drake',
        artistId: 'drake',
        genre: 'Beef',
        year: 2024,
        tags: ['beef', 'rap', 'diss track'],
        description: "La réponse massive de 7 minutes visant Kendrick Lamar.",
        url: 'songs/family-matters.html',
        artistUrl: 'artists/drake.html',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        spotifyId: '2KynwbR2E1E6B9eRtvf4S2',
        appleMusicId: '1744163539',
    },
    {
        id: 'first-person-shooter',
        title: 'First Person Shooter',
        artist: 'Drake ft. J. Cole',
        artistId: 'drake',
        genre: 'Hip-Hop',
        year: 2023,
        tags: ['hip-hop', 'collaboration', 'rap'],
        description: "L'alliance au sommet entre Drake et J. Cole.",
        url: 'songs/first-person-shooter.html',
        artistUrl: 'artists/drake.html',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        spotifyId: '7aqfrAY2p9BUSiupwk3svU',
        appleMusicId: '1709427358',
    },
    {
        id: 'back-to-back',
        title: 'Back to Back',
        artist: 'Drake',
        artistId: 'drake',
        genre: 'Beef',
        year: 2015,
        tags: ['beef', 'rap', 'diss track'],
        description: "L'uppercut chirurgical visant Meek Mill, devenu un hit planétaire.",
        url: 'songs/back-to-back.html',
        artistUrl: 'artists/drake.html',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        spotifyId: '4z8v0aV2J780cQ7K0y6Sj7',
        appleMusicId: '1026048590',
    },
];

const ARTISTS_DATA = [
    {
        id: 'queen',
        name: 'Queen',
        genre: 'Rock',
        country: 'Royaume-Uni',
        bio: "Groupe de rock britannique formé en 1970 à Londres, Queen est l'un des groupes les plus emblématiques de l'histoire du rock. Portés par la voix inimitable de Freddie Mercury, ils ont poussé les limites du genre avec des œuvres comme A Night at the Opera.",
        influence: "Leur influence s'étend du rock progressif à la pop en passant par l'opéra rock, touchant des générations entières d'artistes.",
        url: 'artists/queen.html',
        tags: ['rock', 'classique'],
        songs: ['bohemian-rhapsody'],
        timeline: [
            { year: 1970, event: 'Formation du groupe à Londres' },
            { year: 1973, event: 'Premier album "Queen"' },
            { year: 1975, event: '"Bohemian Rhapsody" — révolution musicale' },
            { year: 1985, event: 'Live Aid — performance légendaire à Wembley' },
            { year: 1991, event: 'Décès de Freddie Mercury' },
            { year: 2018, event: '"Bohemian Rhapsody" le film' },
        ],
    },
    {
        id: 'damso',
        name: 'Damso',
        genre: 'Rap',
        country: 'Belgique',
        bio: "William Kalubi, alias Damso, est un rappeur belgo-congolais né en 1992. Révélé en 2015, il est devenu l'une des figures majeures du rap francophone contemporain grâce à son univers sombre, poétique et introspectif.",
        influence: "Damso a réinventé le rap francophone avec une approche cinématographique et des métaphores complexes qui font de chaque album une œuvre littéraire.",
        url: 'artists/damso.html',
        tags: ['rap', 'storytelling'],
        songs: ['macarena'],
        timeline: [
            { year: 1992, event: 'Naissance à Kinshasa, Congo' },
            { year: 2014, event: 'Rejoint OVO Sound / 92i' },
            { year: 2016, event: 'Sortie de "Batterie Faible"' },
            { year: 2017, event: '"Ipséité" — consécration critique' },
            { year: 2019, event: '"QALF" — opus conceptuel' },
            { year: 2022, event: '"Engel" — évolution artistique' },
        ],
    },
    {
        id: 'kendrick-lamar',
        name: 'Kendrick Lamar',
        genre: 'Rap',
        country: 'États-Unis',
        bio: "Kendrick Lamar Duckworth, né en 1987 à Compton (Californie), est un rappeur, auteur-compositeur et producteur américain. Premier rappeur à recevoir le Prix Pulitzer pour la musique (2018), il est considéré comme l'un des artistes les plus importants de sa génération.",
        influence: "Kendrick redéfinit les standards du rap avec des albums conceptuels, un flow chirurgical et des textes à plusieurs niveaux de lecture qui mêlent politique, spiritualité et critique sociale.",
        url: 'artists/kendrick-lamar.html',
        tags: ['rap', 'beef', 'politique'],
        songs: ['euphoria'],
        timeline: [
            { year: 1987, event: 'Naissance à Compton, Californie' },
            { year: 2012, event: '"good kid, m.A.A.d city" — percée mondiale' },
            { year: 2015, event: '"To Pimp a Butterfly" — chef-d\'œuvre conceptuel' },
            { year: 2017, event: '"DAMN." — Prix Pulitzer' },
            { year: 2024, event: '"Euphoria" — diss track historique contre Drake' },
            { year: 2025, event: 'Super Bowl Halftime Show' },
        ],
    },
    {
        id: 'dave',
        name: 'Dave',
        genre: 'Rap',
        country: 'Royaume-Uni',
        bio: "David Orobosa Omoregie, connu sous le nom de Dave, est un rappeur, chanteur et pianiste britannique né en 1998. Il est l'une des figures majeures du UK Rap conscient.",
        influence: "Dave s'impose comme la voix de toute une génération britannique. Son album PSYCHODRAMA a remporté le prestigieux Mercury Prize.",
        url: 'artists/dave.html',
        tags: ['rap', 'conscient', 'storytelling'],
        songs: ['black', 'fairchild'],
        timeline: [
            { year: 1998, event: 'Naissance à Streatham, Londres' },
            { year: 2016, event: 'Mixtape "Six Paths"' },
            { year: 2019, event: '"PSYCHODRAMA" — Mercury Prize' },
            { year: 2021, event: '"We\'re All Alone in This Together" — Nº1 UK' },
            { year: 2023, event: '"Harlequin & Bard"' },
        ],
    },
    {
        id: 'drake',
        name: 'Drake',
        genre: 'Rap / R&B',
        country: 'Canada',
        bio: "Aubrey Drake Graham, né en 1986 à Toronto (Canada), est un rappeur, chanteur et acteur canadien. Il s'est imposé comme l'un des artistes les plus influents et les plus streamés de l'histoire de la musique moderne.",
        influence: "Drake a redéfini le rap contemporain en mélangeant habilement le hip-hop et le R&B introspectif.",
        url: 'artists/drake.html',
        tags: ['rap', 'r&b', 'beef'],
        songs: ['push-ups', 'family-matters', 'first-person-shooter', 'back-to-back'],
        timeline: [
            { year: 1986, event: 'Naissance à Toronto, Canada' },
            { year: 2009, event: 'Mixtape "So Far Gone"' },
            { year: 2011, event: '"Take Care" — Grammy Award' },
            { year: 2015, event: '"If You\'re Reading This It\'s Too Late" et le diss "Back to Back"' },
            { year: 2023, event: '"For All The Dogs"' },
            { year: 2024, event: 'Beef historique contre Kendrick Lamar' },
        ],
    },
];

const GLOSSARY = {
    'métaphore': "Figure de style qui désigne une chose par le nom d'une autre en établissant une comparaison implicite.",
    'allitération': "Répétition d'un même son consonantique en début de mots proches, créant un effet sonore volontaire.",
    'flow': "En rap, le flow désigne la manière dont l'artiste place ses syllabes sur le rythme : la fluidité, le rythme et l'intonation de sa voix.",
    'bpm': "Beats Per Minute : unité de mesure du tempo d'un morceau. Plus le BPM est élevé, plus la musique est rapide.",
    'sample': "Extrait d'un enregistrement existant réutilisé et intégré dans une nouvelle composition musicale.",
    'hook': "Le refrain d'un morceau, conçu pour être accrocheur et mémorable.",
    'diss track': "Morceau de rap dont le contenu est une attaque directe, musicale et lyricale, contre un autre artiste.",
    'storytelling': "Technique narrative en musique où l'artiste raconte une histoire, souvent autobiographique, avec un début, un milieu et une fin.",
    'polyphonie': "Superposition de plusieurs voies ou lignes mélodiques indépendantes dans une même composition musicale.",
    'ostinato': "Motif musical court répété de manière continue tout au long d'un morceau.",
};
