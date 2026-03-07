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

        // Prevent reloading the exact same page
        const currentPath = window.location.pathname + window.location.search;
        let newPath = link.pathname + link.search;

        // Handle relative paths (e.g., 'library.html' vs '/library.html')
        // For local file testing or simple server
        if (href && !href.startsWith('/')) {
            const pathParts = window.location.pathname.split('/');
            pathParts.pop(); // remove current file
            newPath = pathParts.join('/') + '/' + href;
        }

        if (newPath === currentPath) return;

        await this.loadPage(newPath, true);
    },

    async loadPage(path, pushToHistory = true) {
        try {
            // Show loading state on main container
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.style.opacity = '0.5';
                mainContent.style.transition = 'opacity 0.2s';
            }

            // Fetch the new page
            // Note: In development/local servers, this path resolution might need adjustment depending on the root
            const response = await fetch(path);
            if (!response.ok) throw new Error('Network response was not ok');

            const htmlText = await response.text();

            // Parse the HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            // Replace <main> content
            const newMain = doc.querySelector('main');
            if (mainContent && newMain) {
                mainContent.innerHTML = newMain.innerHTML;
                mainContent.className = newMain.className; // Transfer classes too
                mainContent.style.opacity = '1';
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

        } catch (error) {
            console.error('SPA Navigation Error:', error);
            // Fallback to standard navigation on error
            window.location.href = path;
        }
    },

    reinitScripts(path) {
        // We need to re-attach UI event listeners for the new DOM elements inside <main>
        if (typeof SongStoryUI !== 'undefined') {
            // Re-init generic UI (tilt, reveals)
            SongStoryUI.init();
        }

        // Specific page scripts
        if (path.includes('single-song.html')) {
            // Because single-song relies on URL params, and we just updated the URL,
            // we can safely call the render script if it's available globally.
            if (typeof renderSong === 'function') {
                renderSong();
            }
            // Reattach analysis click events
            this._attachAnalysisEvents();
        } else if (path.includes('library.html') || path.includes('artists.html')) {
            // Reattach filters if necessary
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
