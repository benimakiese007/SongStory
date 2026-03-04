/**
 * SongStory — PWA Manager
 * Enregistre le Service Worker et gère le prompt d'installation
 */

(function () {
    // ─── 1. Enregistrement du Service Worker ───
    if ('serviceWorker' in navigator) {
        // Détermine la racine du SW selon la profondeur de la page
        const swPath = window.location.pathname.includes('/songs/') ||
            window.location.pathname.includes('/artists/')
            ? '../sw.js'
            : '/sw.js';

        navigator.serviceWorker.register(swPath, { scope: '/' })
            .then(reg => console.log('[PWA] Service Worker enregistré', reg.scope))
            .catch(err => console.warn('[PWA] Échec enregistrement SW:', err));
    }

    // ─── 2. Prompt d'installation ───
    let deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallBanner();
    });

    function showInstallBanner() {
        // Ne pas afficher si déjà installé ou si l'utilisateur a refusé récemment
        if (localStorage.getItem('ss_pwa_dismissed')) return;
        if (window.matchMedia('(display-mode: standalone)').matches) return;

        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.innerHTML = `
            <div class="pwa-banner-content">
                <div class="pwa-banner-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                    </svg>
                </div>
                <div class="pwa-banner-text">
                    <strong>Installer SongStory</strong>
                    <span>Accédez aux analyses hors-ligne</span>
                </div>
                <div class="pwa-banner-actions">
                    <button id="pwa-install-btn" class="pwa-btn-install">Installer</button>
                    <button id="pwa-dismiss-btn" class="pwa-btn-dismiss">✕</button>
                </div>
            </div>
        `;

        // Styles inline pour l'autonomie
        banner.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            z-index: 9999;
            background: rgba(24, 24, 27, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(251, 191, 36, 0.3);
            border-radius: 16px;
            padding: 0;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            font-family: 'Inter', sans-serif;
            max-width: 380px;
            width: calc(100vw - 32px);
        `;

        const style = document.createElement('style');
        style.textContent = `
            #pwa-install-banner .pwa-banner-content {
                display: flex; align-items: center; gap: 12px; padding: 14px 16px;
            }
            #pwa-install-banner .pwa-banner-icon {
                width: 36px; height: 36px; background: rgba(251,191,36,0.15);
                border-radius: 10px; display: flex; align-items: center;
                justify-content: center; color: #fbbf24; flex-shrink: 0;
            }
            #pwa-install-banner .pwa-banner-text {
                flex: 1; min-width: 0;
            }
            #pwa-install-banner .pwa-banner-text strong {
                display: block; color: #fff; font-size: 13px; font-weight: 500;
            }
            #pwa-install-banner .pwa-banner-text span {
                display: block; color: #71717a; font-size: 11px; margin-top: 1px;
            }
            #pwa-install-banner .pwa-banner-actions {
                display: flex; align-items: center; gap: 8px; flex-shrink: 0;
            }
            #pwa-install-banner .pwa-btn-install {
                background: #fbbf24; color: #09090b; border: none; border-radius: 8px;
                padding: 7px 14px; font-size: 12px; font-weight: 600;
                cursor: pointer; font-family: 'Inter', sans-serif;
                transition: background 0.2s;
            }
            #pwa-install-banner .pwa-btn-install:hover { background: #f59e0b; }
            #pwa-install-banner .pwa-btn-dismiss {
                background: none; border: none; color: #52525b;
                cursor: pointer; font-size: 14px; padding: 4px 6px;
                transition: color 0.2s;
            }
            #pwa-install-banner .pwa-btn-dismiss:hover { color: #a1a1aa; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(banner);

        // Animation d'entrée
        requestAnimationFrame(() => {
            banner.style.opacity = '1';
            banner.style.transform = 'translateX(-50%) translateY(0)';
        });

        document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log('[PWA] Choix utilisateur:', outcome);
            deferredPrompt = null;
            hideBanner(banner);
        });

        document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
            localStorage.setItem('ss_pwa_dismissed', '1');
            hideBanner(banner);
        });
    }

    function hideBanner(banner) {
        banner.style.opacity = '0';
        banner.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => banner.remove(), 400);
    }

    // ─── 3. Badge de statut hors-ligne ───
    function updateOnlineStatus() {
        const offlineBadge = document.getElementById('offline-badge');
        if (!navigator.onLine) {
            if (!offlineBadge) {
                const badge = document.createElement('div');
                badge.id = 'offline-badge';
                badge.textContent = '⚡ Mode hors-ligne';
                badge.style.cssText = `
                    position: fixed; top: 70px; left: 50%; transform: translateX(-50%);
                    background: rgba(251,191,36,0.15); border: 1px solid rgba(251,191,36,0.4);
                    color: #fbbf24; padding: 6px 16px; border-radius: 999px;
                    font-size: 12px; font-family: 'Inter', sans-serif;
                    z-index: 9998; backdrop-filter: blur(10px);
                `;
                document.body.appendChild(badge);
            }
        } else {
            offlineBadge?.remove();
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

})();
