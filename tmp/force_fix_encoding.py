import os
import glob

mappings = {
    'DÃ©couvrir': 'Découvrir',
    'BibliothÃ¨que': 'Bibliothèque',
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
    'Ã ': 'à ',
    'Ã¤': 'ä',
    'Ã¼': 'ü',
    'Å“': 'œ',
    'Â½': '½',
    'Å': 'Œ',
    'Ã¯': 'ï',
    'Ã\xad': 'í',
    'Ã¦': 'æ',
    'Ã¹': 'ù',
    'Ã±': 'ñ',
    'Ã¶': 'ö',
    'Ãº': 'ú',
    'Ã£': 'ã'
}

count = 0
for ext in ['**/*.html', '**/*.js']:
    for path in glob.glob(os.path.join('.', ext), recursive=True):
        if 'node_modules' in path: continue
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            for k, v in mappings.items():
                content = content.replace(k, v)
                
            if content != original:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Fixed: {path}")
                count += 1
        except Exception as e:
            pass

print(f"Total files updated: {count}")
