import json
import os
import requests
from concurrent.futures import ThreadPoolExecutor

def verify_data():
    print("Starting data verification...")
    
    ports_path = 'public/data/ports.json'
    countries_path = 'public/data/countries.json'
    
    if not os.path.exists(ports_path) or not os.path.exists(countries_path):
        print("Error: Data files not found. Run prepare-final-data.py first.")
        return

    with open(ports_path, 'r', encoding='utf-8') as f:
        ports = json.load(f)
    
    with open(countries_path, 'r', encoding='utf-8') as f:
        countries = json.load(f)
        
    country_codes = {c['iso_alpha2'] for c in countries}
    
    issues = []
    
    print(f"Verifying {len(ports)} ports...")
    
    def check_website(url):
        if not url:
            return True
        try:
            # Only check a small sample or use a timeout to keep it fast
            response = requests.head(url, timeout=3, allow_redirects=True)
            return response.status_code < 400
        except:
            return False

    # For verification, we'll check coordinates, UNLOCODE format, and basic fields
    for port in ports:
        unlocode = port.get('unlocode', '')
        name = port.get('name', '')
        lat = port.get('latitude')
        lon = port.get('longitude')
        cc = port.get('country_code')
        
        # 1. Check UN/LOCODE format (5 chars: 2 letters + 3 letters/numbers)
        if not unlocode or len(unlocode) != 5:
            issues.append(f"Invalid UNLOCODE format: {unlocode} for {name}")
            
        # 2. Check coordinates
        if lat is None or lon is None:
            issues.append(f"Missing coordinates for {name} ({unlocode})")
        elif not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
            issues.append(f"Coordinates out of bounds: {lat}, {lon} for {name}")
            
        # 3. Check country code
        if cc not in country_codes:
            issues.append(f"Country code {cc} not found in countries.json for {name}")
            
        # 4. Check plausibility
        teu = port.get('annual_teu', 0)
        depth = port.get('max_depth_m', 0)
        
        if teu > 50000000: # 50M TEU is extremely high (Shanghai is ~47M)
            issues.append(f"Plausibility warning: Very high TEU ({teu}) for {name}")
        
        if depth > 40: # 40m is extremely deep for a commercial port
            issues.append(f"Plausibility warning: Very high depth ({depth}m) for {name}")

    if not issues:
        print("Verification successful! No major issues found.")
    else:
        print(f"Verification found {len(issues)} issues:")
        for issue in issues[:20]: # Show first 20
            print(f"- {issue}")
        if len(issues) > 20:
            print(f"... and {len(issues) - 20} more.")
            
    # Save issues to log
    with open('scripts/verification_report.txt', 'w', encoding='utf-8') as f:
        f.write("\n".join(issues))
    print(f"Full report saved to scripts/verification_report.txt")

if __name__ == "__main__":
    verify_data()
