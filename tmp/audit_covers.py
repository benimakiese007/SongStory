
import os
import re

def audit_covers():
    covers_dir = r"c:\Users\tmaut\Downloads\THE PHOENIX\SongStory\public\images\covers"
    data_file = r"c:\Users\tmaut\Downloads\THE PHOENIX\SongStory\public\js\data.js"
    
    with open(data_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple regex to find cover_url values
    urls = re.findall(r"cover_url:\s*['\"](.*?)['\"]", content)
    
    existing_files = os.listdir(covers_dir)
    
    print(f"Total cover URLs found in data.js: {len(urls)}")
    print(f"Total files in covers directory: {len(existing_files)}")
    
    missing = []
    for url in urls:
        if url.startswith('images/covers/'):
            filename = url.replace('images/covers/', '')
            if filename not in existing_files:
                missing.append(url)
    
    if missing:
        print("\nMissing Files detected:")
        for m in missing:
            print(f"- {m}")
    else:
        print("\nNo missing files detected (all paths match files).")

if __name__ == "__main__":
    audit_covers()
