# Website Integration Guide

This guide explains how to integrate the scroll-driven circular slider animation into your existing website.

---

## Step 1: Upload the Required Files
Upload the following files from this repository to your web server:
1. **`radial-slider.js`**
2. **`images/`** folder (containing `slide_1.jpg` to `slide_5.jpg`)

---

## Step 2: Add the HTML Container
Place this single HTML tag in your webpage where you want the slider animation to appear:
```html
<div id="radial-slider"></div>
```

---

## Step 3: Add CSS Styling
Add these styles to your website's CSS file to make sure the slider occupies the correct dimensions (recommended to set to `100vh` to fill the screen):
```css
#radial-slider {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
    background-color: #ffffff;
}
```

---

## Step 4: Include the Script
Load the script at the very bottom of your HTML file, just before the closing `</body>` tag:
```html
<script src="radial-slider.js"></script>
```

---

## Step 5: (Optional) Customize Image Paths & Coordinates
If you want to use different image files or place them in a different folder, you can manually initialize the slider in JavaScript:

```html
<!-- Load the script first -->
<script src="radial-slider.js"></script>

<!-- Manually initialize with your custom parameters -->
<script>
    const slider = new RadialSlider({
        containerId: 'radial-slider', // ID of the HTML container
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
