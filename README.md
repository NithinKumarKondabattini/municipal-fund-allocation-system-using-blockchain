# Municipal Fund Allocation System Using Blockchain

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/NithinKumarKondabattini/municipal-fund-allocation-system-using-blockchain)

A student-ready full-stack project that makes municipal allocations, spending approvals, document proofs and public project data transparent. Financial values are stored as integer **paise**; blockchain gas is never treated as municipal money.

## What the system does

CivicLedger is a municipal construction-finance transparency platform. It manages the journey from an approved project budget to expenditure approval, audit evidence and citizen-facing disclosure.

The site is deliberately split into two experiences:

1. **Public transparency portal** — no account needed. Citizens can inspect municipal works, budget use, delivery progress, contractors, materials, payment proof references and feedback.
2. **Secure staff workspace** — role-based login for administration, officers and auditors. Staff can create projects, allocate funds, submit expenditure, approve or reject payments, review risk information, inspect audit events and verify documents.

## Website guide

### Public portal

| Page | What visitors can do |
| --- | --- |
| **Projects** | Search municipal works by name, ward, area, contractor or category. Each card shows construction status, released funds, used funds, delivery percentage and required balance. |
| **Full project dossier** | Select Open full project dossier on any project card. The detailed record shows the project code, location, sanctioned/released/used funds, milestones, map, contractor, materials, payment ledger and feedback form. |
| **Works map** | Browse the visual municipal worksite locator. Select a map marker or worksite index item to open the relevant project dossier. Google Maps links open a location search for route planning. |
| **About** | Read the platform purpose, technical capabilities, developer disclosure and project-team links. |

### What is inside every project dossier

Every seeded public project record includes:

- A unique municipal project code, location, ward, department and public contact.
- Sanctioned budget, allocation released, expenditure certified, remaining requirement and financial utilisation.
- Construction progress, expected completion, delivery-milestone monitor and printable disclosure button.
- Contractor name, GSTIN, tender reference and work-order reference.
- Material schedule: material name, specification, supplier, planned quantity, used quantity and quality status.
- Embedded map preview plus a direct Google Maps location link.
- The first 100 approved expenditure records with transaction code, payment purpose, amount, date and unique development-proof ID.
- Citizen feedback form, which saves feedback for municipal review.

### Secure staff workspace

| Workspace page | Function |
| --- | --- |
| **Overview** | Control-tower KPIs, allocation-versus-spend chart, project-health watchlist, compliance queue, variance view and recent ledger entries. |
| **Project registry** | Create governed project records and view the complete municipal portfolio. |
| **Approval queue** | Review pending expenditure submissions and approve or reject them. |
| **Users & access** | Admin-only staff role management and account access control. |
| **Alerts** | Review and resolve risk/compliance alerts. |
| **Reports** | Portfolio reporting and CSV export. |
| **Audit trail** | Auditor/Admin view of recorded system actions and proof references. |
| **Documents** | Upload document evidence and run SHA-256 integrity verification. |
| **Submit expenditure** | Officer workflow for creating an expenditure request for approval. |

## Roles and permissions

| Role | Main permissions |
| --- | --- |
| **Admin** | Project setup, fund allocation, user administration, transaction approval/rejection, alerts, reports and audit oversight. |
| **Municipal Officer** | View assigned projects and submit expenditure requests for approval. |
| **Auditor** | Review audit events, documents, proof references, alerts and reports. |
| **Citizen** | Browse published work records and send project feedback. |

Role enforcement is implemented in the Express API using JWT authentication and server-side role checks. The public portal does not expose staff-only endpoints.

### Role-specific workspace behavior

| Account | Workspace behavior |
| --- | --- |
| **Admin** | Creates municipal projects, assigns a Municipal Officer, releases project funds, approves or rejects expenditure requests, manages roles, resolves alerts and runs reports. |
| **Municipal Officer** | Sees only assigned work packages and their financial records, updates physical work progress, submits expenditure with vendor and invoice-purpose details, then tracks approval status. |
| **Auditor** | Reviews approved expenditure, risk levels, document-hash status, audit events, alert evidence and local proof references without changing municipal funds. |
| **Citizen** | Reads the public work register, construction progress, contractor and material records, approved payment ledger, proof references and notifications. |

