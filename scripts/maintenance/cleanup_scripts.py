import os
import glob
import re

html_files = glob.glob('*.html') + glob.glob('artists/*.html') + glob.glob('songs/*.html')

for file_path in html_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        base = '../' if ('artists/' in file_path or 'songs/' in file_path) else ''
        
        # 1. Remove EXACT duplicates or wrongly path-ed duplicates added by previous script
        # Previous script added:
        # <script src="js/supabase-auth.js"></script>
        # <script src="js/app.js"></script>
        wrong_scripts = [
            '<script src="js/supabase-auth.js"></script>',
            '<script src="js/app.js"></script>'
        ]
        
        if base == '../':
            for ws in wrong_scripts:
                if ws in content:
                    content = content.replace(ws, '')
                    print(f"Removed wrong script {ws} from {file_path}")

        # 2. Ensure supabase-auth.js is present exactly once with correct path
        correct_auth = f'<script src="{base}js/supabase-auth.js"></script>'
        # Check if any version of supabase-auth.js exists
        auth_matches = re.findall(r'<script src="[^"]*supabase-auth\.js"></script>', content)
        if len(auth_matches) > 1:
            # Keep only the first one and replace it with correct path? 
            # Actually, let's remove all and insert at a good place.
            for m in auth_matches:
                content = content.replace(m, '')
        elif len(auth_matches) == 1:
             content = content.replace(auth_matches[0], '')
             
        # Re-insert before auth.js
        auth_tag = f'<script src="{base}js/auth.js"></script>'
        if auth_tag in content:
            content = content.replace(auth_tag, f'{correct_auth}\n    {auth_tag}')
        else:
            # Fallback before </body>
            content = content.replace('</body>', f'    {correct_auth}\n</body>')

        # 3. Ensure app.js is present exactly once at the end
        correct_app = f'<script src="{base}js/app.js"></script>'
        app_matches = re.findall(r'<script src="[^"]*js/app\.js"></script>', content)
        for m in app_matches:
            content = content.replace(m, '')
        
        # Insert before </body>, after everything else
        content = content.replace('</body>', f'    {correct_app}\n</body>')

        # Cleanup extra newlines created by replacements
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
