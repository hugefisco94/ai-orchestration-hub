/* ============================================
   Express Backend — AI Orchestration Hub
   Local dev server mirroring SW API endpoints
   ============================================ */

'use strict';

var express = require('express');
var cors = require('cors');
var path = require('path');
var http = require('http');

var app = express();
var server = http.createServer(app);
var PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ---- Data generators (mirror sw.js logic) ----

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

var START = Date.now();

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

var SENTINEL = [
  { id: 'osint', name: 'OSINT Intelligence' },
  { id: 'vuln', name: 'Vulnerability Scanner' },
  { id: 'network', name: 'Network Monitor' },
  { id: 'threat', name: 'Threat Analytics' },
  { id: 'incident', name: 'Incident Response' },
  { id: 'compliance', name: 'Compliance Audit' }
];

// ---- API Routes ----

app.get('/api/health', function(req, res) {
  res.json({
    status: 'ok', version: '2.0.0',
    uptime: Math.floor((Date.now() - START) / 1000),
    models: { total: 93, active: rand(85, 93), offline: rand(0, 8) },
    agents: 15,
    sentinel: { modules: 6, active: rand(5, 6) },
    crawler: { feeds: 6, itemsCached: rand(200, 2000), autoPurgeHours: 6 },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/models', function(req, res) {
  var all = [];
  ['t1', 't2', 't3'].forEach(function(tier) {
    MODELS[tier].forEach(function(m) {
      all.push({
        id: m.id, name: m.name, provider: m.provider, latency: m.latency,
        tier: tier, status: Math.random() > 0.12 ? 'online' : 'offline',
        rps: rand(10, 200), p50: rand(100, 2000)
      });
    });
  });
  res.json(all);
});

app.get('/api/metrics', function(req, res) {
  res.json({
    rps: rand(75, 135), p50: rand(200, 900), p95: rand(1500, 5500),
    activeModels: rand(85, 93), totalRequests: rand(10000, 50000),
    tokensProcessed: rand(500000, 2000000), errorRate: (Math.random() * 2).toFixed(2),
    crawlerItems: rand(200, 2000), timestamp: new Date().toISOString()
  });
});

app.get('/api/sentinel', function(req, res) {
  res.json(SENTINEL.map(function(m) {
    var r = Math.random();
    var status = r < 0.7 ? 'ACTIVE' : r < 0.9 ? 'SCANNING' : 'ALERT';
    return {
      id: m.id, name: m.name, status: status,
      lastScan: new Date(Date.now() - rand(0, 300000)).toISOString(),
      threatsFound: status === 'ALERT' ? rand(1, 5) : 0
    };
  }));
});

app.get('/api/activity', function(req, res) {
  var templates = [
    'T{t} \u2192 {m}: prompt routed ({l})',
    'Sentinel: {mod} scan \u2014 {r}',
    '{m} status \u2192 {s}',
    'OSINT: {src} feed \u2014 {c} entries',
    'Crawler: {tgt} scraped \u2014 {c} items cached'
  ];
  var events = [];
  for (var i = 0; i < 10; i++) {
    var tpl = pick(templates);
    events.push({
      id: i,
      type: pick(['route', 'sentinel', 'model', 'osint', 'crawler']),
      message: tpl
        .replace('{t}', '' + rand(1, 3))
        .replace('{m}', pick(['Gemini Flash', 'Claude Sonnet', 'GPT-4o', 'DeepSeek-R1']))
        .replace('{l}', rand(1, 25) + '.' + rand(0, 9) + 's')
        .replace('{mod}', pick(['OSINT', 'Vuln Scanner', 'Network']))
        .replace('{r}', pick(['clean', '2 warnings', '1 alert']))
        .replace('{s}', pick(['online', 'offline']))
        .replace('{src}', pick(['CVE', 'NVD', 'Shodan', 'VirusTotal']))
        .replace('{tgt}', pick(['RSS feeds', 'threat intel', 'OSINT sources']))
        .replace('{c}', '' + rand(3, 47)),
      timestamp: new Date(Date.now() - rand(0, 600000)).toISOString()
    });
  }
  res.json(events.sort(function(a, b) { return new Date(b.timestamp) - new Date(a.timestamp); }));
});

app.post('/api/route', function(req, res) {
  var prompt = (req.body && req.body.prompt) || '';
  var len = prompt.length;
  var deep = ['\uBD84\uC11D', '\uC5F0\uAD6C', '\uCF54\uB529', 'analyze', 'research', 'code', 'implement', 'architect'].some(function(k) {
    return prompt.toLowerCase().indexOf(k) !== -1;
  });

  var tier, model, latency, reason;
  if (deep || len > 500) {
    tier = 'T3'; model = pick(MODELS.t3); latency = rand(15, 25) + '.' + rand(0, 9) + 's';
    reason = deep ? 'Deep reasoning keywords detected' : 'Complex prompt (>500 chars)';
  } else if (len > 100) {
    tier = 'T2'; model = pick(MODELS.t2); latency = rand(5, 14) + '.' + rand(0, 9) + 's';
    reason = 'Moderate complexity (100-500 chars)';
  } else {
    tier = 'T1'; model = pick(MODELS.t1); latency = rand(1, 4) + '.' + rand(0, 9) + 's';
    reason = 'Quick lookup (<100 chars)';
  }

  res.json({
    tier: tier,
    model: { id: model.id, name: model.name, provider: model.provider },
    estimatedLatency: latency, reason: reason,
    promptLength: len, timestamp: new Date().toISOString()
  });
});

// ---- WebSocket (optional, for local dev) ----
try {
  var WebSocket = require('ws');
  var wss = new WebSocket.Server({ server: server, path: '/ws' });
  wss.on('connection', function(ws) {
    var interval = setInterval(function() {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'metrics',
          data: { rps: rand(75, 135), p50: rand(200, 900), activeModels: rand(85, 93) }
        }));
      }
    }, 5000);
    ws.on('close', function() { clearInterval(interval); });
  });
} catch (e) {
  console.log('WebSocket module not available, skipping WS server');
}

server.listen(PORT, function() {
  console.log('AI Orchestration Hub server running on http://localhost:' + PORT);
  console.log('API endpoints: /api/health, /api/models, /api/metrics, /api/sentinel, /api/activity, /api/route');
});
