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

        // Local fallback for "7 Minute Drill"
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
