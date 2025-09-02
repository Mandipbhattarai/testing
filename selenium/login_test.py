import os
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from utils import make_driver, BASE_URL, SECURITY_MODE, result

def run():
    rows = []
    driver = make_driver()
    try:
        # user login
        driver.get(f"{BASE_URL}/login")
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "input.input")))
        inputs = driver.find_elements(By.CSS_SELECTOR, "input.input")
        inputs[0].send_keys("user@example.com")
        inputs[1].send_keys("User123!")
        driver.find_element(By.CSS_SELECTOR, "button.btn").click()
        WebDriverWait(driver, 10).until(EC.url_contains("/dashboard"))
        rows.append(result("login_user_flow", "", "PASS", "User redirected to /dashboard", driver.current_url))

        # admin login
        driver.get(f"{BASE_URL}/admin-login")
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "input.input")))
        inputs = driver.find_elements(By.CSS_SELECTOR, "input.input")
        inputs[0].clear(); inputs[1].clear()
        inputs[0].send_keys("admin@example.com")
        inputs[1].send_keys("Admin123!")
        driver.find_element(By.CSS_SELECTOR, "button.btn").click()
        WebDriverWait(driver, 10).until(EC.url_contains("/admin"))
        rows.append(result("login_admin_flow", "", "PASS", "Admin redirected to /admin", driver.current_url))
    except Exception as e:
        rows.append(result("login_flow", "", "FAIL", str(e), driver.current_url if driver.current_url else f"{BASE_URL}/login"))
    finally:
        driver.quit()
    return rows

if __name__ == "__main__":
    from utils import write_reports
    prefix = os.environ.get("REPORT_PREFIX", "reports/selenium_manual")
    write_reports(prefix, run())
