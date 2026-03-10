const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // API: Get current data
    if (req.url === '/api/data' && req.method === 'GET') {
        try {
            const dataPath = path.join(__dirname, 'js', 'data.js');
            const content = fs.readFileSync(dataPath, 'utf-8');

            // Use Function constructor to safely evaluate the data.js file content
            // We want to extract SONGS_DATA, ARTISTS_DATA, and GLOSSARY
            const virtualGlobal = {};
            const script = content.replace(/window\./g, 'virtualGlobal.').replace(/let /g, 'var ');
            eval(script); // var SONGS_DATA = ...

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                songs: typeof SONGS_DATA !== 'undefined' ? SONGS_DATA : [],
                artists: typeof ARTISTS_DATA !== 'undefined' ? ARTISTS_DATA : [],
                glossary: typeof GLOSSARY !== 'undefined' ? GLOSSARY : {}
            }));
        } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end(JSON.stringify({ error: err.message }));
        }
    }
    // API: Save data and update HTML cards
    else if (req.url === '/api/save-song' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { song, songs, artists, glossary } = JSON.parse(body);

                // 1. Update data.js
                const dataPath = path.join(__dirname, 'js', 'data.js');
                let content = `/**\n * SongStory — Static-First Data Layer\n */\n\n`;
                content += `let SONGS_DATA = ${JSON.stringify(songs, null, 4)};\n\n`;
                content += `let ARTISTS_DATA = ${JSON.stringify(artists, null, 4)};\n\n`;
                content += `let GLOSSARY = ${JSON.stringify(glossary || {}, null, 4)};\n\n`;
                content += `window.loadAppDataFromSupabase = async () => console.log('Static mode enabled - No Supabase sync needed.');\n`;
                fs.writeFileSync(dataPath, content, 'utf-8');

                // 2. Update Static Cards in index.html, library.html, and artists.html if needed
                // For now, we update the HTML files sequentially
                if (song) updateStaticCards(song);
                if (artists) {
                    updateArtistCards(artists);
                    artists.forEach(artist => updateIndividualArtistPage(artist));
                }

                res.writeHead(200);
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                console.error(err);
                res.writeHead(500);
                res.end(JSON.stringify({ error: err.message }));
            }
        });
    }
    // API: Upload Cover
    else if (req.url === '/api/upload-cover' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { filename, base64 } = JSON.parse(body);
                // Unified cover storage
                const coverDir = path.join(__dirname, 'Images', 'Title Cover');
                if (!fs.existsSync(coverDir)) fs.mkdirSync(coverDir, { recursive: true });

                const filePath = path.join(coverDir, filename);
                const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
                fs.writeFileSync(filePath, base64Data, 'base64');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ url: `Images/Title Cover/${filename}` }));
            } catch (err) {
                console.error(err);
                res.writeHead(500);
                res.end(JSON.stringify({ error: err.message }));
            }
        });
    }
    // API: List Covers
    else if (req.url === '/api/list-covers' && req.method === 'GET') {
        try {
            const coverDir = path.join(__dirname, 'Images', 'Title Cover');
            if (!fs.existsSync(coverDir)) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify([]));
                return;
            }
            const files = fs.readdirSync(coverDir).filter(f => /\.(webp|png|jpg|jpeg|gif)$/i.test(f));
            const covers = files.map(f => ({
                filename: f,
                url: `Images/Title Cover/${f}`
            }));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(covers));
        } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end(JSON.stringify({ error: err.message }));
        }
    }
    // API: List Profile Pictures
    else if (req.url === '/api/list-pp' && req.method === 'GET') {
        try {
            const ppDir = path.join(__dirname, 'Images', 'Profile Picture - Artist');
            if (!fs.existsSync(ppDir)) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify([]));
                return;
            }
            const files = fs.readdirSync(ppDir).filter(f => /\.(webp|png|jpg|jpeg|gif)$/i.test(f));
            const pps = files.map(f => ({
                filename: f,
                url: `Images/Profile Picture - Artist/${f}`
            }));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(pps));
        } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end(JSON.stringify({ error: err.message }));
        }
    }
    // API: Delete Profile Picture
    else if (req.url === '/api/delete-pp' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { filename } = JSON.parse(body);
                const filePath = path.join(__dirname, 'Images', 'Profile Picture - Artist', filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                res.writeHead(200);
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                console.error(err);
                res.writeHead(500);
                res.end(JSON.stringify({ error: err.message }));
            }
        });
    }
    // API: Upload Artist Photo
    else if (req.url === '/api/upload-artist' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { filename, base64 } = JSON.parse(body);
                // Unified artist storage
                const artistDir = path.join(__dirname, 'Images', 'Profile Picture - Artist');
                if (!fs.existsSync(artistDir)) fs.mkdirSync(artistDir, { recursive: true });

                const filePath = path.join(artistDir, filename);
                const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
                fs.writeFileSync(filePath, base64Data, 'base64');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ url: `Images/Profile Picture - Artist/${filename}` }));
            } catch (err) {
                console.error(err);
                res.writeHead(500);
                res.end(JSON.stringify({ error: err.message }));
            }
        });
    }
    // API: Delete Cover
    else if (req.url === '/api/delete-cover' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { filename } = JSON.parse(body);
                const filePath = path.join(__dirname, 'Images', 'Title Cover', filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                res.writeHead(200);
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                console.error(err);
                res.writeHead(500);
                res.end(JSON.stringify({ error: err.message }));
            }
        });
    }
    else {
        res.writeHead(404);
        res.end();
    }
});

