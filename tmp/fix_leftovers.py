import os
import glob

dir_path = '.'

count = 0
for ext in ['**/*.html', '**/*.js']:
    for path in glob.glob(os.path.join(dir_path, ext), recursive=True):
        if 'node_modules' in path: continue
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            original = content
            
            # Additional cp1252 replacements
            replacements = {
                'Â«': '«',
                'Â»': '»',
                'Â\xa0': ' ',
                'Ã\xa0': 'à',
                'Ã¤': 'ä',
                'Ã¼': 'ü',
                'Å“': 'œ',
                'â€”': '—',
                'â€“': '–',
                'â€™': '’',
                'â€œ': '“',
                'â€\x9d': '”',
                'Â½': '½',
                'Ã§': 'ç',
                'Ã ': 'à ',
                'Å': 'Œ'
            }
            
            for k, v in replacements.items():
                content = content.replace(k, v)
                
            if content != original:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print('Cleaned leftover garbage in:', path)
                count += 1
        except Exception as e:
            pass

print(f"Total files cleaned: {count}")
