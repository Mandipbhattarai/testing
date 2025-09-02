import os
import time
from utils import make_driver, BASE_URL, SECURITY_MODE, result
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

PAYLOADS_PATH = os.path.join("tests", "payloads", "xss.txt")

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
                fields[1].send_keys("wrongpassword")
                driver.find_element(By.CSS_SELECTOR, "button.btn").click()

                # Allow error to render
                time.sleep(0.8)
                if SECURITY_MODE == "vulnerable":
                    try:
                        alert = driver.switch_to.alert
                        # If an alert is present, XSS executed
                        text = alert.text
                        alert.accept()
                        rows.append(result("xss_login_error", p, "FAIL", f"XSS Executed: {text}", driver.current_url))
                    except Exception:
                        rows.append(result("xss_login_error", p, "PASS", "No alert present", driver.current_url))
                else:
                    # Secure: Expect simple text error and no alert
                    try:
                        _ = driver.switch_to.alert
                        rows.append(result("xss_login_error", p, "FAIL", "Alert appeared in secure mode", driver.current_url))
                    except Exception:
                        rows.append(result("xss_login_error", p, "PASS", "Blocked as expected", driver.current_url))
            except Exception as e:
                rows.append(result("xss_login_error", p, "ERROR", str(e), driver.current_url))
    finally:
        driver.quit()
    return rows

if __name__ == "__main__":
    from utils import write_reports
    prefix = os.environ.get("REPORT_PREFIX", "reports/selenium_manual")
    write_reports(prefix, run())