function updateStaticCards(song) {
    const files = ['index.html', 'library.html'];

    files.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (!fs.existsSync(filePath)) return;

        let content = fs.readFileSync(filePath, 'utf-8');

        // Generate the new card HTML
        const isHome = file === 'index.html';
        const cardHtml = isHome ? generateHomeCard(song) : generateLibraryCard(song);

        // Look for the comment marking where to inject or replace
        const commentTag = `<!-- ${song.title} -->`;
        const regex = new RegExp(`${commentTag}[\\s\\S]*?<!-- End ${song.title} -->`, 'g');

        if (content.includes(commentTag)) {
            // Replace existing card
            content = content.replace(regex, `${commentTag}\n${cardHtml}\n                <!-- End ${song.title} -->`);
        } else {
            // Append to the list if tag doesn't exist? 
            // Better to let user place the tag once manually if it's a new song.
        }

        fs.writeFileSync(filePath, content, 'utf-8');
    });
}

function updateArtistCards(artists) {
    const filePath = path.join(__dirname, 'artists.html');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf-8');

    artists.forEach(artist => {
        const cardHtml = generateArtistCard(artist);
        const commentTag = `<!-- Artist: ${artist.id} -->`;
        const regex = new RegExp(`${commentTag}[\\s\\S]*?<!-- End Artist: ${artist.id} -->`, 'g');

        if (content.includes(commentTag)) {
            content = content.replace(regex, `${commentTag}\n${cardHtml}\n                <!-- End Artist: ${artist.id} -->`);
        }
    });

    fs.writeFileSync(filePath, content, 'utf-8');
}

