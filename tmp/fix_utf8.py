import os
import glob

def fix_mojibake(text):
    try:
        # Many mojibake are UTF-8 bytes decoded as cp1252.
        return text.encode('cp1252').decode('utf-8')
    except:
        return None

mappings = {
    'DÃ©couvrir': 'Découvrir',
    'BibliothÃ¨que': 'Bibliothèque',
    'Ã€ propos': 'À propos',
    'rÃ©ponse': 'réponse',
    'rÃ©vÃ©lation': 'révélation',
    'prÃ©cÃ©dente': 'précédente',
    'Ã©': 'é',
    'Ã¨': 'è',
    'Ã¢': 'â',
    'Ã®': 'î',
    'Ã´': 'ô',
    'Ã»': 'û',
    'Ã§': 'ç',
    'Ã‰': 'É',
    'Ã€': 'À',
    'ÃŠ': 'Ê',
    'ÃŽ': 'Î',
    'Ã¯': 'ï',
    'Ã«': 'ë',
    'Â«': '«',
    'Â»': '»',
    'â€”': '—',
    'â€“': '–',
    'â€™': '’',
    'â€œ': '“',
    'â€\x9d': '”',
    'Â\xa0': ' ',
    'Ã\xa0': 'à',
    'Ã ': 'à '
}

dir_path = r"c:\Users\tmaut\Downloads\THE PHOENIX\SongStory"
count = 0
for ext in ['**/*.html', '**/*.js']:
    for path in glob.glob(os.path.join(dir_path, ext), recursive=True):
        if 'node_modules' in path: continue
        try:
            with open(path, 'r', encoding='utf-8') as f:
                original = f.read()
            
            content = original
            has_mojibake = any(bad in content for bad in ['Ã©', 'Ã¨', 'Ã¢', 'Ã®', 'Ã´', 'Ã»', 'Ã§', 'â€”'])
            
            if has_mojibake or 'Ã' in content:
                # Try systematic decode
                fixed = fix_mojibake(content)
                if fixed and 'Ã©' not in fixed:
                    content = fixed
                else:
                    # Generic manual fallback
                    for bad, good in mappings.items():
                        content = content.replace(bad, good)
                
                if content != original:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Fixed: {path}")
                    count += 1
        except Exception as e:
            # Maybe the file wasn't utf-8 readable
            pass

print(f"Total fixed: {count} files.")
