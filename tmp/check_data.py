
import json
import re

def analyze_data():
    with open(r'c:\Users\tmaut\Downloads\THE PHOENIX\SongStory\public\js\data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract SONGS_DATA array using regex
    match = re.search(r'let SONGS_DATA = (\[.*?\]);', content, re.DOTALL)
    if not match:
        print("Could not find SONGS_DATA in data.js")
        return

    songs_json = match.group(1)
    # Basic cleanup for JS-style JSON (trailing commas, etc.)
    songs_json = re.sub(r',\s*\]', ']', songs_json)
    songs_json = re.sub(r',\s*\}', '}', songs_json)
    
    try:
        songs = json.loads(songs_json)
        print(f"Total songs: {len(songs)}")
        
        missing = []
        for s in songs:
            cover = s.get('cover_url')
            if not cover or not cover.strip() or 'placeholder' in cover.lower():
                missing.append(s['title'])
            
        if missing:
            print(f"Songs missing covers: {missing}")
        else:
            print("No songs missing covers in data.js according to current logic.")
            
        # Check for suspicious paths
        for s in songs:
            cover = s.get('cover_url', '')
            if cover and not cover.startswith('images/covers/') and not cover.startswith('http'):
                print(f"Suspicious cover_url for '{s['title']}': {cover}")

    except Exception as e:
        print(f"Error parsing JSON: {e}")

if __name__ == "__main__":
    analyze_data()
