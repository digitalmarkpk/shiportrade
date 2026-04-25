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

    # Load all ports (using the big list)
    with open('public/data/ports.json', 'r', encoding='utf-8') as f:
        all_ports_raw = json.load(f)

    # Region and Subregion mapping
    region_data = {
        "Asia": {
            "Southern Asia": ["AF", "BD", "BT", "IN", "IR", "MV", "NP", "PK", "LK"],
            "Western Asia": ["AM", "AZ", "BH", "CY", "GE", "IQ", "IL", "JO", "KW", "LB", "OM", "PS", "QA", "SA", "SY", "TR", "AE", "YE"],
            "South-Eastern Asia": ["BN", "KH", "ID", "LA", "MY", "MM", "PH", "SG", "TH", "TL", "VN"],
            "Eastern Asia": ["CN", "HK", "JP", "KP", "KR", "MN", "TW"],
            "Central Asia": ["KZ", "KG", "TJ", "TM", "UZ"]
        },
        "Europe": {
            "Southern Europe": ["AL", "AD", "BA", "HR", "GR", "IT", "MT", "ME", "MK", "PT", "SM", "RS", "SI", "ES", "VA"],
            "Western Europe": ["AT", "BE", "FR", "DE", "LI", "LU", "MC", "NL", "CH"],
            "Eastern Europe": ["BY", "BG", "CZ", "HU", "MD", "PL", "RO", "RU", "SK", "UA"],
            "Northern Europe": ["DK", "EE", "FI", "IS", "IE", "LV", "LT", "NO", "SE", "GB"]
        },
        "Americas": {
            "South America": ["AR", "BO", "BR", "CL", "CO", "EC", "FK", "GF", "GY", "PY", "PE", "SR", "UY", "VE"],
            "Central America": ["BZ", "CR", "SV", "GT", "HN", "MX", "NI", "PA"],
            "Caribbean": ["AG", "BS", "BB", "CU", "DM", "DO", "GD", "HT", "JM", "KN", "LC", "VC", "TT"],
            "Northern America": ["BM", "CA", "GL", "PM", "US"]
        },
        "Africa": {
            "Northern Africa": ["DZ", "EG", "LY", "MA", "SD", "TN", "EH"],
            "Western Africa": ["BJ", "BF", "CV", "CI", "GM", "GH", "GN", "GW", "LR", "ML", "MR", "NE", "NG", "SN", "SL", "TG"],
            "Middle Africa": ["AO", "CM", "CF", "TD", "CG", "CD", "GQ", "GA", "ST"],
            "Eastern Africa": ["BI", "KM", "DJ", "ER", "ET", "KE", "MG", "MW", "MU", "MZ", "RW", "SC", "SO", "SS", "TZ", "UG", "ZM", "ZW"],
            "Southern Africa": ["BW", "SZ", "LS", "NA", "ZA"]
        },
        "Oceania": {
            "Australia and New Zealand": ["AU", "NZ"],
            "Melanesia": ["FJ", "NC", "PG", "SB", "VU"],
            "Micronesia": ["GU", "KI", "MH", "FM", "NR", "PW"],
            "Polynesia": ["AS", "CK", "PF", "NU", "PN", "WS", "TK", "TO", "TV", "WF"]
        }
    }
    
    country_to_region = {}
    country_to_subregion = {}
    for region, subregions in region_data.items():
        for subregion, codes in subregions.items():
            for code in codes:
                country_to_region[code] = region
                country_to_subregion[code] = subregion

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
        c['subregion'] = country_to_subregion.get(cc, "")

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
        cc = p.get('country_code')
        if not cc:
            print(f"Skipping port {p.get('name')} - missing country code")
            continue

        if cc not in country_map:
            # Create a basic country entry if missing
            country_name = p.get('country_name', cc)
            new_country = {
                "id": len(country_map) + 1,
                "country_code": cc,
                "iso_code": cc,
                "name": country_name,
                "slug": slugify(country_name),
                "capital": "",
                "currency": "",
                "coastline_km": 0,
                "population": 0,
                "flag_emoji": "",
                "is_landlocked": True,
                "total_sea_ports": 0,
                "total_airports": 0,
                "total_dry_ports": 0,
                "region": country_to_region.get(cc, "Other"),
                "subregion": country_to_subregion.get(cc, "")
            }
            country_map[cc] = new_country
            print(f"Added missing country: {country_name} ({cc})")
            
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
        unlocode = p.get('un_locode', p.get('unlocode', ''))
        port_entry = p.copy() # Start with all existing fields
        
        # Update/Standardize fields
        port_entry.update({
            "id": port_id_counter,
            "un_locode": unlocode,
            "name": p['name'],
            "slug": f"{slugify(p['name'])}-{unlocode.lower()}",
            "country_id": country['id'],
            "country_code": cc,
            "country_name": country['name'],
            "country_slug": country['slug'],
            "region": country['region'],
            "subregion": country['subregion'],
            "city": p.get('city', p.get('name', '')),
            "port_type": final_type,
            "latitude": p.get('latitude', 0),
            "longitude": p.get('longitude', 0),
            "is_active": True,
            "annual_teu": p.get('annual_teu', 0),
            "max_depth_m": p.get('max_depth_m', 0),
            "timezone": p.get('timezone', "UTC")
        })
        
        # Use existing details if available, otherwise use placeholders
        if 'details' in p and p['details']:
            port_entry["details"] = p['details']
            # Ensure port_authority is set if missing in details
            if not port_entry["details"].get("port_authority"):
                port_entry["details"]["port_authority"] = f"Port Authority of {p['name']}"
        else:
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
    # Update countries-info.json
    with open('public/data/countries-info.json', 'w', encoding='utf-8') as f:
        json.dump(list(country_map.values()), f, indent=2, ensure_ascii=False)

    # Also update countries.json used by the app
    with open('public/data/countries.json', 'w', encoding='utf-8') as f:
        json.dump(list(country_map.values()), f, indent=2, ensure_ascii=False)

    # Update ports-main.json
    with open('public/data/ports-main.json', 'w', encoding='utf-8') as f:
        json.dump(final_ports, f, indent=2, ensure_ascii=False)

    # Also update ports.json used by the app
    # Note: final_ports includes extra fields like details
    with open('public/data/ports.json', 'w', encoding='utf-8') as f:
        json.dump(final_ports, f, indent=2, ensure_ascii=False)

    print(f"Migration complete: {len(country_map)} countries and {len(final_ports)} ports updated.")

if __name__ == "__main__":
    migrate()
