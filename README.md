# NovoClaw — Digital Product Catalog

Static site with 140+ digital products. Deploys to any static host.

## One-Click Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

## Manual Deploy

1. **Build the site:**
   ```bash
   node build.js
   ```

2. **Deploy the `site/` directory** to any static host:
   - **Netlify**: Drag and drop the `site/` folder at [app.netlify.com/drop](https://app.netlify.com/drop)
   - **Vercel**: `npx vercel site/`
   - **GitHub Pages**: Push `site/` contents to a `gh-pages` branch

## Local Development

Run the optional Node.js dev server (not needed for production):

```bash
cd site
npm install
npm start
```

The dev server provides API endpoints for email capture and Stripe checkout. In static mode, email capture uses Netlify Forms and Stripe shows "Coming Soon" until configured.

## Configuration

Edit `site/config.js` to configure:

```javascript
window.NOVOCLAW_CONFIG = {
  stripeEnabled: false,  // Set true when Stripe keys are configured
  apiUrl: ""             // Set to server URL for dev server mode
};
```

### Stripe Setup (Optional)

To enable purchases, set environment variables before building:

```bash
STRIPE_ENABLED=true node build.js
```

Then configure Stripe keys in your hosting environment.

## What's Included

- `index.html` — Product catalog with search and filters
- `free.html` — Free downloads landing page
- `products/` — 140 individual product pages
- `downloads/` — Free product template files
- `success.html` — Order confirmation page
- `sitemap.xml` — SEO sitemap
- `robots.txt` — Search engine directives
