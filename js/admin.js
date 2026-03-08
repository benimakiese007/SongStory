/**
 * SongStory CMS Logic
 * Handles dashboard data, moderation, and navigation.
 */

const CMS_CONFIG = {
    tabs: ['dashboard', 'songs', 'artists', 'moderation'],
    titles: {
        dashboard: 'Tableau de Bord',
        songs: 'Gestion des Titres',
        artists: 'Gestion des Artistes',
        moderation: 'Modération des Contributions'
    }
};

let currentTab = 'dashboard';
let currentModFilter = 'pending';

async function initCMS() {
    if (!window.ss_supabase) {
        console.error('Supabase client not found');
        return;
    }

    // Initial load
    await Promise.all([
        loadAllSongs(),
        loadAllArtists(),
        loadAllContributions()
    ]);

    updateDashboardStats();
    renderSongsTable();
    renderArtistsGrid();
    renderModerationFull();
    switchTab('dashboard');
}

let SONGS_DATA_DB = [];
let ARTISTS_DATA_DB = [];
let CONTRIBS_DATA_DB = [];

async function loadAllSongs() {
    const { data, error } = await window.ss_supabase.from('songs').select('*').order('created_at', { ascending: false });
    if (!error) SONGS_DATA_DB = data;
}

async function loadAllArtists() {
    const { data, error } = await window.ss_supabase.from('artists').select('*').order('name');
    if (!error) ARTISTS_DATA_DB = data;
}

async function loadAllContributions() {
    const { data, error } = await window.ss_supabase.from('contributions').select('*').order('submitted_at', { ascending: false });
    if (!error) CONTRIBS_DATA_DB = data;
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
            <button class="text-zinc-600 hover:text-white" onclick="editSong('${s.id}')">
                <iconify-icon icon="solar:pen-bold" width="18"></iconify-icon>
            </button>
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
            <form id="cms-form" onsubmit="handleFormSubmit(event, 'song', '${isEdit ? s.id : ''}')" class="space-y-4">
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
                        <label class="block text-xs text-zinc-500 mb-1">Artiste</label>
                        <input type="text" id="f-artist" value="${s.artist || ''}" required class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
                    </div>
                    <div>
                        <label class="block text-xs text-zinc-500 mb-1">ID de l'artiste</label>
                        <input type="text" id="f-artistId" value="${s.artistId || ''}" required class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
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
            <form id="cms-form" onsubmit="handleFormSubmit(event, 'artist', '${isEdit ? a.id : ''}')" class="space-y-4">
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
async function handleFormSubmit(e, type, existingId) {
    e.preventDefault();

    if (!window.ss_supabase) {
        showToast("Erreur: Supabase non connecté.");
        return;
    }

    const id = document.getElementById('f-id').value.trim();
    let dataObj = {};

    if (type === 'song') {
        const artistId = document.getElementById('f-artistId').value.trim();
        dataObj = {
            id: id,
            title: document.getElementById('f-title').value.trim(),
            artist_id: artistId,
            genre: document.getElementById('f-genre').value.trim(),
            year: parseInt(document.getElementById('f-year').value, 10),
            tags: document.getElementById('f-tags').value.split(',').map(t => t.trim()).filter(t => t),
            description: document.getElementById('f-desc').value.trim(),
            url: `single-song.html?id=${id}`,
            audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder
            spotify_id: document.getElementById('f-spotifyId').value.trim(),
            apple_music_id: document.getElementById('f-appleMusicId').value.trim()
        };
        const duration = document.getElementById('f-duration').value.trim();
        if (duration) dataObj.duration = duration;

    } else if (type === 'artist') {
        dataObj = {
            id: id,
            name: document.getElementById('f-name').value.trim(),
            genre: document.getElementById('f-genre').value.trim(),
            country: document.getElementById('f-country').value.trim(),
            bio: document.getElementById('f-bio').value.trim(),
            influence: document.getElementById('f-influence').value.trim(),
            url: `artists/${id}.html`,
            tags: document.getElementById('f-tags').value.split(',').map(t => t.trim()).filter(t => t)
        };
    }

    let error;
    if (existingId) {
        ({ error } = await window.ss_supabase.from(type + 's').update(dataObj).eq('id', existingId));
    } else {
        ({ error } = await window.ss_supabase.from(type + 's').insert([dataObj]));
    }

    if (error) {
        alert("Erreur: " + error.message);
    } else {
        showToast(existingId ? "Mis à jour avec succès !" : "Ajouté avec succès !");
        closeModal();
        // Refresh local data and UI
        if (type === 'song') await loadAllSongs();
        else await loadAllArtists();
        updateDashboardStats();
        if (type === 'song') renderSongsTable();
        else renderArtistsGrid();
    }
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
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${type === 'song' ? 'le titre' : 'l\'artiste'} "${id}" de la base de données ? Cette action est irréversible.`)) return;

    if (!window.ss_supabase) {
        showToast("Erreur: Supabase non connecté.");
        return;
    }

    const { error } = await window.ss_supabase.from(type + 's').delete().eq('id', id);

    if (error) {
        alert("Erreur lors de la suppression: " + error.message);
    } else {
        showToast("Supprimé avec succès !");
        if (type === 'song') {
            await loadAllSongs();
            renderSongsTable();
        } else {
            await loadAllArtists();
            renderArtistsGrid();
        }
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

    // Load existing content
    const { data: contents, error } = await window.ss_supabase
        .from('song_contents')
        .select('*')
        .eq('song_id', songId)
        .order('display_order');

    if (error) {
        showToast("Erreur lors du chargement du contenu");
        console.error(error);
        return;
    }

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
        id: c.id,
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

    if (!confirm("Voulez-vous vraiment écraser l'ancien contenu par celui-ci ?")) return;

    // 1. Delete existing content for this song
    const { error: delError } = await window.ss_supabase
        .from('song_contents')
        .delete()
        .eq('song_id', window.currentEditingSongId);

    if (delError) {
        alert("Erreur lors de la suppression de l'ancien contenu : " + delError.message);
        return;
    }

    // 2. Insert new blocks
    const insertData = window.editingBlocks.map(b => ({
        song_id: window.currentEditingSongId,
        time: b.time,
        lyrics: b.lyrics.split('\n').map(l => l.trim()).filter(l => l),
        analysis: b.analysis,
        display_order: b.display_order
    }));

    if (insertData.length > 0) {
        const { error: insError } = await window.ss_supabase
            .from('song_contents')
            .insert(insertData);

        if (insError) {
            alert("Erreur lors de l'insertion du nouveau contenu : " + insError.message);
            return;
        }
    }

    showToast("Contenu sauvegardé avec succès !");
    closeModal();
}
