/**
 * SongStory CMS Logic
 * Handles dashboard data, moderation, and navigation.
 */

const CMS_CONFIG = {
    tabs: ['dashboard', 'songs', 'artists', 'covers', 'moderation'],
    titles: {
        dashboard: 'Tableau de Bord',
        songs: 'Gestion des Titres',
        artists: 'Gestion des Artistes',
        covers: 'Galerie des Covers',
        moderation: 'Modération des Contributions'
    }
};

let currentTab = 'dashboard';
let currentModFilter = 'pending';

const API_URL = 'http://localhost:3000/api';

async function initCMS() {
    checkServerStatus();
    setInterval(checkServerStatus, 5000);

    // Initial load from server
    await syncFromServer(true);

    updateDashboardStats();
    renderSongsTable();
    renderArtistsGrid();
    renderModerationFull();
    switchTab('dashboard');
}

async function checkServerStatus() {
    try {
        const resp = await fetch(`${API_URL}/data`);
        updateStatus(resp.ok);
    } catch (e) {
        updateStatus(false);
    }
}

function updateStatus(online) {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    if (!dot || !text) return;

    if (online) {
        dot.className = 'w-1.5 h-1.5 rounded-full bg-green-500';
        text.textContent = 'Server Online';
        text.className = 'text-[10px] font-bold text-green-500 uppercase tracking-widest';
    } else {
        dot.className = 'w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse';
        text.textContent = 'Server Offline';
        text.className = 'text-[10px] font-bold text-zinc-500 uppercase tracking-widest';
    }
}

async function syncFromServer(silent = false) {
    try {
        const resp = await fetch(`${API_URL}/data`);
        if (!resp.ok) throw new Error("Server error");
        const data = await resp.json();
        SONGS_DATA_DB = data.songs;
        ARTISTS_DATA_DB = data.artists;
        window.SONGS_DATA = data.songs;
        window.ARTISTS_DATA = data.artists;

        updateDashboardStats();
        if (currentTab === 'songs') renderSongsTable();
        if (currentTab === 'artists') renderArtistsGrid();

        if (!silent) showToast("Données synchronisées !");
    } catch (err) {
        console.error("Sync Error:", err);
        if (!silent) showToast("Erreur de synchronisation.");
    }
}

let SONGS_DATA_DB = [];
let ARTISTS_DATA_DB = [];
let CONTRIBS_DATA_DB = [];

async function loadAllSongs() {
    await syncFromServer();
}

async function loadAllArtists() {
    await syncFromServer();
}

async function loadAllContributions() {
    // contributions are harder to handle static without a file, 
    // maybe we just skip for now or use a contributions.json
    CONTRIBS_DATA_DB = [];
}

/**
 * View Switching Logic
 */
function switchTab(tabId) {
    if (!CMS_CONFIG.tabs.includes(tabId)) return;

    currentTab = tabId;

    // Update Header
    document.getElementById('view-title').textContent = CMS_CONFIG.titles[tabId];

    const actionBtn = document.getElementById('header-action-btn');
    if (tabId === 'songs') {
        actionBtn.innerHTML = `<iconify-icon icon="solar:add-circle-bold" width="16"></iconify-icon> Nouveau Titre`;
        actionBtn.onclick = () => openModal('add-song');
        actionBtn.classList.remove('hidden');
    } else if (tabId === 'artists') {
        actionBtn.innerHTML = `<iconify-icon icon="solar:user-plus-bold" width="16"></iconify-icon> Nouvel Artiste`;
        actionBtn.onclick = () => openModal('add-artist');
        actionBtn.classList.remove('hidden');
    } else {
        actionBtn.classList.add('hidden');
    }

    // Update Nav UI
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.toggle('active', btn.id === `btn-${tabId}`);
    });

    // Update Section Visibility
    CMS_CONFIG.tabs.forEach(t => {
        const el = document.getElementById(`view-${t}`);
        if (el) el.classList.toggle('hidden', t !== tabId);
    });

    if (tabId === 'covers') renderCoversGallery();
}

/**
 * Dashboard Logic
 */
