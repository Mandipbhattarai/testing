import os
import random
import string
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from utils import make_driver, BASE_URL, result

def rand_email():
    s = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"{s}@example.com"

def run():
    rows = []
    driver = make_driver()
    try:
        email = rand_email()
        driver.get(f"{BASE_URL}/register")
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "input.input")))
        inputs = driver.find_elements(By.CSS_SELECTOR, "input.input")
        inputs[0].send_keys(email)
        inputs[1].send_keys("StrongPass123!")
        driver.find_element(By.CSS_SELECTOR, "button.btn").click()
        # Success message
        WebDriverWait(driver, 10).until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, ".text-emerald-700"), "Registration successful"))
        rows.append(result("register_user", "", "PASS", f"Registered {email}", driver.current_url))

        # Then login
        driver.get(f"{BASE_URL}/login")
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "input.input")))
        inputs = driver.find_elements(By.CSS_SELECTOR, "input.input")
        inputs[0].send_keys(email)
        inputs[1].send_keys("StrongPass123!")
        driver.find_element(By.CSS_SELECTOR, "button.btn").click()
        WebDriverWait(driver, 10).until(EC.url_contains("/dashboard"))
        rows.append(result("login_registered_user", "", "PASS", f"Logged in {email}", driver.current_url))
    except Exception as e:
        rows.append(result("register_login_flow", "", "FAIL", str(e), driver.current_url))
    finally:
        driver.quit()
    return rows

if __name__ == "__main__":
    from utils import write_reports
    prefix = os.environ.get("REPORT_PREFIX", "reports/selenium_manual")
    write_reports(prefix, run())
