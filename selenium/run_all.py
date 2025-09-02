import argparse
import os
from utils import write_reports

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--report-prefix", required=True, help="reports/selenium_initial or reports/selenium_final")
    args = parser.parse_args()

    # Import tests
    from login_test import run as login_run
    from register_test import run as register_run
    from sqli_test import run as sqli_run
    from xss_test import run as xss_run

    rows = []
    rows.extend(login_run())
    rows.extend(register_run())
    rows.extend(sqli_run())
    rows.extend(xss_run())

    write_reports(args.report_prefix, rows)

if __name__ == "__main__":
    main()
