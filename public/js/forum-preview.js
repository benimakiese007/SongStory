/**
 * SongStory — Forum Preview Module
 * Fetches and displays the 10 most recent forum messages.
 */

const SongStoryForumPreview = {
    async init() {
        console.log('[SongStoryForumPreview] Initializing...');
        const container = document.getElementById('forum-preview-container');
        if (!container) return;

        await this.loadLatestMessages(container);
    },

    async loadLatestMessages(container) {
        if (!window.ss_supabase) return;

        try {
            // Fetch the 10 latest posts
            // We need the thread title too, so we join on forum_threads
            const { data: posts, error } = await window.ss_supabase
                .from('forum_posts')
                .select(`
                    id,
                    content,
                    created_at,
                    author_name,
                    author_avatar,
                    thread_id,
                    forum_threads (
                        title
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;

            this.render(container, posts);
        } catch (err) {
            console.error('[SongStoryForumPreview] Error loading latest messages:', err);
            container.innerHTML = '<p class="text-zinc-500 text-sm">Impossible de charger les derniers messages.</p>';
        }
    },

    render(container, posts) {
        if (!posts || posts.length === 0) {
            container.innerHTML = '<p class="text-zinc-500 text-sm">Aucun message pour le moment.</p>';
            return;
        }

        const html = posts.map(post => {
            const date = new Date(post.created_at).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const threadTitle = post.forum_threads?.title || 'Discussion';
            const avatar = post.author_avatar 
                ? `<img src="${post.author_avatar}" class="w-full h-full rounded-full object-cover">` 
                : post.author_name.charAt(0).toUpperCase();

            return `
                <a href="forum.html?thread=${post.thread_id}" class="block group">
                    <div class="bg-zinc-900/30 border border-white/5 p-4 rounded-2xl hover:bg-zinc-900/50 transition-all h-full shadow-sm hover:shadow-md">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-medium text-amber-400 border border-white/5 flex-shrink-0">
                                ${avatar}
                            </div>
                            <div class="min-w-0">
                                <div class="text-xs font-medium text-white truncate">${post.author_name}</div>
                                <div class="text-[10px] text-zinc-600">${date}</div>
                            </div>
                        </div>
                        <div class="mb-2">
                            <span class="text-[9px] uppercase tracking-wider text-amber-500/60 font-medium block mb-1">Dans: ${threadTitle}</span>
                            <p class="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                                ${post.content}
                            </p>
                        </div>
                        <div class="flex items-center gap-1 text-[10px] text-zinc-600 group-hover:text-amber-400/80 transition-colors mt-auto">
                            <span>Voir la discussion</span>
                            <iconify-icon icon="solar:arrow-right-linear" width="12"></iconify-icon>
                        </div>
                    </div>
                </a>
            `;
        }).join('');

        container.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                ${html}
            </div>
        `;
    }
};

// Initialize if on a page with the container
document.addEventListener('DOMContentLoaded', () => SongStoryForumPreview.init());
// Also trigger if data is ready (for potential SPA navigation or dynamic loads)
window.addEventListener('ss:dataready', () => SongStoryForumPreview.init());
