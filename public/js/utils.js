/**
 * SongStory — Shared Utilities & Templates
 */

const SongStoryUtils = {
    /**
     * Converts literal \n to <br> tags.
     */
    formatText(text) {
        if (!text) return '';
        return text.replace(/\n/g, '<br>');
    },

    /**
     * Shared path resolver for assets.
     */
    resolvePath(url) {
        if (!url) return '';
        const path = window.location.pathname;
        const isSongPage = path.includes('/songs/');
        const isArtistPage = path.includes('/artists/');
        
        if (isSongPage) return '../../' + url;
        if (isArtistPage) return '../' + url;
        return url;
    },

    /**
     * Template for Song Cards (Library/Index)
     */
    generateSongCard(song, options = {}) {
        const isHome = options.layout === 'home';
        
        // Determine base URL based on current page location
        let baseUrl = '';
        if (!isHome) {
            const path = window.location.pathname;
            if (path.includes('/songs/')) baseUrl = '../../';
            else if (path.includes('/artists/')) baseUrl = '../';
        }

        const songUrl = baseUrl + (song.url || `songs/${song.id}.html`);
        const coverUrl = song.cover_url ? (baseUrl + song.cover_url) : '';
        
        let coverHtml = '';
        if (coverUrl) {
            coverHtml = isHome 
                ? `<img src="${coverUrl}" alt="${song.title} Cover" class="w-full h-full object-cover">`
                : `<div class="aspect-video w-full mb-4 overflow-hidden rounded-xl border border-white/5 bg-zinc-900">
                      <img src="${coverUrl}" alt="${song.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                   </div>`;
        } else {
            coverHtml = `<div class="w-full aspect-square bg-zinc-800 rounded-xl mb-4 overflow-hidden flex items-center justify-center border border-white/5">
                            <iconify-icon icon="solar:music-note-linear" class="text-zinc-700 opacity-50" width="48"></iconify-icon>
                         </div>`;
        }

        if (isHome) {
            return `                    <article onclick="window.location.href='${songUrl}'"
                        class="reveal chapter-card visible group relative flex flex-col items-start justify-between p-4 rounded-2xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 hover:border-white/10 transition-all cursor-pointer">
                        <div class="w-full aspect-[16/9] bg-zinc-900 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center border border-white/5">
                            ${coverHtml}
                            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent"></div>
                            <div class="absolute bottom-3 left-3 flex gap-2">
                                <span class="bg-zinc-950/80 backdrop-blur text-white text-xs px-2 py-1 rounded-md border border-white/10">${song.genre}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                            <span>${song.artist_id || song.artist}</span><span>•</span><span>${song.year}</span>
                        </div>
                        <h3 class="text-lg text-white font-medium tracking-tight mb-2 group-hover:text-amber-400 transition-colors leading-snug">
                            ${song.title}</h3>
                        <p class="text-sm text-zinc-400 line-clamp-2 leading-relaxed">${this.formatText(song.description)}</p>
                    </article>`;
        }

        return `                <a href="${songUrl}"
                    class="song-card reveal visible group bg-zinc-900/30 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900/50 hover:border-white/10 transition-all"
                    data-genre="${song.genre}" data-tags="${song.tags ? song.tags.join(',') : ''}">
${coverHtml}
                    <div class="flex items-center justify-between mb-4">
                        <div class="px-2 py-1 rounded-md bg-amber-400/10 text-amber-400 text-[10px] font-medium uppercase tracking-wider">
                            ${song.genre}</div>
                        <span class="text-zinc-600 text-[10px] font-medium">${song.year}</span>
                    </div>
                    <h3 class="text-white font-medium text-lg leading-tight group-hover:text-amber-400 transition-colors mb-1">
                        ${song.title}</h3>
                    <p class="text-zinc-500 text-sm mb-4">${song.artist_id || song.artist}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${(song.tags || []).map(t => `<span class="px-2 py-0.5 rounded-full bg-zinc-800/50 text-zinc-500 text-[10px]">${t}</span>`).join('\n                        ')}
                    </div>
                    <div class="flex items-center justify-between pt-4 border-t border-white/5">
                        <span class="text-[10px] text-zinc-600">${song.duration || '--'}</span>
                        <iconify-icon icon="solar:play-bold" class="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" width="16"></iconify-icon>
                    </div>
                </a>`;
    },

    /**
     * Template for Artist Cards
     */
    generateArtistCard(artist, options = {}) {
        const path = window.location.pathname;
        const baseUrl = path.includes('/songs/') ? '../../' : (path.includes('/artists/') ? '../' : '');
        
        let avatarHtml;
        if (artist.photo_url) {
            avatarHtml = `                        <div class="artist-avatar" style="width:64px;height:64px;margin-bottom:0;overflow:hidden;">
                            <img src="${baseUrl + artist.photo_url}" alt="${artist.name}" class="w-full h-full object-cover">
                        </div>`;
        } else {
            avatarHtml = `                        <div class="artist-avatar" style="width:64px;height:64px;margin-bottom:0;">
                            <iconify-icon icon="solar:user-bold" class="text-zinc-600 group-hover:text-amber-400 transition-colors" width="28"></iconify-icon>
                        </div>`;
        }

        const artistUrl = baseUrl + (artist.url || `artists/${artist.id}.html`);

        return `                <a href="${artistUrl}"
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
                    <p class="text-zinc-500 text-sm leading-relaxed mb-4">${this.formatText(artist.bio)}</p>
                    <div class="flex items-center justify-between text-xs text-zinc-600">
                        <span>${artist.songs_count || 0} analyse(s) disponible(s)</span>
                        <iconify-icon icon="solar:arrow-right-linear" class="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" width="16"></iconify-icon>
                    </div>
                </a>`;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SongStoryUtils;
}
