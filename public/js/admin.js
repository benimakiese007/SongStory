/**
 * SongStory CMS Logic — Supabase Edition
 * Handles dashboard data, moderation, and navigation via Supabase.
 */

const CMS_CONFIG = {
    tabs: ['dashboard', 'songs', 'artists', 'covers', 'pp', 'moderation'],
    titles: {
        dashboard: 'Tableau de Bord',
        songs: 'Gestion des Titres',
        artists: 'Gestion des Artistes',
        covers: 'Galerie des Covers',
        pp: 'Galerie Photos Profil',
        moderation: 'Modération des Contributions'
    }
};

let currentTab = 'dashboard';
let currentModFilter = 'pending';

let SONGS_DATA_DB = [];
let ARTISTS_DATA_DB = [];
let CONTRIBS_DATA_DB = [];

async function initCMS() {
    checkSupabaseStatus();

    // Initial load from Supabase
    await syncFromSupabase(true);

    updateDashboardStats();
    renderSongsTable();
    renderArtistsGrid();
    renderPPGallery();
    renderModerationFull();
    switchTab('dashboard');
}

async function checkSupabaseStatus() {
    try {
        const user = await SupabaseCMS.getUser();
        updateStatus(!!user);
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
        text.textContent = 'Supabase Connecté';
        text.className = 'text-[10px] font-bold text-green-500 uppercase tracking-widest';
    } else {
        dot.className = 'w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse';
        text.textContent = 'Non connecté';
        text.className = 'text-[10px] font-bold text-zinc-500 uppercase tracking-widest';
    }
}

async function syncFromSupabase(silent = false) {
    try {
        const [songs, artists] = await Promise.all([
            SupabaseCMS.getAllSongs(),
            SupabaseCMS.getAllArtists()
        ]);
        SONGS_DATA_DB = songs;
        ARTISTS_DATA_DB = artists;
        window.SONGS_DATA = songs;
        window.ARTISTS_DATA = artists;

        updateDashboardStats();
        if (currentTab === 'songs') renderSongsTable();
        if (currentTab === 'artists') renderArtistsGrid();

        if (!silent) showToast("Données synchronisées !");
    } catch (err) {
        console.error("Sync Error:", err);
        if (!silent) showToast("Erreur de synchronisation.");
    }
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

    if (tabId === 'songs') renderSongsTable();
    if (tabId === 'artists') renderArtistsGrid();
    if (tabId === 'covers') renderCoversGallery();
    if (tabId === 'pp') renderPPGallery();
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
                    <div class="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center border border-white/5 overflow-hidden">
                        ${s.cover_url ? `<img src="${s.cover_url}" class="w-full h-full object-cover">` : `<iconify-icon icon="solar:music-note-bold" class="text-zinc-500"></iconify-icon>`}
                    </div>
                    <span class="text-sm text-white font-medium">${s.title}</span>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-zinc-400">${s.artist_id}</td>
            <td class="px-6 py-4 text-sm text-zinc-400">${s.year}</td>
            <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
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
                    ${a.photo_url ? `<img src="${a.photo_url}" class="w-full h-full object-cover">` : `<iconify-icon icon="solar:user-bold" width="32" class="text-zinc-600"></iconify-icon>`}
                </div>
                <div>
                    <h5 class="text-white font-bold">${a.name}</h5>
                    <p class="text-xs text-zinc-500">${a.country || ''} • ${a.genre || ''}</p>
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
        const covers = await SupabaseCMS.listImages('covers');

        if (covers.length === 0) {
            gallery.innerHTML = `<div class="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <iconify-icon icon="solar:gallery-wide-bold-duotone" width="48" class="text-zinc-800 mb-2"></iconify-icon>
                <p class="text-zinc-600">Aucune cover trouvée.</p>
            </div>`;
            return;
        }

        gallery.innerHTML = covers.map(c => `
            <div class="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden group relative aspect-square">
                <img src="${c.url}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-2">
                    <p class="text-[10px] text-white font-medium truncate w-full text-center">${c.filename}</p>
                    <div class="flex gap-2">
                        <button onclick="copyToClipboardText('${c.url.replace(/'/g, "\\'")}')" class="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white" title="Copier l'URL">
                            <iconify-icon icon="solar:copy-bold" width="16"></iconify-icon>
                        </button>
                        <button onclick="deleteCover('${c.path.replace(/'/g, "\\'")}')" class="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400" title="Supprimer">
                            <iconify-icon icon="solar:trash-bin-trash-bold" width="16"></iconify-icon>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error loading covers:", err);
    }
}

async function deleteCover(path) {
    if (!confirm(`Supprimer cette cover ?`)) return;
    try {
        await SupabaseCMS.deleteImage(path);
        showToast("Cover supprimée !");
        renderCoversGallery();
    } catch (e) {
        showToast("Erreur lors de la suppression.");
    }
}

async function renderPPGallery() {
    const gallery = document.getElementById('pp-gallery');
    if (!gallery) return;

    try {
        const pps = await SupabaseCMS.listImages('artists');

        if (pps.length === 0) {
            gallery.innerHTML = `<div class="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <iconify-icon icon="solar:user-circle-bold-duotone" width="48" class="text-zinc-800 mb-2"></iconify-icon>
                <p class="text-zinc-600">Aucune photo de profil trouvée.</p>
            </div>`;
            return;
        }

        gallery.innerHTML = pps.map(p => `
            <div class="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden group relative aspect-square">
                <img src="${p.url}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-2">
                    <p class="text-[10px] text-white font-medium truncate w-full text-center">${p.filename}</p>
                    <div class="flex gap-2">
                        <button onclick="copyToClipboardText('${p.url.replace(/'/g, "\\'")}')" class="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white" title="Copier l'URL">
                            <iconify-icon icon="solar:copy-bold" width="16"></iconify-icon>
                        </button>
                        <button onclick="deletePP('${p.path.replace(/'/g, "\\'")}')" class="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400" title="Supprimer">
                            <iconify-icon icon="solar:trash-bin-trash-bold" width="16"></iconify-icon>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error loading PP:", err);
    }
}

