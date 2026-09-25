import requests

base_url = "http://127.0.0.1:8000"

print("--- TESTING END-TO-END FLOW FOR NEW GIG WORKER ---")

import time

ts = int(time.time())
reg_payload = {
    "username": f"vikram.{ts}@credaccess.demo",
    "password": "password123",
    "confirm_password": "password123"
}
r_reg = requests.post(f"{base_url}/api/auth/register", json=reg_payload)
print("1. Registration:", r_reg.status_code, r_reg.json())
user_id = r_reg.json()["id"]
headers = {"Authorization": f"Bearer {user_id}"}

# 2. Test Rule 1: Collateral = No -> Must fail with 400
bad_profile = {
    "full_name": "Vikram Singh",
    "phone_number": "+91 98888 11111",
    "permanent_address": "#12, Main Road, Delhi",
    "current_address": "#12, Main Road, Delhi",
    "same_as_permanent": True,
    "has_collateral": False,
    "selected_platforms": [{"platform": "Rapido", "work_id": "RP44021"}],
    "consent_authorized": True
}
r_bad = requests.post(f"{base_url}/api/profile", json=bad_profile, headers=headers)
print("2. Collateral=False validation check:", r_bad.status_code, r_bad.json().get("detail"))
assert r_bad.status_code == 400, "Should reject when has_collateral is False"

# 3. Test Rule 2: Invalid Work ID verification -> Must fail
invalid_verify = {
    "platforms": [{"platform": "Rapido", "work_id": "RP_INVALID_999"}]
}
r_inv = requests.post(f"{base_url}/api/gig/verify", json=invalid_verify, headers=headers)
print("3. Invalid Work ID check: all_verified =", r_inv.json().get("all_verified"), "Status =", r_inv.json()["results"][0]["status"])
assert r_inv.json().get("all_verified") is False

# 4. Test Valid Work ID verification: Rapido RP44021
valid_verify = {
    "platforms": [{"platform": "Rapido", "work_id": "RP44021"}]
}
r_valid = requests.post(f"{base_url}/api/gig/verify", json=valid_verify, headers=headers)
print("4. Valid Work ID check: all_verified =", r_valid.json().get("all_verified"), "Worker =", r_valid.json()["results"][0]["worker_name"])
assert r_valid.json().get("all_verified") is True

# 5. Save Valid Profile (has_collateral = True)
good_profile = {
    "full_name": "Vikram Singh",
    "phone_number": "+91 98888 11111",
    "permanent_address": "#12, Main Road, Delhi",
    "current_address": "#12, Main Road, Delhi",
    "same_as_permanent": True,
    "has_collateral": True,
    "collateral_type": "Vehicle",
    "collateral_value": 50000.0,
    "selected_platforms": [{"platform": "Rapido", "work_id": "RP44021"}],
    "working_experience_years": 1,
    "working_experience_months": 8,
    "working_as": "Full-Time Gig Worker",
    "consent_authorized": True
}
r_good = requests.post(f"{base_url}/api/profile", json=good_profile, headers=headers)
print("5. Profile creation:", r_good.status_code, r_good.json())

# 6. Check Initial Incomplete Status (no statements uploaded yet)
r_elig_init = requests.get(f"{base_url}/api/eligibility", headers=headers)
print("6. Initial Eligibility:", r_elig_init.json().get("status_title"), "Months =", r_elig_init.json()["metrics"]["months_completed"])
assert r_elig_init.json()["is_eligible"] is False

# 7. Upload / simulate 12-month statements with 34% savings
r_sim = requests.post(f"{base_url}/api/statements/simulate-all", data={"savings_rate_target": "0.34"}, headers=headers)
print("7. 12-Month statements populated:", r_sim.status_code, r_sim.json().get("message"))

# 8. Re-evaluate eligibility (Should now be ELIGIBLE!)
r_elig_after = requests.get(f"{base_url}/api/eligibility", headers=headers)
print("8. Final Eligibility Check:")
print("   - Eligible:", r_elig_after.json()["is_eligible"])
print("   - Savings Ratio:", r_elig_after.json()["savings_ratio"], "%")
print("   - Income Stability:", r_elig_after.json()["metrics"]["income_stability_status"])
assert r_elig_after.json()["is_eligible"] is True

# 9. Generate Certificate
r_cert = requests.post(f"{base_url}/api/certificate/generate", headers=headers)
print("9. Certificate Generation:")
print("   - ID:", r_cert.json().get("certificate_id"))
print("   - Digital Signature:", r_cert.json().get("digital_signature"))
print("   - Hash:", r_cert.json().get("verification_hash"))

# 10. Documents List
r_docs = requests.get(f"{base_url}/api/documents", headers=headers)
print(f"10. Total Stored Documents: {len(r_docs.json())}")

# 11. Test Logout
r_logout = requests.post(f"{base_url}/api/auth/logout", headers=headers)
print(f"11. Logout Check: Status {r_logout.status_code}, Message: {r_logout.json().get('message')}")
assert r_logout.status_code == 200

# Verify /api/auth/me returns 401 without auth header
r_me_unauth = requests.get(f"{base_url}/api/auth/me")
print(f"12. Unauthenticated Session Check: Status {r_me_unauth.status_code} (Properly blocked)")
assert r_me_unauth.status_code == 401

print("\n--- ALL END-TO-END FLOW TESTS COMPLETED PERFECTLY! ---")