function updateDashboardStats() {
    const songsCount = SONGS_DATA_DB.length;
    const artistsCount = ARTISTS_DATA_DB.length;
    const pendingCount = CONTRIBS_DATA_DB.filter(c => c.status === 'pending').length;

    document.getElementById('stat-songs').textContent = songsCount;
    document.getElementById('stat-artists').textContent = artistsCount;
    document.getElementById('stat-contribs').textContent = CONTRIBS_DATA_DB.length;
    document.getElementById('stat-pending-badge').textContent = `${pendingCount} à traiter`;

    // Recent Content
    const recentSongs = [...SONGS_DATA_DB].slice(0, 4);
    document.getElementById('recent-songs-list').innerHTML = recentSongs.map(s => `
        <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <div class="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/5">
                <iconify-icon icon="solar:music-note-2-bold" class="text-zinc-600 group-hover:text-amber-500 transition-colors"></iconify-icon>
            </div>
            <div class="flex-1 min-w-0">
                <h5 class="text-sm font-medium text-white truncate">${s.title}</h5>
                <p class="text-xs text-zinc-500">${s.artist_id} • ${s.year}</p>
            </div>
            <div class="flex items-center gap-2">
                <button class="text-zinc-600 hover:text-amber-500" onclick="generateStaticHTML('${s.id}')" title="Générer HTML">
                    <iconify-icon icon="solar:code-bold" width="18"></iconify-icon>
                </button>
                <button class="text-zinc-600 hover:text-white" onclick="editSong('${s.id}')" title="Éditer">
                    <iconify-icon icon="solar:pen-bold" width="18"></iconify-icon>
                </button>
            </div>
        </div>
    `).join('');

    // Recent Contribs
    const recentContribs = [...CONTRIBS_DATA_DB].slice(0, 4);
    document.getElementById('recent-contribs-list').innerHTML = recentContribs.map(c => {
        const song = SONGS_DATA_DB.find(s => s.id === (c.song_id || c.songId));
        return `
        <div class="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all">
            <div class="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs border border-white/5">
                ${(c.author || 'A').charAt(0)}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm text-zinc-300">
                    <span class="text-white font-medium">${c.author}</span> a suggéré une modification pour <span class="text-amber-500">${song ? song.title : (c.song_id || c.songId)}</span>
                </p>
                <p class="text-[10px] text-zinc-600 mt-1 uppercase font-bold tracking-wider">Récent</p>
            </div>
        </div>
    `}).join('');
}

/**
 * Content Rendering
 */
