import os
import re
import json

base_dir = r"c:\Users\tmaut\Downloads\THE PHOENIX\SongStory"
songs_dir = os.path.join(base_dir, "songs")
data_file = os.path.join(base_dir, "js", "data.js")

def get_song_info(file_path):
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
        
    title_match = re.search(r"<title>(.*?) - (.*?) - SongStory</title>", content)
    if not title_match:
        title_match = re.search(r"<title>(.*?) - SongStory</title>", content)
        
    if title_match:
        if len(title_match.groups()) == 2:
            title = title_match.group(1).strip()
            # Artist is group 2, but we prefer directory name for ID
        else:
            title = title_match.group(1).strip()
    else:
        title = os.path.basename(file_path).replace(".html", "").replace("-", " ").title()
        
    return title

def sync_songs():
    new_songs = []
    
    # Existing data to preserve some fields if possible
    existing_songs = {}
    if os.path.exists(data_file):
        with open(data_file, "r", encoding="utf-8") as f:
            content = f.read()
            match = re.search(r"let SONGS_DATA = (\[.*?\]);", content, re.DOTALL)
            if match:
                try:
                    # Clean up JSON-like string (might have trailing commas or function calls)
                    # For now just try a simple extraction or regex for objects
                    # Actually, let's just use regex to find objects
                    matches = re.findall(r"\{[^{}]*\}", match.group(1), re.DOTALL)
                    for m in matches:
                        # try to parse as json or evaluate
                        # simplified: just extract id
                        id_match = re.search(r'["\']?id["\']?:\s*["\']([^"\']+)["\']', m)
                        if id_match:
                            existing_songs[id_match.group(1)] = m
                except:
                    pass

    for artist_id in os.listdir(songs_dir):
        artist_path = os.path.join(songs_dir, artist_id)
        if not os.path.isdir(artist_path):
            continue
            
        for song_file in os.listdir(artist_path):
            if not song_file.endswith(".html"):
                continue
                
            song_id = song_file.replace(".html", "")
            file_path = os.path.join(artist_path, song_file)
            relative_url = f"songs/{artist_id}/{song_file}"
            
            title = get_song_info(file_path)
            
            # Check if we have existing data to preserve (like cover_url, year)
            # Default values
            genre = "Rap"
            year = 2024
            cover_url = f"Images/Title Cover/{title} Cover.webp"
            
            # Simple extraction from existing if found
            if song_id in existing_songs:
                m = existing_songs[song_id]
                genre_match = re.search(r'["\']?genre["\']?:\s*["\']([^"\']+)["\']', m)
                if genre_match: genre = genre_match.group(1)
                year_match = re.search(r'["\']?year["\']?:\s*(\d+)', m)
                if year_match: year = int(year_match.group(1))
                cover_match = re.search(r'["\']?cover_url["\']?:\s*["\']([^"\']+)["\']', m)
                if cover_match: cover_url = cover_match.group(1)

            song_obj = {
                "id": song_id,
                "title": title,
                "artist_id": artist_id,
                "genre": genre,
                "year": year,
                "url": relative_url,
                "audio_url": "",
                "spotify_id": "",
                "apple_music_id": "",
                "cover_url": cover_url,
                "tags": [],
                "description": ""
            }
            new_songs.append(song_obj)

    # Write back to data.js
    with open(data_file, "r", encoding="utf-8") as f:
        content = f.read()
        
    json_data = json.dumps(new_songs, indent=4, ensure_ascii=False)
    new_content = re.sub(r"let SONGS_DATA = \[.*?\];", f"let SONGS_DATA = {json_data};", content, flags=re.DOTALL)
    
    with open(data_file, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print(f"Synced {len(new_songs)} songs.")

if __name__ == "__main__":
    sync_songs()
