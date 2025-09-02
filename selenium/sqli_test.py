import os
import time
from utils import make_driver, BASE_URL, SECURITY_MODE, result
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

PAYLOADS_PATH = os.path.join("tests", "payloads", "sqli.txt")

def run():
    rows = []
    driver = make_driver()
    try:
        with open(PAYLOADS_PATH, "r", encoding="utf-8") as f:
            payloads = [line.strip() for line in f.readlines() if line.strip()]
        for p in payloads:
            try:
                driver.get(f"{BASE_URL}/login")
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "input.input")))
                fields = driver.find_elements(By.CSS_SELECTOR, "input.input")
                fields[0].clear(); fields[1].clear()
                fields[0].send_keys(p)
                fields[1].send_keys("anything")
                driver.find_element(By.CSS_SELECTOR, "button.btn").click()

                time.sleep(1.0)  # let any redirect occur

                if SECURITY_MODE == "vulnerable":
                  # If SQLi succeeds, we expect redirect to /dashboard or /admin
                  url = driver.current_url
                  if "/dashboard" in url or "/admin" in url:
                      rows.append(result("sqli_login", p, "FAIL", "Vulnerability FOUND: login bypass", url))
                  else:
                      rows.append(result("sqli_login", p, "PASS", "No redirect occurred", url))
                else:
                  # secure mode: expect error message "Unsafe input detected" and no redirect
                  url = driver.current_url
                  if "/dashboard" in url or "/admin" in url:
                      rows.append(result("sqli_login", p, "FAIL", "Unexpected redirect in secure mode", url))
                  else:
                      rows.append(result("sqli_login", p, "PASS", "Blocked as expected", url))
            except Exception as e:
                rows.append(result("sqli_login", p, "ERROR", str(e), driver.current_url))
    finally:
        driver.quit()
    return rows

if __name__ == "__main__":
    from utils import write_reports
    prefix = os.environ.get("REPORT_PREFIX", "reports/selenium_manual")
    write_reports(prefix, run())