async function deletePP(path) {
    if (!confirm(`Supprimer cette photo ?`)) return;
    try {
        await SupabaseCMS.deleteImage(path);
        showToast("Photo supprimée !");
        renderPPGallery();
    } catch (e) {
        showToast("Erreur lors de la suppression.");
    }
}

/**
 * Modal Handling
 */
function openModal(type, id = null) {
    const container = document.getElementById('modal-container');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    container.classList.remove('hidden');

    if (type === 'add-song' || type === 'edit-song') {
        const song = id ? SONGS_DATA_DB.find(s => s.id === id) : null;
        title.textContent = song ? `Modifier : ${song.title}` : 'Ajouter un Titre';
        
        body.innerHTML = `
            <form id="cms-form" class="grid grid-cols-1 md:grid-cols-2 gap-6" onsubmit="saveSong(event, '${id || ''}')">
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-zinc-500 uppercase mb-2">Informations de base</label>
                        <div class="space-y-3">
                            <input type="text" name="title" value="${song ? song.title : ''}" placeholder="Titre du morceau" class="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white" required>
                            <input type="text" name="artist_id" value="${song ? song.artist_id : ''}" placeholder="ID de l'artiste (ex: booba)" class="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white" required>
                            <div class="grid grid-cols-2 gap-3">
                                <input type="number" name="year" value="${song ? song.year : 2024}" placeholder="Année" class="bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white">
                                <input type="text" name="duration" value="${song?.duration || ''}" placeholder="Durée (ex: 3:45)" class="bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white">
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-zinc-500 uppercase mb-2">Visuel (Cover)</label>
                        <div class="flex items-center gap-4 p-4 bg-zinc-950 border border-white/10 rounded-xl">
                            <div class="w-16 h-16 rounded bg-zinc-900 flex items-center justify-center border border-white/5 overflow-hidden shrink-0">
                                <img id="cover-preview" src="${song?.cover_url || ''}" class="${song?.cover_url ? '' : 'hidden'} w-full h-full object-cover">
                                <iconify-icon id="cover-icon" icon="solar:gallery-bold" class="${song?.cover_url ? 'hidden' : ''} text-zinc-700" width="24"></iconify-icon>
                            </div>
                            <div class="flex-1 min-w-0">
                                <input type="text" id="f-coverUrl" name="cover_url" value="${song ? song.cover_url : ''}" placeholder="URL ou chemin du fichier" class="w-full bg-transparent text-xs text-zinc-400 outline-none truncate mb-2">
                                <div class="flex gap-2">
                                    <button type="button" onclick="openGalleryPicker()" class="text-[10px] bg-white/5 hover:bg-white/10 text-white px-2 py-1 rounded border border-white/10">Galerie</button>
                                    <button type="button" onclick="document.getElementById('f-coverFile').click()" class="text-[10px] bg-amber-500 text-black px-2 py-1 rounded font-bold">Uploader</button>
                                </div>
                                <input type="file" id="f-coverFile" class="hidden" accept="image/*" onchange="uploadCover(this)">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-zinc-500 uppercase mb-2">Détails</label>
                        <div class="space-y-3">
                            <input type="text" name="genre" value="${song ? song.genre : 'Rap'}" placeholder="Genre" class="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white">
                            <input type="text" name="tags" value="${song ? (song.tags || []).join(', ') : ''}" placeholder="Tags (séparés par virgule)" class="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white">
                            <textarea name="description" placeholder="Courte description" class="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white h-20">${song ? song.description : ''}</textarea>
                            <label class="block text-[10px] font-bold text-zinc-600 uppercase mt-2">Paroles / Texte complet (pour analyse AI)</label>
                            <textarea name="lyrics" placeholder="Collez ici le texte complet..." class="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white h-40 font-mono text-xs">${song?.lyrics || ''}</textarea>
                        </div>
                    </div>
                    <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-white/5">
                        <button type="button" onclick="closeModal()" class="px-6 py-2 text-zinc-400 font-medium hover:text-white transition-colors">Annuler</button>
                        <button type="submit" class="px-6 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all">Enregistrer</button>
                    </div>
                </div>
            </form>
        `;
    } else if (type === 'add-artist' || type === 'edit-artist') {
        const artist = id ? ARTISTS_DATA_DB.find(a => a.id === id) : null;
        title.textContent = artist ? `Modifier : ${artist.name}` : 'Ajouter un Artiste';

        body.innerHTML = `
            <form id="cms-form" class="grid grid-cols-1 md:grid-cols-2 gap-6" onsubmit="saveArtist(event, '${id || ''}')">
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-zinc-500 uppercase mb-2">Profil</label>
                        <div class="space-y-3">
                            <input type="text" name="name" value="${artist ? artist.name : ''}" placeholder="Nom de l'artiste" class="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white" required>
                            <input type="text" name="id" value="${artist ? artist.id : ''}" placeholder="ID (ex: booba)" class="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white" ${artist ? 'readonly opacity-50' : 'required'}>
                            <input type="text" name="genre" value="${artist ? artist.genre : ''}" placeholder="Genre principal" class="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white">
                            <input type="text" name="country" value="${artist ? artist.country : ''}" placeholder="Pays / Ville" class="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white">
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-zinc-500 uppercase mb-2">Photo</label>
                        <div class="flex items-center gap-4 p-4 bg-zinc-950 border border-white/10 rounded-xl">
                            <div class="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center border border-white/5 overflow-hidden shrink-0">
                                <img id="pp-preview" src="${artist?.photo_url || ''}" class="${artist?.photo_url ? '' : 'hidden'} w-full h-full object-cover">
                                <iconify-icon id="pp-icon" icon="solar:user-bold" class="${artist?.photo_url ? 'hidden' : ''} text-zinc-700" width="24"></iconify-icon>
                            </div>
                            <div class="flex-1 min-w-0">
                                <input type="text" id="f-ppUrl" name="photo_url" value="${artist ? artist.photo_url : ''}" placeholder="URL ou chemin" class="w-full bg-transparent text-xs text-zinc-400 outline-none truncate mb-2">
                                <div class="flex gap-2">
                                    <button type="button" onclick="openPPGalleryPicker()" class="text-[10px] bg-white/5 hover:bg-white/10 text-white px-2 py-1 rounded border border-white/10">Galerie</button>
                                    <button type="button" onclick="document.getElementById('f-ppFile').click()" class="text-[10px] bg-amber-500 text-black px-2 py-1 rounded font-bold">Uploader</button>
                                </div>
                                <input type="file" id="f-ppFile" class="hidden" accept="image/*" onchange="uploadArtist(this)">
                            </div>
                        </div>
                    </div>
                    <textarea name="bio" placeholder="Biographie" class="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white h-24">${artist ? artist.bio : ''}</textarea>
                    <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-white/5">
                        <button type="button" onclick="closeModal()" class="px-6 py-2 text-zinc-400 font-medium hover:text-white transition-colors">Annuler</button>
                        <button type="submit" class="px-6 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all">Enregistrer</button>
                    </div>
                </div>
            </form>
        `;
    }
}

