import os
import glob
import re

html_files = glob.glob('*.html') + glob.glob('artists/*.html') + glob.glob('songs/*.html')

# Essential scripts in order
# Note: we need to handle relative paths for artists/ and songs/
scripts_template = [
    '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>',
    '<script src="{base}js/supabase-client.js"></script>',
    '<script src="{base}js/supabase-auth.js"></script>',
    '<script src="{base}js/auth.js"></script>',
    '<script src="{base}js/app.js"></script>'
]

for file_path in html_files:
    if file_path == 'account.html':
        # account.html already has them but let's check order?
        # Actually account.html is complex, let's just make sure they are there.
        pass
        
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        base = '../' if ('artists/' in file_path or 'songs/' in file_path) else ''
        
        needed = [s.format(base=base) for s in scripts_template]
        
        changed = False
        
        # Check if supabase-auth.js is missing
        auth_script = needed[2]
        if auth_script not in content:
            # Try to insert it before auth.js
            target = needed[3]
            if target in content:
                content = content.replace(target, auth_script + '\n    ' + target)
                changed = True
                print(f"Added {auth_script} to {file_path}")
            else:
                # Fallback: insert before </body>
                content = content.replace('</body>', auth_script + '\n</body>')
                changed = True
                print(f"Added {auth_script} to {file_path} (fallback)")

        # Ensure app.js is there too
        app_script = needed[4]
        if app_script not in content:
            # Insert before </body>
            content = content.replace('</body>', app_script + '\n</body>')
            changed = True
            print(f"Added {app_script} to {file_path}")

        if changed:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
                
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
