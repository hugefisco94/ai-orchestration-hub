/* ============================================
   App — Main Initialization & Data Loading
   ============================================ */

(function() {
  'use strict';

  // Data loading with error handling
  function fetchJSON(url) {
    return fetch(url).then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' loading ' + url);
      return r.json();
    });
  }

  function showError(msg) {
    var container = document.querySelector('.container');
    if (!container) return;
    var banner = document.createElement('div');
    banner.className = 'error-banner';
    banner.setAttribute('role', 'alert');
    banner.textContent = 'Data loading error: ' + msg;
    container.insertBefore(banner, container.firstChild);
  }

  async function loadAllData() {
    try {
      var results = await Promise.all([
        fetchJSON('data/agents.json'),
        fetchJSON('data/tiers.json'),
        fetchJSON('data/repos.json'),
        fetchJSON('data/taglines.json'),
        fetchJSON('data/sections.json')
      ]);

      var agents = results[0];
      var tiers = results[1];
      var repos = results[2];
      var taglines = results[3];
      var sections = results[4];

      // Render agents
      var agentGrid = document.getElementById('agent-grid');
      if (agentGrid) Components.renderAgents(agents, agentGrid);

      // Render tiers
      var tierGrid = document.getElementById('tier-grid');
      if (tierGrid) Components.renderTiers(tiers, tierGrid);

      // Render repos with categories
      var repoGrid = document.getElementById('repo-grid');
      if (repoGrid) Components.renderReposWithCategories(repos, repoGrid);

      // Render Project Sentinel
      var sentinelContainer = document.getElementById('sentinel-content');
      if (sentinelContainer) Components.renderSentinel(sentinelContainer);

      // Tagline rotation
      var heroSub = document.getElementById('hero-subtitle');
      if (heroSub && taglines && taglines.length) {
        heroSub.textContent = sections.hero_subtitle || taglines[0];
        Components.initTaglineRotation(taglines, heroSub);
      }

      // Initialize interactive features
      Components.animateCounters();
      Components.initSearch('agent-search', 'agent-grid');
      Components.initSearch('repo-search', 'repo-grid');
      Components.initCategoryFilter('repo-filters', 'repo-grid');

    } catch (err) {
      console.error('Failed to load data:', err);
      showError(err.message);
    }
  }

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
    Components.initSectionAnimations();
    Components.initBackToTop();
    Components.initNavHighlight();
  });
})();
