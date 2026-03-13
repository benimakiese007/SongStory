/**
 * SongStory — Main Entry Point
 * Orchestrates module initialization.
 */

const SongStoryApp = {
    /**
     * Central dispatcher for page-specific initialization.
     * Called by both DOMContentLoaded and the SPA Router.
     */
    initPage(path = window.location.pathname) {
        try {
            if (path.endsWith('/') || path.includes('index.html')) {
                this.handleHomePage();
            } else if (path.includes('artists.html')) {
                this.handleArtistsIndexPage();
            } else if (path.includes('/artists/')) {
                this.handleArtistPage();
            } else if (path.includes('timeline.html')) {
                this.handleTimelinePage();
            } else if (path.includes('glossary.html')) {
                this.handleGlossaryPage();
            } else if (path.includes('contribute.html')) {
                this.handleContributePage();
            } else if (path.includes('account.html')) {
                this.handleAccountPage();
            } else if (path.includes('admin.html')) {
                this.handleAdminPage();
            } else if (path.includes('library.html')) {
                this.handleLibraryPage();
            } else if (path.includes('/songs/') || path.includes('single-song.html')) {
                this.handleSongPage();
            }
        } catch (error) {
            console.error('[SongStoryApp] Error initializing page:', error);
        }
    },

    handleHomePage() {
        const grid = document.getElementById('latest-grid');
        if (!grid || typeof SONGS_DATA === 'undefined') return;

        grid.innerHTML = '';
        const latestSongs = SONGS_DATA.slice(0, 6);
        latestSongs.forEach(song => {
            const cardHtml = SongStoryUtils.generateSongCard(song, { layout: 'home' });
            grid.insertAdjacentHTML('beforeend', cardHtml);
        });

        if (typeof SongStoryUI !== 'undefined') {
            SongStoryUI.initScrollAnimations();
        }
    },

    handleArtistsIndexPage() {
        const grid = document.getElementById('artists-grid');
        if (!grid || typeof ARTISTS_DATA === 'undefined') return;

        grid.innerHTML = '';
        ARTISTS_DATA.forEach(artist => {
            // Calculate analysis count dynamically
            const count = (typeof SONGS_DATA !== 'undefined') ? 
                SONGS_DATA.filter(s => s.artist_id === artist.id || s.artist === artist.id).length : 0;
            const artistWithCount = { ...artist, songs_count: count };
            
            if (typeof SongStoryUtils !== 'undefined') {
                const cardHtml = SongStoryUtils.generateArtistCard(artistWithCount, { isSubDir: false });
                grid.insertAdjacentHTML('beforeend', cardHtml);
            }
        });

        if (typeof SongStoryUI !== 'undefined') {
            SongStoryUI.initScrollAnimations();
        }

        this.initArtistsCounter();
    },

    initArtistsCounter() {
        if (typeof initArtistsCounter === 'function') {
            initArtistsCounter();
        }
    },

    handleArtistPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '');
        
        let artistId = filename;
        if (typeof ARTISTS_DATA !== 'undefined') {
            const artist = ARTISTS_DATA.find(a => 
                (a.url && a.url.includes(filename + '.html')) || a.id === filename
            );
            if (artist) artistId = artist.id;
        }

        if (typeof SongStoryUtils !== 'undefined' && typeof SongStoryUtils.renderArtistSongs === 'function') {
            SongStoryUtils.renderArtistSongs(artistId);
        }
    },

    handleLibraryPage() {
        const grid = document.getElementById('songs-grid');
        if (!grid || typeof SONGS_DATA === 'undefined') return;

        const renderSongs = (filter = 'all') => {
            const favs = JSON.parse(localStorage.getItem('ss_favorites') || '[]');
            grid.innerHTML = '';
            
            const filteredSongs = SONGS_DATA.filter(song => {
                const cardGenre = song.genre ? song.genre.toLowerCase() : '';
                const cardTags = song.tags ? song.tags.map(t => t.toLowerCase()) : [];
                
                if (filter === 'all') return true;
                if (filter === 'favorites') return favs.includes(song.id);
                if (filter === 'rock') return cardGenre.includes('rock') || cardTags.includes('rock');
                if (filter === 'rap') return cardGenre.includes('rap') || cardTags.includes('rap');
                if (filter === 'beef') return cardTags.includes('beef');
                if (filter === 'storytelling') return cardTags.includes('storytelling');
                if (filter === 'classique') return cardTags.includes('classic') || cardTags.includes('classique');
                if (filter === 'mélancolie') return cardTags.includes('mélancolie');
                if (filter === 'politique') return cardTags.includes('politique');
                return false;
            });

            filteredSongs.forEach(song => {
                const cardHtml = SongStoryUtils.generateSongCard(song, { isSubDir: false });
                grid.insertAdjacentHTML('beforeend', cardHtml);
            });

            if (typeof SongStoryUI !== 'undefined') {
                SongStoryUI.initScrollAnimations();
                SongStoryUI.initTilt();
            }
        };

        // Attach filter listeners
        const pills = document.querySelectorAll('.filter-pill');
        const collectionPills = document.querySelectorAll('.filter-pill-collection');

        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                renderSongs(pill.dataset.filter);
            });
        });

        collectionPills.forEach(cp => {
            cp.addEventListener('click', () => {
                const filter = cp.dataset.filter;
                const mainPill = Array.from(pills).find(p => p.dataset.filter === filter);
                if (mainPill) mainPill.click();
                else renderSongs(filter);
                cp.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });

        renderSongs('all');
    },

    handleTimelinePage() {
        const container = document.getElementById('timeline-container');
        if (!container || typeof BEEF_TIMELINE === 'undefined') return;

        container.innerHTML = '';
        BEEF_TIMELINE.forEach((event, i) => {
            const isLeft = i % 2 === 0;
            const side = event.side;
            const dotClass = side === 'kendrick' ? 'dot-kendrick' : side === 'drake' ? 'dot-drake' : side === 'both' ? 'dot-both' : 'dot-context';
            const cardClass = side === 'kendrick' ? 'kendrick' : side === 'drake' ? 'drake' : side === 'both' ? 'both' : '';
            const tagClass = event.tag === 'track' ? 'tag-track' : event.tag === 'tweet' ? 'tag-tweet' : event.tag === 'interview' ? 'tag-interview' : event.tag === 'victory' ? 'tag-victory' : 'tag-event';
            const tagLabel = event.tag === 'track' ? '🎵 Morceau' : event.tag === 'tweet' ? '🐦 Tweet' : event.tag === 'interview' ? '🎤 Interview' : event.tag === 'victory' ? '🏆 Victoire' : '📅 Événement';

            const div = document.createElement('div');
            div.className = `timeline-event ${isLeft ? 'left' : 'right'} relative`;
            div.dataset.side = side;
            div.dataset.tag = event.tag;

            div.innerHTML = `
                <div class="timeline-dot ${dotClass}"></div>
                <div class="event-card ${cardClass} ${isLeft ? '' : 'right'}">
                    <div class="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <span class="text-xs text-zinc-600 font-medium">${event.date}</span>
                        <span class="event-tag ${tagClass}">${tagLabel}</span>
                    </div>
                    <div class="text-xs font-medium mb-1" style="color: ${side === 'kendrick' ? '#a855f7' : side === 'drake' ? '#fbbf24' : side === 'both' ? '#f87171' : '#6b7280'}">${event.actor}</div>
                    <h3 class="text-white text-sm font-medium leading-snug mb-2">${event.title}</h3>
                    <p class="text-zinc-500 text-xs leading-relaxed">${event.text}</p>
                    ${event.link ? `<a href="${event.link}" class="inline-flex items-center gap-1 text-amber-400 text-xs mt-3 hover:text-amber-300 transition-colors">
                        Lire l'analyse <iconify-icon icon="solar:arrow-right-linear" width="12"></iconify-icon>
                    </a>` : ''}
                </div>
            `;
            container.appendChild(div);
        });

        const events = container.querySelectorAll('.timeline-event');
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        events.forEach(e => obs.observe(e));
    },

    filterTimeline(btn, filter) {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.timeline-event').forEach(el => {
            const side = el.dataset.side;
            const tag = el.dataset.tag;
            let show = filter === 'all' ||
                (filter === 'kendrick' && (side === 'kendrick' || side === 'both')) ||
                (filter === 'drake' && (side === 'drake' || side === 'both')) ||
                (filter === 'track' && tag === 'track');
            el.classList.toggle('hidden-filter', !show);
        });
    },

    async handleGlossaryPage() {
        const grid = document.getElementById('glossary-grid');
        if (!grid) return;

        let terms = [];
        let glossaryData = {};

        if (window.ss_supabase) {
            try {
                const { data, error } = await window.ss_supabase.from('glossary').select('*').order('term');
                if (!error && data) {
                    terms = data.map(item => item.term);
                    data.forEach(item => glossaryData[item.term] = item.definition);
                }
            } catch (err) {
                console.warn('Supabase request failed, falling back to local data:', err);
            }
        }

        if (terms.length === 0 && typeof GLOSSARY !== 'undefined') {
            glossaryData = GLOSSARY;
            terms = Object.keys(GLOSSARY).sort();
        }

        if (terms.length === 0) return;

        grid.innerHTML = '';
        terms.forEach(term => {
            const def = glossaryData[term];
            const card = document.createElement('div');
            card.className = 'reveal bg-zinc-950/40 border border-white/10 p-6 rounded-2xl hover:bg-zinc-900/50 transition-all shadow-xl';
            card.innerHTML = `
                <h3 class="text-amber-400 font-medium text-lg mb-2 capitalize">${term}</h3>
                <p class="text-zinc-400 text-sm leading-relaxed">${def}</p>
            `;
            grid.appendChild(card);
        });

        if (typeof SongStoryUI !== 'undefined') {
            SongStoryUI.initScrollAnimations();
        }
    },

    handleContributePage() {
        const select = document.getElementById('input-song');
        if (!select) return;

        if (typeof SONGS_DATA !== 'undefined') {
            select.innerHTML = '<option value="" disabled selected>Choisir un morceau…</option>';
            SONGS_DATA.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.id;
                opt.textContent = `${s.title} — ${s.artist}`;
                select.appendChild(opt);
            });
        }

        const urlParams = new URLSearchParams(window.location.search);
        const preSong = urlParams.get('song');
        if (preSong) select.value = preSong;

        window.selectType = (btn) => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('input-type').value = btn.dataset.type;
        };

        window.submitForm = async () => {
            const btn = document.getElementById('submit-btn');
            if (!btn) return;
            btn.disabled = true;
            btn.textContent = 'Envoi…';
            const user = (typeof SongStoryAuth !== 'undefined') ? SongStoryAuth.getUser() : null;
            if (typeof SongStoryContrib !== 'undefined') {
                const res = await SongStoryContrib.submit({
                    songId: document.getElementById('input-song').value,
                    type: document.getElementById('input-type').value,
                    lineRef: document.getElementById('input-ref').value,
                    text: document.getElementById('input-text').value,
                    author: user ? user.name : 'Anonyme'
                });
                if (res.ok) {
                    document.getElementById('contrib-form')?.classList.add('hidden');
                    document.getElementById('success-msg')?.classList.remove('hidden');
                } else {
                    btn.disabled = false;
                    btn.textContent = 'Envoyer la suggestion';
                    alert(res.error || 'Erreur lors de l\'envoi');
                }
            }
        };
    },

    async handleAccountPage() {
        const loginSection = document.getElementById('auth-section-login');
        const profileSection = document.getElementById('auth-section-profile');
        if (!loginSection || !profileSection) return;

        const supaUser = (typeof SongStorySupabaseAuth !== 'undefined') ? await SongStorySupabaseAuth.getUser() : null;

        if (supaUser) {
            loginSection.classList.add('hidden');
            profileSection.classList.remove('hidden');

            const pseudo = SongStorySupabaseAuth.getPseudo(supaUser);
            const avatar = SongStorySupabaseAuth.getAvatar(supaUser);
            const avatarEl = document.getElementById('profile-avatar');

            if (avatarEl) {
                if (avatar) {
                    avatarEl.innerHTML = `<img src="${avatar}" alt="${pseudo}" style="width:100%;height:100%;object-fit:cover;">`;
                } else {
                    avatarEl.textContent = SongStorySupabaseAuth.getInitials(pseudo);
                }
            }

            const nameEl = document.getElementById('profile-name');
            const emailEl = document.getElementById('profile-email');
            const joinedEl = document.getElementById('profile-joined');

            if (nameEl) nameEl.textContent = pseudo;
            if (emailEl) emailEl.textContent = supaUser.email;

            if (joinedEl) {
                const d = new Date(supaUser.created_at);
                joinedEl.textContent = `Membre depuis le ${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
            }

            this.renderAccountFavorites();
            this.renderAccountPlaylists();
            this.renderAccountNotes();
        } else {
            loginSection.classList.remove('hidden');
            profileSection.classList.add('hidden');
        }

        window.doGoogleLogin = async () => {
            if (typeof SongStorySupabaseAuth !== 'undefined') {
                const btn = document.getElementById('google-signin-btn');
                const err = document.getElementById('google-error');
                if (err) err.classList.add('hidden');
                if (btn) { btn.disabled = true; btn.style.opacity = '0.7'; }

                const { error } = await SongStorySupabaseAuth.signInWithGoogle();
                if (error) {
                    if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
                    if (err) {
                        err.textContent = error.message || 'Erreur lors de la connexion Google.';
                        err.classList.remove('hidden');
                    }
                }
            }
        };

        window.doLogout = async () => {
            if (typeof SongStorySupabaseAuth !== 'undefined') {
                await SongStorySupabaseAuth.signOut();
                this.handleAccountPage();
            }
        };

        window.switchTab = (name) => {
            document.querySelectorAll('#auth-section-profile .account-tab').forEach((t) => {
                const onclick = t.getAttribute('onclick');
                t.classList.toggle('active', onclick && onclick.includes(`'${name}'`));
            });
            document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
            document.getElementById('tab-' + name)?.classList.add('active');
        };

        window.removeFav = (id) => {
            if (typeof SongStoryAuth !== 'undefined') {
                SongStoryAuth.toggleFavorite(id);
                this.renderAccountFavorites();
            }
        };

        window.createNewPlaylist = () => {
            const input = document.getElementById('new-playlist-name');
            if (!input || !input.value.trim()) return;
            if (typeof SongStoryAuth !== 'undefined') {
                SongStoryAuth.createPlaylist(input.value);
                input.value = '';
                this.renderAccountPlaylists();
            }
        };

        window.deletePlaylist = (id) => {
            if (typeof SongStoryAuth !== 'undefined') {
                SongStoryAuth.deletePlaylist(id);
                this.renderAccountPlaylists();
            }
        };
    },

    renderAccountFavorites() {
        const container = document.getElementById('favorites-list');
        if (!container) return;
        if (typeof SongStoryAuth === 'undefined') return;

        const favIds = SongStoryAuth.getFavorites();
        if (!favIds.length) {
            container.innerHTML = `<p class="text-zinc-600 text-sm text-center py-8">Aucun favori pour l'instant. Cliquez sur ❤️ sur une page chanson.</p>`;
            return;
        }
        const songs = typeof SONGS_DATA !== 'undefined' ? SONGS_DATA : [];
        container.innerHTML = favIds.map(id => {
            const s = songs.find(s => s.id === id);
            if (!s) return '';
            return `<a href="${s.url}" class="fav-card"><div class="fav-card-icon"><iconify-icon icon="solar:music-note-linear" width="18"></iconify-icon></div><div class="flex-1 min-w-0"><div class="text-white text-sm font-medium truncate">${s.title}</div><div class="text-zinc-500 text-xs mt-0.5">${s.artist} · ${s.year}</div></div><button onclick="event.preventDefault();event.stopPropagation();removeFav('${id}')" class="text-zinc-600 hover:text-red-400 transition-colors"><iconify-icon icon="solar:heart-bold" width="16"></iconify-icon></button></a>`;
        }).join('');
    },

    renderAccountPlaylists() {
        const container = document.getElementById('playlists-list');
        if (!container) return;
        if (typeof SongStoryAuth === 'undefined') return;

        const playlists = SongStoryAuth.getPlaylists();
        const songs = typeof SONGS_DATA !== 'undefined' ? SONGS_DATA : [];
        if (!playlists.length) {
            container.innerHTML = `<p class="text-zinc-600 text-sm text-center py-8">Aucune playlist. Créez-en une ci-dessus !</p>`;
            return;
        }
        container.innerHTML = playlists.map(pl => `<div class="playlist-item"><div class="flex items-center justify-between mb-2"><span class="text-white text-sm font-medium">${pl.name}</span><div class="flex items-center gap-3"><span class="text-zinc-600 text-xs">${pl.songs.length} morceau${pl.songs.length > 1 ? 'x' : ''}</span><button onclick="deletePlaylist('${pl.id}')" class="text-zinc-600 hover:text-red-400 transition-colors text-xs">Supprimer</button></div></div>${pl.songs.length ? '<div class="flex flex-col gap-1.5">' + pl.songs.map(sid => { const s = songs.find(s => s.id === sid); return s ? `<a href="${s.url}" class="text-xs text-zinc-500 hover:text-amber-400 transition-colors">↗ ${s.title} — ${s.artist}</a>` : ''; }).join('') + '</div>' : ''}</div>`).join('');
    },

    renderAccountNotes() {
        const container = document.getElementById('notes-list');
        if (!container) return;
        if (typeof SongStoryAuth === 'undefined') return;

        const allNotes = SongStoryAuth.getAllNotes();
        const songs = typeof SONGS_DATA !== 'undefined' ? SONGS_DATA : [];
        const entries = Object.entries(allNotes).flatMap(([songId, blocks]) => Object.entries(blocks).map(([blockId, note]) => ({ songId, blockId, note })));
        if (!entries.length) {
            container.innerHTML = `<p class="text-zinc-600 text-sm text-center py-8">Aucune note. Annotez des paroles sur une page chanson.</p>`;
            return;
        }
        container.innerHTML = entries.map(e => {
            const song = songs.find(s => s.id === e.songId);
            const d = new Date(e.note.savedAt);
            return `<div class="note-item"><div class="flex items-center justify-between mb-2"><a href="${song?.url || '#'}" class="text-amber-400 text-xs hover:text-amber-300 transition-colors">${song?.title || e.songId}</a><span class="text-zinc-600 text-xs">${d.toLocaleDateString('fr-FR')}</span></div><p class="text-sm text-zinc-300 leading-relaxed">${e.note.text}</p></div>`;
        }).join('');
    },

    handleAdminPage() {
        if (typeof SupabaseCMS !== 'undefined') {
            SupabaseCMS.init();
        }

        window.loginWithGoogle = async () => {
            const err = document.getElementById('login-err');
            if (err) err.classList.add('hidden');
            try {
                if (typeof SupabaseCMS !== 'undefined') {
                    const { error } = await SupabaseCMS.signInWithGoogle();
                    if (error && err) {
                        err.textContent = error.message || 'Erreur de connexion';
                        err.classList.remove('hidden');
                    }
                }
            } catch (e) {
                if (err) {
                    err.textContent = 'Erreur de connexion';
                    err.classList.remove('hidden');
                }
            }
        };

        window.logout = () => {
            if (typeof SupabaseCMS !== 'undefined') {
                SupabaseCMS.signOut().then(() => location.reload());
            }
        };
    },

    handleSongPage() {
        if (typeof SongStoryRenderer !== 'undefined' && typeof SongStoryRenderer.init === 'function') {
            SongStoryRenderer.init();
        } else if (typeof renderSong === 'function') {
            renderSong();
        }
        
        // Router handles _attachAnalysisEvents if needed, or we can do it here
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize UI Interactions
    if (typeof SongStoryUI !== 'undefined') {
        SongStoryUI.init();
    }

    // 2. Initialize Search & Filters
    if (typeof SongStorySearch !== 'undefined') {
        SongStorySearch.init();
    }

    // 3. Initialize Audio Player
    if (typeof SongStoryPlayer !== 'undefined') {
        SongStoryPlayer.init();
    }

    // 4. Initialize SPA Router
    if (typeof SongStoryRouter !== 'undefined') {
        SongStoryRouter.init();
    }

    // 5. Initialize Authentication Navigation UI
    if (typeof SongStoryAuth !== 'undefined' && typeof SongStoryAuth.initNavUI === 'function') {
        SongStoryAuth.initNavUI();
    }

    // 6. Universal Page Init
    SongStoryApp.initPage();

    // Trigger when Supabase data is ready
    window.addEventListener('ss:dataready', () => SongStoryApp.initPage());

    // 7. Analysis Block Highlights (Specific to Song Pages)
    // This part should probably be moved to handleSongPage if we want it to be robust
});
