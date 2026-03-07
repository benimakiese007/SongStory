/**
 * SongStory — Song Renderer Module
 * Dynamically populates single-song.html based on URL parameters.
 */

const SongStoryRenderer = {
    currentSong: null,

    async init() {
        const params = new URLSearchParams(window.location.search);
        const songId = params.get('id');

        if (!songId) {
            console.error('No song ID provided');
            return;
        }

        // Fetch song and its content from Supabase
        if (window.ss_supabase) {
            const { data: song, error } = await window.ss_supabase
                .from('songs')
                .select('*, artists(*), song_contents(*)')
                .eq('id', songId)
                .single();

            if (error || !song) {
                console.error('Error fetching song:', error);
                this.renderNotFound();
                return;
            }

            // Map Supabase structure to the expected currentSong structure
            this.currentSong = {
                ...song,
                artist: song.artists.name,
                artistId: song.artists.id,
                audio: song.audio_url, // Map audio_url back to audio
                content: song.song_contents.sort((a, b) => a.display_order - b.display_order)
            };
        } else {
            // Fallback to local data if Supabase is not configured
            this.currentSong = typeof SONGS_DATA !== 'undefined' ? SONGS_DATA.find(s => s.id === songId) : null;
        }

        if (!this.currentSong) {
            this.renderNotFound();
            return;
        }

        this.renderHeader();
        this.renderNarrative();
        this.renderInfo();
        this.renderPlayer();
        this.renderRecommendations();
        this.updateSEO();
        this.applyDynamicTheme();
        this.initExternalModules();
    },

    renderNotFound() {
        document.title = "Chanson introuvable - SongStory";
        const wrapper = document.getElementById('narrative-wrapper');
        if (wrapper) wrapper.innerHTML = '<div class="py-20 text-center"><h2 class="text-white text-2xl mb-4">Oups !</h2><p>Cette chanson n\'existe pas encore dans notre base.</p><a href="index.html" class="text-amber-400 mt-4 block">Retour à l\'accueil</a></div>';
    },

    applyDynamicTheme() {
        if (this.currentSong && this.currentSong.themeColor && typeof SongStoryUI !== 'undefined') {
            SongStoryUI.setAccentColor(this.currentSong.themeColor);
        } else if (typeof SongStoryUI !== 'undefined') {
            SongStoryUI.setAccentColor(null); // Reset to default
        }
    },

    renderHeader() {
        const titleEl = document.getElementById('song-title');
        const metaEl = document.getElementById('song-meta');
        const artistLink = document.getElementById('artist-link');

        if (titleEl) titleEl.textContent = this.currentSong.title;
        if (artistLink) {
            const artistId = this.currentSong.artistId || this.currentSong.artist.toLowerCase().replace(/\s+/g, '-');
            artistLink.href = `artists/${artistId}.html`;
            artistLink.textContent = `Voir le profil de ${this.currentSong.artist} →`;
        }

        // Add Favorites logic
        const favs = JSON.parse(localStorage.getItem('ss_favorites') || '[]');
        const isFav = favs.includes(this.currentSong.id);
        const favIcon = isFav ? 'solar:heart-bold' : 'solar:heart-linear';
        const favColor = isFav ? 'text-amber-500' : 'text-zinc-500';

        if (metaEl) {
            metaEl.innerHTML = `
                <div class="flex items-center gap-4">
                    <span>${this.currentSong.artist} • ${this.currentSong.year}</span>
                    <button class="fav-toggle-btn hover:text-amber-400 transition-colors flex items-center gap-1 ${favColor}" data-id="${this.currentSong.id}" title="Ajouter aux favoris">
                        <iconify-icon icon="${favIcon}" width="22"></iconify-icon>
                    </button>
                </div>
            `;

            // Re-attach event listener
            setTimeout(() => {
                const btn = document.querySelector('.fav-toggle-btn');
                if (btn) {
                    btn.addEventListener('click', (e) => this.toggleFavorite(e, this.currentSong.id));
                }
            }, 0);
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

    renderNarrative() {
        const wrapper = document.getElementById('narrative-wrapper');
        if (!wrapper || !this.currentSong.content) return;

        let html = '';
        this.currentSong.content.forEach((block, idx) => {
            const lyricsHtml = block.lyrics.map(line =>
                `<p class="lyric-line hover:text-white transition-colors cursor-pointer" data-time="${block.time}">${line}</p>`
            ).join('');

            html += `
                <div class="reveal story-block" data-time="${block.time}" id="block-${block.time}">
                    <div class="lyrics-text space-y-2 group">
                        ${lyricsHtml}
                    </div>
                    <div class="analysis-content-visible">
                        ${block.analysis}
                    </div>
                    <div style="display:flex;gap:8px;margin-top:8px;">
                        <button class="comment-toggle-btn">
                            <iconify-icon icon="solar:chat-round-line-linear" width="12"></iconify-icon> ${Math.floor(Math.random() * 100) + 10}
                        </button>
                        <button class="share-quote-btn comment-toggle-btn">
                            <iconify-icon icon="solar:share-linear" width="12"></iconify-icon>
                        </button>
                    </div>
                    <div class="comment-section"></div>
                </div>
            `;
        });
        wrapper.innerHTML = html;

        // Auto-inject glossary terms into the newly rendered content
        if (typeof SongStoryUI !== 'undefined') {
            SongStoryUI.injectDynamicGlossary(wrapper);
        }
    },

    renderInfo() {
        const grid = document.getElementById('info-grid');
        if (!grid) return;

        const infos = [
            { label: 'Album', value: this.currentSong.album || 'N/A' },
            { label: 'Genre', value: this.currentSong.genre || 'N/A' },
            { label: 'Durée', value: this.currentSong.duration || 'N/A' },
            { label: 'BPM', value: this.currentSong.bpm || 'N/A' }
        ];

        grid.innerHTML = infos.map(i => `
            <div class="flex justify-between">
                <span class="text-zinc-500">${i.label}</span>
                <span class="text-zinc-300">${i.value}</span>
            </div>
        `).join('');

        const contributeLink = document.getElementById('contribute-link');
        if (contributeLink) contributeLink.href = `contribute.html?song=${this.currentSong.id}`;
    },

    renderPlayer() {
        const audio = document.getElementById('main-audio');
        const pTitle = document.getElementById('player-title');
        const pArtist = document.getElementById('player-artist');

        if (audio && this.currentSong.audio) audio.src = this.currentSong.audio;
        if (pTitle) pTitle.textContent = this.currentSong.title;
        if (pArtist) pArtist.textContent = this.currentSong.artist;
    },

    renderRecommendations() {
        const grid = document.getElementById('recommendations-grid');
        if (!grid) return;

        // Simple algo: other songs from same genre or just random
        const recs = SONGS_DATA.filter(s => s.id !== this.currentSong.id).slice(0, 3);

        grid.innerHTML = recs.map(s => `
            <a href="single-song.html?id=${s.id}" class="recommendation-card">
                <div class="rec-thumb"><iconify-icon icon="solar:music-note-linear" width="20"></iconify-icon></div>
                <div>
                    <div class="rec-title">${s.title}</div>
                    <div class="rec-artist">${s.artist} • ${s.genre}</div>
                </div>
            </a>
        `).join('');
    },

    updateSEO() {
        document.title = `${this.currentSong.title} - SongStory`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = `Analyse complète de ${this.currentSong.title} par ${this.currentSong.artist}. Découvrez le sens des paroles sur SongStory.`;
    },

    initExternalModules() {
        // Initialize streaming player if data exists
        if (typeof SongStoryStreaming !== 'undefined' && (this.currentSong.spotifyId || this.currentSong.appleMusicId)) {
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

        // Re-init UI features that depend on newly injected DOM
        if (typeof SongStoryUI !== 'undefined') {
            SongStoryUI.initScrollAnimations();
            SongStoryUI.initComments();
            SongStoryUI.initShareCard();
            SongStoryUI.initTilt();
        }

        // Re-init Player markers
        if (typeof SongStoryPlayer !== 'undefined') {
            SongStoryPlayer.storyBlocks = document.querySelectorAll('.story-block[data-time]');
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
    }
};

// Start rendering when DOM is ready (but after data.js)
document.addEventListener('DOMContentLoaded', () => {
    SongStoryRenderer.init();
});
