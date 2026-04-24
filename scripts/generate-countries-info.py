import json
import requests

def generate_countries_info():
    # Fetch country data from mledoze/countries
    url = "https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json"
    response = requests.get(url)
    countries_data = response.json()

    # Coastline data (approximate for major maritime nations)
    # Source: CIA Factbook (simplified for this task)
    coastline_data = {
        "CA": 202080, "NO": 58133, "RU": 37653, "PH": 36289, "JP": 29751,
        "ID": 54716, "AU": 25760, "US": 19924, "CN": 14500, "GR": 13676,
        "GB": 12429, "MX": 9330, "IT": 7600, "IN": 7517, "BR": 7491,
        "CL": 6435, "VN": 3444, "PK": 1046, "ZA": 2798, "ES": 4964,
        "FR": 4853, "DE": 2389, "NL": 451, "BE": 66, "SG": 193,
        "MY": 4675, "TH": 3219, "TR": 7200, "EG": 2450, "SA": 2640,
        "AE": 1318, "OM": 2092, "KR": 2413, "KP": 2495, "TW": 1566,
    }

    countries_info = []
    for c in countries_data:
        code = c['cca2']
        info = {
            "country_code": code,
            "name": c['name']['common'],
            "capital": c['capital'][0] if c.get('capital') else "",
            "currency": list(c.get('currencies', {}).keys())[0] if c.get('currencies') else "",
            "coastline_km": coastline_data.get(code, 0),
            "population": c.get('population', 0),
            "flag_emoji": c.get('flag', "")
        }
        countries_info.append(info)

    with open('public/data/countries-info.json', 'w', encoding='utf-8') as f:
        json.dump(countries_info, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    generate_countries_info()
