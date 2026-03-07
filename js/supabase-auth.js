/**
 * SongStory — Supabase Auth Manager
 * Authentification via Google OAuth uniquement.
 */

const SongStorySupabaseAuth = (() => {

    function _client() {
        return window.ss_supabase;
    }

    // ─── Connexion Google OAuth ───────────────────────────────
    async function signInWithGoogle() {
        const client = _client();
        if (!client) return { error: { message: 'Supabase non disponible.' } };

        const redirectTo = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/') + 'account.html';

        const { data, error } = await client.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });
        return { data, error };
    }

    // ─── Déconnexion ──────────────────────────────────────────
    async function signOut() {
        const client = _client();
        if (!client) return;
        await client.auth.signOut();
        _dispatch();
    }

    // ─── Session/Utilisateur ──────────────────────────────────
    async function getSession() {
        const client = _client();
        if (!client) return null;
        const { data } = await client.auth.getSession();
        return data?.session || null;
    }

    async function getUser() {
        const client = _client();
        if (!client) return null;
        const { data } = await client.auth.getUser();
        return data?.user || null;
    }

    async function isLoggedIn() {
        const session = await getSession();
        return !!session;
    }

    // ─── Pseudo / Nom complet ─────────────────────────────────
    // Google fournit full_name, name, et avatar_url dans user_metadata
    function getPseudo(supabaseUser) {
        if (!supabaseUser) return '';
        const meta = supabaseUser.user_metadata || {};
        return meta.full_name || meta.name || meta.pseudo || supabaseUser.email?.split('@')[0] || 'Utilisateur';
    }

    function getAvatar(supabaseUser) {
        if (!supabaseUser) return null;
        return supabaseUser.user_metadata?.avatar_url || null;
    }

    function getInitials(name) {
        if (!name) return '?';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }

    // ─── Dispatch ─────────────────────────────────────────────
    function _dispatch() {
        window.dispatchEvent(new CustomEvent('ss:authchange', { detail: {} }));
    }

    // ─── Écoute les changements de session Supabase ───────────
    function init() {
        const client = _client();
        if (!client) return;

        // Try to sync immediately if session exists
        client.auth.getSession().then(({ data }) => {
            if (data?.session) _syncToLegacy(data.session.user);
        });

        client.auth.onAuthStateChange((event, session) => {
            if (session) {
                _syncToLegacy(session.user);
            } else if (event === 'SIGNED_OUT') {
                if (typeof SongStoryAuth !== 'undefined') SongStoryAuth.logout();
            }
            _dispatch();
        });
    }

    // Miroir vers SongStoryAuth pour un affichage immédiat (synchrone)
    function _syncToLegacy(supabaseUser) {
        if (!supabaseUser || typeof SongStoryAuth === 'undefined') return;
        const pseudo = getPseudo(supabaseUser);
        const email = supabaseUser.email;
        const avatarUrl = getAvatar(supabaseUser);
        // On évite de boucler en vérifiant si c'est déjà ok
        const current = SongStoryAuth.getUser();
        if (!current || current.email !== email || current.name !== pseudo || current.avatarUrl !== avatarUrl) {
            SongStoryAuth.login(pseudo, email, avatarUrl);
        }
    }

    return {
        signInWithGoogle, signOut,
        getSession, getUser, isLoggedIn,
        getPseudo, getAvatar, getInitials, init,
    };

})();

// Auto-init as soon as script loads to catch initial session events
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SongStorySupabaseAuth.init());
    } else {
        SongStorySupabaseAuth.init();
    }
}
