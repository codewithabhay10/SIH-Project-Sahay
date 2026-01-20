# 🇮🇳 PM-AJAY Digital Platform (SIHPS25152)

[![GitHub](https://img.shields.io/badge/GitHub-codewithabhay10%2FSIH--Project--Sahay-blue?logo=github)](https://github.com/codewithabhay10/SIH-Project-Sahay)
[![Smart India Hackathon](https://img.shields.io/badge/SIH-2025-orange)](https://www.sih.gov.in/)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

A comprehensive digital platform for the **Pradhan Mantri Anusuchit Jaati Abhyudaya Yojana (PM-AJAY)** scheme, built for Smart India Hackathon 2025. This platform modernizes welfare fund disbursement, beneficiary management, and evidence tracking using blockchain technology, AI/ML models, and multi-channel communication.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Data Files](#data-files)
- [Getting Started](#getting-started)
- [Step-by-Step Run Instructions](#step-by-step-run-instructions)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           PM-AJAY Digital Platform                              │
├─────────────┬─────────────┬──────────────┬──────────────┬──────────────────────┤
│   Frontend  │   Backend   │  Blockchain  │   AI Models  │   Communication      │
│  (Next.js)  │ (Node/Fast) │  (Fabric)    │   (Python)   │  (WhatsApp/Chatbot)  │
│  Port:3000  │ Port:1604   │  Port:3002   │  Port:5000+  │     Port:3000        │
└─────────────┴─────────────┴──────────────┴──────────────┴──────────────────────┘
         │            │              │              │               │
         └────────────┴──────────────┴──────────────┴───────────────┘
                                     │
                              ┌──────┴──────┐
                              │   MongoDB   │
                              │  Port:27017 │
                              └─────────────┘
```

---

## 🛠️ Tech Stack

| Component | Technologies |
|-----------|--------------|
| **Frontend** | Next.js 14, React 18, TailwindCSS, TypeScript, Shepherd.js (guided tours) |
| **Backend (Main API)** | Node.js 18+, Express.js, MongoDB, Mongoose, JWT Auth |
| **Backend (Translation)** | FastAPI, Python 3.9+, Google Translate API (deep-translator) |
| **Blockchain** | Hyperledger Fabric 2.x, Spring Boot (Java 17), Docker |
| **AI/ML Models** | Python, XGBoost, Scikit-learn, LangChain, ChromaDB, RAG |
| **Chatbot** | Node.js, Twilio WhatsApp API, MongoDB, Tesseract OCR |
| **Video Conferencing** | Zego Cloud SDK |

---

## ✨ Features

### 🖥️ Frontend Dashboard

| Feature | Description |
|---------|-------------|
| **User Authentication** | Secure login/signup with role-based access (Ministry, PACC, State, SNA, IA, SAU) |
| **Dashboard Analytics** | Real-time KPIs with donut charts, time-series graphs, and India heatmap |
| **Proposal Management** | Create, track, and approve welfare proposals with multi-stage workflow |
| **Project Tracking** | Monitor milestones with visual tracker and evidence uploads |
| **Funds Management** | Track FTOs, PFMS confirmations, bank acknowledgments, and reconciliation |
| **Beneficiary Management** | View/filter beneficiaries with ranking scores and demographic data |
| **Evidence Repository** | Upload photos/documents with blockchain hash verification |
| **Reports Generation** | Generate PDF/Excel reports for audits and compliance |
| **SNA Dashboard** | State Nodal Agency view with account management |
| **PACC View** | Project Appraisal & Central Committee approval interface |
| **Multi-language Support** | 14+ Indian languages (Hindi, Bengali, Tamil, Telugu, etc.) |
| **Video Conferencing** | Built-in Zego meeting rooms for virtual discussions |
| **AI Chatbot** | Scheme FAQ assistant with context-aware responses |
| **Guided Tour** | Interactive onboarding with Shepherd.js |

### ⚙️ Backend APIs

#### Main Backend (Node.js/Express) - Port 1604
- User Management (Register, Login, Profile, OAuth)
- Proposal CRUD with approval workflow
- Project lifecycle with milestone tracking
- Utilization Certificate (UC) upload/verification
- Central ministry data aggregation
- Document hash verification

#### Translation API (FastAPI) - Port 8000
- Real-time translation for 14+ Indian regional languages
- Auto-detect source language
- Google Translate integration via deep-translator

### ⛓️ Blockchain (Hyperledger Fabric) - Port 3002

| Channel | Purpose | Organizations |
|---------|---------|---------------|
| **Approval** | Proposal & blueprint hashes | Ministry, PACC, State |
| **Funds** | FTO, PFMS, bank records | Ministry, State, SNA |
| **Implementation** | Beneficiary & evidence hashes | State, IA, SNA |
| **Audit** | Audit reports & UC hashes | SAU, State, Ministry |

**20 blockchain API endpoints** for hash storage and verification across 4 channels.

### 🤖 AI/ML Models

| Model | Purpose | Data Files |
|-------|---------|------------|
| **Beneficiary Ranking** | XGBoost priority scoring | `synthetic_beneficiaries.csv` (1.7MB), `trained_model.json` |
| **Question Clustering** | Grievance pattern analysis | `pm_ajay_final_simulated_data.csv`, `processed_issues_uuid.csv` |
| **State Plan RAG** | Document Q&A with LangChain | `input.json`, `input2.json` |

### 📱 WhatsApp Digital Khata Bot

- User registration with demographic collection
- Digital ledger for credits/debits
- Transaction categories: Income, Expense, Loans, Repayments, Savings
- OCR support for document scanning (Tesseract)
- Twilio WhatsApp integration

---

## 📁 Project Structure

```
SIHPS25152_FINAL/
│
├── frontend/                         # Next.js 14 Frontend (Port 3000)
│   ├── app/                          # App Router pages
│   │   ├── dashboard/                # Main dashboard with charts
│   │   ├── beneficiary/              # Beneficiary management
│   │   ├── funds/                    # FTO and fund tracking
│   │   ├── projects/                 # Project milestone tracking
│   │   ├── proposals/                # Proposal workflow
│   │   ├── reports/                  # Report generation
│   │   ├── sna/                      # State Nodal Agency view
│   │   ├── pacc/                     # PACC approval interface
│   │   ├── login/                    # Authentication
│   │   └── signup/                   # User registration
│   ├── components/                   # 36 reusable UI components
│   │   ├── chatbot.tsx               # AI assistant (28KB)
│   │   ├── sidebar.tsx               # Navigation (23KB)
│   │   ├── india-map-heatmap.tsx     # State visualization
│   │   └── ...
│   ├── lib/                          # Utilities and helpers
│   └── public/                       # Static assets
│
├── backend/                          # Main Backend (Port 1604)
│   ├── src/
│   │   ├── controllers/              # 7 request handlers
│   │   ├── models/                   # 10 MongoDB schemas
│   │   │   ├── beneficiary.model.js
│   │   │   ├── proposal.model.js
│   │   │   ├── project.model.js
│   │   │   ├── ngo.model.js
│   │   │   └── ...
│   │   ├── routes/                   # 6 API route files
│   │   └── middlewares/              # Auth & validation
│   ├── main.py                       # FastAPI Translation Server (Port 8000)
│   └── requirements.txt              # Python dependencies
│
├── app-backend/                      # Secondary MERN Backend
│   └── src/                          # Controllers, models, routes
│
├── blockchain/                       # Hyperledger Fabric (Port 3002)
│   ├── backend/                      # Node.js blockchain gateway
│   ├── backend-spring/               # Spring Boot API (Java 17)
│   ├── blockchain/                   # Chaincode & network config
│   │   ├── organizations/            # Org certificates
│   │   └── docker/                   # Docker compose files
│   ├── API_REFERENCE.md              # Complete API docs (20 endpoints)
│   └── commands.sh                   # Setup scripts
│
├── AI_Model/                         # Machine Learning Models
│   ├── Individual Beneficiary Ranking Model/
│   │   ├── 1_synthesize_data.py      # Generate training data
│   │   ├── 2_train_model.py          # Train XGBoost model
│   │   ├── 3_test_model.py           # Model testing
│   │   ├── 6_app.py                  # Flask API (Port 5000)
│   │   ├── synthetic_beneficiaries.csv   # 1.7MB training data
│   │   └── trained_model.json        # Trained XGBoost model
│   │
│   ├── Question Clustering/
│   │   ├── app.py                    # Clustering API
│   │   ├── clusters.py               # K-means implementation
│   │   └── pm_ajay_final_simulated_data.csv
│   │
│   └── State Plan Analysis RAG/
│       ├── main.py                   # RAG entry point
│       ├── rag_system.py             # LangChain RAG implementation
│       ├── analysis agent.py         # Document analysis
│       └── tools.py                  # Utility functions
│
├── WHATSAPP/                         # WhatsApp Khata Bot (Port 3000)
│   ├── src/
│   │   ├── controllers/              # Message handlers
│   │   ├── models/                   # User & Khata schemas
│   │   └── services/                 # Business logic
│   ├── config/                       # Twilio configuration
│   ├── eng.traineddata               # English OCR (5.2MB)
│   └── hin.traineddata               # Hindi OCR (1.6MB)
│
├── pmajay-chatbot/                   # Additional Chatbot Service
│   └── chatbot_backend/
│       └── chroma_db/                # Vector database for RAG
│
├── .gitignore                        # Excludes venv, node_modules, large files
└── README.md                         # This file
```

---

## 📊 Data Files

### AI Model Training Data

| File | Location | Size | Description |
|------|----------|------|-------------|
| `synthetic_beneficiaries.csv` | `AI_Model/Individual Beneficiary Ranking Model/` | 1.7 MB | 10,000+ synthetic beneficiary records for training |
| `location dataset.csv` | `AI_Model/Individual Beneficiary Ranking Model/` | 4 KB | State/district location mappings |
| `trained_model.json` | `AI_Model/Individual Beneficiary Ranking Model/` | 620 KB | Trained XGBoost model weights |
| `preprocessor.joblib` | `AI_Model/Individual Beneficiary Ranking Model/` | 4 KB | Sklearn preprocessing pipeline |
| `pm_ajay_final_simulated_data.csv` | `AI_Model/Question Clustering/` | 100 KB | Simulated grievance/issue data |
| `processed_issues_uuid.csv` | `AI_Model/Question Clustering/` | 45 KB | Processed issues with UUIDs |
| `input.json` | `AI_Model/State Plan Analysis RAG/` | 3.6 KB | Sample state plan input |
| `input2.json` | `AI_Model/State Plan Analysis RAG/` | 5 KB | Additional plan data |

### OCR Training Data (WhatsApp Bot)

| File | Size | Description |
|------|------|-------------|
| `eng.traineddata` | 5.2 MB | Tesseract English OCR model |
| `hin.traineddata` | 1.6 MB | Tesseract Hindi OCR model |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | v18+ | Backend & Frontend |
| **Python** | 3.9+ | AI Models & Translation API |
| **MongoDB** | 6.0+ | Database |
| **Docker** | 24.0+ | Blockchain network |
| **Java** | 17+ | Spring Boot blockchain API |
| **pnpm** or **npm** | Latest | Package management |

### Quick Install Check

```bash
node --version    # Should be v18+
python --version  # Should be 3.9+
mongod --version  # Should be 6.0+
docker --version  # Should be 24.0+
java --version    # Should be 17+
```

---

## 📝 Step-by-Step Run Instructions

### Method 1: Run Core Services Only (Recommended for Quick Start)

Open **4 terminal windows** and run each command in sequence:

#### Terminal 1: Start MongoDB
```bash
# Windows
mongod

# macOS/Linux
sudo mongod --dbpath /data/db
```

#### Terminal 2: Start Main Backend (Port 1604)
```bash
cd backend
npm install
npm run dev
```
> ✅ Expected output: `Server is running on http://localhost:1604`

#### Terminal 3: Start Translation API (Port 8000)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
> ✅ Expected output: `Uvicorn running on http://0.0.0.0:8000`

#### Terminal 4: Start Frontend (Port 3000)
```bash
cd frontend
npm install    # or pnpm install
npm run dev    # or pnpm dev
```
> ✅ Expected output: `Ready on http://localhost:3000`

#### Access the Application
Open your browser and go to: **http://localhost:3000**

---

### Method 2: Run All Services (Full Platform)

#### Step 1: Start MongoDB
```bash
mongod
```

#### Step 2: Start Main Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:1604
```

#### Step 3: Start Translation API
```bash
cd backend
pip install -r requirements.txt
python main.py
# Runs on http://localhost:8000
```

#### Step 4: Start Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

#### Step 5: Start Blockchain Backend (Choose One)

**Option A: Spring Boot (Recommended)**
```bash
cd blockchain/backend-spring
./mvnw spring-boot:run    # Linux/macOS
mvnw.cmd spring-boot:run  # Windows
# Runs on http://localhost:3002
```

**Option B: Node.js**
```bash
cd blockchain/backend
npm install
npm start
# Runs on http://localhost:3002
```

#### Step 6: Start WhatsApp Bot (Optional)
```bash
cd WHATSAPP
npm install
npm run dev
# Runs on http://localhost:3000 (use different port if frontend is running)
```

> ⚠️ **Note**: For WhatsApp bot to work, you need ngrok and Twilio credentials configured.

#### Step 7: Run AI Models (Optional)

**Beneficiary Ranking API (Port 5000):**
```bash
cd "AI_Model/Individual Beneficiary Ranking Model"
pip install flask pandas xgboost scikit-learn joblib
python 6_app.py
```

**Question Clustering:**
```bash
cd "AI_Model/Question Clustering"
pip install flask pandas scikit-learn
python app.py
```

**State Plan RAG:**
```bash
cd "AI_Model/State Plan Analysis RAG"
pip install langchain chromadb openai
python main.py
```

---

### Method 3: Using Docker (Coming Soon)

```bash
# docker-compose.yml will be added for one-command startup
docker-compose up -d
```

---

## 🔐 Environment Variables

Create `.env` files in each directory:

### `frontend/.env`
```env
NEXT_PUBLIC_API_URL=http://localhost:1604
NEXT_PUBLIC_TRANSLATION_API=http://localhost:8000
NEXT_PUBLIC_BLOCKCHAIN_API=http://localhost:3002
```

### `backend/.env`
```env
PORT=1604
MONGODB_URI=mongodb://localhost:27017/pmajay
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_super_secret_jwt_key_here
```

### `WHATSAPP/.env`
```env
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
MONGODB_URI=mongodb://localhost:27017/whatsapp_khata
PORT=3001
```

### `blockchain/backend-spring/application.properties`
```properties
server.port=3002
```

---

## 📚 API Documentation

### Quick API Reference

| Service | Port | Base URL | Health Check |
|---------|------|----------|--------------|
| Frontend | 3000 | http://localhost:3000 | Browser |
| Main Backend | 1604 | http://localhost:1604/api | `/api/health` |
| Translation API | 8000 | http://localhost:8000 | `/health` |
| Blockchain API | 3002 | http://localhost:3002 | `/health` |

### Main Backend Endpoints

```
POST   /api/users/register     - Register new user
POST   /api/users/login        - User authentication
GET    /api/proposals          - Get all proposals
POST   /api/proposals          - Create new proposal
GET    /api/projects           - Get all projects
POST   /api/projects           - Create new project
GET    /api/central            - Get central dashboard data
POST   /api/uc/upload          - Upload utilization certificate
GET    /api/health             - Health check
```

### Translation API Endpoints

```
POST   /translate              - Translate text between languages
GET    /languages              - Get supported languages list
GET    /health                 - Health check
```

### Blockchain API Endpoints

See [blockchain/API_REFERENCE.md](blockchain/API_REFERENCE.md) for complete documentation of 20 endpoints.

---

## 🧪 Quick Verification

After starting all services, run these commands to verify:

```bash
# Check main backend
curl http://localhost:1604/api/health
# Expected: {"status":"ok","message":"Backend is running","port":"1604"}

# Check translation API
curl http://localhost:8000/health
# Expected: {"status":"healthy","provider":"Google Translate"}

# Check blockchain API
curl http://localhost:3002/health
# Expected: {"status":"UP"}

# Test translation
curl -X POST http://localhost:8000/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, how are you?","source_lang":"en","target_lang":"hi"}'
```

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `EADDRINUSE: address already in use` | Kill process on that port: `npx kill-port 3000` |
| `MongoDB connection failed` | Ensure MongoDB is running: `mongod` |
| `Module not found` | Run `npm install` or `pip install -r requirements.txt` |
| `CORS error` | Check `CORS_ORIGIN` in backend `.env` matches frontend URL |
| `Port 3000 conflict (WhatsApp vs Frontend)` | Change WhatsApp port to 3001 in its `.env` |

### Windows-Specific

```powershell
# Kill process on port
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Run Python scripts
python main.py  # Not python3
```

### macOS/Linux-Specific

```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9

# Run Python scripts
python3 main.py
```

---

## 👥 Access Roles

| Role | Permissions |
|------|-------------|
| **Ministry** | Full access, fund release approval, audit oversight |
| **PACC** | Proposal approval, blueprint review |
| **State** | State-level project implementation, UC submission |
| **SNA** | Fund tracking, bank account management |
| **IA (Implementing Agency)** | Evidence upload, milestone updates |
| **SAU (State Audit Unit)** | Audit reports, corrective actions |
| **Beneficiary** | View benefits, raise issues via WhatsApp |

---

## 📄 License

ISC License

---

## 🙏 Acknowledgments

Built for **Smart India Hackathon 2025** to digitize and streamline the PM-AJAY scheme for efficient welfare fund distribution to Scheduled Caste beneficiaries.

**Problem Statement ID**: SIH PS 25152

---

## 🔗 Links

- **GitHub**: [https://github.com/codewithabhay10/SIH-Project-Sahay](https://github.com/codewithabhay10/SIH-Project-Sahay)
- **Smart India Hackathon**: [https://www.sih.gov.in/](https://www.sih.gov.in/)

---

Made with ❤️ for Digital India 🇮🇳
