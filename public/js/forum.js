/**
 * SongStory — Forum Module
 * Handles thread listing, thread view, and post management.
 */

const SongStoryForum = {
    currentThreadId: null,

    async init() {
        console.log('[SongStoryForum] Initializing...');
        this.cacheElements();
        this.bindEvents();
        await this.loadThreads();
    },

    cacheElements() {
        this.threadListContainer = document.getElementById('thread-list-container');
        this.threadViewContainer = document.getElementById('thread-view-container');
        this.newThreadModal = document.getElementById('new-thread-modal');
        this.loader = document.getElementById('forum-loader');
    },

    bindEvents() {
        document.getElementById('new-thread-btn')?.addEventListener('click', () => this.toggleNewThreadModal(true));
        document.getElementById('cancel-thread-btn')?.addEventListener('click', () => this.toggleNewThreadModal(false));
        document.getElementById('submit-thread-btn')?.addEventListener('click', () => this.createThread());
        document.getElementById('back-to-list-btn')?.addEventListener('click', () => this.showThreadList());
        document.getElementById('submit-reply-btn')?.addEventListener('click', () => this.submitReply());
    },

    toggleNewThreadModal(show) {
        const user = window.ss_supabase?.auth?.getUser();
        if (show && !window.ss_supabase?.auth?.session() && !localStorage.getItem('supabase.auth.token')) {
            // Simplified check, in reality SongStoryAuth.getUser() would be better
            alert('Veuillez vous connecter pour créer un sujet.');
            window.location.href = 'account.html';
            return;
        }
        this.newThreadModal.classList.toggle('hidden', !show);
    },

    async loadThreads() {
        if (!window.ss_supabase) return;
        
        try {
            const { data: threads, error } = await window.ss_supabase
                .from('forum_threads')
                .select('*')
                .order('last_post_at', { ascending: false });

            if (error) throw error;

            this.loader.classList.add('hidden');
            this.threadListContainer.innerHTML = '';

            if (!threads || threads.length === 0) {
                this.threadListContainer.innerHTML = `
                    <div class="py-20 text-center border border-white/5 rounded-3xl bg-zinc-900/20">
                        <iconify-icon icon="solar:chat-round-dots-linear" width="48" class="text-zinc-700 mb-4"></iconify-icon>
                        <p class="text-zinc-500">Aucune discussion pour le moment. Soyez le premier !</p>
                    </div>
                `;
                return;
            }

            threads.forEach(thread => {
                const threadEl = this.createThreadCard(thread);
                this.threadListContainer.appendChild(threadEl);
            });
        } catch (err) {
            console.error('[SongStoryForum] Error loading threads:', err);
            this.loader.innerHTML = '<p class="text-red-400">Erreur lors du chargement des discussions.</p>';
        }
    },

    createThreadCard(thread) {
        const div = document.createElement('div');
        div.className = 'bg-zinc-900/40 border border-white/5 p-6 rounded-2xl hover:bg-zinc-900/60 transition-all cursor-pointer group shadow-lg';
        const date = new Date(thread.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        
        div.innerHTML = `
            <div class="flex items-start justify-between gap-4">
                <div>
                    <span class="text-[10px] uppercase tracking-widest text-amber-400/60 font-medium mb-1 block">${thread.category}</span>
                    <h3 class="text-lg text-white font-medium group-hover:text-amber-400 transition-colors line-clamp-1">${thread.title}</h3>
                    <p class="text-xs text-zinc-600 mt-2">Démarré par <span class="text-zinc-500">${thread.author_name}</span> • ${date}</p>
                </div>
                <div class="flex items-center gap-1.5 text-zinc-500">
                    <iconify-icon icon="solar:chat-square-dots-linear" width="16"></iconify-icon>
                    <span class="text-xs font-medium">Voir</span>
                </div>
            </div>
        `;

        div.onclick = () => this.showThreadView(thread);
        return div;
    },

    async showThreadView(thread) {
        this.currentThreadId = thread.id;
        this.threadListContainer.classList.add('hidden');
        document.getElementById('new-thread-btn').classList.add('hidden');
        this.threadViewContainer.classList.remove('hidden');

        document.getElementById('viewing-thread-title').textContent = thread.title;
        document.getElementById('thread-author-name').textContent = thread.author_name;
        document.getElementById('thread-date').textContent = new Date(thread.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

        await this.loadPosts(thread.id);
    },

    showThreadList() {
        this.currentThreadId = null;
        this.threadViewContainer.classList.add('hidden');
        document.getElementById('new-thread-btn').classList.remove('hidden');
        this.threadListContainer.classList.remove('hidden');
        this.loadThreads();
    },

    async loadPosts(threadId) {
        const postsList = document.getElementById('posts-list');
        postsList.innerHTML = '<div class="text-center py-10"><div class="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-amber-400 border-r-2 border-transparent"></div></div>';

        try {
            const { data: posts, error } = await window.ss_supabase
                .from('forum_posts')
                .select('*')
                .eq('thread_id', threadId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            postsList.innerHTML = '';
            posts.forEach(post => {
                const postEl = this.createPostEl(post);
                postsList.appendChild(postEl);
            });
        } catch (err) {
            console.error('[SongStoryForum] Error loading posts:', err);
            postsList.innerHTML = '<p class="text-red-400">Erreur lors du chargement des messages.</p>';
        }
    },

    createPostEl(post) {
        const div = document.createElement('div');
        div.className = 'bg-zinc-900/20 border border-white/5 rounded-2xl p-6';
        const date = new Date(post.created_at).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        
        div.innerHTML = `
            <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-amber-400 border border-white/5 flex-shrink-0">
                    ${post.author_avatar ? `<img src="${post.author_avatar}" class="w-full h-full rounded-full object-cover">` : post.author_name.charAt(0).toUpperCase()}
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-white">${post.author_name}</span>
                        <span class="text-[10px] text-zinc-600">${date}</span>
                    </div>
                    <p class="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">${post.content}</p>
                </div>
            </div>
        `;
        return div;
    },

    async createThread() {
        const title = document.getElementById('thread-title').value.trim();
        const content = document.getElementById('thread-content').value.trim();
        
        if (!title || !content) return;

        const { data: { user } } = await window.ss_supabase.auth.getUser();
        if (!user) return alert('Désolé, vous devez être connecté.');

        const pseudo = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];

        try {
            // 1. Create Thread
            const { data: thread, error: tErr } = await window.ss_supabase
                .from('forum_threads')
                .insert([{ 
                    title, 
                    author_id: user.id, 
                    author_name: pseudo,
                    category: 'Général'
                }])
                .select()
                .single();

            if (tErr) throw tErr;

            // 2. Create Initial Post
            const { error: pErr } = await window.ss_supabase
                .from('forum_posts')
                .insert([{
                    thread_id: thread.id,
                    author_id: user.id,
                    author_name: pseudo,
                    content: content,
                    author_avatar: user.user_metadata?.avatar_url || null
                }]);

            if (pErr) throw pErr;

            document.getElementById('thread-title').value = '';
            document.getElementById('thread-content').value = '';
            this.toggleNewThreadModal(false);
            this.loadThreads();
        } catch (err) {
            console.error('[SongStoryForum] Error creating thread:', err);
            alert('Erreur lors de la création du sujet.');
        }
    },

    async submitReply() {
        const content = document.getElementById('reply-content').value.trim();
        if (!content || !this.currentThreadId) return;

        const { data: { user } } = await window.ss_supabase.auth.getUser();
        if (!user) return alert('Veuillez vous connecter pour répondre.');

        const pseudo = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];

        try {
            const { error } = await window.ss_supabase
                .from('forum_posts')
                .insert([{
                    thread_id: this.currentThreadId,
                    author_id: user.id,
                    author_name: pseudo,
                    content: content,
                    author_avatar: user.user_metadata?.avatar_url || null
                }]);

            if (error) throw error;

            // Update thread last_post_at
            await window.ss_supabase
                .from('forum_threads')
                .update({ last_post_at: new Date().toISOString() })
                .eq('id', this.currentThreadId);

            document.getElementById('reply-content').value = '';
            this.loadPosts(this.currentThreadId);
        } catch (err) {
            console.error('[SongStoryForum] Error replying:', err);
            alert('Erreur lors de l\'envoi de la réponse.');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => SongStoryForum.init());
