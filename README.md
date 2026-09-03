# MARUF ALLAM MAHIM — Personal Portfolio

A production-ready static personal portfolio for **MARUF ALLAM MAHIM (MAHEEM)**.

## Stack
- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts
- GitHub Pages compatible
- No build step
- No framework dependency

## Included
- Responsive/mobile-first layout
- Dark / light mode with localStorage
- Animated hero
- Typing-style visual identity / motion
- Custom cursor on pointer devices
- Smooth scrolling
- Scroll reveal animations
- Project filtering
- Command palette (`Ctrl/Cmd + K`)
- Interactive particle background
- Easter-egg style command interactions
- Quote rotation
- Terminal-style UI
- Contact/social links
- GitHub / project placeholders ready to replace
- Accessibility-friendly labels and reduced-motion support
- SEO/meta basics
- Favicon

## Personalization

### 1. Add your profile photo
Replace:

`assets/profile-placeholder.svg`

with:

`assets/profile.jpg`

Then change the image source in `index.html` from:

```html
assets/profile-placeholder.svg
```

to:

```html
assets/profile.jpg
```

### 2. Add project repositories
Search for `disabled-link` in `index.html` and replace the `href="#"` values with real project URLs when ready.

### 3. Update quotes
Edit the `quotes` array in `js/script.js`.

### 4. Update project details
Project cards are intentionally data-light so repository/demo links can be added later without restructuring the page.

## Deploy to GitHub Pages

Repository name:

`MarufAllamMahim.github.io`

Upload the contents of this folder to the repository root.

Then in GitHub:

**Settings → Pages → Build and deployment → Deploy from a branch → main → / (root)**

Your site should be available at:

`https://MarufAllamMahim.github.io/`

If the repository already has GitHub Pages enabled, simply pushing the files to the configured branch is enough.

## Social URLs
The supplied profile URLs are included in the footer/contact section. Verify each account exists and adjust any URL if your actual profile slug differs.

## Notes
The contact section uses `mailto:` so it works without a backend. A real contact form can be connected later to a form service or serverless endpoint.
