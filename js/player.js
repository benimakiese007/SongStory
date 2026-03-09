/**
 * SongStory — Audio Player Module
 * Handles: waveform rendering, audio playback, markers, volume, and karaoke mode.
 */

const SongStoryPlayer = {
    audio: null,
    playBtn: null,
    waveformContainer: null,
    currentTimeEl: null,
    totalTimeEl: null,
    storyBlocks: [],
    waveformBars: [],
    BAR_COUNT: 60,

    // Web Audio API state
    audioCtx: null,
    analyser: null,
    sourceNode: null,
    isAnalyserConnected: false,

    init() {
        this.audio = document.getElementById('main-audio');
        this.playBtn = document.getElementById('play-pause-btn');
        this.waveformContainer = document.getElementById('waveform');
        this.currentTimeEl = document.querySelector('.current-time');
        this.totalTimeEl = document.querySelector('.total-time');
        this.storyBlocks = document.querySelectorAll('.story-block[data-time]');
        this.lyricLines = document.querySelectorAll('.lyric-line[data-time]');

        // Karaoke toggle works independently of audio player
        this.initKaraoke();

        if (!this.audio) return;

        this.buildWaveform();
        this.renderWaveformMarkers();
        this.initEvents();
        this.initVolume();
        this.initKeyboard();
    },

    buildWaveform() {
        if (!this.waveformContainer) return;
        this.waveformContainer.innerHTML = '';
        this.waveformBars = [];
        for (let i = 0; i < this.BAR_COUNT; i++) {
            const bar = document.createElement('div');
            bar.className = 'waveform-bar';
            const h = 20 + Math.sin(i * 0.4) * 30 + Math.random() * 28;
            bar.style.height = `${Math.max(4, Math.min(100, h))}%`;
            this.waveformContainer.appendChild(bar);
            this.waveformBars.push(bar);
        }

        this.waveformContainer.addEventListener('click', (e) => {
            const rect = this.waveformContainer.getBoundingClientRect();
            const percent = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
            this.audio.currentTime = percent * (this.audio.duration || 0);
        });
    },

    renderWaveformMarkers() {
        if (!this.waveformContainer || !this.audio) return;
        this.waveformContainer.querySelectorAll('.waveform-comment-marker').forEach(m => m.remove());

        this.storyBlocks.forEach(block => {
            const time = parseFloat(block.dataset.time);
            if (isNaN(time)) return;

            const marker = document.createElement('div');
            marker.className = 'waveform-comment-marker';
            const duration = this.audio.duration || 300;
            const percent = (time / duration) * 100;
            marker.style.left = `${percent}%`;

            const title = block.querySelector('.font-medium')?.textContent || "Note d'analyse";
            const tooltip = document.createElement('div');
            tooltip.className = 'waveform-comment-tooltip';
            tooltip.textContent = title;
            marker.appendChild(tooltip);

            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                this.audio.currentTime = time;
                if (this.audio.paused) this.audio.play().catch(() => { });
                block.querySelector('.lyrics-text')?.click();
            });

            this.waveformContainer.appendChild(marker);
        });
    },

    updateWaveform() {
        if (!this.audio || !this.waveformBars.length) return;
        const progress = this.audio.currentTime / (this.audio.duration || 1);
        const playedCount = Math.floor(progress * this.BAR_COUNT);
        this.waveformBars.forEach((bar, i) => {
            bar.classList.remove('played', 'active');
            if (i < playedCount) bar.classList.add('played');
            else if (i === playedCount) bar.classList.add('active');
        });
    },

    formatTime(s) {
        if (isNaN(s)) return '0:00';
        return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
    },

    initEvents() {
        this.audio.addEventListener('loadedmetadata', () => {
            if (this.totalTimeEl) this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
            this.storyBlocks = document.querySelectorAll('.story-block[data-time]');
            this.lyricLines = document.querySelectorAll('.lyric-line[data-time]');
            this.renderWaveformMarkers();
        });

        const togglePlay = () => {
            if (this.audio.paused) {
                this.audio.play().catch(() => { });
                this.connectAnalyser(); // Connect on first play
            } else {
                this.audio.pause();
            }
        };

        this.playBtn?.addEventListener('click', togglePlay);

        this.audio.addEventListener('play', () => {
            if (this.playBtn) this.playBtn.innerHTML = '<iconify-icon icon="solar:pause-bold" width="20"></iconify-icon>';
        });
        this.audio.addEventListener('pause', () => {
            if (this.playBtn) this.playBtn.innerHTML = '<iconify-icon icon="solar:play-bold" width="20"></iconify-icon>';
        });

        this.audio.addEventListener('timeupdate', () => {
            this.updateWaveform();
            const currentTime = this.audio.currentTime;
            if (this.currentTimeEl) this.currentTimeEl.textContent = this.formatTime(currentTime);

            // Highlight current block
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
                this.updateDecryptBubble(activeLine);
            } else if (!activeLine) {
                const bubble = document.getElementById('decrypt-bubble');
                if (bubble) bubble.classList.remove('visible');
            }

            // Optional: smoother scroll to active block if needed
        });

        // Add Click to Seek on lyrics
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lyric-line')) {
                const time = parseFloat(e.target.dataset.time);
                if (!isNaN(time)) {
                    this.audio.currentTime = time;
                    if (this.audio.paused) this.audio.play().catch(() => { });
                }
            }
        });
    },

    initVolume() {
        const volumeContainer = document.getElementById('volume-container');
        const volumeFill = document.getElementById('volume-fill');
        const volumeThumb = document.getElementById('volume-thumb');
        const muteBtn = document.getElementById('mute-btn');
        let isMuted = false, previousVolume = 1;

        const updateUI = (vol) => {
            const pct = (vol * 100).toFixed(1) + '%';
            if (volumeFill) volumeFill.style.width = pct;
            if (volumeThumb) volumeThumb.style.left = pct;
            if (!muteBtn) return;
            if (vol === 0) muteBtn.innerHTML = '<iconify-icon icon="solar:volume-cross-linear" width="18"></iconify-icon>';
            else if (vol < 0.5) muteBtn.innerHTML = '<iconify-icon icon="solar:volume-small-linear" width="18"></iconify-icon>';
            else muteBtn.innerHTML = '<iconify-icon icon="solar:volume-loud-linear" width="18"></iconify-icon>';
        };

        if (volumeContainer && muteBtn) {
            volumeContainer.addEventListener('click', (e) => {
                const rect = volumeContainer.getBoundingClientRect();
                let vol = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
                this.audio.volume = vol;
                isMuted = vol === 0;
                if (!isMuted) previousVolume = vol;
                updateUI(vol);
            });
            muteBtn.addEventListener('click', () => {
                if (isMuted) { this.audio.volume = previousVolume > 0 ? previousVolume : 1; isMuted = false; }
                else { previousVolume = this.audio.volume; this.audio.volume = 0; isMuted = true; }
                updateUI(this.audio.volume);
            });
        }
    },

    initKaraoke() {
        const karaokeBtn = document.getElementById('karaoke-toggle');
        if (karaokeBtn) {
            karaokeBtn.addEventListener('click', () => {
                const isKaraoke = document.body.classList.toggle('karaoke-mode'); // true = lyrics only
                karaokeBtn.classList.toggle('active', !isKaraoke);

                // If karaoke-mode is active, we are HIDING decryptions, so the button should say "SHOW"
                const icon = isKaraoke ? 'solar:eye-linear' : 'solar:eye-closed-linear';
                const label = isKaraoke ? 'Afficher les Décryptages' : 'Masquer les Décryptages';
                karaokeBtn.innerHTML = `<iconify-icon icon="${icon}" width="14"></iconify-icon><span>${label}</span>`;

                // Immediately update bubble visibility
                this.updateDecryptBubble();
            });
        }
    },

    updateDecryptBubble(activeLine) {
        const bubble = document.getElementById('decrypt-bubble');
        const content = document.getElementById('bubble-content');
        if (!bubble || !content) return;

        // If karaoke-mode is active, we are HIDING decryptions
        if (document.body.classList.contains('karaoke-mode')) {
            bubble.classList.remove('visible');
            return;
        }

        // Use activeLine if provided, otherwise find it
        let line = activeLine;
        if (!line) {
            line = document.querySelector('.lyric-line.active-lyric');
        }

        if (line) {
            const block = line.closest('.story-block');
            const analysis = block ? (block.querySelector('.analysis-content-visible') || block.querySelector('.analysis-content')) : null;
            if (analysis && analysis.innerHTML.trim() !== '') {
                content.innerHTML = analysis.innerHTML;
                bubble.classList.add('visible');
                content.scrollTop = 0;
            } else {
                bubble.classList.remove('visible');
            }
        } else {
            bubble.classList.remove('visible');
        }
    },

    initKeyboard() {
        document.addEventListener('keydown', (e) => {
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;

            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
                if (!this.audio) return;
                this.audio.paused ? this.audio.play().catch(() => { }) : this.audio.pause();
            } else if (e.key === 'ArrowLeft' && this.audio) {
                this.audio.currentTime = Math.max(0, this.audio.currentTime - 5);
            } else if (e.key === 'ArrowRight' && this.audio) {
                this.audio.currentTime = Math.min(this.audio.duration || 0, this.audio.currentTime + 5);
            }
        });
    },

    connectAnalyser() {
        if (this.isAnalyserConnected) return;
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioCtx.createAnalyser();
            this.analyser.fftSize = 128;
            this.analyser.smoothingTimeConstant = 0.8;
            this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);
            this.sourceNode.connect(this.analyser);
            this.analyser.connect(this.audioCtx.destination);
            this.isAnalyserConnected = true;
            this.animateFFT();
        } catch (err) {
            console.warn('Dynamic waveform unavailable:', err);
        }
    },

    animateFFT() {
        if (!this.analyser || !this.waveformBars.length) return;
        const freqData = new Uint8Array(64);
        const loop = () => {
            if (this.audio.paused) {
                requestAnimationFrame(loop);
                return;
            }
            this.analyser.getByteFrequencyData(freqData);
            this.waveformBars.forEach((bar, i) => {
                if (bar.classList.contains('played')) return;
                const val = freqData[i] || 0;
                const scale = 0.2 + (val / 255) * 1.5;
                bar.style.transform = `scaleY(${scale})`;
                bar.style.opacity = 0.5 + (val / 255) * 0.5;
            });
            requestAnimationFrame(loop);
        };
        loop();
    }
};
