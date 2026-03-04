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
        this.initTOC();
        this.initTransitions();
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
                tooltip.innerHTML = `<span class="term-label">${term.dataset.term || term.textContent}</span>${term.dataset.def || ''}`;
                tooltip.classList.add('visible');
                position(e);
            });
            term.addEventListener('mousemove', position);
            term.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
        });
    },

    initComments() {
        const blocks = document.querySelectorAll('.story-block');
        const SIMULATED = [
            { author: 'M.B.', text: 'Cette image est tellement forte.' },
            { author: 'A.L.', text: 'Exactement ce que je ressentais.' },
            { author: 'T.D.', text: 'Le contraste est saisissant.' },
            { author: 'C.R.', text: 'Genius level.' }
        ];

        blocks.forEach((block, idx) => {
            const btn = block.querySelector('.comment-toggle-btn');
            const sec = block.querySelector('.comment-section');
            if (!btn || !sec) return;

            const picks = SIMULATED.slice(idx % SIMULATED.length, (idx % SIMULATED.length) + 2);
            sec.innerHTML = picks.map(c => `
                <div class="comment-item">
                    <div class="comment-avatar">${c.author[0]}</div>
                    <div class="comment-body">
                        <div class="comment-author">${c.author}</div>
                        <div class="comment-text">${c.text}</div>
                    </div>
                </div>`).join('') + `
                <div class="comment-input-row">
                    <input type="text" placeholder="Votre interprétation…">
                    <button>Envoyer</button>
                </div>`;

            const input = sec.querySelector('input');
            sec.querySelector('button')?.addEventListener('click', () => {
                if (!input.value.trim()) return;
                const div = document.createElement('div');
                div.className = 'comment-item';
                div.innerHTML = `<div class="comment-avatar">M</div><div class="comment-body"><div class="comment-author">Vous</div><div class="comment-text">${input.value}</div></div>`;
                sec.insertBefore(div, sec.querySelector('.comment-input-row'));
                input.value = '';
            });

            btn.addEventListener('click', (e) => { e.stopPropagation(); sec.classList.toggle('open'); });
        });
    },

    initShareCard() {
        const modal = document.getElementById('share-modal');
        const canvas = document.getElementById('share-canvas-preview');
        if (!modal || !canvas) return;

        const generate = (quote, song, artist) => {
            const ctx = canvas.getContext('2d');
            const W = 1080, H = 566;
            canvas.width = W; canvas.height = H;
            const grad = ctx.createLinearGradient(0, 0, W, H);
            grad.addColorStop(0, '#09090b'); grad.addColorStop(1, '#18181b');
            ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#fbbf24'; ctx.fillRect(60, H / 2 - 50, 3, 100);
            ctx.fillStyle = '#fff'; ctx.font = '500 32px Inter, sans-serif';

            let words = quote.split(' '), line = '', lines = [], maxW = W - 180;
            words.forEach(w => {
                if (ctx.measureText(line + w).width > maxW) { lines.push(line); line = w + ' '; }
                else line += w + ' ';
            });
            lines.push(line);
            lines.forEach((l, i) => ctx.fillText(l.trim(), 80, (H / 2 - (lines.length * 22)) + i * 44));

            ctx.font = '400 18px Inter'; ctx.fillStyle = '#fbbf24';
            ctx.fillText(`${song} — ${artist}`, 80, H - 72);
        };

        document.querySelectorAll('.share-quote-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const b = btn.closest('.story-block');
                generate(b?.querySelector('.lyrics-text')?.textContent || '', document.querySelector('h1')?.textContent || '', document.querySelector('.text-zinc-500')?.textContent || '');
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
