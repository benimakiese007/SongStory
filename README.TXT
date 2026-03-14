# SongStory — Analyse de paroles et d'histoires de chansons

SongStory est une plateforme interactive dédiée à l'analyse approfondie des paroles de chansons, permettant aux utilisateurs de découvrir les histoires et les significations cachées derrière leurs morceaux préférés.

## 🚀 Fonctionnalités Clés

- **SPA (Single Page Application)** : Navigation fluide entre les pages sans rechargement.
- **Analyses Détaillées** : Décryptage vers par vers des textes.
- **Recherche Intégrée** : Système de recherche performant pour trouver des morceaux, artistes ou genres.
- **Lecteurs Audiovisuels** : Intégration de lecteurs Spotify, Apple Music et YouTube.
- **Gestion des Artistes** : Pages dédiées avec bibliographie et liste des morceaux analysés.
- **Glossaire Hip-Hop/Musique** : Définition des termes techniques et culturels.
- **Espace Membre** : Gestion des favoris, création de playlists et annotations personnelles.
- **CMS Admin** : Interface d'administration pour la gestion des contenus (via Supabase).

## 🛠️ Pile Technique

- **Frontend** : HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Backend / Services** : 
  - **Supabase** : Base de données PostgreSQL, Authentification (Google OAuth), Storage pour les images.
  - **Vercel** : Hébergement et déploiement continu.
- **Utilitaires** : Iconify pour les icônes, Google Fonts pour la typographie.

## 📂 Structure du Projet

- `public/` : Contient tous les fichiers frontend (HTML, CSS, JS, Images).
  - `js/` : Logique de l'application (app.js, router.js, supabase-cms.js, etc.).
  - `css/` : Feuilles de style.
  - `songs/` : Pages HTML générées pour chaque morceau.
  - `artists/` : Pages HTML générées pour chaque artiste.
- `scripts/` : Scripts de maintenance, génération de données et utilitaires.
- `origin_lyrics/` : Données sources des paroles avant traitement.
- `vercel.json` : Configuration du déploiement Vercel (rewrites, clean URLs).

## 💻 Développement Local

Pour lancer le projet localement :

1. Installez les dépendances : `npm install`
2. Lancez le serveur de développement : `npm run dev`
3. L'application sera accessible sur `http://localhost:3000`.

## 📈 Journal des modifications
- **2026-03-14** : Mise à jour complète du README avec la stack technique et la structure.
- **Initial** : Création du projet.
