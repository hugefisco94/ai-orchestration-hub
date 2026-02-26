/* ============================================
   Service Worker Backend — AI Orchestration Hub
   Intercepts /api/* and returns simulated live data
   ============================================ */

var SW_VERSION = '2.0.0';
var START_TIME = Date.now();

var MODELS = {
  t1: [
    { id: 'gemini-flash', name: 'Gemini 2.0 Flash', provider: 'Google', latency: '~3s' },
    { id: 'gemini3-flash', name: 'Gemini 3 Flash', provider: 'Google', latency: '~3s' },
    { id: 'qwen3-coder', name: 'Qwen 3 Coder', provider: 'Alibaba', latency: '~5s' },
    { id: 'mistral-small', name: 'Mistral Small', provider: 'Mistral AI', latency: '~4s' },
    { id: 'minimax-m2.5', name: 'MiniMax M2.5', provider: 'MiniMax', latency: '~4s' },
    { id: 'claude-haiku', name: 'Claude 4.5 Haiku', provider: 'Anthropic', latency: '~5s' }
  ],
  t2: [
    { id: 'deepseek-v3', name: 'DeepSeek-V3', provider: 'DeepSeek', latency: '~5s' },
    { id: 'gemini3-pro', name: 'Gemini 3 Pro', provider: 'Google', latency: '~7s' },
    { id: 'qwen3-235b', name: 'Qwen 3 235B', provider: 'Alibaba', latency: '~14s' },
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', latency: '~6s' },
    { id: 'claude-sonnet', name: 'Claude Sonnet 4.6', provider: 'Anthropic', latency: '~8s' }
  ],
  t3: [
    { id: 'deepseek-r1', name: 'DeepSeek-R1', provider: 'DeepSeek', latency: '~21s' },
    { id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI', latency: '~18s' },
    { id: 'claude-opus', name: 'Claude Opus 4.6', provider: 'Anthropic', latency: '~20s' },
    { id: 'grok-4', name: 'Grok 4', provider: 'xAI', latency: '~16s' }
  ]
};

var SENTINEL_MODULES = [
  { id: 'osint', name: 'OSINT Intelligence', icon: '\uD83D\uDD0D' },
  { id: 'vuln', name: 'Vulnerability Scanner', icon: '\uD83D\uDEE1\uFE0F' },
  { id: 'network', name: 'Network Monitor', icon: '\uD83C\uDF10' },
  { id: 'threat', name: 'Threat Analytics', icon: '\uD83D\uDCCA' },
  { id: 'incident', name: 'Incident Response', icon: '\u26A0\uFE0F' },
  { id: 'compliance', name: 'Compliance Audit', icon: '\uD83D\uDD12' }
];

var ACTIVITY_TEMPLATES = [
  { type: 'route', msg: 'T{tier} \u2192 {model}: prompt routed ({latency})' },
  { type: 'sentinel', msg: 'Sentinel: {module} scan completed \u2014 {result}' },
  { type: 'model', msg: '{model} status changed to {status}' },
  { type: 'system', msg: 'System health check \u2014 all services operational' },
  { type: 'osint', msg: 'OSINT: {source} feed updated \u2014 {count} new entries' },
  { type: 'crawler', msg: 'Crawler: {target} scraped \u2014 {count} items cached (auto-purge 6h)' }
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateHealth() {
  return {
    status: 'ok',
    version: SW_VERSION,
    uptime: Math.floor((Date.now() - START_TIME) / 1000),
    models: { total: 93, active: rand(85, 93), offline: rand(0, 8) },
    agents: 15,
    sentinel: { modules: 6, active: rand(5, 6) },
    crawler: { feeds: 6, itemsCached: rand(200, 2000), autoPurgeHours: 6 },
    timestamp: new Date().toISOString()
  };
}

function generateModels() {
  var all = [];
  ['t1', 't2', 't3'].forEach(function(tier) {
    MODELS[tier].forEach(function(m) {
      all.push({
        id: m.id, name: m.name, provider: m.provider, latency: m.latency,
        tier: tier,
        status: Math.random() > 0.12 ? 'online' : 'offline',
        rps: rand(10, 200),
        p50: rand(100, 2000)
      });
    });
  });
  return all;
}

function generateMetrics() {
  return {
    rps: rand(75, 135),
    p50: rand(200, 900),
    p95: rand(1500, 5500),
    activeModels: rand(85, 93),
    totalRequests: rand(10000, 50000),
    tokensProcessed: rand(500000, 2000000),
    errorRate: (Math.random() * 2).toFixed(2),
    crawlerItems: rand(200, 2000),
    timestamp: new Date().toISOString()
  };
}

function generateSentinel() {
  var weights = [0.7, 0.2, 0.1];
  return SENTINEL_MODULES.map(function(m) {
    var r = Math.random();
    var status = r < weights[0] ? 'ACTIVE' : r < weights[0] + weights[1] ? 'SCANNING' : 'ALERT';
    return {
      id: m.id, name: m.name, icon: m.icon,
      status: status,
      lastScan: new Date(Date.now() - rand(0, 300000)).toISOString(),
      threatsFound: status === 'ALERT' ? rand(1, 5) : 0
    };
  });
}

function generateActivity() {
  var events = [];
  for (var i = 0; i < 10; i++) {
    var template = pick(ACTIVITY_TEMPLATES);
    var msg = template.msg
      .replace('{tier}', '' + rand(1, 3))
      .replace('{model}', pick(['Gemini Flash', 'Claude Sonnet', 'GPT-4o', 'DeepSeek-R1', 'Qwen3']))
      .replace('{latency}', rand(1, 25) + '.' + rand(0, 9) + 's')
      .replace('{module}', pick(['OSINT', 'Vuln Scanner', 'Network Monitor', 'Threat Analytics']))
      .replace('{result}', pick(['no threats', '2 warnings', 'clean', '1 alert']))
      .replace('{status}', pick(['online', 'offline', 'degraded']))
      .replace('{source}', pick(['CVE', 'NVD', 'ExploitDB', 'Shodan', 'VirusTotal']))
      .replace('{target}', pick(['RSS feeds', 'threat intel', 'OSINT sources', 'dark web monitors']))
      .replace('{count}', '' + rand(3, 47));
    events.push({
      id: i,
      type: template.type,
      message: msg,
      timestamp: new Date(Date.now() - rand(0, 600000)).toISOString()
    });
  }
  return events.sort(function(a, b) { return new Date(b.timestamp) - new Date(a.timestamp); });
}

function routePrompt(body) {
  var prompt = (body && body.prompt) || '';
  var len = prompt.length;
  var deepKeywords = ['\uBD84\uC11D', '\uC5F0\uAD6C', '\uCF54\uB529', 'analyze', 'research', 'code', 'implement', 'architect', 'design', '\uC124\uACC4', '\uAD6C\uD604'];
  var isDeep = deepKeywords.some(function(k) { return prompt.toLowerCase().indexOf(k) !== -1; });

  var tier, model, latency, reason;

  if (isDeep || len > 500) {
    tier = 'T3';
    model = pick(MODELS.t3);
    latency = rand(15, 25) + '.' + rand(0, 9) + 's';
    reason = isDeep ? 'Deep reasoning keywords detected' : 'Complex prompt (>500 chars)';
  } else if (len > 100) {
    tier = 'T2';
    model = pick(MODELS.t2);
    latency = rand(5, 14) + '.' + rand(0, 9) + 's';
    reason = 'Moderate complexity (100-500 chars)';
  } else {
    tier = 'T1';
    model = pick(MODELS.t1);
    latency = rand(1, 4) + '.' + rand(0, 9) + 's';
    reason = 'Quick lookup / simple prompt (<100 chars)';
  }

  return {
    tier: tier,
    model: { id: model.id, name: model.name, provider: model.provider },
    estimatedLatency: latency,
    reason: reason,
    promptLength: len,
    timestamp: new Date().toISOString()
  };
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-Powered-By': 'SW-Backend/' + SW_VERSION
    }
  });
}

self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);
  var path = url.pathname;

  var apiPath = null;
  if (path.indexOf('/api/') !== -1) {
    apiPath = path.substring(path.indexOf('/api/'));
  }

  if (!apiPath) return;

  event.respondWith(handleAPI(apiPath, event.request));
});

async function handleAPI(path, request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  switch (path) {
    case '/api/health':
      return jsonResponse(generateHealth());
    case '/api/models':
      return jsonResponse(generateModels());
    case '/api/metrics':
      return jsonResponse(generateMetrics());
    case '/api/sentinel':
      return jsonResponse(generateSentinel());
    case '/api/activity':
      return jsonResponse(generateActivity());
    case '/api/route':
      if (request.method === 'POST') {
        var body = await request.json().catch(function() { return {}; });
        return jsonResponse(routePrompt(body));
      }
      return jsonResponse({ error: 'POST required' }, 405);
    default:
      return jsonResponse({ error: 'Not found', path: path }, 404);
  }
}

self.addEventListener('install', function() {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});
