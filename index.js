// Slide Data with premium architectural renders and coordinates
const slides = [
    {
        index: "01",
        coordinate: "13°05'12\"",
        image: "images/slide_1.jpg"
    },
    {
        index: "02",
        coordinate: "08°24'42\"",
        image: "images/slide_2.jpg"
    },
    {
        index: "03",
        coordinate: "01°18'32\"",
        image: "images/slide_3.jpg"
    },
    {
        index: "04",
        coordinate: "25°46'18\"",
        image: "images/slide_4.jpg"
    },
    {
        index: "05",
        coordinate: "12°58'02\"",
        image: "images/slide_5.jpg"
    }
];

// App State
let currentIndex = 0;
let isTransitioning = false;

// Touch tracking state
let touchStartY = 0;

// DOM Elements
const indicatorsContainer = document.getElementById('slide-indicators-list');
const imgCurrent = document.getElementById('img-current');
const imgNext = document.getElementById('img-next');
const coordinatesText = document.getElementById('coordinates-text');

/**
 * Parses coordinate string (DD°MM'SS") into object
 */
function parseDMS(dmsStr) {
    const match = dmsStr.match(/(\d+)°(\d+)'(\d+)"/);
    if (!match) return { d: 0, m: 0, s: 0 };
    return {
        d: parseInt(match[1], 10),
        m: parseInt(match[2], 10),
        s: parseInt(match[3], 10)
    };
}

/**
 * Animates coordinates text by counting from source to target
 */
function animateCoordinates(fromStr, toStr, duration) {
    const fromVal = parseDMS(fromStr);
    const toVal = parseDMS(toStr);
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing: easeOutCubic
        const ease = 1 - Math.pow(1 - progress, 3);

        const currentD = Math.round(fromVal.d + (toVal.d - fromVal.d) * ease);
        const currentM = Math.round(fromVal.m + (toVal.m - fromVal.m) * ease);
        const currentS = Math.round(fromVal.s + (toVal.s - fromVal.s) * ease);

        coordinatesText.textContent = `${String(currentD).padStart(2, '0')}°${String(currentM).padStart(2, '0')}'${String(currentS).padStart(2, '0')}"`;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/**
 * Renders vertical indicators in left panel
 */
function renderIndicators() {
    indicatorsContainer.innerHTML = '';
    slides.forEach((slide, idx) => {
        const item = document.createElement('div');
        item.className = `indicator-item ${idx === currentIndex ? 'active' : ''}`;
        
        if (idx === currentIndex) {
            item.innerHTML = `${slide.index} &bull; ${String(slides.length).padStart(2, '0')}`;
        } else {
            item.innerHTML = slide.index;
        }

        item.addEventListener('click', () => {
            if (isTransitioning) return;
            goToSlide(idx);
        });
        indicatorsContainer.appendChild(item);
    });
}

/**
 * Transitions slides (wiping forward or backward based on index direction)
 */
function goToSlide(nextIndex) {
    if (nextIndex === currentIndex || isTransitioning) return;
    isTransitioning = true;

    const currentSlide = slides[currentIndex];
    const nextSlide = slides[nextIndex];
    const isForward = nextIndex > currentIndex;

    // Highlight indicator instantly
    currentIndex = nextIndex;
    renderIndicators();

    // Animate DMS coordinates text
    animateCoordinates(currentSlide.coordinate, nextSlide.coordinate, 1000);

    const startTime = performance.now();
    const duration = 1000; // 1 second transition

    if (isForward) {
        // --- FORWARD WIPE (Clockwise: 0 -> 360 degrees) ---
        imgCurrent.style.backgroundImage = `url(${currentSlide.image})`;
        imgNext.style.backgroundImage = `url(${nextSlide.image})`;
        
        const initMask = `conic-gradient(from 0deg, #000000 0deg, transparent 0deg)`;
        imgNext.style.webkitMaskImage = initMask;
        imgNext.style.maskImage = initMask;
        imgNext.style.opacity = '1';

        function sweepForward(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const ease = 1 - Math.pow(1 - progress, 3);
            const angle = ease * 360;

            const maskStr = `conic-gradient(from 0deg, #000000 ${angle}deg, transparent ${angle}deg)`;
            imgNext.style.webkitMaskImage = maskStr;
            imgNext.style.maskImage = maskStr;

            if (progress < 1) {
                requestAnimationFrame(sweepForward);
            } else {
                imgCurrent.style.backgroundImage = `url(${nextSlide.image})`;
                imgNext.style.opacity = '0';
                imgNext.style.webkitMaskImage = '';
                imgNext.style.maskImage = '';
                isTransitioning = false;
            }
        }
        requestAnimationFrame(sweepForward);

    } else {
        // --- BACKWARD WIPE (Counter-clockwise: 360 -> 0 degrees) ---
        imgCurrent.style.backgroundImage = `url(${nextSlide.image})`; // Target slide underneath
        imgNext.style.backgroundImage = `url(${currentSlide.image})`; // Current slide on top
        
        const initMask = `conic-gradient(from 0deg, #000000 360deg, transparent 360deg)`;
        imgNext.style.webkitMaskImage = initMask;
        imgNext.style.maskImage = initMask;
        imgNext.style.opacity = '1';

        function sweepBackward(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const ease = 1 - Math.pow(1 - progress, 3);
            const angle = 360 - (ease * 360);

            const maskStr = `conic-gradient(from 0deg, #000000 ${angle}deg, transparent ${angle}deg)`;
            imgNext.style.webkitMaskImage = maskStr;
            imgNext.style.maskImage = maskStr;

            if (progress < 1) {
                requestAnimationFrame(sweepBackward);
            } else {
                imgCurrent.style.backgroundImage = `url(${nextSlide.image})`;
                imgNext.style.opacity = '0';
                imgNext.style.webkitMaskImage = '';
                imgNext.style.maskImage = '';
                isTransitioning = false;
            }
        }
        requestAnimationFrame(sweepBackward);
    }
}

/**
 * Set up window level mouse wheel and touch swipe listeners
 */
function initScrollListeners() {
    // 1. Wheel Listener
    window.addEventListener('wheel', (e) => {
        if (isTransitioning) return;
        if (Math.abs(e.deltaY) < 15) return;
        
        if (e.deltaY > 0) {
            // Scroll down -> Next slide. Stop at boundary slides.
            if (currentIndex === slides.length - 1) return;
            goToSlide(currentIndex + 1);
        } else if (e.deltaY < 0) {
            // Scroll up -> Previous slide. Stop at boundary slides.
            if (currentIndex === 0) return;
            goToSlide(currentIndex - 1);
        }
    }, { passive: true });

    // 2. Touch Swipe Listeners
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (isTransitioning) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const diffY = touchStartY - touchEndY;
        
        if (Math.abs(diffY) > 50) {
            if (diffY > 0) {
                // Swipe up -> Next slide. Stop at boundary.
                if (currentIndex === slides.length - 1) return;
                goToSlide(currentIndex + 1);
            } else {
                // Swipe down -> Previous slide. Stop at boundary.
                if (currentIndex === 0) return;
                goToSlide(currentIndex - 1);
            }
        }
    }, { passive: true });
}

