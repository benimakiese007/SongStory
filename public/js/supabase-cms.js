/**
 * SongStory — Supabase CMS Layer
 * Replaces Node.js cms-server.js with direct Supabase calls.
 * Requires supabase-client.js to be loaded first.
 */

const SupabaseCMS = (() => {

    function _client() {
        return window.ss_supabase;
    }

    // ─── Auth ────────────────────────────────────────────────

    async function signInWithGoogle() {
        const client = _client();
        if (!client) return { error: { message: 'Supabase non disponible.' } };

        const { data, error } = await client.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.href,
            },
        });
        return { data, error };
    }

    async function signOut() {
        const client = _client();
        if (!client) return;
        await client.auth.signOut();
    }

    async function getUser() {
        const client = _client();
        if (!client) return null;
        const { data } = await client.auth.getUser();
        return data?.user || null;
    }

    async function getSession() {
        const client = _client();
        if (!client) return null;
        const { data } = await client.auth.getSession();
        return data?.session || null;
    }

    // ─── Songs CRUD ──────────────────────────────────────────

    async function getAllSongs() {
        const client = _client();
        if (!client) return [];
        // Try with created_at sort, fallback to no sort if column missing
        let result = await client
            .from('songs')
            .select('*')
            .order('created_at', { ascending: false });
        if (result.error) {
            console.warn('getAllSongs: created_at sort failed, retrying without sort:', result.error.message);
            result = await client.from('songs').select('*');
        }
        if (result.error) { console.error('getAllSongs error:', result.error); return []; }
        return result.data || [];
    }

    async function upsertSong(song) {
        const client = _client();
        if (!client) throw new Error('Supabase non disponible.');
        const { data, error } = await client
            .from('songs')
            .upsert(song, { onConflict: 'id' })
            .select();
        if (error) throw error;
        return data;
    }

    async function deleteSong(id) {
        const client = _client();
        if (!client) throw new Error('Supabase non disponible.');
        const { error } = await client.from('songs').delete().eq('id', id);
        if (error) throw error;
    }

    // ─── Artists CRUD ────────────────────────────────────────

    async function getAllArtists() {
        const client = _client();
        if (!client) return [];
        // Try with updated_at sort, fallback to no sort if column missing
        let result = await client
            .from('artists')
            .select('*')
            .order('updated_at', { ascending: false });
        if (result.error) {
            console.warn('getAllArtists: updated_at sort failed, retrying without sort:', result.error.message);
            result = await client.from('artists').select('*');
        }
        if (result.error) { console.error('getAllArtists error:', result.error); return []; }
        return result.data || [];
    }

    async function upsertArtist(artist) {
        const client = _client();
        if (!client) throw new Error('Supabase non disponible.');
        const { data, error } = await client
            .from('artists')
            .upsert(artist, { onConflict: 'id' })
            .select();
        if (error) throw error;
        return data;
    }

    async function deleteArtist(id) {
        const client = _client();
        if (!client) throw new Error('Supabase non disponible.');
        const { error } = await client.from('artists').delete().eq('id', id);
        if (error) throw error;
    }

    async function getAllContributions() {
        const client = _client();
        if (!client) return [];
        const { data, error } = await client
            .from('contributions')
            .select('*')
            .order('submitted_at', { ascending: false });
        if (error) { console.error('getAllContributions error:', error); return []; }
        return data || [];
    }

    // ─── Storage (Images) ────────────────────────────────────

    async function uploadImage(folder, file) {
        const client = _client();
        if (!client) throw new Error('Supabase non disponible.');

        const ext = file.name.split('.').pop().toLowerCase();
        const safeName = file.name
            .replace(/\.[^.]+$/, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') + '.' + ext;

        const filePath = `${folder}/${safeName}`;

        const { data, error } = await client.storage
            .from('media')
            .upload(filePath, file, { 
                upsert: true,
                contentType: file.type 
            });

        if (error) throw error;

        const { data: urlData } = client.storage
            .from('media')
            .getPublicUrl(filePath);

        return { url: urlData.publicUrl, path: filePath, filename: safeName };
    }

    async function listImages(folder) {
        const client = _client();
        if (!client) return [];

        const { data, error } = await client.storage
            .from('media')
            .list(folder, { limit: 200, sortBy: { column: 'name', order: 'asc' } });

        if (error) { console.error('listImages error:', error); return []; }

        return (data || [])
            .filter(f => /\.(webp|png|jpg|jpeg|gif)$/i.test(f.name))
            .map(f => {
                const { data: urlData } = client.storage
                    .from('media')
                    .getPublicUrl(`${folder}/${f.name}`);
                return {
                    filename: f.name,
                    url: urlData.publicUrl,
                    path: `${folder}/${f.name}`
                };
            });
    }

    async function deleteImage(filePath) {
        const client = _client();
        if (!client) throw new Error('Supabase non disponible.');
        const { error } = await client.storage.from('media').remove([filePath]);
        if (error) throw error;
    }

    // ─── Helpers ──────────────────────────────────────────────

    async function uploadImageFromBase64(folder, filename, base64Data) {
        const client = _client();
        if (!client) throw new Error('Supabase non disponible.');

        const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '');
        const binary = atob(base64Clean);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        const ext = filename.split('.').pop().toLowerCase();
        const mimeMap = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif' };
        const contentType = mimeMap[ext] || 'image/webp';

        const safeName = filename
            .replace(/\.[^.]+$/, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') + '.' + ext;

        const filePath = `${folder}/${safeName}`;
        const blob = new Blob([bytes], { type: contentType });

        const { error } = await client.storage
            .from('media')
            .upload(filePath, blob, { upsert: true, contentType });

        if (error) throw error;

        const { data: urlData } = client.storage
            .from('media')
            .getPublicUrl(filePath);

        return { url: urlData.publicUrl, path: filePath, filename: safeName };
    }

    return {
        // Auth
        signInWithGoogle, signOut, getUser, getSession,
        // Songs
        getAllSongs, upsertSong, deleteSong,
        // Artists
        getAllArtists, upsertArtist, deleteArtist,
        // Contributions
        getAllContributions,
        // Storage
        uploadImage, listImages, deleteImage, uploadImageFromBase64,
    };

})();