function closeModal() {
    document.getElementById('modal-container').classList.add('hidden');
}

/**
 * API Actions (Supabase)
 */
async function saveSong(event, originalId) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    // Process tags
    data.tags = (data.tags || "").split(',').map(t => t.trim()).filter(Boolean);
    data.year = parseInt(data.year) || 2024;
    
    // Manual ID if new
    if (!originalId) {
        data.id = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    } else {
        data.id = originalId;
    }

    try {
        await SupabaseCMS.upsertSong(data);
        showToast("Titre enregistré !");
        closeModal();
        await syncFromSupabase();
    } catch (e) {
        console.error("Save error:", e);
        showToast(`Erreur : ${e.message}`);
    }
}

async function saveArtist(event, originalId) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
        await SupabaseCMS.upsertArtist(data);
        showToast("Artiste enregistré !");
        closeModal();
        await syncFromSupabase();
    } catch (e) {
        console.error("Save error:", e);
        showToast(`Erreur : ${e.message}`);
    }
}

async function uploadCover(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    try {
        const result = await SupabaseCMS.uploadImage('covers', file);
        document.getElementById('f-coverUrl').value = result.url;
        const preview = document.getElementById('cover-preview');
        preview.src = result.url;
        preview.classList.remove('hidden');
        document.getElementById('cover-icon').classList.add('hidden');
        showToast("Image uploadée !");
    } catch (err) {
        console.error("Upload error:", err);
        showToast("Erreur d'upload.");
    }
}

