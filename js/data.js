/**
 * SongStory — Static-First Data Layer
 * This file now mainly serves as a backup or for dynamic features (player, search).
 * Most content is now hardcoded directly in HTML for instant loading.
 */

let SONGS_DATA = [
    {
        id: 'euphoria',
        title: 'Euphoria',
        artist: 'Kendrick Lamar',
        artistId: 'kendrick-lamar',
        genre: 'Rap',
        year: 2024,
        audio: '',
        themeColor: '#450a0a'
    },
    {
        id: 'family-matters',
        title: 'Family Matters',
        artist: 'Drake',
        artistId: 'drake',
        genre: 'Rap',
        year: 2024,
        audio: '../audio/family-matters.mp3',
        themeColor: '#1e40af'
    },
    {
        id: '7-minute-drill',
        title: '7 Minute Drill',
        artist: 'J. Cole',
        artistId: 'j-cole',
        genre: 'Rap',
        year: 2024,
        audio: '',
        themeColor: '#064e3b'
    },
    {
        id: 'lettre-a-la-republique',
        title: 'Lettre à la République',
        artist: 'Kery James',
        artistId: 'kery-james',
        genre: 'Rap Conscient',
        year: 2012,
        audio: '',
        themeColor: '#7f1d1d'
    },
    {
        id: 'stan',
        title: 'Stan',
        artist: 'Eminem',
        artistId: 'eminem',
        genre: 'Rap',
        year: 2000,
        audio: '',
        themeColor: '#18181b'
    },
    {
        id: 'power',
        title: 'Power',
        artist: 'Kanye West',
        artistId: 'kanye-west',
        genre: 'Rap',
        year: 2010,
        audio: '',
        themeColor: '#450a0a'
    },
    {
        id: 'dont-laik',
        title: 'Don\'t Laïk',
        artist: 'Médine',
        artistId: 'medine',
        genre: 'Rap Conscient',
        year: 2012,
        audio: '',
        themeColor: '#064e3b'
    },
    {
        id: 'menace-de-mort',
        title: 'Ménace de Mort',
        artist: 'Youssoupha',
        artistId: 'youssoupha',
        genre: 'Rap Conscient',
        year: 2009,
        audio: '',
        themeColor: '#3f3f46'
    }
];

let ARTISTS_DATA = [
    { id: 'kendrick-lamar', name: 'Kendrick Lamar' },
    { id: 'drake', name: 'Drake' },
    { id: 'eminem', name: 'Eminem' },
    { id: 'kery-james', name: 'Kery James' },
    { id: 'j-cole', name: 'J. Cole' },
    { id: 'kanye-west', name: 'Kanye West' },
    { id: 'medine', name: 'Médine' },
    { id: 'youssoupha', name: 'Youssoupha' }
];

let GLOSSARY = {
    "seed": "Fils ou enfant (argot).",
    "jabs": "Coups légers ou piques verbales amicales.",
    "DP": "Disciplinary Punishment.",
    "PC": "Protective Custody.",
    "slimed": "Trahison par un proche.",
    "BM": "Baby Mama.",
    "BD": "Baby Daddy.",
    "GM": "General Manager.",
    "fake tea": "Fausses rumeurs.",
    "ops": "Oppositions/Opponents.",
    "cap": "Mensonge.",
    "beef": "Conflit musical.",
    "ghostwriter": "Plume fantôme.",
    "drop": "Sortie d'un morceau.",
    "bars": "Lignes de texte.",
    "smoke": "Des problèmes ou de la violence.",
    "drac'": "Abréviation pour un Draco (arme)."
};

// Placeholder for compatibility
window.loadAppDataFromSupabase = async () => console.log('Static mode enabled - No Supabase sync needed.');
