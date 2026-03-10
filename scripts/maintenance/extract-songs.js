const fs = require('fs');
const path = require('path');

const songs = ['macarena', 'euphoria', 'black', 'fairchild', 'push-ups', 'family-matters', 'first-person-shooter', 'back-to-back'];
const dataPath = path.join(__dirname, 'js', 'data.js');
let dataContent = fs.readFileSync(dataPath, 'utf-8');

songs.forEach(songId => {
    const filePath = path.join(__dirname, 'songs', `${songId}.html`);
    if (!fs.existsSync(filePath)) return;

    const html = fs.readFileSync(filePath, 'utf-8');
    const blocks = [];
    const parts = html.split('data-time="');

    for (let i = 1; i < parts.length; i++) {
        const timeStr = parts[i].substring(0, parts[i].indexOf('"'));
        const time = parseInt(timeStr);
        if (isNaN(time)) continue; // ignore if not a number

        // lyrics
        let lyricsMatch = parts[i].match(/<div class="lyrics-text[^>]*>([\s\S]*?)<\/div>/);
        let lyrics = [];
        if (lyricsMatch) {
            let pMatches = lyricsMatch[1].match(/<p[^>]*>([\s\S]*?)<\/p>/g);
            if (pMatches) {
                lyrics = pMatches.map(p => p.replace(/<p[^>]*>/, '').replace(/<\/p>/, '').trim());
            }
        }

        // analysis
        let analysisMatch = parts[i].match(/<div class="analysis-content-visible">([\s\S]*?)<\/div>\s*<div style="display:flex/);
        let analysis = "";
        if (analysisMatch) {
            analysis = analysisMatch[1].trim();
            // remove trailing divs or extra spaces
            analysis = analysis.replace(/\n\s+/g, '\n                    ');
        }

        if (lyrics.length > 0) {
            blocks.push({ time, lyrics, analysis });
        }
    }

    // Now inject into data.js
    const regex = new RegExp(`(id:\\s*'${songId}',[\\s\\S]*?appleMusicId:\\s*'[^']*',?\\s*)`);
    const match = dataContent.match(regex);
    if (match) {
        let contentArrayStr = 'content: [\n';
        blocks.forEach(b => {
            contentArrayStr += `            {\n                time: ${b.time},\n                lyrics: [\n`;
            b.lyrics.forEach((l, idx) => {
                contentArrayStr += `                    \`${l.replace(/`/g, '\\`')}\`${idx < b.lyrics.length - 1 ? ',' : ''}\n`;
            });
            contentArrayStr += `                ],\n                analysis: \`\n                    ${b.analysis}\n                \`\n            },\n`;
        });
        contentArrayStr += '        ]';

        if (!match[0].includes('content: [')) {
            dataContent = dataContent.replace(match[0], match[0] + contentArrayStr + ',\n');
        }
    }
});

fs.writeFileSync(dataPath, dataContent, 'utf-8');
console.log('Done modifying data.js');
