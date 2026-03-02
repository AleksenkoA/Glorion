// Glorion Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {

    // =========================================
    // Smooth scroll for anchor links
    // =========================================
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // =========================================
    // Intersection Observer for section animations
    // =========================================
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('section').forEach(s => observer.observe(s));

    // =========================================
    // Card stagger animation on scroll
    // =========================================
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll(
                    '.stat-card, .bonus-card, .slider-card, .payment-card, .provider-card'
                );
                cards.forEach((card, i) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 80);
                });
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.stat-grid, .bonus-cards, .slider-track, .payment-grid, .provider-grid')
        .forEach(grid => cardObserver.observe(grid));

    // =========================================
    // Conditions Slider
    // =========================================
    const sliderTrack = document.querySelector('.slider-track');
    const sliderPrev = document.querySelector('.slider-prev');
    const sliderNext = document.querySelector('.slider-next');
    const dotsContainer = document.querySelector('.slider-dots');

    if (sliderTrack && sliderPrev && sliderNext && dotsContainer) {
        const cards = sliderTrack.querySelectorAll('.slider-card');
        const cardCount = cards.length;
        let currentIndex = 0;

        // Create dots
        for (let i = 0; i < cardCount; i++) {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => scrollToCard(i));
            dotsContainer.appendChild(dot);
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.slider-dot');
            dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
        }

        function scrollToCard(index) {
            if (index < 0) index = 0;
            if (index >= cardCount) index = cardCount - 1;
            currentIndex = index;
            const card = cards[index];
            sliderTrack.scrollTo({
                left: card.offsetLeft - sliderTrack.offsetLeft,
                behavior: 'smooth'
            });
            updateDots();
        }

        sliderPrev.addEventListener('click', () => scrollToCard(currentIndex - 1));
        sliderNext.addEventListener('click', () => scrollToCard(currentIndex + 1));

        // Update dots on manual scroll
        let scrollTimeout;
        sliderTrack.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollLeft = sliderTrack.scrollLeft;
                let closestIdx = 0;
                let closestDist = Infinity;
                cards.forEach((card, i) => {
                    const dist = Math.abs(card.offsetLeft - sliderTrack.offsetLeft - scrollLeft);
                    if (dist < closestDist) {
                        closestDist = dist;
                        closestIdx = i;
                    }
                });
                currentIndex = closestIdx;
                updateDots();
            }, 100);
        });

        // Auto-play slider
        let autoPlay = setInterval(() => scrollToCard((currentIndex + 1) % cardCount), 4000);
        sliderTrack.addEventListener('mouseenter', () => clearInterval(autoPlay));
        sliderTrack.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => scrollToCard((currentIndex + 1) % cardCount), 4000);
        });
    }

    // =========================================
    // Table responsive handling
    // =========================================
    document.querySelectorAll('table').forEach(table => {
        if (!table.parentElement.classList.contains('table-scroll')) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('table-scroll');
            wrapper.style.overflowX = 'auto';
            wrapper.style.webkitOverflowScrolling = 'touch';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });

    // =========================================
    // CTA button pulse on scroll into view
    // =========================================
    const ctaObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('pulse-once');
                ctaObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.cta-button').forEach(btn => ctaObserver.observe(btn));

});
