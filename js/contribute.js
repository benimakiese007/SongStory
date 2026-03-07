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

    async function getAll() {
        if (!window.ss_supabase) return [];
        const { data, error } = await window.ss_supabase.from('contributions').select('*');
        return error ? [] : data;
    }

    async function submit(data) {
        if (!data.songId || !data.type || !data.text?.trim()) return { ok: false, error: 'Données invalides.' };

        const entry = {
            id: Date.now().toString(),
            song_id: data.songId,
            line_ref: data.lineRef || '',
            type: data.type,
            text: data.text.trim(),
            author: data.author || 'Anonyme',
            status: 'pending',
            created_at: new Date().toISOString()
        };

        if (!window.ss_supabase) {
            console.warn('Supabase not connected. Falling back to local storage.');
            const localData = JSON.parse(localStorage.getItem(KEY) || '[]');
            localData.push(entry);
            localStorage.setItem(KEY, JSON.stringify(localData));
            return { ok: true, entry: entry };
        }

        const { data: inserted, error } = await window.ss_supabase.from('contributions').insert([entry]).select().single();

        if (error) return { ok: false, error: error.message };
        return { ok: true, entry: inserted };
    }

    async function updateStatus(id, status) {
        if (!window.ss_supabase) return;
        await window.ss_supabase.from('contributions').update({ status }).eq('id', id);
    }

    async function remove(id) {
        if (!window.ss_supabase) return;
        await window.ss_supabase.from('contributions').delete().eq('id', id);
    }

    async function getApproved(songId) {
        if (!window.ss_supabase) return [];
        const { data, error } = await window.ss_supabase
            .from('contributions')
            .select('*')
            .eq('song_id', songId)
            .eq('status', 'approved');
        return error ? [] : data;
    }

    return { getAll, submit, updateStatus, remove, getApproved, TYPES };

})();
