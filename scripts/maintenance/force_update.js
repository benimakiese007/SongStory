const fs = require('fs');

const content = fs.readFileSync('js/data.js', 'utf-8');
const virtualGlobal = {};
const script = content.replace(/window\./g, 'virtualGlobal.').replace(/let /g, 'var ');
eval(script);

fetch('http://localhost:3000/api/save-song', {
    method: 'POST',
    body: JSON.stringify({
        songs: typeof SONGS_DATA !== 'undefined' ? SONGS_DATA : [],
        artists: typeof ARTISTS_DATA !== 'undefined' ? ARTISTS_DATA : [],
        glossary: typeof GLOSSARY !== 'undefined' ? GLOSSARY : {}
    }),
    headers: { 'Content-Type': 'application/json' }
}).then(res => res.json())
  .then(data => console.log('Update complete:', data))
  .catch(err => console.error('Error:', err));
