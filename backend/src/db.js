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
export const log=(userId,action,entityType,entityId,description,blockchainHash=null)=>db.prepare('INSERT INTO audit_logs(userId,action,entityType,entityId,description,blockchainHash) VALUES(?,?,?,?,?,?)').run(userId,action,entityType,entityId,description,blockchainHash);