The seeded local database includes five assigned projects, 500 approved expenditure records, three pending officer requests and three open review alerts so every workspace has meaningful records on first run.

## Demo data and project records

The seed script creates five detailed Greater Warangal municipal work packages:

| Project code | Work package | Delivery partner | Transactions |
| --- | --- | --- | ---: |
| MUN-2026-0001 | Warangal Smart Road Corridor | Telangana Infra Works Pvt. Ltd. | 100 |
| MUN-2026-0002 | Smart LED Street Lighting Programme | Deccan Lighting Systems LLP | 100 |
| MUN-2026-0003 | Kazipet Water Supply Improvement | Godavari Water Projects Ltd. | 100 |
| MUN-2026-0004 | Public Park & Open Space Renewal | Greenfield Urban Spaces Pvt. Ltd. | 100 |
| MUN-2026-0005 | Narsampet Drainage Resilience Works | Kakatiya Civil Engineering Co. | 100 |

Each record also has three construction-material entries, procurement information and unique LOCAL-DEV-PROOF evidence references. There are **500 approved demo transactions** in total.

## Architecture

Citizen / Admin / Officer / Auditor

↓

React + Vite public and staff UI

↓

Express REST API + JWT

↓

SQLite + audit records | FastAPI AI risk service | SHA-256 documents/IPFS fallback | Solidity/Hardhat ledger proof

### Important development disclosure

The Solidity MunicipalLedger contract is included and tested through Hardhat. The running local website remains usable without a blockchain node by writing clearly marked LOCAL-DEV-PROOF references. These are development proof IDs, not public-blockchain transaction hashes. Connect a deployed contract using an Ethers adapter before claiming on-chain production verification.

Document upload uses SHA-256 integrity checks and local fallback storage. IPFS CID fields are ready for a configured IPFS provider but the demo does not pretend local files are already stored on a public IPFS network.

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

Visit the Vite URL shown in terminal 2 (normally `http://localhost:5173`). For local Vite development, set `VITE_API_URL=http://localhost:4000/api` in `frontend/.env.local`. Production is a single Express site, so it uses `/api` automatically. Demo password for every account is `Fund@1234`:

| Role | Email |
| --- | --- |
| Admin | admin@gmail.com |
| Municipal Officer | municipalofficer@gmail.com |
| Auditor | auditor@gmail.com |
| Citizen | citizen@gmail.com |

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

### Useful API calls during development

| Endpoint | Purpose |
| --- | --- |
| GET /api/health | Service health check. |
| GET /api/projects | Public project register. |
| GET /api/projects/:id | Full public project dossier, materials and approved transactions. |
| POST /api/auth/login | Staff login returning JWT and role data. |
| GET /api/dashboard | Authenticated dashboard portfolio metrics. |
| GET /api/transactions | Authenticated transaction list. |
| GET /api/audit | Protected audit events. |
| GET /api/blockchain/verify/:hash | Verify a stored proof reference. |

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

### GitHub Pages demo

The GitHub Pages workflow publishes the static public interface after every push to main:

https://nithinkumarkondabattini.github.io/municipal-fund-allocation-system-using-blockchain/

GitHub Pages cannot run Node.js, Python, SQLite, IPFS or Hardhat services. The public static build is useful for showing the interface; use Render, a VPS with PM2/Nginx, or another Node-capable host for the complete live API, AI, documents and staff workflows.

### Deploy the complete API-backed system

The repository includes render.yaml for a combined Express API and React site deployment. From the Render dashboard select **New → Blueprint**, connect this GitHub repository and allow Render to use render.yaml. Render will build the frontend, seed the SQLite demonstration database and start the API at /api/health.

After Render gives the service a URL, open the deployed service URL directly for the complete system. To point the GitHub Pages frontend at that API, add a GitHub repository variable named PUBLIC_API_URL with the Render URL followed by /api, then redeploy the Pages workflow. This keeps GitHub Pages as the frontend while Render runs the authenticated API.

For a production installation, replace ephemeral SQLite storage with Render Postgres or a persistent disk and store uploads in object storage.
