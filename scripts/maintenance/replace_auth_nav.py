import os
import glob

# The exact block to find
old_block = """                    <a href="account.html"
                        class="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-zinc-900 bg-white hover:bg-zinc-200 rounded-full transition-colors gap-2">
                        <iconify-icon icon="solar:user-circle-linear" width="18"></iconify-icon>
                        Connexion
                    </a>"""

# What to replace it with
new_block = """                    <div class="nav-auth-slot"></div>"""

html_files = glob.glob('*.html') + glob.glob('artists/*.html') + glob.glob('songs/*.html')

for file_path in html_files:
    if file_path == 'account.html':
        continue # account.html might have different structure or already be handled
        
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        if old_block in content:
            content = content.replace(old_block, new_block)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {file_path}")
        else:
            # Try a slightly looser match if exact indentation differs
            # Let's check if the file needs it
            if '"nav-auth-slot"' not in content:
                print(f"File {file_path} might need manual update (old block not found exactly)")
                
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
