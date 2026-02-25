/* ============================================
   UI Components — Safe DOM Rendering
   No innerHTML with dynamic data (XSS prevention)
   ============================================ */

'use strict';

var Components = (function() {

  // Helper: create element with class and optional text
  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // ---- Agent Cards ----
  function createAgentCard(agent) {
    var card = el('div', 'agent-card');
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', agent.name + ' — ' + agent.tag);
    if (agent.color) card.setAttribute('data-color', agent.color);

    card.appendChild(el('div', 'agent-name', agent.name));
    card.appendChild(el('div', 'agent-desc', agent.desc));

    var tag = el('span', 'agent-tag', agent.tag);
    var colorVar = 'var(--accent-' + (agent.color || 'cyan') + ')';
    tag.style.color = colorVar;
    tag.style.borderColor = colorVar;
    card.appendChild(tag);

    if (agent.url) {
      var link = el('a', 'agent-url', 'View Repository');
      link.href = agent.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      card.appendChild(document.createElement('br'));
      card.appendChild(link);
    }

    return card;
  }

  function renderAgents(agents, container) {
    container.textContent = '';
    var fragment = document.createDocumentFragment();
    agents.forEach(function(a) {
      fragment.appendChild(createAgentCard(a));
    });
    container.appendChild(fragment);
  }

  // ---- Tier Cards ----
  function createModelItem(model, tierClass) {
    var item = el('div', 'model-item');
    var info = document.createElement('div');
    info.appendChild(el('span', 'model-name', model.name || model.id));
    info.appendChild(document.createElement('br'));
    info.appendChild(el('span', 'model-provider', model.provider));
    item.appendChild(info);
    item.appendChild(el('span', 'model-latency', model.latency));
    return item;
  }

  function createTierCard(tierId, tierData) {
    var tierClass = tierId; // t1, t2, t3
    var card = el('div', 'tier-card ' + tierClass);

    var header = el('div', 'tier-header');
    header.appendChild(el('span', 'tier-label', tierData.label));
    header.appendChild(el('span', 'tier-badge', tierData.badge));
    card.appendChild(header);

    card.appendChild(el('p', 'tier-desc', tierData.desc));

    var list = el('div', 'model-list');
    list.setAttribute('role', 'list');
    list.setAttribute('aria-label', tierData.label + ' models');
    tierData.models.forEach(function(m) {
      var item = createModelItem(m, tierClass);
      item.setAttribute('role', 'listitem');
      list.appendChild(item);
    });
    card.appendChild(list);

    return card;
  }

  function renderTiers(tiers, container) {
    container.textContent = '';
    var fragment = document.createDocumentFragment();
    ['t1', 't2', 't3'].forEach(function(key) {
      if (tiers[key]) {
        fragment.appendChild(createTierCard(key, tiers[key]));
      }
    });
    container.appendChild(fragment);
  }

  // ---- Repository Chips ----
  function createRepoChip(repo) {
    var chip = el('div', 'repo-chip');
    chip.setAttribute('tabindex', '0');
    chip.setAttribute('role', 'listitem');

    var dot = el('span', 'repo-dot ' + repo.type);
    chip.appendChild(dot);
    chip.appendChild(document.createTextNode(repo.name));

    return chip;
  }

  function renderRepos(repos, container) {
    container.textContent = '';
    container.setAttribute('role', 'list');
    container.setAttribute('aria-label', 'Repository list');
    var fragment = document.createDocumentFragment();
    repos.forEach(function(r) {
      fragment.appendChild(createRepoChip(r));
    });
    container.appendChild(fragment);
  }

  // ---- Project Sentinel ----
  function renderSentinel(container) {
    var cards = [
      { icon: '\uD83D\uDD0D', title: 'OSINT Intelligence', desc: 'Real-time open-source intelligence gathering with automated threat feed aggregation and entity extraction.' },
      { icon: '\uD83D\uDEE1\uFE0F', title: 'Vulnerability Scanner', desc: 'Continuous security assessment integrating guardian-cli with automated CVE tracking and patch monitoring.' },
      { icon: '\uD83C\uDF10', title: 'Network Monitor', desc: 'Passive network reconnaissance and anomaly detection with worldmonitor integration for global visibility.' },
      { icon: '\uD83D\uDCCA', title: 'Threat Analytics', desc: 'Machine learning-powered threat scoring, pattern recognition, and predictive risk analysis dashboard.' },
      { icon: '\u26A0\uFE0F', title: 'Incident Response', desc: 'Automated incident triage and response workflows with GHunt, Scrapling, and firecrawl OSINT tools.' },
      { icon: '\uD83D\uDD12', title: 'Compliance Audit', desc: 'Automated compliance checking against OWASP Top 10, CIS benchmarks, and custom security policies.' }
    ];

    var grid = el('div', 'sentinel-grid');

    cards.forEach(function(c) {
      var card = el('div', 'sentinel-card');
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'article');
      card.appendChild(el('div', 'sentinel-icon', c.icon));
      card.appendChild(el('h3', null, c.title));
      card.appendChild(el('p', null, c.desc));
      grid.appendChild(card);
    });

    container.appendChild(grid);

    // Add link to Project Sentinel repo
    var link = el('a', 'sentinel-link', '\u2192 Project-Sentinel Repository');
    link.href = 'https://github.com/Swn94/Project-Sentinel';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    container.appendChild(link);
  }

  // ---- Stats Counter Animation ----
  function animateCounters() {
    var counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = el.getAttribute('data-target');
          var suffix = el.getAttribute('data-suffix') || '';
          var numTarget = parseInt(target);

          if (isNaN(numTarget)) {
            el.textContent = target;
            return;
          }

          var current = 0;
          var step = Math.max(1, Math.floor(numTarget / 40));
          var timer = setInterval(function() {
            current += step;
            if (current >= numTarget) {
              current = numTarget;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, 30);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(c) { observer.observe(c); });
  }

  // ---- Section Entrance Animation ----
  function initSectionAnimations() {
    var sections = document.querySelectorAll('.section-animate');
    if (!sections.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    sections.forEach(function(s) { observer.observe(s); });
  }

  // ---- Search/Filter ----
  function initSearch(inputId, containerId, dataKey) {
    var input = document.getElementById(inputId);
    var container = document.getElementById(containerId);
    if (!input || !container) return;

    input.addEventListener('input', function() {
      var query = input.value.toLowerCase().trim();
      var items = container.children;
      for (var i = 0; i < items.length; i++) {
        var text = items[i].textContent.toLowerCase();
        items[i].style.display = text.indexOf(query) !== -1 ? '' : 'none';
      }
    });
  }

  function initCategoryFilter(buttonsContainerId, gridId) {
    var btnsContainer = document.getElementById(buttonsContainerId);
    var grid = document.getElementById(gridId);
    if (!btnsContainer || !grid) return;

    btnsContainer.addEventListener('click', function(e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;

      // Toggle active
      var wasActive = btn.classList.contains('active');
      btnsContainer.querySelectorAll('.filter-btn').forEach(function(b) {
        b.classList.remove('active');
      });
      if (!wasActive) btn.classList.add('active');

      var cat = wasActive ? null : btn.getAttribute('data-category');
      var items = grid.children;
      for (var i = 0; i < items.length; i++) {
        if (!cat) {
          items[i].style.display = '';
        } else {
          var itemCat = items[i].getAttribute('data-category') || '';
          items[i].style.display = itemCat === cat ? '' : 'none';
        }
      }
    });
  }

  // ---- Back to Top Button ----
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function() {
      btn.classList.toggle('visible', window.scrollY > 400);
    });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Active Nav Highlighting ----
  function initNavHighlight() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.header-nav a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function(link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-60px 0px 0px 0px' });

    sections.forEach(function(s) { observer.observe(s); });
  }

  // ---- Tagline Rotation ----
  function initTaglineRotation(taglines, element) {
    if (!taglines || !taglines.length || !element) return;
    var index = 0;
    setInterval(function() {
      index = (index + 1) % taglines.length;
      element.style.opacity = '0';
      setTimeout(function() {
        element.textContent = taglines[index];
        element.style.opacity = '1';
      }, 300);
    }, 5000);
  }

  // ---- Repo chip with data-category ----
  function createRepoChipWithCategory(repo) {
    var chip = el('div', 'repo-chip');
    chip.setAttribute('tabindex', '0');
    chip.setAttribute('role', 'listitem');
    chip.setAttribute('data-category', repo.category || '');

    var dot = el('span', 'repo-dot ' + repo.type);
    chip.appendChild(dot);
    chip.appendChild(document.createTextNode(repo.name));

    return chip;
  }

  function renderReposWithCategories(repos, container) {
    container.textContent = '';
    container.setAttribute('role', 'list');
    container.setAttribute('aria-label', 'Repository list');
    var fragment = document.createDocumentFragment();
    repos.forEach(function(r) {
      fragment.appendChild(createRepoChipWithCategory(r));
    });
    container.appendChild(fragment);
  }

  // Public API
  return {
    renderAgents: renderAgents,
    renderTiers: renderTiers,
    renderRepos: renderRepos,
    renderReposWithCategories: renderReposWithCategories,
    renderSentinel: renderSentinel,
    animateCounters: animateCounters,
    initSectionAnimations: initSectionAnimations,
    initSearch: initSearch,
    initCategoryFilter: initCategoryFilter,
    initBackToTop: initBackToTop,
    initNavHighlight: initNavHighlight,
    initTaglineRotation: initTaglineRotation
  };
})();
