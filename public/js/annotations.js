/**
 * SongStory — Community Annotations Module
 * Handles text selection, modale and Supabase integration for user-suggested analysis.
 */

const SongStoryAnnotations = {
    songId: null,
    selectedText: '',
    lineIndex: -1,

    init() {
        console.log('[SongStoryAnnotations] Initializing...');
        this.songId = SongStoryRenderer.currentSong?.id || window.location.pathname.split('/').pop().replace('.html', '');
        
        if (!this.songId || this.songId === 'single-song') {
            const params = new URLSearchParams(window.location.search);
            this.songId = params.get('id');
        }

        if (!this.songId) return;

        this.initSelectionListener();
        this.initModale();
        this.loadAnnotations();
    },

    initSelectionListener() {
        const floatingBtn = document.createElement('button');
        floatingBtn.id = 'annotation-trigger';
        floatingBtn.className = 'fixed hidden z-[1000] bg-amber-500 text-zinc-950 rounded-full px-4 py-2 text-xs font-bold shadow-2xl flex items-center gap-2 hover:bg-white transition-all';
        floatingBtn.innerHTML = '<iconify-icon icon="solar:pen-new-round-bold" width="16"></iconify-icon> Annoter';
        document.body.appendChild(floatingBtn);

        document.addEventListener('mouseup', (e) => {
            const selection = window.getSelection();
            const text = selection.toString().trim();
            
            // Check if selection is within a lyric line
            const lyricLine = selection.anchorNode?.parentElement?.closest('.lyric-line');
            
            if (text && lyricLine) {
                this.selectedText = text;
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                
                floatingBtn.style.top = `${rect.top + window.scrollY - 40}px`;
                floatingBtn.style.left = `${rect.left + rect.width / 2}px`;
                floatingBtn.style.transform = 'translateX(-50%)';
                floatingBtn.classList.remove('hidden');
            } else {
                if (!e.target.closest('#annotation-trigger')) {
                    floatingBtn.classList.add('hidden');
                }
            }
        });

        floatingBtn.addEventListener('click', () => {
            this.openAnnotationModale();
            floatingBtn.classList.add('hidden');
        });
    },

    initModale() {
        const modaleHTML = `
        <div id="annotation-modal" class="fixed inset-0 z-[1100] hidden items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div class="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl text-white font-medium">Proposer une annotation</h3>
                    <button class="close-ann-modale text-zinc-500 hover:text-white"><iconify-icon icon="solar:close-circle-linear" width="24"></iconify-icon></button>
                </div>
                
                <div class="mb-6 p-4 bg-zinc-950/50 rounded-xl border border-white/5 italic text-sm text-zinc-400">
                    "${this.selectedText}"
                </div>

                <textarea id="ann-content" rows="5" class="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-amber-400 transition-all resize-none mb-6" placeholder="Expliquez le sens, la référence ou le contexte de cette ligne..."></textarea>
                
                <button id="submit-ann-btn" class="w-full py-4 bg-amber-500 text-zinc-950 rounded-2xl font-bold hover:bg-white transition-all flex items-center justify-center gap-2">
                    Envoyer ma proposition
                </button>
                <p class="text-[10px] text-zinc-600 mt-4 text-center">Votre analyse sera visible par tous après validation par l'équipe SongStory.</p>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modaleHTML);
        
        const modale = document.getElementById('annotation-modal');
        modale.querySelector('.close-ann-modale').addEventListener('click', () => modale.classList.add('hidden').remove('flex'));
        
        document.getElementById('submit-ann-btn').addEventListener('click', () => this.submitAnnotation());
    },

    openAnnotationModale() {
        const modale = document.getElementById('annotation-modal');
        modale.querySelector('.italic').textContent = `"${this.selectedText}"`;
        modale.classList.remove('hidden');
        modale.classList.add('flex');
        document.getElementById('ann-content').focus();
    },

    async submitAnnotation() {
        const content = document.getElementById('ann-content').value.trim();
        if (!content) return alert('Veuillez écrire une analyse.');

        const { data: { user } } = await window.ss_supabase.auth.getUser();
        if (!user) {
            alert('Veuillez vous connecter pour contribuer.');
            window.location.href = '../../account.html';
            return;
        }

        const btn = document.getElementById('submit-ann-btn');
        btn.disabled = true;
        btn.innerHTML = '<iconify-icon icon="svg-spinners:180-ring" width="20"></iconify-icon> Envoi...';

        try {
            const { error } = await window.ss_supabase
                .from('user_annotations')
                .insert([{
                    song_id: this.songId,
                    user_id: user.id,
                    user_name: user.user_metadata?.full_name || user.email.split('@')[0],
                    content: content,
                    quote: this.selectedText,
                    status: 'pending'
                }]);

            if (error) throw error;

            alert('Merci ! Votre proposition est en cours de validation.');
            document.getElementById('annotation-modal').classList.add('hidden');
            document.getElementById('ann-content').value = '';
        } catch (err) {
            console.error(err);
            alert('Erreur lors de l\'envoi.');
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Envoyer ma proposition';
        }
    },

    async loadAnnotations() {
        if (!window.ss_supabase) return;

        try {
            const { data: annotations, error } = await window.ss_supabase
                .from('user_annotations')
                .select('*')
                .eq('song_id', this.songId)
                .eq('status', 'approved');

            if (error) throw error;
            if (annotations) this.highlightAnnotatedText(annotations);
        } catch (err) {
            console.error(err);
        }
    },

    highlightAnnotatedText(annotations) {
        // This is complex because we need to match the substring in the DOM
        // For now, simpler: we'll look for exact matches in .lyric-line
        const lyricsLines = document.querySelectorAll('.lyric-line');
        annotations.forEach(ann => {
            lyricsLines.forEach(line => {
                const text = line.innerHTML;
                if (text.includes(ann.quote)) {
                    // Wrap with a span that triggers a popup
                    const wrapped = text.replace(ann.quote, `<span class="user-ann-link border-b-2 border-amber-500/50 cursor-pointer" data-id="${ann.id}">${ann.quote}</span>`);
                    line.innerHTML = wrapped;
                }
            });
        });

        // Add listeners to links
        document.querySelectorAll('.user-ann-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showAnnotationPopup(link, annotations.find(a => a.id === link.dataset.id));
            });
        });
    },

    showAnnotationPopup(anchor, ann) {
        // Reuse or create a popup similar to glossary but for user notes
        let popup = document.getElementById('ann-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'ann-popup';
            popup.className = 'fixed z-[1000] bg-zinc-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl max-w-sm hidden backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-300';
            document.body.appendChild(popup);
        }

        popup.innerHTML = `
            <div class="flex items-center gap-2 mb-3">
                <div class="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center text-[10px] font-bold">${ann.user_name[0]}</div>
                <span class="text-xs font-medium text-amber-400">Par ${ann.user_name}</span>
            </div>
            <p class="text-white text-sm leading-relaxed">${ann.content}</p>
            <div class="mt-4 flex items-center gap-4 text-zinc-500">
                 <button class="ann-vote-btn flex items-center gap-1 text-[10px] hover:text-white transition-colors" data-id="${ann.id}" data-type="1">
                    <iconify-icon icon="solar:alt-arrow-up-linear" width="14"></iconify-icon> Utile
                 </button>
                 <button class="ann-vote-btn flex items-center gap-1 text-[10px] hover:text-white transition-colors" data-id="${ann.id}" data-type="-1">
                    <iconify-icon icon="solar:alt-arrow-down-linear" width="14"></iconify-icon> Pas utile
                 </button>
            </div>
            <button class="absolute top-4 right-4 text-zinc-600 hover:text-white" onclick="document.getElementById('ann-popup').classList.add('hidden')">
                <iconify-icon icon="solar:close-circle-linear" width="18"></iconify-icon>
            </button>
        `;

        const rect = anchor.getBoundingClientRect();
        popup.style.top = `${rect.bottom + window.scrollY + 10}px`;
        popup.style.left = `${rect.left}px`;
        if (rect.left + 320 > window.innerWidth) popup.style.left = `${window.innerWidth - 340}px`;
        
        popup.classList.remove('hidden');
    }
};

// Auto-run if enabled
document.addEventListener('ss:dataready', () => SongStoryAnnotations.init());
// Also run on DOM load for static markers
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('/songs/')) SongStoryAnnotations.init();
});
