#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const SITE_DIR = __dirname;
const PRODUCTS_DIR = path.join(SITE_DIR, '..', 'products');
const SUBSCRIBERS_FILE = path.join(SITE_DIR, 'subscribers.json');
const SALES_LOG_FILE = path.join(SITE_DIR, 'sales.json');

// Email drip system
const drip = require('./email/drip');

// Stripe setup — works in test mode out of the box when keys are set
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
let stripe = null;
if (STRIPE_SECRET_KEY) {
  stripe = require('stripe')(STRIPE_SECRET_KEY);
}

// MIME types for static file serving
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

// --- Product catalog ---

let catalogCache = null;

function loadCatalog() {
  if (catalogCache) return catalogCache;
  const catalogPath = path.join(PRODUCTS_DIR, 'catalog.json');
  if (!fs.existsSync(catalogPath)) return [];
  try {
    catalogCache = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    return catalogCache;
  } catch {
    return [];
  }
}

function findProduct(slug) {
  const catalog = loadCatalog();
  return catalog.find(p => p.slug === slug) || null;
}

// --- Subscribers ---

function readSubscribers() {
  if (!fs.existsSync(SUBSCRIBERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeSubscribers(subs) {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subs, null, 2));
}

// --- Sales log ---

function readSales() {
  if (!fs.existsSync(SALES_LOG_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(SALES_LOG_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeSales(sales) {
  fs.writeFileSync(SALES_LOG_FILE, JSON.stringify(sales, null, 2));
}

function logSale(sessionData) {
  const sales = readSales();
  sales.push({
    sessionId: sessionData.id,
    customerEmail: sessionData.customer_details?.email || null,
    productSlug: sessionData.metadata?.product_slug || null,
    productName: sessionData.metadata?.product_name || null,
    amountTotal: sessionData.amount_total,
    currency: sessionData.currency,
    paymentStatus: sessionData.payment_status,
    completedAt: new Date().toISOString(),
  });
  writeSales(sales);
}

// --- Helpers ---

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 1e5) { reject(new Error('Body too large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

function parseRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 1e6) { reject(new Error('Body too large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function json(res, status, data) {
  cors(res);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function serveStatic(req, res) {
  const urlPath = req.url.split('?')[0]; // strip query params
  let filePath = path.join(SITE_DIR, urlPath === '/' ? 'index.html' : urlPath);
  // Prevent directory traversal
  if (!filePath.startsWith(SITE_DIR)) { res.writeHead(403); res.end(); return; }
  if (!fs.existsSync(filePath)) { res.writeHead(404); res.end('Not found'); return; }
  if (fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html');
  if (!fs.existsSync(filePath)) { res.writeHead(404); res.end('Not found'); return; }

  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
}

// --- Request handler ---

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split('?')[0];

  // CORS preflight
  if (req.method === 'OPTIONS' && urlPath.startsWith('/api/')) {
    cors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  // --- Subscribe endpoint ---
  if (urlPath === '/api/subscribe' && req.method === 'POST') {
    let body;
    try { body = await parseJsonBody(req); } catch {
      return json(res, 400, { error: 'Invalid request body' });
    }

    const email = (body.email || '').trim().toLowerCase();
    if (!isValidEmail(email)) {
      return json(res, 400, { error: 'Invalid email address' });
    }

    const source = typeof body.source === 'string' ? body.source.substring(0, 200) : 'unknown';
    const productSlug = typeof body.productSlug === 'string' ? body.productSlug.substring(0, 200) : null;

    const subs = readSubscribers();
    const existing = subs.find(s => s.email === email);
    if (existing) {
      if (productSlug && !existing.interests.includes(productSlug)) {
        existing.interests.push(productSlug);
        existing.updatedAt = new Date().toISOString();
        writeSubscribers(subs);
      }
      return json(res, 200, { message: 'You\'re already on the list!' });
    }

    subs.push({
      email,
      source,
      interests: productSlug ? [productSlug] : [],
      subscribedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    writeSubscribers(subs);
    return json(res, 201, { message: 'You\'re on the list! We\'ll notify you when we launch.' });
  }

  // --- Create Stripe Checkout Session ---
  if (urlPath === '/api/create-checkout-session' && req.method === 'POST') {
    if (!stripe) {
      return json(res, 503, { error: 'Stripe is not configured. Set STRIPE_SECRET_KEY to enable purchases.' });
    }

    let body;
    try { body = await parseJsonBody(req); } catch {
      return json(res, 400, { error: 'Invalid request body' });
    }

    const slug = typeof body.slug === 'string' ? body.slug.substring(0, 200) : '';
    if (!slug) {
      return json(res, 400, { error: 'Product slug is required' });
    }

    const product = findProduct(slug);
    if (!product) {
      return json(res, 404, { error: 'Product not found' });
    }

    const priceInCents = Math.round(product.price * 100);
    if (priceInCents <= 0) {
      return json(res, 400, { error: 'Invalid product price' });
    }

    const origin = req.headers.origin || req.headers.referer?.replace(/\/[^/]*$/, '') || `http://localhost:${PORT}`;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              metadata: { slug: product.slug },
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/products/${encodeURIComponent(slug)}.html`,
        metadata: {
          product_slug: product.slug,
          product_name: product.title,
        },
      });

      return json(res, 200, { url: session.url });
    } catch (err) {
      console.error('Stripe session creation error:', err.message);
      return json(res, 500, { error: 'Failed to create checkout session' });
    }
  }

  // --- Get checkout session details (for success page) ---
  if (urlPath === '/api/checkout-session' && req.method === 'GET') {
    if (!stripe) {
      return json(res, 503, { error: 'Stripe is not configured' });
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);
    const sessionId = url.searchParams.get('session_id');
    if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
      return json(res, 400, { error: 'Valid session_id is required' });
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return json(res, 200, {
        customerEmail: session.customer_details?.email || null,
        productName: session.metadata?.product_name || 'Your product',
        productSlug: session.metadata?.product_slug || null,
        amountTotal: session.amount_total,
        currency: session.currency,
        paymentStatus: session.payment_status,
      });
    } catch (err) {
      console.error('Session retrieval error:', err.message);
      return json(res, 404, { error: 'Session not found' });
    }
  }

  // --- Stripe webhook ---
  if (urlPath === '/api/webhook' && req.method === 'POST') {
    if (!stripe) {
      res.writeHead(503);
      res.end('Stripe not configured');
      return;
    }

    let rawBody;
    try { rawBody = await parseRawBody(req); } catch {
      res.writeHead(400);
      res.end('Bad request');
      return;
    }

    const sig = req.headers['stripe-signature'];
    let event;

    if (STRIPE_WEBHOOK_SECRET && sig) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        res.writeHead(400);
        res.end('Webhook signature verification failed');
        return;
      }
    } else {
      // In test mode without webhook secret, accept raw events
      try {
        event = JSON.parse(rawBody.toString());
      } catch {
        res.writeHead(400);
        res.end('Invalid JSON');
        return;
      }
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log(`Sale completed: ${session.metadata?.product_name || 'unknown'} — $${(session.amount_total / 100).toFixed(2)}`);
      logSale(session);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ received: true }));
    return;
  }

  // --- Free lead-magnet download (email-gated, POST to capture lead) ---
  if (urlPath === '/api/free-download' && req.method === 'POST') {
    let body;
    try { body = await parseJsonBody(req); } catch {
      return json(res, 400, { error: 'Invalid request body' });
    }

    const email = (body.email || '').trim().toLowerCase();
    const name = typeof body.name === 'string' ? body.name.trim().substring(0, 200) : '';
    const slug = typeof body.slug === 'string' ? body.slug.substring(0, 200) : '';

    if (!isValidEmail(email)) {
      return json(res, 400, { error: 'Invalid email address' });
    }
    if (!slug) {
      return json(res, 400, { error: 'Product slug is required' });
    }

    const product = findProduct(slug);
    if (!product || !product.freeLeadMagnet) {
      return json(res, 404, { error: 'Free product not found' });
    }

    const templatePath = path.join(PRODUCTS_DIR, slug, 'template.md');
    if (!fs.existsSync(templatePath)) {
      return json(res, 404, { error: 'Product file not found' });
    }

    // Store subscriber with source: free-download
    const subs = readSubscribers();
    const existing = subs.find(s => s.email === email);
    if (existing) {
      if (!existing.interests.includes(slug)) existing.interests.push(slug);
      if (name && !existing.name) existing.name = name;
      existing.updatedAt = new Date().toISOString();
    } else {
      subs.push({
        email,
        name: name || null,
        source: 'free-download',
        interests: [slug],
        subscribedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    writeSubscribers(subs);

    // Auto-enroll in email drip sequence
    drip.enrollSubscriber(email, name, slug, 'free-download');

    return json(res, 200, {
      message: 'Success! Your download is ready.',
      downloadUrl: `/api/free-download/${encodeURIComponent(slug)}/file`,
      productTitle: product.title,
    });
  }

  // --- Free download file serving ---
  const freeFileMatch = urlPath.match(/^\/api\/free-download\/([a-zA-Z0-9_-]+)\/file$/);
  if (freeFileMatch && req.method === 'GET') {
    const slug = freeFileMatch[1];
    const product = findProduct(slug);
    if (!product || !product.freeLeadMagnet) {
      return json(res, 404, { error: 'Free product not found' });
    }

    const templatePath = path.join(PRODUCTS_DIR, slug, 'template.md');
    if (!fs.existsSync(templatePath)) {
      return json(res, 404, { error: 'Product file not found' });
    }

    const filename = `${slug}.md`;
    res.writeHead(200, {
      'Content-Type': 'text/markdown',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    fs.createReadStream(templatePath).pipe(res);
    return;
  }

  // --- Download endpoint (post-purchase) ---
  const downloadMatch = urlPath.match(/^\/api\/download\/([a-zA-Z0-9_-]+)$/);
  if (downloadMatch && req.method === 'GET') {
    if (!stripe) {
      return json(res, 503, { error: 'Stripe is not configured' });
    }

    const slug = downloadMatch[1];
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const sessionId = url.searchParams.get('session_id');

    if (!sessionId || !sessionId.startsWith('cs_')) {
      return json(res, 400, { error: 'Valid session_id is required' });
    }

    // Verify the session is paid and matches this product
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== 'paid') {
        return json(res, 403, { error: 'Payment not completed' });
      }
      if (session.metadata?.product_slug !== slug) {
        return json(res, 403, { error: 'Session does not match this product' });
      }
    } catch (err) {
      return json(res, 404, { error: 'Invalid session' });
    }

    // Serve the product template file
    const templatePath = path.join(PRODUCTS_DIR, slug, 'template.md');
    if (!fs.existsSync(templatePath)) {
      return json(res, 404, { error: 'Product file not found' });
    }

    const filename = `${slug}.md`;
    res.writeHead(200, {
      'Content-Type': 'text/markdown',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    fs.createReadStream(templatePath).pipe(res);
    return;
  }

  // --- Email drip: unsubscribe ---
  if (urlPath === '/api/email/unsubscribe' && req.method === 'GET') {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const email = url.searchParams.get('email');
    const token = url.searchParams.get('token');

    if (email && token === Buffer.from(email).toString('base64url')) {
      drip.unsubscribeEmail(email);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<html><body style="font-family:sans-serif;text-align:center;padding:60px;"><h2>Unsubscribed</h2><p>You have been removed from our email list.</p></body></html>');
    } else {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end('<html><body style="font-family:sans-serif;text-align:center;padding:60px;"><h2>Invalid link</h2></body></html>');
    }
    return;
  }

  // --- Email drip: open tracking pixel ---
  if (urlPath === '/api/email/open' && req.method === 'GET') {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const id = url.searchParams.get('id');
    if (id) drip.trackOpen(id);
    // Return 1x1 transparent GIF
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, { 'Content-Type': 'image/gif', 'Cache-Control': 'no-store' });
    res.end(pixel);
    return;
  }

  // --- Email drip: click tracking redirect ---
  if (urlPath === '/api/email/click' && req.method === 'GET') {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const id = url.searchParams.get('id');
    const dest = url.searchParams.get('url');
    if (id) drip.trackClick(id, dest || '');
    if (dest && /^https?:\/\//.test(dest)) {
      res.writeHead(302, { Location: dest });
    } else {
      res.writeHead(302, { Location: '/' });
    }
    res.end();
    return;
  }

  // --- Static files ---
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`NovoClaw server running at http://localhost:${PORT}`);
  if (stripe) {
    console.log('Stripe: configured (checkout enabled)');
  } else {
    console.log('Stripe: not configured — set STRIPE_SECRET_KEY to enable purchases');
  }
  const queue = drip.readQueue();
  console.log(`Email drip: ${queue.length} subscriber(s) in queue`);
});
