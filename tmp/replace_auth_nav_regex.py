import os
import glob
import re

html_files = glob.glob('*.html') + glob.glob('artists/*.html') + glob.glob('songs/*.html')

new_block = '<div class="nav-auth-slot"></div>'

for file_path in html_files:
    if file_path == 'account.html':
        continue
        
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        if '"nav-auth-slot"' in content:
            continue
            
        # Regex to find the <a href="account.html"...> ... </a> block that says "Connexion"
        # Since it's multiline, we use re.DOTALL
        # Look for the exact class structure
        pattern = re.compile(r'<a href="account\.html"\s+class="hidden sm:inline-flex[^>]+>.*?Connexion\s*</a>', re.DOTALL)
        
        matches = pattern.findall(content)
        if matches:
            content = pattern.sub(new_block, content)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Regex replaced in {file_path}")
        else:
            print(f"Still not found in {file_path}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
