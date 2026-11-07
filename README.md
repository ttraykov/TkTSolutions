# TkT Solutions — Website

A premium, responsive portfolio / digital-services website built with **plain HTML, CSS and JavaScript**. No npm, database, build step, or API keys are required.

## Project files

```text
TKTSolutions/
├── index.html                # Single-page website
├── styles.css                # Layout, materials, animation and mobile styling
├── script.js                 # Cube, ticker, navigation and contact dialog
├── assets/
│   ├── tkt-mark.svg          # Brand mark
│   ├── favicon.svg           # Browser favicon
│   ├── favicon.ico           # Legacy browser favicon
│   ├── apple-touch-icon.png  # Home-screen icon
│   └── social-preview.png    # Social sharing image
├── 404.html                  # Missing-page experience
├── thank-you.html            # Confirmation for a Netlify deployment
├── netlify.toml              # Optional Netlify configuration
├── robots.txt
├── .nojekyll                 # GitHub Pages: serve static files directly
└── .gitignore
```

## Preview locally

Open `index.html` in a browser or run a local server:

```bash
cd ~/PersonalCode/TKTSolutions
python3 -m http.server 8000
```

Visit `http://localhost:8000`. The contact form is **preview only** when opened locally.

## Publish a shareable preview on GitHub Pages

This is a static site, so it can be published from the `main` branch of a public GitHub repository without a build step. **The files in this folder must be at the repository root**, not nested under another `TKTSolutions` folder.

1. On [GitHub](https://github.com/new), create a **new empty public repository** called `TKTSolutions`. Do not preselect README, `.gitignore`, or license; these can be added later.
2. On your Mac, from `~/PersonalCode/TKTSolutions`, run:

```bash
cd ~/PersonalCode/TKTSolutions
git init -b main
git add .
git commit -m "Initial TkT Solutions website"
git remote add origin https://github.com/YOUR_USERNAME/TKTSolutions.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username. If the folder is already a Git repository, skip `git init`; inspect your existing `git remote -v` before adding or replacing a remote. Authentication may be requested by GitHub.

3. In the repository on GitHub, go to **Settings → Pages → Build and deployment**. Choose **Deploy from a branch**, select **main** and **/(root)**, then Save.
4. After GitHub completes deployment, use **Settings → Pages → Visit site**, or open:

`https://YOUR_USERNAME.github.io/TKTSolutions/`

Your GitHub Pages URL is determined by the actual username and repository name. The URL above is an example, not a live URL.

### Important: forms on GitHub Pages

GitHub Pages serves static files only; **it does not process Netlify Forms**. The contact panel still opens for design feedback, but submissions are safely intercepted and show a preview notice when accessed locally or via GitHub Pages. Do not use this preview URL to collect leads.

When you later host the same files on Netlify, configure Netlify Forms, redeploy after enabling form detection, send a real test inquiry, and enable submission notifications. The form contains the required Netlify attributes and the `thank-you.html` confirmation. To publish on a different provider, integrate a form endpoint before accepting messages.

## Notes before advertising publicly

- Choose your final name, domain and contact method before using the site for lead generation.
- Update page metadata and social image URLs after acquiring your final domain.
- Do not include customer information, credentials, or private business files in a public repository.
- Test layout, mobile controls, navigation and form handling after each deployment.
- Static-hosting URLs are publicly accessible; the site is intended to be shared for design feedback.

The rotating cube is HTML/CSS/JavaScript, with no third-party animation dependencies. Google Fonts are optional; system font fallbacks are defined. The visual effects respect reduced-motion settings.
