/**
 * SongStory — Apple Music Integration
 * Gère l'embed Apple Music dans le player bar
 */

const SongStoryAppleMusic = (() => {

    let currentEmbed = null;

    /**
     * Affiche un embed Apple Music dans un conteneur donné
     * @param {string} songId - ID Apple Music du morceau
     * @param {string} containerId - ID du conteneur DOM
     */
    function loadEmbed(songId, containerId) {
        const container = document.getElementById(containerId);
        if (!container || !songId) return;

        // Evite de recharger le même morceau
        if (currentEmbed === songId) {
            container.classList.toggle('hidden');
            return;
        }
        currentEmbed = songId;

        container.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = `https://embed.music.apple.com/us/song/${songId}?theme=dark`;
        iframe.width = '100%';
        iframe.height = '175'; // Apple Music embeds are usually taller
        iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        iframe.loading = 'lazy';
        iframe.frameBorder = '0';
        iframe.style.cssText = 'border-radius: 12px; border: none; background: transparent;';
        container.appendChild(iframe);
        container.classList.remove('hidden');
    }

    return { loadEmbed };

})();
