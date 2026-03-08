
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uzvqreravzrefrucbraq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dnFyZXJhdnpyZWZydWNicmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzI4MDYsImV4cCI6MjA4ODQ0ODgwNn0.PT_wtR_-wpmLFz_YgezqwEXc6DGfKnPofEnz6zzDqX4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const songId = 'family-matters';

const contentBlocks = [
    {
        time: 0,
        display_order: 0,
        lyrics: [
            "Maybe in this song, you shouldn't start by saying",
            "Nigga, I said it, I know that you mad",
            "I've emptied the clip over friendlier jabs",
            "You mentioned my seed, now deal with his dad",
            "I gotta go bad, I gotta go bad"
        ],
        analysis: "Drake répond directement à Kendrick Lamar qui a mentionné son fils Adonis dans 'Euphoria'. Il prévient que les gants sont retirés. La répétition de 'I gotta go bad' souligne sa transition vers une agressivité totale."
    },
    {
        time: 30,
        display_order: 10,
        lyrics: [
            "I was really, really tryna keep it PG",
            "If you had a set, they'd give your ass a DP",
            "But you civilian gang, in real life, you PC",
            "You know who really bang a set? My nigga YG",
            "You know who really bang a set? My nigga Chuck T",
            "You know who even bang a set out there is CB",
            "And, nigga, Cole losin' sleep on this, it ain't me"
        ],
        analysis: "Drake ridiculise l'image 'gangsta' de Kendrick. Il utilise des termes comme **DP** (sanction de gang) et **PC** (protection policière) pour dire que Kendrick n'est qu'un civil. Il cite J. Cole pour se distancer de ses excuses."
    },
    {
        time: 60,
        display_order: 20,
        lyrics: [
            "Out here beggin' for attention, nigga, say please",
            "Always rappin' like you 'bout to get the slaves freed",
            "You just actin' like an activist, it's make-believe",
            "Don't even go back to your hood and plant no money trees"
        ],
        analysis: "Attaque sur l'intégrité de Kendrick. Drake l'accuse d'être un faux activiste ('make-believe') et détourne le titre 'Money Trees' pour affirmer que Kendrick n'aide pas réellement sa communauté à Compton."
    },
    {
        time: 90,
        display_order: 30,
        lyrics: [
            "On some Bobby shit, I wanna know what Whitney need",
            "All that puppy love was over in y'all late teens",
            "Why you never hold your son and tell him, \"Say cheese\"?",
            "We could've left the kids out of this, don't blame me",
            "You a dog and you know it, you just play sweet",
            "Your baby mama captions always screamin', \"Save me\"",
            "You did her dirty all your life, you tryna make peace",
            "I heard that one of 'em little kids might be Dave Free"
        ],
        analysis: "Le moment le plus explosif. Drake compare Kendrick à Bobby Brown (suggérant des abus envers Whitney Alford) et lance l'allégation choc : Dave Free serait le père biologique d'un des enfants de Kendrick."
    },
    {
        time: 140,
        display_order: 40,
        lyrics: [
            "What the fuck I heard Rick drop, nigga?",
            "Talkin' somethin' 'bout a nose job, nigga",
            "Ozempic got a side effect of jealousy",
            "The doctor never told y'all niggas",
            "Put a nigga in the bars, let a nigga rot",
            "Kind of like your old job, nigga"
        ],
        analysis: "Beat switch. Drake s'en prend à Rick Ross. Il tourne en dérision les accusations de chirurgie esthétique ('nose job') et attaque Ross sur son passé d'agent correctionnel ('old job') et son usage de l'Ozempic."
    },
    {
        time: 190,
        display_order: 50,
        lyrics: [
            "Weeknd music gettin' played in all the spots",
            "Where boys got a little more pride",
            "That's why all your friends dippin' to Atlanta",
            "Abel, run your fuckin' bread",
            "Leland Wayne, he a fuckin' lame",
            "So I know he had to be an influence"
        ],
        analysis: "Drake attaque The Weeknd (Abel) sur sa masculinité et ses finances, et Metro Boomin (Leland Wayne), le qualifiant de 'lame' et de mauvaise influence derrière ce complot général contre lui."
    },
    {
        time: 240,
        display_order: 60,
        lyrics: [
            "Rakim talkin' shit again",
            "Gassed 'cause you hit my BM first",
            "Nigga, do the math, who I was hittin' then?",
            "I ain't even know you rapped still",
            "Even when you do drop, they gon' say",
            "You should've modeled 'cause it's mid again"
        ],
        analysis: "Diss envers ASAP Rocky (Rakim). Drake se moque de sa carrière musicale, disant qu'il devrait se contenter du mannequinat ('mid again'), et mentionne Rihanna (leur lien commun)."
    },
    {
        time: 310,
        display_order: 70,
        lyrics: [
            "Ay, Kendrick just opened his mouth",
            "Someone go hand him a Grammy right now",
            "Where is your uncle at?",
            "You wanna take up for Pharrell?",
            "Then come get his legacy out of my house"
        ],
        analysis: "Drake critique l'obsession des Grammys pour Kendrick. Il mentionne avoir acheté (et détruit symboliquement) les bijoux de Pharrell Williams pour montrer sa domination financière et son manque de respect pour l'héritage des 'anciens' qui soutiennent Kendrick."
    },
    {
        time: 360,
        display_order: 80,
        lyrics: [
            "Your daddy got robbed by Top",
            "You Stunna and Wayne, like father, like son",
            "Anthony set up the plays, Kojo be chargin'",
            "You double for nothin'"
        ],
        analysis: "Drake s'attaque au passé de Kendrick, affirmant que Top Dawg (Anthony) a volé l'argent du père de Kendrick. Il dépeint Kendrick comme un artiste exploité, le comparant ironicement à Lil Wayne."
    },
    {
        time: 400,
        display_order: 90,
        lyrics: [
            "Maybe I'm Prince and you actually Mike",
            "Michael was prayin' his features would change",
            "So people believe that he's actually white",
            "Top would make you do features for change",
            "Get on pop records and rap for the whites"
        ],
        analysis: "Détournement de la comparaison MJ/Prince. Drake dit que Kendrick est Michael Jackson car il a des insécurités raciales et qu'il fait des morceaux pop pour plaire à une audience blanche."
    },
    {
        time: 440,
        display_order: 100,
        lyrics: [
            "They hired a crisis management team",
            "To clean up the fact that you beat on your queen",
            "The picture you paint, it ain't what it seem"
        ],
        analysis: "L'allégation la plus sérieuse : Drake accuse Kendrick de violence domestique envers Whitney Alford et d'avoir utilisé une équipe de 'crisis management' pour étouffer le scandale."
    },
    {
        time: 470,
        display_order: 110,
        lyrics: [
            "You're dead, you're dead",
            "There's nowhere to hide, there's nowhere to hide",
            "You know what I mean"
        ],
        analysis: "Drake conclut glaciale. Il pense avoir porté le coup de grâce. Tragiquement, Kendrick publiera 'Meet the Grahams' moins d'une heure plus tard, changeant radicalement la trajectoire du beef."
    }
];

async function injectContent() {
    console.log('Cleaning existing content...');
    await supabase.from('song_contents').delete().eq('song_id', songId);

    console.log('Injecting new analysis blocks...');
    const insertData = contentBlocks.map(b => ({
        song_id: songId,
        time: b.time,
        display_order: b.display_order,
        lyrics: b.lyrics,
        analysis: b.analysis
    }));

    const { error } = await supabase.from('song_contents').insert(insertData);

    if (error) {
        console.error('Error during injection:', error);
    } else {
        console.log('✅ Success! Analysis for Family Matters is now LIVE.');
    }
}

injectContent();
