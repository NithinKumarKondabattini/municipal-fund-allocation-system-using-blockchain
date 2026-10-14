import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
const databaseFile=path.resolve(process.env.DATABASE_FILE||path.join('data','municipal.db'));
// This also creates backend/data on a managed host when DATABASE_FILE is supplied.
fs.mkdirSync(path.dirname(databaseFile),{recursive:true});
export const db=new Database(databaseFile);
db.pragma('foreign_keys = ON');
db.exec(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,passwordHash TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('ADMIN','OFFICER','AUDITOR','CITIZEN')),createdAt TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS projects(id INTEGER PRIMARY KEY AUTOINCREMENT,projectName TEXT NOT NULL,description TEXT,category TEXT,location TEXT,startDate TEXT,expectedEndDate TEXT,totalBudget INTEGER NOT NULL,allocatedAmount INTEGER DEFAULT 0,spentAmount INTEGER DEFAULT 0,progress INTEGER DEFAULT 0,status TEXT DEFAULT 'Planning',createdBy INTEGER,assignedOfficer INTEGER,FOREIGN KEY(createdBy) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS fund_transactions(id INTEGER PRIMARY KEY AUTOINCREMENT,projectId INTEGER NOT NULL,amount INTEGER NOT NULL,transactionType TEXT NOT NULL,description TEXT NOT NULL,vendor TEXT,createdBy INTEGER,status TEXT DEFAULT 'PENDING',timestamp TEXT DEFAULT CURRENT_TIMESTAMP,blockchainHash TEXT,riskLevel TEXT,riskScore INTEGER DEFAULT 0,FOREIGN KEY(projectId) REFERENCES projects(id));
CREATE TABLE IF NOT EXISTS documents(id INTEGER PRIMARY KEY AUTOINCREMENT,projectId INTEGER,transactionId INTEGER,fileName TEXT,filePath TEXT,ipfsCid TEXT,fileHash TEXT,uploadedBy INTEGER,uploadedAt TEXT DEFAULT CURRENT_TIMESTAMP,verificationStatus TEXT DEFAULT 'PENDING');
CREATE TABLE IF NOT EXISTS audit_logs(id INTEGER PRIMARY KEY AUTOINCREMENT,userId INTEGER,action TEXT,entityType TEXT,entityId INTEGER,description TEXT,timestamp TEXT DEFAULT CURRENT_TIMESTAMP,blockchainHash TEXT);
CREATE TABLE IF NOT EXISTS alerts(id INTEGER PRIMARY KEY AUTOINCREMENT,projectId INTEGER,transactionId INTEGER,alertType TEXT,message TEXT,severity TEXT,status TEXT DEFAULT 'OPEN',createdAt TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS citizen_feedback(id INTEGER PRIMARY KEY AUTOINCREMENT,projectId INTEGER,citizenName TEXT,message TEXT NOT NULL,category TEXT,status TEXT DEFAULT 'OPEN',createdAt TEXT DEFAULT CURRENT_TIMESTAMP);`);
// Lightweight migrations keep existing demonstration databases usable after upgrades.
const addColumn=(table,column,definition)=>{const existing=db.prepare(`PRAGMA table_info(${table})`).all().some(x=>x.name===column);if(!existing)db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)};
addColumn('users','phone','TEXT');addColumn('users','isActive','INTEGER DEFAULT 1');addColumn('users','updatedAt','TEXT');
addColumn('projects','projectCode','TEXT');addColumn('projects','latitude','REAL');addColumn('projects','longitude','REAL');addColumn('projects','updatedAt','TEXT');
addColumn('projects','contractorName','TEXT');addColumn('projects','contractorGstin','TEXT');addColumn('projects','tenderReference','TEXT');addColumn('projects','workOrderNumber','TEXT');addColumn('projects','governmentDepartment','TEXT');addColumn('projects','wardNumber','TEXT');addColumn('projects','publicContact','TEXT');
addColumn('fund_transactions','transactionCode','TEXT');addColumn('fund_transactions','approvedBy','INTEGER');addColumn('fund_transactions','approvedAt','TEXT');
addColumn('citizen_feedback','email','TEXT');
db.exec(`CREATE TABLE IF NOT EXISTS notifications(id INTEGER PRIMARY KEY AUTOINCREMENT,userId INTEGER NOT NULL,title TEXT NOT NULL,message TEXT NOT NULL,type TEXT DEFAULT 'INFO',isRead INTEGER DEFAULT 0,createdAt TEXT DEFAULT CURRENT_TIMESTAMP);`);
db.exec(`CREATE TABLE IF NOT EXISTS project_materials(id INTEGER PRIMARY KEY AUTOINCREMENT,projectId INTEGER NOT NULL,materialName TEXT NOT NULL,specification TEXT,unit TEXT NOT NULL,plannedQuantity REAL NOT NULL,usedQuantity REAL DEFAULT 0,unitRate INTEGER DEFAULT 0,vendorName TEXT,qualityStatus TEXT DEFAULT 'PENDING',FOREIGN KEY(projectId) REFERENCES projects(id));`);
export const log=(userId,action,entityType,entityId,description,blockchainHash=null)=>db.prepare('INSERT INTO audit_logs(userId,action,entityType,entityId,description,blockchainHash) VALUES(?,?,?,?,?,?)').run(userId,action,entityType,entityId,description,blockchainHash);
export const notify=(userId,title,message,type='INFO')=>userId&&db.prepare('INSERT INTO notifications(userId,title,message,type) VALUES(?,?,?,?)').run(userId,title,message,type);