async function uploadArtist(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    try {
        const result = await SupabaseCMS.uploadImage('artists', file);
        document.getElementById('f-ppUrl').value = result.url;
        const preview = document.getElementById('pp-preview');
        preview.src = result.url;
        preview.classList.remove('hidden');
        document.getElementById('pp-icon').classList.add('hidden');
        showToast("Photo uploadée !");
    } catch (err) {
        console.error("Upload error:", err);
        showToast("Erreur d'upload.");
    }
}

async function deleteItem(type, id) {
    if (!confirm(`Confirmer la suppression de cet élément (${type}) ?`)) return;

    try {
        if (type === 'song') {
            await SupabaseCMS.deleteSong(id);
        } else {
            await SupabaseCMS.deleteArtist(id);
        }
        showToast("Supprimé !");
        await syncFromSupabase();
    } catch (e) {
        showToast("Erreur lors de la suppression.");
    }
}

async function takeCmsAction(id, status) {
    showToast(`Action ${status} enregistrée (simulation)`);
}

/**
 * Gallery Pickers
 */
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
        const covers = await SupabaseCMS.listImages('covers');
        const list = document.getElementById('gallery-picker-list');
        
        if (covers.length === 0) {
            list.innerHTML = `<p class="col-span-full text-center text-zinc-500 py-20">Aucune image dans la galerie.</p>`;
            return;
        }

        list.innerHTML = covers.map(c => `
            <div onclick="selectCoverForSong('${c.url.replace(/'/g, "\\'")}')" class="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all aspect-square relative group">
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

async function openPPGalleryPicker() {
    const galleryContainer = document.createElement('div');
    galleryContainer.id = 'pp-gallery-picker';
    galleryContainer.className = 'fixed inset-0 bg-black/90 backdrop-blur-xl z-[70] flex flex-col p-8';
    galleryContainer.innerHTML = `
        <div class="flex justify-between items-center mb-8">
            <h3 class="text-2xl text-white font-bold">Sélectionner une Photo de Profil</h3>
            <button onclick="document.getElementById('pp-gallery-picker').remove()" class="text-zinc-500 hover:text-white">
                <iconify-icon icon="solar:close-circle-bold" width="32"></iconify-icon>
            </button>
        </div>
        <div id="pp-gallery-picker-list" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-y-auto flex-1 pb-8">
            <div class="col-span-full py-10 text-center animate-pulse text-zinc-500">Chargement...</div>
        </div>
    `;
    document.body.appendChild(galleryContainer);

    try {
        const pps = await SupabaseCMS.listImages('artists');
        const list = document.getElementById('pp-gallery-picker-list');
        
        if (pps.length === 0) {
            list.innerHTML = `<p class="col-span-full text-center text-zinc-500 py-20">Aucune photo dans la galerie.</p>`;
            return;
        }

        list.innerHTML = pps.map(p => `
            <div onclick="selectPhotoForArtist('${p.url.replace(/'/g, "\\'")}')" class="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all aspect-square relative group">
                <img src="${p.url}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p class="absolute bottom-2 left-2 right-2 text-[10px] text-white/80 truncate">${p.filename}</p>
            </div>
        `).join('');
    } catch (err) {
        galleryContainer.remove();
        showToast("Erreur de chargement.");
    }
}

function selectPhotoForArtist(url) {
    const preview = document.getElementById('pp-preview');
    const icon = document.getElementById('pp-icon');
    const hidden = document.getElementById('f-ppUrl');
    
    if (preview && hidden) {
        preview.src = url;
        preview.classList.remove('hidden');
        if (icon) icon.classList.add('hidden');
        hidden.value = url;
    }
    
    const picker = document.getElementById('pp-gallery-picker');
    if (picker) picker.remove();
}

/**
 * Editorial Actions
 */
function editSong(id) {
    openModal('edit-song', id);
}

function editArtist(id) {
    openModal('edit-artist', id);
}

/**
 * Utility functions
 */
function copyToClipboard(elementId) {
    const el = document.getElementById(elementId);
    el.select();
    document.execCommand('copy');
    showToast("Code copié !");
}

function copyToClipboardText(text) {
    navigator.clipboard.writeText(text);
    showToast("URL copiée !");
}

function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-6 right-6 z-[100] flex flex-col gap-2';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'bg-zinc-900 border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-medium shadow-2xl flex items-center gap-2 transform translate-y-10 opacity-0 transition-all duration-300';
    toast.innerHTML = `<iconify-icon icon="solar:check-circle-bold" class="text-amber-500" width="18"></iconify-icon> <span>${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    });
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Start CMS — wait for auth check
document.addEventListener('DOMContentLoaded', async () => {
    const session = await SupabaseCMS.getSession();
    if (session) {
        document.getElementById('login-view').classList.add('hidden');
        document.getElementById('admin-view').classList.remove('hidden');
        document.getElementById('admin-view').style.display = 'flex';
        initCMS();
    }
});
