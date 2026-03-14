/**
 * SongStory SPA Router
 * Intercepts internal links to load page content dynamically,
 * preserving the global Audio Player state.
 */

const SongStoryRouter = {
    init() {
        // Intercept clicks on links
        document.body.addEventListener('click', this.handleNavigate.bind(this));

        // Handle Back/Forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.path) {
                this.loadPage(e.state.path, false);
            } else {
                this.loadPage(window.location.pathname + window.location.search, false);
            }
        });

        // Store initial state
        history.replaceState({ path: window.location.pathname + window.location.search }, '', window.location.href);
    },

    async handleNavigate(e) {
        // Find closest anchor tag
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Ignore external links, anchor links, or specifically marked links
        if (href.startsWith('http') || href.startsWith('#') || link.dataset.noRouter === 'true' || link.target === '_blank') {
            return;
        }

        e.preventDefault();
        e.stopPropagation(); // Prevent initTransitions from also handling this click

        // Prevent reloading the exact same page
        const normalize = p => p.replace('.html', '').replace(/\/$/, '') || '/';
        const currentPath = normalize(window.location.pathname);
        const newPathRaw = link.pathname + link.search;
        const newPathNormalized = normalize(link.pathname);

        if (newPathNormalized === currentPath) return;

        await this.loadPage(newPathRaw, true);
    },

    async loadPage(path, pushToHistory = true) {
        try {
            const mainContent = document.querySelector('main');
            
            // Immediate visual feedback on click
            if (mainContent) {
                mainContent.style.transition = 'opacity 0.2s ease, filter 0.2s ease';
                mainContent.style.opacity = '0.6';
                mainContent.style.filter = 'blur(2px)';
            }
            
            // Fetch the new page
            const response = await fetch(path);
            if (!response.ok) throw new Error('Network response was not ok');

            const htmlText = await response.text();

            // Parse the HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            const updateDOM = () => {
                // Replace <main> content
                const newMain = doc.querySelector('main');
                if (mainContent && newMain) {
                    mainContent.innerHTML = newMain.innerHTML;
                    mainContent.className = newMain.className;
                    // Reset inline styles
                    mainContent.style.transition = 'none';
                    mainContent.style.opacity = '1';
                    mainContent.style.filter = 'none';
                }

                // Replace <nav> content (to update active link highlight)
                const currentNav = document.querySelector('nav');
                const newNav = doc.querySelector('nav');
                if (currentNav && newNav) {
                    currentNav.innerHTML = newNav.innerHTML;
                }

                // Replace #mobile-menu content
                const currentMobile = document.getElementById('mobile-menu');
                const newMobile = doc.getElementById('mobile-menu');
                if (currentMobile && newMobile) {
                    currentMobile.innerHTML = newMobile.innerHTML;
                }

                // Replace <title>
                document.title = doc.title;

                // Re-trigger specific scripts based on the page loaded
                this.reinitScripts(path);

                // Update URL
                if (pushToHistory) {
                    history.pushState({ path: path }, '', path);
                }

                // Scroll to top
                window.scrollTo(0, 0);
            };

            // Fluid Transition using modern View Transitions API
            if (document.startViewTransition) {
                // Restore purely to capture a clean initial state
                if (mainContent) {
                    mainContent.style.transition = 'none';
                    mainContent.style.opacity = '1';
                    mainContent.style.filter = 'none';
                }
                document.startViewTransition(() => updateDOM());
            } else {
                // Snappy fallback transition
                if (mainContent) {
                    mainContent.style.transition = 'opacity 0.15s ease-out';
                    mainContent.style.opacity = '0';
                }
                setTimeout(() => {
                    updateDOM();
                    if (mainContent) {
                        mainContent.style.transition = 'opacity 0.2s ease-in';
                        mainContent.style.opacity = '1';
                    }
                }, 150);
            }

        } catch (error) {
            console.error('SPA Navigation Error:', error);
            // Fallback to standard navigation on error
            window.location.href = path;
        }
    },

    reinitScripts(path) {
        // We need to re-attach UI event listeners for the new DOM elements inside <main>
        if (typeof SongStoryUI !== 'undefined') {
            // Re-init generic UI (tilt, reveals, mobile menu, theme switch)
            SongStoryUI.init();
        }

        // Re-init search triggers for new nav elements
        if (typeof SongStorySearch !== 'undefined') {
            SongStorySearch.init();
        }

        // Re-inject the auth button (Connexion / avatar) into the new nav
        if (typeof SongStoryAuth !== 'undefined') {
            SongStoryAuth.initNavUI();
        }

        // Unified Page Initialization
        if (typeof SongStoryApp !== 'undefined' && typeof SongStoryApp.initPage === 'function') {
            SongStoryApp.initPage(path);
        }

        // Additional song-specific legacy triggers
        if (path.includes('/songs/') || path.includes('single-song.html')) {
            this._attachAnalysisEvents();
        }
    },

    _attachAnalysisEvents() {
        const storyBlocks = document.querySelectorAll('.story-block');
        const analysisCard = document.getElementById('dynamic-analysis-card');
        const analysisPlaceholder = document.getElementById('analysis-placeholder');

        storyBlocks.forEach(block => {
            const lyricsText = block.querySelector('.lyrics-text');
            if (!lyricsText) return;

            lyricsText.classList.add('interactive');
            lyricsText.addEventListener('click', () => {
                const analysisContent = block.querySelector('.analysis-content')?.innerHTML;
                if (analysisCard && analysisPlaceholder && analysisContent) {
                    analysisCard.style.opacity = '0';
                    analysisCard.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        analysisPlaceholder.innerHTML = analysisContent;
                        analysisCard.style.opacity = '1';
                        analysisCard.style.transform = 'translateY(0)';
                    }, 300);
                }
                storyBlocks.forEach(b => b.querySelector('.lyrics-text')?.classList.remove('text-white', 'font-medium'));
                lyricsText.classList.add('text-white', 'font-medium');
            });
        });
    }
};
