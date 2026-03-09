/**
 * SongStory — Dynamic Data Store via Supabase
 * Single source of truth for all songs and artists, fetched dynamically.
 */

let SONGS_DATA = [];
let ARTISTS_DATA = [];
let GLOSSARY = {};

window.loadAppDataFromSupabase = async function () {
    if (!window.ss_supabase) {
        console.warn('Supabase not initialized.');
        return;
    }

    try {
        const [artistsRes, songsRes, contentsRes, glossaryRes] = await Promise.all([
            window.ss_supabase.from('artists').select('*'),
            window.ss_supabase.from('songs').select('*').order('year', { ascending: false }),
            window.ss_supabase.from('song_contents').select('*').order('display_order', { ascending: true }),
            window.ss_supabase.from('glossary').select('*')
        ]);

        ARTISTS_DATA = artistsRes.data || [];

        const glossaryData = glossaryRes.data || [];
        GLOSSARY = glossaryData.reduce((acc, curr) => {
            acc[curr.term] = curr.definition;
            return acc;
        }, {});

        const rawSongs = songsRes.data || [];
        const rawContents = contentsRes.data || [];

        SONGS_DATA = rawSongs.map(song => {
            const artistObj = ARTISTS_DATA.find(a => a.id === song.artist_id);
            const artistName = artistObj ? artistObj.name : 'Artiste inconnu';

            const songContents = rawContents
                .filter(c => c.song_id === song.id)
                .map(c => ({
                    time: c.time,
                    lyrics: c.lyrics || [],
                    analysis: c.analysis || ''
                }));

            return {
                id: song.id,
                title: song.title,
                artist: artistName,
                artistId: song.artist_id,
                genre: song.genre,
                year: song.year,
                tags: song.tags || [],
                description: song.description,
                url: song.url,
                artistUrl: artistObj ? artistObj.url : '#',
                audio: song.audio_url,
                spotifyId: song.spotify_id,
                appleMusicId: song.apple_music_id,
                album: song.album,
                duration: song.duration,
                bpm: song.bpm,
                content: songContents
            };
        });

        console.log('✅ SongStory Data Loaded from Supabase');

        // Add local fallback for "Lettre à la République" if not in Supabase
        if (!SONGS_DATA.find(s => s.id === 'lettre-a-la-republique')) {
            SONGS_DATA.push({
                id: 'lettre-a-la-republique',
                title: 'Lettre à la République',
                artist: 'Kery James',
                artistId: 'kery-james',
                genre: 'Rap Conscient',
                year: 2012,
                tags: ['social', 'politique', 'colonialisme'],
                description: 'Un réquisitoire puissant sur le passé colonial et les fractures sociales.',
                url: 'songs/lettre-a-la-republique.html',
                artistUrl: 'artists/kery-james.html',
                audio: '',
                spotifyId: '',
                appleMusicId: '',
                album: '92.2012',
                duration: '4:02',
                bpm: '~88',
                content: [
                    {
                        time: 0,
                        lyrics: [
                            "À tous ces racistes à la tolérance hypocrite",
                            "Qui ont bâti leur nation sur le sang",
                            "Maintenant s'érigent en donneurs de leçons",
                            "Pilleurs de richesses, tueurs d'africains",
                            "Colonisateurs, tortionnaires d'algériens"
                        ],
                        analysis: "Kery James dénonce l'hypocrisie des élites qui oublient que la prospérité française s'est bâtie sur la colonisation et le pillage des richesses."
                    },
                    {
                        time: 30,
                        lyrics: ["Nous les Arabes et les Noirs", "On est pas là par hasard", "Toute arrivée a son départ !"],
                        analysis: "Le pivot du morceau : la présence des immigrés n'est pas un hasard mais la conséquence des politiques coloniales et économiques."
                    }
                ]
            });
        }

        // Add local fallback for "7 Minute Drill"
        if (!SONGS_DATA.find(s => s.id === '7-minute-drill')) {
            SONGS_DATA.push({
                id: '7-minute-drill',
                title: '7 Minute Drill',
                artist: 'J. Cole',
                artistId: 'j-cole',
                genre: 'Rap',
                year: 2024,
                tags: ['diss', 'beef', 'kendrick lamar'],
                description: 'La réponse directe de J. Cole à Kendrick Lamar dans le beef de 2024.',
                url: 'songs/7-minute-drill.html',
                artistUrl: 'artists/j-cole.html',
                audio: '',
                spotifyId: '',
                appleMusicId: '',
                album: 'Might Delete Later',
                duration: '3:32',
                bpm: '~90',
                content: [
                    {
                        time: 0,
                        lyrics: ["Light work like it's PWC", "It's a cold world, keep the heat under your seat"],
                        analysis: "Cole minimise l'impact de Kendrick en comparant le beef à un simple travail de bureau (PWC)."
                    },
                    {
                        time: 60,
                        lyrics: ["Your first shit was classic, your last shit was tragic", "Your second shit put niggas to sleep, but they gassed it"],
                        analysis: "Une critique systématique de la discographie de Kendrick Lamar."
                    }
                ]
            });
        }

        // Populate fallback glossary if empty
        if (Object.keys(GLOSSARY).length === 0) {
            GLOSSARY = {
                "seed": "Fils ou enfant (argot). Dans ce contexte, Kendrick Lamar mentionne le fils de Drake (Adonis).",
                "jabs": "Coups légers ou piques verbales amicales. Terme emprunté à la boxe.",
                "DP": "Disciplinary Punishment. Une bastonnade ou punition physique infligée aux membres d'un gang qui ont enfreint les règles.",
                "PC": "Protective Custody. Quartier de haute sécurité ou d'isolement en prison, souvent utilisé pour protéger les détenus vulnérables (ou les délateurs).",
                "slimed": "Trahison par un proche ou vol commis envers quelqu'un par une personne de son entourage (argot issu de la culture street/rap).",
                "BM": "Baby Mama. La mère de l'enfant d'un homme (souvent quand ils ne sont pas ou plus mariés/en couple).",
                "BD": "Baby Daddy. Le père de l'enfant d'une femme.",
                "GM": "General Manager. Un manager général, ici en référence à Dave Free qui gère les affaires de Kendrick.",
                "fake tea": "Fausses rumeurs ou ragots sans aucun fondement (le 'tea' désignant les ragots en argot).",
                "ops": "Oppositions/Opponents. Les ennemis ou les membres de gangs rivaux.",
                "cap": "Mensonge. Dire 'no cap' signifie qu'on dit la stricte vérité.",
                "beef": "Conflit, embrouille ou guerre ouverte entre deux rappeurs ou deux groupes.",
                "ghostwriter": "La plume fantôme. Une personne qui écrit les textes (lyrics) pour un autre artiste sans être créditée.",
                "drop": "Sortir ou publier un morceau, un album ou un projet musical.",
                "bars": "Celle-ci désigne les lignes de texte d'un couplet (les rimes), particulièrement si elles sont techniquement impressionnantes.",
                "smoke": "Des problèmes ou de la violence. 'I want all the smoke' signifie 'Je suis prêt pour la guerre/le conflit'.",
                "drac'": "Abréviation pour un Draco, qui est un type de pistolet/arme à feu (souvent un AK-47 raccourci) très mentionné dans le rap américain."
            };
        }
    } catch (err) {
        console.error('Error loading data from Supabase:', err);
    }
};

