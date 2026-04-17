#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, '..');
const EMAIL_DIR = __dirname;
const TEMPLATES_DIR = path.join(EMAIL_DIR, 'templates');
const QUEUE_FILE = path.join(EMAIL_DIR, 'drip-queue.json');
const SUBSCRIBERS_FILE = path.join(SITE_DIR, 'subscribers.json');
const TRACKING_FILE = path.join(EMAIL_DIR, 'tracking.json');
const PRODUCTS_DIR = path.join(SITE_DIR, '..', 'products');
const MARKETING_CONFIG = path.join(SITE_DIR, '..', 'marketing', 'config', 'subscriber-tracking.json');

// --- Welcome sequence definition ---
// 4-email drip per the task spec
const WELCOME_SEQUENCE = [
  { step: 1, delayDays: 0, template: 'welcome', subject: 'Your free {{productTitle}} is here' },
  { step: 2, delayDays: 2, template: 'recommendation', subject: '{{name}}, check out what pairs perfectly with {{productTitle}}' },
  { step: 3, delayDays: 5, template: 'bundle-offer', subject: 'Exclusive bundle deal for you, {{name}}' },
  { step: 4, delayDays: 10, template: 'social-proof', subject: 'See what NovoClaw users are building' },
];

// --- File I/O helpers ---

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
  catch { return fallback; }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function readQueue() { return readJson(QUEUE_FILE, []); }
function writeQueue(q) { writeJson(QUEUE_FILE, q); }
function readSubscribers() { return readJson(SUBSCRIBERS_FILE, []); }
function readTracking() { return readJson(TRACKING_FILE, { opens: [], clicks: [] }); }
function writeTracking(t) { writeJson(TRACKING_FILE, t); }

function loadCatalog() {
  return readJson(path.join(PRODUCTS_DIR, 'catalog.json'), []);
}

function loadMarketingConfig() {
  return readJson(MARKETING_CONFIG, null);
}

// --- Template rendering ---

function loadTemplate(name) {
  const filePath = path.join(TEMPLATES_DIR, `${name}.html`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

function renderTemplate(templateStr, tokens) {
  return templateStr.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return tokens[key] !== undefined ? tokens[key] : match;
  });
}

function wrapInLayout(bodyHtml, tokens) {
  const layout = loadTemplate('layout');
  if (!layout) return bodyHtml;
  return renderTemplate(layout, { ...tokens, content: bodyHtml });
}

// --- Category & product matching ---

function findCategoryForProduct(slug, marketingConfig) {
  if (!marketingConfig || !marketingConfig.categories) return null;
  return marketingConfig.categories.find(c => c.leadMagnet === slug) || null;
}

function guessCategoryFromProduct(slug, catalog) {
  const product = catalog.find(p => p.slug === slug);
  if (!product) return null;
  const catMap = {
    'Notion Templates': 'notion-templates',
    'AI Prompt Packs': 'prompt-packs',
    'Spreadsheet Tools': 'spreadsheets',
    'Digital Planners': 'planners',
    'Workflow Kits': 'workflow-kits',
    'Digital Products': 'design-kits',
    'Business Templates': 'workflow-kits',
    'Career Templates': 'notion-templates',
  };
  return catMap[product.category] || null;
}

function getRecommendedProduct(categoryId, marketingConfig, catalog) {
  const category = marketingConfig?.categories?.find(c => c.id === categoryId);
  if (category?.paidProduct) {
    // Find the actual product in catalog
    const slug = catalog.find(p =>
      p.title.toLowerCase().includes(category.paidProduct.name.toLowerCase().split(' ')[0]) &&
      !p.freeLeadMagnet
    );
    return {
      name: category.paidProduct.name,
      price: category.paidProduct.price,
      regularPrice: category.paidProduct.regularPrice,
      slug: slug?.slug || null,
      description: slug?.description || `The complete ${category.name.toLowerCase()} toolkit for professionals.`,
    };
  }
  // Fallback: pick a non-free product from the same category
  const catProducts = catalog.filter(p => !p.freeLeadMagnet && p.price > 0);
  if (catProducts.length === 0) return null;
  const pick = catProducts[Math.floor(Math.random() * catProducts.length)];
  return {
    name: pick.title,
    price: pick.price,
    regularPrice: Math.round(pick.price * 1.5),
    slug: pick.slug,
    description: pick.description,
  };
}

function getBestSellers(catalog, limit = 3) {
  const paid = catalog.filter(p => !p.freeLeadMagnet && p.price > 0);
  // Deterministic "best sellers" — pick top priced items across categories
  const sorted = [...paid].sort((a, b) => b.price - a.price);
  const seen = new Set();
  const result = [];
  for (const p of sorted) {
    if (!seen.has(p.category) && result.length < limit) {
      result.push(p);
      seen.add(p.category);
    }
  }
  return result;
}

