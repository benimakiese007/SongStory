/**
 * SongStory — Central Data Store
 * Single source of truth for all songs and artists.
 * Used by: search overlay, library filters, recommendations.
 */

const SONGS_DATA = [
    {
        id: 'lettre-a-la-republique',
        title: 'Lettre à la République',
        artist: 'Kery James',
        artistId: 'kery-james',
        genre: 'Rap Conscient',
        year: 2012,
        tags: ['rap', 'politique', 'colonialisme', 'histoire'],
        description: "Un réquisitoire implacable sur l'histoire coloniale de la France et l'intégration.",
        url: 'single-song.html?id=lettre-a-la-republique',
        artistUrl: 'artists/kery-james.html',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        spotifyId: '1L94MwniI061h2g50CebS0',
        appleMusicId: '510255928',
        album: '92.2012',
        duration: '4:28',
        bpm: '88',
        content: [
            {
                time: 0,
                lyrics: [
                    "À tous ces racistes à la tolérance hypocrite",
                    "Qui ont bâti leur nation sur le sang",
                    "Maintenant s'érigent en donneurs de leçons",
                    "Pilleurs de richesses, tueurs d'Africains",
                    "Colonisateurs, tortionnaires d'Algériens"
                ],
                analysis: `
                    <span class="text-white font-medium block mb-1">L'Ouverture Frontale :</span>
                    <p>Kery James ne prend aucun détour. Dès les premières mesures, il confronte la République à son passé colonial. Le champ lexical de la violence ("sang", "pilleurs", "tueurs", "tortionnaires") sert à déconstruire le mythe civilisateur.</p>
                `
            },
            {
                time: 60,
                lyrics: [
                    "Ce passé colonial, c'est le vôtre",
                    "C'est vous qui avez choisi de lier votre histoire à la nôtre",
                    "Et maintenant vous nous demandez de nous intégrer ?",
                    "Est-ce que vous vous êtes intégrés, vous, en Afrique ?"
                ],
                analysis: `
                    <span class="text-amber-400 font-medium block mb-1">Le Renversement de la Notion d'Intégration :</span>
                    <p>Le morceau renverse l'injonction politique de l'intégration imposée aux immigrés en rappelant que la France ne s'est pas "intégrée" dans ses propres colonies, mais a imposé sa présence par la force. C'est le nœud rhétorique du texte.</p>
                `
            },
            {
                time: 120,
                lyrics: [
                    "On ne s'excusera pas d'être là",
                    "On ne s'excusera pas d'être ce qu'on est"
                ],
                analysis: `
                    <span class="text-white font-medium block mb-1">L'Affirmation Identitaire :</span>
                    <p>Le refus de toute repentance. Kery James transforme le statut de victime historique en une posture d'affirmation fière. Ce passage clôture sa lettre non pas sur une soumission, mais sur un acte de résistance intellectuelle.</p>
                `
            }
        ]
    },
    {
        id: 'menace-de-mort',
        title: 'Menace de mort',
        artist: 'Youssoupha',
        artistId: 'youssoupha',
        genre: 'Rap',
        year: 2011,
        tags: ['rap', 'liberté d\'expression', 'justice', 'média'],
        description: "Une réponse chirurgicale face à l'emballement judiciaire et médiatique.",
        url: 'single-song.html?id=menace-de-mort',
        artistUrl: 'artists/youssoupha.html',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        spotifyId: '5wB5y0bWwBntn7F7LZb1M5',
        appleMusicId: '476239105',
        album: 'Noir D****',
        duration: '4:02',
        bpm: '92',
        content: [
            {
                time: 0,
                lyrics: [
                    "(Sample d'Éric Zemmour au tribunal)",
                    "Je ne crains pas la mort, je crains de ne pas vivre",
                    "Ma plume est une arme que je brandis pour survivre"
                ],
                analysis: `
                    <span class="text-white font-medium block mb-1">Contextualisation par le Sample :</span>
                    <p>L'intégration directe des déclarations du procès pose le décor judiciaire. Ce n'est plus seulement du rap, c'est une plaidoirie où Youssoupha s'approprie la parole de son accusateur pour la retourner contre lui.</p>
                `
            },
            {
                time: 55,
                lyrics: [
                    "Ils veulent censurer mes textes, condamner ma rime",
                    "Comme si raconter la rue était devenu un crime",
                    "Mais je n'appelle pas au meurtre, j'appelle à la conscience"
                ],
                analysis: `
                    <span class="text-amber-400 font-medium block mb-1">La Distinction entre Violence et Constat :</span>
                    <p>Youssoupha démontre l'hypocrisie de la censure. Il explique que le "meurtre" dont il parle est symbolique, ciblant idéologiquement les diffuseurs de haine, réclamant ainsi le même droit à l'hyperbole que les polémistes télévisés.</p>
                `
            },
            {
                time: 140,
                lyrics: [
                    "Noir Désir ou Noir D****, la justice a ses nuances"
                ],
                analysis: `
                    <span class="text-white font-medium block mb-1">Le Parallèle Sociétal :</span>
                    <p>Une punchline magistrale qui compare le traitement médiatique et juridique de Bertrand Cantat (Noir Désir). La justice est ainsi accusée d'un traitement à deux vitesses, basé sur la classe sociale et la couleur de peau.</p>
                `
            }
        ]
    },
    {
        id: 'dont-laik',
        title: "Don't Laïk",
        artist: 'Médine',
        artistId: 'medine',
        genre: 'Rap Conscient',
        year: 2015,
        tags: ['rap', 'laïcité', 'provocation', 'polémique'],
        description: "Un texte volontairement polémique et dense sur la laïcité française.",
        url: 'single-song.html?id=dont-laik',
        artistUrl: 'artists/medine.html',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        spotifyId: '3zMv1OqS1A0zE1kEwQOXZr',
        appleMusicId: '958045353',
        album: 'Démineur',
        duration: '3:45',
        bpm: '85',
        content: [
            {
                time: 0,
                lyrics: [
                    "Crucifions les laïcards comme à Golgotha",
                    "On met des fatwas sur la tête à Fourest"
                ],
                analysis: `
                    <span class="text-white font-medium block mb-1">Provocation Symbolique :</span>
                    <p>Médine utilise délibérément un vocabulaire religieux extrême et violent ("Crucifions", "fatwas") dans un cadre laïque. Ces hyperboles littéraires, bien que sujettes à controverse, visent à choquer pour déclencher le débat, dans la pure tradition pamphlétaire française.</p>
                `
            },
            {
                time: 50,
                lyrics: [
                    "Je suis une laïcité d'apaisement, pas d'acharnement",
                    "Pas la laïcité qui stigmatise la foi"
                ],
                analysis: `
                    <span class="text-amber-400 font-medium block mb-1">Le Cœur du Sujet :</span>
                    <p>Derrière la violence de forme se cache le vrai message : la distinction entre la loi de 1905 (qui protège les cultes) et une nouvelle forme de laïcité perçue comme un outil d'exclusion et de répression envers la minorité musulmane en France.</p>
                `
            }
        ]
    },
    {
        id: 'stan',
        title: 'Stan',
        artist: 'Eminem',
        artistId: 'eminem',
        genre: 'Rap',
        year: 2000,
        tags: ['rap', 'storytelling', 'obsession', 'célébrité'],
        description: "Le chef-d'œuvre narratif épistolaire qui a inventé le terme 'Stan'.",
        url: 'single-song.html?id=stan',
        artistUrl: 'artists/eminem.html',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        spotifyId: '3UmaczJpikHgJFyBTAJVoz',
        appleMusicId: '1440866782',
        album: 'The Marshall Mathers LP',
        duration: '6:44',
        bpm: '80',
        content: [
            {
                time: 25,
                lyrics: [
                    "Dear Slim, I wrote you but you still ain't callin'",
                    "I left my cell, my pager, and my home phone at the bottom"
                ],
                analysis: `
                    <span class="text-white font-medium block mb-1">L'Épistolaire en Musique :</span>
                    <p>La chanson utilise le format de lettres successives pour montrer la lente dégradation mentale d'un fan obsessionnel. La voix d'Eminem s'adapte, jouant un personnage qui confond la personne (Marshall) de sa persona (Slim Shady).</p>
                `
            },
            {
                time: 195,
                lyrics: [
                    "Dear Mr. 'I'm Too Good To Call Or Write My Fans'",
                    "This will be the last package I ever send your ass"
                ],
                analysis: `
                    <span class="text-amber-400 font-medium block mb-1">La Rupture de la Tape 3 :</span>
                    <p>Dans ce crescendo émotionnel dramatique, le bruit de la pluie, de la voiture et la voix cassée de Stan illustrent une issue fatale imminente. Les effets sonores renforcent l'immersion cinématographique totale.</p>
                `
            },
            {
                time: 300,
                lyrics: [
                    "Dear Stan, I meant to write you sooner, but I just been busy",
                    "I really think you and your girlfriend need each other..."
                ],
                analysis: `
                    <span class="text-white font-medium block mb-1">Le Dénouement Tragique :</span>
                    <p>Eminem reprend sa propre voix, tentant de raisonner son fan. La révélation macabre finale (Eminem réalise en l'écrivant que Stan est l'homme suicidé aux informations) offre une morale frappante sur la responsabilité de l'artiste face à l'impact de ses œuvres morbides.</p>
                `
            }
        ]
    },
    {
        id: 'power',
        title: 'Power',
        artist: 'Kanye West',
        artistId: 'kanye-west',
        genre: 'Hip-Hop',
        year: 2010,
        tags: ['hip-hop', 'célébrité', 'ego', 'production'],
        description: "L'hymne triomphal et mégalomaniaque analysant les affres de la célébrité.",
        url: 'single-song.html?id=power',
        artistUrl: 'artists/kanye-west.html',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        spotifyId: '2gZUPNdnz5Y45eiGxpHGSc',
        appleMusicId: '1440742903',
        album: 'My Beautiful Dark Twisted Fantasy',
        duration: '4:52',
        bpm: '88',
        content: [
            {
                time: 0,
                lyrics: [
                    "I'm livin' in that 21st century",
                    "Doin' something mean to it",
                    "Do it better than anybody you ever seen do it"
                ],
                analysis: `
                    <span class="text-white font-medium block mb-1">Le Choc Sonore :</span>
                    <p>Propulsé par le sample hurlant de King Crimson et des chœurs africains, le morceau est une démonstration pure de mégalomanie architecturale. Le son est impérial, rugueux et dense, posant West comme un titan au centre du 21e siècle.</p>
                `
            },
            {
                time: 110,
                lyrics: [
                    "No one man should have all that power",
                    "The clock's tickin', I just count the hours",
                    "Stop trippin', I'm trippin' off the power"
                ],
                analysis: `
                    <span class="text-amber-400 font-medium block mb-1">La Fragilité de l'Ego :</span>
                    <p>Derrière la grandiloquence, le refrain trahit une angoisse : Kanye admet que son emprise et sa célébrité sont excessives. "No one man should have all that power" est moins une célébration qu'une mise en garde contre sa propre psyché dévorée par sa notoriété.</p>
                `
            },
            {
                time: 235,
                lyrics: [
                    "Now this will be a beautiful death",
                    "I'm jumping out the window, I'm letting everything go"
                ],
                analysis: `
                    <span class="text-white font-medium block mb-1">L'Outro Suicidaire :</span>
                    <p>La chanson qui a commencé comme un triomphe impérial se termine brusquement par une vision d'autodestruction joyeuse et poétique ("beautiful death"). C'est le paradoxe kanyesque ultime : construire un empire au prix de sa santé mentale.</p>
                `
            }
        ]
    },
    {
    id: "back-to-back",
    title: "Back to Back",
    artist: "Drake",
    artistId: "drake",
    genre: "Hip-Hop",
    year: 2015,
    tags: [
        "hip-hop",
        "beef",
        "diss track"
    ],
    description: "Le diss track légendaire de 2015 visant Meek Mill.",
    url: "single-song.html?id=back-to-back",
    artistUrl: "artists/drake.html",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    spotifyId: "5m9pM8pGez1u8jS4R6u8rM",
    appleMusicId: "1440845348",
    album: "Back to Back (Single)",
    duration: "2:50",
    bpm: "87",
    content: [
        {
            time: 0,
            lyrics: [
                "Oh man, oh man, oh man, not again",
                "Yeah, I learned the game\r\n                                from William Wesley, you can never check me",
                "Back to back for the niggas that didn't\r\n                                get the message"
            ],
            analysis: "<span class=\"text-white font-medium block mb-1\">Intro : L'exaspérance du vainqueur</span>\r\n                    <p>Drake commence par un soupir (\"not again\"), feignant la lassitude face à un adversaire\r\n                    qu'il juge indigne. Il cite \"World Wide Wes\" (William Wesley), un consultant légendaire\r\n                    de la NBA connu pour son influence dans l'ombre, affirmant ainsi son propre pouvoir\r\n                    institutionnel. Le terme \"Back to Back\" fait référence à sa deuxième attaque en moins de\r\n                    4 jours, une stratégie d'asphyxie médiatique.</p>"
        },
        {
            time: 30,
            lyrics: [
                "Back to back like I'm on the cover of\r\n                                Lethal Weapon",
                "Back to back like I'm Jordan '96, '97,\r\n                                whoa",
                "I might be mad that I gave this\r\n                                attention"
            ],
            analysis: "<span class=\"text-amber-400 font-medium block mb-1\">Drizzy vs Jordan</span>\r\n                    <p>Drake se compare à Michael Jordan lors de ses années de doublé au championnat (96-97),\r\n                    plaçant ce clash dans une optique de compétition sportive de haut niveau. La référence à\r\n                    *Lethal Weapon* (L'Arme Fatale) renforce l'image d'un duo iconique (lui et son équipe\r\n                    OVO) contre le reste du monde. Il souligne déjà que ce conflit est presque \"en dessous\r\n                    de lui\".</p>"
        },
        {
            time: 60,
            lyrics: [
                "You gon' make me buy bottles for\r\n                                Charlamagne",
                "You gon' make me go out of my fuckin'\r\n                                way",
                "I waited four days, nigga,\r\n                                where y'all at?"
            ],
            analysis: "<span class=\"text-white font-medium block mb-1\">L'humiliation par l'absence</span>\r\n                    <p>Charlamagne Tha God était l'un des plus grands critiques de Drake. En lui envoyant du\r\n                    champagne (Dom Pérignon Luminous), Drake retourne son ennemi contre Meek Mill. Le \"I\r\n                    waited four days\" est une pique directe à la lenteur de Meek Mill pour répondre à\r\n                    \"Charged Up\", prouvant que Drake contrôle le tempo du beef.</p>"
        },
        {
            time: 95,
            lyrics: [
                "Second floor at Tootsies, gettin'\r\n                                shoulder rubs",
                "This for y'all that think that I don't\r\n                                write enough",
                "They just mad 'cause I got the Midas\r\n                                touch"
            ],
            analysis: "<span class=\"text-white font-medium block mb-1\">Réponse aux accusations de\r\n                    Ghostwriting</span>\r\n                    <p>Meek Mill accusait Drake de ne pas écrire ses textes (via l'affaire Quentin Miller).\r\n                    Drake répond avec arrogance en se montrant détendu au club Tootsie’s (Miami). Il utilise\r\n                    la <span class=\"glossary-term\" data-term=\"allusion\"\r\n                    data-def=\"Référence indirecte à un fait, un personnage ou une œuvre connue.\">allusion</span>\r\n                    au roi Midas pour dire que tout ce qu'il touche se transforme en or, peu importe les\r\n                    critiques sur sa méthode de création.</p>"
        },
        {
            time: 130,
            lyrics: [
                "Is that a world tour or your\r\n                                girl's tour?",
                "I know that you gotta be a thug for her",
                "This ain't what she meant\r\n                                when she told you to open up more"
            ],
            analysis: "<span class=\"text-amber-400 font-medium block mb-1\">Le coup fatal : La référence à Nicki\r\n                    Minaj</span>\r\n                    <p>C'est la ligne qui a défini ce clash. À l'époque, Meek Mill faisait la première partie de\r\n                    la tournée de sa petite amie, Nicki Minaj. Drake retourne cette situation pour\r\n                    l'émasculer publiquement, insinuant qu'il est un subordonné. Le jeu de mots sur \"open\r\n                    up\" (faire la première partie / s'ouvrir émotionnellement) est une attaque dévastatrice\r\n                    sur la virilité de l'adversaire.</p>"
        },
        {
            time: 165,
            lyrics: [
                "Yeah, trigger fingers turn to Twitter\r\n                                fingers",
                "Yeah, you gettin' bodied by a singin'\r\n                                nigga",
                "I'm not the type of nigga that'll type\r\n                                to niggas"
            ],
            analysis: "<span class=\"text-white font-medium block mb-1\">Guerre numérique vs Réalité</span>\r\n                    <p>Drake invente l'expression \"Twitter fingers\" pour décrire ceux qui sont courageux sur\r\n                    internet mais inefficaces en dehors. L'ironie suprême est que Drake, souvent moqué pour\r\n                    son côté sensible et \"chanteur\", est celui qui est en train de \"tuer\" (bodied) un\r\n                    rappeur de rue prétendu plus dur. C'est l'un des plus grands <span class=\"glossary-term\"\r\n                    data-term=\"punchline\"\r\n                    data-def=\"Phrase forte ou choc dans un texte, particulièrement en rap, conçue pour marquer l'esprit.\">punchlines</span>\r\n                    de la décennie.</p>"
        },
        {
            time: 200,
            lyrics: [
                "Shout-out to all my boss bitches wifin'\r\n                                niggas",
                "Make sure you hit him\r\n                                with the prenup",
                "Then tell that man to ease up"
            ],
            analysis: "<span class=\"text-white font-medium block mb-1\">L'inversion des rôles</span>\r\n                    <p>Drake continue d'attaquer la position financière de Meek au sein de son couple avec\r\n                    Nicki. En recommandant un \"prenup\" (contrat de mariage), il dresse le portrait d'un Meek\r\n                    Mill profiteur. Drake utilise ici le respect des femmes puissantes (\"boss bitches\") pour\r\n                    isoler socialement Meek.</p>"
        },
        {
            time: 240,
            lyrics: [
                "I been puttin' on a show, it was a sell\r\n                                out event",
                "Soon as a nigga hit the stage, they gon'\r\n                                ask if I can play this back to back",
                "I took a break from Views,\r\n                                now back to that"
            ],
            analysis: "<span class=\"text-white font-medium block mb-1\">Conclusion : Retour aux affaires</span>\r\n                    <p>Drake conclut en rappelant que ce clash n'était qu'une distraction mineure. Il mentionne\r\n                    son futur album *Views*, signalant à son public que le divertissement est fini et qu'il\r\n                    retourne à son but principal : dominer l'industrie musicale. Il prophétise avec succès\r\n                    que le public réclamera ce morceau à chaque concert (\"play this back to back\").</p>"
        }
    ]
},
];

