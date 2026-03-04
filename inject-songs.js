const fs = require('fs');
const path = require('path');

const songsDir = path.join(__dirname, 'songs');
const files = fs.readdirSync(songsDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(songsDir, file), 'utf8');

    // 1. PWA Meta
    if (!content.includes('manifest.json')) {
        content = content.replace(
            '<link rel="stylesheet" href="../css/style.css">',
            '<link rel="stylesheet" href="../css/style.css">\n    <link rel="manifest" href="../manifest.json">\n    <meta name="theme-color" content="#09090b">'
        );
    }

    // 2. Timeline Link
    if (!content.includes('href="../timeline.html"')) {
        content = content.replace(
            '<a href="../artists.html"\r\n                            class="text-zinc-400 text-sm hover:text-white transition-colors">Artistes</a>',
            '<a href="../artists.html"\r\n                            class="text-zinc-400 text-sm hover:text-white transition-colors">Artistes</a>\r\n                        <a href="../timeline.html"\r\n                            class="text-zinc-400 text-sm hover:text-white transition-colors">Timeline</a>'
        );
        content = content.replace(
            '<a href="../artists.html"\n                            class="text-zinc-400 text-sm hover:text-white transition-colors">Artistes</a>',
            '<a href="../artists.html"\n                            class="text-zinc-400 text-sm hover:text-white transition-colors">Artistes</a>\n                        <a href="../timeline.html"\n                            class="text-zinc-400 text-sm hover:text-white transition-colors">Timeline</a>'
        );

        // Mobile menu
        content = content.replace(
            '<a href="../artists.html" class="text-zinc-400 text-lg hover:text-white transition-colors">Artistes</a>',
            '<a href="../artists.html" class="text-zinc-400 text-lg hover:text-white transition-colors">Artistes</a>\n            <a href="../timeline.html" class="text-zinc-400 text-lg hover:text-white transition-colors">Timeline</a>'
        );
    }

    // 3. Nav auth slot
    if (!content.includes('nav-auth-slot')) {
        content = content.replace(
            '<button\r\n                        class="hidden sm:flex items-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 transition-colors px-4 py-1.5 rounded-full text-sm font-medium">S\'abonner</button>',
            '<div class="nav-auth-slot"></div>'
        );
        content = content.replace(
            '<button\n                        class="hidden sm:flex items-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 transition-colors px-4 py-1.5 rounded-full text-sm font-medium">S\'abonner</button>',
            '<div class="nav-auth-slot"></div>'
        );
    }

    // 4. Contribute Button Button Bottom Page
    if (!content.includes('Suggérer une correction')) {
        content = content.replace(
            '<!-- Recommendations -->',
            `<!-- Contribute -->
            <div class="mt-16 text-center border-t border-white/5 pt-12 pb-8">
                <p class="text-zinc-500 text-sm mb-4">Une erreur dans les paroles ou l'analyse ? Vous avez une anecdote inédite ?</p>
                <a href="../contribute.html?song=${file.replace('.html', '')}" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm font-medium hover:bg-zinc-800 transition-colors">
                    <iconify-icon icon="solar:pen-new-round-linear" width="18"></iconify-icon>
                    Suggérer une correction
                </a>
            </div>

            <!-- Recommendations -->`
        );
    }

    // 5. Scripts at the bottom + Spotify Init
    if (!content.includes('spotify.js')) {
        const scriptInjection = `    <script src="../js/data.js"></script>
    <script src="../js/auth.js"></script>
    <script src="../js/pwa.js"></script>
    <script src="../js/spotify.js"></script>
    <script src="../js/contribute.js"></script>
    <script src="../js/app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const songId = '${file.replace('.html', '')}';
            const songData = typeof SONGS_DATA !== 'undefined' ? SONGS_DATA.find(s => s.id === songId) : null;
            if (songData && songData.spotifyId && typeof SongStorySpotify !== 'undefined') {
                SongStorySpotify.initSongPage(songData.spotifyId);
            }
        });
    </script>
</body>`;
        content = content.replace(
            /    <script src="\.\.\/js\/data\.js"><\/script>\r?\n    <script src="\.\.\/js\/app\.js"><\/script>\r?\n<\/body>/,
            scriptInjection
        );
    }

    // 6. Fix any duplicated buttons introduced inadvertently
    content = content.replace(/<button class="theme-toggle-btn" aria-label="Passer en mode clair">\?<\/button>\r\n                    <button class="theme-toggle-btn" aria-label="Passer en mode clair">\?<\/button>\r\n/g, '<button class="theme-toggle-btn" aria-label="Passer en mode clair">?</button>\r\n');

    fs.writeFileSync(path.join(songsDir, file), content, 'utf8');
    console.log(`Updated ${file}`);
});