// --- Enroll a subscriber into the drip ---

function enrollSubscriber(email, name, productSlug, source) {
  const queue = readQueue();
  const existing = queue.find(q => q.email === email);
  if (existing) return { enrolled: false, reason: 'already_enrolled' };

  queue.push({
    email,
    name: name || '',
    productSlug,
    source: source || 'free-download',
    enrolledAt: new Date().toISOString(),
    sent: [],
    unsubscribed: false,
  });
  writeQueue(queue);
  return { enrolled: true };
}

// --- Unsubscribe ---

function unsubscribeEmail(email) {
  const queue = readQueue();
  const entry = queue.find(q => q.email === email);
  if (entry) {
    entry.unsubscribed = true;
    writeQueue(queue);
    return true;
  }
  return false;
}

// --- Process the queue: determine which emails are ready ---

function getReadyEmails(now) {
  now = now || new Date();
  const queue = readQueue();
  const ready = [];

  for (const entry of queue) {
    if (entry.unsubscribed) continue;

    const enrolledAt = new Date(entry.enrolledAt);
    const sentSteps = entry.sent.map(s => s.step);

    for (const seqItem of WELCOME_SEQUENCE) {
      if (sentSteps.includes(seqItem.step)) continue;

      const sendAt = new Date(enrolledAt.getTime() + seqItem.delayDays * 24 * 60 * 60 * 1000);
      if (now >= sendAt) {
        ready.push({
          email: entry.email,
          name: entry.name,
          productSlug: entry.productSlug,
          step: seqItem.step,
          template: seqItem.template,
          subjectTemplate: seqItem.subject,
          scheduledFor: sendAt.toISOString(),
        });
        break; // Only send one email at a time per subscriber (process in order)
      }
    }
  }

  return ready;
}

// --- Build the full email HTML for a ready item ---

