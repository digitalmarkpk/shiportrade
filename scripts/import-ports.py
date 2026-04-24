import os
import sqlite3
import json
import csv
import zipfile
import requests
from io import BytesIO, StringIO

# Configuration
UNLOCODE_ZIP_URL = "https://service.unece.org/trade/locode/loc242csv.zip"
WORLDBANK_PORTS_CSV = "https://datacatalog.worldbank.org/search/dataset/0038118" # Note: This is a landing page, normally would need direct link or local file
DB_PATH = "ports.db"
JSON_PATH = "public/data/ports.json"

def setup_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ports (
            id INTEGER PRIMARY KEY,
            unlocode TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            country_code TEXT,
            country_name TEXT,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            function TEXT,
            port_type TEXT DEFAULT 'Sea Port',
            terminals INTEGER DEFAULT 0,
            max_depth_m REAL,
            website TEXT,
            phone TEXT,
            address TEXT,
            annual_teu INTEGER,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    return conn

def download_and_parse_unlocode():
    print(f"Downloading UN/LOCODE from {UNLOCODE_ZIP_URL}...")
    response = requests.get(UNLOCODE_ZIP_URL)
    z = zipfile.ZipFile(BytesIO(response.content))
    
    ports = []
    # UN/LOCODE zip usually contains multiple CSV files like 2024-1 CodeList.csv
    for filename in z.namelist():
        if "CodeList" in filename:
            with z.open(filename) as f:
                content = f.read().decode('latin-1')
                reader = csv.reader(StringIO(content))
                for row in reader:
                    if len(row) < 10: continue
                    
                    # Row structure: Change, Country, Location, Name, NameWoDiacritics, Subdivision, Function, Status, Date, IATA, Coordinates, Remarks
                    country_code = row[1]
                    location_code = row[2]
                    name = row[3]
                    function = row[6]
                    coords = row[10] # Format: 1234N 01234E or 1234S 01234W
                    
                    # Filter for ports (Function '1' for sea ports, '3' for road terminals/ports)
                    if '1' in function or '3' in function:
                        if coords:
                            lat, lon = parse_coords(coords)
                            if lat is not None:
                                ports.append({
                                    "unlocode": f"{country_code}{location_code}",
                                    "name": name,
                                    "country_code": country_code,
                                    "latitude": lat,
                                    "longitude": lon,
                                    "function": function
                                })
    return ports

def parse_coords(coords_str):
    # Example: 2451N 06659E
    try:
        parts = coords_str.split()
        if len(parts) != 2: return None, None
        
        lat_str, lon_str = parts
        
        # Lat: 2451N -> 24.85
        lat_deg = int(lat_str[:2])
        lat_min = int(lat_str[2:4])
        lat = lat_deg + (lat_min / 60)
        if 'S' in lat_str: lat = -lat
        
        # Lon: 06659E -> 66.98
        lon_deg = int(lon_str[:3])
        lon_min = int(lon_str[3:5])
        lon = lon_deg + (lon_min / 60)
        if 'W' in lon_str: lon = -lon
        
        return round(lat, 4), round(lon, 4)
    except:
        return None, None

def main():
    # Sample data for initial run if download fails or for demonstration
    sample_ports = [
        ("PKKHI", "Karachi", "PK", "Pakistan", 24.84, 66.97, "1--", "Sea Port", 4, 15.0, 4500000),
        ("PKPQA", "Port Qasim", "PK", "Pakistan", 24.77, 67.35, "1--", "Sea Port", 3, 14.0, 1200000),
        ("PKGWD", "Gwadar", "PK", "Pakistan", 25.12, 62.33, "1--", "Sea Port", 1, 14.5, 50000),
        ("SGSIN", "Singapore", "SG", "Singapore", 1.26, 103.8, "1--", "Sea Port", 50, 18.0, 37000000),
        ("CNSHA", "Shanghai", "CN", "China", 31.23, 121.47, "1--", "Sea Port", 40, 16.0, 43000000),
        ("NLRTM", "Rotterdam", "NL", "Netherlands", 51.92, 4.48, "1--", "Sea Port", 15, 24.0, 14000000),
        ("AEJEA", "Jebel Ali", "AE", "UAE", 25.01, 55.06, "1--", "Sea Port", 12, 17.0, 19000000),
        ("USLAX", "Los Angeles", "US", "USA", 33.74, -118.27, "1--", "Sea Port", 8, 16.0, 9000000)
    ]

    conn = setup_db()
    cursor = conn.cursor()

    print("Inserting sample ports...")
    for port in sample_ports:
        try:
            cursor.execute('''
                INSERT OR REPLACE INTO ports 
                (unlocode, name, country_code, country_name, latitude, longitude, function, port_type, terminals, max_depth_m, annual_teu)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', port)
        except Exception as e:
            print(f"Error inserting {port[0]}: {e}")

    conn.commit()

    # Export to JSON
    print(f"Exporting to {JSON_PATH}...")
    cursor.execute("SELECT * FROM ports")
    columns = [column[0] for column in cursor.description]
    results = []
    for row in cursor.fetchall():
        results.append(dict(zip(columns, row)))

    os.makedirs(os.path.dirname(JSON_PATH), exist_ok=True)
    with open(JSON_PATH, "w") as f:
        json.dump(results, f, indent=2)

    conn.close()
    print("Done!")

if __name__ == "__main__":
    main()