// Initialize Slider App with startup entry wipe animation
function init() {
    // Render initial selector indicators & configure listeners
    renderIndicators();
    initScrollListeners();

    // Configure initial layers for entry wipe (start from empty white circle)
    imgCurrent.style.backgroundImage = 'none';
    imgCurrent.style.backgroundColor = '#ffffff';
    imgNext.style.backgroundImage = `url(${slides[0].image})`;
    
    const initMask = `conic-gradient(from 0deg, #000000 0deg, transparent 0deg)`;
    imgNext.style.webkitMaskImage = initMask;
    imgNext.style.maskImage = initMask;
    imgNext.style.opacity = '1';
    
    // Start coordinate at 00°00'00"
    coordinatesText.textContent = "00°00'00\"";
    
    // Lock transitions during entry animation
    isTransitioning = true;

    // Trigger Slide 1 entry wipe clockwise from the radial line after 300ms
    setTimeout(() => {
        animateCoordinates("00°00'00\"", slides[0].coordinate, 1200);

        const startTime = performance.now();
        const duration = 1200;

        function entryWipe(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const ease = 1 - Math.pow(1 - progress, 3);
            const angle = ease * 360;

            const maskStr = `conic-gradient(from 0deg, #000000 ${angle}deg, transparent ${angle}deg)`;
            imgNext.style.webkitMaskImage = maskStr;
            imgNext.style.maskImage = maskStr;

            if (progress < 1) {
                requestAnimationFrame(entryWipe);
            } else {
                imgCurrent.style.backgroundImage = `url(${slides[0].image})`;
                imgNext.style.opacity = '0';
                imgNext.style.webkitMaskImage = '';
                imgNext.style.maskImage = '';
                isTransitioning = false; // Enable scrolling
            }
        }
        requestAnimationFrame(entryWipe);
    }, 300);
}

// Run init on load
window.addEventListener('DOMContentLoaded', init);
