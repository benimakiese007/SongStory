import os
import re

songs_dir = r'C:\Users\tmaut\Downloads\THE PHOENIX\SongStory\songs'
files = [f for f in os.listdir(songs_dir) if f.endswith('.html')]

navbar_btn = '<button class="layout-switch text-zinc-400 hover:text-white transition-colors" aria-label="Changer d\'affichage"><iconify-icon icon="solar:maximize-linear" width="20"></iconify-icon></button>'
bubble_html = """
    <!-- Decrypt Bubble Container -->
    <div id="decrypt-bubble" class="decrypt-bubble">
        <div class="bubble-header">
            <iconify-icon icon="solar:info-circle-linear" class="text-amber-400" width="18"></iconify-icon>
            <span>Décryptage SongStory</span>
        </div>
        <div id="bubble-content" class="bubble-content"></div>
    </div>
"""

for filename in files:
    path = os.path.join(songs_dir, filename)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Cleanup previous failed injection in <head>
    content = re.sub(r'<!-- Decrypt Bubble Container -->.*?</div>\s*</div>', '', content, flags=re.DOTALL)
    
    # 2. Add layout-switch in navbar if missing
    if 'layout-switch' not in content:
        content = content.replace('<button class="theme-switch"', navbar_btn + '<button class="theme-switch"')
    
    # 3. Add decrypt-bubble at the end of body if missing
    if 'id="decrypt-bubble"' not in content:
        content = content.replace('</body>', bubble_html + '\n</body>')
             
    # 4. Update Karaoke label and ensure it has "active" class by default (to match logic)
    content = re.sub(r'<button id="karaoke-toggle"[^>]*>.*?</button>', 
                     '<button id="karaoke-toggle" class="karaoke-toggle-btn active"><iconify-icon icon="solar:eye-closed-linear" width="14"></iconify-icon><span>Masquer les Décryptages</span></button>',
                     content, flags=re.DOTALL)
    
    # 5. Restore sidebar if it's missing the info-grid placeholder
    if 'id="info-grid"' not in content and '<div class="lg:col-span-5 relative">' in content:
        sidebar_fix = """
                <div class="lg:col-span-5 side-analysis-sidebar hidden lg:block">
                    <div class="sticky top-24 space-y-6">
                        <div id="dynamic-analysis-card"
                            class="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50 relative overflow-hidden transition-all duration-500">
                            <div class="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                            <div class="flex items-center gap-2 mb-4">
                                <iconify-icon icon="solar:info-circle-linear" class="text-amber-400" width="20"></iconify-icon>
                                <h4 class="text-sm font-medium text-white tracking-tight">Analyse de la ligne</h4>
                            </div>
                            <div id="analysis-placeholder" class="text-sm text-zinc-400 leading-relaxed">
                                <p>Cliquez sur une ligne pour l'analyser.</p>
                            </div>
                        </div>
                        <div class="bg-zinc-900/20 border border-white/5 rounded-2xl p-6">
                            <h4 class="text-sm font-medium text-white tracking-tight mb-4 flex items-center gap-2">
                                <iconify-icon icon="solar:music-library-2-linear" class="text-zinc-500" width="18"></iconify-icon>
                                Informations
                            </h4>
                            <div id="info-grid" class="space-y-3 text-xs">
                                <!-- Filled by JS -->
                            </div>
                        </div>
                    </div>
                </div>
        """
        content = re.sub(r'<div class="lg:col-span-5 relative">.*?</div>\s*</div>', sidebar_fix, content, flags=re.DOTALL)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed {filename}")
