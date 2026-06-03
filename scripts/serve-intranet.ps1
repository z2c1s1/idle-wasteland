# 构建并以生产模式在内网发布（监听 0.0.0.0:5000）
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "正在构建游戏..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$env:NODE_ENV = "production"
$env:HOST = "0.0.0.0"
$env:PORT = "5000"

Write-Host ""
Write-Host "内网服务启动中，端口 $env:PORT ..." -ForegroundColor Green
Write-Host "本机: http://localhost:$env:PORT" -ForegroundColor Yellow
Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
  Where-Object { $_.IPAddress -notmatch '^127\.' -and $_.PrefixOrigin -ne 'WellKnown' } |
  ForEach-Object { Write-Host "局域网: http://$($_.IPAddress):$env:PORT" -ForegroundColor Yellow }
Write-Host ""
Write-Host "按 Ctrl+C 停止服务" -ForegroundColor Gray
Write-Host ""

node scripts/serve-intranet.mjs