function buildEmail(readyItem, baseUrl) {
  baseUrl = baseUrl || 'http://localhost:3000';
  const catalog = loadCatalog();
  const marketingConfig = loadMarketingConfig();
  const product = catalog.find(p => p.slug === readyItem.productSlug);

  // Determine category
  let categoryConfig = findCategoryForProduct(readyItem.productSlug, marketingConfig);
  let categoryId = categoryConfig?.id || guessCategoryFromProduct(readyItem.productSlug, catalog);
  if (!categoryConfig && categoryId) {
    categoryConfig = marketingConfig?.categories?.find(c => c.id === categoryId);
  }

  const recommended = getRecommendedProduct(categoryId, marketingConfig, catalog);
  const bestSellers = getBestSellers(catalog);
  const trackingId = `${readyItem.email}-${readyItem.step}-${Date.now()}`;

  // Category benefit text
  const categoryBenefits = {
    'notion-templates': 'organizing your business and boosting productivity',
    'planners': 'planning your days and building better habits',
    'prompt-packs': 'creating content faster with AI',
    'spreadsheets': 'tracking your finances and personal goals',
    'design-kits': 'creating professional social media content',
    'workflow-kits': 'launching and scaling digital products',
  };

  const tokens = {
    name: readyItem.name || 'there',
    email: readyItem.email,
    productTitle: product?.title || 'your download',
    productSlug: readyItem.productSlug,
    downloadUrl: `${baseUrl}/api/free-download/${encodeURIComponent(readyItem.productSlug)}/file`,
    categoryName: categoryConfig?.name || product?.category || 'Digital Tools',
    categoryBenefit: categoryBenefits[categoryId] || 'getting more done',

    // Recommendation tokens
    recommendedProductName: recommended?.name || 'Premium Toolkit',
    recommendedProductDescription: recommended?.description || 'Take your workflow to the next level.',
    recommendedPrice: recommended?.price || '29',
    regularPrice: recommended?.regularPrice || '49',
    recommendedProductUrl: recommended?.slug
      ? `${baseUrl}/products/${encodeURIComponent(recommended.slug)}.html?utm_source=drip&utm_medium=email&utm_campaign=welcome-${readyItem.step}`
      : `${baseUrl}?utm_source=drip&utm_medium=email&utm_campaign=welcome-${readyItem.step}`,

    // Bundle tokens
    bundleName: `${categoryConfig?.name || 'Digital Tools'} Complete Bundle`,
    bundleDescription: `Everything you need for ${categoryBenefits[categoryId] || 'professional productivity'} — bundled at a special subscriber-only price.`,
    bundlePrice: recommended ? Math.round(recommended.price * 0.75) : '22',
    bundleRegularPrice: recommended?.regularPrice || '49',
    discountPercent: '25',
    discountCode: `WELCOME25`,
    bundleUrl: `${baseUrl}?utm_source=drip&utm_medium=email&utm_campaign=bundle-offer&discount=WELCOME25`,

    // Social proof tokens
    testimonial1: 'Set it up in 10 minutes and it immediately made my workflow clearer. Worth every penny.',
    testimonial1Author: 'Sarah K., Freelance Designer',
    testimonial2: 'I was using 5 different tools before. Now everything is in one place.',
    testimonial2Author: 'Marcus T., Web Developer',
    bestSellersList: bestSellers.map(p =>
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0;">
<tr>
<td style="padding:12px 16px;background-color:#f8f9fa;border-radius:6px;">
<a href="${baseUrl}/products/${encodeURIComponent(p.slug)}.html?utm_source=drip&utm_medium=email&utm_campaign=bestsellers" style="color:#6366f1;text-decoration:none;font-weight:600;">${p.title}</a>
<span style="float:right;color:#1a1a2e;font-weight:700;">$${p.price}</span>
</td>
</tr>
</table>`
    ).join('\n'),
    shopUrl: `${baseUrl}?utm_source=drip&utm_medium=email&utm_campaign=browse`,

    // Tracking & unsubscribe
    unsubscribeUrl: `${baseUrl}/api/email/unsubscribe?email=${encodeURIComponent(readyItem.email)}&token=${Buffer.from(readyItem.email).toString('base64url')}`,
    preferencesUrl: `${baseUrl}?utm_source=drip&utm_medium=email&utm_campaign=preferences`,
    trackingPixel: `<img src="${baseUrl}/api/email/open?id=${encodeURIComponent(trackingId)}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;" />`,
    subject: '', // filled below
  };

  // Render subject
  const subject = renderTemplate(readyItem.subjectTemplate, tokens);
  tokens.subject = subject;

  // Render body template
  const bodyTemplate = loadTemplate(readyItem.template);
  if (!bodyTemplate) return null;

  const bodyHtml = renderTemplate(bodyTemplate, tokens);
  const fullHtml = wrapInLayout(bodyHtml, tokens);

  return {
    to: readyItem.email,
    subject,
    html: fullHtml,
    step: readyItem.step,
    trackingId,
  };
}

// --- Mark an email as sent ---

function markSent(email, step, messageId) {
  const queue = readQueue();
  const entry = queue.find(q => q.email === email);
  if (!entry) return false;

  entry.sent.push({
    step,
    sentAt: new Date().toISOString(),
    messageId: messageId || null,
  });
  writeQueue(queue);
  return true;
}

// --- SMTP sending (nodemailer) ---

async function sendViaSMTP(emailData, smtpConfig) {
  let nodemailer;
  try { nodemailer = require('nodemailer'); }
  catch { throw new Error('nodemailer not installed. Run: npm install nodemailer'); }

  const transporter = nodemailer.createTransport(smtpConfig);
  const info = await transporter.sendMail({
    from: smtpConfig.from || 'NovoClaw <hello@novoclaw.com>',
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.html,
  });
  return info.messageId;
}

function getSMTPConfig() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || 'NovoClaw <hello@novoclaw.com>';

  if (!host || !user || !pass) return null;

  return { host, port, secure: port === 465, auth: { user, pass }, from };
}

// --- Conversion tracking ---

function trackOpen(trackingId) {
  const tracking = readTracking();
  tracking.opens.push({ id: trackingId, at: new Date().toISOString() });
  writeTracking(tracking);
}

function trackClick(trackingId, url) {
  const tracking = readTracking();
  tracking.clicks.push({ id: trackingId, url, at: new Date().toISOString() });
  writeTracking(tracking);
}

function getTrackingStats() {
  const tracking = readTracking();
  const queue = readQueue();

  const totalEnrolled = queue.length;
  const totalUnsubscribed = queue.filter(q => q.unsubscribed).length;
  const totalSent = queue.reduce((acc, q) => acc + q.sent.length, 0);
  const totalOpens = tracking.opens.length;
  const totalClicks = tracking.clicks.length;

  // Per-step stats
  const stepStats = {};
  for (const seq of WELCOME_SEQUENCE) {
    const sentCount = queue.reduce((acc, q) => acc + (q.sent.some(s => s.step === seq.step) ? 1 : 0), 0);
    const opens = tracking.opens.filter(o => o.id.includes(`-${seq.step}-`)).length;
    const clicks = tracking.clicks.filter(c => c.id.includes(`-${seq.step}-`)).length;
    stepStats[seq.step] = { template: seq.template, sent: sentCount, opens, clicks };
  }

  return { totalEnrolled, totalUnsubscribed, totalSent, totalOpens, totalClicks, stepStats };
}

// --- Exports ---

module.exports = {
  WELCOME_SEQUENCE,
  enrollSubscriber,
  unsubscribeEmail,
  getReadyEmails,
  buildEmail,
  markSent,
  sendViaSMTP,
  getSMTPConfig,
  trackOpen,
  trackClick,
  getTrackingStats,
  readQueue,
  writeQueue,
  loadCatalog,
  loadMarketingConfig,
};