const ARTISTS_DATA = [
    {
        id: 'kery-james',
        name: 'Kery James',
        genre: 'Rap Conscient',
        country: 'France',
        bio: "Alix Mathurin, dit Kery James, est une des figures historiques du rap français originel, pilier de la Mafia K'1 Fry, devenu la référence majeure du rap conscient politique en France.",
        influence: "Reconnu pour ses textes denses abordant le contexte social des banlieues, l'histoire coloniale de la France, et l'exigence morale.",
        url: 'artists/kery-james.html',
        tags: ['rap', 'conscient', 'politique'],
        songs: ['lettre-a-la-republique'],
        timeline: [
            { year: 1996, event: "Formation d'Idéal J et 'O'riginal MC's'" },
            { year: 2001, event: "'Si c'était à refaire' — Premier album solo acclamé" },
            { year: 2012, event: "92.2012 et l'onde de choc 'Lettre à la République'" }
        ]
    },
    {
        id: 'youssoupha',
        name: 'Youssoupha',
        genre: 'Rap',
        country: 'France / RDC',
        bio: "Youssoupha Mabiki, né en 1979 à Kinshasa, est un rappeur dont le style allie une immense richesse lexicale à une approche humaniste.",
        influence: "Surnommé le 'Lyriciste Bantou', il a défendu un rap technique, porteur de sens, en réhabilitant la poésie au cœur du rap commercial français.",
        url: 'artists/youssoupha.html',
        tags: ['rap', 'conscient', 'lyriciste'],
        songs: ['menace-de-mort'],
        timeline: [
            { year: 2007, event: "Sortie de 'À chaque frère'" },
            { year: 2011, event: "Victoire juridique et médiatique après la polémique avec E. Zemmour" },
            { year: 2012, event: "L'apogée avec l'album classique 'Noir D****'" }
        ]
    },
    {
        id: 'medine',
        name: 'Médine',
        genre: 'Rap Conscient',
        country: 'France',
        bio: "Médine Zaouiche, venu du Havre, est l'un des paroliers les plus tranchants du rap français. Il emploie souvent l'ironie et le sarcasme pour dénoncer l'islamophobie et le racisme.",
        influence: "Il pousse ses auditeurs et la société française dans leurs derniers retranchements intellectuels avec un lexique ultra-violent mais métaphorique.",
        url: 'artists/medine.html',
        tags: ['rap', 'laïcité', 'provocation'],
        songs: ['dont-laik'],
        timeline: [
            { year: 2005, event: "Révélation avec 'Jihad, le plus grand combat est contre soi-même'" },
            { year: 2015, event: "Le séisme 'Don't Laïk', qui bouscule l'establishment politique." }
        ]
    },
    {
        id: 'eminem',
        name: 'Eminem',
        genre: 'Rap',
        country: 'États-Unis',
        bio: "Marshall Mathers est sans conteste l'un des rappeurs les plus influents au monde, alliant virtuosité technique, shock value, et introspection brutale.",
        influence: "Il a introduit une approche psychologique au rap à la première personne, brisant les digues entre le hip-hop et la culture de masse globale.",
        url: 'artists/eminem.html',
        tags: ['rap', 'storytelling', 'technique'],
        songs: ['stan'],
        timeline: [
            { year: 1999, event: "Le raz-de-marée mondial 'The Slim Shady LP'" },
            { year: 2000, event: "'The Marshall Mathers LP', incluant l'intemporel 'Stan'" },
            { year: 2002, event: "Oscar de la meilleure chanson originale pour 'Lose Yourself'" }
        ]
    },
    {
        id: 'kanye-west',
        name: 'Kanye West',
        genre: 'Hip-Hop',
        country: 'États-Unis',
        bio: "Ye, ex-Kanye West, est un producteur, rappeur et créateur de mode qui a profondément bouleversé le paysage culturel moderne.",
        influence: "Il a abattu les frontières du gangsta rap pour y injecter doutes existentiels, mode, électronique et folie des grandeurs.",
        url: 'artists/kanye-west.html',
        tags: ['hip-hop', 'production', 'ego'],
        songs: ['power'],
        timeline: [
            { year: 2004, event: "Redéfinit les sonorités avec 'The College Dropout'" },
            { year: 2010, event: "'My Beautiful Dark Twisted Fantasy', chef-d'œuvre titanesque et sortie de 'Power'" },
            { year: 2013, event: "L'expérimentation avant-gardiste 'Yeezus'" }
        ]
    }
];

const GLOSSARY = {
    'métaphore': "Figure de style qui désigne une chose par le nom d'une autre en établissant une comparaison implicite.",
    'allitération': "Répétition d'un même son consonantique en début de mots proches, créant un effet sonore volontaire.",
    'flow': "En rap, le flow désigne la manière dont l'artiste place ses syllabes sur le rythme : la fluidité, le rythme et l'intonation de sa voix.",
    'bpm': "Beats Per Minute : unité de mesure du tempo d'un morceau. Plus le BPM est élevé, plus la musique est rapide.",
    'sample': "Extrait d'un enregistrement existant réutilisé et intégré dans une nouvelle composition musicale.",
    'hook': "Le refrain d'un morceau, conçu pour être accrocheur et mémorable.",
    'storytelling': "Technique narrative en musique où l'artiste raconte une histoire, souvent autobiographique.",
    'polyphonie': "Superposition de plusieurs voies ou lignes mélodiques indépendantes dans une même composition musicale.",
    'ostinato': "Motif musical court répété de manière continue tout au long d'un morceau.",
    'laïcité': "Principe de séparation de la société civile et de la société religieuse. Souvent détournée politiquement dans le contexte culturel contemporain."
};
