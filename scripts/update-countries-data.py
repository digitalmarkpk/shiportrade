import json
import requests

def update_countries_data():
    # Load existing countries
    with open('public/data/countries-info.json', 'r', encoding='utf-8') as f:
        countries_info = json.load(f)
    
    # Fetch latest population data from restcountries
    try:
        fields = "cca2,population,capital,currencies,flag,name"
        resp = requests.get(f"https://restcountries.com/v3.1/all?fields={fields}")
        rest_data = {c['cca2']: c for c in resp.json()}
    except Exception as e:
        print(f"Error fetching restcountries data: {e}")
        rest_data = {}

    # Comprehensive coastline data (approximate km)
    # Source: Combined CIA Factbook and World Bank data
    coastline_data = {
        "CA": 202080, "NO": 58133, "RU": 37653, "PH": 36289, "JP": 29751,
        "ID": 54716, "AU": 25760, "US": 19924, "CN": 14500, "GR": 13676,
        "GB": 12429, "MX": 9330, "IT": 7600, "IN": 7517, "BR": 7491,
        "CL": 6435, "VN": 3444, "PK": 1046, "ZA": 2798, "ES": 4964,
        "FR": 4853, "DE": 2389, "NL": 451, "BE": 66, "SG": 193,
        "MY": 4675, "TH": 3219, "TR": 7200, "EG": 2450, "SA": 2640,
        "AE": 1318, "OM": 2092, "KR": 2413, "KP": 2495, "TW": 1566,
        "NZ": 15134, "LK": 1340, "IE": 1448, "PT": 1793, "MA": 1835,
        "DZ": 998, "LY": 1770, "TN": 1148, "NG": 853, "GH": 539,
        "CI": 515, "SN": 531, "AO": 1600, "MZ": 2470, "TZ": 1424,
        "KE": 536, "SO": 3333, "SD": 853, "ER": 2234, "DJ": 314,
        "IR": 2440, "IQ": 58, "KW": 499, "QA": 563, "BH": 161,
        "BD": 580, "MM": 1930, "KH": 443, "HK": 733, "PE": 2414,
        "EC": 2237, "CO": 3208, "VE": 2800, "GY": 459, "SR": 386,
        "UY": 660, "AR": 4989, "PA": 2490, "CR": 1290, "NI": 910,
        "HN": 820, "SV": 307, "GT": 400, "CU": 3735, "DO": 1288,
        "HT": 1771, "JM": 1022, "PR": 501, "BS": 3542, "FJ": 1129,
        "PG": 5152, "SB": 5313, "VU": 2528, "NC": 2254, "PF": 2525,
    }

    updated_count = 0
    for country in countries_info:
        code = country['country_code']
        
        # Update population from restcountries
        if code in rest_data:
            country['population'] = rest_data[code].get('population', country.get('population', 0))
            if not country.get('capital') or country['capital'] == "":
                 capitals = rest_data[code].get('capital', [])
                 country['capital'] = capitals[0] if capitals else ""
            if not country.get('currency') or country['currency'] == "":
                 currencies = rest_data[code].get('currencies', {})
                 country['currency'] = list(currencies.keys())[0] if currencies else ""
            if not country.get('flag_emoji') or country['flag_emoji'] == "":
                 country['flag_emoji'] = rest_data[code].get('flag', "")

        # Update coastline if we have it
        if code in coastline_data:
            country['coastline_km'] = coastline_data[code]
        
        updated_count += 1

    with open('public/data/countries-info.json', 'w', encoding='utf-8') as f:
        json.dump(countries_info, f, indent=2, ensure_ascii=False)
    
    print(f"Updated {updated_count} countries in countries-info.json")

if __name__ == "__main__":
    update_countries_data()
