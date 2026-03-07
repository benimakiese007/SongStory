-- Clear existing data to avoid duplicate key errors
TRUNCATE artists, songs, song_contents, glossary RESTART IDENTITY CASCADE;

-- Seeding artists
INSERT INTO artists (id, name, genre, country, bio, influence, url, tags) VALUES
('kery-james', 'Kery James', 'Rap Conscient', 'France', 'Alix Mathurin, dit Kery James, est une des figures historiques du rap français originel, pilier de la Mafia K''1 Fry, devenu la référence majeure du rap conscient politique en France.', 'Reconnu pour ses textes denses abordant le contexte social des banlieues, l''histoire coloniale de la France, et l''exigence morale.', 'artists/kery-james.html', ARRAY['rap', 'conscient', 'politique']),
('youssoupha', 'Youssoupha', 'Rap', 'France / RDC', 'Youssoupha Mabiki, né en 1979 à Kinshasa, est un rappeur dont le style allie une immense richesse lexicale à une approche humaniste.', 'Surnommé le ''Lyriciste Bantou'', il a défendu un rap technique, porteur de sens, en réhabilitant la poésie au cœur du rap commercial français.', 'artists/youssoupha.html', ARRAY['rap', 'conscient', 'lyriciste']),
('medine', 'Médine', 'Rap Conscient', 'France', 'Médine Zaouiche, venu du Havre, est l''un des paroliers les plus tranchants du rap français. Il emploie souvent l''ironie et le sarcasme pour dénoncer l''islamophobie et le racisme.', 'Il pousse ses auditeurs et la société française dans leurs derniers retranchements intellectuels avec un lexique ultra-violent mais métaphorique.', 'artists/medine.html', ARRAY['rap', 'laïcité', 'provocation']),
('eminem', 'Eminem', 'Rap', 'États-Unis', 'Marshall Mathers est sans conteste l''un des rappeurs les plus influents au monde, alliant virtuosité technique, shock value, et introspection brutale.', 'Il a introduit une approche psychologique au rap à la première personne, brisant les digues entre le hip-hop et la culture de masse globale.', 'artists/eminem.html', ARRAY['rap', 'storytelling', 'technique']),
('kanye-west', 'Kanye West', 'Hip-Hop', 'États-Unis', 'Ye, ex-Kanye West, est un producteur, rappeur et créateur de mode qui a profondément bouleversé le paysage culturel moderne.', 'Il a abattu les frontières du gangsta rap pour y injecter doutes existentiels, mode, électronique et folie des grandeurs.', 'artists/kanye-west.html', ARRAY['hip-hop', 'production', 'ego']),
('drake', 'Drake', 'Hip-Hop', 'Canada', 'Aubrey Drake Graham est un rappeur, chanteur et acteur canadien qui a dominé les charts mondiaux depuis les années 2010.', 'Il a popularisé le mélange de rap mélancolique et de R&B, influençant une génération entière d''artistes avec son approche émotionnelle et introspective.', 'artists/drake.html', ARRAY['hip-hop', 'r&b', 'melancholy']);

