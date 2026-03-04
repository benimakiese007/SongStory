const fs = require('fs');
const path = require('path');

const songsDir = path.join(__dirname, 'songs');
const files = fs.readdirSync(songsDir).filter(f => f.endsWith('.html'));

const NAV_ACTIONS_REPLACEMENT = `                <div class="flex items-center gap-3">
                    <button class="search-trigger text-zinc-400 hover:text-white transition-colors" aria-label="Recherche">
                        <iconify-icon icon="solar:magnifer-linear" width="20"></iconify-icon>
                    </button>
                    <button class="theme-switch" aria-label="Passer en mode clair" role="switch" aria-checked="false">
                        <div class="switch-thumb">
                            <iconify-icon icon="solar:sun-bold" class="sun-icon"></iconify-icon>
                            <iconify-icon icon="solar:moon-bold" class="moon-icon"></iconify-icon>
                        </div>
                    </button>
                    <div class="nav-auth-slot"></div>
                    <button id="mobile-menu-btn" class="text-zinc-400 md:hidden" aria-label="Menu">
                        <iconify-icon icon="solar:hamburger-menu-linear" width="24"></iconify-icon>
                    </button>
                </div>`;

files.forEach(file => {
    let content = fs.readFileSync(path.join(songsDir, file), 'utf8');
    const songId = file.replace('.html', '');

    // 1. Cleanup old buttons and standardize nav actions
    // Find the container: <div class="flex items-center gap-3"> ... </div> before </nav>
    const navRegex = /<div class="flex items-center gap-3">[\s\S]*?<\/div>[\s\S]*?<\/nav>/;
    content = content.replace(navRegex, (match) => {
        return NAV_ACTIONS_REPLACEMENT + '\n            </div>\n        </div>\n    </nav>';
    });

    // 2. Ensure scripts are correct
    const scriptsBlock = `    <script src="../js/data.js"></script>
    <script src="../js/auth.js"></script>
    <script src="../js/pwa.js"></script>
    <script src="../js/spotify.js"></script>
    <script src="../js/applemusic.js"></script>
    <script src="../js/streaming.js"></script>
    <script src="../js/contribute.js"></script>
    <script src="../js/app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const songId = '${songId}';
            const songData = typeof SONGS_DATA !== 'undefined' ? SONGS_DATA.find(s => s.id === songId) : null;
            if (songData && typeof SongStoryStreaming !== 'undefined') {
                SongStoryStreaming.initUnifiedPlayer(songData);
            }
        });
    </script>
</body>`;

    // Remove all existing script tags at the bottom and the closing body tag
    content = content.replace(/<script src="\.\.\/js\/data\.js">[\s\S]*?<\/body>/, scriptsBlock);

    // Fallback if the first replace failed (e.g. if one was already injected or manually edited)
    if (!content.includes('streaming.js')) {
        content = content.replace(/<script[\s\S]*?<\/body>/, scriptsBlock);
    }

    fs.writeFileSync(path.join(songsDir, file), content, 'utf8');
    console.log(`Normalized ${file}`);
});
