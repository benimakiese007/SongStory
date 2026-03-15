/**
 * SongStory — Song Interactions (Ratings & Comments)
 * Handles submission and display of user ratings and comments.
 */

const SongStoryInteractions = {
    selectedRating: 0,
    songId: null,

    init() {
        console.log('[SongStoryInteractions] Initializing...');
        // Identify song from URL or window
        const path = window.location.pathname;
        this.songId = path.split('/').pop().replace('.html', '');
        
        if (this.songId === 'single-song') {
            const urlParams = new URLSearchParams(window.location.search);
            this.songId = urlParams.get('id');
        }

        if (!this.songId) return;

        this.cacheElements();
        this.bindEvents();
        this.loadInteractions();
    },

    cacheElements() {
        this.stars = document.querySelectorAll('.star-btn');
        this.submitBtn = document.getElementById('submit-interaction-btn');
        this.commentInput = document.getElementById('interaction-comment');
        this.list = document.getElementById('interactions-list');
        this.avgValue = document.getElementById('avg-rating-value');
    },

    bindEvents() {
        this.stars.forEach(btn => {
            btn.addEventListener('click', () => {
                const rating = parseInt(btn.dataset.star);
                this.updateStarUI(rating);
            });
        });

        this.submitBtn?.addEventListener('click', () => this.submitInteraction());
    },

    updateStarUI(rating) {
        this.selectedRating = rating;
        this.stars.forEach(btn => {
            const starValue = parseInt(btn.dataset.star);
            if (starValue <= rating) {
                btn.classList.add('text-amber-400');
                btn.classList.remove('text-zinc-800');
            } else {
                btn.classList.remove('text-amber-400');
                btn.classList.add('text-zinc-800');
            }
        });
    },

    async loadInteractions() {
        if (!window.ss_supabase) return;

        try {
            const { data: interactions, error } = await window.ss_supabase
                .from('song_interactions')
                .select('*')
                .eq('song_id', this.songId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.renderInteractions(interactions);
            this.calculateAverage(interactions);
        } catch (err) {
            console.error('[SongStoryInteractions] Error loading interactions:', err);
        }
    },

    renderInteractions(interactions) {
        if (!interactions || interactions.length === 0) {
            this.list.innerHTML = '<p class="text-zinc-600 text-sm italic py-10 text-center">Aucun avis pour le moment.</p>';
            return;
        }

        this.list.innerHTML = '';
        interactions.forEach(item => {
            const div = document.createElement('div');
            div.className = 'bg-zinc-950/20 border border-white/5 rounded-2xl p-5';
            const date = new Date(item.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
            
            // Generate star icons
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                starsHtml += `<iconify-icon icon="solar:star-bold" class="${i <= item.rating ? 'text-amber-400' : 'text-zinc-800'}" width="12"></iconify-icon>`;
            }

            div.innerHTML = `
                <div class="flex items-start gap-4">
                    <div class="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-medium text-amber-400 border border-white/5 flex-shrink-0">
                        ${item.user_avatar ? `<img src="${item.user_avatar}" class="w-full h-full rounded-full object-cover">` : (item.user_name ? item.user_name.charAt(0).toUpperCase() : '?')}
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-medium text-white">${item.user_name || 'Anonyme'}</span>
                            <span class="text-[10px] text-zinc-600">${date}</span>
                        </div>
                        <div class="flex gap-0.5 mb-2">${starsHtml}</div>
                        <p class="text-xs text-zinc-400 leading-relaxed">${item.comment || ''}</p>
                    </div>
                </div>
            `;
            this.list.appendChild(div);
        });
    },

    calculateAverage(interactions) {
        if (!interactions || interactions.length === 0) {
            this.avgValue.textContent = '--';
            return;
        }
        const total = interactions.reduce((sum, item) => sum + item.rating, 0);
        const avg = (total / interactions.length).toFixed(1);
        this.avgValue.textContent = avg;
    },

    async submitInteraction() {
        if (this.selectedRating === 0) {
            alert('Veuillez sélectionner une note.');
            return;
        }

        const comment = this.commentInput.value.trim();
        const { data: { user } } = await window.ss_supabase.auth.getUser();
        
        if (!user) {
            alert('Veuillez vous connecter pour laisser un avis.');
            window.location.href = 'account.html';
            return;
        }

        const pseudo = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];

        try {
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = 'Publication...';

            const { error } = await window.ss_supabase
                .from('song_interactions')
                .insert([{
                    song_id: this.songId,
                    user_id: user.id,
                    user_name: pseudo,
                    user_avatar: user.user_metadata?.avatar_url || null,
                    rating: this.selectedRating,
                    comment: comment
                }]);

            if (error) throw error;

            this.commentInput.value = '';
            this.updateStarUI(0);
            this.loadInteractions();
            
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = 'Publier mon avis';
            alert('Merci pour votre avis !');
        } catch (err) {
            console.error('[SongStoryInteractions] Error submitting interaction:', err);
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = 'Publier mon avis';
            alert('Erreur lors de la publication.');
        }
    }
};

// Auto-init for song pages
if (window.location.pathname.includes('single-song') || window.location.pathname.includes('/songs/')) {
    document.addEventListener('DOMContentLoaded', () => SongStoryInteractions.init());
}
