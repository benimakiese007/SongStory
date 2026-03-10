import os

path = 'c:/Users/tmaut/Downloads/THE PHOENIX/SongStory/songs/family-matters.html'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

replacements = {
    'oÃ¹': 'où',
    'tÃªte': 'tête',
    "s'Ãªtre": "s'être",
    'mÃªme': 'même',
    'dÃ»': 'dû',
    'fÃªtent': 'fêtent',
    'prÃªche': 'prêche',
    "d'Ãªtre": "d'être",
    'lui-mÃªme': 'lui-même',
    'Ã': 'à' # The leftover ones are probably 'à'
}

count = 0
for old, new in replacements.items():
    if old in text:
        text = text.replace(old, new)
        count += 1

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Replaced {count} targeted broken words.")
