#!/usr/bin/env bash
set -euo pipefail
cd /opt/municipal-fund
git pull --ff-only
npm ci --prefix backend && npm ci --prefix frontend
npm run build --prefix frontend
pm2 reload devops/ecosystem.config.cjs --update-env
sudo systemctl restart municipal-ai nginx
