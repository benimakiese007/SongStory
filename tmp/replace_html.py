import sys
import os

path = r'c:\Users\tmaut\Downloads\THE PHOENIX\SongStory\single-song.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """<button id="karaoke-toggle" class="karaoke-toggle-btn">
                        <iconify-icon icon="solar:eye-linear" width="14"></iconify-icon>Mode Karaoké
                    </button>"""
replacement1 = """<button id="karaoke-toggle" class="karaoke-toggle-btn active">
                        <iconify-icon icon="solar:eye-linear" width="14"></iconify-icon><span>Afficher les Décryptages</span>
                    </button>"""

target2 = """<div class="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
                <!-- Lyrics + Story Blocks (Rendered by JS) -->
                <div id="narrative-wrapper"
                    class="lg:col-span-7 font-serif text-lg md:text-xl leading-relaxed text-zinc-500 space-y-12">
                    <div class="py-20 text-center col-span-full">
                        <p class="text-zinc-600">Chargement de l'analyse...</p>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-5 relative">
                    <div class="sticky top-24 space-y-6">
                        <div id="dynamic-analysis-card"
                            class="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50 relative overflow-hidden transition-all duration-500">
                            <div class="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                            <div class="flex items-center gap-2 mb-4">
                                <iconify-icon icon="solar:info-circle-linear" class="text-amber-400"
                                    width="20"></iconify-icon>
                                <h4 class="text-sm font-medium text-white tracking-tight">Analyse de la ligne</h4>
                            </div>
                            <div id="analysis-placeholder" class="space-y-4 text-sm text-zinc-400 leading-relaxed">
                                <p>Cliquez sur une ligne de texte pour voir son décryptage ici.</p>
                            </div>
                        </div>
                        <div id="song-info-card" class="bg-zinc-900/20 border border-white/5 rounded-2xl p-6">
                            <h4 class="text-sm font-medium text-white tracking-tight mb-4 flex items-center gap-2">
                                <iconify-icon icon="solar:music-library-2-linear" class="text-zinc-500"
                                    width="18"></iconify-icon>
                                Informations
                            </h4>
                            <div id="info-grid" class="space-y-3 text-xs">
                                <!-- Filled by JS -->
                            </div>
                        </div>
                        <!-- Extended Information Block -->
                        <div id="streaming-platform-card"
                            class="bg-zinc-900/40 border border-white/10 rounded-2x1 p-6 relative overflow-hidden transition-all duration-500">
                            <h4 class="text-sm font-medium text-white tracking-tight mb-4 flex items-center gap-2">
                                <iconify-icon icon="solar:play-circle-linear" class="text-amber-400"
                                    width="18"></iconify-icon>
                                Écouter sur vos plateformes
                            </h4>
                            <div id="unified-player-loading" class="text-xs text-zinc-500 italic mb-4">Initialisation du
                                lecteur universel...</div>
                            <div id="unified-player-container" class="hidden"></div>
                        </div>
                    </div>
                </div>
            </div>"""
replacement2 = """<div class="max-w-4xl mx-auto relative relative-lyrics-container">
                <!-- Lyrics + Story Blocks (Rendered by JS) -->
                <div id="narrative-wrapper"
                    class="font-sans text-3xl md:text-5xl font-extrabold leading-tight text-zinc-600 space-y-6 pb-[50vh]">
                    <div class="py-20 text-center">
                        <p class="text-zinc-500 text-xl font-normal">Chargement de la chanson...</p>
                    </div>
                </div>
            </div>

            <!-- Decrypt Bubble Container -->
            <div id="decrypt-bubble" class="decrypt-bubble">
                <div class="bubble-header">
                    <iconify-icon icon="solar:info-circle-linear" class="text-amber-400" width="18"></iconify-icon>
                    <span>Décryptage SongStory</span>
                </div>
                <div id="bubble-content" class="bubble-content"></div>
            </div>"""

content_norm = content.replace('\r\n', '\n')
old_len = len(content_norm)

content_norm = content_norm.replace(target1, replacement1)

if content_norm.find(target2) != -1:
    content_norm = content_norm.replace(target2, replacement2)
else:
    print("WARNING: target2 not found!")

if len(content_norm) == old_len:
    print('Failed to replace.')
else:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content_norm)
    print('Replaced successfully.')