function updateIndividualArtistPage(artist) {
    if (!artist.id) return;
    const filePath = path.join(__dirname, 'artists', `${artist.id}.html`);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf-8');

    let avatarHtml;
    if (artist.photo_url) {
        avatarHtml = `                <div class="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center border border-white/10 shadow-xl overflow-hidden shrink-0 mx-auto mb-6">
                    <img src="../${artist.photo_url}" alt="${artist.name}" class="w-full h-full object-cover">
                </div>`;
    } else {
        avatarHtml = `                <div class="w-32 h-32 md:w-40 md:h-40 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 shrink-0 mx-auto mb-6">
                    <iconify-icon icon="solar:user-bold" class="text-zinc-700" width="60"></iconify-icon>
                </div>`;
    }

    const artistInfoHtml = `            <div class="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
${avatarHtml}
                <h1 class="text-4xl md:text-6xl text-white font-medium tracking-tighter mb-3">${artist.name}</h1>
                <p class="text-lg text-zinc-500 font-light mb-6">${artist.genre} • ${artist.country}</p>
                <p class="text-base text-zinc-400 leading-relaxed">${artist.bio || ''}</p>
            </div>`;


    const startTag = '<!-- ARTIST_INFO_START -->';
    const endTag = '<!-- ARTIST_INFO_END -->';
    const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, 'g');

    if (content.match(regex)) {
        content = content.replace(regex, `${startTag}\n${artistInfoHtml}\n            ${endTag}`);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated statically: ${filePath}`);
    }
}

function generateArtistCard(artist) {
    let avatarHtml;
    if (artist.photo_url) {
        avatarHtml = `                        <div class="artist-avatar" style="width:64px;height:64px;margin-bottom:0;overflow:hidden;">
                            <img src="${artist.photo_url}" alt="${artist.name}" class="w-full h-full object-cover">
                        </div>`;
    } else {
        avatarHtml = `                        <div class="artist-avatar" style="width:64px;height:64px;margin-bottom:0;">
                            <iconify-icon icon="solar:user-bold"
                                class="text-zinc-600 group-hover:text-amber-400 transition-colors"
                                width="28"></iconify-icon>
                        </div>`;
    }

    return `                <a href="artists/${artist.id}.html"
                    class="reveal visible artist-card group bg-zinc-900/30 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900/50 hover:border-white/10 transition-all"
                    style="text-decoration:none;">
                    <div class="flex items-center gap-4 mb-4">
${avatarHtml}
                        <div>
                            <h3 class="text-white font-medium text-lg group-hover:text-amber-400 transition-colors">
                                ${artist.name}</h3>
                            <p class="text-zinc-500 text-sm">${artist.genre} · ${artist.country}</p>
                        </div>
                    </div>
                    <p class="text-zinc-500 text-sm leading-relaxed mb-4">${artist.bio || ''}</p>
                    <div class="flex items-center justify-between text-xs text-zinc-600">
                        <span>${artist.songs ? artist.songs.length : 0} analyse(s) disponible(s)</span>
                        <iconify-icon icon="solar:arrow-right-linear"
                            class="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            width="16"></iconify-icon>
                    </div>
                </a>`;
}

function generateLibraryCard(song) {
    const songUrl = `songs/${song.id}.html`;
    
    let coverHtml;
    if (song.cover_url) {
        coverHtml = `                    <div class="aspect-video w-full mb-4 overflow-hidden rounded-xl border border-white/5 bg-zinc-900">
                        <img src="${song.cover_url}" alt="${song.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    </div>`;
    } else {
        coverHtml = `                    <div class="w-full aspect-square bg-zinc-800 rounded-xl mb-4 overflow-hidden flex items-center justify-center border border-white/5">
                        <iconify-icon icon="solar:music-note-linear" class="text-zinc-700 opacity-50" width="48"></iconify-icon>
                    </div>`;
    }

    return `                <a href="${songUrl}"
                    class="song-card reveal visible group bg-zinc-900/30 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900/50 hover:border-white/10 transition-all"
                    data-genre="${song.genre}" data-tags="${song.tags ? song.tags.join(',') : ''}">
${coverHtml}
                    <div class="flex items-center justify-between mb-4">
                        <div
                            class="px-2 py-1 rounded-md bg-amber-400/10 text-amber-400 text-[10px] font-medium uppercase tracking-wider">
                            ${song.genre}</div>
                        <span class="text-zinc-600 text-[10px] font-medium">${song.year}</span>
                    </div>
                    <h3
                        class="text-white font-medium text-lg leading-tight group-hover:text-amber-400 transition-colors mb-1">
                        ${song.title}</h3>
                    <p class="text-zinc-500 text-sm mb-4">${song.artist_id || song.artist}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${(song.tags || []).map(t => `<span class="px-2 py-0.5 rounded-full bg-zinc-800/50 text-zinc-500 text-[10px]">${t}</span>`).join('\n                        ')}
                    </div>
                    <div class="flex items-center justify-between pt-4 border-t border-white/5">
                        <span class="text-[10px] text-zinc-600">${song.duration || '--'}</span>
                        <iconify-icon icon="solar:play-bold"
                            class="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            width="16"></iconify-icon>
                    </div>
                </a>`;
}

function generateHomeCard(song) {
    const songUrl = `songs/${song.id}.html`;
    
    let coverHtml;
    if (song.cover_url) {
        coverHtml = `<img src="${song.cover_url}" alt="${song.title} Cover" class="w-full h-full object-cover">`;
    } else {
        coverHtml = `<iconify-icon icon="solar:music-note-linear" class="text-zinc-700 opacity-50" width="48"></iconify-icon>`;
    }

    return `                    <article onclick="window.location.href='${songUrl}'"
                        class="reveal chapter-card visible group relative flex flex-col items-start justify-between p-4 rounded-2xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 hover:border-white/10 transition-all cursor-pointer">
                        <div
                            class="w-full aspect-[16/9] bg-zinc-900 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center border border-white/5">
                            ${coverHtml}
                            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent"></div>
                            <div class="absolute bottom-3 left-3 flex gap-2">
                                <span
                                    class="bg-zinc-950/80 backdrop-blur text-white text-xs px-2 py-1 rounded-md border border-white/10">${song.genre}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                            <span>${song.artist_id || song.artist}</span><span>•</span><span>${song.year}</span>
                        </div>
                        <h3
                            class="text-lg text-white font-medium tracking-tight mb-2 group-hover:text-amber-400 transition-colors leading-snug">
                            ${song.title}</h3>
                        <p class="text-sm text-zinc-400 line-clamp-2 leading-relaxed">${song.description || ''}</p>
                    </article>`;
}

server.listen(PORT, () => console.log(`CMS Server running on http://localhost:${PORT}`));
