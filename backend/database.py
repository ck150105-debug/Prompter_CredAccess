"""
CredAccess - Database Layer & Demo Data Seeder
SQLite-based repository structured so it can readily switch to PostgreSQL.
Includes persistent storage and pre-seeded demonstration profiles:
1. Arun Kumar (Eligible: Uber+Rapido, 35.2% savings, 12 months)
2. Ravi (Not Eligible: Swiggy, 21.8% savings, 12 months)
"""
import sqlite3
import json
import os
from typing import Dict, Any, List, Optional
from datetime import datetime
from mock_gig_db import GIG_PLATFORM_RECORDS, verify_platform_worker, mask_work_id, MONTHS
from financial_engine import calculate_monthly_metrics, calculate_portfolio_summary, evaluate_loan_eligibility
from statement_parser import generate_simulated_statement
from certificate_generator import generate_verification_certificate

DB_FILE = os.path.join(os.path.dirname(__file__), "credaccess.db")

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        username TEXT,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        profile_completed BOOLEAN DEFAULT 0,
        created_at TEXT
    )
    """)

    # Profiles table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS profiles (
        user_id TEXT PRIMARY KEY,
        email TEXT,
        full_name TEXT,
        phone_number TEXT,
        permanent_address TEXT,
        current_address TEXT,
        same_as_permanent BOOLEAN DEFAULT 0,
        has_collateral BOOLEAN DEFAULT 0,
        collateral_type TEXT,
        collateral_other TEXT,
        collateral_value REAL DEFAULT 0.0,
        working_experience_years INTEGER DEFAULT 0,
        working_experience_months INTEGER DEFAULT 0,
        working_as TEXT,
        consent_authorized BOOLEAN DEFAULT 0,
        consent_timestamp TEXT,
        selected_platforms_json TEXT,
        updated_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    """)

    # Schema migration checks for existing tables
    cursor.execute("PRAGMA table_info(users)")
    user_cols = [r[1] for r in cursor.fetchall()]
    if "email" not in user_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN email TEXT")
        cursor.execute("UPDATE users SET email = username WHERE email IS NULL")

    cursor.execute("PRAGMA table_info(profiles)")
    profile_cols = [r[1] for r in cursor.fetchall()]
    if "email" not in profile_cols:
        cursor.execute("ALTER TABLE profiles ADD COLUMN email TEXT")

    # Verifications table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        platform TEXT,
        work_id TEXT,
        masked_work_id TEXT,
        is_verified BOOLEAN,
        status TEXT,
        worker_name TEXT,
        joining_date TEXT,
        details TEXT,
        verified_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    """)

    # Monthly financial records
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS monthly_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        month TEXT,
        year INTEGER,
        income REAL,
        expenses REAL,
        savings REAL,
        savings_percentage REAL,
        statement_status TEXT,
        statement_details_json TEXT,
        platform_breakdown_json TEXT,
        updated_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    """)

    # Certificates table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS certificates (
        certificate_id TEXT PRIMARY KEY,
        user_id TEXT,
        data_json TEXT,
        created_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    """)

    # Documents table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        name TEXT,
        category TEXT,
        month TEXT,
        upload_date TEXT,
        status TEXT,
        file_type TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    """)

    conn.commit()
    conn.close()

