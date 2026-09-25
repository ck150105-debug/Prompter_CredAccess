"""
CredAccess - Mock Gig Platform Databases
Simulates authorized platform APIs and records for:
Uber, Rapido, Swiggy, Zomato, Ola, Dunzo, Porter, Urban Company, Freelancer, Small Vendor
"""
from typing import Dict, Any, Optional, List

# Standard months for 12-month simulation
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

GIG_PLATFORM_RECORDS: Dict[str, Dict[str, Dict[str, Any]]] = {
    "Uber": {
        "UB10001": {
            "work_id": "UB10001",
            "worker_name": "Arun Kumar",
            "platform": "Uber",
            "account_status": "Active",
            "joining_date": "2024-01-15",
            "rating": 4.88,
            "total_trips": 2940,
            "monthly_earnings": {
                "Jan": 18000, "Feb": 20000, "Mar": 21000, "Apr": 22000,
                "May": 23000, "Jun": 22500, "Jul": 24000, "Aug": 23500,
                "Sep": 24500, "Oct": 25000, "Nov": 24000, "Dec": 26000
            }
        },
        "UB10002": {
            "work_id": "UB10002",
            "worker_name": "Priya Sharma",
            "platform": "Uber",
            "account_status": "Active",
            "joining_date": "2023-11-01",
            "rating": 4.92,
            "total_trips": 3410,
            "monthly_earnings": {
                "Jan": 26000, "Feb": 27200, "Mar": 26800, "Apr": 28000,
                "May": 29100, "Jun": 28400, "Jul": 30000, "Aug": 29500,
                "Sep": 31000, "Oct": 32000, "Nov": 30500, "Dec": 33000
            }
        },
        "UB10482": {
            "work_id": "UB10482",
            "worker_name": "Arun Kumar",
            "platform": "Uber",
            "account_status": "Active",
            "joining_date": "2024-03-15",
            "rating": 4.88,
            "total_trips": 2840,
            "monthly_earnings": {
                "Jan": 24500, "Feb": 26000, "Mar": 25200, "Apr": 27100,
                "May": 28500, "Jun": 26800, "Jul": 29000, "Aug": 27400,
                "Sep": 28200, "Oct": 30100, "Nov": 29400, "Dec": 31200
            }
        },
        "UB99120": {
            "work_id": "UB99120",
            "worker_name": "Rajesh Patel",
            "platform": "Uber",
            "account_status": "Suspended",
            "joining_date": "2024-07-10",
            "rating": 3.75,
            "total_trips": 320,
            "monthly_earnings": {}
        }
    },
    "Rapido": {
        "RP10001": {
            "work_id": "RP10001",
            "worker_name": "Arun Kumar",
            "platform": "Rapido",
            "account_status": "Active",
            "joining_date": "2024-01-10",
            "rating": 4.91,
            "total_rides": 3250,
            "monthly_earnings": {
                "Jan": 12000, "Feb": 13000, "Mar": 12500, "Apr": 13500,
                "May": 14000, "Jun": 13800, "Jul": 14500, "Aug": 14200,
                "Sep": 14800, "Oct": 15500, "Nov": 15000, "Dec": 16000
            }
        },
        "RP10002": {
            "work_id": "RP10002",
            "worker_name": "Vikram Singh",
            "platform": "Rapido",
            "account_status": "Active",
            "joining_date": "2024-05-12",
            "rating": 4.80,
            "total_rides": 1850,
            "monthly_earnings": {
                "Jan": 14000, "Feb": 14500, "Mar": 15000, "Apr": 15200,
                "May": 16000, "Jun": 15800, "Jul": 16500, "Aug": 16200,
                "Sep": 16800, "Oct": 17500, "Nov": 17000, "Dec": 18000
            }
        },
        "RP10234": {
            "work_id": "RP10234",
            "worker_name": "Arun Kumar",
            "platform": "Rapido",
            "account_status": "Active",
            "joining_date": "2024-01-10",
            "rating": 4.91,
            "total_rides": 3120,
            "monthly_earnings": {
                "Jan": 15500, "Feb": 16800, "Mar": 16000, "Apr": 17200,
                "May": 18000, "Jun": 17500, "Jul": 18500, "Aug": 17800,
                "Sep": 18200, "Oct": 19000, "Nov": 18600, "Dec": 19800
            }
        },
        "RP44021": {
            "work_id": "RP44021",
            "worker_name": "Vikram Singh",
            "platform": "Rapido",
            "account_status": "Active",
            "joining_date": "2024-05-12",
            "rating": 4.80,
            "total_rides": 1850,
            "monthly_earnings": {
                "Jan": 14000, "Feb": 14500, "Mar": 15000, "Apr": 15200,
                "May": 16000, "Jun": 15800, "Jul": 16500, "Aug": 16200,
                "Sep": 16800, "Oct": 17500, "Nov": 17000, "Dec": 18000
            }
        }
    },
    "Swiggy": {
        "SW10001": {
            "work_id": "SW10001",
            "worker_name": "Ravi",
            "platform": "Swiggy",
            "account_status": "Active",
            "joining_date": "2024-02-01",
            "rating": 4.75,
            "total_deliveries": 2420,
            "monthly_earnings": {
                "Jan": 28500, "Feb": 29200, "Mar": 28800, "Apr": 30100,
                "May": 30500, "Jun": 29800, "Jul": 31200, "Aug": 30400,
                "Sep": 30800, "Oct": 32000, "Nov": 31500, "Dec": 32800
            }
        },
        "SW10002": {
            "work_id": "SW10002",
            "worker_name": "Suresh Reddy",
            "platform": "Swiggy",
            "account_status": "Active",
            "joining_date": "2023-08-20",
            "rating": 4.89,
            "total_deliveries": 4190,
            "monthly_earnings": {
                "Jan": 31000, "Feb": 32000, "Mar": 31500, "Apr": 33000,
                "May": 34000, "Jun": 33500, "Jul": 35000, "Aug": 34200,
                "Sep": 35500, "Oct": 36000, "Nov": 35000, "Dec": 37000
            }
        },
        "SW99214": {
            "work_id": "SW99214",
            "worker_name": "Ravi",
            "platform": "Swiggy",
            "account_status": "Active",
            "joining_date": "2024-02-01",
            "rating": 4.75,
            "total_deliveries": 2420,
            "monthly_earnings": {
                "Jan": 28500, "Feb": 29200, "Mar": 28800, "Apr": 30100,
                "May": 30500, "Jun": 29800, "Jul": 31200, "Aug": 30400,
                "Sep": 30800, "Oct": 32000, "Nov": 31500, "Dec": 32800
            }
        }
    },
    "Zomato": {
        "ZO10001": {
            "work_id": "ZO10001",
            "worker_name": "Amit Verma",
            "platform": "Zomato",
            "account_status": "Active",
            "joining_date": "2024-04-18",
            "rating": 4.82,
            "total_deliveries": 2180,
            "monthly_earnings": {
                "Jan": 26500, "Feb": 27000, "Mar": 27800, "Apr": 28200,
                "May": 29000, "Jun": 28500, "Jul": 29800, "Aug": 29200,
                "Sep": 30100, "Oct": 31000, "Nov": 30500, "Dec": 32000
            }
        },
        "ZO10002": {
            "work_id": "ZO10002",
            "worker_name": "Rahul Mehta",
            "platform": "Zomato",
            "account_status": "Active",
            "joining_date": "2024-03-10",
            "rating": 4.85,
            "total_deliveries": 1950,
            "monthly_earnings": {
                "Jan": 25000, "Feb": 26000, "Mar": 26500, "Apr": 27000,
                "May": 28000, "Jun": 27500, "Jul": 28500, "Aug": 28000,
                "Sep": 29000, "Oct": 29500, "Nov": 29000, "Dec": 30500
            }
        },
        "ZM44102": {
            "work_id": "ZM44102",
            "worker_name": "Amit Verma",
            "platform": "Zomato",
            "account_status": "Active",
            "joining_date": "2024-04-18",
            "rating": 4.82,
            "total_deliveries": 2180,
            "monthly_earnings": {
                "Jan": 26500, "Feb": 27000, "Mar": 27800, "Apr": 28200,
                "May": 29000, "Jun": 28500, "Jul": 29800, "Aug": 29200,
                "Sep": 30100, "Oct": 31000, "Nov": 30500, "Dec": 32000
            }
        }
    },
    "Ola": {
        "OL10001": {
            "work_id": "OL10001",
            "worker_name": "Ramesh Yadav",
            "platform": "Ola",
            "account_status": "Active",
            "joining_date": "2023-10-14",
            "rating": 4.85,
            "total_trips": 3100,
            "monthly_earnings": {
                "Jan": 31000, "Feb": 32500, "Mar": 31800, "Apr": 33200,
                "May": 34500, "Jun": 33800, "Jul": 35200, "Aug": 34600,
                "Sep": 35800, "Oct": 37000, "Nov": 36200, "Dec": 38000
            }
        },
        "OL10002": {
            "work_id": "OL10002",
            "worker_name": "Manoj Kumar",
            "platform": "Ola",
            "account_status": "Active",
            "joining_date": "2024-02-20",
            "rating": 4.78,
            "total_trips": 2240,
            "monthly_earnings": {
                "Jan": 28000, "Feb": 29000, "Mar": 28500, "Apr": 30000,
                "May": 31000, "Jun": 30500, "Jul": 31500, "Aug": 31000,
                "Sep": 32000, "Oct": 33000, "Nov": 32500, "Dec": 34000
            }
        },
        "OL55231": {
            "work_id": "OL55231",
            "worker_name": "Ramesh Yadav",
            "platform": "Ola",
            "account_status": "Active",
            "joining_date": "2023-10-14",
            "rating": 4.85,
            "total_trips": 3100,
            "monthly_earnings": {
                "Jan": 31000, "Feb": 32500, "Mar": 31800, "Apr": 33200,
                "May": 34500, "Jun": 33800, "Jul": 35200, "Aug": 34600,
                "Sep": 35800, "Oct": 37000, "Nov": 36200, "Dec": 38000
            }
        }
    },
    "Dunzo": {
        "DU10001": {
            "work_id": "DU10001",
            "worker_name": "Mohan Lal",
            "platform": "Dunzo",
            "account_status": "Active",
            "joining_date": "2024-06-01",
            "rating": 4.79,
            "total_orders": 1420,
            "monthly_earnings": {
                "Jan": 18500, "Feb": 19000, "Mar": 19200, "Apr": 19800,
                "May": 20500, "Jun": 20000, "Jul": 21200, "Aug": 20800,
                "Sep": 21500, "Oct": 22000, "Nov": 21800, "Dec": 22500
            }
        },
        "DZ11029": {
            "work_id": "DZ11029",
            "worker_name": "Mohan Lal",
            "platform": "Dunzo",
            "account_status": "Active",
            "joining_date": "2024-06-01",
            "rating": 4.79,
            "total_orders": 1420,
            "monthly_earnings": {
                "Jan": 18500, "Feb": 19000, "Mar": 19200, "Apr": 19800,
                "May": 20500, "Jun": 20000, "Jul": 21200, "Aug": 20800,
                "Sep": 21500, "Oct": 22000, "Nov": 21800, "Dec": 22500
            }
        }
    },
    "Porter": {
        "PO10001": {
            "work_id": "PO10001",
            "worker_name": "Ganesh Naik",
            "platform": "Porter",
            "account_status": "Active",
            "joining_date": "2023-12-10",
            "rating": 4.90,
            "total_deliveries": 1980,
            "monthly_earnings": {
                "Jan": 33000, "Feb": 34200, "Mar": 33800, "Apr": 35500,
                "May": 36800, "Jun": 36000, "Jul": 37500, "Aug": 37000,
                "Sep": 38200, "Oct": 39500, "Nov": 39000, "Dec": 41000
            }
        },
        "PR77201": {
            "work_id": "PR77201",
            "worker_name": "Ganesh Naik",
            "platform": "Porter",
            "account_status": "Active",
            "joining_date": "2023-12-10",
            "rating": 4.90,
            "total_deliveries": 1980,
            "monthly_earnings": {
                "Jan": 33000, "Feb": 34200, "Mar": 33800, "Apr": 35500,
                "May": 36800, "Jun": 36000, "Jul": 37500, "Aug": 37000,
                "Sep": 38200, "Oct": 39500, "Nov": 39000, "Dec": 41000
            }
        }
    },
    "Urban Company": {
        "UC10001": {
            "work_id": "UC10001",
            "worker_name": "Sunita Devi",
            "platform": "Urban Company",
            "account_status": "Active",
            "joining_date": "2024-02-15",
            "rating": 4.94,
            "total_services": 820,
            "monthly_earnings": {
                "Jan": 35000, "Feb": 36500, "Mar": 35800, "Apr": 37200,
                "May": 38500, "Jun": 38000, "Jul": 39800, "Aug": 39000,
                "Sep": 40500, "Oct": 42000, "Nov": 41200, "Dec": 43500
            }
        },
        "UC33910": {
            "work_id": "UC33910",
            "worker_name": "Sunita Devi",
            "platform": "Urban Company",
            "account_status": "Active",
            "joining_date": "2024-02-15",
            "rating": 4.94,
            "total_services": 820,
            "monthly_earnings": {
                "Jan": 35000, "Feb": 36500, "Mar": 35800, "Apr": 37200,
                "May": 38500, "Jun": 38000, "Jul": 39800, "Aug": 39000,
                "Sep": 40500, "Oct": 42000, "Nov": 41200, "Dec": 43500
            }
        }
    },
    "Freelancer": {
        "FL10001": {
            "work_id": "FL10001",
            "worker_name": "Anand Joshi",
            "platform": "Freelancer",
            "account_status": "Active",
            "joining_date": "2023-09-01",
            "rating": 4.88,
            "total_projects": 46,
            "monthly_earnings": {
                "Jan": 28000, "Feb": 29000, "Mar": 30000, "Apr": 31000,
                "May": 32000, "Jun": 31500, "Jul": 33000, "Aug": 32500,
                "Sep": 34000, "Oct": 35000, "Nov": 34500, "Dec": 36000
            }
        },
        "FL88210": {
            "work_id": "FL88210",
            "worker_name": "Anand Joshi",
            "platform": "Freelancer",
            "account_status": "Active",
            "joining_date": "2023-09-01",
            "rating": 4.88,
            "total_projects": 46,
            "monthly_earnings": {
                "Jan": 28000, "Feb": 29000, "Mar": 30000, "Apr": 31000,
                "May": 32000, "Jun": 31500, "Jul": 33000, "Aug": 32500,
                "Sep": 34000, "Oct": 35000, "Nov": 34500, "Dec": 36000
            }
        }
    },
    "Small Vendor": {
        "SV10001": {
            "work_id": "SV10001",
            "worker_name": "Deepa Nair",
            "platform": "Small Vendor",
            "account_status": "Active",
            "joining_date": "2024-01-20",
            "rating": 4.85,
            "total_orders": 980,
            "monthly_earnings": {
                "Jan": 30000, "Feb": 31000, "Mar": 31500, "Apr": 32500,
                "May": 33500, "Jun": 33000, "Jul": 34500, "Aug": 34000,
                "Sep": 35500, "Oct": 36500, "Nov": 36000, "Dec": 37500
            }
        },
        "SV55102": {
            "work_id": "SV55102",
            "worker_name": "Deepa Nair",
            "platform": "Small Vendor",
            "account_status": "Active",
            "joining_date": "2024-01-20",
            "rating": 4.85,
            "total_orders": 980,
            "monthly_earnings": {
                "Jan": 30000, "Feb": 31000, "Mar": 31500, "Apr": 32500,
                "May": 33500, "Jun": 33000, "Jul": 34500, "Aug": 34000,
                "Sep": 35500, "Oct": 36500, "Nov": 36000, "Dec": 37500
            }
        }
    }
}

