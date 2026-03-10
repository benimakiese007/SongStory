const fs = require('fs');
const path = require('path');

const artistsDir = path.join(__dirname, '..', '..', 'artists');
const files = fs.readdirSync(artistsDir).filter(f => f.endsWith('.html'));

let updatedCount = 0;

for (const file of files) {
    const filePath = path.join(artistsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Check if markers already exist
    if (content.includes('<!-- ARTIST_INFO_START -->')) {
        console.log(`Skipping \${file} (markers already present)`);
        continue;
    }

    let startIdx = -1;
    let endIdx = -1;

    // Pattern 1: New layout (<section class="artist-hero">)
    const newLayoutStart = '<section class="artist-hero">';
    const newLayoutEnd = '</section>';
    
    // Pattern 2: Old layout (<div class="flex flex-col md:flex-row items-center gap-8 mb-16">)
    const oldLayoutStart = '<div class="flex flex-col md:flex-row items-center gap-8 mb-16">';
    const oldLayoutEnd = '<h2 class="text-xl text-white font-medium mb-6">Analyses disponibles</h2>';

    if (content.includes(newLayoutStart)) {
        startIdx = content.indexOf(newLayoutStart);
        endIdx = content.indexOf(newLayoutEnd, startIdx) + newLayoutEnd.length;
    } else if (content.includes(oldLayoutStart)) {
        startIdx = content.indexOf(oldLayoutStart);
        endIdx = content.indexOf(oldLayoutEnd, startIdx);
    }

    if (startIdx !== -1 && endIdx !== -1) {
        // Insert markers
        const prefix = content.includes(newLayoutStart) ? '\n    ' : '\n            ';
        
        const newContent = content.substring(0, startIdx) + 
                           '<!-- ARTIST_INFO_START -->' + prefix + 
                           content.substring(startIdx, endIdx) + 
                           prefix + '<!-- ARTIST_INFO_END -->\n\n            ' + 
                           content.substring(endIdx);
                           
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`Updated \${file}`);
        updatedCount++;
    } else {
        console.log(`Could not find start/end strings in \${file}`);
    }
}

console.log(`Done. Updated \${updatedCount} files.`);
