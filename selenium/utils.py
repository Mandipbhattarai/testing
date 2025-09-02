import csv
import json
import os
import time
from datetime import datetime
from typing import List, Dict
from selenium.webdriver.chrome.service import Service

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

BASE_URL = os.environ.get("APP_URL", "http://localhost:3000")
SECURITY_MODE = os.environ.get("SECURITY_MODE", "vulnerable")

def make_driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1280,800")

    # Explicit Chrome path (adjust if different on your system)
    options.binary_location = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.set_page_load_timeout(20)
    return driver


def ts():
    return datetime.utcnow().isoformat()

def write_reports(prefix: str, rows: List[Dict]):
    os.makedirs(os.path.dirname(prefix), exist_ok=True)
    csv_path = f"{prefix}.csv"
    json_path = f"{prefix}.json"

    # CSV
    headers = ["timestamp", "test_name", "payload", "outcome", "notes", "url"]
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=headers)
        w.writeheader()
        for r in rows:
            w.writerow({k: r.get(k, "") for k in headers})

    # JSON
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=2)

def result(test_name: str, payload: str, outcome: str, notes: str, url: str):
    return {
        "timestamp": ts(),
        "test_name": test_name,
        "payload": payload,
        "outcome": outcome,
        "notes": notes,
        "url": url
    }