def seed_demo_users(force: bool = False):
    """Seeds Arun Kumar (Eligible) and Ravi (Not Eligible) if not already present or forced"""
    conn = get_db_connection()
    cursor = conn.cursor()

    if force:
        cursor.execute("DELETE FROM users WHERE email IN ('arun.demo@credaccess.test', 'ravi.demo@credaccess.test', 'arun@credaccess.demo', 'ravi@credaccess.demo') OR username IN ('arun.demo@credaccess.test', 'ravi.demo@credaccess.test', 'arun@credaccess.demo', 'ravi@credaccess.demo')")
        cursor.execute("DELETE FROM profiles WHERE user_id IN ('user_arun_kumar_01', 'user_ravi_swiggy_02')")
        cursor.execute("DELETE FROM verifications WHERE user_id IN ('user_arun_kumar_01', 'user_ravi_swiggy_02')")
        cursor.execute("DELETE FROM monthly_records WHERE user_id IN ('user_arun_kumar_01', 'user_ravi_swiggy_02')")
        cursor.execute("DELETE FROM certificates WHERE user_id IN ('user_arun_kumar_01', 'user_ravi_swiggy_02')")
        cursor.execute("DELETE FROM documents WHERE user_id IN ('user_arun_kumar_01', 'user_ravi_swiggy_02')")
        conn.commit()

    # Check if Arun exists
    cursor.execute("SELECT id FROM users WHERE email = 'arun.demo@credaccess.test' OR username = 'arun@credaccess.demo'")
    if not cursor.fetchone():
        # 1. ARUN KUMAR (Eligible)
        arun_id = "user_arun_kumar_01"
        cursor.execute("""
        INSERT INTO users (id, email, username, password_hash, full_name, profile_completed, created_at)
        VALUES (?, ?, ?, ?, ?, 1, ?)
        """, (arun_id, "arun.demo@credaccess.test", "arun.demo@credaccess.test", "demo123", "Arun Kumar", "2024-01-01 10:00:00"))

        arun_platforms = [
            {"platform": "Uber", "work_id": "UB10001"},
            {"platform": "Rapido", "work_id": "RP10001"}
        ]
        cursor.execute("""
        INSERT INTO profiles (
            user_id, full_name, phone_number, permanent_address, current_address, same_as_permanent,
            has_collateral, collateral_type, collateral_value,
            working_experience_years, working_experience_months, working_as,
            consent_authorized, consent_timestamp, selected_platforms_json, updated_at
        ) VALUES (?, ?, ?, ?, ?, 1, 1, 'Vehicle', 65000.0, 2, 6, 'Full-Time Gig Worker', 1, ?, ?, ?)
        """, (
            arun_id, "Arun Kumar", "+91 98450 12345",
            "#42, 3rd Cross, HSR Layout, Sector 2, Bengaluru, Karnataka - 560102",
            "#42, 3rd Cross, HSR Layout, Sector 2, Bengaluru, Karnataka - 560102",
            "2024-01-01 10:05:00", json.dumps(arun_platforms), "2024-01-01 10:05:00"
        ))

        # Add verifications
        for p in arun_platforms:
            v_res = verify_platform_worker(p["platform"], p["work_id"])
            cursor.execute("""
            INSERT INTO verifications (user_id, platform, work_id, masked_work_id, is_verified, status, worker_name, joining_date, details, verified_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                arun_id, v_res["platform"], v_res["work_id"], v_res["masked_work_id"],
                v_res["is_verified"], v_res["status"], v_res["worker_name"],
                v_res["joining_date"], v_res["message"], "2024-01-01 10:10:00"
            ))

        # Add 12-month records for Arun (Target savings ~35%)
        uber_earnings = GIG_PLATFORM_RECORDS["Uber"]["UB10001"]["monthly_earnings"]
        rapido_earnings = GIG_PLATFORM_RECORDS["Rapido"]["RP10001"]["monthly_earnings"]

        for m in MONTHS:
            u_inc = uber_earnings.get(m, 22000)
            r_inc = rapido_earnings.get(m, 14000)
            tot_inc = u_inc + r_inc
            
            stmt = generate_simulated_statement(m, 2025, tot_inc, savings_rate_target=0.352)
            savings, savings_pct, _ = calculate_monthly_metrics(tot_inc, stmt["monthly_expenses"])

            breakdown = {"Uber": u_inc, "Rapido": r_inc}

            cursor.execute("""
            INSERT INTO monthly_records (
                user_id, month, year, income, expenses, savings, savings_percentage,
                statement_status, statement_details_json, platform_breakdown_json, updated_at
            ) VALUES (?, ?, 2025, ?, ?, ?, ?, 'Uploaded', ?, ?, ?)
            """, (
                arun_id, m, tot_inc, stmt["monthly_expenses"], savings, savings_pct,
                json.dumps(stmt), json.dumps(breakdown), "2025-12-31 18:00:00"
            ))

            # Add document for statement
            cursor.execute("""
            INSERT INTO documents (id, user_id, name, category, month, upload_date, status, file_type)
            VALUES (?, ?, ?, 'Bank Statements', ?, '2025-12-05', 'Verified', 'PDF')
            """, (f"doc_arun_stmt_{m.lower()}", arun_id, f"Bank_Statement_{m}_2025.pdf", m))

        # Documents for employment and collateral
        cursor.execute("""
        INSERT INTO documents (id, user_id, name, category, month, upload_date, status, file_type)
        VALUES 
        (?, ?, 'Uber_Partner_Agreement_UB10001.pdf', 'Employment Verification', 'All', '2024-01-15', 'Verified', 'PDF'),
        (?, ?, 'Rapido_Captain_Badge_RP10001.pdf', 'Employment Verification', 'All', '2024-01-15', 'Verified', 'PDF'),
        (?, ?, 'Two_Wheeler_RC_Book_KA01HJ4412.pdf', 'Collateral Documents', 'All', '2024-01-20', 'Verified', 'PDF'),
        (?, ?, 'CredAccess_12M_Financial_Portfolio.pdf', 'Financial Portfolio', '12M', '2025-12-31', 'Generated', 'PDF')
        """, (
            f"doc_arun_uber", arun_id,
            f"doc_arun_rapido", arun_id,
            f"doc_arun_rc", arun_id,
            f"doc_arun_portfolio", arun_id
        ))

        # Pre-generate Certificate for Arun
        cert_data = generate_verification_certificate(
            client_name="Arun Kumar",
            worker_type="Full-Time Gig Worker",
            verified_platforms=["Uber", "Rapido"],
            avg_income=37000.0,
            savings_rate=35.2,
            collateral_type="Vehicle (Two-Wheeler)",
            collateral_value=65000.0,
            stability_rating="High Stability",
            email_id="arun.demo@credaccess.test"
        )
        cursor.execute("""
        INSERT INTO certificates (certificate_id, user_id, data_json, created_at)
        VALUES (?, ?, ?, ?)
        """, (cert_data["certificate_id"], arun_id, json.dumps(cert_data), cert_data["issued_date"]))

        cursor.execute("""
        INSERT INTO documents (id, user_id, name, category, month, upload_date, status, file_type)
        VALUES (?, ?, 'CredAccess_Verification_Certificate.pdf', 'CredAccess Certificate', 'All', '2025-12-31', 'Generated', 'PDF')
        """, (f"doc_arun_cert", arun_id))


    # Check if Ravi exists
    cursor.execute("SELECT id FROM users WHERE email = 'ravi.demo@credaccess.test' OR username = 'ravi@credaccess.demo'")
    if not cursor.fetchone():
        # 2. RAVI (Not Eligible - Swiggy, 21.8% savings)
        ravi_id = "user_ravi_swiggy_02"
        cursor.execute("""
        INSERT INTO users (id, email, username, password_hash, full_name, profile_completed, created_at)
        VALUES (?, ?, ?, ?, ?, 1, ?)
        """, (ravi_id, "ravi.demo@credaccess.test", "ravi.demo@credaccess.test", "demo123", "Ravi", "2024-02-01 11:00:00"))

        ravi_platforms = [
            {"platform": "Swiggy", "work_id": "SW10001"}
        ]
        cursor.execute("""
        INSERT INTO profiles (
            user_id, full_name, phone_number, permanent_address, current_address, same_as_permanent,
            has_collateral, collateral_type, collateral_value,
            working_experience_years, working_experience_months, working_as,
            consent_authorized, consent_timestamp, selected_platforms_json, updated_at
        ) VALUES (?, ?, ?, ?, ?, 1, 1, 'Gold', 40000.0, 1, 2, 'Independent Contractor', 1, ?, ?, ?)
        """, (
            ravi_id, "Ravi", "+91 97310 98765",
            "#18, B-Block, 4th Main, Indiranagar, Bengaluru, Karnataka - 560038",
            "#18, B-Block, 4th Main, Indiranagar, Bengaluru, Karnataka - 560038",
            "2024-02-01 11:05:00", json.dumps(ravi_platforms), "2024-02-01 11:05:00"
        ))

        # Add verifications
        v_res = verify_platform_worker("Swiggy", "SW10001")
        cursor.execute("""
        INSERT INTO verifications (user_id, platform, work_id, masked_work_id, is_verified, status, worker_name, joining_date, details, verified_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            ravi_id, v_res["platform"], v_res["work_id"], v_res["masked_work_id"],
            v_res["is_verified"], v_res["status"], v_res["worker_name"],
            v_res["joining_date"], v_res["message"], "2024-02-01 11:10:00"
        ))

        # Add 12-month records for Ravi (Target savings ~21.8% - Below 30% threshold!)
        swiggy_earnings = GIG_PLATFORM_RECORDS["Swiggy"]["SW10001"]["monthly_earnings"]

        for m in MONTHS:
            s_inc = swiggy_earnings.get(m, 30500)
            stmt = generate_simulated_statement(m, 2025, s_inc, savings_rate_target=0.218)
            savings, savings_pct, _ = calculate_monthly_metrics(s_inc, stmt["monthly_expenses"])
            breakdown = {"Swiggy": s_inc}

            cursor.execute("""
            INSERT INTO monthly_records (
                user_id, month, year, income, expenses, savings, savings_percentage,
                statement_status, statement_details_json, platform_breakdown_json, updated_at
            ) VALUES (?, ?, 2025, ?, ?, ?, ?, 'Uploaded', ?, ?, ?)
            """, (
                ravi_id, m, s_inc, stmt["monthly_expenses"], savings, savings_pct,
                json.dumps(stmt), json.dumps(breakdown), "2025-12-31 18:00:00"
            ))

            cursor.execute("""
            INSERT INTO documents (id, user_id, name, category, month, upload_date, status, file_type)
            VALUES (?, ?, ?, 'Bank Statements', ?, '2025-12-05', 'Verified', 'PDF')
            """, (f"doc_ravi_stmt_{m.lower()}", ravi_id, f"Bank_Statement_{m}_2025.pdf", m))

        cursor.execute("""
        INSERT INTO documents (id, user_id, name, category, month, upload_date, status, file_type)
        VALUES 
        (?, ?, 'Swiggy_Partner_Badge_SW10001.pdf', 'Employment Verification', 'All', '2024-02-15', 'Verified', 'PDF'),
        (?, ?, 'Gold_Deposit_Receipt_G8842.pdf', 'Collateral Documents', 'All', '2024-02-20', 'Verified', 'PDF'),
        (?, ?, 'CredAccess_12M_Financial_Portfolio.pdf', 'Financial Portfolio', '12M', '2025-12-31', 'Generated', 'PDF')
        """, (
            f"doc_ravi_swiggy", ravi_id,
            f"doc_ravi_gold", ravi_id,
            f"doc_ravi_portfolio", ravi_id
        ))

    conn.commit()
    conn.close()

