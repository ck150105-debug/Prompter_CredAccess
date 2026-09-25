# CredAccess — Unlocking Credit for the Unbanked

🌐 Live Demo

👉 Open https://ck150105-debug.github.io/Prompter_CredAccess/

Frontend: GitHub Pages
Backend: Render
Status: 🟢 Live

> **Fintech Financial Eligibility & Pre-Screening Platform for Gig Workers and Informal Economy Professionals**

CredAccess is an end-to-end prototype designed to unlock formal credit access for gig economy workers (rideshare drivers, delivery riders, freelance technicians) and small micro-vendors who lack traditional payslips, employer letters, or CIBIL/bureau credit scores.

The platform enables gig workers to:
1. Authenticate and create a secure profile.
2. Complete a financial profile with mandatory asset collateral registration.
3. Authenticate gig employment through platform-specific Work IDs verified against mock partner databases (Uber, Rapido, Swiggy, Zomato, Ola, Dunzo, Porter, Urban Company).
4. Aggregate verified multi-platform gig earnings.
5. Ingest and parse bank statements to extract living expenses and debt obligations.
6. Calculate monthly savings and track 10–12 months of financial history.
7. Evaluate eligibility against the CredAccess **30% savings threshold** and stability criteria.
8. Generate a tamper-evident digital financial verification certificate complete with a cryptographic SHA-256 seal and QR code.

---

## 📑 Table of Contents

