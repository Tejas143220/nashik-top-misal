import urllib.request
import json

base_url = "http://127.0.0.1:8000"

endpoints = [
    ("/", "Root Endpoint"),
    ("/api/v1/shops/", "Misal Shops Directory"),
    ("/api/v1/shops/areas", "Popular Areas"),
    ("/api/v1/activities/", "Activities & Features"),
    ("/api/v1/battle/current", "Misal Battle"),
    ("/api/v1/coupons/", "Coupons & Discounts"),
    ("/api/v1/contest/leaderboard", "Photo Contest Leaderboard"),
    ("/api/v1/trail/curated", "Curated Misal Trails"),
    ("/api/v1/merchant/analytics", "Merchant Analytics")
]

print("==================================================")
print("  NASHIK TOP MISAL - SYSTEM & DB HEALTH CHECK")
print("==================================================\n")

all_passed = True
for ep, name in endpoints:
    url = base_url + ep
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            status = response.getcode()
            data = json.loads(response.read().decode())
            if status == 200:
                print(f"[OK] {name} ({ep}): Status 200")
            else:
                print(f"[FAIL] {name} ({ep}): Status {status}")
                all_passed = False
    except Exception as e:
        print(f"[FAIL] {name} ({ep}): Exception -> {e}")
        all_passed = False

print("\n--------------------------------------------------")
if all_passed:
    print("ALL BACKEND & DATABASE ENDPOINTS ARE 100% PERFECT!")
else:
    print("Some endpoints encountered errors.")
print("==================================================")