# Helper DB queries
def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = c.fetchone()
    conn.close()
    return dict(row) if row else None

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    c = conn.cursor()
    clean = email.strip().lower()
    c.execute("SELECT * FROM users WHERE email = ? OR username = ?", (clean, clean))
    row = c.fetchone()
    conn.close()
    return dict(row) if row else None

def get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    return get_user_by_email(username)

def create_user(email: str, password_hash: str, full_name: Optional[str] = None) -> str:
    conn = get_db_connection()
    c = conn.cursor()
    clean_email = email.strip().lower()
    user_id = f"user_{datetime.now().strftime('%Y%m%d%H%M%S')}_{os.urandom(2).hex()}"
    now_str = datetime.now().isoformat()
    c.execute("""
    INSERT INTO users (id, email, username, password_hash, full_name, profile_completed, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?)
    """, (user_id, clean_email, clean_email, password_hash, full_name, now_str))

    # DATABASE RULE: Creating a new account must create an EMPTY profile.
    # Conceptually:
    # {
    #     user_id: authenticated_user_id,
    #     email: authenticated_email,
    #     full_name: null,
    #     phone: null,
    #     permanent_address: null,
    #     current_address: null,
    #     collateral: null,
    #     profile_completed: false
    # }
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
    """, (user_id, clean_email, now_str))

    conn.commit()
    conn.close()
    return user_id

def get_profile_by_user_id(user_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,))
    row = c.fetchone()
    conn.close()
    if row:
        d = dict(row)
        d["selected_platforms"] = json.loads(d.get("selected_platforms_json") or "[]")
        return d
    return None

def save_profile(user_id: str, data: Dict[str, Any]):
    conn = get_db_connection()
    c = conn.cursor()
    now_str = datetime.now().isoformat()
    platforms_json = json.dumps(data.get("selected_platforms", []))

    # Get authenticated user's email to ensure it cannot be overwritten
    c.execute("SELECT email, username FROM users WHERE id = ?", (user_id,))
    u_row = c.fetchone()
    auth_email = u_row[0] if (u_row and u_row[0]) else (u_row[1] if u_row else "")

    c.execute("""
    INSERT INTO profiles (
        user_id, email, full_name, phone_number, permanent_address, current_address, same_as_permanent,
        has_collateral, collateral_type, collateral_other, collateral_value,
        working_experience_years, working_experience_months, working_as,
        consent_authorized, consent_timestamp, selected_platforms_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
        email=COALESCE(profiles.email, excluded.email),
        full_name=excluded.full_name,
        phone_number=excluded.phone_number,
        permanent_address=excluded.permanent_address,
        current_address=excluded.current_address,
        same_as_permanent=excluded.same_as_permanent,
        has_collateral=excluded.has_collateral,
        collateral_type=excluded.collateral_type,
        collateral_other=excluded.collateral_other,
        collateral_value=excluded.collateral_value,
        working_experience_years=excluded.working_experience_years,
        working_experience_months=excluded.working_experience_months,
        working_as=excluded.working_as,
        consent_authorized=excluded.consent_authorized,
        selected_platforms_json=excluded.selected_platforms_json,
        updated_at=excluded.updated_at
    """, (
        user_id, auth_email, data.get("full_name", ""), data.get("phone_number", ""),
        data.get("permanent_address", ""), data.get("current_address", ""),
        1 if data.get("same_as_permanent") else 0,
        1 if data.get("has_collateral") else 0,
        data.get("collateral_type", ""), data.get("collateral_other", ""),
        float(data.get("collateral_value") or 0.0),
        int(data.get("working_experience_years") or 0),
        int(data.get("working_experience_months") or 0),
        data.get("working_as", "Full-Time Gig Worker"),
        1 if data.get("consent_authorized") else 0,
        data.get("consent_timestamp", now_str),
        platforms_json, now_str
    ))

    # Also update user record full_name and mark profile_completed = 1
    c.execute("UPDATE users SET full_name = ?, profile_completed = 1 WHERE id = ?", (data.get("full_name"), user_id))

    conn.commit()
    conn.close()

def save_verification_results(user_id: str, results: List[Dict[str, Any]]):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM verifications WHERE user_id = ?", (user_id,))
    now_str = datetime.now().isoformat()
    for item in results:
        c.execute("""
        INSERT INTO verifications (user_id, platform, work_id, masked_work_id, is_verified, status, worker_name, joining_date, details, verified_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id, item["platform"], item["work_id"], item["masked_work_id"],
            1 if item["is_verified"] else 0, item["status"], item.get("worker_name"),
            item.get("joining_date"), item.get("message"), now_str
        ))
    conn.commit()
    conn.close()

