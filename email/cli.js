#!/usr/bin/env node
'use strict';

const drip = require('./drip');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const args = process.argv.slice(2);
const command = args[0];

function usage() {
  console.log(`
NovoClaw Email Drip CLI

Usage:
  node email/cli.js <command> [options]

Commands:
  process          Process the queue, send ready emails (or output them)
  enroll           Enroll a subscriber: --email <email> --slug <slug> [--name <name>]
  unsubscribe      Unsubscribe: --email <email>
  status           Show queue status and stats
  preview          Preview an email: --step <1-4> --email <email> --slug <slug> [--name <name>]
  queue            Show raw queue contents

Environment:
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS  - SMTP credentials for live sending
  SMTP_FROM                                    - From address (default: NovoClaw <hello@novoclaw.com>)
  BASE_URL                                     - Site base URL (default: http://localhost:3000)
  DRY_RUN=1                                    - Output emails without sending
`);
}

function getArg(flag) {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}

async function processQueue() {
  const ready = drip.getReadyEmails();
  if (ready.length === 0) {
    console.log('No emails ready to send.');
    return;
  }

  console.log(`${ready.length} email(s) ready to send.\n`);

  const smtpConfig = drip.getSMTPConfig();
  const dryRun = process.env.DRY_RUN === '1' || !smtpConfig;

  if (dryRun && !smtpConfig) {
    console.log('No SMTP credentials configured. Running in dry-run mode.\n');
  }
  if (dryRun && smtpConfig) {
    console.log('DRY_RUN=1 set. Outputting emails without sending.\n');
  }

  for (const item of ready) {
    const email = drip.buildEmail(item, BASE_URL);
    if (!email) {
      console.log(`  SKIP: Template "${item.template}" not found for ${item.email}`);
      continue;
    }

    if (dryRun) {
      console.log(`--- Email ${item.step} ---`);
      console.log(`  To:      ${email.to}`);
      console.log(`  Subject: ${email.subject}`);
      console.log(`  Step:    ${item.step} (${item.template})`);
      console.log(`  Scheduled: ${item.scheduledFor}`);
      console.log(`  HTML length: ${email.html.length} chars`);
      console.log('');

      // Mark as sent in dry run too so queue advances
      drip.markSent(item.email, item.step, `dryrun-${Date.now()}`);
    } else {
      try {
        const messageId = await drip.sendViaSMTP(email, smtpConfig);
        drip.markSent(item.email, item.step, messageId);
        console.log(`  SENT: Step ${item.step} to ${item.email} (${messageId})`);
      } catch (err) {
        console.error(`  FAIL: Step ${item.step} to ${item.email}: ${err.message}`);
      }
    }
  }

  console.log('\nDone.');
}

function enrollCommand() {
  const email = getArg('--email');
  const slug = getArg('--slug');
  const name = getArg('--name') || '';

  if (!email || !slug) {
    console.error('Required: --email <email> --slug <product-slug>');
    process.exit(1);
  }

  const result = drip.enrollSubscriber(email, name, slug, 'cli');
  if (result.enrolled) {
    console.log(`Enrolled ${email} for drip sequence (product: ${slug})`);
  } else {
    console.log(`Not enrolled: ${result.reason}`);
  }
}

function unsubscribeCommand() {
  const email = getArg('--email');
  if (!email) {
    console.error('Required: --email <email>');
    process.exit(1);
  }

  const ok = drip.unsubscribeEmail(email);
  console.log(ok ? `Unsubscribed ${email}` : `${email} not found in queue`);
}

function statusCommand() {
  const stats = drip.getTrackingStats();

  console.log('Email Drip Status');
  console.log('=================');
  console.log(`Enrolled:      ${stats.totalEnrolled}`);
  console.log(`Unsubscribed:  ${stats.totalUnsubscribed}`);
  console.log(`Emails sent:   ${stats.totalSent}`);
  console.log(`Opens tracked: ${stats.totalOpens}`);
  console.log(`Clicks tracked: ${stats.totalClicks}`);
  console.log('');
  console.log('Per-step breakdown:');
  for (const [step, data] of Object.entries(stats.stepStats)) {
    console.log(`  Step ${step} (${data.template}): ${data.sent} sent, ${data.opens} opens, ${data.clicks} clicks`);
  }

  // Show pending
  const ready = drip.getReadyEmails();
  console.log(`\nReady to send now: ${ready.length}`);
}

function previewCommand() {
  const step = parseInt(getArg('--step') || '1', 10);
  const email = getArg('--email') || 'preview@example.com';
  const slug = getArg('--slug') || '04-adhd-planner';
  const name = getArg('--name') || 'Preview User';

  const seq = drip.WELCOME_SEQUENCE.find(s => s.step === step);
  if (!seq) {
    console.error(`Invalid step ${step}. Valid: 1-4`);
    process.exit(1);
  }

  const readyItem = {
    email,
    name,
    productSlug: slug,
    step: seq.step,
    template: seq.template,
    subjectTemplate: seq.subject,
    scheduledFor: new Date().toISOString(),
  };

  const result = drip.buildEmail(readyItem, BASE_URL);
  if (!result) {
    console.error(`Template "${seq.template}" not found`);
    process.exit(1);
  }

  console.log(`Subject: ${result.subject}\n`);
  console.log(result.html);
}

function queueCommand() {
  const queue = drip.readQueue();
  if (queue.length === 0) {
    console.log('Queue is empty.');
    return;
  }

  for (const entry of queue) {
    const sentSteps = entry.sent.map(s => s.step).join(',') || 'none';
    const status = entry.unsubscribed ? 'UNSUBSCRIBED' : 'active';
    console.log(`${entry.email} | product: ${entry.productSlug} | sent: [${sentSteps}] | ${status} | enrolled: ${entry.enrolledAt}`);
  }
}

// --- Main ---

(async () => {
  switch (command) {
    case 'process':
      await processQueue();
      break;
    case 'enroll':
      enrollCommand();
      break;
    case 'unsubscribe':
      unsubscribeCommand();
      break;
    case 'status':
      statusCommand();
      break;
    case 'preview':
      previewCommand();
      break;
    case 'queue':
      queueCommand();
      break;
    default:
      usage();
      break;
  }
})().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
