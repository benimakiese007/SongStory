-- ============================================
-- SongStory CMS — Seed Songs Data
-- Execute this in your Supabase SQL Editor
-- This inserts all 25 songs from the static data.js
-- ============================================

INSERT INTO songs (id, title, artist_id, genre, year, cover_url, tags, description, url)
VALUES
  ('dead-presidents-ii', 'Dead Presidents II', 'jay-z', 'Rap', 1996, 'images/covers/dead-presidents-ii-cover.webp', ARRAY['Classique', 'New York', 'Mafioso Rap'], 'L''un des plus grands morceaux de l''histoire du hip-hop, extrait de l''album Reasonable Doubt.', 'songs/jay-z/dead-presidents-ii.html'),
  ('demain-cest-loin', 'Demain, C''est Loin', 'iam', 'Rap', 1997, 'images/covers/demain-cest-loin-cover.webp', ARRAY['Classique', 'Marseille', 'Rap Conscient'], 'Le morceau le plus emblématique du rap français, une immersion brutale et poétique dans le quotidien des quartiers nord de Marseille.', 'songs/iam/demain-cest-loin.html'),
  ('back-to-back', 'Back to Back', 'drake', 'Rap', 2015, 'images/covers/back-to-back-cover.webp', ARRAY['Beef', 'Diss Track'], 'Le diss track massif qui a redéfini les règles du beef à l''ère des réseaux sociaux.', 'songs/drake/back-to-back.html'),
  ('family-matters', 'Family Matters', 'drake', 'Rap', 2024, 'images/covers/family-matters-cover.webp', ARRAY['beef', '2024'], 'La réponse massive de Drake au conflit de 2024.', 'songs/drake/family-matters.html'),
  ('push-ups', 'Push Ups', 'drake', 'Rap', 2024, 'images/covers/push-ups-cover.webp', ARRAY['beef'], 'Le premier coup de semonce officiel de Drake dans le beef de 2024.', 'songs/drake/push-ups.html'),
  ('taylor-made-freestyle', 'Taylor Made Freestyle', 'drake', 'Rap', 2024, 'images/covers/taylor-made-freestyle-cover.webp', ARRAY['beef', 'IA'], 'Le morceau controversé utilisant l''IA pour imiter Tupac et Snoop Dogg.', 'songs/drake/taylor-made-freestyle.html'),
  ('stan', 'Stan', 'eminem', 'Rap', 2000, 'images/covers/stan-cover.webp', ARRAY['storytelling'], 'Un chef-d''œuvre de narration explorant l''obsession d''un fan.', 'songs/eminem/stan.html'),
  ('7-minute-drill', '7 Minute Drill', 'j-cole', 'Rap', 2024, 'images/covers/7-minutes-drill-cover.webp', ARRAY['beef'], '', 'songs/j-cole/7-minute-drill.html'),
  ('might-delete-later', 'Might Delete Later (Excuses)', 'j-cole', 'Rap', 2024, 'images/covers/might-delete-later-excuses-cover.webp', ARRAY[]::TEXT[], '', 'songs/j-cole/might-delete-later.html'),
  ('power', 'Power', 'kanye-west', 'Rap', 2010, 'images/covers/power-cover.webp', ARRAY['storytelling'], '', 'songs/kanye-west/power.html'),
  ('6-16-in-LA', '6:16 in LA', 'kendrick-lamar', 'Rap', 2024, 'images/covers/6-16-in-la.webp', ARRAY['beef'], '', 'songs/kendrick-lamar/6-16-in-LA.html'),
  ('euphoria', 'Euphoria', 'kendrick-lamar', 'Rap', 2024, 'images/covers/euphoria-cover.webp', ARRAY['beef'], '', 'songs/kendrick-lamar/euphoria.html'),
  ('meet-the-grahams', 'Meet the Grahams', 'kendrick-lamar', 'Rap', 2024, 'images/covers/meet-the-graham-cover.webp', ARRAY['beef'], '', 'songs/kendrick-lamar/meet-the-grahams.html'),
  ('not-like-us', 'Not Like Us', 'kendrick-lamar', 'Rap', 2024, 'images/covers/not-like-us-cover.webp', ARRAY['beef'], '', 'songs/kendrick-lamar/not-like-us.html'),
  ('lettre-a-la-republique', 'Lettre à la République', 'kery-james', 'Rap Conscient', 2012, 'images/covers/lettre-a-la-republique-cover.webp', ARRAY['politique', 'rap conscient'], '', 'songs/kery-james/lettre-a-la-republique.html'),
  ('dont-laik', 'Don''t Laïk', 'medine', 'Rap Conscient', 2012, 'images/covers/dont-laik-cover.webp', ARRAY['politique', 'rap conscient'], '', 'songs/medine/dont-laik.html'),
  ('menace-de-mort', 'Menace de Mort', 'youssoupha', 'Rap Conscient', 2009, 'images/covers/menace-de-mort-cover.webp', ARRAY['politique', 'rap conscient'], '', 'songs/youssoupha/menace-de-mort.html'),
  ('solaar-pleure', 'Solaar Pleure', 'mc-solaar', 'Rap', 2001, 'images/covers/solaar-pleure-cover.webp', ARRAY['Classique', 'Poésie'], 'Un retour mystique et philosophique du poète du rap français.', 'songs/mc-solaar/solaar-pleure.html'),
  ('hit-em-up', 'Hit ''Em Up', '2pac', 'Rap', 1996, 'images/covers/hit-em-up-cover.webp', ARRAY['Beef', 'West Coast', 'Diss Track'], 'Le diss track le plus féroce de l''histoire du hip-hop.', 'songs/2pac/hit-em-up.html'),
  ('ny-state-of-mind', 'NY State of Mind', 'nas', 'Rap', 1994, 'images/covers/ny-state-of-mind-cover.webp', ARRAY['Classique', 'Storytelling', 'New York'], 'Une immersion cinématographique dans les rues de Queensbridge.', 'songs/nas/ny-state-of-mind.html'),
  ('this-is-america', 'This Is America', 'childish-gambino', 'Rap', 2018, 'images/covers/this-is-america-cover.webp', ARRAY['Social', 'Provocateur'], 'Une critique virulente de la société américaine moderne.', 'songs/childish-gambino/this-is-america.html'),
  ('alright', 'Alright', 'kendrick-lamar', 'Rap', 2015, 'images/covers/alright-cover.webp', ARRAY['Hymne', 'Espoir'], 'Un cri de ralliement pour la résilience et le changement.', 'songs/kendrick-lamar/alright.html'),
  ('notes-pour-trop-tard', 'Notes Pour Trop Tard', 'orelsan', 'Rap', 2017, 'images/covers/notes-pour-trop-tard-cover.webp', ARRAY['Introspection', 'Storytelling'], 'Une lettre poignante adressée à son moi plus jeune.', 'songs/orelsan/notes-pour-trop-tard.html'),
  ('laisse-pas-traisner-ton-fils', 'Laisse Pas Traîner Ton Fils', 'supreme-ntm', 'Rap', 1998, 'images/covers/laisse-pas-traisner-ton-fils-cover.webp', ARRAY['Classique', 'Social'], 'Un plaidoyer puissant sur la responsabilité parentale.', 'songs/supreme-ntm/laisse-pas-traisner-ton-fils.html'),
  ('both-sides-of-a-smile', 'Both Sides Of A Smile', 'dave', 'Rap', 2021, 'images/covers/both-sides-of-a-smile-cover.webp', ARRAY['Storytelling', 'James Blake'], 'Une collaboration profonde explorant la dualité de la réussite et de la souffrance.', 'songs/dave/both-sides-of-a-smile.html')
ON CONFLICT (id) DO NOTHING;
