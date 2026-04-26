import json
with open('public/data/ports.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
pk_ports = [p for p in data if p['country_code'] == 'PK']
print(f"Total PK ports: {len(pk_ports)}")
valid_coords = [p for p in pk_ports if p['latitude'] != 0 or p['longitude'] != 0]
print(f"PK ports with valid coords: {len(valid_coords)}")
for p in valid_coords:
    print(f"{p['name']} ({p['port_type']}): {p['latitude']}, {p['longitude']}")
