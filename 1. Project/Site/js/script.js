// ==========================================
// THENDO EVENTS WEBSITE
// JAVASCRIPT FILE
// ==========================================

// Wait until the webpage has finished loading
document.addEventListener("DOMContentLoaded", function () {

    // Contact form handling
    const contactForm = document.querySelector("form");
    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            alert("Thank you for contacting Thendo Events. We will get back to you soon.");
            contactForm.reset();
        });
    }

    // --- Lightbox (full image preview with prev/next and swipe) ---
    const images = Array.from(document.querySelectorAll('img')).filter(i => !i.closest('.lightbox'));

    // Create lightbox element
    let lightbox = document.querySelector('.lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close">&times;</button>
                <button class="lightbox-prev" aria-label="Previous">&#8249;</button>
                <button class="lightbox-next" aria-label="Next">&#8250;</button>
                <img src="" alt="" />
            </div>
        `;
        document.body.appendChild(lightbox);
    }

    const lbImg = lightbox.querySelector('img');
    const btnClose = lightbox.querySelector('.lightbox-close');
    const btnPrev = lightbox.querySelector('.lightbox-prev');
    const btnNext = lightbox.querySelector('.lightbox-next');

    let currentIndex = 0;
    let touchStartX = 0;

    function openLightbox(index) {
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;
        currentIndex = index;
        const src = images[currentIndex].src;
        const alt = images[currentIndex].alt || 'Thendo Events image';
        lbImg.src = src;
        lbImg.alt = alt;
        lightbox.classList.add('open');
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        lbImg.src = '';
        lbImg.alt = '';
    }

    images.forEach((img, idx) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => openLightbox(idx));
    });

    btnClose.addEventListener('click', closeLightbox);
    btnPrev.addEventListener('click', () => openLightbox(currentIndex - 1));
    btnNext.addEventListener('click', () => openLightbox(currentIndex + 1));

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
        if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
    });

    lightbox.addEventListener('touchstart', function (e) { if (e.touches && e.touches[0]) touchStartX = e.touches[0].clientX; }, {passive:true});
    lightbox.addEventListener('touchend', function (e) {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        const dx = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 50) {
            if (dx > 0) openLightbox(currentIndex + 1); else openLightbox(currentIndex - 1);
        }
    }, {passive:true});

    // --- Services slideshow (JS controlled, visible prev/next, autoplay, swipe) ---
    document.querySelectorAll('.services-video').forEach(function (svc) {
        const slides = Array.from(svc.querySelectorAll('.slide'));
        const btnPrev = svc.querySelector('.svc-prev');
        const btnNext = svc.querySelector('.svc-next');
        const caption = svc.querySelector('.svc-caption');
        let idx = 0;
        let autoplay = true;
        let timer = null;

        function show(i) {
            slides.forEach((s, j) => s.classList.toggle('active', j === i));
            const label = slides[i].getAttribute('data-label') || '';
            if (caption) caption.textContent = label;
            idx = i;
        }

        function next() { show((idx + 1) % slides.length); }
        function prev() { show((idx - 1 + slides.length) % slides.length); }

        function start() {
            stop();
            timer = setInterval(next, 4500);
        }

        function stop() { if (timer) { clearInterval(timer); timer = null; } }

        // init
        if (slides.length) show(0);
        if (autoplay) start();

        svc.addEventListener('mouseenter', stop);
        svc.addEventListener('mouseleave', start);

        if (btnPrev) btnPrev.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
        if (btnNext) btnNext.addEventListener('click', function (e) { e.stopPropagation(); next(); });

        // touch swipe
        let tx = 0;
        svc.addEventListener('touchstart', function (e) { if (e.touches && e.touches[0]) tx = e.touches[0].clientX; }, {passive:true});
        svc.addEventListener('touchend', function (e) {
            if (!e.changedTouches || !e.changedTouches[0]) return;
            const dx = tx - e.changedTouches[0].clientX;
            if (Math.abs(dx) > 50) { if (dx > 0) next(); else prev(); }
        }, {passive:true});
    });

});