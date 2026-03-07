import sys
import os

path = r'c:\Users\tmaut\Downloads\THE PHOENIX\SongStory\js\player.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """            // Highlight current block and line
            let activeBlock = null;
            this.storyBlocks.forEach(block => {
                const t = parseFloat(block.dataset.time);
                if (currentTime >= t) {
                    activeBlock = block;
                }
                block.classList.remove('active-story-block');
            });

            if (activeBlock) {
                activeBlock.classList.add('active-story-block');
                const lyricsText = activeBlock.querySelector('.lyrics-text');
                if (lyricsText && !lyricsText.classList.contains('text-white')) {
                    this.storyBlocks.forEach(b => b.querySelector('.lyrics-text')?.classList.remove('text-white', 'font-medium'));
                    lyricsText.classList.add('text-white', 'font-medium');
                }
            }"""

replacement1 = """            // Highlight current block
            let activeBlock = null;
            this.storyBlocks.forEach(block => {
                const t = parseFloat(block.dataset.time);
                if (currentTime >= t) {
                    activeBlock = block;
                }
                block.classList.remove('active-story-block');
            });
            if (activeBlock) {
                activeBlock.classList.add('active-story-block');
            }

            // Highlight current precise line
            let activeLine = null;
            let activeLineChanged = false;
            this.lyricLines.forEach(line => {
                const t = parseFloat(line.dataset.time);
                if (currentTime >= t) {
                    activeLine = line;
                }
            });

            this.lyricLines.forEach(line => {
                if (line === activeLine) {
                    if (!line.classList.contains('active-lyric')) {
                        line.classList.add('active-lyric');
                        activeLineChanged = true;
                    }
                } else {
                    line.classList.remove('active-lyric');
                }
            });

            if (activeLineChanged && activeLine) {
                // Smooth scroll to the active line (Apple Music style)
                activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Logic for the Decrypt Bubble
                const block = activeLine.closest('.story-block');
                const analysis = block ? block.querySelector('.analysis-content-visible') : null;
                const bubble = document.getElementById('decrypt-bubble');
                const bubbleContent = document.getElementById('bubble-content');
                const showDecrypt = !document.body.classList.contains('karaoke-mode');
                
                if (analysis && analysis.innerHTML.trim() !== '' && showDecrypt && bubble) {
                    bubbleContent.innerHTML = analysis.innerHTML;
                    bubble.classList.add('visible');
                    // Reset scroll for inner bubble content
                    bubbleContent.scrollTop = 0;
                } else if (bubble) {
                    bubble.classList.remove('visible');
                }
            } else if (!activeLine) {
                const bubble = document.getElementById('decrypt-bubble');
                if (bubble) bubble.classList.remove('visible');
            }"""

target2 = """    initKaraoke() {
        const karaokeBtn = document.getElementById('karaoke-toggle');
        if (karaokeBtn) {
            karaokeBtn.addEventListener('click', () => {
                const isActive = document.body.classList.toggle('karaoke-mode');
                karaokeBtn.classList.toggle('active', isActive);
                const icon = isActive ? 'solar:eye-closed-linear' : 'solar:eye-linear';
                const label = isActive ? 'Analyses masquées' : 'Mode Karaoké';
                karaokeBtn.innerHTML = `<iconify-icon icon="${icon}" width="14"></iconify-icon>${label}`;
            });
        }
    },"""

replacement2 = """    initKaraoke() {
        const karaokeBtn = document.getElementById('karaoke-toggle');
        if (karaokeBtn) {
            karaokeBtn.addEventListener('click', () => {
                const isKaraoke = document.body.classList.toggle('karaoke-mode'); // true = lyrics only
                karaokeBtn.classList.toggle('active', !isKaraoke);
                const icon = isKaraoke ? 'solar:eye-closed-linear' : 'solar:eye-linear';
                const label = isKaraoke ? 'Masquer les Décryptages' : 'Afficher les Décryptages';
                karaokeBtn.innerHTML = `<iconify-icon icon="${icon}" width="14"></iconify-icon><span>${label}</span>`;
                
                // Immediately update bubble visibility
                const bubble = document.getElementById('decrypt-bubble');
                if (isKaraoke && bubble) {
                    bubble.classList.remove('visible');
                } else if (!isKaraoke) {
                    // Trigger time update to re-evaluate and possibly show the bubble
                    const event = new Event('timeupdate');
                    this.audio.dispatchEvent(event);
                }
            });
        }
    },"""

content_norm = content.replace('\r\n', '\n')
old_len = len(content_norm)

content_norm = content_norm.replace(target1, replacement1)
content_norm = content_norm.replace(target2, replacement2)

if len(content_norm) == old_len:
    print('Failed to replace.')
else:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content_norm)
    print('Replaced successfully.')
