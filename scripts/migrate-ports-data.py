import json
import os
import re

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text).strip('-')
    return text

def migrate():
    # Load existing countries
    with open('public/data/countries-info.json', 'r', encoding='utf-8') as f:
        countries = json.load(f)

    # Load all ports
    with open('public/data/ports-full.json', 'r', encoding='utf-8') as f:
        all_ports_raw = json.load(f)

    # Region mapping
    regions = {
        "Asia": ["AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "CY", "GE", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KW", "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "KP", "OM", "PK", "PS", "PH", "QA", "SA", "SG", "KR", "LK", "SY", "TW", "TJ", "TH", "TL", "TR", "TM", "AE", "UZ", "VN", "YE"],
        "Europe": ["AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "MD", "MC", "ME", "NL", "MK", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA", "GB", "VA"],
        "Americas": ["AG", "AR", "BS", "BB", "BZ", "BO", "BR", "CA", "CL", "CO", "CR", "CU", "DM", "DO", "EC", "SV", "GD", "GT", "GY", "HT", "HN", "JM", "MX", "NI", "PA", "PY", "PE", "KN", "LC", "VC", "SR", "TT", "US", "UY", "VE"],
        "Africa": ["DZ", "AO", "BJ", "BW", "BF", "BI", "CV", "CM", "CF", "TD", "KM", "CG", "CD", "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "CI", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "TN", "UG", "ZM", "ZW"],
        "Oceania": ["AS", "AU", "CK", "FJ", "PF", "GU", "KI", "MH", "FM", "NR", "NC", "NZ", "NU", "NF", "MP", "PW", "PG", "PN", "WS", "SB", "TK", "TO", "TV", "VU", "WF"]
    }
    
    country_to_region = {}
    for region, codes in regions.items():
        for code in codes:
            country_to_region[code] = region

    # 1. Update Countries
    country_map = {}
    for i, c in enumerate(countries):
        cc = c['country_code']
        # Add new fields
        c['id'] = i + 1
        c['iso_code'] = cc
        c['slug'] = slugify(c['name'])
        c['is_landlocked'] = c.get('coastline_km', 0) == 0
        c['total_sea_ports'] = 0
        c['total_airports'] = 0
        c['total_dry_ports'] = 0
        
        c['region'] = country_to_region.get(cc, "Other")
        c['subregion'] = "" # We'll leave it empty for now

        country_map[cc] = c

    # 2. Update Ports
    final_ports = []
    port_id_counter = 1
    
    # Port Type mapping
    type_map = {
        "Sea Port": "sea_port",
        "Commercial Port": "sea_port",
        "Container Terminal": "container_terminal",
        "Dry Port": "dry_port",
        "Rail Terminal": "rail_terminal",
        "Airport": "airport"
    }

    for p in all_ports_raw:
        cc = p['country_code']
        if cc not in country_map:
            # Create a basic country entry if missing?
            # For now, let's just skip or log
            continue
            
        country = country_map[cc]
        
        # Standardize port type
        raw_type = p.get('port_type', 'Sea Port')
        final_type = type_map.get(raw_type, 'sea_port')
        
        # Update country counts
        if final_type == 'sea_port':
            country['total_sea_ports'] += 1
        elif final_type == 'airport':
            country['total_airports'] += 1
        elif final_type in ['dry_port', 'container_terminal', 'rail_terminal']:
            country['total_dry_ports'] += 1

        # Port object
        port_entry = {
            "id": port_id_counter,
            "un_locode": p['unlocode'],
            "name": p['name'],
            "slug": f"{slugify(p['name'])}-{p['unlocode'].lower()}",
            "country_id": country['id'],
            "country_code": cc,
            "country_name": country['name'],
            "city": p.get('city', p['name']),
            "port_type": final_type,
            "latitude": p['latitude'],
            "longitude": p['longitude'],
            "is_active": True,
            "annual_teu": p.get('annual_teu', 0),
            "max_depth_m": p.get('max_depth_m', 0),
            "timezone": p.get('timezone', "UTC")
        }
        
        # Add details (placeholder or from existing)
        port_entry["details"] = {
            "alternate_name": "",
            "world_water_body": "",
            "tidal_range_m": 0,
            "channel_depth_m": p.get('max_depth_m', 0),
            "anchorage_depth_m": 0,
            "cargo_pier_depth_m": 0,
            "max_vessel_length_m": 0,
            "max_vessel_beam_m": 0,
            "max_vessel_draft_m": 0,
            "harbor_type": "Coastal",
            "harbor_size": "Medium",
            "shelter": "Good",
            "pilotage_compulsory": True,
            "tugs_available": True,
            "port_authority": f"Port Authority of {p['name']}",
            "phone": "",
            "fax": "",
            "email": "",
            "website": p.get('website', ""),
            "facilities": {
                "wharves": True,
                "anchorage": True,
                "ro_ro": False,
                "container_terminal": final_type == "container_terminal",
                "bulk_terminal": False,
                "oil_terminal": False,
                "lng_terminal": False
            },
            "services": {
                "pilotage": True,
                "tugs": True,
                "repairs": False,
                "provisions": True,
                "water": True,
                "fuel": True
            }
        }
        
        final_ports.append(port_entry)
        port_id_counter += 1

    # Save expanded data
    with open('public/data/countries-info.json', 'w', encoding='utf-8') as f:
        json.dump(list(country_map.values()), f, indent=2, ensure_ascii=False)

    with open('public/data/ports-main.json', 'w', encoding='utf-8') as f:
        json.dump(final_ports, f, indent=2, ensure_ascii=False)

    print(f"Migration complete: {len(country_map)} countries and {len(final_ports)} ports updated.")

if __name__ == "__main__":
    migrate()
