(function() {
  var searchInput = document.getElementById('search-input');
  var grid = document.getElementById('product-grid');
  var noResults = document.getElementById('no-results');
  var filterBtns = document.querySelectorAll('.filter-btn');
  var cards = grid ? Array.from(grid.querySelectorAll('.product-card')) : [];
  var activeCategory = 'all';

  // --- Search and filter ---
  function filterAndSearch() {
    var query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    var visible = 0;
    cards.forEach(function(card) {
      var cat = card.getAttribute('data-category') || '';
      var title = (card.querySelector('.product-title') || {}).textContent || '';
      var desc = (card.querySelector('.product-desc') || {}).textContent || '';
      var text = (title + ' ' + desc + ' ' + cat).toLowerCase();
      var matchCat = activeCategory === 'all' || cat === activeCategory;
      var matchSearch = !query || query.split(/\s+/).every(function(w) { return text.indexOf(w) !== -1; });
      if (matchCat && matchSearch) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });
    if (noResults) noResults.style.display = visible === 0 ? '' : 'none';
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterAndSearch);
  }

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      filterAndSearch();
    });
  });

  // --- Config ---
  var apiUrl = (window.NOVOCLAW_CONFIG && window.NOVOCLAW_CONFIG.apiUrl) || '';
  var useApi = !!apiUrl;
  var formspreeFormId = (window.NOVOCLAW_CONFIG && window.NOVOCLAW_CONFIG.formspreeFormId) || '';
  var formspreeUrl = formspreeFormId ? 'https://formspree.io/f/' + formspreeFormId : '';
  var formsubmitEmail = (window.NOVOCLAW_CONFIG && window.NOVOCLAW_CONFIG.formsubmitEmail) || '';
  var formsubmitUrl = formsubmitEmail ? 'https://formsubmit.co/ajax/' + formsubmitEmail : '';
  // Netlify Forms fallback: when no external backend is configured, use Netlify Forms
  var useNetlifyForms = !useApi && !formspreeUrl && !formsubmitUrl;
  // Detect site root from stylesheet link for relative path construction
  var styleLink = document.querySelector('link[rel="stylesheet"][href*="styles.css"]');
  var siteRoot = styleLink ? styleLink.getAttribute('href').replace(/styles\.css$/, '') : './';

  function netlifyEncode(data) {
    return Object.keys(data).map(function(key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }).join('&');
  }

  // --- Waitlist signup ---
  function handleWaitlistSubmit(form) {
    var emailInput = form.querySelector('input[name="email"]');
    var msgEl = form.nextElementSibling;
    var btn = form.querySelector('button');
    var email = emailInput.value.trim();
    if (!email) return;

    var source = form.getAttribute('data-source') || 'unknown';
    var productSlug = form.getAttribute('data-product-slug') || null;

    btn.disabled = true;
    btn.textContent = 'Joining...';
    if (msgEl) { msgEl.textContent = ''; msgEl.className = 'waitlist-msg'; }

    var request;
    var body = { email: email, source: source };
    if (productSlug) body.productSlug = productSlug;
    if (useApi) {
      request = fetch(apiUrl + '/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } else if (formspreeUrl) {
      body._formType = 'waitlist';
      request = fetch(formspreeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      });
    } else if (formsubmitUrl) {
      body._formType = 'waitlist';
      body._subject = 'New waitlist signup: ' + email;
      request = fetch(formsubmitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      });
    } else if (useNetlifyForms) {
      var formName = form.getAttribute('name') || 'waitlist';
      request = fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: netlifyEncode({ 'form-name': formName, email: email, source: source })
      });
    } else {
      btn.disabled = false;
      btn.textContent = form.getAttribute('data-source') === 'product-page' ? 'Notify Me' : 'Join Waitlist';
      return;
    }

    request.then(function(r) {
      if (!r.ok) throw new Error('Failed');
      if (msgEl) {
        msgEl.textContent = "You're on the list! We'll notify you when we launch.";
        msgEl.className = 'waitlist-msg success';
      }
      emailInput.value = '';
    }).catch(function() {
      if (msgEl) {
        msgEl.textContent = 'Something went wrong. Please try again.';
        msgEl.className = 'waitlist-msg error';
      }
    }).finally(function() {
      btn.disabled = false;
      btn.textContent = form.getAttribute('data-source') === 'product-page' ? 'Notify Me' : 'Join Waitlist';
    });
  }

  document.querySelectorAll('.waitlist-form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      handleWaitlistSubmit(form);
    });
  });

  // --- Stripe checkout ---
  var stripeEnabled = (window.NOVOCLAW_CONFIG && window.NOVOCLAW_CONFIG.stripeEnabled);

  if (stripeEnabled) {
    document.querySelectorAll('.stripe-buy-btn').forEach(function(btn) {
      btn.style.display = '';
    });
    document.querySelectorAll('.fallback-buy-btn').forEach(function(link) {
      link.style.display = 'none';
    });

    document.querySelectorAll('.stripe-buy-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var slug = btn.getAttribute('data-slug');
        if (!slug) return;
        btn.disabled = true;
        btn.textContent = 'Redirecting...';

        var url = apiUrl ? apiUrl + '/api/create-checkout-session' : '/api/create-checkout-session';
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: slug })
        }).then(function(r) { return r.json(); }).then(function(data) {
          if (data.url) {
            window.location.href = data.url;
          } else {
            alert(data.error || 'Failed to start checkout');
            btn.disabled = false;
            btn.textContent = 'Buy Now';
          }
        }).catch(function() {
          alert('Something went wrong. Please try again.');
          btn.disabled = false;
          btn.textContent = 'Buy Now';
        });
      });
    });
  } else {
    // Check if a storefront is configured — if so, keep the buy links active
    var storefront = (window.NOVOCLAW_CONFIG && window.NOVOCLAW_CONFIG.storefront) || '';
    if (storefront) {
      // Storefront links are baked into href by build — keep them as-is
      document.querySelectorAll('.fallback-buy-btn').forEach(function(link) {
        link.textContent = 'Buy Now';
      });
    } else {
      // No storefront configured: show "Coming Soon" and point to waitlist
      document.querySelectorAll('.fallback-buy-btn').forEach(function(link) {
        link.textContent = 'Coming Soon';
        link.href = '#';
        link.style.opacity = '0.7';
        link.addEventListener('click', function(e) {
          e.preventDefault();
          var emailField = document.querySelector('.waitlist-form input[name="email"]');
          if (emailField) {
            emailField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(function() { emailField.focus(); }, 400);
          }
        });
      });
    }
  }

  // --- Free download modal ---
  var modal = document.getElementById('free-download-modal');
  var modalClose = document.getElementById('modal-close');
  var freeForm = document.getElementById('free-download-form');

  document.querySelectorAll('.free-download-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (modal) modal.style.display = 'flex';
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }

  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  if (freeForm) {
    freeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var slug = freeForm.getAttribute('data-slug');
      var nameInput = freeForm.querySelector('input[name="name"]');
      var emailInput = freeForm.querySelector('input[name="email"]');
      var submitBtn = freeForm.querySelector('button[type="submit"]');
      var msgEl = document.getElementById('modal-msg');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';
      if (msgEl) { msgEl.textContent = ''; msgEl.className = 'modal-msg'; }

      var request;
      var downloadSlug = slug;
      if (useApi) {
        request = fetch(apiUrl + '/api/free-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: nameInput.value.trim(), email: emailInput.value.trim(), slug: slug })
        });
      } else if (formspreeUrl) {
        request = fetch(formspreeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name: nameInput.value.trim(), email: emailInput.value.trim(), slug: slug, _formType: 'free-download' })
        });
      } else if (formsubmitUrl) {
        request = fetch(formsubmitUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name: nameInput.value.trim(), email: emailInput.value.trim(), slug: slug, _formType: 'free-download', _subject: 'Free download request: ' + slug })
        });
      } else if (useNetlifyForms) {
        request = fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: netlifyEncode({ 'form-name': 'free-download', name: nameInput.value.trim(), email: emailInput.value.trim(), slug: slug })
        });
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Download Now';
        return;
      }

      request.then(function(r) {
        if (useApi) {
          return r.json().then(function(data) {
            if (data.downloadUrl) return data.downloadUrl;
            throw new Error(data.error || 'Failed');
          });
        }
        if (!r.ok) throw new Error('Failed');
        return siteRoot + 'downloads/' + encodeURIComponent(downloadSlug) + '.md';
      }).then(function(downloadUrl) {
        freeForm.innerHTML = '<div class="download-success">' +
          '<p class="download-ready">Your download is ready!</p>' +
          '<a href="' + downloadUrl + '" class="buy-btn" download>Download Now</a>' +
          '<div class="upsell-banner">' +
          '<p>Love this? Check out our full collection of 140+ templates</p>' +
          '<a href="/" class="upsell-link">Browse Catalog &rarr;</a>' +
          '</div></div>';
        window.location.href = downloadUrl;
      }).catch(function() {
        if (msgEl) {
          msgEl.textContent = 'Something went wrong. Please try again.';
          msgEl.className = 'modal-msg error';
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Download Now';
      });
    });
  }

  // --- Copy link share button ---
  document.querySelectorAll('.share-copy').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var url = btn.getAttribute('data-url');
      if (url && navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function() {
          btn.textContent = 'Copied!';
          setTimeout(function() { btn.textContent = 'Link'; }, 2000);
        });
      }
    });
  });

  // --- Newsletter form handling ---
  function handleNewsletterSubmit(form) {
    var emailInput = form.querySelector('input[name="email"]');
    var nameInput = form.querySelector('input[name="first-name"]');
    var btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
    var msgEl = form.closest('.newsletter-box')
      ? document.getElementById('newsletter-msg')
      : document.getElementById('exit-intent-msg');
    var email = emailInput ? emailInput.value.trim() : '';
    if (!email) return;

    var source = form.getAttribute('data-source') || 'newsletter';
    var interests = [];
    form.querySelectorAll('input[name="interests"]:checked').forEach(function(cb) {
      interests.push(cb.value);
    });

    var originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Joining...';
    if (msgEl) { msgEl.textContent = ''; msgEl.className = 'waitlist-msg'; }

    var request;
    var body = { email: email, source: source, interests: interests.join(', ') };
    if (nameInput && nameInput.value.trim()) body.name = nameInput.value.trim();
    if (useApi) {
      body.interests = interests;
      request = fetch(apiUrl + '/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } else if (formspreeUrl) {
      body._formType = 'newsletter';
      request = fetch(formspreeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      });
    } else if (formsubmitUrl) {
      body._formType = 'newsletter';
      body._subject = 'New newsletter signup: ' + email;
      request = fetch(formsubmitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      });
    } else if (useNetlifyForms) {
      var formName = form.getAttribute('name') || 'newsletter';
      var nlData = { 'form-name': formName, email: email, source: source, interests: interests.join(', ') };
      if (body.name) nlData['first-name'] = body.name;
      request = fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: netlifyEncode(nlData)
      });
    } else {
      btn.disabled = false;
      btn.textContent = originalText;
      return;
    }

    request.then(function(r) {
      if (!r.ok) throw new Error('Failed');
      if (msgEl) {
        msgEl.textContent = "You're on the early access list! We'll notify you when we launch.";
        msgEl.className = 'waitlist-msg success';
      }
      emailInput.value = '';
      if (nameInput) nameInput.value = '';
      form.querySelectorAll('input[name="interests"]:checked').forEach(function(cb) { cb.checked = false; });
      // Close exit intent if open
      var exitModal = document.getElementById('exit-intent-modal');
      if (exitModal && exitModal.style.display !== 'none') {
        setTimeout(function() { exitModal.style.display = 'none'; }, 2000);
      }
      try { sessionStorage.setItem('ggai_subscribed', '1'); } catch(e) {}
    }).catch(function() {
      if (msgEl) {
        msgEl.textContent = 'Something went wrong. Please try again.';
        msgEl.className = 'waitlist-msg error';
      }
    }).finally(function() {
      btn.disabled = false;
      btn.textContent = originalText;
    });
  }

  document.querySelectorAll('.newsletter-form, .exit-intent-form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      handleNewsletterSubmit(form);
    });
  });

  // Also handle hero waitlist (now newsletter form name)
  var heroForm = document.getElementById('hero-waitlist');
  if (heroForm && heroForm.getAttribute('name') === 'newsletter') {
    heroForm.removeEventListener('submit', heroForm._waitlistHandler);
    heroForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleNewsletterSubmit(heroForm);
    });
  }

  // --- Exit intent popup ---
  var exitModal = document.getElementById('exit-intent-modal');
  var exitClose = document.getElementById('exit-intent-close');

  if (exitModal) {
    var exitShown = false;
    var pageLoadTime = Date.now();

    function showExitIntent() {
      if (exitShown) return;
      // Don't show if already subscribed
      try { if (sessionStorage.getItem('ggai_subscribed')) return; } catch(e) {}
      // Don't show if dismissed this session
      try { if (sessionStorage.getItem('ggai_exit_dismissed')) return; } catch(e) {}
      // Don't show within first 5 seconds
      if (Date.now() - pageLoadTime < 5000) return;
      exitShown = true;
      exitModal.style.display = 'flex';
    }

    // Desktop: mouse leaves viewport
    document.addEventListener('mouseout', function(e) {
      if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth) {
        showExitIntent();
      }
    });

    // Mobile: detect back/scroll-up pattern after scrolling down
    var lastScrollY = 0;
    var scrolledDown = false;
    window.addEventListener('scroll', function() {
      var currentY = window.scrollY;
      if (currentY > 300) scrolledDown = true;
      if (scrolledDown && currentY < lastScrollY - 100 && currentY < 200) {
        showExitIntent();
      }
      lastScrollY = currentY;
    }, { passive: true });

    if (exitClose) {
      exitClose.addEventListener('click', function() {
        exitModal.style.display = 'none';
        try { sessionStorage.setItem('ggai_exit_dismissed', '1'); } catch(e) {}
      });
    }

    exitModal.addEventListener('click', function(e) {
      if (e.target === exitModal) {
        exitModal.style.display = 'none';
        try { sessionStorage.setItem('ggai_exit_dismissed', '1'); } catch(e) {}
      }
    });
  }
})();
