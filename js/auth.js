/**
 * SongStory — Auth & User Data Manager
 * Gestion des comptes, favoris, notes et playlists via localStorage
 */

const SongStoryAuth = (() => {

    const KEYS = {
        USER: 'ss_user',
        FAVORITES: 'ss_favorites',
        NOTES: 'ss_notes',
        PLAYLISTS: 'ss_playlists',
    };

    // ─── Compte utilisateur ───────────────────────────────
    function login(name, email) {
        const user = { name: name.trim(), email: email.trim(), joinedAt: new Date().toISOString() };
        localStorage.setItem(KEYS.USER, JSON.stringify(user));
        _dispatchAuthChange();
        return user;
    }

    function logout() {
        localStorage.removeItem(KEYS.USER);
        _dispatchAuthChange();
    }

    function getUser() {
        try {
            return JSON.parse(localStorage.getItem(KEYS.USER)) || null;
        } catch { return null; }
    }

    function isLoggedIn() {
        return !!getUser();
    }

    function _dispatchAuthChange() {
        window.dispatchEvent(new CustomEvent('ss:authchange', { detail: { user: getUser() } }));
    }

    // ─── Favoris ──────────────────────────────────────────
    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem(KEYS.FAVORITES)) || [];
        } catch { return []; }
    }

    function isFavorite(songId) {
        return getFavorites().includes(songId);
    }

    function toggleFavorite(songId) {
        if (!isLoggedIn()) return false;
        const favs = getFavorites();
        const idx = favs.indexOf(songId);
        if (idx === -1) {
            favs.push(songId);
        } else {
            favs.splice(idx, 1);
        }
        localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favs));
        window.dispatchEvent(new CustomEvent('ss:favchange', { detail: { songId, isFav: idx === -1 } }));
        return idx === -1;
    }

    // ─── Notes privées ────────────────────────────────────
    function getNotes(songId) {
        try {
            const all = JSON.parse(localStorage.getItem(KEYS.NOTES)) || {};
            return all[songId] || {};
        } catch { return {}; }
    }

    function saveNote(songId, blockId, text) {
        if (!isLoggedIn()) return;
        let all = {};
        try { all = JSON.parse(localStorage.getItem(KEYS.NOTES)) || {}; } catch { }
        if (!all[songId]) all[songId] = {};
        if (text.trim()) {
            all[songId][blockId] = { text: text.trim(), savedAt: new Date().toISOString() };
        } else {
            delete all[songId][blockId];
        }
        localStorage.setItem(KEYS.NOTES, JSON.stringify(all));
    }

    function getAllNotes() {
        try {
            return JSON.parse(localStorage.getItem(KEYS.NOTES)) || {};
        } catch { return {}; }
    }

    // ─── Playlists ────────────────────────────────────────
    function getPlaylists() {
        try {
            return JSON.parse(localStorage.getItem(KEYS.PLAYLISTS)) || [];
        } catch { return []; }
    }

    function createPlaylist(name) {
        if (!isLoggedIn()) return null;
        const playlists = getPlaylists();
        const playlist = { id: Date.now().toString(), name: name.trim(), songs: [], createdAt: new Date().toISOString() };
        playlists.push(playlist);
        localStorage.setItem(KEYS.PLAYLISTS, JSON.stringify(playlists));
        return playlist;
    }

    function addToPlaylist(playlistId, songId) {
        const playlists = getPlaylists();
        const pl = playlists.find(p => p.id === playlistId);
        if (!pl || pl.songs.includes(songId)) return false;
        pl.songs.push(songId);
        localStorage.setItem(KEYS.PLAYLISTS, JSON.stringify(playlists));
        return true;
    }

    function removeFromPlaylist(playlistId, songId) {
        const playlists = getPlaylists();
        const pl = playlists.find(p => p.id === playlistId);
        if (!pl) return;
        pl.songs = pl.songs.filter(s => s !== songId);
        localStorage.setItem(KEYS.PLAYLISTS, JSON.stringify(playlists));
    }

    function deletePlaylist(playlistId) {
        const playlists = getPlaylists().filter(p => p.id !== playlistId);
        localStorage.setItem(KEYS.PLAYLISTS, JSON.stringify(playlists));
    }

    // ─── Initialisation UI Navigation ────────────────────
    function initNavUI() {
        const navActions = document.querySelector('.nav-auth-slot');
        if (!navActions) return;

        function render() {
            const user = getUser();
            if (user) {
                const initial = user.name.charAt(0).toUpperCase();
                navActions.innerHTML = `
                    <a href="${_basePath()}account.html" class="nav-avatar-btn" title="${user.name}">
                        <span class="nav-avatar-initial">${initial}</span>
                        <span class="nav-avatar-name hidden sm:inline">${user.name}</span>
                    </a>
                `;
            } else {
                navActions.innerHTML = `
                    <a href="${_basePath()}account.html" class="nav-login-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        Connexion
                    </a>
                `;
            }
        }

        render();
        window.addEventListener('ss:authchange', render);
    }

    function _basePath() {
        return (window.location.pathname.includes('/songs/') ||
            window.location.pathname.includes('/artists/')) ? '../' : '';
    }

    return {
        login, logout, getUser, isLoggedIn,
        getFavorites, isFavorite, toggleFavorite,
        getNotes, saveNote, getAllNotes,
        getPlaylists, createPlaylist, addToPlaylist,
        removeFromPlaylist, deletePlaylist,
        initNavUI,
    };

})();

// Auto-init nav quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => SongStoryAuth.initNavUI());