function renderSongsTable() {
    const tbody = document.getElementById('songs-table-body');
    if (!tbody) return;

    tbody.innerHTML = SONGS_DATA_DB.map(s => `
        <tr class="hover:bg-white/5 transition-all group">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center border border-white/5">
                        <iconify-icon icon="solar:music-note-bold" class="text-zinc-500"></iconify-icon>
                    </div>
                    <span class="text-sm text-white font-medium">${s.title}</span>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-zinc-400">${s.artist_id}</td>
            <td class="px-6 py-4 text-sm text-zinc-400">${s.year}</td>
            <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button class="p-2 text-zinc-500 hover:text-amber-500" title="Générer HTML" onclick="generateStaticHTML('${s.id}')">
                        <iconify-icon icon="solar:code-bold" width="18"></iconify-icon>
                    </button>
                    <button class="p-2 text-zinc-500 hover:text-amber-500" title="Gérer le contenu" onclick="manageSongContent('${s.id}')">
                        <iconify-icon icon="solar:notes-bold" width="18"></iconify-icon>
                    </button>
                    <button class="p-2 text-zinc-500 hover:text-white" title="Editer" onclick="editSong('${s.id}')">
                        <iconify-icon icon="solar:pen-bold" width="18"></iconify-icon>
                    </button>
                    <button class="p-2 text-zinc-500 hover:text-red-400" title="Supprimer" onclick="deleteItem('song', '${s.id}')">
                        <iconify-icon icon="solar:trash-bin-trash-bold" width="18"></iconify-icon>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderArtistsGrid() {
    const grid = document.getElementById('artists-grid');
    if (!grid) return;

    grid.innerHTML = ARTISTS_DATA_DB.map(a => `
        <div class="bg-zinc-900/30 border border-white/5 p-6 rounded-2xl group hover:border-amber-500/20 transition-all">
            <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 overflow-hidden">
                    <iconify-icon icon="solar:user-bold" width="32" class="text-zinc-600"></iconify-icon>
                </div>
                <div>
                    <h5 class="text-white font-bold">${a.name}</h5>
                    <p class="text-xs text-zinc-500">${a.country} • ${a.genre}</p>
                </div>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-white/5">
                <span class="text-xs text-zinc-600">${a.songs ? a.songs.length : 0} titres analysés</span>
                <div class="flex gap-2">
                    <button onclick="editArtist('${a.id}')" class="text-xs text-amber-500 font-bold hover:text-amber-400 flex items-center gap-1" title="Éditer">
                        <iconify-icon icon="solar:pen-bold"></iconify-icon>
                    </button>
                    <button onclick="deleteItem('artist', '${a.id}')" class="text-xs text-red-500/50 hover:text-red-500 font-bold flex items-center gap-1" title="Supprimer">
                        <iconify-icon icon="solar:trash-bin-trash-bold"></iconify-icon>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderModerationFull() {
    const list = document.getElementById('contribs-list-full');
    if (!list) return;

    const filtered = CONTRIBS_DATA_DB.filter(c => c.status === currentModFilter);

    if (!filtered.length) {
        list.innerHTML = `<div class="col-span-2 py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <iconify-icon icon="solar:box-minimalistic-bold-duotone" width="48" class="text-zinc-800 mb-2"></iconify-icon>
            <p class="text-zinc-600">Aucune contribution ${currentModFilter === 'pending' ? 'en attente' : 'approuvée'}.</p>
        </div>`;
        return;
    }

    list.innerHTML = filtered.map(c => {
        const song_id = c.song_id || c.songId;
        const song = SONGS_DATA_DB.find(s => s.id === song_id);
        const typeInfo = (typeof SongStoryContrib !== 'undefined' ? SongStoryContrib.TYPES[c.type] : null) || { label: c.type, icon: '📌' };
        const d = new Date(c.submitted_at || c.submittedAt).toLocaleString('fr-FR');
        const statusCls = c.status === 'pending' ? 'status-pending' : 'status-approved';

        return `
            <div class="contrib-card">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <span class="status-badge ${statusCls}">${c.status === 'pending' ? 'En attente' : 'Approuvé'}</span>
                        <div class="text-xs text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-white/5">${typeInfo.icon} ${typeInfo.label}</div>
                    </div>
                    <span class="text-[10px] text-zinc-600 font-mono tracking-tighter">${c.id}</span>
                </div>
                
                <h6 class="text-white font-medium text-sm mb-1">${song ? song.title : song_id}</h6>
                <div class="text-xs text-zinc-500 mb-4 flex items-center gap-2">
                    <iconify-icon icon="solar:user-bold" width="12"></iconify-icon> ${c.author} 
                    <iconify-icon icon="solar:calendar-bold" width="12" class="ml-2"></iconify-icon> ${d}
                </div>

                ${c.line_ref || c.lineRef ? `<div class="bg-amber-500/5 border-l-2 border-amber-500 p-2 mb-3 text-[11px] italic text-amber-200/70">"${c.line_ref || c.lineRef}"</div>` : ''}
                
                <div class="bg-zinc-950/50 p-4 rounded-xl text-sm text-zinc-300 border border-white/5 mb-6 whitespace-pre-wrap leading-relaxed">${c.text}</div>

                <div class="flex gap-2">
                    ${c.status === 'pending' ? `
                        <button onclick="takeCmsAction('${c.id}', 'approved')" class="btn-approve flex-1 py-2">✓ Approuver</button>
                        <button onclick="takeCmsAction('${c.id}', 'rejected')" class="btn-reject px-4 py-2">✕</button>
                    ` : `
                        <button onclick="takeCmsAction('${c.id}', 'rejected')" class="btn-reject flex-1 py-2">Supprimer</button>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

function filterModeration(status) {
    currentModFilter = status;
    document.getElementById('mod-filter-pending').className = status === 'pending' ? 'px-4 py-2 text-sm font-medium rounded-lg bg-amber-500 text-black' : 'px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-zinc-400 hover:text-white';
    document.getElementById('mod-filter-approved').className = status === 'approved' ? 'px-4 py-2 text-sm font-medium rounded-lg bg-amber-500 text-black' : 'px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-zinc-400 hover:text-white';
    renderModerationFull();
}

/**
 * Covers Management
 */
async function renderCoversGallery() {
    const gallery = document.getElementById('covers-gallery');
    if (!gallery) return;

    try {
        const resp = await fetch(`${API_URL}/list-covers`);
        const covers = await resp.json();

        if (covers.length === 0) {
            gallery.innerHTML = `<div class="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <iconify-icon icon="solar:gallery-wide-bold-duotone" width="48" class="text-zinc-800 mb-2"></iconify-icon>
                <p class="text-zinc-600">Aucune cover trouvée dans Images/Title Cover.</p>
            </div>`;
            return;
        }

        gallery.innerHTML = covers.map(c => `
            <div class="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden group relative aspect-square">
                <img src="${c.url}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-2">
                    <p class="text-[10px] text-white font-medium truncate w-full text-center">${c.filename}</p>
                    <div class="flex gap-2">
                        <button onclick="copyToClipboardText('${c.url}')" class="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white" title="Copier l'URL">
                            <iconify-icon icon="solar:copy-bold" width="16"></iconify-icon>
                        </button>
                        <button onclick="deleteCover('${c.filename}')" class="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400" title="Supprimer">
                            <iconify-icon icon="solar:trash-bin-trash-bold" width="16"></iconify-icon>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error loading covers:", err);
        showToast("Erreur lors du chargement des covers.");
    }
}

async function deleteCover(filename) {
    if (!confirm(`Supprimer définitivement la cover "${filename}" ?`)) return;

    try {
        const resp = await fetch(`${API_URL}/delete-cover`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename })
        });
        if (resp.ok) {
            showToast("Cover supprimée.");
            renderCoversGallery();
        }
    } catch (err) {
        showToast("Erreur lors de la suppression.");
    }
}

function copyToClipboardText(text) {
    navigator.clipboard.writeText(text);
    showToast("Lien copié !");
}

/**
 * CMS Actions
 */
function takeCmsAction(id, action) {
    if (action === 'rejected') {
        if (!confirm('Sûr de vouloir supprimer cette suggestion ?')) return;
        SongStoryContrib.remove(id);
    } else {
        SongStoryContrib.updateStatus(id, action);
    }
    updateDashboardStats();
    renderModerationFull();
}

/**
 * Modal System
 */
function openModal(type, data = null) {
    const modal = document.getElementById('modal-container');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    modal.classList.remove('hidden');

    if (type === 'add-song' || type === 'edit-song') {
        const isEdit = type === 'edit-song' && data;
        const s = isEdit ? data : {};

        title.innerHTML = isEdit
            ? `<iconify-icon icon="solar:pen-bold" class="mr-2 text-amber-500"></iconify-icon> Éditer le titre`
            : `<iconify-icon icon="solar:add-circle-bold" class="mr-2 text-amber-500"></iconify-icon> Ajouter un nouveau titre`;

        body.innerHTML = `
            <form id="cms-form" onsubmit="handleFormSubmit(event, 'song')" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-xs text-zinc-500 mb-1">ID (identifiant unique URL)</label>
                        <input type="text" id="f-id" value="${s.id || ''}" required ${isEdit ? 'readonly' : ''} class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50 ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}">
                    </div>
                    <div>
                        <label class="block text-xs text-zinc-500 mb-1">Titre de la chanson</label>
                        <input type="text" id="f-title" value="${s.title || ''}" required class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
                    </div>
                    <div>
                        <label class="block text-xs text-zinc-500 mb-1">ID de l'artiste (ex: pnl, nekfeu)</label>
                        <input type="text" id="f-artistId" value="${s.artist_id || s.artistId || ''}" required class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
                    </div>
                    <div>
                        <label class="block text-xs text-zinc-500 mb-1">Genre</label>
                        <input type="text" id="f-genre" value="${s.genre || ''}" required class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
                    </div>
                    <div>
                        <label class="block text-xs text-zinc-500 mb-1">Année</label>
                        <input type="number" id="f-year" value="${s.year || ''}" required class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
                    </div>
                    <div>
                        <label class="block text-xs text-zinc-500 mb-1">Durée (ex: 3:45)</label>
                        <input type="text" id="f-duration" value="${s.duration || ''}" class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
                    </div>
                    <div>
                        <label class="block text-xs text-zinc-500 mb-1">Spotify ID</label>
                        <input type="text" id="f-spotifyId" value="${s.spotifyId || ''}" required class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
                    </div>
                    <div>
                        <label class="block text-xs text-zinc-500 mb-1">Apple Music ID</label>
                        <input type="text" id="f-appleMusicId" value="${s.appleMusicId || ''}" required class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs text-zinc-500 mb-1">Image de la Cover</label>
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 rounded-xl bg-zinc-950 border border-white/5 overflow-hidden flex items-center justify-center shrink-0">
                                <img id="cover-preview" src="${s.cover_url || ''}" class="w-full h-full object-cover ${s.cover_url ? '' : 'hidden'}">
                                <iconify-icon id="cover-icon" icon="solar:music-note-linear" class="text-zinc-800 ${s.cover_url ? 'hidden' : ''}" width="24"></iconify-icon>
                            </div>
                            <div class="flex-1">
                                <input type="file" id="f-coverFile" accept="image/*" class="hidden" onchange="previewCover(this)">
                                <button type="button" onclick="document.getElementById('f-coverFile').click()" class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white text-sm hover:border-amber-500/50 transition-all text-left">
                                    <iconify-icon icon="solar:cloud-upload-bold" class="mr-2"></iconify-icon>
                                    ${s.cover_url ? 'Changer l\'image...' : 'Choisir une image...'}
                                </button>
                                <button type="button" onclick="openGalleryPicker()" class="w-full mt-2 bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-zinc-400 text-xs hover:text-white hover:border-white/10 transition-all text-left">
                                    <iconify-icon icon="solar:gallery-bold" class="mr-2"></iconify-icon>
                                    Parcourir la galerie...
                                </button>
                                <input type="hidden" id="f-coverUrl" value="${s.cover_url || ''}">
                            </div>
                        </div>
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs text-zinc-500 mb-1">Tags (séparés par des virgules)</label>
                        <input type="text" id="f-tags" value="${s.tags ? s.tags.join(', ') : ''}" placeholder="rap, storytelling, classique" class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs text-zinc-500 mb-1">Description courte</label>
                        <textarea id="f-desc" rows="2" class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50 leading-relaxed">${s.description || ''}</textarea>
                    </div>
                </div>
                <!-- Action Buttons Injected via HTML -->
            </form>
        `;
    }
    else if (type === 'add-artist' || type === 'edit-artist') {
        const isEdit = type === 'edit-artist' && data;
        const a = isEdit ? data : {};

        title.innerHTML = isEdit
            ? `<iconify-icon icon="solar:pen-bold" class="mr-2 text-amber-500"></iconify-icon> Éditer l'artiste`
            : `<iconify-icon icon="solar:user-plus-bold" class="mr-2 text-amber-500"></iconify-icon> Ajouter un nouvel artiste`;

        body.innerHTML = `
            <form id="cms-form" onsubmit="handleFormSubmit(event, 'artist')" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-xs text-zinc-500 mb-1">ID (identifiant unique URL)</label>
                        <input type="text" id="f-id" value="${a.id || ''}" required ${isEdit ? 'readonly' : ''} class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50 ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs text-zinc-500 mb-1">Nom de l'artiste</label>
                        <input type="text" id="f-name" value="${a.name || ''}" required class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
                    </div>
                    <div>
                        <label class="block text-xs text-zinc-500 mb-1">Genre principal</label>
                        <input type="text" id="f-genre" value="${a.genre || ''}" required class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
                    </div>
                    <div>
                        <label class="block text-xs text-zinc-500 mb-1">Pays d'origine</label>
                        <input type="text" id="f-country" value="${a.country || ''}" required class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs text-zinc-500 mb-1">Tags (séparés par des virgules)</label>
                        <input type="text" id="f-tags" value="${a.tags ? a.tags.join(', ') : ''}" placeholder="rap, uk, conscient" class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs text-zinc-500 mb-1">Biographie</label>
                        <textarea id="f-bio" rows="4" required class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50 leading-relaxed">${a.bio || ''}</textarea>
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs text-zinc-500 mb-1">Influence</label>
                        <textarea id="f-influence" rows="3" class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50 leading-relaxed">${a.influence || ''}</textarea>
                    </div>
                </div>
                <!-- Action Buttons Injected via HTML -->
            </form>
        `;
    }
}

function closeModal() {
    document.getElementById('modal-container').classList.add('hidden');
}

/**
 * Handle Form Submissions & JSON Generation
 */
async function handleFormSubmit(e, formType) {
    e.preventDefault();

    if (formType === 'song') {
        const id = document.getElementById('f-id').value.trim();
        const isEditing = SONGS_DATA_DB.some(s => s.id === id);

        // Upload cover if new file selected
        let coverUrl = document.getElementById('f-coverUrl').value;
        const fileInput = document.getElementById('f-coverFile');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const base64 = await toBase64(file);
            const uploadResp = await fetch(`${API_URL}/upload-cover`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: file.name, base64 })
            });
            const uploadResult = await uploadResp.json();
            coverUrl = uploadResult.url;
        }

        const songObj = {
            id,
            title: document.getElementById('f-title').value.trim(),
            artist_id: document.getElementById('f-artistId').value, // Corrected from f-artist
            genre: document.getElementById('f-genre').value.trim(),
            year: parseInt(document.getElementById('f-year').value),
            url: `songs/${id}.html`,
            audio_url: '', // Placeholder, as per original
            spotify_id: document.getElementById('f-spotifyId').value.trim(),
            apple_music_id: document.getElementById('f-appleMusicId').value.trim(),
            cover_url: coverUrl,
            tags: document.getElementById('f-tags').value.split(',').map(t => t.trim()).filter(t => t),
            description: document.getElementById('f-desc').value.trim() // Added description
        };

        const duration = document.getElementById('f-duration').value.trim();
        if (duration) songObj.duration = duration;

        // Update local list
        let newSongsList;
        if (isEditing) {
            newSongsList = SONGS_DATA_DB.map(s => s.id === id ? songObj : s);
        } else {
            newSongsList = [songObj, ...SONGS_DATA_DB];
        }

        // Save to server
        const saveResp = await fetch(`${API_URL}/save-song`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                song: songObj,
                songs: newSongsList,
                artists: ARTISTS_DATA_DB,
                glossary: window.GLOSSARY || {}
            })
        });

        if (saveResp.ok) {
            showToast("Titre enregistré !");
            await syncFromServer();
            renderSongsTable();
            closeModal();
        }
    } else if (formType === 'artist') {
        const id = document.getElementById('f-id').value.trim();
        const isEditing = ARTISTS_DATA_DB.some(a => a.id === id);

        const artistObj = {
            id,
            name: document.getElementById('f-name').value.trim(),
            genre: document.getElementById('f-genre').value.trim(),
            country: document.getElementById('f-country').value.trim(),
            bio: document.getElementById('f-bio').value.trim(),
            influence: document.getElementById('f-influence').value.trim(),
            url: `artists/${id}.html`,
            tags: document.getElementById('f-tags').value.split(',').map(t => t.trim()).filter(t => t)
        };

        // Update local list
        let newArtistsList;
        if (isEditing) {
            newArtistsList = ARTISTS_DATA_DB.map(a => a.id === id ? artistObj : a);
        } else {
            newArtistsList = [artistObj, ...ARTISTS_DATA_DB];
        }

        // Save to server
        const saveResp = await fetch(`${API_URL}/save-song`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                song: null,
                songs: SONGS_DATA_DB,
                artists: newArtistsList,
                glossary: window.GLOSSARY || {}
            })
        });

        if (saveResp.ok) {
            showToast("Artiste enregistré !");
            await syncFromServer();
            renderArtistsGrid();
            closeModal();
        }
    }
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function previewCover(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById('cover-preview');
            const icon = document.getElementById('cover-icon');
            if (preview && icon) {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
                icon.classList.add('hidden');
            }
        }
        reader.readAsDataURL(input.files[0]);
        
        // If we are in the covers tab, we might want to auto-upload
        if (currentTab === 'covers') {
            uploadStandaloneCover(input.files[0]);
        }
    }
}

