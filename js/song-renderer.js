/**
 * SongStory — Song Renderer Module
 * Dynamically populates single-song.html based on URL parameters.
 */

const SongStoryRenderer = {
    currentSong: null,

    async init() {
        const params = new URLSearchParams(window.location.search);
        const songId = params.get('id');

        // --- REDIRECT: If we land on single-song.html?id=X, send to the static songs/X.html ---
        if (songId && window.location.pathname.includes('single-song.html')) {
            const base = window.location.href.replace(/single-song\.html.*$/, '');
            window.location.replace(`${base}songs/${songId}.html`);
            return; // Stop here, the page will redirect
        }

        // Infer ID from filename (e.g. songs/push-ups.html -> push-ups)
        const currentSongId = window.location.pathname.split('/').pop().replace('.html', '');

        // Init interactive features on the existing static HTML
        this.initClassicAnalysis();

        // Attempt to find metadata in local SONGS_DATA for the player/theme
        this.currentSong = typeof SONGS_DATA !== 'undefined' ? SONGS_DATA.find(s => s.id === currentSongId) : null;

        if (this.currentSong) {
            this.renderHeader();
            this.renderPlayer();
            this.updateSEO();
            this.applyDynamicTheme();
            this.initExternalModules();
        } else {
            console.warn(`No entry in data.js for id: "${currentSongId}". Audio/theme won't auto-init.`);
            this.initExternalModules();
        }
    },

    async applyDynamicTheme() {
        if (!this.currentSong) return;

        let color = this.currentSong.themeColor;

        // If no explicit theme color, try to extract it from the image
        if (!color && typeof SongStoryUI !== 'undefined') {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            // Use artist thumb as proxy for album art if needed
            const imgSrc = this.currentSong.image || `Images/artists/${this.currentSong.artistId}.jpg`;

            try {
                color = await this.extractDominantColor(imgSrc);
            } catch (e) {
                console.warn("Could not extract color:", e);
            }
        }

        if (typeof SongStoryUI !== 'undefined') {
            SongStoryUI.setAccentColor(color);
        }
    },

    async extractDominantColor(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 50; canvas.height = 50; // Downscale for performance
                ctx.drawImage(img, 0, 0, 50, 50);

                const data = ctx.getImageData(0, 0, 50, 50).data;
                let r = 0, g = 0, b = 0, count = 0;

                for (let i = 0; i < data.length; i += 4) {
                    // Skip very dark or very light pixels
                    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    if (brightness < 30 || brightness > 220) continue;

                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    count++;
                }

                if (count === 0) return resolve('#fbbf24'); // Default fallback

                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);

                resolve(`rgb(${r}, ${g}, ${b})`);
            };
            img.onerror = reject;
            img.src = src;
        });
    },

    renderHeader() {
        // Title and artist are statically in HTML — only manage the favorites button
        const metaEl = document.getElementById('song-meta');
        const favs = JSON.parse(localStorage.getItem('ss_favorites') || '[]');
        const isFav = favs.includes(this.currentSong.id);
        const favIcon = isFav ? 'solar:heart-bold' : 'solar:heart-linear';
        const favColor = isFav ? 'text-amber-500' : 'text-zinc-500';

        // Inject favorites button next to the existing meta text
        const existingFavBtn = document.querySelector('.fav-toggle-btn');
        if (!existingFavBtn && metaEl) {
            const favBtn = document.createElement('button');
            favBtn.className = `fav-toggle-btn hover:text-amber-400 transition-colors flex items-center gap-1 ${favColor}`;
            favBtn.dataset.id = this.currentSong.id;
            favBtn.title = 'Ajouter aux favoris';
            favBtn.innerHTML = `<iconify-icon icon="${favIcon}" width="22"></iconify-icon>`;
            favBtn.addEventListener('click', (e) => this.toggleFavorite(e, this.currentSong.id));
            metaEl.appendChild(favBtn);
        }
    },

    toggleFavorite(e, id) {
        let favs = JSON.parse(localStorage.getItem('ss_favorites') || '[]');
        const icon = e.currentTarget.querySelector('iconify-icon');

        if (favs.includes(id)) {
            favs = favs.filter(f => f !== id);
            icon.setAttribute('icon', 'solar:heart-linear');
            e.currentTarget.classList.remove('text-amber-500');
            e.currentTarget.classList.add('text-zinc-500');
        } else {
            favs.push(id);
            icon.setAttribute('icon', 'solar:heart-bold');
            e.currentTarget.classList.remove('text-zinc-500');
            e.currentTarget.classList.add('text-amber-500');
        }
        localStorage.setItem('ss_favorites', JSON.stringify(favs));
    },

    // renderNarrative() removed. Lyrics and decryptions are now fully static in HTML.
    // renderInfo() removed. Info blocks are now fully static in HTML.
    // renderRecommendations() removed. Suggested songs are now fully static in HTML.

    updateSEO() {
        document.title = `${this.currentSong.title} - SongStory`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = `Analyse complète de ${this.currentSong.title} par ${this.currentSong.artist}. Découvrez le sens des paroles sur SongStory.`;
    },

    initExternalModules() {
        // Initialize streaming player if data exists
        if (this.currentSong && typeof SongStoryStreaming !== 'undefined' && (this.currentSong.spotifyId || this.currentSong.appleMusicId)) {
            SongStoryStreaming.initUnifiedPlayer(this.currentSong);

            // Also populate the sidebar card if it exists
            const sidebarContainer = document.getElementById('unified-player-container');
            const loadingMsg = document.getElementById('unified-player-loading');
            if (sidebarContainer) {
                loadingMsg?.classList.add('hidden');
                sidebarContainer.classList.remove('hidden');

                // Switch between Spotify and Apple Music in sidebar too
                this.renderSidebarStreaming(sidebarContainer);
            }
        }

        // Re-init UI features that depend on DOM
        if (typeof SongStoryUI !== 'undefined') {
            SongStoryUI.initScrollAnimations();
            SongStoryUI.initComments();
            SongStoryUI.initShareCard();
            SongStoryUI.initTilt();
            // Re-init Player markers and lyrics
            // Activating Glossary Injection for Difficult Words
            SongStoryUI.injectDynamicGlossary(document.getElementById('narrative-wrapper'));
        }

        // Re-init Player markers and lyrics
        if (typeof SongStoryPlayer !== 'undefined') {
            SongStoryPlayer.storyBlocks = document.querySelectorAll('.story-block[data-time]');
            SongStoryPlayer.lyricLines = document.querySelectorAll('.lyric-line[data-time]');
            SongStoryPlayer.renderWaveformMarkers();
        }
    },

    renderSidebarStreaming(container) {
        const service = typeof SongStoryStreaming !== 'undefined' ? SongStoryStreaming.getService() : 'spotify';
        container.innerHTML = '';

        if (service === 'spotify' && this.currentSong.spotifyId) {
            container.innerHTML = `<iframe src="https://open.spotify.com/embed/track/${this.currentSong.spotifyId}?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style="border-radius:12px;"></iframe>`;
        } else if (service === 'apple' && this.currentSong.appleMusicId) {
            container.innerHTML = `<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/song/${this.currentSong.appleMusicId}?theme=dark"></iframe>`;
        } else {
            container.innerHTML = '<p class="text-xs text-zinc-500 italic">Plateforme non disponible pour ce titre.</p>';
        }

        // Listen for service changes to update sidebar
        window.addEventListener('ss:streamingchange', (e) => {
            this.renderSidebarStreaming(container);
        });
    },

    initClassicAnalysis() {
        const storyBlocks = document.querySelectorAll('.story-block');
        const analysisCard = document.getElementById('dynamic-analysis-card');
        const analysisPlaceholder = document.getElementById('analysis-placeholder');

        storyBlocks.forEach(block => {
            const lyricsText = block.querySelector('.lyrics-text');
            if (!lyricsText) return;

            lyricsText.addEventListener('click', () => {
                const analysisContent = (block.querySelector('.analysis-content') || block.querySelector('.analysis-content-visible'))?.innerHTML;
                if (analysisCard && analysisPlaceholder && analysisContent) {
                    analysisCard.style.opacity = '0';
                    analysisCard.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        analysisPlaceholder.innerHTML = analysisContent;
                        analysisCard.style.opacity = '1';
                        analysisCard.style.transform = 'translateY(0)';
                    }, 300);
                }

                // Also trigger bubble update for immersive mode
                if (typeof SongStoryPlayer !== 'undefined') {
                    SongStoryPlayer.updateDecryptBubble(block.querySelector('.lyric-line'));
                }

                storyBlocks.forEach(b => b.querySelector('.lyrics-text')?.classList.remove('text-white', 'font-medium'));
                lyricsText.classList.add('text-white', 'font-medium');
            });
        });
    }
};

// Start rendering when DOM is ready (but after data.js)
document.addEventListener('DOMContentLoaded', () => {
    SongStoryRenderer.init();
});