-- Seeding songs
INSERT INTO songs (id, title, artist_id, genre, year, tags, description, url, audio_url, spotify_id, apple_music_id, album, duration, bpm) VALUES
('lettre-a-la-republique', 'Lettre à la République', 'kery-james', 'Rap Conscient', 2012, ARRAY['rap', 'politique', 'colonialisme', 'histoire'], 'Un réquisitoire implacable sur l''histoire coloniale de la France et l''intégration.', 'single-song.html?id=lettre-a-la-republique', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', '1L94MwniI061h2g50CebS0', '510255928', '92.2012', '4:28', '88'),
('menace-de-mort', 'Menace de mort', 'youssoupha', 'Rap', 2011, ARRAY['rap', 'liberté d''expression', 'justice', 'média'], 'Une réponse chirurgicale face à l''emballement judiciaire et médiatique.', 'single-song.html?id=menace-de-mort', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', '5wB5y0bWwBntn7F7LZb1M5', '476239105', 'Noir D****', '4:02', '92'),
('dont-laik', 'Don''t Laïk', 'medine', 'Rap Conscient', 2015, ARRAY['rap', 'laïcité', 'provocation', 'polémique'], 'Un texte volontairement polémique et dense sur la laïcité française.', 'single-song.html?id=dont-laik', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', '3zMv1OqS1A0zE1kEwQOXZr', '958045353', 'Démineur', '3:45', '85'),
('stan', 'Stan', 'eminem', 'Rap', 2000, ARRAY['rap', 'storytelling', 'obsession', 'célébrité'], 'Le chef-d''œuvre narratif épistolaire qui a inventé le terme ''Stan''.', 'single-song.html?id=stan', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', '3UmaczJpikHgJFyBTAJVoz', '1440866782', 'The Marshall Mathers LP', '6:44', '80'),
('power', 'Power', 'kanye-west', 'Hip-Hop', 2010, ARRAY['hip-hop', 'célébrité', 'ego', 'production'], 'L''hymne triomphal et mégalomaniaque analysant les affres de la célébrité.', 'single-song.html?id=power', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', '2gZUPNdnz5Y45eiGxpHGSc', '1440742903', 'My Beautiful Dark Twisted Fantasy', '4:52', '88'),
('back-to-back', 'Back to Back', 'drake', 'Hip-Hop', 2015, ARRAY['hip-hop', 'beef', 'diss track'], 'Le diss track légendaire de 2015 visant Meek Mill.', 'single-song.html?id=back-to-back', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', '5m9pM8pGez1u8jS4R6u8rM', '1440845348', 'Back to Back (Single)', '2:50', '87');

-- Seeding song_contents
INSERT INTO song_contents (song_id, time, lyrics, analysis, display_order) VALUES
('lettre-a-la-republique', 0, ARRAY['À tous ces racistes à la tolérance hypocrite', 'Qui ont bâti leur nation sur le sang', 'Maintenant s''érigent en donneurs de leçons', 'Pilleurs de richesses, tueurs d''Africains', 'Colonisateurs, tortionnaires d''Algériens'], '
                    <span class="text-white font-medium block mb-1">L''Ouverture Frontale :</span>
                    <p>Kery James ne prend aucun détour. Dès les premières mesures, il confronte la République à son passé colonial. Le champ lexical de la violence ("sang", "pilleurs", "tueurs", "tortionnaires") sert à déconstruire le mythe civilisateur.</p>
                ', 0),
('lettre-a-la-republique', 60, ARRAY['Ce passé colonial, c''est le vôtre', 'C''est vous qui avez choisi de lier votre histoire à la nôtre', 'Et maintenant vous nous demandez de nous intégrer ?', 'Est-ce que vous vous êtes intégrés, vous, en Afrique ?'], '
                    <span class="text-amber-400 font-medium block mb-1">Le Renversement de la Notion d''Intégration :</span>
                    <p>Le morceau renverse l''injonction politique de l''intégration imposée aux immigrés en rappelant que la France ne s''est pas "intégrée" dans ses propres colonies, mais a imposé sa présence par la force. C''est le nœud rhétorique du texte.</p>
                ', 1),
('lettre-a-la-republique', 120, ARRAY['On ne s''excusera pas d''être là', 'On ne s''excusera pas d''être ce qu''on est'], '
                    <span class="text-white font-medium block mb-1">L''Affirmation Identitaire :</span>
                    <p>Le refus de toute repentance. Kery James transforme le statut de victime historique en une posture d''affirmation fière. Ce passage clôture sa lettre non pas sur une soumission, mais sur un acte de résistance intellectuelle.</p>
                ', 2),
('menace-de-mort', 0, ARRAY['(Sample d''Éric Zemmour au tribunal)', 'Je ne crains pas la mort, je crains de ne pas vivre', 'Ma plume est une arme que je brandis pour survivre'], '
                    <span class="text-white font-medium block mb-1">Contextualisation par le Sample :</span>
                    <p>L''intégration directe des déclarations du procès pose le décor judiciaire. Ce n''est plus seulement du rap, c''est une plaidoirie où Youssoupha s''approprie la parole de son accusateur pour la retourner contre lui.</p>
                ', 0),
('menace-de-mort', 55, ARRAY['Ils veulent censurer mes textes, condamner ma rime', 'Comme si raconter la rue était devenu un crime', 'Mais je n''appelle pas au meurtre, j''appelle à la conscience'], '
                    <span class="text-amber-400 font-medium block mb-1">La Distinction entre Violence et Constat :</span>
                    <p>Youssoupha démontre l''hypocrisie de la censure. Il explique que le "meurtre" dont il parle est symbolique, ciblant idéologiquement les diffuseurs de haine, réclamant ainsi le même droit à l''hyperbole que les polémistes télévisés.</p>
                ', 1),
('menace-de-mort', 140, ARRAY['Noir Désir ou Noir D****, la justice a ses nuances'], '
                    <span class="text-white font-medium block mb-1">Le Parallèle Sociétal :</span>
                    <p>Une punchline magistrale qui compare le traitement médiatique et juridique de Bertrand Cantat (Noir Désir). La justice est ainsi accusée d''un traitement à deux vitesses, basé sur la classe sociale et la couleur de peau.</p>
                ', 2),
('dont-laik', 0, ARRAY['Crucifions les laïcards comme à Golgotha', 'On met des fatwas sur la tête à Fourest'], '
                    <span class="text-white font-medium block mb-1">Provocation Symbolique :</span>
                    <p>Médine utilise délibérément un vocabulaire religieux extrême et violent ("Crucifions", "fatwas") dans un cadre laïque. Ces hyperboles littéraires, bien que sujettes à controverse, visent à choquer pour déclencher le débat, dans la pure tradition pamphlétaire française.</p>
                ', 0),
('dont-laik', 50, ARRAY['Je suis une laïcité d''apaisement, pas d''acharnement', 'Pas la laïcité qui stigmatise la foi'], '
                    <span class="text-amber-400 font-medium block mb-1">Le Cœur du Sujet :</span>
                    <p>Derrière la violence de forme se cache le vrai message : la distinction entre la loi de 1905 (qui protège les cultes) et une nouvelle forme de laïcité perçue comme un outil d''exclusion et de répression envers la minorité musulmane en France.</p>
                ', 1),
('stan', 25, ARRAY['Dear Slim, I wrote you but you still ain''t callin''', 'I left my cell, my pager, and my home phone at the bottom'], '
                    <span class="text-white font-medium block mb-1">L''Épistolaire en Musique :</span>
                    <p>La chanson utilise le format de lettres successives pour montrer la lente dégradation mentale d''un fan obsessionnel. La voix d''Eminem s''adapte, jouant un personnage qui confond la personne (Marshall) de sa persona (Slim Shady).</p>
                ', 0),
('stan', 195, ARRAY['Dear Mr. ''I''m Too Good To Call Or Write My Fans''', 'This will be the last package I ever send your ass'], '
                    <span class="text-amber-400 font-medium block mb-1">La Rupture de la Tape 3 :</span>
                    <p>Dans ce crescendo émotionnel dramatique, le bruit de la pluie, de la voiture et la voix cassée de Stan illustrent une issue fatale imminente. Les effets sonores renforcent l''immersion cinématographique totale.</p>
                ', 1),
('stan', 300, ARRAY['Dear Stan, I meant to write you sooner, but I just been busy', 'I really think you and your girlfriend need each other...'], '
                    <span class="text-white font-medium block mb-1">Le Dénouement Tragique :</span>
                    <p>Eminem reprend sa propre voix, tentant de raisonner son fan. La révélation macabre finale (Eminem réalise en l''écrivant que Stan est l''homme suicidé aux informations) offre une morale frappante sur la responsabilité de l''artiste face à l''impact de ses œuvres morbides.</p>
                ', 2),
('power', 0, ARRAY['I''m livin'' in that 21st century', 'Doin'' something mean to it', 'Do it better than anybody you ever seen do it'], '
                    <span class="text-white font-medium block mb-1">Le Choc Sonore :</span>
                    <p>Propulsé par le sample hurlant de King Crimson et des chœurs africains, le morceau est une démonstration pure de mégalomanie architecturale. Le son est impérial, rugueux et dense, posant West comme un titan au centre du 21e siècle.</p>
                ', 0),
('power', 110, ARRAY['No one man should have all that power', 'The clock''s tickin'', I just count the hours', 'Stop trippin'', I''m trippin'' off the power'], '
                    <span class="text-amber-400 font-medium block mb-1">La Fragilité de l''Ego :</span>
                    <p>Derrière la grandiloquence, le refrain trahit une angoisse : Kanye admet que son emprise et sa célébrité sont excessives. "No one man should have all that power" est moins une célébration qu''une mise en garde contre sa propre psyché dévorée par sa notoriété.</p>
                ', 1),
('power', 235, ARRAY['Now this will be a beautiful death', 'I''m jumping out the window, I''m letting everything go'], '
                    <span class="text-white font-medium block mb-1">L''Outro Suicidaire :</span>
                    <p>La chanson qui a commencé comme un triomphe impérial se termine brusquement par une vision d''autodestruction joyeuse et poétique ("beautiful death"). C''est le paradoxe kanyesque ultime : construire un empire au prix de sa santé mentale.</p>
                ', 2),
('back-to-back', 0, ARRAY['Oh man, oh man, oh man, not again', 'Yeah, I learned the game
                                from William Wesley, you can never check me', 'Back to back for the niggas that didn''t
                                get the message'], '<span class="text-white font-medium block mb-1">Intro : L''exaspérance du vainqueur</span>
                    <p>Drake commence par un soupir ("not again"), feignant la lassitude face à un adversaire
                    qu''il juge indigne. Il cite "World Wide Wes" (William Wesley), un consultant légendaire
                    de la NBA connu pour son influence dans l''ombre, affirmant ainsi son propre pouvoir
                    institutionnel. Le terme "Back to Back" fait référence à sa deuxième attaque en moins de
                    4 jours, une stratégie d''asphyxie médiatique.</p>', 0),
('back-to-back', 30, ARRAY['Back to back like I''m on the cover of
                                Lethal Weapon', 'Back to back like I''m Jordan ''96, ''97,
                                whoa', 'I might be mad that I gave this
                                attention'], '<span class="text-amber-400 font-medium block mb-1">Drizzy vs Jordan</span>
                    <p>Drake se compare à Michael Jordan lors de ses années de doublé au championnat (96-97),
                    plaçant ce clash dans une optique de compétition sportive de haut niveau. La référence à
                    *Lethal Weapon* (L''Arme Fatale) renforce l''image d''un duo iconique (lui et son équipe
                    OVO) contre le reste du monde. Il souligne déjà que ce conflit est presque "en dessous
                    de lui".</p>', 1),
('back-to-back', 60, ARRAY['You gon'' make me buy bottles for
                                Charlamagne', 'You gon'' make me go out of my fuckin''
                                way', 'I waited four days, nigga,
                                where y''all at?'], '<span class="text-white font-medium block mb-1">L''humiliation par l''absence</span>
                    <p>Charlamagne Tha God était l''un des plus grands critiques de Drake. En lui envoyant du
                    champagne (Dom Pérignon Luminous), Drake retourne son ennemi contre Meek Mill. Le "I
                    waited four days" est une pique directe à la lenteur de Meek Mill pour répondre à
                    "Charged Up", prouvant que Drake contrôle le tempo du beef.</p>', 2),
('back-to-back', 95, ARRAY['Second floor at Tootsies, gettin''
                                shoulder rubs', 'This for y''all that think that I don''t
                                write enough', 'They just mad ''cause I got the Midas
                                touch'], '<span class="text-white font-medium block mb-1">Réponse aux accusations de
                    Ghostwriting</span>
                    <p>Meek Mill accusait Drake de ne pas écrire ses textes (via l''affaire Quentin Miller).
                    Drake répond avec arrogance en se montrant détendu au club Tootsie’s (Miami). Il utilise
                    la <span class="glossary-term" data-term="allusion"
                    data-def="Référence indirecte à un fait, un personnage ou une œuvre connue.">allusion</span>
                    au roi Midas pour dire que tout ce qu''il touche se transforme en or, peu importe les
                    critiques sur sa méthode de création.</p>', 3),
('back-to-back', 130, ARRAY['Is that a world tour or your
                                girl''s tour?', 'I know that you gotta be a thug for her', 'This ain''t what she meant
                                when she told you to open up more'], '<span class="text-amber-400 font-medium block mb-1">Le coup fatal : La référence à Nicki
                    Minaj</span>
                    <p>C''est la ligne qui a défini ce clash. À l''époque, Meek Mill faisait la première partie de
                    la tournée de sa petite amie, Nicki Minaj. Drake retourne cette situation pour
                    l''émasculer publiquement, insinuant qu''il est un subordonné. Le jeu de mots sur "open
                    up" (faire la première partie / s''ouvrir émotionnellement) est une attaque dévastatrice
                    sur la virilité de l''adversaire.</p>', 4),
('back-to-back', 165, ARRAY['Yeah, trigger fingers turn to Twitter
                                fingers', 'Yeah, you gettin'' bodied by a singin''
                                nigga', 'I''m not the type of nigga that''ll type
                                to niggas'], '<span class="text-white font-medium block mb-1">Guerre numérique vs Réalité</span>
                    <p>Drake invente l''expression "Twitter fingers" pour décrire ceux qui sont courageux sur
                    internet mais inefficaces en dehors. L''ironie suprême est que Drake, souvent moqué pour
                    son côté sensible et "chanteur", est celui qui est en train de "tuer" (bodied) un
                    rappeur de rue prétendu plus dur. C''est l''un des plus grands <span class="glossary-term"
                    data-term="punchline"
                    data-def="Phrase forte ou choc dans un texte, particulièrement en rap, conçue pour marquer l''esprit.">punchlines</span>
                    de la décennie.</p>', 5),
('back-to-back', 200, ARRAY['Shout-out to all my boss bitches wifin''
                                niggas', 'Make sure you hit him
                                with the prenup', 'Then tell that man to ease up'], '<span class="text-white font-medium block mb-1">L''inversion des rôles</span>
                    <p>Drake continue d''attaquer la position financière de Meek au sein de son couple avec
                    Nicki. En recommandant un "prenup" (contrat de mariage), il dresse le portrait d''un Meek
                    Mill profiteur. Drake utilise ici le respect des femmes puissantes ("boss bitches") pour
                    isoler socialement Meek.</p>', 6),
('back-to-back', 240, ARRAY['I been puttin'' on a show, it was a sell
                                out event', 'Soon as a nigga hit the stage, they gon''
                                ask if I can play this back to back', 'I took a break from Views,
                                now back to that'], '<span class="text-white font-medium block mb-1">Conclusion : Retour aux affaires</span>
                    <p>Drake conclut en rappelant que ce clash n''était qu''une distraction mineure. Il mentionne
                    son futur album *Views*, signalant à son public que le divertissement est fini et qu''il
                    retourne à son but principal : dominer l''industrie musicale. Il prophétise avec succès
                    que le public réclamera ce morceau à chaque concert ("play this back to back").</p>', 7);

-- Seeding glossary
INSERT INTO glossary (term, definition) VALUES
('métaphore', 'Figure de style qui désigne une chose par le nom d''une autre en établissant une comparaison implicite.'),
('allitération', 'Répétition d''un même son consonantique en début de mots proches, créant un effet sonore volontaire.'),
('flow', 'En rap, le flow désigne la manière dont l''artiste place ses syllabes sur le rythme : la fluidité, le rythme et l''intonation de sa voix.'),
('bpm', 'Beats Per Minute : unité de mesure du tempo d''un morceau. Plus le BPM est élevé, plus la musique est rapide.'),
('sample', 'Extrait d''un enregistrement existant réutilisé et intégré dans une nouvelle composition musicale.'),
('hook', 'Le refrain d''un morceau, conçu pour être accrocheur et mémorable.'),
('storytelling', 'Technique narrative en musique où l''artiste raconte une histoire, souvent autobiographique.'),
('polyphonie', 'Superposition de plusieurs voies ou lignes mélodiques indépendantes dans une même composition musicale.'),
('ostinato', 'Motif musical court répété de manière continue tout au long d''un morceau.'),
('laïcité', 'Principe de séparation de la société civile et de la société religieuse. Souvent détournée politiquement dans le contexte culturel contemporain.');