async function uploadStandaloneCover(file) {
    const base64 = await toBase64(file);
    try {
        const resp = await fetch(`${API_URL}/upload-cover`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, base64 })
        });
        if (resp.ok) {
            showToast("Cover uploadée !");
            renderCoversGallery();
        }
    } catch (err) {
        showToast("Erreur lors de l'upload.");
    }
}

async function openGalleryPicker() {
    const galleryContainer = document.createElement('div');
    galleryContainer.id = 'gallery-picker';
    galleryContainer.className = 'fixed inset-0 bg-black/90 backdrop-blur-xl z-[70] flex flex-col p-8';
    galleryContainer.innerHTML = `
        <div class="flex justify-between items-center mb-8">
            <h3 class="text-2xl text-white font-bold">Sélectionner une Cover</h3>
            <button onclick="document.getElementById('gallery-picker').remove()" class="text-zinc-500 hover:text-white">
                <iconify-icon icon="solar:close-circle-bold" width="32"></iconify-icon>
            </button>
        </div>
        <div id="gallery-picker-list" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-y-auto flex-1 pb-8">
            <div class="col-span-full py-10 text-center animate-pulse text-zinc-500">Chargement...</div>
        </div>
    `;
    document.body.appendChild(galleryContainer);

    try {
        const resp = await fetch(`${API_URL}/list-covers`);
        const covers = await resp.json();
        const list = document.getElementById('gallery-picker-list');
        
        if (covers.length === 0) {
            list.innerHTML = `<p class="col-span-full text-center text-zinc-500 py-20">Aucune image dans la galerie.</p>`;
            return;
        }

        list.innerHTML = covers.map(c => `
            <div onclick="selectCoverForSong('${c.url}')" class="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all aspect-square relative group">
                <img src="${c.url}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
        `).join('');
    } catch (err) {
        galleryContainer.remove();
        showToast("Erreur de chargement.");
    }
}

