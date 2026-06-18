/**
 * RadialSlider - Self-Contained Architectural Scroll Slider
 * Version: 1.0.1
 * Exposed class: window.RadialSlider
 */
(function() {
    // 1. Dynamic Font Injection
    if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Outfit"]')) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600&display=swap';
        document.head.appendChild(fontLink);
    }

    // 2. Embedded CSS Stylesheet (Scoped to prevent style bleeding)
    const cssStyles = `
        #radial-slider-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            min-height: 100vh;
            position: relative;
            background-color: #ffffff;
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            user-select: none;
            overflow: hidden;
        }

        #radial-slider-wrapper .slider-left {
            position: absolute;
            left: 80px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 100;
        }

        #radial-slider-wrapper .slide-indicators {
            display: flex;
            flex-direction: column;
            gap: 32px;
        }

        #radial-slider-wrapper .indicator-item {
            font-size: 13px;
            font-weight: 300;
            color: #cccccc;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            align-items: center;
            gap: 12px;
            font-variant-numeric: tabular-nums;
        }

        #radial-slider-wrapper .indicator-item::before {
            content: '';
            display: inline-block;
            width: 0;
            height: 1px;
            background-color: #000000;
            transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        #radial-slider-wrapper .indicator-item.active {
            color: #000000;
            font-weight: 500;
            font-size: 18px;
            transform: translateX(10px);
        }

        #radial-slider-wrapper .indicator-item.active::before {
            width: 16px;
        }

        #radial-slider-wrapper .indicator-item:hover {
            color: #000000;
        }

        #radial-slider-wrapper .slider-center {
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 50;
        }

        #radial-slider-wrapper .circle-slider-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
        }

        #radial-slider-wrapper .circle-frame {
            width: 280px; /* Scaled from 190px */
            height: 280px; /* Scaled from 190px */
            position: relative;
            border-radius: 50%;
            overflow: visible;
        }

        #radial-slider-wrapper .slide-image-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
            background-size: cover;
            background-position: center;
            background-color: #ffffff;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        #radial-slider-wrapper .slide-image-layer.current {
            z-index: 1;
        }

        #radial-slider-wrapper .slide-image-layer.next {
            z-index: 2;
            -webkit-mask-image: conic-gradient(from 205deg, #000000 0deg, transparent 0deg);
            mask-image: conic-gradient(from 205deg, #000000 0deg, transparent 0deg);
        }

        #radial-slider-wrapper .center-dot {
            width: 11px; /* Scaled from 9px */
            height: 11px; /* Scaled from 9px */
            background-color: #000000;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
            box-shadow: 0 0 0 2px #ffffff;
        }

        #radial-slider-wrapper .radial-line {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 280px; /* Scaled from 190px */
            height: 1px;
            background-color: #e2e2e2;
            transform-origin: 0% 50%;
            z-index: 5;
            transform: rotate(205deg);
        }

        #radial-slider-wrapper .radial-line::after {
            content: '';
            position: absolute;
            right: 0;
            top: -2.5px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #cccccc;
        }

        #radial-slider-wrapper .coordinates-wrapper {
            margin-top: 48px;
            display: flex;
            justify-content: center;
        }

        #radial-slider-wrapper .coordinates-text {
            font-size: 14px;
            font-weight: 300;
            letter-spacing: 1.5px;
            color: #000000;
            font-variant-numeric: tabular-nums;
            font-family: 'Outfit', monospace;
        }

        @media (max-width: 768px) {
            #radial-slider-wrapper .slider-left {
                left: 30px;
            }
            #radial-slider-wrapper .circle-frame {
                width: 180px;
                height: 180px;
            }
            #radial-slider-wrapper .radial-line {
                width: 180px;
            }
        }
    `;

    // Inject CSS
    const styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.appendChild(document.createTextNode(cssStyles));
    document.head.appendChild(styleEl);

    // 3. Slider Object Module Definition
    class RadialSlider {
        constructor(options = {}) {
            this.containerId = options.containerId || 'radial-slider';
            
            // Default slides matching project images
            this.slides = options.slides || [
                { index: "01", coordinate: "13°05'12\"", image: "images/slide_1.jpg" },
                { index: "02", coordinate: "08°24'42\"", image: "images/slide_2.jpg" },
                { index: "03", coordinate: "01°18'32\"", image: "images/slide_3.jpg" },
                { index: "04", coordinate: "25°46'18\"", image: "images/slide_4.jpg" },
                { index: "05", coordinate: "12°58'02\"", image: "images/slide_5.jpg" }
            ];
            
            this.currentIndex = 0;
            this.isTransitioning = false;
            this.touchStartY = 0;

            this.targetContainer = document.getElementById(this.containerId);
            if (!this.targetContainer) {
                console.error(`RadialSlider: Container with ID "${this.containerId}" not found.`);
                return;
            }

            this.initLayout();
            this.initDOMRefs();
            this.initListeners();
            this.triggerEntryWipe();
        }

        initLayout() {
            // Inject structural HTML layout inside the user container
            this.targetContainer.innerHTML = `
                <div id="radial-slider-wrapper">
                    <!-- Left Slide Indicators Panel -->
                    <section class="slider-left">
                        <div class="slide-indicators" id="rs-indicators-list"></div>
                    </section>

                    <!-- Center circular image frame and line -->
                    <section class="slider-center">
                        <div class="circle-slider-wrapper">
                            <div class="circle-frame">
                                <div class="slide-image-layer current" id="rs-img-current"></div>
                                <div class="slide-image-layer next" id="rs-img-next"></div>
                                <div class="radial-line"></div>
                                <div class="center-dot"></div>
                            </div>
                            <!-- DMS Coordinate text -->
                            <div class="coordinates-wrapper">
                                <div class="coordinates-text" id="rs-coordinates-text"></div>
                            </div>
                        </div>
                    </section>
                </div>
            `;
        }

        initDOMRefs() {
            this.indicatorsContainer = document.getElementById('rs-indicators-list');
            this.imgCurrent = document.getElementById('rs-img-current');
            this.imgNext = document.getElementById('rs-img-next');
            this.coordinatesText = document.getElementById('rs-coordinates-text');

            // Render selectors
            this.renderIndicators();
        }

        triggerEntryWipe() {
            // Configure starting states for page-load entry animation
            this.imgCurrent.style.backgroundImage = 'none';
            this.imgCurrent.style.backgroundColor = '#ffffff';
            this.imgNext.style.backgroundImage = `url(${this.slides[0].image})`;
            
            const initMask = `conic-gradient(from 205deg, #000000 0deg, transparent 0deg)`;
            this.imgNext.style.webkitMaskImage = initMask;
            this.imgNext.style.maskImage = initMask;
            this.imgNext.style.opacity = '1';
            
            this.coordinatesText.textContent = "00°00'00\"";
            this.isTransitioning = true; // Lock scrolls during entry wipe

            const self = this;
            setTimeout(() => {
                self.animateCoordinates("00°00'00\"", self.slides[0].coordinate, 1200);

                const startTime = performance.now();
                const duration = 1200;

                function entryWipe(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    const ease = 1 - Math.pow(1 - progress, 3);
                    const angle = ease * 360;

                    const maskStr = `conic-gradient(from 205deg, #000000 ${angle}deg, transparent ${angle}deg)`;
                    self.imgNext.style.webkitMaskImage = maskStr;
                    self.imgNext.style.maskImage = maskStr;

                    if (progress < 1) {
                        requestAnimationFrame(entryWipe);
                    } else {
                        self.imgCurrent.style.backgroundImage = `url(${self.slides[0].image})`;
                        self.imgNext.style.opacity = '0';
                        self.imgNext.style.webkitMaskImage = '';
                        self.imgNext.style.maskImage = '';
                        self.isTransitioning = false; // Enable scrolling
                    }
                }
                requestAnimationFrame(entryWipe);
            }, 300);
        }

        parseDMS(dmsStr) {
            const match = dmsStr.match(/(\d+)°(\d+)'(\d+)"/);
            if (!match) return { d: 0, m: 0, s: 0 };
            return {
                d: parseInt(match[1], 10),
                m: parseInt(match[2], 10),
                s: parseInt(match[3], 10)
            };
        }

        animateCoordinates(fromStr, toStr, duration) {
            const fromVal = this.parseDMS(fromStr);
            const toVal = this.parseDMS(toStr);
            const startTime = performance.now();
            const textEl = this.coordinatesText;

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // easeOutCubic
                const ease = 1 - Math.pow(1 - progress, 3);

                const currentD = Math.round(fromVal.d + (toVal.d - fromVal.d) * ease);
                const currentM = Math.round(fromVal.m + (toVal.m - fromVal.m) * ease);
                const currentS = Math.round(fromVal.s + (toVal.s - fromVal.s) * ease);

                textEl.textContent = `${String(currentD).padStart(2, '0')}°${String(currentM).padStart(2, '0')}'${String(currentS).padStart(2, '0')}"`;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        }

        renderIndicators() {
            this.indicatorsContainer.innerHTML = '';
            this.slides.forEach((slide, idx) => {
                const item = document.createElement('div');
                item.className = `indicator-item ${idx === this.currentIndex ? 'active' : ''}`;
                
                if (idx === this.currentIndex) {
                    item.innerHTML = `${slide.index} &bull; ${String(this.slides.length).padStart(2, '0')}`;
                } else {
                    item.innerHTML = slide.index;
                }

                item.addEventListener('click', () => {
                    if (this.isTransitioning) return;
                    this.goToSlide(idx);
                });
                this.indicatorsContainer.appendChild(item);
            });
        }

        goToSlide(nextIndex) {
            if (nextIndex === this.currentIndex || this.isTransitioning) return;
            this.isTransitioning = true;

            const currentSlide = this.slides[this.currentIndex];
            const nextSlide = this.slides[nextIndex];
            const isForward = nextIndex > this.currentIndex;

            // Instantly highlight target indicator
            this.currentIndex = nextIndex;
            this.renderIndicators();

            // Animate coordinate counter
            this.animateCoordinates(currentSlide.coordinate, nextSlide.coordinate, 1000);

            const startTime = performance.now();
            const duration = 1000;
            const self = this;

            if (isForward) {
                // Forward clock-wipe (0 -> 360)
                this.imgCurrent.style.backgroundImage = `url(${currentSlide.image})`;
                this.imgNext.style.backgroundImage = `url(${nextSlide.image})`;
                
                const initMask = `conic-gradient(from 205deg, #000000 0deg, transparent 0deg)`;
                this.imgNext.style.webkitMaskImage = initMask;
                this.imgNext.style.maskImage = initMask;
                this.imgNext.style.opacity = '1';

                function sweepForward(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    const ease = 1 - Math.pow(1 - progress, 3);
                    const angle = ease * 360;

                    const maskStr = `conic-gradient(from 205deg, #000000 ${angle}deg, transparent ${angle}deg)`;
                    self.imgNext.style.webkitMaskImage = maskStr;
                    self.imgNext.style.maskImage = maskStr;

                    if (progress < 1) {
                        requestAnimationFrame(sweepForward);
                    } else {
                        self.imgCurrent.style.backgroundImage = `url(${nextSlide.image})`;
                        self.imgNext.style.opacity = '0';
                        self.imgNext.style.webkitMaskImage = '';
                        self.imgNext.style.maskImage = '';
                        self.isTransitioning = false;
                    }
                }
                requestAnimationFrame(sweepForward);

            } else {
                // Backward un-wipe (360 -> 0)
                this.imgCurrent.style.backgroundImage = `url(${nextSlide.image})`;
                this.imgNext.style.backgroundImage = `url(${currentSlide.image})`;
                
                const initMask = `conic-gradient(from 205deg, #000000 360deg, transparent 360deg)`;
                this.imgNext.style.webkitMaskImage = initMask;
                this.imgNext.style.maskImage = initMask;
                this.imgNext.style.opacity = '1';

                function sweepBackward(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    const ease = 1 - Math.pow(1 - progress, 3);
                    const angle = 360 - (ease * 360);

                    const maskStr = `conic-gradient(from 205deg, #000000 ${angle}deg, transparent ${angle}deg)`;
                    self.imgNext.style.webkitMaskImage = maskStr;
                    self.imgNext.style.maskImage = maskStr;

                    if (progress < 1) {
                        requestAnimationFrame(sweepBackward);
                    } else {
                        self.imgCurrent.style.backgroundImage = `url(${nextSlide.image})`;
                        self.imgNext.style.opacity = '0';
                        self.imgNext.style.webkitMaskImage = '';
                        self.imgNext.style.maskImage = '';
                        self.isTransitioning = false;
                    }
                }
                requestAnimationFrame(sweepBackward);
            }
        }

        initListeners() {
            // 1. Mouse wheel scroll direction listener
            window.addEventListener('wheel', (e) => {
                if (this.isTransitioning) return;
                if (Math.abs(e.deltaY) < 15) return;

                if (e.deltaY > 0) {
                    // Scroll down -> Forward. Stop at boundary slides.
                    if (this.currentIndex === this.slides.length - 1) return;
                    this.goToSlide(this.currentIndex + 1);
                } else if (e.deltaY < 0) {
                    // Scroll up -> Backward. Stop at boundary slides.
                    if (this.currentIndex === 0) return;
                    this.goToSlide(this.currentIndex - 1);
                }
            }, { passive: true });

            // 2. Mobile vertical swipe touch listeners
            window.addEventListener('touchstart', (e) => {
                this.touchStartY = e.touches[0].clientY;
            }, { passive: true });

            window.addEventListener('touchend', (e) => {
                if (this.isTransitioning) return;
                
                const touchEndY = e.changedTouches[0].clientY;
                const diffY = this.touchStartY - touchEndY;
                
                if (Math.abs(diffY) > 50) {
                    if (diffY > 0) {
                        // Swipe up -> Forward
                        if (this.currentIndex === this.slides.length - 1) return;
                        this.goToSlide(this.currentIndex + 1);
                    } else {
                        // Swipe down -> Backward
                        if (this.currentIndex === 0) return;
                        this.goToSlide(this.currentIndex - 1);
                    }
                }
            }, { passive: true });
        }
    }

    // Expose class globally
    window.RadialSlider = RadialSlider;

    // Auto-initialize if container with ID "radial-slider" is present on load
    window.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('radial-slider')) {
            new RadialSlider();
        }
    });
})();
