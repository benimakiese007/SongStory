/**
 * SongStory — Contributions System
 * Formulaire de suggestion + admin panel
 */

const SongStoryContrib = (() => {

    const KEY = 'ss_contributions';

    const TYPES = {
        correction: { label: 'Correction', icon: '✏️' },
        anecdote: { label: 'Anecdote', icon: '💡' },
        analyse: { label: 'Analyse alternative', icon: '🔍' },
        traduction: { label: 'Traduction / Contexte', icon: '🌍' },
    };

    function getAll() {
        try { return JSON.parse(localStorage.getItem(KEY)) || []; }
        catch { return []; }
    }

    function save(contributions) {
        localStorage.setItem(KEY, JSON.stringify(contributions));
    }

    function submit(data) {
        if (!data.songId || !data.type || !data.text?.trim()) return { ok: false, error: 'Données invalides.' };
        const contribs = getAll();
        const entry = {
            id: Date.now().toString(),
            songId: data.songId,
            lineRef: data.lineRef || '',
            type: data.type,
            text: data.text.trim(),
            author: data.author || 'Anonyme',
            status: 'pending', // pending | approved | rejected
            submittedAt: new Date().toISOString(),
        };
        contribs.push(entry);
        save(contribs);
        return { ok: true, entry };
    }

    function updateStatus(id, status) {
        const contribs = getAll();
        const entry = contribs.find(c => c.id === id);
        if (entry) {
            entry.status = status;
            save(contribs);
        }
    }

    function remove(id) {
        save(getAll().filter(c => c.id !== id));
    }

    function getApproved(songId) {
        return getAll().filter(c => c.songId === songId && c.status === 'approved');
    }

    return { getAll, submit, updateStatus, remove, getApproved, TYPES };

})();
