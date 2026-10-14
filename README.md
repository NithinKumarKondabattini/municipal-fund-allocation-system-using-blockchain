# Municipal Fund Allocation System Using Blockchain

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/NithinKumarKondabattini/municipal-fund-allocation-system-using-blockchain)

A student-ready full-stack project that makes municipal allocations, spending approvals, document proofs and public project data transparent. Financial values are stored as integer **paise**; blockchain gas is never treated as municipal money.

## Included modules

- React/Vite public transparency portal, project dossiers, works locator and staff dashboard
- Express API with JWT, bcrypt, role checks, validation, Helmet, rate limiting, SQLite persistence and audit logs
- Admin allocation/approval workflow, officer expenditure submission and citizen feedback
- SHA-256 document storage and tamper verification (local fallback; metadata is ready for IPFS CID)
- FastAPI + genuine Isolation Forest risk endpoint
- Solidity `MunicipalLedger` contract for compact immutable event proofs
- Demo seed data for Warangal, Hanamkonda, Kazipet and Narsampet projects: contractor, tender, work-order, material, quality and public-contact records
- Five complete public project dossiers with 100 approved payments and unique proof IDs per project
- GitHub Actions, Nginx, PM2 and systemd deployment examples (no Docker)

## Quick start in VS Code

Open three terminals from this folder:

```powershell
# Terminal 1 – API and automatic SQLite schema
npm install --prefix backend
npm run seed --prefix backend
npm run dev:backend

# Terminal 2 – web UI
npm install --prefix frontend
npm run dev:frontend

# Terminal 3 – AI risk service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r ai-service\requirements.txt
uvicorn main:app --app-dir ai-service --reload
```

Visit the Vite URL shown in terminal 2 (normally `http://localhost:5173`). For local Vite development, set `VITE_API_URL=http://localhost:4000/api` in `frontend/.env.local`. Production is a single Express site, so it uses `/api` automatically. Demo password for every account is `Demo@123`:

| Role | Email |
| --- | --- |
| Admin | admin@municipal.gov.in |
| Officer | officer@municipal.gov.in |
| Auditor | auditor@municipal.gov.in |
| Citizen | citizen@example.com |

## Public website routes

| Area | Local route |
| --- | --- |
| Public works directory | http://127.0.0.1:5173/#/ |
| Visual works locator | http://127.0.0.1:5173/#/works-map |
| Platform and team | http://127.0.0.1:5173/#/about |
| Staff login | http://127.0.0.1:5173/#/login |
| Admin control tower | http://127.0.0.1:5173/#/dashboard/overview |

Each public dossier includes project identity, sanctioned/released/used funds, construction progress, milestone tracker, Google Maps worksite link, contractor and tender details, material quantities, quality status, 100 payment rows, printable disclosure and citizen feedback.

## Project team

| Contributor | Focus |
| --- | --- |
| [Nithin Kumar Kondabattini](https://github.com/NithinKumarKondabattini) | Project lead |
| [Chandan Singh](https://github.com/BATTI-CHANDAN-SINGH) | Blockchain and backend |
| [Sabir Mohammed](https://github.com/sabirmohammed123) | Data and integration |
| [Harshitha Ganta](https://github.com/HarshithaGanta) | Research and quality |

## Blockchain local development

```powershell
npm install --prefix blockchain
npm run node --prefix blockchain
# in another terminal
npm run deploy --prefix blockchain
```

The API currently always remains usable with a clearly labelled `LOCAL-*` immutable-proof fallback, so deployment of a node is not required for routine development. Connect the deployed contract address through a production Ethers adapter before using a real network.

## API overview

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET|POST /api/projects`; `POST /api/projects/:id/allocate`
- `GET|POST /api/transactions`; `PATCH /api/transactions/:id/decision`
- `POST /api/documents`; `POST /api/documents/:id/verify`
- `GET /api/dashboard`, `/api/alerts`, `/api/audit`, `/api/blockchain/verify/:hash`
- `POST /api/feedback`

Protected requests use `Authorization: Bearer <JWT>`. Public registration creates **citizen** accounts only; an admin provisions staff roles. Admin can create/allocate/approve; officers submit spending only for assigned projects; auditors have audit/verification access. The SQLite schema is created automatically at API start.

## Tests and build

```powershell
npm test --prefix backend
npm run build --prefix frontend
npm test --prefix blockchain
pytest ai-service\tests
```

## Deployment

Copy `.env.example` to `backend/.env` and change `JWT_SECRET`. Configure the host name in `devops/nginx/municipal.conf`, create the AI service from `devops/systemd/municipal-ai.service`, and use PM2 with `devops/ecosystem.config.cjs`. Install TLS after DNS is configured:

```bash
sudo certbot --nginx -d example.gov.in
```

The deploy workflow requires `DEPLOY_HOST`, `DEPLOY_USER`, and `DEPLOY_KEY` GitHub secrets. It invokes `devops/deploy.sh` on every push to `main`.

### Create a public demo link with Render

1. Sign in to [Render](https://render.com), select **New → Blueprint**, and select this GitHub repository.
2. Render reads `render.yaml`, builds the React app, seeds SQLite, and starts the combined Express website.
3. Open the `onrender.com` URL Render shows after the deployment becomes **Live**.

The free service is appropriate for a final-year demonstration but its local SQLite/upload data is ephemeral when the service is restarted. Use Render Postgres and object storage for production persistence.
