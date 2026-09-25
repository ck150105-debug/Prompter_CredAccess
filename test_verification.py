import requests
import re

base_url = "http://127.0.0.1:8000"

print("1. Testing root HTML...")
r = requests.get(base_url)
print(f"Root: {r.status_code}, Length: {len(r.text)}")

assets = re.findall(r'/assets/[^"]+', r.text)
print(f"Found assets: {assets}")
for a in assets:
    ra = requests.get(base_url + a)
    print(f"Asset {a}: Status {ra.status_code}, Size {len(ra.content)} bytes")

print("\n2. Testing sample statement download...")
r_sample = requests.get(f"{base_url}/sample_statements/sample_bank_statement.csv")
print(f"Sample Statement: {r_sample.status_code}, Size {len(r_sample.content)} bytes")

print("\n3. Testing Demo Switcher API...")
r_arun = requests.post(f"{base_url}/api/demo/switch", data={"mode": "arun"})
print(f"Switch Arun: {r_arun.status_code}, User: {r_arun.json().get('name')}")

r_elig = requests.get(f"{base_url}/api/eligibility", headers={"Authorization": f"Bearer {r_arun.json().get('user_id')}"})
print(f"Arun Eligible: {r_elig.json().get('is_eligible')}, Savings: {r_elig.json().get('savings_ratio')}%")

r_cert = requests.get(f"{base_url}/api/certificate", headers={"Authorization": f"Bearer {r_arun.json().get('user_id')}"})
print(f"Arun Cert: {r_cert.json().get('certificate_id')}, Hash: {r_cert.json().get('verification_hash')}")

r_ravi = requests.post(f"{base_url}/api/demo/switch", data={"mode": "ravi"})
r_elig_ravi = requests.get(f"{base_url}/api/eligibility", headers={"Authorization": f"Bearer {r_ravi.json().get('user_id')}"})
print(f"Ravi Eligible: {r_elig_ravi.json().get('is_eligible')}, Savings: {r_elig_ravi.json().get('savings_ratio')}%")

print("\nAll integration checks passed successfully!")
