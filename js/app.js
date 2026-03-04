document.addEventListener('DOMContentLoaded', () => {

    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let dotX = 0, dotY = 0, outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        dotX = e.clientX;
        dotY = e.clientY;

        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
    });

    const animateCursor = () => {
        outlineX += (dotX - outlineX) * 0.15;
        outlineY += (dotY - outlineY) * 0.15;

        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;

        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const interactiveElements = document.querySelectorAll('a, button, .interactive, .progress-bar-container, .story-block, .chapter-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });


    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));


    // Audio Player Logic
    const audio = document.getElementById('main-audio');
    const playBtn = document.getElementById('play-pause-btn');
    const progressFill = document.querySelector('.progress-fill');
    const progressThumb = document.querySelector('.progress-thumb');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    const progressContainer = document.querySelector('.progress-bar-container');
    const storyBlocks = document.querySelectorAll('.story-block[data-time]');
    const analysisPlaceholder = document.getElementById('analysis-placeholder');
    const analysisCard = document.getElementById('dynamic-analysis-card');

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    audio.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audio.duration);
    });

    const togglePlay = () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    };

    playBtn.addEventListener('click', togglePlay);

    audio.addEventListener('play', () => {
        playBtn.innerHTML = '<iconify-icon icon="solar:pause-bold" width="20"></iconify-icon>';
    });

    audio.addEventListener('pause', () => {
        playBtn.innerHTML = '<iconify-icon icon="solar:play-bold" width="20"></iconify-icon>';
    });

    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percent || 0}%`;
        progressThumb.style.left = `${percent || 0}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);

        // Auto-highlight active block based on time
        storyBlocks.forEach(block => {
            const time = parseFloat(block.dataset.time);
            if (audio.currentTime >= time && audio.currentTime < (time + 10)) { // Simple buffer
                // Could automatically update analysis here if wanted
            }
        });
    });

    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(clickX / rect.width, 1));
        audio.currentTime = percent * audio.duration;
    });

    // Interactive Lyrics & Dynamic Analysis
    storyBlocks.forEach(block => {
        const lyricsText = block.querySelector('.lyrics-text');
        if (lyricsText) {
            lyricsText.classList.add('interactive');
            lyricsText.addEventListener('click', () => {
                const time = parseFloat(block.dataset.time);
                audio.currentTime = time;
                if (audio.paused) audio.play();

                // Update analysis card
                const analysisContent = block.querySelector('.analysis-content').innerHTML;

                // Transition effect
                analysisCard.style.opacity = '0';
                analysisCard.style.transform = 'translateY(10px)';

                setTimeout(() => {
                    analysisPlaceholder.innerHTML = analysisContent;
                    analysisCard.style.opacity = '1';
                    analysisCard.style.transform = 'translateY(0)';
                }, 300);

                // Highlight effect
                storyBlocks.forEach(b => b.querySelector('.lyrics-text').classList.remove('text-white', 'font-medium'));
                lyricsText.classList.add('text-white', 'font-medium');
            });
        }
    });

    // Volume Control Logic
    const volumeContainer = document.getElementById('volume-container');
    const volumeFill = document.getElementById('volume-fill');
    const volumeThumb = document.getElementById('volume-thumb');
    const muteBtn = document.getElementById('mute-btn');

    let isMuted = false;
    let previousVolume = 1;

    const updateVolumeUI = (vol) => {
        const percent = vol * 100;
        volumeFill.style.width = `${percent}%`;
        volumeThumb.style.left = `${percent}%`;

        if (vol === 0) {
            muteBtn.innerHTML = '<iconify-icon icon="solar:volume-cross-linear" width="18"></iconify-icon>';
        } else if (vol < 0.5) {
            muteBtn.innerHTML = '<iconify-icon icon="solar:volume-small-linear" width="18"></iconify-icon>';
        } else {
            muteBtn.innerHTML = '<iconify-icon icon="solar:volume-loud-linear" width="18"></iconify-icon>';
        }
    };

    volumeContainer.addEventListener('click', (e) => {
        const rect = volumeContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        let vol = Math.max(0, Math.min(clickX / rect.width, 1));

        audio.volume = vol;
        isMuted = vol === 0;
        if (!isMuted) previousVolume = vol;
        updateVolumeUI(vol);
    });

    muteBtn.addEventListener('click', () => {
        if (isMuted) {
            audio.volume = previousVolume > 0 ? previousVolume : 1;
            isMuted = false;
        } else {
            previousVolume = audio.volume;
            audio.volume = 0;
            isMuted = true;
        }
        updateVolumeUI(audio.volume);
    });


    // Reading Progress Bar
    const progressBar = document.getElementById('reading-progress');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / documentHeight) * 100;
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }
    });

});
