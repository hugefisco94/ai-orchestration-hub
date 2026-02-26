/* ============================================
   Interactive Features — AI Orchestration Hub
   Metrics, Routing Demo, Activity Feed,
   Sentinel Status, OSINT Crawler, Architecture
   ============================================ */

'use strict';

var Interactive = (function() {

  var feedOpen = false;

  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  async function apiFetch(path, options) {
    try {
      var response = await fetch(path, options);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    } catch (err) {
      console.warn('API:', path, err.message);
      return null;
    }
  }

  // ---- Metrics Dashboard ----
  function initMetrics() {
    var container = document.getElementById('metrics-dashboard');
    if (!container) return;
    updateMetrics(container);
    setInterval(function() { updateMetrics(container); }, 10000);
  }

  async function updateMetrics(container) {
    var data = await apiFetch('api/metrics');
    if (!data) return;

    var items = container.querySelectorAll('.metric-value');
    if (items.length === 0) {
      renderMetricsUI(container, data);
    } else {
      animateValue(items[0], data.rps);
      animateValue(items[1], data.p50 + 'ms');
      animateValue(items[2], data.p95 + 'ms');
      animateValue(items[3], data.activeModels);
      animateValue(items[4], data.errorRate + '%');
    }
  }

  function renderMetricsUI(container, data) {
    container.textContent = '';
    var grid = el('div', 'metrics-grid');

    var metrics = [
      { label: 'Requests/sec', value: data.rps, color: 'cyan', ko: '\uC694\uCCAD/\uCD08' },
      { label: 'P50 Latency', value: data.p50 + 'ms', color: 'green', ko: 'P50 \uC9C0\uC5F0' },
      { label: 'P95 Latency', value: data.p95 + 'ms', color: 'orange', ko: 'P95 \uC9C0\uC5F0' },
      { label: 'Active Models', value: data.activeModels, color: 'purple', ko: '\uD65C\uC131 \uBAA8\uB378' },
      { label: 'Error Rate', value: data.errorRate + '%', color: 'red', ko: '\uC5D0\uB7EC\uC728' }
    ];

    metrics.forEach(function(m) {
      var card = el('div', 'metric-card');
      var value = el('div', 'metric-value metric-' + m.color, String(m.value));
      var label = el('div', 'metric-label');
      label.setAttribute('data-en', m.label);
      label.setAttribute('data-ko', m.ko);
      label.textContent = m.label;
      card.appendChild(value);
      card.appendChild(label);
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  function animateValue(element, newValue) {
    element.style.opacity = '0.5';
    setTimeout(function() {
      element.textContent = String(newValue);
      element.style.opacity = '1';
    }, 200);
  }

  // ---- Routing Demo ----
  function initRoutingDemo() {
    var btn = document.getElementById('route-btn');
    var input = document.getElementById('route-input');
    var result = document.getElementById('route-result');
    if (!btn || !input || !result) return;

    btn.addEventListener('click', function() { routeQuery(input, result); });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); routeQuery(input, result); }
    });
  }

  async function routeQuery(input, resultContainer) {
    var prompt = input.value.trim();
    if (!prompt) return;

    resultContainer.textContent = '';
    resultContainer.appendChild(el('div', 'route-loading', 'Routing...'));
    resultContainer.style.display = 'block';

    var data = await apiFetch('api/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt })
    });

    resultContainer.textContent = '';

    if (!data) {
      resultContainer.appendChild(el('div', 'route-error', 'Routing failed. Service Worker may not be ready yet. Refresh and try again.'));
      return;
    }

    var card = el('div', 'route-result-card');

    var tierBadge = el('div', 'route-tier tier-color-' + data.tier.toLowerCase(), data.tier);
    card.appendChild(tierBadge);

    var modelInfo = el('div', 'route-model');
    modelInfo.appendChild(el('div', 'route-model-name', data.model.name));
    modelInfo.appendChild(el('div', 'route-model-provider', data.model.provider));
    card.appendChild(modelInfo);

    var details = el('div', 'route-details');
    details.appendChild(el('span', 'route-latency', data.estimatedLatency));
    details.appendChild(el('span', 'route-reason', data.reason));
    card.appendChild(details);

    resultContainer.appendChild(card);
    requestAnimationFrame(function() { card.classList.add('route-animate-in'); });
  }

  // ---- Activity Feed ----
  function initActivityFeed() {
    var toggle = document.getElementById('activity-toggle');
    var panel = document.getElementById('activity-panel');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', function() {
      feedOpen = !feedOpen;
      panel.classList.toggle('open', feedOpen);
      toggle.classList.toggle('active', feedOpen);
      if (feedOpen) updateActivityFeed(panel);
    });

    setInterval(function() {
      if (feedOpen) updateActivityFeed(panel);
    }, 3500);
  }

  async function updateActivityFeed(panel) {
    var data = await apiFetch('api/activity');
    if (!data) return;

    var list = panel.querySelector('.activity-list');
    if (!list) {
      list = el('div', 'activity-list');
      panel.appendChild(list);
    }
    list.textContent = '';

    data.forEach(function(evt) {
      var item = el('div', 'activity-item activity-' + evt.type);
      item.appendChild(el('span', 'activity-icon', getIcon(evt.type)));
      item.appendChild(el('span', 'activity-msg', evt.message));
      item.appendChild(el('span', 'activity-time', timeAgo(evt.timestamp)));
      list.appendChild(item);
    });
  }

  function getIcon(type) {
    var m = { route: '\uD83D\uDD00', sentinel: '\uD83D\uDEE1\uFE0F', model: '\uD83E\uDD16', system: '\u26A1', osint: '\uD83D\uDD0D', crawler: '\uD83D\uDD77\uFE0F' };
    return m[type] || '\uD83D\uDCE1';
  }

  function timeAgo(ts) {
    var d = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (d < 60) return d + 's';
    if (d < 3600) return Math.floor(d / 60) + 'm';
    return Math.floor(d / 3600) + 'h';
  }

  // ---- Sentinel Real-time Status ----
  function initSentinelStatus() {
    setInterval(updateSentinelStatus, 8000);
    setTimeout(updateSentinelStatus, 2000);
  }

  async function updateSentinelStatus() {
    var data = await apiFetch('api/sentinel');
    if (!data) return;

    var cards = document.querySelectorAll('.sentinel-card');
    data.forEach(function(mod, i) {
      if (!cards[i]) return;
      var badge = cards[i].querySelector('.sentinel-status');
      if (!badge) {
        badge = el('div', 'sentinel-status');
        cards[i].appendChild(badge);
      }
      badge.className = 'sentinel-status status-' + mod.status.toLowerCase();
      badge.textContent = mod.status;
    });
  }

  // ---- Architecture Node Click ----
  function initArchInteraction() {
    document.querySelectorAll('.arch-node').forEach(function(node) {
      node.style.cursor = 'pointer';
      node.addEventListener('click', function() {
        var label = node.querySelector('.node-label');
        var sub = node.querySelector('.node-sub');
        showToast((label ? label.textContent : 'Node') + ' \u2014 ' + (sub ? sub.textContent : ''));
      });
    });
  }

  // ---- Toast ----
  function showToast(message) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = el('div', 'toast', message);
    document.body.appendChild(toast);
    requestAnimationFrame(function() { toast.classList.add('toast-show'); });
    setTimeout(function() {
      toast.classList.remove('toast-show');
      setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
  }

  // ---- OSINT Crawler Status ----
  function initCrawlerStatus() {
    var container = document.getElementById('crawler-status');
    if (!container) return;

    var feeds = [
      { name: 'CVE Feed', url: 'cve.mitre.org', interval: '15min' },
      { name: 'NVD Database', url: 'nvd.nist.gov', interval: '30min' },
      { name: 'ExploitDB', url: 'exploit-db.com', interval: '1hr' },
      { name: 'Shodan Monitor', url: 'shodan.io', interval: '5min' },
      { name: 'VirusTotal', url: 'virustotal.com', interval: '10min' },
      { name: 'OSINT RSS Aggregator', url: 'rss.osint-feeds.io', interval: '5min' }
    ];

    var grid = el('div', 'crawler-grid');
    feeds.forEach(function(f) {
      var card = el('div', 'crawler-card');
      var header = el('div', 'crawler-header');
      header.appendChild(el('span', 'crawler-dot'));
      header.appendChild(el('span', 'crawler-name', f.name));
      card.appendChild(header);
      card.appendChild(el('div', 'crawler-url', f.url));
      card.appendChild(el('div', 'crawler-interval', 'Interval: ' + f.interval));
      var mins = Math.floor(Math.random() * 30) + 1;
      card.appendChild(el('div', 'crawler-last', 'Last: ' + mins + 'min ago'));
      var items = Math.floor(Math.random() * 500) + 12;
      card.appendChild(el('div', 'crawler-count', items + ' items cached'));
      grid.appendChild(card);
    });
    container.appendChild(grid);

    var info = el('div', 'crawler-delete-info');
    info.setAttribute('data-en', 'Auto-purge: cached data expires after 6 hours (Elice Cloud temp storage)');
    info.setAttribute('data-ko', '\uC790\uB3D9 \uC0AD\uC81C: \uCE90\uC2DC \uB370\uC774\uD130 6\uC2DC\uAC04 \uD6C4 \uB9CC\uB8CC (\uC5D8\uB9AC\uC2A4 \uD074\uB77C\uC6B0\uB4DC \uC784\uC2DC \uC800\uC7A5)');
    info.textContent = 'Auto-purge: cached data expires after 6 hours (Elice Cloud temp storage)';
    container.appendChild(info);
  }

  // ---- Model Status Dots ----
  function initModelStatus() {
    setInterval(updateModelStatus, 12000);
    setTimeout(updateModelStatus, 3000);
  }

  async function updateModelStatus() {
    var data = await apiFetch('api/models');
    if (!data) return;

    var items = document.querySelectorAll('.model-item');
    items.forEach(function(item, i) {
      if (!data[i]) return;
      var dot = item.querySelector('.model-status-dot');
      if (!dot) {
        dot = el('span', 'model-status-dot');
        item.insertBefore(dot, item.firstChild);
      }
      dot.className = 'model-status-dot dot-' + data[i].status;
    });
  }

  return {
    init: function() {
      initMetrics();
      initRoutingDemo();
      initActivityFeed();
      initSentinelStatus();
      initArchInteraction();
      initCrawlerStatus();
      initModelStatus();
    },
    showToast: showToast
  };
})();
