const fs = require('fs');
const path = require('path');

function injectFavoriteButtons(filePath, isSongSubdir) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Regex to find chapter-cards and extract their link to get the song ID
    // <a href="songs/bohemian-rhapsody.html" class="... chapter-card ...">
    const cardRegex = /<a href="([^"]+\/)?([^"\/]+)\.html" class="[^"]*chapter-card[^"]*"/g;

    let newContent = content.replace(cardRegex, (match, subdir, songId) => {
        // Only inject if not already there
        if (match.includes('favorite-toggle-btn')) return match;

        const btn = `\n                    <button class="favorite-toggle-btn absolute top-4 right-4 z-20 text-zinc-500 hover:text-amber-400 transition-colors" data-id="${songId}" title="Ajouter aux favoris">\n                        <iconify-icon icon="solar:heart-linear" width="20"></iconify-icon>\n                    </button>`;
        return match + btn;
    });

    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Injected favorite buttons into ${path.basename(filePath)}`);
}

injectFavoriteButtons(path.join(__dirname, 'library.html'), false);
injectFavoriteButtons(path.join(__dirname, 'index.html'), false);
