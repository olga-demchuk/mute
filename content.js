(function () {
    'use strict';

    let styleElement = null;
    let toggle = true; // Стили включаются по умолчанию

    function createStyles() {
        const style = document.createElement('style');
        style.id = 'trello-style-toggle';
        style.innerHTML = `
            .nav,
            #header,
            .board-header,
            nav[data-testid="workspace-navigation-nav"],
            div[data-testid="list-composer-button-container"],
            span[data-testid="badge-card-notifications-count"],
            span[data-testid="badge-card-description"],
            span[data-testid="card-attachments-count"],
            span[data-testid="checklist-badge"],
            span[data-testid="badge-card-comments"],
            span[data-testid="badge-card-trello-attachments-count"],
            div[data-testid="list-header"] p,
            div[data-testid="list-footer"] {
                display: none !important;
            }
            nav > *[role="group"]:has([role="presentation"]) {
                display: none;
            }
            #trello-board-root-low-res-background-preview,
            .rccdZc1gsko_Fg,
            .YVndrKXAZpaYS4,
            div[data-testid="split-screen-panel"],
            #content > div > div {
                background-image: none !important;
                background-color: transparent !important;
            }
            #board {
                justify-content: center;
            }
            #trello-root,
            #trello-board-root {
                background-image: none !important;
                background: linear-gradient(#242d3b, #000) !important;
            }
            li[data-testid="list-wrapper"]:has(ol[hidden]) {
                display: none;
            }
            div[data-testid="card-front-cover"] {
                display: none;
            }
            .badge:has(.plugin-icon[style*="github.trello.services/images/icon.svg"]) {
                display: none;
            }
        `;
        return style;
    }

    function removePrefixes() {
        document.querySelectorAll('[data-testid="badge-custom-field"] span').forEach(span => {
            if (span.textContent.startsWith('Project:')) {
                span.textContent = span.textContent.replace(/^Project:\s*/, '');
            }
            if (span.textContent.startsWith('Effort:')) {
                span.textContent = span.textContent.replace(/^Effort:\s*/, '');
            }
        });
    }

    function observeAndRemovePrefixes() {
        const observer = new MutationObserver(() => {
            const targets = document.querySelectorAll('[data-testid="badge-custom-field"] span');
            if (targets.length > 0) {
                removePrefixes();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function enableStyles() {
        if (!document.getElementById('trello-style-toggle')) {
            styleElement = createStyles();
            document.head.appendChild(styleElement);
            toggle = true;
        }
    }

    function disableStyles() {
        const existing = document.getElementById('trello-style-toggle');
        if (existing) {
            existing.remove();
            toggle = false;
        }
    }

    function toggleStyles() {
        removePrefixes();
        if (toggle) {
            disableStyles();
        } else {
            enableStyles();
        }
    }

    // Включаем стили при загрузке
    enableStyles();

    // Убираем лишние префиксы в бейлджах
    observeAndRemovePrefixes();

    // Слушаем клавиши
    window.addEventListener('keydown', function (e) {
        const key = e.key.toLowerCase();
        if (key === 'm' || e.key === 'ь') {
            toggleStyles();
        }
        if (key === 'u' || key === 'г') {
            observeAndRemovePrefixes();
            console.debug('[Mute] Prefixes re-applied');
        }
    });
})();
