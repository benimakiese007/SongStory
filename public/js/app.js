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

    // 4. Analysis Block Highlights (Specific to Song Pages)
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
