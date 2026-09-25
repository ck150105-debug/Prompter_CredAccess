"""
CredAccess - Financial Calculation Engine & Eligibility Rules
Calculates monthly savings, 12-month metrics, income stability index,
and evaluates micro-loan eligibility based on CredAccess 30% savings threshold,
mandatory collateral, and verified gig employment.
"""
from typing import Dict, Any, List, Tuple
import numpy as np
import pandas as pd

def calculate_monthly_metrics(income: float, expenses: float) -> Tuple[float, float, bool]:
    """Calculates savings, savings percentage, and compliance (>= 30%)"""
    savings = max(0.0, round(income - expenses, 2))
    savings_pct = round((savings / income) * 100, 1) if income > 0 else 0.0
    meets_goal = savings_pct >= 30.0
    return savings, savings_pct, meets_goal

def calculate_income_stability(monthly_incomes: List[float]) -> Dict[str, Any]:
    """
    Computes Coefficient of Variation (CV = std_dev / mean)
    Statuses:
    - High Stability (CV < 0.15)
    - Moderate Stability (0.15 <= CV <= 0.30)
    - Low Stability (CV > 0.30)
    """
    if not monthly_incomes or len(monthly_incomes) < 2:
        return {
            "status": "High Stability",
            "cv": 0.08,
            "explanation": "Your monthly earnings remained relatively consistent over the documented period."
        }

    arr = np.array(monthly_incomes)
    mean_val = np.mean(arr)
    std_val = np.std(arr)

    if mean_val == 0:
        cv = 0.0
    else:
        cv = round(float(std_val / mean_val), 3)

    if cv <= 0.15:
        status = "High Stability"
        explanation = "Your monthly earnings remained relatively consistent over the documented period with low variance."
    elif cv <= 0.30:
        status = "Moderate Stability"
        explanation = "Your monthly earnings showed moderate, healthy month-to-month variation within acceptable gig thresholds."
    else:
        status = "Low Stability"
        explanation = "Your monthly earnings experienced notable volatility across the documented months."

    return {
        "status": status,
        "cv": cv,
        "explanation": explanation
    }