- [System Prerequisites](#-system-prerequisites)
- [Quick Start (One-Click Launchers)](#-quick-start-one-click-launchers-windows)
- [Complete Installation Guide](#-complete-installation-guide)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [How to Run the Application](#-how-to-run-the-application)
  - [Mode A: Unified Full-Stack Mode (Recommended)](#mode-a-unified-full-stack-mode-recommended)
  - [Mode B: Hot-Reload Development Mode](#mode-b-hot-reload-development-mode-frontend--backend)
- [Evaluation Personas & Testing Flows](#-evaluation-personas--testing-flows)
  - [Test User 1 — Arun Kumar (Eligible)](#persona-1--arun-kumar-eligible-)
  - [Test User 2 — Ravi (Not Eligible)](#persona-2--ravi-not-eligible-)
  - [Brand-New User Registration Flow](#persona-3--brand-new-user-registration-flow)
- [Mock Gig Platform Test IDs](#-mock-gig-platform-test-ids)
- [Sample Bank Statements](#-sample-bank-statements)
- [Automated Integration Tests](#-automated-integration-tests)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 💻 System Prerequisites

Ensure you have the following installed on your system:

| Dependency | Minimum Version | Verified Working Version | Check Command |
|---|---|---|---|
| **Python** | 3.10+ | 3.13.x | `python --version` |
| **Node.js** | 18+ | 20.18.x | `node -v` |
| **npm** | 9+ | 10.8.x | `npm -v` |

---

## ⚡ Quick Start (One-Click Launchers for Windows)

If you are on Windows, you can launch the application directly using the included launcher scripts in the repository root:

- **Unified Full-Stack App (Single Port 8000):**  
  Double-click `run_app.bat`  
  *Builds the frontend if needed and launches FastAPI serving both the UI and API at [http://127.0.0.1:8000](http://127.0.0.1:8000).*

- **Dual Development Servers (Hot Reloading on 5173 + 8000):**  
  Double-click `run_dev.bat`  
  *Opens two separate command windows for Vite (`localhost:5173`) and FastAPI (`127.0.0.1:8000`).*

---

## 🛠️ Complete Installation Guide

Follow these manual steps to install all dependencies from scratch.

### 1. Backend Setup

1. Open your terminal and navigate to the project root:
   ```bash
   cd credaccess
   ```

2. *(Recommended)* Create and activate a Python virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (Command Prompt):**
     ```cmd
     python -m venv venv
     venv\Scripts\activate.bat
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install the required Python backend packages:
   ```bash
   pip install -r requirements.txt
   ```
   *Dependencies installed: `fastapi`, `uvicorn[standard]`, `pydantic`, `pandas`, `numpy`, and `python-multipart`.*

### 2. Frontend Setup

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install the Node.js packages:
   ```bash
   npm install
   ```
   *Dependencies installed: `react`, `react-dom`, `recharts`, `lucide-react`, `tailwindcss`, and `vite`.*

---

## 🚀 How to Run the Application

### Mode A: Unified Full-Stack Mode (Recommended)

In this mode, FastAPI serves the pre-compiled React frontend SPA alongside all API endpoints on port `8000`. You only need one terminal.

1. **Build the React frontend:**
   ```bash
   cd credaccess/frontend
   npm run build
   ```

2. **Start the FastAPI server:**
   ```bash
   cd ../backend
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```

3. **Open the application:**
   - **Web Application:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
   - **Interactive API Docs (Swagger UI):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - **Alternative ReDoc Documentation:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

### Mode B: Hot-Reload Development Mode (Frontend + Backend)

If you are developing or modifying UI components, run both servers concurrently for instant hot module reloading (HMR).

**Terminal 1 — Backend API Server:**
```bash
cd credaccess/backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend runs on `http://127.0.0.1:8000`.*

**Terminal 2 — Frontend Dev Server:**
```bash
cd credaccess/frontend
npm run dev
```
*Frontend runs on `http://localhost:5173` (proxies API requests to port `8000`).*

---

## 🧪 Evaluation Personas & Testing Flows

CredAccess separates **Demo Evaluation Personas** from the **Normal New User Flow** to facilitate evaluation while maintaining data integrity.

### Persona 1 — Arun Kumar (Eligible ✓)
- **Profile:** Multi-platform gig driver (Uber + Rapido).
- **Collateral:** Two-Wheeler vehicle valued at ₹65,000.
- **Financial Profile:** ~₹45,500 average monthly income, ~₹29,400 monthly expenses.
- **Savings Ratio:** **35.4%** (exceeds the 30.0% mandatory threshold).
- **Result:**
  - Status: **Eligible for Loans**
  - **Financial Verification Certificate:** Fully unlocked and available with digital QR code and SHA-256 seal.
- **How to test:** Click **"TEST USER 1 — ELIGIBLE (Arun Kumar)"** on the landing page or use the demo dropdown in the top navbar.

---

### Persona 2 — Ravi (Not Eligible ⚠)
- **Profile:** Food delivery professional (Swiggy).
- **Collateral:** Gold ornaments valued at ₹40,000.
- **Financial Profile:** ~₹30,500 average monthly income, ~₹23,850 monthly expenses.
- **Savings Ratio:** **21.8%** (below the 30.0% threshold).
- **Result:**
  - Status: **Not Eligible**
  - Displays a savings deficit warning card and financial improvement recommendations.
  - Certificate generation button is locked.
- **How to test:** Click **"TEST USER 2 — NOT ELIGIBLE (Ravi)"** on the landing page or switch via the top navbar.

---

### Persona 3 — Brand-New User Registration Flow
To evaluate a fresh, unbanked applicant journey:

1. On the landing page, select **"Create Account"** on the right-hand card.
2. Enter a new email address and password (e.g., `applicant@example.com` / `pass123`).
3. The registration form opens **100% blank** (no auto-filled demo values).
4. Fill in the required 11-point profile:
   1. **Full Name**
   2. **Email ID** (read-only from authentication)
   3. **Phone Number**
   4. **Permanent Address**
   5. **Current Address** (with "Same as permanent" shortcut)
   6. **Collateral (Yes/No):**
      - *Rule:* Selecting "No" displays an explicit warning and prevents submission. Collateral is strictly required.
   7. **Collateral Type & Value** (e.g., Vehicle, Gold, Property)
   8. **Work / Gig Platforms** (Select one or more: Uber, Rapido, Swiggy, etc.)
   9. **Work ID:** Dynamic inputs appear for each selected platform with platform format examples (`Example: UB10001`). Enter valid test IDs.
   10. **Working Experience** (Years and Months)
   11. **Working As** (Primary role description)
5. Click **"Verify Employment & Continue"**:
   - The verification modal checks each Work ID against the mock partner database.
   - Shows green verified checkmarks when valid.
6. **Dashboard:**
   - Review the verified multi-platform earnings history.
   - Upload bank statements (`sample_statements/sample_bank_statement.csv`).
   - Observe automatic debit categorization (Fuel, Vehicle Maintenance, Rent, Utilities, Food).
   - View computed savings ratio, stability ratings, and loan eligibility assessment.

---

## 🔑 Mock Gig Platform Test IDs

When testing the registration flow or employment verification modal, use these pre-configured mock platform IDs:

| Platform | Valid Mock Work ID | Worker Name Simulated |
|---|---|---|
| **Uber** | `UB10001` or `UB10482` | Arun Kumar |
| **Rapido** | `RP10001` or `RP10234` | Arun Kumar |
| **Swiggy** | `SW10001` or `SW99214` | Ravi |
| **Zomato** | `ZO10001` or `ZO11234` | Priya Sharma |
| **Ola** | `OL10001` or `OL10342` | Suresh Babu |
| **Dunzo** | `DU10001` | Mohammed Imran |
| **Porter** | `PO10001` | Rajesh Verma |
| **Urban Company** | `UC10001` | Sunita Devi |

*Entering any other ID (e.g., `UB99999`) simulates a verification failure, displaying an error prompting the user to correct their ID.*

---

## 📄 Sample Bank Statements

A pre-formatted bank statement is included in the repository for upload testing:

- **Location:** `sample_statements/sample_bank_statement.csv`
- **Usage:** In the Dashboard under **"Upload Bank Statement"**, drag and drop or browse to `sample_bank_statement.csv`.
- **Parser capabilities:** Automatically detects column headers (`Date`, `Description`, `Withdrawals / Debits`, `Balance`), categorizes expenditure into financial buckets, and updates 12-month net savings.

---

## 🔬 Automated Integration Tests

To run the automated end-to-end integration test suite:

1. Ensure the FastAPI backend is running on `http://127.0.0.1:8000`.
2. Open a separate terminal and run:
   ```bash
   python test_full_workflow.py
   ```
   *This automated test verifies:*
   - New user registration.
   - Rejection when `has_collateral = False`.
   - Rejection of invalid Work IDs.
   - Acceptance and verification of valid Work IDs.
   - Profile creation, income synthesis, statement processing, and certificate generation.

---

## 🏗️ Project Architecture & Directory Structure

```
credaccess/
├── backend/
│   ├── main.py                   # FastAPI application, routing, static SPA mounting
│   ├── database.py               # SQLite storage, schema init & demo user seeding
│   ├── models.py                 # Pydantic v2 schemas and validation models
│   ├── mock_gig_db.py            # Simulated partner APIs (Uber, Swiggy, Rapido, etc.)
│   ├── statement_parser.py       # Bank statement CSV parser & transaction categorizer
│   ├── financial_engine.py       # 30% savings threshold, CV stability & metrics
│   ├── certificate_generator.py  # SHA-256 seal & digital certificate generator
│   ├── requirements.txt          # Python dependencies
│   └── credaccess.db             # Local SQLite database (auto-generated on startup)
├── frontend/
│   ├── src/
│   │   ├── api.js                # REST API client with Bearer token authentication
│   │   ├── App.jsx               # Root layout, authentication state & view router
│   │   ├── components/
│   │   │   ├── LandingPage.jsx   # Landing page with auth & collateral notice box
│   │   │   ├── RegistrationForm.jsx # 11-point financial & collateral profile form
│   │   │   ├── WorkVerificationModal.jsx # Mock database employment verification
│   │   │   ├── Dashboard.jsx     # Overview, summary metrics, charts, statement uploader
│   │   │   ├── LoanEligibilityPage.jsx # Eligibility assessment & criteria checklist
│   │   │   ├── FinancialPortfolioView.jsx # Printable dossier & breakdown
│   │   │   ├── CertificateView.jsx # Digitally signed certificate with QR code
│   │   │   ├── DocumentsPage.jsx # Secure document repository
│   │   │   ├── ProfilePage.jsx   # Profile management & verified badges
│   │   │   └── Navbar.jsx        # Navigation header with demo persona switcher
│   │   ├── index.css             # Tailwind CSS directives & custom styling
│   │   └── main.jsx              # React DOM entry point
│   ├── dist/                     # Compiled production build assets
│   ├── package.json              # Node.js dependencies and build scripts
│   └── vite.config.js            # Vite bundler configuration & backend proxy
├── sample_statements/
│   └── sample_bank_statement.csv # Test CSV bank statement with categorized debits
├── requirements.txt              # Root Python dependencies file
├── run_app.bat                   # 1-click Windows launcher (Unified full-stack server)
├── run_dev.bat                   # 1-click Windows launcher (Dual hot-reloading servers)
├── test_verification.py          # Quick sanity test script
├── test_full_workflow.py         # End-to-end integration test suite
└── README.md                     # Comprehensive project documentation
```

---

## ❓ Troubleshooting & FAQs

### 1. `Port 8000 is already in use`
If port 8000 is occupied by another process:
- **Windows:** Check and terminate the process holding port 8000:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force
  ```
- Or run Uvicorn on a different port:
  ```bash
  python -m uvicorn main:app --host 127.0.0.1 --port 8080 --reload
  ```

### 2. How do I reset all data to a clean initial state?
Simply delete the SQLite database file in `backend/credaccess.db` while the server is stopped:
```bash
# Windows
del backend\credaccess.db
# Linux / macOS
rm backend/credaccess.db
```
When you next start the server, `database.py` will automatically recreate the database and re-seed the default evaluation personas (`Arun Kumar` and `Ravi`).

### 3. `Execution of scripts is disabled on this system` in PowerShell
If PowerShell prevents activating the Python virtual environment:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1
```

### 4. Frontend changes are not showing in Unified Mode (`http://127.0.0.1:8000`)
In Unified Mode, FastAPI serves the compiled files from `frontend/dist`. Whenever you make changes to React components, remember to rebuild the frontend:
```bash
cd frontend
npm run build
```
*(Alternatively, use `run_dev.bat` or `npm run dev` for automatic hot-reloading during development).*

---

## ⚖️ License & Hackathon Notice

This project is an evaluation prototype developed for hackathon demonstration. Gig platform APIs, bank integration interfaces, and worker databases are simulated via local mock data engines to ensure safe, repeatable, and offline-compatible evaluation.
