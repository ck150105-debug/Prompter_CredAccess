"""
CredAccess - Data Models and Schemas
"""
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserAuthRegister(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: str
    confirm_password: Optional[str] = None

class UserAuthLogin(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    username: Optional[str] = None
    full_name: Optional[str] = None
    profile_completed: bool = False
    token: Optional[str] = None

class WorkPlatformInput(BaseModel):
    platform: str
    work_id: str

class ProfileCreateRequest(BaseModel):
    full_name: str
    phone_number: str
    permanent_address: str
    current_address: str
    same_as_permanent: bool = False
    
    # Collateral fields (Mandatory)
    has_collateral: bool
    collateral_type: Optional[str] = None
    collateral_other: Optional[str] = None
    collateral_value: Optional[float] = 0.0
    
    # Work details
    selected_platforms: List[WorkPlatformInput]
    working_experience_years: int = 0
    working_experience_months: int = 0
    working_as: str = "Full-Time Gig Worker"
    
    # Privacy & Consent
    consent_authorized: bool

class WorkVerificationRequest(BaseModel):
    platforms: List[WorkPlatformInput]

class VerificationResultItem(BaseModel):
    platform: str
    work_id: str
    masked_work_id: str
    worker_name: Optional[str] = None
    status: str # "Active", "Suspended", "Not Found"
    is_verified: bool
    message: str
    joining_date: Optional[str] = None

class WorkVerificationResponse(BaseModel):
    all_verified: bool
    results: List[VerificationResultItem]
    message: str

class MonthlyIncomeItem(BaseModel):
    month: str # "Jan", "Feb", etc.
    year: int
    platforms: Dict[str, float]
    total_income: float

class StatementAnalysisResult(BaseModel):
    month: str
    year: int
    total_credits: float
    total_debits: float
    monthly_expenses: float
    verified_income: float
    monthly_savings: float
    savings_percentage: float
    recurring_expenses: Dict[str, float]
    major_transactions: List[Dict[str, Any]]
    status: str

class MonthlyFinancialRecordItem(BaseModel):
    month: str
    year: int
    income: float
    expenses: float
    savings: float
    savings_percentage: float
    statement_status: str # "Uploaded", "Incomplete"
    meets_savings_goal: bool # >= 30%

class FinancialSummaryResponse(BaseModel):
    months_completed: int
    total_months_target: int = 12
    average_monthly_income: float
    median_monthly_income: float
    average_monthly_expenses: float
    average_monthly_savings: float
    average_savings_percentage: float
    income_stability_status: str # "High Stability", "Moderate Stability", "Low Stability"
    income_stability_explanation: str
    income_stability_cv: float
    monthly_history: List[MonthlyFinancialRecordItem]
    platform_breakdown: List[Dict[str, Any]]

class EligibilityCriteriaItem(BaseModel):
    name: str
    required: str
    actual: str
    passed: bool
    detail: str

class LoanEligibilityResponse(BaseModel):
    is_eligible: bool
    status_title: str
    status_message: str
    savings_ratio: float
    required_savings_ratio: float = 30.0
    progress_percentage: float
    criteria_checklist: List[EligibilityCriteriaItem]
    metrics: Dict[str, Any]
    can_generate_certificate: bool
    recommendations: List[str]

class CertificateResponse(BaseModel):
    certificate_id: str
    client_name: str
    email_id: Optional[str] = None
    email: Optional[str] = None
    worker_type: str
    assessment_period: str
    verified_platforms: List[str]
    average_monthly_income: float
    average_savings_rate: float
    collateral_type: str
    collateral_value: float
    income_stability_rating: str
    eligibility_status: str
    digital_signature: str
    verification_hash: str
    qr_code_url: str
    issued_date: str
    disclaimer: str

class DocumentItem(BaseModel):
    id: str
    name: str
    category: str # "Bank Statements", "Employment Verification", "Collateral Documents", "Financial Portfolio", "CredAccess Certificate"
    month: Optional[str] = None
    upload_date: str
    status: str # "Verified", "Available", "Generated"
    file_type: str
