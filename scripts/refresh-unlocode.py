import json
import os
import requests
import csv
from io import StringIO
import re

def slugify(text):
    text = str(text).lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text).strip('-')
    return text

def refresh_unlocode_data():
    """
    Fetches official UN/LOCODE data to create a comprehensive list of real sea ports.
    """
    print("Starting comprehensive UN/LOCODE data refresh...")
    
    # 1. Load Country Info
    countries_path = 'public/data/countries-info.json'
    if not os.path.exists(countries_path):
        print(f"Error: {countries_path} not found.")
        return
    with open(countries_path, 'r', encoding='utf-8') as f:
        countries_source = json.load(f)
    
    country_map = {c['country_code']: c for c in countries_source}
    print(f"Loaded {len(country_map)} countries.")

    # 2. Fetch UN/LOCODE Data
    unlocode_url = "https://raw.githubusercontent.com/datasets/un-locode/main/data/code-list.csv"
    print(f"Step 2: Fetching latest UN/LOCODE from {unlocode_url}")
    
    try:
        response = requests.get(unlocode_url, timeout=30)
        response.raise_for_status()
        unlocode_csv = response.text
        print("Successfully fetched UN/LOCODE data.")
    except Exception as e:
        print(f"Error fetching UN/LOCODE data: {e}")
        return

    # 3. Parse UN/LOCODE
    print("Step 3: Parsing UN/LOCODE data for ports (Sea/Air/Dry)...")
    unlocode_reader = csv.DictReader(StringIO(unlocode_csv))
    
    real_ports = []
    seen_codes = set()
    
    for row in unlocode_reader:
        functions = row.get('Function', '')
        # '1' is Sea Port, '4' is Airport, '6' is Inland Port/Dry Port
        
        port_type = None
        if '1' in functions:
            port_type = "sea_port"
        elif '4' in functions:
            port_type = "airport"
        elif '6' in functions:
            port_type = "dry_port"
            
        if not port_type:
            continue
            
        country_code = row.get('Country', '')
        location_code = row.get('Location', '')
        code = f"{country_code}{location_code}"
        
        if len(code) != 5 or (code, port_type) in seen_codes:
            continue
            
        if country_code not in country_map:
            continue

        country = country_map[country_code]
        name = row.get('NameWoDiacritics') or row.get('Name')
        
        # Parse coordinates (Format: 4 digits Lat + 5 digits Lon + N/S/E/W)
        # Example: 3113N 12130E
        coords_raw = row.get('Coordinates', '')
        lat = 0.0
        lon = 0.0
        if coords_raw and len(coords_raw) >= 10:
            try:
                lat_str = coords_raw[:4]
                lat_dir = coords_raw[4]
                lon_str = coords_raw[6:11]
                lon_dir = coords_raw[11]
                
                lat = float(lat_str[:2]) + float(lat_str[2:]) / 60.0
                if lat_dir == 'S': lat = -lat
                
                lon = float(lon_str[:3]) + float(lon_str[3:]) / 60.0
                if lon_dir == 'W': lon = -lon
            except:
                pass

        port_entry = {
            "unlocode": code,
            "name": name,
            "slug": f"{slugify(name)}-{code.lower()}",
            "country_code": country_code,
            "country_name": country['name'],
            "city": name,
            "port_type": port_type,
            "latitude": round(lat, 4),
            "longitude": round(lon, 4),
            "is_active": True,
            "annual_teu": 0,
            "max_depth_m": 0,
            "timezone": country.get('timezone', 'UTC'),
            "details": {
                "website": "",
                "harbor_size": "N/A",
                "harbor_type": "N/A"
            }
        }
        real_ports.append(port_entry)
        seen_codes.add((code, port_type))

    print(f"Found {len(real_ports)} valid ports in UN/LOCODE list.")

    # 4. Enrich with known top ports data (TEU, Depth, etc.)
    top_ports_data = {
        "SGSIN": {"annual_teu": 37200000, "max_depth_m": 16.0, "website": "https://www.jp.com.sg/"},
        "CNSHA": {"annual_teu": 43500000, "max_depth_m": 15.0, "website": "https://www.portshanghai.com.cn/"},
        "NLRTM": {"annual_teu": 14500000, "max_depth_m": 24.0, "website": "https://www.portofrotterdam.com/"},
        "AEJEA": {"annual_teu": 14100000, "max_depth_m": 17.0, "website": "https://www.dpworld.com/jebel-ali"},
        "USLAX": {"annual_teu": 9200000, "max_depth_m": 16.0, "website": "https://www.portoflosangeles.org/"},
        "PKKHI": {"annual_teu": 4500000, "max_depth_m": 15.0, "website": "https://kpt.gov.pk/"},
        "KRPUS": {"annual_teu": 22000000, "max_depth_m": 16.0, "website": "https://www.busanpa.com/"},
        "DEHAM": {"annual_teu": 8500000, "max_depth_m": 15.0, "website": "https://www.hafen-hamburg.de/"},
        "BEANR": {"annual_teu": 12000000, "max_depth_m": 16.0, "website": "https://www.portofantwerpbruges.com/"},
        "CNHKO": {"annual_teu": 18000000, "max_depth_m": 15.5, "website": "https://www.mhkpa.com.hk/"},
        "MYPKG": {"annual_teu": 13700000, "max_depth_m": 17.5, "website": "https://www.pka.gov.my/"},
        "THLCH": {"annual_teu": 8300000, "max_depth_m": 16.0, "website": "https://www.laemchabangport.com/"},
        "VNSGN": {"annual_teu": 7200000, "max_depth_m": 13.0, "website": "https://www.saigonport.com.vn/"},
        "IDTPP": {"annual_teu": 7800000, "max_depth_m": 14.0, "website": "https://www.indoport.co.id/"},
        "PHMNL": {"annual_teu": 5000000, "max_depth_m": 12.0, "website": "https://www.ppa.com.ph/"},
        "BRSSZ": {"annual_teu": 4200000, "max_depth_m": 15.0, "website": "https://www.portodesantos.com.br/"},
        "MXZLO": {"annual_teu": 3100000, "max_depth_m": 15.0, "website": "https://www.puertomanzanillo.com.mx/"},
        "ZADUR": {"annual_teu": 2600000, "max_depth_m": 12.8, "website": "https://www.transnetportauthorities.net/"},
        "GRpira": {"annual_teu": 5400000, "max_depth_m": 18.0, "website": "https://www.olp.gr/"},
        "ESBCN": {"annual_teu": 3500000, "max_depth_m": 16.0, "website": "https://www.portdebarcelona.cat/"},
    }

    enriched_count = 0
    for port in real_ports:
        code = port['unlocode']
        if code in top_ports_data:
            data = top_ports_data[code]
            port['annual_teu'] = data['annual_teu']
            port['max_depth_m'] = data['max_depth_m']
            port['details']['website'] = data['website']
            enriched_count += 1
        elif code.upper() in top_ports_data: # Handle case sensitivity
            data = top_ports_data[code.upper()]
            port['annual_teu'] = data['annual_teu']
            port['max_depth_m'] = data['max_depth_m']
            port['details']['website'] = data['website']
            enriched_count += 1

    print(f"Enriched {enriched_count} top ports with TEU and depth data.")

    # 5. Save to ports-main.json
    output_path = 'public/data/ports-main.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(real_ports, f, indent=2, ensure_ascii=False)
    
    print(f"Successfully saved {len(real_ports)} real ports to {output_path}")

if __name__ == "__main__":
    refresh_unlocode_data()
