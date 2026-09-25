"""
CredAccess - FastAPI Backend API
Powers the complete gig-worker financial verification, statement parsing,
12-month financial history, loan eligibility evaluation, and digital certificate generation.
"""
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict, Any
import json
import os
import shutil

from models import (
    UserAuthRegister, UserAuthLogin, UserResponse,
    ProfileCreateRequest, WorkVerificationRequest, WorkVerificationResponse,
    VerificationResultItem, MonthlyFinancialRecordItem, FinancialSummaryResponse,
    LoanEligibilityResponse, CertificateResponse, DocumentItem
)
from mock_gig_db import (
    verify_platform_worker, get_supported_platforms_list,
    get_platform_earnings_history, mask_work_id, MONTHS, GIG_PLATFORM_RECORDS
)
from statement_parser import parse_bank_statement_content, generate_simulated_statement
from financial_engine import (
    calculate_monthly_metrics, calculate_portfolio_summary,
    evaluate_loan_eligibility, calculate_income_stability
)
from certificate_generator import generate_verification_certificate
import database as db

app = FastAPI(
    title="CredAccess API",
    description="Financial Eligibility and Micro-Loan Portfolio Platform for Gig Workers",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB and Seed demo users on startup
@app.on_event("startup")
def startup_event():
    db.init_db()
    db.seed_demo_users()
    print("CredAccess Database initialized & seeded with Arun Kumar (Eligible) and Ravi (Not Eligible).")

# Helper to extract user_id from Authorization header
def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        user = db.get_user_by_id(token)
        if user:
            return token
    raise HTTPException(status_code=401, detail="Authentication required. Please sign in.")

# ==========================================
# AUTHENTICATION & DEMO SWITCHER
# ==========================================

@app.post("/api/auth/register", response_model=UserResponse)
def register(payload: UserAuthRegister):
    raw_email = payload.email or payload.username
    if not raw_email or not raw_email.strip():
        raise HTTPException(status_code=400, detail="Email ID is required.")
    clean_email = raw_email.strip().lower()
    existing = db.get_user_by_email(clean_email)
    if existing:
        raise HTTPException(status_code=400, detail="An account already exists with this email. Please sign in.")

    # Simple password check
    if payload.confirm_password and payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    user_id = db.create_user(clean_email, payload.password)
    return UserResponse(
        id=user_id,
        email=clean_email,
        username=clean_email,
        full_name=None,
        profile_completed=False,
        token=user_id
    )

@app.post("/api/auth/login", response_model=UserResponse)
def login(payload: UserAuthLogin):
    raw_email = payload.email or payload.username
    if not raw_email or not raw_email.strip():
        raise HTTPException(status_code=400, detail="Email ID is required.")
    clean_email = raw_email.strip().lower()
    user = db.get_user_by_email(clean_email)
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email. Please create an account.")

    if user["password_hash"] != payload.password:
        raise HTTPException(status_code=401, detail="Incorrect password. Please try again.")

    user_email = user.get("email") or user.get("username") or clean_email
    return UserResponse(
        id=user["id"],
        email=user_email,
        username=user_email,
        full_name=user["full_name"],
        profile_completed=bool(user["profile_completed"]),
        token=user["id"]
    )

@app.post("/api/auth/logout")
def logout():
    return {"status": "success", "message": "Successfully logged out."}

@app.get("/api/auth/me", response_model=UserResponse)
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    user = db.get_user_by_id(token)
    if not user:
        raise HTTPException(status_code=401, detail="User session not found")
    user_email = user.get("email") or user.get("username") or ""
    return UserResponse(
        id=user["id"],
        email=user_email,
        username=user_email,
        full_name=user.get("full_name"),
        profile_completed=bool(user.get("profile_completed")),
        token=user["id"]
    )

@app.post("/api/demo/switch")
def switch_demo_user(mode: str = Form(...)):
    """
    Demo helper:
    'arun' -> Arun Kumar (Eligible, 35% savings)
    'ravi' -> Ravi (Not Eligible, 21.8% savings)
    'fresh' -> Fresh test user with no profile completed
    """
    if mode == "arun":
        db.seed_demo_users(force=True)
        user = db.get_user_by_id("user_arun_kumar_01")
        return {"status": "success", "user_id": user["id"], "name": "Arun Kumar", "email": "arun.demo@credaccess.test", "profile_completed": True, "expected_result": "Eligible"}
    elif mode == "ravi":
        db.seed_demo_users(force=True)
        user = db.get_user_by_id("user_ravi_swiggy_02")
        return {"status": "success", "user_id": user["id"], "name": "Ravi", "email": "ravi.demo@credaccess.test", "profile_completed": True, "expected_result": "Not Eligible"}
    elif mode == "fresh":
        # Create or reset fresh user
        fresh_email = "fresh.worker@credaccess.test"
        user = db.get_user_by_email(fresh_email)
        if not user:
            user_id = db.create_user(fresh_email, "demo123", None)
        else:
            user_id = user["id"]
            # Reset profile & records for fresh walk-through
            conn = db.get_db_connection()
            c = conn.cursor()
            c.execute("DELETE FROM profiles WHERE user_id = ?", (user_id,))
            c.execute("DELETE FROM verifications WHERE user_id = ?", (user_id,))
            c.execute("DELETE FROM monthly_records WHERE user_id = ?", (user_id,))
            c.execute("DELETE FROM certificates WHERE user_id = ?", (user_id,))
            c.execute("DELETE FROM documents WHERE user_id = ?", (user_id,))
            c.execute("UPDATE users SET profile_completed = 0, full_name = NULL WHERE id = ?", (user_id,))
            # Recreate empty profile as per database rule
            now_str = datetime.now().isoformat()
            c.execute("""
            INSERT INTO profiles (
                user_id, email, full_name, phone_number, permanent_address, current_address,
                same_as_permanent, has_collateral, collateral_type, collateral_other,
                collateral_value, working_experience_years, working_experience_months,
                working_as, consent_authorized, selected_platforms_json, updated_at
            ) VALUES (
                ?, ?, NULL, NULL, NULL, NULL,
                0, 0, NULL, NULL,
                0.0, 0, 0,
                NULL, 0, '[]', ?
            )
            """, (user_id, fresh_email, now_str))
            conn.commit()
            conn.close()

        return {"status": "success", "user_id": user_id, "name": None, "email": fresh_email, "profile_completed": False, "expected_result": "New Registration Flow"}
    else:
        raise HTTPException(status_code=400, detail="Unknown demo mode")

# ==========================================
# GIG PLATFORM & VERIFICATION APIS
# ==========================================

@app.get("/api/gig/platforms")
def list_platforms():
    """Lists supported gig platforms and demo test IDs"""
    return get_supported_platforms_list()

@app.post("/api/gig/verify", response_model=WorkVerificationResponse)
def verify_platforms(payload: WorkVerificationRequest, user_id: str = Depends(get_current_user_id)):
    """
    Verifies entered Work IDs against the mock databases of selected gig platforms.
    Enforces that each platform is checked and valid.
    """
    results: List[VerificationResultItem] = []
    all_verified = True

    if not payload.platforms:
        raise HTTPException(status_code=400, detail="Please select at least one gig platform.")

    for item in payload.platforms:
        v_res = verify_platform_worker(item.platform, item.work_id)
        if not v_res["is_verified"]:
            all_verified = False

        results.append(VerificationResultItem(
            platform=v_res["platform"],
            work_id=v_res["work_id"],
            masked_work_id=v_res["masked_work_id"],
            worker_name=v_res.get("worker_name"),
            status=v_res["status"],
            is_verified=v_res["is_verified"],
            message=v_res["message"],
            joining_date=v_res.get("joining_date")
        ))

    # Persist in DB
    db.save_verification_results(user_id, [r.dict() for r in results])

    if all_verified:
        message = "All gig platform employment IDs verified successfully ✓"
    else:
        failed = [r.platform for r in results if not r.is_verified]
        message = f"Employment verification failed for: {', '.join(failed)}. Please verify Work IDs."

    return WorkVerificationResponse(
        all_verified=all_verified,
        results=results,
        message=message
    )

# ==========================================
# PROFILE & REGISTRATION
# ==========================================

@app.post("/api/profile")
def create_or_update_profile(payload: ProfileCreateRequest, user_id: str = Depends(get_current_user_id)):
    """
    Mandatory Business Rule Enforcements:
    Rule 1: Collateral is mandatory. If has_collateral == False, reject!
    Rule 2: Consent authorization is mandatory.
    Rule 3: Platforms must be provided.
    """
    if not payload.has_collateral:
        raise HTTPException(
            status_code=400,
            detail="Collateral is mandatory to proceed with the CredAccess micro-loan eligibility assessment."
        )

    if not payload.consent_authorized:
        raise HTTPException(
            status_code=400,
            detail="Consent authorization is required to process your financial portfolio."
        )

    if not payload.selected_platforms:
        raise HTTPException(
            status_code=400,
            detail="Please specify at least one gig platform."
        )

    # Save profile to DB
    profile_data = payload.dict()
    db.save_profile(user_id, profile_data)

    # Automatically generate initial monthly income records from verified platforms if none exist
    existing_records = db.get_monthly_records(user_id)
    if not existing_records:
        # Pre-seed income records from the selected platforms
        for m in MONTHS:
            total_inc = 0.0
            breakdown = {}
            for p in payload.selected_platforms:
                hist = get_platform_earnings_history(p.platform, p.work_id)
                earn = hist.get(m, 22000.0)
                breakdown[p.platform] = earn
                total_inc += earn

            # If user hasn't uploaded statement yet, mark statement_status = "Incomplete"
            db.save_monthly_record(
                user_id=user_id,
                month=m,
                year=2025,
                income=total_inc,
                expenses=0.0,
                savings=0.0,
                savings_pct=0.0,
                stmt_data={"status": "Pending Upload"},
                breakdown=breakdown
            )

    return {"status": "success", "message": "Profile created and verified successfully."}

@app.get("/api/profile")
def get_profile(user_id: str = Depends(get_current_user_id)):
    profile = db.get_profile_by_user_id(user_id)
    verifications = db.get_verifications(user_id)
    user = db.get_user_by_id(user_id)
    return {
        "user": user,
        "profile": profile,
        "verifications": verifications
    }

# ==========================================
# INCOME & STATEMENT UPLOAD
# ==========================================

@app.get("/api/income")
def get_income_overview(user_id: str = Depends(get_current_user_id)):
    records = db.get_monthly_records(user_id)
    if not records:
        return []

    res = []
    for r in records:
        res.append({
            "month": r["month"],
            "year": r["year"],
            "total_income": r["income"],
            "platforms": r.get("platform_breakdown", {})
        })
    return res

@app.post("/api/statements/upload")
async def upload_bank_statement(
    month: str = Form(...),
    year: int = Form(2025),
    file: Optional[UploadFile] = File(None),
    user_id: str = Depends(get_current_user_id)
):
    """
    Accepts CSV or PDF bank statement.
    Calculates debits, monthly expenses, recurring expenses, and savings rate.
    """
    # Find existing record to know verified gig income for this month
    records = db.get_monthly_records(user_id)
    month_record = next((r for r in records if r["month"].lower() == month.lower()), None)
    verified_income = month_record["income"] if month_record else 42000.0
    breakdown = month_record.get("platform_breakdown", {"Gig Work": verified_income}) if month_record else {"Gig Work": verified_income}

    content_bytes = b""
    filename = "manual_statement.csv"
    if file:
        content_bytes = await file.read()
        filename = file.filename

    analysis = parse_bank_statement_content(content_bytes, filename, month, year, verified_income)
    
    # Update monthly record in DB
    savings = analysis["monthly_savings"]
    savings_pct = analysis["savings_percentage"]
    expenses = analysis["monthly_expenses"]

    db.save_monthly_record(
        user_id=user_id,
        month=month,
        year=year,
        income=verified_income,
        expenses=expenses,
        savings=savings,
        savings_pct=savings_pct,
        stmt_data=analysis,
        breakdown=breakdown
    )

    return {
        "status": "success",
        "message": f"Bank statement for {month} {year} analyzed successfully.",
        "analysis": analysis
    }

@app.post("/api/statements/simulate-all")
def simulate_all_statements(
    savings_rate_target: float = Form(0.35),
    user_id: str = Depends(get_current_user_id)
):
    """
    Demo shortcut: Simulates 12 months of bank statement uploads for judges
    so they can see the complete 12-month maturity immediately without manual file upload.
    """
    records = db.get_monthly_records(user_id)
    if not records:
        # Create base records first
        for m in MONTHS:
            db.save_monthly_record(
                user_id=user_id,
                month=m,
                year=2025,
                income=42000.0,
                expenses=0.0,
                savings=0.0,
                savings_pct=0.0,
                stmt_data={"status": "Pending Upload"},
                breakdown={"Gig Platform": 42000.0}
            )
        records = db.get_monthly_records(user_id)

    for r in records:
        m = r["month"]
        inc = r["income"] or 40000.0
        stmt = generate_simulated_statement(m, 2025, inc, savings_rate_target=savings_rate_target)
        savings, savings_pct, _ = calculate_monthly_metrics(inc, stmt["monthly_expenses"])
        db.save_monthly_record(
            user_id=user_id,
            month=m,
            year=2025,
            income=inc,
            expenses=stmt["monthly_expenses"],
            savings=savings,
            savings_pct=savings_pct,
            stmt_data=stmt,
            breakdown=r.get("platform_breakdown", {"Gig Platform": inc})
        )

    return {"status": "success", "message": "12-Month statements populated with verified expenses and savings."}

# ==========================================
# FINANCIAL METRICS & SUMMARY
# ==========================================

@app.get("/api/financial/summary", response_model=FinancialSummaryResponse)
def get_financial_summary(user_id: str = Depends(get_current_user_id)):
    records = db.get_monthly_records(user_id)
    summary = calculate_portfolio_summary(records)

    monthly_history = []
    platform_breakdown = []

    for r in records:
        meets_goal = (r.get("savings_percentage") or 0.0) >= 30.0
        monthly_history.append(MonthlyFinancialRecordItem(
            month=r["month"],
            year=r["year"],
            income=r.get("income", 0.0),
            expenses=r.get("expenses", 0.0),
            savings=r.get("savings", 0.0),
            savings_percentage=r.get("savings_percentage", 0.0),
            statement_status=r.get("statement_status", "Incomplete"),
            meets_savings_goal=meets_goal
        ))

        # Compile platform overview
        if r.get("platform_breakdown"):
            item = {"month": r["month"], "total": r["income"]}
            item.update(r["platform_breakdown"])
            platform_breakdown.append(item)

    return FinancialSummaryResponse(
        months_completed=summary["months_completed"],
        total_months_target=12,
        average_monthly_income=summary["average_monthly_income"],
        median_monthly_income=summary["median_monthly_income"],
        average_monthly_expenses=summary["average_monthly_expenses"],
        average_monthly_savings=summary["average_monthly_savings"],
        average_savings_percentage=summary["average_savings_percentage"],
        income_stability_status=summary["income_stability_status"],
        income_stability_explanation=summary["income_stability_explanation"],
        income_stability_cv=summary["income_stability_cv"],
        monthly_history=monthly_history,
        platform_breakdown=platform_breakdown
    )

# ==========================================
# LOAN ELIGIBILITY EVALUATION
# ==========================================

@app.get("/api/eligibility", response_model=LoanEligibilityResponse)
def get_loan_eligibility(user_id: str = Depends(get_current_user_id)):
    profile = db.get_profile_by_user_id(user_id)
    verifications = db.get_verifications(user_id)
    records = db.get_monthly_records(user_id)

    has_collateral = bool(profile.get("has_collateral", False)) if profile else False
    collateral_value = float(profile.get("collateral_value", 0.0)) if profile else 0.0

    all_verified = len(verifications) > 0 and all(v.get("is_verified") for v in verifications)

    eval_result = evaluate_loan_eligibility(
        profile_has_collateral=has_collateral,
        collateral_value=collateral_value,
        all_employment_verified=all_verified,
        monthly_records=records
    )

    return LoanEligibilityResponse(**eval_result)

# ==========================================
# DIGITAL CERTIFICATE & PORTFOLIO
# ==========================================

@app.post("/api/certificate/generate", response_model=CertificateResponse)
def create_certificate(user_id: str = Depends(get_current_user_id)):
    """
    Generates digitally signed certificate only if user is eligible.
    """
    profile = db.get_profile_by_user_id(user_id)
    verifications = db.get_verifications(user_id)
    records = db.get_monthly_records(user_id)

    has_collateral = bool(profile.get("has_collateral", False)) if profile else False
    collateral_val = float(profile.get("collateral_value", 0.0)) if profile else 0.0
    all_verified = len(verifications) > 0 and all(v.get("is_verified") for v in verifications)

    eval_result = evaluate_loan_eligibility(has_collateral, collateral_val, all_verified, records)
    if not eval_result["is_eligible"]:
        raise HTTPException(
            status_code=400,
            detail="Cannot generate certificate: Financial eligibility criteria have not been satisfied."
        )

    summary = eval_result["metrics"]
    client_name = profile.get("full_name") or "CredAccess Member"
    worker_type = profile.get("working_as") or "Full-Time Gig Worker"
    platforms = [v["platform"] for v in verifications if v.get("is_verified")]
    collateral_type = profile.get("collateral_type") or "Verified Asset"

    user = db.get_user_by_id(user_id)
    email_id = user.get("email") or user.get("username") if user else None

    cert_data = generate_verification_certificate(
        client_name=client_name,
        worker_type=worker_type,
        verified_platforms=platforms,
        avg_income=summary["average_monthly_income"],
        savings_rate=summary["average_savings_percentage"],
        collateral_type=collateral_type,
        collateral_value=collateral_val,
        stability_rating=summary["income_stability_status"],
        email_id=email_id
    )

    db.save_certificate(user_id, cert_data)
    return CertificateResponse(**cert_data)

@app.get("/api/certificate", response_model=Optional[CertificateResponse])
def get_user_certificate(user_id: str = Depends(get_current_user_id)):
    cert = db.get_certificate(user_id)
    if not cert:
        return None
    return CertificateResponse(**cert)

@app.get("/api/portfolio")
def get_full_portfolio(user_id: str = Depends(get_current_user_id)):
    """Comprehensive portfolio document payload"""
    profile = db.get_profile_by_user_id(user_id)
    verifications = db.get_verifications(user_id)
    records = db.get_monthly_records(user_id)
    summary = calculate_portfolio_summary(records)
    cert = db.get_certificate(user_id)
    user = db.get_user_by_id(user_id)

    return {
        "user": user,
        "profile": profile,
        "verifications": verifications,
        "summary": summary,
        "monthly_history": records,
        "certificate": cert,
        "disclaimer": (
            "CredAccess Financial Eligibility Verified. "
            "This portfolio represents the applicant's financial assessment based on available and permissioned financial data. "
            "Final loan approval remains subject to the lending institution's policies and verification procedures."
        )
    }

@app.get("/api/documents", response_model=List[DocumentItem])
def get_user_documents(user_id: str = Depends(get_current_user_id)):
    return db.get_documents_by_user(user_id)

# ==========================================
# STATIC FILES & SPA SERVING
# ==========================================
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

DIST_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
SAMPLES_DIR = os.path.join(os.path.dirname(__file__), "..", "sample_statements")

if os.path.exists(SAMPLES_DIR):
    app.mount("/sample_statements", StaticFiles(directory=SAMPLES_DIR), name="samples")

if os.path.exists(DIST_DIR):
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        file_path = os.path.join(DIST_DIR, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(DIST_DIR, "index.html"))
