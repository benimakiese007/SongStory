/**
 * SongStory — Dynamic Artists Counter
 */

document.addEventListener('DOMContentLoaded', () => {
    updateArtistCounts();
});

function updateArtistCounts() {
    if (typeof SONGS_DATA === 'undefined') {
        console.error('SONGS_DATA is not defined. Make sure data.js is loaded.');
        return;
    }

    const artistCards = document.querySelectorAll('.artist-card');
    
    artistCards.forEach(card => {
        const href = card.getAttribute('href');
        if (!href) return;

        // Extract artist_id from href (e.g., "artists/kendrick-lamar.html" -> "kendrick-lamar")
        const artistId = href.split('/').pop().replace('.html', '');
        
        // Count songs for this artist
        // Note: Some songs might use artist_id and others artistId in the current data.js structure
        const count = SONGS_DATA.filter(song => 
            (song.artist_id === artistId) || (song.artistId === artistId)
        ).length;

        // Update the count in the card
        const countSpan = card.querySelector('span');
        if (countSpan) {
            const label = count > 1 ? 'analyses disponibles' : 'analyse disponible';
            countSpan.textContent = `${count} ${label}`;
        }
    });
}
