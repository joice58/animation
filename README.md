# Scroll-Driven Radial Slider

A minimal, premium scroll-driven (wheel/touch swipe) circular slider animation webpage featuring architectural renders, vertical indicators, and dynamic coordinates.

---

## Live Demo
You can view the live interactive page here:
👉 **[https://joice58.github.io/animation/](https://joice58.github.io/animation/)**

---

## 1. File Preparation
To integrate this animation into your website, make sure to copy these files from the repository to your server:
- **`radial-slider.js`**: The self-contained drop-in module.
- **`images/`**: The folder containing the slide images (`slide_1.jpg` to `slide_5.jpg`).

---

## 2. HTML Markup
Add this empty container tag where you want the slider to render in your HTML structure:
```html
<div id="radial-slider"></div>
```

---

## 3. CSS Layout
Add the following styles to size the container properly:
```css
#radial-slider {
    width: 100%;
    height: 100vh; /* Takes full viewport height */
    position: relative;
    overflow: hidden;
    background-color: #ffffff;
}
```

---

## 4. Script Inclusion

### Method A: Auto-Initialization (Default)
If your container uses the default ID `#radial-slider`, simply load the script at the bottom of your HTML body (before the `</body>` tag):
```html
<script src="radial-slider.js"></script>
```

### Method B: Manual Initialization (Custom Assets / Paths)
If your files are stored in a different folder hierarchy, or you want to supply custom coordinate labels or image URLs, load the script and instantiate it manually:
```html
<!-- Load the script -->
<script src="radial-slider.js"></script>

<!-- Manually initialize with options -->
<script>
    const slider = new RadialSlider({
        containerId: 'radial-slider', // Custom container ID
        slides: [
            { index: "01", coordinate: "13°05'12\"", image: "assets/images/slide_1.jpg" },
            { index: "02", coordinate: "08°24'42\"", image: "assets/images/slide_2.jpg" },
            { index: "03", coordinate: "01°18'32\"", image: "assets/images/slide_3.jpg" },
            { index: "04", coordinate: "25°46'18\"", image: "assets/images/slide_4.jpg" },
            { index: "05", coordinate: "12°58'02\"", image: "assets/images/slide_5.jpg" }
        ]
    });
</script>
```

---

## 5. Technical Specifications & Behavior
- **Circle Diameter**: `280px` (scales down dynamically to `180px` on mobile viewports).
- **Initial State**: Starts at `130°` (rotated radial hand at bottom-left with `transform-origin` at `0% 100%`).
- **Entry Animation**: On load, Slide 1 wipes clockwise from the `220°` angle to `360°` while the coordinates count up from `00°00'00"`.
- **Navigation Sensing**: Intercepts `wheel` and `touch` gesture directions. Scroll down (or swipe up) wipes the next image clockwise. Scroll up (or swipe down) un-wipes the current image counter-clockwise.
- **Boundaries**: Locked at Slide 1 and Slide 5.
