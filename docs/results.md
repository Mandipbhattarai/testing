# Results Summary

Example rows (abbreviated):

Initial (vulnerable):
- 2025-01-01T00:00:00Z, sqli_login, ' OR '1'='1 --, FAIL, Vulnerability FOUND: login bypass, http://localhost:3000/dashboard
- 2025-01-01T00:00:02Z, xss_login_error, <script>alert('XSS')</script>, FAIL, XSS Executed: XSS, http://localhost:3000/login

Final (secure):
- 2025-01-01T00:10:00Z, sqli_login, ' OR '1'='1 --, PASS, Blocked as expected, http://localhost:3000/login
- 2025-01-01T00:10:02Z, xss_login_error, <script>alert('XSS')</script>, PASS, Blocked as expected, http://localhost:3000/login

Short analysis:
- The initial run reveals classic authentication SQLi and reflected XSS issues.
- The final secure run blocks these vectors via parameterized queries and strict input validation.
- Normal login/register workflows function across both modes, with proper role-based redirects.
