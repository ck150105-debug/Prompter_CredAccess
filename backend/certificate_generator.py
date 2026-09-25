"""
CredAccess - Digital Verification Certificate & Portfolio Generator
Produces tamper-evident digital certificates with cryptographic signature hash,
unique certificate ID (CA-2026-XXXXXX), and verification payload.
"""
import hashlib
import hmac
import random
import string
from datetime import datetime
from typing import Dict, Any, List, Optional

CERT_SECRET_KEY = b"credaccess_fintech_verification_secret_2026"

def generate_certificate_id() -> str:
    """Generates unique ID: CA-2026-XXXXXX"""
    random_hex = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"CA-2026-{random_hex}"

def create_digital_signature(cert_id: str, client_name: str, avg_income: float, savings_rate: float, issued_at: str) -> str:
    """Creates HMAC-SHA256 signature hash representing CredAccess digital validation seal"""
    payload = f"{cert_id}:{client_name}:{avg_income}:{savings_rate}:{issued_at}".encode('utf-8')
    sig = hmac.new(CERT_SECRET_KEY, payload, hashlib.sha256).hexdigest()
    return f"SHA256:{sig[:32].upper()}"

def generate_verification_certificate(
    client_name: str,
    worker_type: str,
    verified_platforms: List[str],
    avg_income: float,
    savings_rate: float,
    collateral_type: str,
    collateral_value: float,
    stability_rating: str,
    assessment_period: str = "January 2025 – December 2025",
    email_id: Optional[str] = None
) -> Dict[str, Any]:
    """Generates certificate data object"""
    cert_id = generate_certificate_id()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")
    sig = create_digital_signature(cert_id, client_name, avg_income, savings_rate, now_str)
    
    qr_data = f"https://credaccess.org/verify/{cert_id}?hash={sig[:12]}&client={client_name.replace(' ', '+')}"

    disclaimer = (
        "This assessment represents the applicant’s financial profile based on available and permissioned information. "
        "Final loan approval remains subject to the lending institution’s own policies and verification."
    )

    return {
        "certificate_id": cert_id,
        "client_name": client_name,
        "email_id": email_id or "client@credaccess.test",
        "email": email_id or "client@credaccess.test",
        "worker_type": worker_type,
        "assessment_period": assessment_period,
        "verified_platforms": verified_platforms,
        "average_monthly_income": avg_income,
        "average_savings_rate": savings_rate,
        "collateral_type": collateral_type,
        "collateral_value": collateral_value,
        "income_stability_rating": stability_rating,
        "eligibility_status": "Eligible for Micro-Loan Assessment",
        "digital_signature": "Digitally Verified by CredAccess",
        "verification_hash": sig,
        "qr_code_url": qr_data,
        "issued_date": datetime.now().strftime("%B %d, %Y"),
        "timestamp": now_str,
        "disclaimer": disclaimer
    }