// Add local fallback for "Euphoria"
if (typeof SONGS_DATA !== 'undefined' && !SONGS_DATA.find(s => s.id === 'euphoria')) {
    SONGS_DATA.push({
        id: 'euphoria',
        title: 'Euphoria',
        artist: 'Kendrick Lamar',
        artistId: 'kendrick-lamar',
        genre: 'Diss Track',
        year: 2024,
        tags: ['diss', 'beef', 'drake'],
        description: 'La réponse monumentale de Kendrick Lamar à Drake, disséquant son identité et sa place dans le hip-hop.',
        url: 'songs/euphoria.html',
        artistUrl: 'artists/kendrick-lamar.html',
        audio: '',
        spotifyId: '',
        appleMusicId: '',
        album: 'Single',
        duration: '6:23',
        bpm: '~84',
        content: [
            {
                time: 0,
                lyrics: ["Eurt si em tuoba yas yeht gnihtyrevE", "Everything they say about me is true"],
                analysis: "Un sample inversé de 'The Wiz' suggérant que Drake n'est qu'une façade manipulatrice."
            },
            {
                time: 190,
                lyrics: ["I hate the way that you walk, the way that you talk, I hate the way that you dress"],
                analysis: "Le passage viral où Kendrick exprime une haine viscérale et totale pour l'image de Drake."
            }
        ]
    });
}

