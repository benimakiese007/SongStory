const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else if (filePath.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const songsDir = path.join(process.cwd(), 'public', 'songs');
const htmlFiles = findHtmlFiles(songsDir);

const standardScripts = `    <script src="../../js/data.js"></script>
    <script src="../../js/seo.js"></script>
    <script src="../../js/auth.js"></script>
    <script src="../../js/supabase-auth.js"></script>
    <script src="../../js/pwa.js"></script>
    <script src="../../js/spotify.js"></script>
    <script src="../../js/applemusic.js"></script>
    <script src="../../js/streaming.js"></script>
    <script src="../../js/contribute.js"></script>
    <script src="../../js/ui.js"></script>
    <script src="../../js/player.js"></script>
    <script src="../../js/song-renderer.js"></script>
    <script src="../../js/search.js"></script>
    <script src="../../js/app.js"></script>
`;

let updatedCount = 0;

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Regex matches one or more script tags pointing to ../../js/, including whitespace and newlines between them
    const scriptRegex = /([ \t]*<script src="\.\.\/\.\.\/js\/[-a-zA-Z0-9_.]+\.js"><\/script>\s*)+/g;
    
    if (scriptRegex.test(content)) {
        content = content.replace(scriptRegex, standardScripts);
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
        console.log(`Updated scripts in: ${path.basename(file)}`);
    } else {
        console.log(`No matching script blocks found in: ${path.basename(file)}`);
    }
}

console.log(`\nSuccessfully updated ${updatedCount} HTML files!`);
