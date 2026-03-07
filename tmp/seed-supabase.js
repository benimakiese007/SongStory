
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://obcgvgaazxhiiyopfhwq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iY2d2Z2FhenhoaWl5b3BmaHdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4Mzk4NDIsImV4cCI6MjA4ODQxNTg0Mn0.FvlNm8l-bu_7yL2SFDJ7PaFwRVkJJkwhVQ541WCDYCI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function seed() {
    console.log('Starting seeding process...');

    // Hardcoded data based on seed.sql for reliability
    // Artists
    const artists = [
        { id: 'kery-james', name: 'Kery James', genre: 'Rap Conscient', country: 'France', bio: 'Alix Mathurin, dit Kery James, est une des figures historiques du rap français originel, pilier de la Mafia K\'1 Fry, devenu la référence majeure du rap conscient politique en France.', influence: 'Reconnu pour ses textes denses abordant le contexte social des banlieues, l\'histoire coloniale de la France, et l\'exigence morale.', url: 'artists/kery-james.html', tags: ['rap', 'conscient', 'politique'] },
        { id: 'youssoupha', name: 'Youssoupha', genre: 'Rap', country: 'France / RDC', bio: 'Youssoupha Mabiki, né en 1979 à Kinshasa, est un rappeur dont le style allie une immense richesse lexicale à une approche humaniste.', influence: 'Surnommé le \'Lyriciste Bantou\', il a défendu un rap technique, porteur de sens, en réhabilitant la poésie au cœur du rap commercial français.', url: 'artists/youssoupha.html', tags: ['rap', 'conscient', 'lyriciste'] },
        { id: 'medine', name: 'Médine', genre: 'Rap Conscient', country: 'France', bio: 'Médine Zaouiche, venu du Havre, est l\'un des paroliers les plus tranchants du rap français. Il emploie souvent l\'ironie et le sarcasme pour dénoncer l\'islamophobie et le racisme.', influence: 'Il pousse ses auditeurs et la société française dans leurs derniers retranchements intellectuels avec un lexique ultra-violent mais métaphorique.', url: 'artists/medine.html', tags: ['rap', 'laïcité', 'provocation'] },
        { id: 'eminem', name: 'Eminem', genre: 'Rap', country: 'États-Unis', bio: 'Marshall Mathers est sans conteste l\'un des rappeurs les plus influents au monde, alliant virtuosité technique, shock value, et introspection brutale.', influence: 'Il a introduit une approche psychologique au rap à la première personne, brisant les digues entre le hip-hop et la culture de masse globale.', url: 'artists/eminem.html', tags: ['rap', 'storytelling', 'technique'] },
        { id: 'kanye-west', name: 'Kanye West', genre: 'Hip-Hop', country: 'États-Unis', bio: 'Ye, ex-Kanye West, est un producteur, rappeur et créateur de mode qui a profondément bouleversé le paysage culturel moderne.', influence: 'Il a abattu les frontières du gangsta rap pour y injecter doutes existentiels, mode, électronique et folie des grandeurs.', url: 'artists/kanye-west.html', tags: ['hip-hop', 'production', 'ego'] },
        { id: 'drake', name: 'Drake', genre: 'Hip-Hop', country: 'Canada', bio: 'Aubrey Drake Graham est un rappeur, chanteur et acteur canadien qui a dominé les charts mondiaux depuis les années 2010.', influence: 'Il a popularisé le mélange de rap mélancolique et de R&B, influençant une génération entière d\'artistes avec son approche émotionnelle et introspective.', url: 'artists/drake.html', tags: ['hip-hop', 'r&b', 'melancholy'] }
    ];

    // Songs
    const songs = [
        { id: 'lettre-a-la-republique', title: 'Lettre à la République', artist_id: 'kery-james', genre: 'Rap Conscient', year: 2012, tags: ['rap', 'politique', 'colonialisme', 'histoire'], description: 'Un réquisitoire implacable sur l\'histoire coloniale de la France et l\'intégration.', url: 'single-song.html?id=lettre-a-la-republique', audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', spotify_id: '1L94MwniI061h2g50CebS0', apple_music_id: '510255928', album: '92.2012', duration: '4:28', bpm: '88' },
        { id: 'menace-de-mort', title: 'Menace de mort', artist_id: 'youssoupha', genre: 'Rap', year: 2011, tags: ['rap', 'liberté d\'expression', 'justice', 'média'], description: 'Une réponse chirurgicale face à l\'emballement judiciaire et médiatique.', url: 'single-song.html?id=menace-de-mort', audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', spotify_id: '5wB5y0bWwBntn7F7LZb1M5', apple_music_id: '476239105', album: 'Noir D****', duration: '4:02', bpm: '92' },
        { id: 'dont-laik', title: 'Don\'t Laïk', artist_id: 'medine', genre: 'Rap Conscient', year: 2015, tags: ['rap', 'laïcité', 'provocation', 'polémique'], description: 'Un texte volontairement polémique et dense sur la laïcité française.', url: 'single-song.html?id=dont-laik', audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', spotify_id: '3zMv1OqS1A0zE1kEwQOXZr', apple_music_id: '958045353', album: 'Démineur', duration: '3:45', bpm: '85' },
        { id: 'stan', title: 'Stan', artist_id: 'eminem', genre: 'Rap', year: 2000, tags: ['rap', 'storytelling', 'obsession', 'célébrité'], description: 'Le chef-d\'œuvre narratif épistolaire qui a inventé le terme \'Stan\'.', url: 'single-song.html?id=stan', audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', spotify_id: '3UmaczJpikHgJFyBTAJVoz', apple_music_id: '1440866782', album: 'The Marshall Mathers LP', duration: '6:44', bpm: '80' },
        { id: 'power', title: 'Power', artist_id: 'kanye-west', genre: 'Hip-Hop', year: 2010, tags: ['hip-hop', 'célébrité', 'ego', 'production'], description: 'L\'hymne triomphal et mégalomaniaque analysant les affres de la célébrité.', url: 'single-song.html?id=power', audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', spotify_id: '2gZUPNdnz5Y45eiGxpHGSc', apple_music_id: '1440742903', album: 'My Beautiful Dark Twisted Fantasy', duration: '4:52', bpm: '88' },
        { id: 'back-to-back', title: 'Back to Back', artist_id: 'drake', genre: 'Hip-Hop', year: 2015, tags: ['hip-hop', 'beef', 'diss track'], description: 'Le diss track légendaire de 2015 visant Meek Mill.', url: 'single-song.html?id=back-to-back', audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', spotify_id: '5m9pM8pGez1u8jS4R6u8rM', apple_music_id: '1440845348', album: 'Back to Back (Single)', duration: '2:50', bpm: '87' }
    ];

    // Glossary
    const glossary = [
        { term: 'métaphore', definition: 'Figure de style qui désigne une chose par le nom d\'une autre en établissant une comparaison implicite.' },
        { term: 'allitération', definition: 'Répétition d\'un même son consonantique en début de mots proches, créant un effet sonore volontaire.' },
        { term: 'flow', definition: 'En rap, le flow désigne la manière dont l\'artiste place ses syllabes sur le rythme : la fluidité, le rythme et l\'intonation de sa voix.' },
        { term: 'bpm', definition: 'Beats Per Minute : unité de mesure du tempo d\'un morceau. Plus le BPM est élevé, plus la musique est rapide.' },
        { term: 'sample', definition: 'Extrait d\'un enregistrement existant réutilisé et intégré dans une nouvelle composition musicale.' },
        { term: 'hook', definition: 'Le refrain d\'un morceau, conçu pour être accrocheur et mémorable.' },
        { term: 'storytelling', definition: 'Technique narrative en musique où l\'artiste raconte une histoire, souvent autobiographique.' },
        { term: 'polyphonie', definition: 'Superposition de plusieurs voies ou lignes mélodiques indépendantes dans une même composition musicale.' },
        { term: 'ostinato', definition: 'Motif musical court répété de manière continue tout au long d\'un morceau.' },
        { term: 'laïcité', definition: 'Principe de séparation de la société civile et de la société religieuse. Souvent détournée politiquement dans le contexte culturel contemporain.' }
    ];

    // Song Contents
    const song_contents = [
        { song_id: 'lettre-a-la-republique', time: 0, lyrics: ['À tous ces racistes à la tolérance hypocrite', 'Qui ont bâti leur nation sur le sang', 'Maintenant s\'érigent en donneurs de leçons', 'Pilleurs de richesses, tueurs d\'Africains', 'Colonisateurs, tortionnaires d\'Algériens'], analysis: '<span class="text-white font-medium block mb-1">L\'Ouverture Frontale :</span><p>Kery James ne prend aucun détour. Dès les premières mesures, il confronte la République à son passé colonial. Le champ lexical de la violence ("sang", "pilleurs", "tueurs", "tortionnaires") sert à déconstruire le mythe civilisateur.</p>', display_order: 0 },
        { song_id: 'lettre-a-la-republique', time: 60, lyrics: ['Ce passé colonial, c\'est le vôtre', 'C\'est vous qui avez choisi de lier votre histoire à la nôtre', 'Et maintenant vous nous demandez de nous intégrer ?', 'Est-ce que vous vous êtes intégrés, vous, en Afrique ?'], analysis: '<span class="text-amber-400 font-medium block mb-1">Le Renversement de la Notion d\'Intégration :</span><p>Le morceau renverse l\'injonction politique de l\'intégration imposée aux immigrés en rappelant que la France ne s\'est pas "intégrée" dans ses propres colonies, mais a imposé sa présence par la force. C\'est le nœud rhétorique du texte.</p>', display_order: 1 },
        { song_id: 'menace-de-mort', time: 0, lyrics: ['(Sample d\'Éric Zemmour au tribunal)', 'Je ne crains pas la mort, je crains de ne pas vivre', 'Ma plume est une arme que je brandis pour survivre'], analysis: '<span class="text-white font-medium block mb-1">Contextualisation par le Sample :</span><p>L\'intégration directe des déclarations du procès pose le décor judiciaire. Ce n\'est plus seulement du rap, c\'est une plaidoirie où Youssoupha s\'approprie la parole de son accusateur pour la retourner contre lui.</p>', display_order: 0 },
        { song_id: 'dont-laik', time: 0, lyrics: ['Crucifions les laïcards comme à Golgotha', 'On met des fatwas sur la tête à Fourest'], analysis: '<span class="text-white font-medium block mb-1">Provocation Symbolique :</span><p>Médine utilise délibérément un vocabulaire religieux extrême et violent ("Crucifions", "fatwas") dans un cadre laïque. Ces hyperboles littéraires, bien que sujettes à controverse, visent à choquer pour déclencher le débat, dans la pure tradition pamphlétaire française.</p>', display_order: 0 },
        { song_id: 'stan', time: 25, lyrics: ['Dear Slim, I wrote you but you still ain\'t callin\'', 'I left my cell, my pager, and my home phone at the bottom'], analysis: '<span class="text-white font-medium block mb-1">L\'Épistolaire en Musique :</span><p>La chanson utilise le format de lettres successives pour montrer la lente dégradation mentale d\'un fan obsessionnel. La voix d\'Eminem s\'adapte, jouant un personnage qui confond la personne (Marshall) de sa persona (Slim Shady).</p>', display_order: 0 },
        { song_id: 'power', time: 0, lyrics: ['I\'m livin\' in that 21st century', 'Doin\' something mean to it', 'Do it better than anybody you ever seen do it'], analysis: '<span class="text-white font-medium block mb-1">Le Choc Sonore :</span><p>Propulsé par le sample hurlant de King Crimson et des chœurs africains, le morceau est une démonstration pure de mégalomanie architecturale. Le son est impérial, rugueux et dense, posant West comme un titan au centre du 21e siècle.</p>', display_order: 0 },
        { song_id: 'back-to-back', time: 0, lyrics: ['Oh man, oh man, oh man, not again', 'Yeah, I learned the game from William Wesley, you can never check me', 'Back to back for the niggas that didn\'t get the message'], analysis: '<span class="text-white font-medium block mb-1">Intro : L\'exaspérance du vainqueur</span><p>Drake commence par un soupir ("not again"), feignant la lassitude face à un adversaire qu\'il juge indigne.</p>', display_order: 0 }
    ];

    async function upsertTable(table, data) {
        console.log(`Upserting ${data.length} rows into ${table}...`);
        const { error } = await supabase.from(table).upsert(data);
        if (error) {
            console.error(`Error in ${table}:`, error.message);
        } else {
            console.log(`Successfully upserted data into ${table}.`);
        }
    }

    await upsertTable('artists', artists);
    await upsertTable('songs', songs);
    await upsertTable('song_contents', song_contents);
    await upsertTable('glossary', glossary);

    console.log('Seeding complete.');
}

seed();
