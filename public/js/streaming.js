/**
 * SongStory — Streaming Manager
 * Gère le choix du service de streaming (Spotify vs Apple Music)
 */

const SongStoryStreaming = (() => {
    const STORAGE_KEY = 'ss_streaming_service';
    let currentService = localStorage.getItem(STORAGE_KEY) || 'spotify';

    function setService(service) {
        currentService = service;
        localStorage.setItem(STORAGE_KEY, service);
        window.dispatchEvent(new CustomEvent('ss:streamingchange', { detail: { service } }));
    }

    function getService() {
        return currentService;
    }

    function initUnifiedPlayer(songData) {
        if (!songData) return;

        const playerBar = document.querySelector('.fixed.bottom-0');
        if (!playerBar) return;

        const playerActions = playerBar.querySelector('.flex.items-center.justify-end');
        if (!playerActions) return;

        // Container pour les boutons de switching
        const switchContainer = document.createElement('div');
        switchContainer.className = 'flex items-center gap-2 mr-4 bg-zinc-900/50 p-1 rounded-lg border border-white/5';

        const spotifyBtn = createServiceBtn('spotify', 'solar:music-note-bold', '#1DB954');
        const appleBtn = createServiceBtn('apple', 'solar:music-note-bold', '#FA243C');

        switchContainer.appendChild(spotifyBtn);
        switchContainer.appendChild(appleBtn);
        playerActions.prepend(switchContainer);

        // Conteneur global pour les embeds
        let embedContainer = document.getElementById('streaming-embed-container');
        if (!embedContainer) {
            embedContainer = document.createElement('div');
            embedContainer.id = 'streaming-embed-container';
            embedContainer.style.cssText = `
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 100;
                width: calc(100% - 32px);
                max-width: 500px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                opacity: 0;
                pointer-events: none;
            `;

            // Bouton fermer
            const closeBtn = document.createElement('button');
            closeBtn.className = 'absolute -top-10 right-0 w-8 h-8 rounded-full bg-zinc-950 border border-white/10 text-zinc-500 flex items-center justify-center hover:text-white transition-colors';
            closeBtn.innerHTML = '<iconify-icon icon="solar:close-circle-linear" width="20"></iconify-icon>';
            closeBtn.onclick = () => togglePlayer(false);
            embedContainer.appendChild(closeBtn);

            document.body.appendChild(embedContainer);
        }

        function createServiceBtn(service, icon, color) {
            const btn = document.createElement('button');
            btn.className = `w-8 h-8 rounded-md flex items-center justify-center transition-all ${currentService === service ? 'bg-zinc-800' : 'opacity-50 hover:opacity-100'}`;
            btn.innerHTML = `<iconify-icon icon="${icon}" width="18" style="color:${color}"></iconify-icon>`;
            btn.title = service === 'spotify' ? 'Spotify' : 'Apple Music';

            btn.onclick = () => {
                setService(service);
                updateUI();
                togglePlayer(true);
            };
            return btn;
        }

        function updateUI() {
            const btns = switchContainer.querySelectorAll('button');
            btns[0].className = `w-8 h-8 rounded-md flex items-center justify-center transition-all ${currentService === 'spotify' ? 'bg-zinc-800 border border-white/10' : 'opacity-40 hover:opacity-100'}`;
            btns[1].className = `w-8 h-8 rounded-md flex items-center justify-center transition-all ${currentService === 'apple' ? 'bg-zinc-800 border border-white/10' : 'opacity-40 hover:opacity-100'}`;
        }

        function togglePlayer(forceOpen = false) {
            const isOpen = embedContainer.style.opacity === '1' && !forceOpen;
            if (isOpen) {
                embedContainer.style.opacity = '0';
                embedContainer.style.transform = 'translateX(-50%) translateY(20px)';
                embedContainer.style.pointerEvents = 'none';
            } else {
                renderEmbed();
                embedContainer.style.opacity = '1';
                embedContainer.style.transform = 'translateX(-50%) translateY(0)';
                embedContainer.style.pointerEvents = 'auto';
            }
        }

        function renderEmbed() {
            // Garder le bouton fermer
            const closeBtn = embedContainer.querySelector('button');
            embedContainer.innerHTML = '';
            if (closeBtn) embedContainer.appendChild(closeBtn);

            if (currentService === 'spotify' && songData.spotifyId) {
                const iframe = document.createElement('iframe');
                iframe.src = `https://open.spotify.com/embed/track/${songData.spotifyId}?utm_source=generator&theme=0`;
                iframe.width = '100%';
                iframe.height = '80';
                iframe.style.borderRadius = '12px';
                iframe.style.border = 'none';
                embedContainer.appendChild(iframe);
            } else if (currentService === 'apple' && songData.appleMusicId) {
                const iframe = document.createElement('iframe');
                iframe.src = `https://embed.music.apple.com/us/song/${songData.appleMusicId}?theme=dark`;
                iframe.width = '100%';
                iframe.height = '175';
                iframe.style.borderRadius = '12px';
                iframe.style.border = 'none';
                iframe.style.background = 'transparent';
                embedContainer.appendChild(iframe);
            } else {
                embedContainer.innerHTML = `
                    <div class="bg-zinc-900 p-6 rounded-xl border border-white/10 text-center">
                        <p class="text-sm text-zinc-400 mb-4">Service non disponible pour ce morceau</p>
                        <button id="streaming-fallback-play" class="px-4 py-2 bg-amber-500 text-zinc-950 rounded-lg text-xs font-medium hover:bg-amber-400 transition-colors flex items-center gap-2 mx-auto">
                            <iconify-icon icon="solar:play-bold" width="14"></iconify-icon>
                            Écouter l'extrait local
                        </button>
                    </div>`;

                const fallbackBtn = embedContainer.querySelector('#streaming-fallback-play');
                if (fallbackBtn) {
                    fallbackBtn.onclick = () => {
                        const audio = document.getElementById('main-audio');
                        if (audio) {
                            audio.play().catch(() => { });
                            togglePlayer(false); // Fermer l'overlay
                        }
                    };
                }
            }
        }

        // Ajouter un bouton principal de lecture si nécessaire ou utiliser les boutons de switch pour ouvrir
        updateUI();
    }

    return { setService, getService, initUnifiedPlayer };
})();
