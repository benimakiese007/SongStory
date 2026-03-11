/**
 * SongStory — Search & Filter Module
 * Handles: Fuse.js search, library tag filters, and inline searching.
 */

const SongStorySearch = {
    fuseSongs: null,
    fuseArtists: null,
    searchOverlay: null,
    searchOverlayInput: null,
    searchResults: null,

    init() {
        this.searchOverlay = document.getElementById('search-overlay');
        this.searchOverlayInput = document.getElementById('search-overlay-input');
        this.searchResults = document.getElementById('search-results');

        this.initTriggers();
        this.initFilters();
        this.initInlineSearch();

        if (this.searchOverlayInput) {
            this.searchOverlayInput.addEventListener('input', (e) => this.renderResults(e.target.value));
        }
    },

    initTriggers() {
        const triggers = document.querySelectorAll('.search-trigger');
        const closeBtn = document.getElementById('close-search-btn');

        const open = () => {
            if (!this.searchOverlay) return;
            this.searchOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            if (this.searchOverlayInput && !this.searchOverlayInput.value) {
                this.renderThemes();
            }
            setTimeout(() => this.searchOverlayInput?.focus(), 50);
        };

        const close = () => {
            if (!this.searchOverlay) return;
            this.searchOverlay.classList.remove('open');
            document.body.style.overflow = '';
            if (this.searchOverlayInput) this.searchOverlayInput.value = '';
            if (this.searchResults) this.searchResults.innerHTML = '';
        };

        triggers.forEach(btn => btn.addEventListener('click', open));
        closeBtn?.addEventListener('click', close);

        this.searchOverlay?.addEventListener('click', (e) => {
            if (e.target === this.searchOverlay) close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.searchOverlay?.classList.contains('open')) close();
            if ((e.key === '/' || (e.metaKey && e.key === 'k')) && !this.searchOverlay?.classList.contains('open')) {
                const active = document.activeElement;
                if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
                e.preventDefault();
                open();
            }
        });
    },

    initFuse() {
        if (typeof SONGS_DATA !== 'undefined' && !this.fuseSongs) {
            this.fuseSongs = new Fuse(SONGS_DATA, {
                keys: [
                    { name: 'title', weight: 0.7 },
                    { name: 'artist', weight: 0.5 },
                    { name: 'tags', weight: 0.6 },
                    { name: 'description', weight: 0.4 }
                ],
                threshold: 0.35,
                includeMatches: true,
                minMatchCharLength: 2,
            });
        }
        if (typeof ARTISTS_DATA !== 'undefined' && !this.fuseArtists) {
            this.fuseArtists = new Fuse(ARTISTS_DATA, {
                keys: ['name', 'genre'],
                threshold: 0.4,
                includeMatches: true,
                minMatchCharLength: 2,
            });
        }
    },

    renderThemes() {
        const themes = ['Mélancolie', 'Politique', 'Espoir', 'Exil', 'Amour', 'Société'];
        if (!this.searchResults) return;
        this.searchResults.innerHTML = `
            <div class="search-result-group">
                <h4>Explorer par thèmes</h4>
                <div class="flex flex-wrap gap-2 mt-4">
                    ${themes.map(t => `<button class="theme-pill bg-zinc-900 border border-white/10 text-xs px-3 py-1.5 rounded-full hover:border-amber-400/50 transition-colors" onclick="const input = document.getElementById('search-overlay-input'); input.value='${t}'; input.dispatchEvent(new Event('input'))">${t}</button>`).join('')}
                </div>
            </div>
        `;
    },

    async renderResults(query) {
        if (!this.searchResults || !query.trim()) {
            this.renderThemes();
            return;
        }

        const isSubDir = window.location.pathname.includes('/songs/') || window.location.pathname.includes('/artists/');
        const base = isSubDir ? (window.location.pathname.includes('/songs/') ? '../../' : '../') : '';
        const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        let songResults = [];
        let artistResults = [];

        if (window.ss_supabase) {
            const [{ data: sData }, { data: aData }] = await Promise.all([
                window.ss_supabase.from('songs').select('*').ilike('title', `%${query}%`),
                window.ss_supabase.from('artists').select('*').ilike('name', `%${query}%`)
            ]);
            songResults = (sData || []).map(item => ({ item }));
            artistResults = (aData || []).map(item => ({ item }));
        } else {
            this.initFuse();
            songResults = this.fuseSongs ? this.fuseSongs.search(query) : [];
            artistResults = this.fuseArtists ? this.fuseArtists.search(query) : [];
        }

        const highlight = (str, indices) => {
            if (!indices || !indices.length) return esc(str);
            let res = '', last = 0;
            for (const [start, end] of indices) {
                res += esc(str.slice(last, start));
                res += `<mark>${esc(str.slice(start, end + 1))}</mark>`;
                last = end + 1;
            }
            res += esc(str.slice(last));
            return res;
        };

        if (!songResults.length && !artistResults.length) {
            this.searchResults.innerHTML = `<p class="search-no-results">Aucun résultat pour "<strong style="color:#fff">${esc(query)}</strong>"</p>`;
            return;
        }

        let html = '';
        if (songResults.length) {
            html += `<div class="search-result-group"><h4>Chansons</h4><div class="grid grid-cols-1 gap-4 mt-4">`;
            songResults.forEach(({ item: s }) => {
                html += SongStoryUtils.generateSongCard(s, { isSubDir });
            });
            html += `</div></div>`;
        }
        if (artistResults.length) {
            html += `<div class="search-result-group"><h4>Artistes</h4><div class="grid grid-cols-1 gap-4 mt-4">`;
            artistResults.forEach(({ item: a }) => {
                html += SongStoryUtils.generateArtistCard(a, { isSubDir });
            });
            html += `</div></div>`;
        }
        this.searchResults.innerHTML = html;
    },

    initFilters() {
        const pills = document.querySelectorAll('.filter-pill');
        const cards = document.querySelectorAll('[data-tags]');
        if (!pills.length) return;

        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                const tag = pill.dataset.filter;
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                cards.forEach(card => {
                    const tags = (card.dataset.tags || '').split(',');
                    const visible = tag === 'all' || tags.includes(tag);
                    card.classList.toggle('search-hidden', !visible);
                });
            });
        });
    },

    initInlineSearch() {
        const inline = document.querySelector('input[type="text"][placeholder*="Rechercher"]');
        if (!inline) return;
        inline.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            document.querySelectorAll('.chapter-card, [data-tags]').forEach(item => {
                item.classList.toggle('search-hidden', q && !item.textContent.toLowerCase().includes(q));
            });
        });
    }
};
