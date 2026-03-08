/**
 * SongStory — UI Module
 * Handles: animations, menu, tooltips, share card, progress, and theme.
 */

const SongStoryUI = {
    init() {
        this.initMobileMenu();
        this.initScrollAnimations();
        this.initSkeletons();
        this.initTilt();
        this.initReadingProgress();
        this.initGlossary();
        this.initComments();
        this.initShareCard();
        this.initTheme();
        this.initLayout();
        this.initTOC();
        this.initTransitions();
        this.initGlobalGlossaryPanel();
    },

    /**
     * Scans a container's text for keywords defined in GLOSSARY
     * and wraps them in interactive spans automatically.
     */
    injectDynamicGlossary(container) {
        if (!container || typeof GLOSSARY === 'undefined') return;

        // Sort terms by length (descending) to avoid partial matches (e.g., 'flow' before 'flower')
        const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
        if (terms.length === 0) return;

        // Create a regex pattern: \b(term1|term2|term3)\b
        // We use word boundaries to avoid matching inside other words
        const pattern = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');

        const walk = (node) => {
            if (node.nodeType === 3) { // Text node
                const text = node.nodeValue;
                if (pattern.test(text)) {
                    const span = document.createElement('span');
                    span.innerHTML = text.replace(pattern, (matched) => {
                        const lowerTerm = matched.toLowerCase();
                        const definition = GLOSSARY[lowerTerm];
                        return `<span class="glossary-term" data-term="${matched}" data-def="${definition}">${matched}</span>`;
                    });
                    node.parentNode.replaceChild(span, node);
                }
            } else if (node.nodeType === 1 && node.childNodes && !['SCRIPT', 'STYLE', 'BUTTON', 'A'].includes(node.tagName)) {
                // Avoid injecting into interactive elements or scripts
                Array.from(node.childNodes).forEach(walk);
            }
        };

        walk(container);

        // Re-initialize glossary tooltips for the newly injected spans
        this.initGlossary();
    },

    initMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenuDiv = document.getElementById('mobile-menu');
        if (menuBtn && mobileMenuDiv) {
            menuBtn.addEventListener('click', () => {
                mobileMenuDiv.classList.toggle('active');
                menuBtn.setAttribute('aria-expanded', mobileMenuDiv.classList.contains('active'));
            });
        }
    },

    initScrollAnimations() {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    },

    initSkeletons() {
        const grid = document.querySelector('[data-skeleton="true"]');
        if (grid) {
            const count = parseInt(grid.dataset.skeletonCount || '3');
            grid.innerHTML = '';
            for (let i = 0; i < count; i++) {
                grid.innerHTML += `
                <div class="skeleton-card">
                    <div class="skeleton skeleton-thumb"></div>
                    <div class="skeleton skeleton-line short" style="margin-bottom:12px"></div>
                    <div class="skeleton skeleton-line long"></div>
                    <div class="skeleton skeleton-line medium"></div>
                </div>`;
            }
        }
    },

    initTilt() {
        document.querySelectorAll('.chapter-card, .artist-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
                const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
                card.style.transform = `perspective(800px) rotateX(${(-dy * 6).toFixed(2)}deg) rotateY(${(dx * 6).toFixed(2)}deg) scale(1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
            });
        });
    },

    initReadingProgress() {
        const bar = document.getElementById('reading-progress');
        if (bar) {
            window.addEventListener('scroll', () => {
                const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                bar.style.width = pct + '%';
            }, { passive: true });
        }
    },

    initGlossary() {
        const terms = document.querySelectorAll('.glossary-term');
        if (!terms.length) return;

        let tooltip = document.querySelector('.glossary-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'glossary-tooltip';
            document.body.appendChild(tooltip);
        }

        const position = (e) => {
            const pad = 12;
            const tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
            let x = e.clientX + pad, y = e.clientY - th / 2;
            if (x + tw > window.innerWidth) x = e.clientX - tw - pad;
            if (y < 0) y = pad;
            if (y + th > window.innerHeight) y = window.innerHeight - th - pad;
            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
        };

        terms.forEach(term => {
            term.addEventListener('mouseenter', (e) => {
                tooltip.innerHTML = `<span class="term-label">${term.dataset.term || term.textContent}</span>${term.dataset.def || ''}<div class="text-[10px] text-zinc-500 mt-2 border-t border-white/5 pt-2 flex items-center gap-1"><iconify-icon icon="solar:mouse-circle-linear" width="12"></iconify-icon> Cliquer pour voir tout</div>`;
                tooltip.classList.add('visible');
                position(e);
            });
            term.addEventListener('mousemove', position);
            term.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));

            // New click handler to open the global panel
            term.addEventListener('click', (e) => {
                const termText = (term.dataset.term || term.textContent).toLowerCase();
                this.openGlossaryPanel(termText);
            });
        });
    },

    openGlossaryPanel(searchQuery = '') {
        const fab = document.getElementById('glossary-fab');
        if (fab) fab.click(); // Trigger the existing open logic

        if (searchQuery) {
            const searchInput = document.getElementById('glossary-panel-search');
            if (searchInput) {
                searchInput.value = searchQuery;
                searchInput.dispatchEvent(new Event('input'));

                // Scroll to the first match in the panel
                setTimeout(() => {
                    const firstMatch = document.querySelector('#glossary-panel-content .mb-4');
                    if (firstMatch) firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 350);
            }
        }
    },

    initGlobalGlossaryPanel() {
        if (document.getElementById('global-glossary-panel')) return;

        // Ensure GLOSSARY data is available
        const glossaryData = typeof GLOSSARY !== 'undefined' ? GLOSSARY : [];

        // 1. Inject FAB (Floating Action Button)
        const fab = document.createElement('button');
        fab.id = 'glossary-fab';
        fab.className = 'fixed bottom-24 right-6 w-12 h-12 bg-amber-500 text-zinc-950 rounded-full flex items-center justify-center shadow-lg hover:bg-amber-400 transition-all z-40 focus:outline-none focus:ring-2 focus:ring-amber-300';
        fab.innerHTML = '<iconify-icon icon="solar:book-bookmark-bold" width="24"></iconify-icon>';
        fab.setAttribute('aria-label', 'Ouvrir le glossaire');
        document.body.appendChild(fab);

        // 2. Inject Panel HTML
        const panelHTML = `
            <div id="global-glossary-panel" class="fixed top-0 right-0 h-full w-full sm:w-96 bg-zinc-950/95 backdrop-blur-2xl border-l border-white/10 z-50 transform translate-x-full transition-transform duration-300 ease-out flex flex-col shadow-2xl">
                <div class="p-6 border-b border-white/10 flex items-center justify-between">
                    <h3 class="text-white text-lg font-medium flex items-center gap-2">
                        <iconify-icon icon="solar:book-bookmark-linear" class="text-amber-500"></iconify-icon>
                        Glossaire Rap & Musique
                    </h3>
                    <button id="close-glossary-panel" class="text-zinc-500 hover:text-white transition-colors">
                        <iconify-icon icon="solar:close-circle-linear" width="24"></iconify-icon>
                    </button>
                </div>
                <div class="p-4 border-b border-white/5 bg-zinc-900/30">
                    <div class="relative">
                        <iconify-icon icon="solar:magnifer-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" width="18"></iconify-icon>
                        <input type="text" id="glossary-panel-search" placeholder="Rechercher un terme..." class="w-full bg-zinc-950 border border-white/10 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-amber-500/50 transition-colors">
                    </div>
                </div>
                <div id="glossary-panel-content" class="flex-1 overflow-y-auto p-6 space-y-6">
                    <!-- Terms injected here -->
                </div>
            </div>
            <div id="glossary-panel-overlay" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 opacity-0 pointer-events-none transition-opacity duration-300"></div>
        `;
        document.body.insertAdjacentHTML('beforeend', panelHTML);

        const panel = document.getElementById('global-glossary-panel');
        const overlay = document.getElementById('glossary-panel-overlay');
        const closeBtn = document.getElementById('close-glossary-panel');
        const contentArea = document.getElementById('glossary-panel-content');
        const searchInput = document.getElementById('glossary-panel-search');

        // Populate logic
        const renderTerms = (termsToRender) => {
            if (termsToRender.length === 0) {
                contentArea.innerHTML = '<p class="text-zinc-500 text-sm text-center py-8">Aucun terme trouvé.</p>';
                return;
            }
            contentArea.innerHTML = termsToRender.map(item => `
                <div class="mb-4">
                    <h4 class="text-amber-400 font-medium text-base mb-1">${item.term}</h4>
                    <p class="text-zinc-400 text-sm leading-relaxed">${item.definition}</p>
                </div>
            `).join('');
        };

        renderTerms(glossaryData);

        // Search logic
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = glossaryData.filter(item =>
                item.term.toLowerCase().includes(query) ||
                item.definition.toLowerCase().includes(query)
            );
            renderTerms(filtered);
        });

        // Toggle logic
        const openPanel = () => {
            panel.classList.remove('translate-x-full');
            overlay.classList.remove('opacity-0', 'pointer-events-none');
        };

        const closePanel = () => {
            panel.classList.add('translate-x-full');
            overlay.classList.add('opacity-0', 'pointer-events-none');
        };

        fab.addEventListener('click', openPanel);
        closeBtn.addEventListener('click', closePanel);
        overlay.addEventListener('click', closePanel);
    },

    async initComments() {
        const blocks = document.querySelectorAll('.story-block');
        const songId = SongStoryRenderer.currentSong?.id;

        blocks.forEach(async (block, idx) => {
            const btn = block.querySelector('.comment-toggle-btn');
            const sec = block.querySelector('.comment-section');
            const blockTime = block.dataset.time;
            if (!btn || !sec) return;

            // Load comments
            let comments = [];
            if (window.ss_supabase) {
                const { data } = await window.ss_supabase
                    .from('comments')
                    .select('*')
                    .eq('song_id', songId)
                    .eq('block_time', blockTime)
                    .order('created_at', { ascending: true });
                comments = data || [];
            } else {
                // Fallback to local simulated data + local storage
                const localKey = `ss_comments_${songId}_${blockTime}`;
                comments = JSON.parse(localStorage.getItem(localKey) || '[]');
            }

            const renderComments = () => {
                sec.innerHTML = comments.map(c => `
                    <div class="comment-item">
                        <div class="comment-avatar">${(c.author || 'M')[0]}</div>
                        <div class="comment-body">
                            <div class="comment-author">${c.author || 'Utilisateur'}</div>
                            <div class="comment-text">${c.text}</div>
                        </div>
                    </div>`).join('') + `
                    <div class="comment-input-row">
                        <input type="text" placeholder="Votre interprétation…">
                        <button>Envoyer</button>
                    </div>`;

                const input = sec.querySelector('input');
                sec.querySelector('button')?.addEventListener('click', async () => {
                    const text = input.value.trim();
                    if (!text) return;

                    const newComment = {
                        author: 'Moi',
                        text: text,
                        song_id: songId,
                        block_time: blockTime,
                        created_at: new Date().toISOString()
                    };

                    if (window.ss_supabase) {
                        await window.ss_supabase.from('comments').insert([newComment]);
                    } else {
                        const localKey = `ss_comments_${songId}_${blockTime}`;
                        const localComments = JSON.parse(localStorage.getItem(localKey) || '[]');
                        localComments.push(newComment);
                        localStorage.setItem(localKey, JSON.stringify(localComments));
                    }

                    comments.push(newComment);
                    renderComments();
                });
            };

            renderComments();
            btn.addEventListener('click', (e) => { e.stopPropagation(); sec.classList.toggle('open'); });
        });
    },

    initShareCard() {
        const modal = document.getElementById('share-modal');
        const canvas = document.getElementById('share-canvas-preview');
        if (!modal || !canvas) return;

        const generate = async (quote, song, artist, imgSrc) => {
            const ctx = canvas.getContext('2d');
            const W = 1080, H = 1350; // Vertical format for Stories
            canvas.width = W; canvas.height = H;

            // 1. Draw Background Image (Blurred)
            if (imgSrc) {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                await new Promise(r => { img.onload = r; img.src = imgSrc; });

                // Draw and blur (simple stack blur-like effect)
                ctx.filter = 'blur(40px) brightness(0.4)';
                ctx.drawImage(img, -100, -100, W + 200, H + 200);
                ctx.filter = 'none';
            } else {
                const grad = ctx.createLinearGradient(0, 0, W, H);
                grad.addColorStop(0, '#09090b'); grad.addColorStop(1, '#18181b');
                ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
            }

            // 2. Glassmorphic Overlay
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.roundRect(80, 80, W - 160, H - 160, 40);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 3. Brand Watermark
            ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
            ctx.font = 'bold 32px Inter';
            ctx.fillText('SONGSTORY.', 140, 160);

            // 4. Quote Text
            ctx.fillStyle = '#fff';
            ctx.font = 'italic 500 56px Inter';

            let words = quote.split(' '), line = '', lines = [], maxW = W - 280;
            words.forEach(w => {
                if (ctx.measureText(line + w).width > maxW) { lines.push(line); line = w + ' '; }
                else line += w + ' ';
            });
            lines.push(line);

            const startY = H / 2 - (lines.length * 40);
            lines.forEach((l, i) => {
                ctx.fillText(l.trim(), 140, startY + i * 80);
            });

            // 5. Song Info
            ctx.font = '600 36px Inter';
            ctx.fillStyle = '#fbbf24';
            ctx.fillText(song, 140, H - 220);
            ctx.font = '400 28px Inter';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fillText(artist, 140, H - 180);
        };

        document.querySelectorAll('.share-quote-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const b = btn.closest('.story-block');
                const songTitle = document.getElementById('song-title')?.textContent || 'Song';
                const artistName = document.getElementById('song-meta')?.textContent.split('•')[0].trim() || 'Artist';
                const imgSrc = SongStoryRenderer.currentSong?.image || `Images/artists/${SongStoryRenderer.currentSong?.artistId}.jpg`;

                await generate(b?.querySelector('.lyrics-text')?.textContent || '', songTitle, artistName, imgSrc);
                modal.classList.add('open');
            });
        });

        document.getElementById('close-share-modal')?.addEventListener('click', () => modal.classList.remove('open'));
        document.getElementById('download-share-btn')?.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = canvas.toDataURL(); a.download = 'songstory.png'; a.click();
        });
    },

    initTheme() {
        const apply = (t) => {
            document.documentElement.setAttribute('data-theme', t);
            document.querySelectorAll('.theme-switch').forEach(sw => sw.setAttribute('aria-checked', t === 'light'));
        };
        const saved = localStorage.getItem('ss-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        apply(saved);

        document.querySelectorAll('.theme-switch').forEach(sw => {
            sw.addEventListener('click', () => {
                const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                apply(next); localStorage.setItem('ss-theme', next);
            });
        });
    },

    initLayout() {
        const apply = (layout) => {
            document.body.classList.remove('layout-classic', 'layout-immersive');
            document.body.classList.add(`layout-${layout}`);

            // Update toggle buttons if they exist
            document.querySelectorAll('.layout-switch').forEach(btn => {
                const icon = btn.querySelector('iconify-icon');
                if (icon) {
                    icon.setAttribute('icon', layout === 'classic' ? 'solar:maximize-linear' : 'solar:quit-full-screen-linear');
                }
                btn.title = layout === 'classic' ? 'Passer en mode Immersif' : 'Retour au mode Classique';
            });

            // If we switch to classic, we should make sure the analysis card is ready
            if (layout === 'classic' && typeof SongStoryPlayer !== 'undefined') {
                // Trigger a refresh of markers if needed
            }
        };

        // Default is classic as requested
        const saved = localStorage.getItem('ss-layout-pref') || 'classic';
        apply(saved);

        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.layout-switch');
            if (btn) {
                const current = document.body.classList.contains('layout-classic') ? 'classic' : 'immersive';
                const next = current === 'classic' ? 'immersive' : 'classic';
                apply(next);
                localStorage.setItem('ss-layout-pref', next);
            }
        });
    },

    setAccentColor(color) {
        const root = document.documentElement;
        if (!color) {
            root.style.removeProperty('--amber-400');
            root.style.removeProperty('--amber-500');
            return;
        }

        // Apply provided color
        root.style.setProperty('--amber-400', color);

        // Use a temporary div to get RGB values if color is in another format
        const temp = document.createElement('div');
        temp.style.color = color;
        document.body.appendChild(temp);
        const rgb = window.getComputedStyle(temp).color;
        document.body.removeChild(temp);

        // Set amber-500 as a slightly darker/more opaque version for consistent UI
        root.style.setProperty('--amber-500', rgb);

        // Inject a dynamic style for specific overrides if needed
        let dynamicStyle = document.getElementById('dynamic-accent-style');
        if (!dynamicStyle) {
            dynamicStyle = document.createElement('style');
            dynamicStyle.id = 'dynamic-accent-style';
            document.head.appendChild(dynamicStyle);
        }
        dynamicStyle.textContent = `
            ::selection { background-color: ${color}; color: #000; }
            .active-lyric { text-shadow: 0 0 30px ${color}; }
            .fav-toggle-btn.text-amber-500 { color: ${color} !important; }
        `;
    },

    initTOC() {
        const toc = document.getElementById('toc-sidebar');
        const headings = document.querySelectorAll('main h2[id], main h3[id]');
        if (!toc || headings.length < 2) return;

        toc.innerHTML = '<span class="toc-sidebar-label">Sections</span>' +
            Array.from(headings).map(h => `<a href="#${h.id}" class="toc-link">${h.textContent.replace(/[🎵🎤🎸🎹♪]\s*/, '').slice(0, 32)}</a>`).join('');

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    toc.querySelectorAll('.toc-link').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
                }
            });
        }, { rootMargin: '-20% 0px -60% 0px' });
        headings.forEach(h => obs.observe(h));

        toc.querySelectorAll('.toc-link').forEach(a => a.addEventListener('click', e => {
            e.preventDefault();
            document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({ behavior: 'smooth' });
        }));
    },

    initTransitions() {
        if (!('startViewTransition' in document)) return;
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a[href]');
            if (!a || a.href.startsWith('http') || a.href.includes('#') || a.target === '_blank') return;
            e.preventDefault();
            document.startViewTransition(() => { window.location.href = a.href; });
        });
    }
};