function selectCoverForSong(url) {
    const preview = document.getElementById('cover-preview');
    const icon = document.getElementById('cover-icon');
    const hidden = document.getElementById('f-coverUrl');
    
    if (preview && hidden) {
        preview.src = url;
        preview.classList.remove('hidden');
        if (icon) icon.classList.add('hidden');
        hidden.value = url;
    }
    
    const picker = document.getElementById('gallery-picker');
    if (picker) picker.remove();
}

function editSong(id) {
    const song = SONGS_DATA_DB.find(s => s.id === id);
    if (song) openModal('edit-song', song);
}

function editArtist(id) {
    const artist = ARTISTS_DATA_DB.find(a => a.id === id);
    if (artist) openModal('edit-artist', artist);
}

async function deleteItem(type, id) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${type === 'song' ? 'le titre' : 'l\'artiste'} "${id}" ? Cette action modifiera vos fichiers locaux.`)) return;

    let newSongs = SONGS_DATA_DB;
    let newArtists = ARTISTS_DATA_DB;

    if (type === 'song') {
        newSongs = SONGS_DATA_DB.filter(s => s.id !== id);
    } else {
        newArtists = ARTISTS_DATA_DB.filter(a => a.id !== id);
    }

    // Save to server
    const saveResp = await fetch(`${API_URL}/save-song`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            song: null,
            songs: newSongs,
            artists: newArtists,
            glossary: window.GLOSSARY || {}
        })
    });

    if (saveResp.ok) {
        showToast("Supprimé avec succès !");
        await syncFromServer();
        renderSongsTable();
        renderArtistsGrid();
        updateDashboardStats();
    }
}

async function takeCmsAction(id, action) {
    if (!window.ss_supabase) return;

    if (action === 'rejected') {
        if (!confirm("Supprimer définitivement cette contribution ?")) return;
        await window.ss_supabase.from('contributions').delete().eq('id', id);
    } else {
        await window.ss_supabase.from('contributions').update({ status: action }).eq('id', id);
    }

    showToast(action === 'approved' ? "Contribution approuvée !" : "Contribution supprimée.");
    await loadAllContributions();
    updateDashboardStats();
    renderModerationFull();
}

/**
 * Content Editor Management
 */
async function manageSongContent(songId) {
    const song = SONGS_DATA_DB.find(s => s.id === songId);
    if (!song) return;

    const modal = document.getElementById('modal-container');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const actions = document.getElementById('modal-actions-container');

    modal.classList.remove('hidden');
    title.innerHTML = `<iconify-icon icon="solar:notes-bold" class="mr-2 text-amber-500"></iconify-icon> Contenu : ${song.title}`;

    // Load existing content (from local data if available, otherwise empty)
    // For a fully static CMS, song_contents would be part of SONGS_DATA_DB or separate JSON files.
    // For now, we'll simulate it as an empty array if not explicitly loaded.
    const contents = song.contents || []; // Assuming song.contents might hold this data

    body.innerHTML = `
        <div class="space-y-6">
            <p class="text-xs text-zinc-500">Ajoutez les blocs de paroles et leurs analyses respectives avec le timing associé.</p>
            <div id="content-blocks-list" class="space-y-4">
                <!-- Blocks here -->
            </div>
            <button onclick="addContentBlock()" class="w-full py-3 border-2 border-dashed border-white/5 rounded-xl text-zinc-500 hover:text-white hover:border-white/10 transition-all text-sm font-medium">
                + Ajouter un bloc (Paroles + Analyse)
            </button>
        </div>
    `;

    // Render blocks
    window.currentEditingSongId = songId;
    window.editingBlocks = contents.map(c => ({
        id: c.id, // Keep ID if it exists, for potential future use
        time: c.time,
        lyrics: Array.isArray(c.lyrics) ? c.lyrics.join('\n') : c.lyrics,
        analysis: c.analysis,
        display_order: c.display_order
    }));

    if (window.editingBlocks.length === 0) {
        addContentBlock(); // Add one empty block by default
    } else {
        renderBlocks();
    }

    actions.innerHTML = `
        <button type="button" onclick="closeModal()" class="px-6 py-2 text-zinc-400 font-medium hover:text-white transition-colors">Annuler</button>
        <button type="button" onclick="saveSongContent()" class="px-6 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20">Enregistrer tout le contenu</button>
    `;
}

function renderBlocks() {
    const list = document.getElementById('content-blocks-list');
    list.innerHTML = window.editingBlocks.map((block, idx) => `
        <div class="bg-zinc-950/50 border border-white/5 rounded-2xl p-4 relative group">
            <div class="flex items-center gap-4 mb-3">
                <div class="flex-shrink-0">
                    <label class="block text-[10px] uppercase text-zinc-600 font-bold mb-1">Temps (s)</label>
                    <input type="number" value="${block.time}" onchange="updateBlockField(${idx}, 'time', this.value)" class="w-16 bg-zinc-900 border border-white/5 rounded-lg px-2 py-1.5 text-white text-xs outline-none focus:border-amber-500/50">
                </div>
                <div class="flex-shrink-0">
                    <label class="block text-[10px] uppercase text-zinc-600 font-bold mb-1">Ordre</label>
                    <input type="number" value="${block.display_order || idx}" onchange="updateBlockField(${idx}, 'display_order', this.value)" class="w-12 bg-zinc-900 border border-white/5 rounded-lg px-2 py-1.5 text-white text-xs outline-none focus:border-amber-500/50">
                </div>
                <div class="flex-1"></div>
                <button onclick="removeBlock(${idx})" class="p-2 text-zinc-700 hover:text-red-500 transition-colors">
                    <iconify-icon icon="solar:trash-bin-trash-bold" width="16"></iconify-icon>
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-[10px] uppercase text-zinc-600 font-bold mb-1.5">Paroles (une ligne par ligne)</label>
                    <textarea onchange="updateBlockField(${idx}, 'lyrics', this.value)" rows="4" class="w-full bg-zinc-900 border border-white/5 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50 placeholder:text-zinc-700" placeholder="Entrez les paroles...">${block.lyrics || ''}</textarea>
                </div>
                <div>
                    <label class="block text-[10px] uppercase text-zinc-600 font-bold mb-1.5">Analyse (Markdown/HTML supporté)</label>
                    <textarea onchange="updateBlockField(${idx}, 'analysis', this.value)" rows="4" class="w-full bg-zinc-900 border border-white/5 rounded-xl px-3 py-2 text-sm text-zinc-400 outline-none focus:border-amber-500/50 placeholder:text-zinc-700" placeholder="L'analyse pour ce bloc...">${block.analysis || ''}</textarea>
                </div>
            </div>
        </div>
    `).join('');
}

function addContentBlock() {
    const nextOrder = window.editingBlocks.length > 0 ? Math.max(...window.editingBlocks.map(b => b.display_order)) + 10 : 0;
    const nextTime = window.editingBlocks.length > 0 ? Math.max(...window.editingBlocks.map(b => b.time)) + 5 : 0;

    window.editingBlocks.push({
        time: nextTime,
        lyrics: '',
        analysis: '',
        display_order: nextOrder
    });
    renderBlocks();
}

function updateBlockField(idx, field, value) {
    if (field === 'time' || field === 'display_order') {
        window.editingBlocks[idx][field] = parseInt(value, 10) || 0;
    } else {
        window.editingBlocks[idx][field] = value;
    }
}

function removeBlock(idx) {
    window.editingBlocks.splice(idx, 1);
    renderBlocks();
}

async function saveSongContent() {
    if (!window.currentEditingSongId) return;
    if (!confirm("Voulez-vous enregistrer ces modifications dans les fichiers locaux ?")) return;

    // This part is tricky because song_contents isn't in data.js
    // For a fully static CMS, we should probably add SONG_CONTENTS to data.js
    // Or save to individual JSON files.
    // Let's assume for now we just want to NOT crash and maybe log it.
    showToast("Sauvegarde du contenu (lyrics/analyse) non encore migrée en local.");
}

/**
 * Static HTML Generation Logic
 */
function generateStaticHTML(songId) {
    const song = SONGS_DATA_DB.find(s => s.id === songId);
    if (!song) return;

    const coverHtml = song.cover_url
        ? `<img src="${song.cover_url}" alt="${song.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">`
        : `<iconify-icon icon="solar:music-note-linear" class="text-zinc-700 opacity-50" width="48"></iconify-icon>`;

    // 1. Library Card (library.html)
    const libraryCode = `
                <!-- ${song.title} -->
                <a href="songs/${song.id}.html"
                    class="song-card reveal visible group bg-zinc-900/30 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900/50 hover:border-white/10 transition-all"
                    data-genre="${song.genre}" data-tags="${song.tags ? song.tags.join(',') : ''}">
                    <div class="flex items-center justify-between mb-4">
                        <div
                            class="px-2 py-1 rounded-md bg-amber-400/10 text-amber-400 text-[10px] font-medium uppercase tracking-wider">
                            ${song.genre}</div>
                        <span class="text-zinc-600 text-[10px] font-medium">${song.year}</span>
                    </div>
                    <div class="w-full aspect-square bg-zinc-800 rounded-xl mb-4 overflow-hidden flex items-center justify-center border border-white/5">
                        ${coverHtml}
                    </div>
                    <h3
                        class="text-white font-medium text-lg leading-tight group-hover:text-amber-400 transition-colors mb-1">
                        ${song.title}</h3>
                    <p class="text-zinc-500 text-sm mb-4">${song.artist_id}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${(song.tags || []).map(t => `<span class="px-2 py-0.5 rounded-full bg-zinc-800/50 text-zinc-500 text-[10px]">${t}</span>`).join('\n                        ')}
                    </div>
                    <div class="flex items-center justify-between pt-4 border-t border-white/5">
                        <span class="text-[10px] text-zinc-600">${song.duration || '--'}</span>
                        <iconify-icon icon="solar:play-bold"
                            class="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            width="16"></iconify-icon>
                    </div>
                </a>`.trim();

    // 2. Home Card (index.html)
    const homeCode = `
                    <!-- ${song.title} -->
                    <article onclick="window.location.href='songs/${song.id}.html'"
                        class="reveal chapter-card visible group relative flex flex-col items-start justify-between p-4 rounded-2xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 hover:border-white/10 transition-all cursor-pointer">
                        <div
                            class="w-full aspect-[16/9] bg-zinc-900 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center border border-white/5">
                            ${song.cover_url ? `<img src="${song.cover_url}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">` : `<iconify-icon icon="solar:music-note-linear" class="text-zinc-700 opacity-50" width="48"></iconify-icon>`}
                            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent"></div>
                            <div class="absolute bottom-3 left-3 flex gap-2">
                                <span
                                    class="bg-zinc-950/80 backdrop-blur text-white text-xs px-2 py-1 rounded-md border border-white/10">${song.genre}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                            <span>${song.artist_id}</span><span>•</span><span>${song.year}</span>
                        </div>
                        <h3
                            class="text-lg text-white font-medium tracking-tight mb-2 group-hover:text-amber-400 transition-colors leading-snug">
                            ${song.title}</h3>
                        <p class="text-sm text-zinc-400 line-clamp-2 leading-relaxed">${song.description || ''}</p>
                    </article>`.trim();

    document.getElementById('code-library').value = libraryCode;
    document.getElementById('code-home').value = homeCode;
    document.getElementById('code-modal-container').classList.remove('hidden');
}


/**
 * Sync logic: Import static data from js/data.js into Supabase
 */
async function syncFromStaticData() {
    if (!window.ss_supabase) {
        showToast("Supabase non connecté.");
        return;
    }

    if (!confirm("Voulez-vous importer les titres et artistes de 'js/data.js' dans la base de données ? Les éléments existants seront mis à jour.")) return;

    const btn = document.getElementById('sync-btn');
    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<iconify-icon icon="solar:refresh-bold" width="16" class="animate-spin"></iconify-icon> Importation...`;

    try {
        // 1. Sync Artists
        const artistsToSync = (window.ARTISTS_DATA || []).map(a => ({
            id: a.id,
            name: a.name,
            genre: 'Rap', // Fallback
            country: 'FR', // Fallback
            bio: '',
            influence: '',
            url: `artists/${a.id}.html`,
            tags: []
        }));

        if (artistsToSync.length > 0) {
            const { error: aErr } = await window.ss_supabase.from('artists').upsert(artistsToSync);
            if (aErr) throw aErr;
        }

        // 2. Sync Songs
        const songsToSync = (window.SONGS_DATA || []).map(s => ({
            id: s.id,
            title: s.title,
            artist_id: s.artistId || s.artist,
            genre: s.genre,
            year: s.year,
            audio_url: s.audio || '',
            url: `songs/${s.id}.html`,
            description: '',
            tags: [],
            spotify_id: '',
            apple_music_id: '',
            cover_url: ''
        }));

        if (songsToSync.length > 0) {
            const { error: sErr } = await window.ss_supabase.from('songs').upsert(songsToSync);
            if (sErr) throw sErr;
        }

        showToast("Synchronisation terminée !");

        // Reload data
        await Promise.all([
            loadAllSongs(),
            loadAllArtists()
        ]);
        updateDashboardStats();
        renderSongsTable();
        renderArtistsGrid();

    } catch (err) {
        console.error("Sync Error:", err);
        alert("Erreur lors de l'import : " + (err.message || err));
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

/**
 * Utility: Copy to Clipboard
 */
function copyToClipboard(elementId) {
    const copyText = document.getElementById(elementId);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value).then(() => {
        showToast("Copié dans le presse-papier !");
    });
}
