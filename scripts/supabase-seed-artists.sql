-- ============================================
-- SongStory CMS — Seed Artists Data
-- Execute this in your Supabase SQL Editor
-- This inserts all 17 artists from the static data.js
-- ============================================

INSERT INTO artists (id, name, genre, country, bio, photo_url)
VALUES
  ('kendrick-lamar', 'Kendrick Lamar', 'Hip-Hop', 'USA', 'L''un des paroliers les plus influents de sa génération, connu pour ses récits complexes et ses thèmes sociaux.', 'images/artists/kendrick-lamar-pp.webp'),
  ('drake', 'Drake', 'Hip-Hop/R&B', 'Canada', 'La superstar mondiale qui domine les charts avec son mélange unique de rap mélodique et de R&B.', 'images/artists/drake-pp.webp'),
  ('eminem', 'Eminem', 'Hip-Hop', 'USA', 'Le génie technique du Rap de Détroit, célèbre pour ses rimes complexes et son alter ego Slim Shady.', 'images/artists/eminem-pp.webp'),
  ('nas', 'Nas', 'Hip-Hop', 'USA', 'Le poète de Queensbridge, considéré comme l''un des plus grands paroliers de tous les temps.', 'images/artists/nas-pp.webp'),
  ('2pac', '2Pac', 'Hip-Hop', 'USA', 'L''icône éternelle qui a donné une voix aux sans-voix à travers sa poésie et son charisme unique.', 'images/artists/2pac-pp.webp'),
  ('jay-z', 'Jay-Z', 'Hip-Hop', 'USA', 'L''entrepreneur et lyriciste hors pair qui a transformé le hip-hop en un empire mondial.', 'images/artists/jay-z-pp.webp'),
  ('kanye-west', 'Kanye West', 'Hip-Hop', 'USA', 'L''un des producteurs et artistes les plus innovants du 21ème siècle, repoussant sans cesse les limites du son.', 'images/artists/ye-pp.webp'),
  ('childish-gambino', 'Childish Gambino', 'Hip-Hop/Soul', 'USA', 'L''artiste polyvalent qui explore les thèmes de l''identité noire avec une créativité sans limites.', 'images/artists/childish-gambino-pp.webp'),
  ('iam', 'IAM', 'Rap', 'France', 'Le groupe mythique de Marseille qui a élevé le rap français au rang d''art poétique et philosophique.', 'images/artists/iam-pp.webp'),
  ('supreme-ntm', 'Suprême NTM', 'Rap', 'France', 'L''énergie brute du 93, incarnant la contestation sociale et la puissance scénique du rap français.', 'images/artists/supreme-ntm-pp.webp'),
  ('mc-solaar', 'MC Solaar', 'Rap', 'France', 'Le poète du rap français, pionnier du lyrisme et du style "cool" qui a marqué toute une époque.', 'images/artists/mc-solaar-pp.webp'),
  ('orelsan', 'Orelsan', 'Rap', 'France', 'Le storyteller de la classe moyenne française, maître de l''autodérision et de la mélancolie du quotidien.', 'images/artists/orelsan-pp.webp'),
  ('kery-james', 'Kery James', 'Rap Conscient', 'France', 'Une figure majeure du rap français, pilier du rap politique et engagé depuis plus de deux décennies.', 'images/artists/kery-james-pp.webp'),
  ('medine', 'Médine', 'Rap Conscient', 'France', 'Reconnu pour sa poésie et son intelligence lyricale, il se définit comme un "arabophone de la laïcité".', 'images/artists/medine-pp.webp'),
  ('youssoupha', 'Youssoupha', 'Rap Conscient', 'France / RDC', 'Surnommé le "Lyriciste Bantou", il est réputé pour la richesse de son vocabulaire et son écriture très ciselée.', 'images/artists/youssoupha-pp.webp'),
  ('j-cole', 'J. Cole', 'Hip-Hop', 'USA', 'Le conteur de Fayetteville, reconnu pour son introspection et son refus des artifices du star-system.', 'images/artists/j.cole-pp.webp'),
  ('dave', 'Dave', 'Rap', 'UK', 'Le prodige de Streatham, connu pour son intelligence lyricale hors norme et ses récits poignants sur la société et l''identité.', 'images/artists/dave-pp.webp')
ON CONFLICT (id) DO NOTHING;