def mask_work_id(work_id: str) -> str:
    """Masks work ID for privacy (e.g. UB10001 -> UB****001, UB10483 -> UB****483)"""
    if not work_id or len(work_id) < 4:
        return work_id
    prefix = work_id[:2]
    suffix = work_id[-3:] if len(work_id) >= 5 else work_id[-1:]
    return f"{prefix}****{suffix}"

def verify_platform_worker(platform: str, work_id: str) -> Dict[str, Any]:
    """
    Checks the entered Work ID against the selected gig-platform mock database.
    Returns status, active verification flag, and details.
    """
    clean_platform = platform.strip()
    clean_id = work_id.strip().upper()

    # Search in exact or matched platform name
    matched_platform_name = None
    for p in GIG_PLATFORM_RECORDS.keys():
        if p.lower() == clean_platform.lower():
            matched_platform_name = p
            break

    if not matched_platform_name:
        # Fallback support for generic / other
        if clean_id.startswith("TEST") or clean_id.startswith("DEMO") or clean_id.startswith("VALID"):
            return {
                "platform": platform,
                "work_id": work_id,
                "masked_work_id": mask_work_id(work_id),
                "worker_name": "Verified Gig Professional",
                "status": "Active",
                "is_verified": True,
                "joining_date": "2024-01-01",
                "message": f"Successfully verified with {platform} partner system."
            }
        return {
            "platform": platform,
            "work_id": work_id,
            "masked_work_id": mask_work_id(work_id),
            "worker_name": None,
            "status": "Not Supported",
            "is_verified": False,
            "joining_date": None,
            "message": f"We could not verify this Work ID with {platform}. Integration not recognized."
        }

    platform_db = GIG_PLATFORM_RECORDS[matched_platform_name]
    
    if clean_id in platform_db:
        record = platform_db[clean_id]
        if record["account_status"] == "Active":
            return {
                "platform": matched_platform_name,
                "work_id": clean_id,
                "masked_work_id": mask_work_id(clean_id),
                "worker_name": record["worker_name"],
                "status": record["account_status"],
                "is_verified": True,
                "joining_date": record["joining_date"],
                "message": f"Employment Verified ✓. Active account since {record['joining_date']}."
            }
        else:
            return {
                "platform": matched_platform_name,
                "work_id": clean_id,
                "masked_work_id": mask_work_id(clean_id),
                "worker_name": record["worker_name"],
                "status": record["account_status"],
                "is_verified": False,
                "joining_date": record["joining_date"],
                "message": f"Account verification failed. Status is '{record['account_status']}' on {matched_platform_name}."
            }
    else:
        return {
            "platform": matched_platform_name,
            "work_id": clean_id,
            "masked_work_id": mask_work_id(clean_id),
            "worker_name": None,
            "status": "Failed",
            "is_verified": False,
            "joining_date": None,
            "message": f"We could not verify this Work ID with {matched_platform_name}. Please check the Work ID and try again."
        }

def get_platform_earnings_history(platform: str, work_id: str) -> Dict[str, float]:
    """Retrieves 12-month earnings history for a verified platform ID"""
    clean_platform = platform.strip()
    clean_id = work_id.strip().upper()
    
    for p_name, db in GIG_PLATFORM_RECORDS.items():
        if p_name.lower() == clean_platform.lower():
            if clean_id in db:
                return db[clean_id].get("monthly_earnings", {})

    # Default synthetic earnings if verified fallback
    return {m: 25000.0 for m in MONTHS}

def get_supported_platforms_list() -> List[Dict[str, Any]]:
    """Returns list of platforms and sample demo IDs for testing ease"""
    result = []
    for platform, items in GIG_PLATFORM_RECORDS.items():
        demo_ids = [k for k, v in items.items() if v["account_status"] == "Active"]
        result.append({
            "name": platform,
            "sample_valid_id": demo_ids[0] if demo_ids else None,
            "worker_sample": items[demo_ids[0]]["worker_name"] if demo_ids else None
        })
    return result