def get_verifications(user_id: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM verifications WHERE user_id = ?", (user_id,))
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    return rows

def get_monthly_records(user_id: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM monthly_records WHERE user_id = ? ORDER BY id ASC", (user_id,))
    rows = []
    for r in c.fetchall():
        d = dict(r)
        if d.get("statement_details_json"):
            d["statement_details"] = json.loads(d["statement_details_json"])
        if d.get("platform_breakdown_json"):
            d["platform_breakdown"] = json.loads(d["platform_breakdown_json"])
        rows.append(d)
    conn.close()
    return rows

def save_monthly_record(user_id: str, month: str, year: int, income: float, expenses: float, savings: float, savings_pct: float, stmt_data: Dict[str, Any], breakdown: Dict[str, float]):
    conn = get_db_connection()
    c = conn.cursor()
    now_str = datetime.now().isoformat()
    
    # Check if existing record
    c.execute("SELECT id FROM monthly_records WHERE user_id = ? AND month = ? AND year = ?", (user_id, month, year))
    existing = c.fetchone()
    if existing:
        c.execute("""
        UPDATE monthly_records SET
            income = ?, expenses = ?, savings = ?, savings_percentage = ?,
            statement_status = 'Uploaded', statement_details_json = ?, platform_breakdown_json = ?, updated_at = ?
        WHERE id = ?
        """, (income, expenses, savings, savings_pct, json.dumps(stmt_data), json.dumps(breakdown), now_str, existing["id"]))
    else:
        c.execute("""
        INSERT INTO monthly_records (
            user_id, month, year, income, expenses, savings, savings_percentage,
            statement_status, statement_details_json, platform_breakdown_json, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Uploaded', ?, ?, ?)
        """, (user_id, month, year, income, expenses, savings, savings_pct, json.dumps(stmt_data), json.dumps(breakdown), now_str))

    # Add or update document
    doc_id = f"doc_{user_id}_{month.lower()}_{year}"
    c.execute("""
    INSERT INTO documents (id, user_id, name, category, month, upload_date, status, file_type)
    VALUES (?, ?, ?, 'Bank Statements', ?, ?, 'Verified', 'PDF')
    ON CONFLICT(id) DO UPDATE SET upload_date=excluded.upload_date, status=excluded.status
    """, (doc_id, user_id, f"Bank_Statement_{month}_{year}.pdf", month, datetime.now().strftime("%Y-%m-%d")))

    conn.commit()
    conn.close()

def get_certificate(user_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM certificates WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", (user_id,))
    row = c.fetchone()
    conn.close()
    if row:
        return json.loads(row["data_json"])
    return None

def save_certificate(user_id: str, cert_data: Dict[str, Any]):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("""
    INSERT INTO certificates (certificate_id, user_id, data_json, created_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(certificate_id) DO UPDATE SET data_json=excluded.data_json
    """, (cert_data["certificate_id"], user_id, json.dumps(cert_data), cert_data["issued_date"]))

    # Also register certificate in documents
    doc_id = f"doc_cert_{cert_data['certificate_id']}"
    c.execute("""
    INSERT INTO documents (id, user_id, name, category, month, upload_date, status, file_type)
    VALUES (?, ?, ?, 'CredAccess Certificate', 'All', ?, 'Generated', 'PDF')
    ON CONFLICT(id) DO NOTHING
    """, (doc_id, user_id, f"CredAccess_Verification_{cert_data['certificate_id']}.pdf", datetime.now().strftime("%Y-%m-%d")))

    conn.commit()
    conn.close()

def get_documents_by_user(user_id: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM documents WHERE user_id = ? ORDER BY upload_date DESC", (user_id,))
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    return rows
