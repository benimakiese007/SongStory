/**
 * SongStory — SEO & Meta Data Controller
 * Handles dynamic JSON-LD injection and meta tag updates.
 */

const SongStorySEO = {
    /**
     * Injects JSON-LD structured data into the <head>
     * @param {Object} data - The JSON schema object
     */
    injectJSONLD(data) {
        let script = document.getElementById('ss-jsonld');
        if (!script) {
            script = document.createElement('script');
            script.id = 'ss-jsonld';
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.text = JSON.stringify(data);
    },

    /**
     * Updates page meta tags (Title, Description, OG)
     * @param {Object} options - { title, description, url, type, image }
     */
    updateMeta(options) {
        if (options.title) {
            document.title = `${options.title} - SongStory`;
            this.setMeta('property', 'og:title', options.title);
            this.setMeta('name', 'twitter:title', options.title);
        }
        if (options.description) {
            this.setMeta('name', 'description', options.description);
            this.setMeta('property', 'og:description', options.description);
            this.setMeta('name', 'twitter:description', options.description);
        }
        if (options.url) {
            this.setMeta('property', 'og:url', options.url);
        }
        if (options.type) {
            this.setMeta('property', 'og:type', options.type);
        }
    },

    setMeta(attr, value, content) {
        let el = document.querySelector(`meta[${attr}="${value}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute(attr, value);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    },

    /**
     * Auto-init SEO based on SONG_DATA or ARTIST_DATA
     * To be called when a dynamic page loads.
     */
    initForSong(songId) {
        if (typeof SONGS_DATA === 'undefined') return;
        const song = SONGS_DATA.find(s => s.id === songId);
        if (!song) return;

        this.updateMeta({
            title: `${song.title} — Analyse & Décryptage`,
            description: song.description || `Découvrez le sens caché et l'analyse de ${song.title} par ${song.artist}.`,
            type: 'article'
        });

        // JSON-LD for MusicRecording and Article
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `${song.title} - Analyse SongStory`,
            "description": song.description,
            "author": {
                "@type": "Organization",
                "name": "SongStory"
            },
            "about": {
                "@type": "MusicRecording",
                "name": song.title,
                "byArtist": {
                    "@type": "MusicGroup",
                    "name": song.artist
                }
            }
        };
        this.injectJSONLD(jsonLd);
    },

    initForArtist(artistId) {
        if (typeof ARTISTS_DATA === 'undefined') return;
        const artist = ARTISTS_DATA.find(a => a.id === artistId);
        if (!artist) return;

        this.updateMeta({
            title: `${artist.name} — Profil & Analyses`,
            description: artist.bio ? artist.bio.substring(0, 160) : `Toutes les analyses des morceaux de ${artist.name}.`,
            type: 'profile'
        });

        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            "name": artist.name,
            "description": artist.bio,
            "genre": artist.genre
        };
        this.injectJSONLD(jsonLd);
    }
};

// Auto-run if we find specific data on the page (compatibility with current static pages)
document.addEventListener('DOMContentLoaded', () => {
    // Basic detection for static pages to improve them until they become fully dynamic
    const h1 = document.querySelector('h1')?.textContent.trim();
    if (window.location.pathname.includes('/songs/')) {
        const id = window.location.pathname.split('/').pop().replace('.html', '');
        SongStorySEO.initForSong(id);
    } else if (window.location.pathname.includes('/artists/')) {
        const id = window.location.pathname.split('/').pop().replace('.html', '');
        SongStorySEO.initForArtist(id);
    }
});