// Local fallback for "Family Matters"
if (typeof SONGS_DATA !== 'undefined' && !SONGS_DATA.find(s => s.id === 'family-matters')) {
    SONGS_DATA.push({
        id: 'family-matters',
        title: 'Family Matters',
        artist: 'Drake',
        artistId: 'drake',
        genre: 'Diss Track',
        year: 2024,
        tags: ['diss', 'beef', 'kendrick lamar'],
        description: 'La réponse massive de Drake, une épopée de 7 minutes ciblant toute la coalition opposée à lui.',
        url: 'songs/family-matters.html',
        artistUrl: 'artists/drake.html',
        audio: '../audio/family-matters.mp3',
        spotifyId: '1S8Ifq1zU69wHId62N676t', // Example
        appleMusicId: '1745496412',
        album: 'Single',
        duration: '7:36',
        bpm: '~84',
        themeColor: '#1e40af', // Deep blue
        content: [] // Will be read from HTML statically
    });
}

// Local fallback for "Stan"
if (typeof SONGS_DATA !== 'undefined' && !SONGS_DATA.find(s => s.id === 'stan')) {
    SONGS_DATA.push({
        id: 'stan',
        title: 'Stan',
        artist: 'Eminem',
        artistId: 'eminem',
        genre: 'Storytelling',
        year: 2000,
        tags: ['storytelling', 'classic', 'dido', 'obsession'],
        description: 'Le chef-d\'œuvre narratif d\'Eminem sur l\'obsession d\'un fan, devenu un terme culturel universel.',
        url: 'songs/stan.html',
        artistUrl: 'artists/eminem.html',
        audio: '',
        spotifyId: '',
        appleMusicId: '',
        album: 'The Marshall Mathers LP',
        duration: '6:44',
        bpm: '~82',
        content: []
    });
}

// Local fallback for "Power"
if (typeof SONGS_DATA !== 'undefined' && !SONGS_DATA.find(s => s.id === 'power')) {
    SONGS_DATA.push({
        id: 'power',
        title: 'Power',
        artist: 'Kanye West',
        artistId: 'kanye-west',
        genre: 'Rap',
        year: 2010,
        tags: ['ego', 'pouvoir', 'classic', 'king crimson'],
        description: 'L\'hymne mégalomane de Kanye West sur le pouvoir, l\'ego et l\'autodestruction.',
        url: 'songs/power.html',
        artistUrl: 'artists/kanye-west.html',
        audio: '',
        spotifyId: '',
        appleMusicId: '',
        album: 'My Beautiful Dark Twisted Fantasy',
        duration: '4:52',
        bpm: '~76',
        content: []
    });
}

// Local fallback for "Don't Laïk"
if (typeof SONGS_DATA !== 'undefined' && !SONGS_DATA.find(s => s.id === 'dont-laik')) {
    SONGS_DATA.push({
        id: 'dont-laik',
        title: 'Don\'t Laïk',
        artist: 'Médine',
        artistId: 'medine',
        genre: 'Rap Conscient',
        year: 2012,
        tags: ['laïcité', 'islam', 'politique', 'controverse'],
        description: 'Le brûlot controversé de Médine sur la laïcité, la religion et l\'hypocrisie politique.',
        url: 'songs/dont-laik.html',
        artistUrl: 'artists/medine.html',
        audio: '',
        spotifyId: '',
        appleMusicId: '',
        album: 'Arabian Panther',
        duration: '4:18',
        bpm: '~90',
        content: []
    });
}

// Local fallback for "Ménace de Mort"
if (typeof SONGS_DATA !== 'undefined' && !SONGS_DATA.find(s => s.id === 'menace-de-mort')) {
    SONGS_DATA.push({
        id: 'menace-de-mort',
        title: 'Ménace de Mort',
        artist: 'Youssoupha',
        artistId: 'youssoupha',
        genre: 'Rap Conscient',
        year: 2009,
        tags: ['liberté', 'censure', 'justice', 'polémique'],
        description: 'La défense de Youssoupha face à la censure du rap français et la judiciarisation de la liberté d\'expression.',
        url: 'songs/menace-de-mort.html',
        artistUrl: 'artists/youssoupha.html',
        audio: '',
        spotifyId: '',
        appleMusicId: '',
        album: 'Sur les chemins du retour',
        duration: '4:35',
        bpm: '~85',
        content: []
    });
}
