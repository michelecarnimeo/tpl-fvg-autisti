/* Tests UI behavior: sticky module headers with hysteresis-based thin/expand */
(function () {
    const THIN_CLASS = 'thin--14';
    const THIN_ON = 8;   // px from sticky top when to thin
    const THIN_OFF = 80; // px from sticky top when to unthin
    const ANIM_MS = 400;

    let ticking = false;

    function getStickyTopPx(el) {
        const st = getComputedStyle(el);
        const top = parseFloat(st.top || '0');
        return Number.isFinite(top) ? top : 0;
    }

    function applyThinPresetToHeader(header) {
        if (!header.classList.contains('thin')) header.classList.add('thin');
        if (!header.classList.contains(THIN_CLASS)) header.classList.add(THIN_CLASS);
    }

    function setThinState(header, shouldThin) {
        const isThin = header.dataset.thin === 'true';
        if (shouldThin === isThin) return; // no state change

        if (shouldThin) {
            applyThinPresetToHeader(header);
            header.dataset.thin = 'true';
            header.classList.remove('animating-expand');
            header.classList.add('animating-shrink');
            setTimeout(() => header.classList.remove('animating-shrink'), ANIM_MS);
        } else {
            header.dataset.thin = 'false';
            header.classList.remove('animating-shrink');
            header.classList.add('animating-expand');
            // keep preset class attached but thin removed for visibility
            header.classList.remove('thin');
            setTimeout(() => header.classList.remove('animating-expand'), ANIM_MS);
        }
    }

    function updateHeaderApproachState(headers) {
        for (let i = 0; i < headers.length; i++) {
            const h = headers[i];
            const next = headers[i + 1];
            h.classList.remove('hiding');
            if (!next) continue;
            const rect = h.getBoundingClientRect();
            const nextRect = next.getBoundingClientRect();
            const topOffset = getStickyTopPx(h);
            const overlapThreshold = Math.max(0, rect.height - 8);
            if ((nextRect.top - topOffset) < overlapThreshold) {
                h.classList.add('hiding');
            }
        }
    }

    function hideScrolledHeaders() {
        const headers = Array.from(document.querySelectorAll('.test-header'));
        if (!headers.length) return;

        headers.forEach(header => {
            const rect = header.getBoundingClientRect();
            const topOffset = getStickyTopPx(header);
            const delta = rect.top - topOffset; // distance of header from its sticky origin
            const isThin = header.dataset.thin === 'true';
            if (!isThin && delta <= THIN_ON) {
                setThinState(header, true);
            } else if (isThin && delta >= THIN_OFF) {
                setThinState(header, false);
            }
        });

        updateHeaderApproachState(headers);
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => { hideScrolledHeaders(); ticking = false; });
            ticking = true;
        }
    }

    // Optional tiny enhancement: animate progress bar fills declared with data-progress
    function initProgressBars() {
        document.querySelectorAll('.test-header .test-bar-fill[data-progress]')
            .forEach(fill => {
                const pct = parseFloat(fill.getAttribute('data-progress')) || 0;
                // tiny async to trigger CSS transition
                requestAnimationFrame(() => { fill.style.width = Math.min(Math.max(pct, 0), 100) + '%'; });
            });
    }

    // Optional: timestamps with data-ts (ISO or ms)
    function formatRelative(d) {
        const now = Date.now();
        const diff = Math.max(0, now - d);
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'ora';
        if (mins < 60) return `${mins} min fa`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs} h fa`;
        const days = Math.floor(hrs / 24);
        return `${days} gg fa`;
    }

    function initTimestamps() {
        function update() {
            document.querySelectorAll('.test-header .test-timestamp[data-ts]').forEach(el => {
                const raw = el.getAttribute('data-ts');
                let t = Date.parse(raw);
                if (!Number.isFinite(t)) {
                    const n = parseFloat(raw);
                    t = Number.isFinite(n) ? n : Date.now();
                }
                el.textContent = `Aggiornato ${formatRelative(t)}`;
            });
        }
        update();
        setInterval(update, 60000);
    }

    function bootstrap() {
        // Initial pass
        hideScrolledHeaders();
        initProgressBars();
        initTimestamps();

        // Listeners
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
})();
