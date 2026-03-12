/**
 * SongStory — Main Entry Point
 * Orchestrates module initialization.
 */

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

    // 5. Dynamic Artist Songs (on Artist Pages)
    const handleArtistPage = () => {
        const path = window.location.pathname;
        if (path.includes('/artists/')) {
            const filename = path.split('/').pop().replace('.html', '');
            
            // Resolve the true artist_id from ARTISTS_DATA using the url field
            // e.g. url: "artists/tupac-shakur.html" maps to id: "2pac"
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
        }
    };

    // Trigger immediately if data might already be there (static fallback)
    handleArtistPage();

    // Also trigger when Supabase data is ready
    window.addEventListener('ss:dataready', handleArtistPage);

    // 6. Analysis Block Highlights (Specific to Song Pages)
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
});
