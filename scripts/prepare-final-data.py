import json
import os
import re

def slugify(text):
    text = str(text).lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text).strip('-')
    return text

def prepare_data():
    print("Loading source data...")
    # Load source files
    with open('public/data/countries-info.json', 'r', encoding='utf-8') as f:
        countries_source = json.load(f)
    
    with open('public/data/ports-main.json', 'r', encoding='utf-8') as f:
        ports_source = json.load(f)

    # 1. Prepare Regions
    regions_list = ["Asia", "Europe", "Americas", "Africa", "Oceania"]
    regions_data = []
    for region_name in regions_list:
        regions_data.append({
            "name": region_name,
            "slug": slugify(region_name),
            "countries_count": 0,
            "ports_count": 0
        })

    # 2. Prepare Countries
    countries_map = {}
    for c in countries_source:
        cc = c['country_code']
        # Enrich country data as requested
        country_entry = {
            "id": c.get('id', cc),
            "name": c['name'],
            "slug": slugify(c['name']),
            "iso_alpha2": cc,
            "iso_alpha3": c.get('iso_alpha3', ''), # Need to ensure this exists
            "region": c.get('region', 'Other'),
            "subregion": c.get('subregion', ''),
            "capital": c.get('capital', ''),
            "currency": c.get('currency_code', ''),
            "currency_name": c.get('currency_name', ''),
            "phone_code": c.get('phone_code', ''),
            "languages": c.get('languages', []),
            "population": c.get('population', 0),
            "gdp_usd": c.get('gdp_usd', 0),
            "coastline_km": c.get('coastline_km', 0),
            "major_exports": c.get('major_exports', []),
            "major_imports": c.get('major_imports', []),
            "total_sea_ports": 0,
            "total_airports": 0,
            "total_dry_ports": 0,
            "flag_url": f"https://flagcdn.com/w80/{cc.lower()}.png"
        }
        countries_map[cc] = country_entry
        
        # Update region counts
        for r in regions_data:
            if r['name'] == country_entry['region']:
                r['countries_count'] += 1

    # 3. Prepare Ports
    final_ports = []
    for p in ports_source:
        cc = p['country_code']
        if cc not in countries_map:
            continue
            
        country = countries_map[cc]
        
        # Determine port type
        ptype = p.get('port_type', 'sea_port')
        if ptype == 'sea_port':
            country['total_sea_ports'] += 1
        elif ptype == 'airport':
            country['total_airports'] += 1
        elif ptype in ['dry_port', 'container_terminal', 'rail_terminal']:
            country['total_dry_ports'] += 1

        # Build requested port object
        port_entry = {
            "unlocode": p['unlocode'],
            "name": p['name'],
            "slug": f"{slugify(p['name'])}-{p['unlocode'].lower()}",
            "country_code": cc,
            "country_name": country['name'],
            "country_slug": country['slug'],
            "region": country['region'],
            "subregion": country['subregion'],
            "latitude": p['latitude'],
            "longitude": p['longitude'],
            "port_type": p.get('port_type', 'sea_port'),
            "annual_teu": p.get('annual_teu', 0),
            "max_depth_m": p.get('max_depth_m', 0),
            "timezone": p.get('timezone', "UTC"),
            "website": p.get('details', {}).get('website', ""),
            "harbor_size": p.get('details', {}).get('harbor_size', "Medium"),
            "has_airport": country['total_airports'] > 0,
            "nearby_ports": [], # Placeholder, will fill if possible
            "iso_alpha2": country['iso_alpha2'],
            "iso_alpha3": country['iso_alpha3'],
            "currency": country['currency'],
            "currency_name": country['currency_name'],
            "phone_code": country['phone_code'],
            "languages": country['languages'],
            "population": country['population'],
            "gdp_usd": country['gdp_usd'],
            "major_exports": country['major_exports'],
            "major_imports": country['major_imports']
        }
        final_ports.append(port_entry)
        
        # Update region port counts
        for r in regions_data:
            if r['name'] == country['region']:
                r['ports_count'] += 1

    # Update regions with total counts
    # (Already done in the loop)

    print(f"Processed {len(countries_map)} countries and {len(final_ports)} ports.")

    # Save final files
    os.makedirs('public/data', exist_ok=True)
    
    with open('public/data/ports.json', 'w', encoding='utf-8') as f:
        json.dump(final_ports, f, indent=2, ensure_ascii=False)
    
    with open('public/data/countries.json', 'w', encoding='utf-8') as f:
        json.dump(list(countries_map.values()), f, indent=2, ensure_ascii=False)
    
    with open('public/data/regions.json', 'w', encoding='utf-8') as f:
        json.dump(regions_data, f, indent=2, ensure_ascii=False)

    print("Data preparation complete.")

if __name__ == "__main__":
    prepare_data()
