import os
import glob
import re

html_files = glob.glob('artists/*.html') + glob.glob('songs/*.html')

# We want to replace whatever is inside <nav>...</nav> with the standard nav from index.html (adjusted for relative paths)
standard_nav = """    <nav class="sticky top-0 z-50 w-full backdrop-blur-xl bg-zinc-950/80 border-b border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <div class="flex-shrink-0 flex items-center gap-2">
                    <a href="../index.html" class="text-white text-lg font-medium tracking-tighter">SONGSTORY.</a>
                </div>

                <!-- Desktop Menu -->
                <div class="hidden md:block">
                    <div class="flex items-center space-x-8">
                        <a href="../index.html" class="text-white text-sm hover:text-amber-400 transition-colors">Découvrir</a>
                        <a href="../library.html" class="text-zinc-400 text-sm hover:text-white transition-colors">Bibliothèque</a>
                        <a href="../artists.html" class="text-zinc-400 text-sm hover:text-white transition-colors">Artistes</a>
                        <a href="../timeline.html" class="text-zinc-400 text-sm hover:text-white transition-colors">Timeline</a>
                        <a href="../glossary.html" class="text-zinc-400 text-sm hover:text-white transition-colors">Glossaire</a>
                        <a href="../about.html" class="text-zinc-400 text-sm hover:text-white transition-colors">À propos</a>
                    </div>
                </div>

                <!-- Search & Actions -->
                <div class="flex items-center gap-3">
                    <button class="search-trigger flex items-center gap-2 text-zinc-400 hover:text-white transition-colors" aria-label="Ouvrir la recherche">
                        <iconify-icon icon="solar:magnifer-linear" width="20"></iconify-icon>
                        <span class="hidden sm:inline text-xs text-zinc-600 border border-white/10 rounded px-1.5 py-0.5">/</span>
                    </button>
                    <!-- Nav auth slot -->
                    <button class="theme-switch" aria-label="Passer en mode clair" role="switch" aria-checked="false">
                        <div class="switch-thumb">
                            <iconify-icon icon="solar:sun-bold" class="sun-icon"></iconify-icon>
                            <iconify-icon icon="solar:moon-bold" class="moon-icon"></iconify-icon>
                        </div>
                    </button>
                    <div class="nav-auth-slot"></div>
                    <button id="mobile-menu-btn" class="text-zinc-400 md:hidden" aria-expanded="false" aria-controls="mobile-menu" aria-label="Menu">
                        <iconify-icon icon="solar:hamburger-menu-linear" width="24"></iconify-icon>
                    </button>
                </div>
            </div>
        </div>
    </nav>"""

nav_pattern = re.compile(r'<nav[^>]*>.*?</nav>', re.DOTALL)

for file_path in html_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        if '<nav ' in content or '<nav>' in content:
            new_content = nav_pattern.sub(standard_nav, content)
            
            # Make sure relative paths are correct depending on directory
            if file_path.startswith('artists/') or file_path.startswith('songs/'):
                pass # Already structured for ../
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Replaced nav completely in {file_path}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
