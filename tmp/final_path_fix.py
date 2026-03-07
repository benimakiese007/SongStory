import os
import glob

# Only target subdirectory files
subdir_files = glob.glob('artists/*.html') + glob.glob('songs/*.html')

for file_path in subdir_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix wrong paths added previously
        content = content.replace('<script src="js/supabase-auth.js"></script>', '<script src="../js/supabase-auth.js"></script>')
        content = content.replace('<script src="js/app.js"></script>', '<script src="../js/app.js"></script>')

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed paths in {file_path}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
