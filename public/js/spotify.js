/**
 * SongStory — Spotify Integration
 * Gère l'embed Spotify dans le player bar
 */

const SongStorySpotify = (() => {

    let currentEmbed = null;

    /**
     * Affiche un embed Spotify dans un conteneur donné
     * @param {string} trackId - ID Spotify du morceau (ex: '4iJyoBOLtHqaWYs3vyHpdH')
     * @param {string} containerId - ID du conteneur DOM
     */
    function loadEmbed(trackId, containerId) {
        const container = document.getElementById(containerId);
        if (!container || !trackId) return;

        // Evite de recharger le même morceau
        if (currentEmbed === trackId) {
            container.classList.toggle('hidden');
            return;
        }
        currentEmbed = trackId;

        container.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
        iframe.width = '100%';
        iframe.height = '80';
        iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        iframe.loading = 'lazy';
        iframe.frameBorder = '0';
        iframe.style.cssText = 'border-radius: 12px; border: none;';
        container.appendChild(iframe);
        container.classList.remove('hidden');
    }

    /**
     * Crée le bouton Spotify + conteneur d'embed pour une page chanson
     * @param {string} trackId - ID Spotify du morceau
     */
    function initSongPage(trackId) {
        if (!trackId) return;

        const playerBar = document.querySelector('.fixed.bottom-0');
        if (!playerBar) return;

        // Ajouter un bouton Spotify dans la top bar
        const spotifyBtn = document.createElement('button');
        spotifyBtn.id = 'spotify-toggle-btn';
        spotifyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display:inline;vertical-align:-1px;margin-right:5px;">
                <circle cx="12" cy="12" r="12" fill="#1DB954"/>
                <path d="M17.9 10.9C15 9.2 10.4 9 7.6 9.9c-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 3.3-1 8.3-.8 11.6 1.1.4.2.5.7.3 1.1-.2.4-.7.5-1.2.4zm-.1 2.7c-.2.3-.6.4-.9.2-2.5-1.5-6.4-2-9.4-1.1-.4.1-.7-.1-.8-.5-.1-.4.1-.8.5-.8 3.4-1 7.7-.5 10.5 1.2.4.3.4.7.1 1zm-1 2.6c-.2.2-.5.3-.7.1-2.2-1.3-4.9-1.6-8.1-.9-.3.1-.6-.1-.6-.4-.1-.3.1-.6.4-.6 3.5-.8 6.5-.4 8.9 1 .2.2.3.5.1.8z" fill="#fff"/>
            </svg>
            Écouter sur Spotify
        `;
        spotifyBtn.style.cssText = `
            background: rgba(29,185,84,0.15);
            border: 1px solid rgba(29,185,84,0.4);
            color: #1DB954;
            border-radius: 8px;
            padding: 6px 12px;
            font-size: 12px;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        `;
        spotifyBtn.onmouseenter = () => { spotifyBtn.style.background = 'rgba(29,185,84,0.25)'; };
        spotifyBtn.onmouseleave = () => { spotifyBtn.style.background = 'rgba(29,185,84,0.15)'; };

        // Conteneur embed
        const embedContainer = document.createElement('div');
        embedContainer.id = 'spotify-embed-container';
        embedContainer.style.cssText = `
            position: fixed;
            bottom: 72px;
            left: 0;
            right: 0;
            z-index: 49;
            padding: 0 16px;
            max-width: 640px;
            margin: 0 auto;
            transition: all 0.3s ease;
        `;
        embedContainer.classList.add('hidden');
        document.body.appendChild(embedContainer);

        spotifyBtn.addEventListener('click', () => {
            loadEmbed(trackId, 'spotify-embed-container');
        });

        // Insérer le bouton dans le player
        const playerActions = playerBar.querySelector('.flex.items-center.justify-end');
        if (playerActions) playerActions.prepend(spotifyBtn);
    }

    /**
     * Crée un bouton "Spotify" standalone pour n'importe quel contexte
     */
    function createSpotifyLink(trackId, artistName, songTitle) {
        if (!trackId) return '';
        return `
            <a href="https://open.spotify.com/track/${trackId}" target="_blank" rel="noopener noreferrer"
               class="spotify-link-btn" style="
                display: inline-flex; align-items: center; gap: 6px;
                background: rgba(29,185,84,0.12); border: 1px solid rgba(29,185,84,0.3);
                color: #1DB954; border-radius: 8px; padding: 8px 14px;
                font-size: 12px; font-family: 'Inter',sans-serif; font-weight: 500;
                text-decoration: none; transition: all 0.2s;
               "
               onmouseenter="this.style.background='rgba(29,185,84,0.22)'"
               onmouseleave="this.style.background='rgba(29,185,84,0.12)'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#1DB954"><circle cx="12" cy="12" r="12"/><path d="M17.9 10.9C15 9.2 10.4 9 7.6 9.9c-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 3.3-1 8.3-.8 11.6 1.1.4.2.5.7.3 1.1-.2.4-.7.5-1.2.4zm-.1 2.7c-.2.3-.6.4-.9.2-2.5-1.5-6.4-2-9.4-1.1-.4.1-.7-.1-.8-.5-.1-.4.1-.8.5-.8 3.4-1 7.7-.5 10.5 1.2.4.3.4.7.1 1zm-1 2.6c-.2.2-.5.3-.7.1-2.2-1.3-4.9-1.6-8.1-.9-.3.1-.6-.1-.6-.4-.1-.3.1-.6.4-.6 3.5-.8 6.5-.4 8.9 1 .2.2.3.5.1.8z" fill="#fff"/></svg>
                Écouter sur Spotify
            </a>
        `;
    }

    return { initSongPage, loadEmbed, createSpotifyLink };

})();