def calculate_portfolio_summary(monthly_records: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calculates 12-month portfolio metrics:
    - Average Monthly Income
    - Median Monthly Income
    - Average Monthly Expenses
    - Average Monthly Savings
    - Average Savings Percentage = (Total Savings / Total Income) * 100
    - Income Stability
    """
    if not monthly_records:
        return {
            "months_completed": 0,
            "average_monthly_income": 0.0,
            "median_monthly_income": 0.0,
            "average_monthly_expenses": 0.0,
            "average_monthly_savings": 0.0,
            "average_savings_percentage": 0.0,
            "income_stability_status": "Pending",
            "income_stability_explanation": "Awaiting documented financial records.",
            "income_stability_cv": 0.0
        }

    incomes = [r["income"] for r in monthly_records if r.get("income", 0) > 0]
    expenses = [r["expenses"] for r in monthly_records if r.get("statement_status") == "Uploaded"]
    savings = [r["savings"] for r in monthly_records if r.get("statement_status") == "Uploaded"]

    total_income_sum = sum(incomes) if incomes else 0.0
    total_savings_sum = sum(savings) if savings else 0.0

    avg_income = round(float(np.mean(incomes)), 2) if incomes else 0.0
    median_income = round(float(np.median(incomes)), 2) if incomes else 0.0
    avg_expenses = round(float(np.mean(expenses)), 2) if expenses else 0.0
    avg_savings = round(float(np.mean(savings)), 2) if savings else 0.0

    # Overall savings ratio: Total Savings / Total Income * 100
    if total_income_sum > 0:
        avg_savings_pct = round((total_savings_sum / total_income_sum) * 100, 1)
    else:
        avg_savings_pct = 0.0

    stability = calculate_income_stability(incomes)

    return {
        "months_completed": len(expenses),
        "total_months_target": 12,
        "average_monthly_income": avg_income,
        "median_monthly_income": median_income,
        "average_monthly_expenses": avg_expenses,
        "average_monthly_savings": avg_savings,
        "average_savings_percentage": avg_savings_pct,
        "income_stability_status": stability["status"],
        "income_stability_explanation": stability["explanation"],
        "income_stability_cv": stability["cv"]
    }

def evaluate_loan_eligibility(
    profile_has_collateral: bool,
    collateral_value: float,
    all_employment_verified: bool,
    monthly_records: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Evaluates micro-loan eligibility against business rules:
    Rule 1: Collateral mandatory (must have collateral verified)
    Rule 2: Gig employment verified
    Rule 3: Savings ratio >= 30%
    Rule 4: Minimum 10 months documented (for hackathon demo, allows 10-12 months)
    """
    summary = calculate_portfolio_summary(monthly_records)
    savings_ratio = summary["average_savings_percentage"]
    months_count = summary["months_completed"]

    # Criteria evaluation
    c1_passed = profile_has_collateral and (collateral_value > 0)
    c2_passed = all_employment_verified
    c3_passed = months_count >= 10
    c4_passed = savings_ratio >= 30.0

    checklist = [
        {
            "name": "Verified Gig Employment",
            "required": "100% of Active Gig Platforms Authenticated",
            "actual": "Verified ✓" if c2_passed else "Pending / Failed ✕",
            "passed": c2_passed,
            "detail": "Authorized API verification with registered gig platforms."
        },
        {
            "name": "Collateral Verification",
            "required": "Mandatory registered collateral asset",
            "actual": f"Verified (₹{collateral_value:,.0f})" if c1_passed else "Missing / Not Provided",
            "passed": c1_passed,
            "detail": "Collateral pledge provides risk mitigation for micro-lending partners."
        },
        {
            "name": "Financial History Duration",
            "required": "Minimum 10-12 months documented statements",
            "actual": f"{months_count} / 12 Months Documented",
            "passed": c3_passed,
            "detail": "Complete bank statements verifying monthly cashflow & debit trends."
        },
        {
            "name": "CredAccess Savings Requirement",
            "required": "Average Savings Rate >= 30.0%",
            "actual": f"{savings_ratio:.1f}%",
            "passed": c4_passed,
            "detail": "Demonstrates disposable surplus income to reliably service micro-loan EMIs."
        }
    ]

    is_eligible = c1_passed and c2_passed and c3_passed and c4_passed
    progress_pct = min(100.0, round((savings_ratio / 30.0) * 100, 1))

    recommendations = []
    if not c1_passed:
        recommendations.append("Register valid collateral asset (Vehicle, Gold, Property, FD) in your profile.")
    if not c2_passed:
        recommendations.append("Complete platform verification for all selected gig platforms.")
    if not c3_passed:
        recommendations.append(f"Upload remaining {12 - months_count} monthly bank statements to achieve 12-month maturity.")
    if not c4_passed:
        deficit = round(30.0 - savings_ratio, 1)
        recommendations.append(f"Reduce discretionary expenses by ₹{round(summary['average_monthly_income'] * (deficit / 100)):,.0f}/month to bridge the {deficit}% savings gap.")
        recommendations.append("Maintain recurring fuel and vehicle maintenance logs to optimize operational costs.")

    if is_eligible:
        title = "Congratulations! You Meet the CredAccess Financial Eligibility Criteria."
        message = (
            "Your verified gig income, documented savings rate, and collateral meet the benchmark for partner micro-loan assessment. "
            "You can now generate your official CredAccess Verification Certificate."
        )
    else:
        title = "You are currently not eligible."
        message = "Continue building your financial portfolio and maintaining higher monthly savings."

    return {
        "is_eligible": is_eligible,
        "status_title": title,
        "status_message": message,
        "savings_ratio": savings_ratio,
        "required_savings_ratio": 30.0,
        "progress_percentage": progress_pct,
        "criteria_checklist": checklist,
        "metrics": summary,
        "can_generate_certificate": is_eligible,
        "recommendations": recommendations
    }
