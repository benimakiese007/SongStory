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

function initCMS() {
    updateDashboardStats();
    renderSongsTable();
    renderArtistsGrid();
    renderModerationFull();
    switchTab('dashboard');
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
    const songsCount = typeof SONGS_DATA !== 'undefined' ? SONGS_DATA.length : 0;
    const artistsCount = typeof ARTISTS_DATA !== 'undefined' ? ARTISTS_DATA.length : 0;
    const allContribs = typeof SongStoryContrib !== 'undefined' ? SongStoryContrib.getAll() : [];
    const pendingCount = allContribs.filter(c => c.status === 'pending').length;

    document.getElementById('stat-songs').textContent = songsCount;
    document.getElementById('stat-artists').textContent = artistsCount;
    document.getElementById('stat-contribs').textContent = allContribs.length;
    document.getElementById('stat-pending-badge').textContent = `${pendingCount} à traiter`;

    // Recent Content
    const recentSongs = [...SONGS_DATA].reverse().slice(0, 4);
    document.getElementById('recent-songs-list').innerHTML = recentSongs.map(s => `
        <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <div class="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/5">
                <iconify-icon icon="solar:music-note-2-bold" class="text-zinc-600 group-hover:text-amber-500 transition-colors"></iconify-icon>
            </div>
            <div class="flex-1 min-w-0">
                <h5 class="text-sm font-medium text-white truncate">${s.title}</h5>
                <p class="text-xs text-zinc-500">${s.artist} • ${s.year}</p>
            </div>
            <button class="text-zinc-600 hover:text-white" onclick="editSong('${s.id}')">
                <iconify-icon icon="solar:pen-bold" width="18"></iconify-icon>
            </button>
        </div>
    `).join('');

    // Recent Contribs
    const recentContribs = [...allContribs].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 4);
    document.getElementById('recent-contribs-list').innerHTML = recentContribs.map(c => {
        const song = SONGS_DATA.find(s => s.id === c.songId);
        return `
        <div class="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all">
            <div class="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs border border-white/5">
                ${c.author.charAt(0)}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm text-zinc-300">
                    <span class="text-white font-medium">${c.author}</span> a suggéré une modification pour <span class="text-amber-500">${song ? song.title : c.songId}</span>
                </p>
                <p class="text-[10px] text-zinc-600 mt-1 uppercase font-bold tracking-wider">Il y a 2 heures</p>
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

    tbody.innerHTML = SONGS_DATA.map(s => `
        <tr class="hover:bg-white/5 transition-all group">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center border border-white/5">
                        <iconify-icon icon="solar:music-note-bold" class="text-zinc-500"></iconify-icon>
                    </div>
                    <span class="text-sm text-white font-medium">${s.title}</span>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-zinc-400">${s.artist}</td>
            <td class="px-6 py-4 text-sm text-zinc-400">${s.year}</td>
            <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button class="p-2 text-zinc-500 hover:text-white" title="Editer" onclick="editSong('${s.id}')">
                        <iconify-icon icon="solar:pen-bold" width="18"></iconify-icon>
                    </button>
                    <button class="p-2 text-zinc-500 hover:text-red-400" title="Supprimer">
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

    grid.innerHTML = ARTISTS_DATA.map(a => `
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
                <span class="text-xs text-zinc-600">${a.songs.length} titres analysés</span>
                <button class="text-xs text-amber-500 font-bold hover:text-amber-400 flex items-center gap-1">
                    Gérer <iconify-icon icon="solar:alt-arrow-right-bold"></iconify-icon>
                </button>
            </div>
        </div>
    `).join('');
}

function renderModerationFull() {
    const list = document.getElementById('contribs-list-full');
    if (!list) return;

    const all = typeof SongStoryContrib !== 'undefined' ? SongStoryContrib.getAll() : [];
    const filtered = all.filter(c => c.status === currentModFilter).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    if (!filtered.length) {
        list.innerHTML = `<div class="col-span-2 py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <iconify-icon icon="solar:box-minimalistic-bold-duotone" width="48" class="text-zinc-800 mb-2"></iconify-icon>
            <p class="text-zinc-600">Aucune contribution ${currentModFilter === 'pending' ? 'en attente' : 'approuvée'}.</p>
        </div>`;
        return;
    }

    list.innerHTML = filtered.map(c => {
        const song = SONGS_DATA.find(s => s.id === c.songId);
        const typeInfo = SongStoryContrib.TYPES[c.type] || { label: c.type, icon: '📌' };
        const d = new Date(c.submittedAt).toLocaleString('fr-FR');
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
                
                <h6 class="text-white font-medium text-sm mb-1">${song ? song.title : c.songId}</h6>
                <div class="text-xs text-zinc-500 mb-4 flex items-center gap-2">
                    <iconify-icon icon="solar:user-bold" width="12"></iconify-icon> ${c.author} 
                    <iconify-icon icon="solar:calendar-bold" width="12" class="ml-2"></iconify-icon> ${d}
                </div>

                ${c.lineRef ? `<div class="bg-amber-500/5 border-l-2 border-amber-500 p-2 mb-3 text-[11px] italic text-amber-200/70">"${c.lineRef}"</div>` : ''}
                
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
 * Modal System (Minimal implementation)
 */
function openModal(type, data = null) {
    const modal = document.getElementById('modal-container');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    modal.classList.remove('hidden');

    if (type === 'add-song') {
        title.textContent = 'Ajouter un nouveau titre';
        body.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                    <label class="block text-xs text-zinc-500 mb-1">Titre de la chanson</label>
                    <input type="text" class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
                </div>
                <div>
                    <label class="block text-xs text-zinc-500 mb-1">Artiste</label>
                    <input type="text" class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
                </div>
                <div>
                    <label class="block text-xs text-zinc-500 mb-1">Année</label>
                    <input type="number" class="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50">
                </div>
            </div>
        `;
    }
}

function closeModal() {
    document.getElementById('modal-container').classList.add('hidden');
}

function editSong(id) {
    alert(`Édition de ${id} (Bientôt disponible)`);
}
