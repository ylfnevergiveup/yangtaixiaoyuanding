/**
 * 部署守护进程 — 监听 HTTP 请求，后台执行部署
 * 启动方式: node scripts/deploy-daemon.js
 * 部署触发: POST http://localhost:3456/deploy
 * 状态查询: GET http://localhost:3456/status
 */

const http = require('http');
const { exec, spawn } = require('child_process');
const path = require('path');

const PORT = 3456;
const PROJECT_DIR = path.resolve(__dirname, '..');

let deployRunning = false;
let lastDeployTime = null;
let lastDeployResult = null;

function runDeploy() {
  if (deployRunning) {
    return { status: 'already_running', message: '部署正在进行中，请稍后重试' };
  }

  deployRunning = true;
  console.log(`[${new Date().toISOString()}] 🚀 开始部署...`);

  const child = spawn('npm', ['run', 'deploy'], {
    cwd: PROJECT_DIR,
    shell: true,
    env: { ...process.env, ASSET_PREFIX: '/v2' },
  });

  let stdout = '';
  let stderr = '';

  child.stdout.on('data', (data) => {
    const text = data.toString();
    stdout += text;
    if (text.includes('Deployment complete') || text.includes('Failed to upload')) {
      console.log(text.trim());
    }
  });

  child.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  child.on('close', (code) => {
    deployRunning = false;
    lastDeployTime = new Date().toISOString();
    lastDeployResult = {
      success: code === 0,
      exitCode: code,
      files: extractFileCount(stdout),
      errors: extractErrors(stderr),
    };
    console.log(`[${lastDeployTime}] 部署${code === 0 ? '成功 ✅' : '失败 ❌'}`);
  });

  return { status: 'started', message: '部署已开始' };
}

function extractFileCount(output) {
  const match = output.match(/Successfully uploaded (\d+) file/);
  return match ? parseInt(match[1]) : null;
}

function extractErrors(stderr) {
  if (!stderr) return null;
  const lines = stderr.split('\n').filter(l => l.includes('Error') || l.includes('error'));
  return lines.length > 0 ? lines.slice(0, 5).join('\n') : null;
}

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'POST' && url.pathname === '/deploy') {
    const result = runDeploy();
    res.writeHead(result.status === 'started' ? 202 : 409, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } else if (req.method === 'GET' && url.pathname === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      deployRunning,
      lastDeployTime,
      lastDeployResult,
    }));
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Plant deploy daemon running', endpoints: ['POST /deploy', 'GET /status'] }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`🌱 部署守护进程已启动: http://127.0.0.1:${PORT}`);
  console.log(`   触发部署: POST http://127.0.0.1:${PORT}/deploy`);
  console.log(`   查看状态: GET  http://127.0.0.1:${PORT}/status`);
});
