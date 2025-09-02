# Test Plan

## White-box (Jest)
- `lib/sanitize.test.ts`
  - Accept safe inputs
  - Reject SQLi payloads from `tests/payloads/sqli.txt`
  - Reject XSS payloads from `tests/payloads/xss.txt`
- `lib/auth.test.ts`
  - In `secure` mode: authenticate valid/invalid credentials
  - In `vulnerable` mode: SQLi payload should bypass login

## Black-box (Selenium)
Run twice:
- Initial (`SECURITY_MODE=vulnerable`):
  - `login_test.py` – user/admin login redirect to `/dashboard` and `/admin`
  - `register_test.py` – register new user then login
  - `sqli_test.py` – try payloads from `tests/payloads/sqli.txt`; expect redirect (bypass) for at least one payload in vulnerable mode
  - `xss_test.py` – email field as XSS payload; expect JavaScript alert due to reflected unsanitized error
  - Reports: `reports/selenium_initial.csv` and `.json`
- Final (`SECURITY_MODE=secure`):
  - Same tests; expect blocks for SQLi/XSS with message "Unsafe input detected" and no alerts
  - Reports: `reports/selenium_final.csv` and `.json`

## Acceptance
- Vulnerable: SQLi login bypass, reflected XSS alert
- Secure: Blocks with "Unsafe input detected"
- Normal flows succeed in both modes
