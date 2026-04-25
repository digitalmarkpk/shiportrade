import fs from 'fs';
import path from 'path';
import { slugify } from './slugify';

export interface Country {
  id: number;
  country_code: string;
  name: string;
  slug: string;
  capital?: string;
  currency?: string;
  flag_emoji?: string;
  region?: string;
  subregion?: string;
  coastline_km?: number;
  is_landlocked?: boolean;
  total_sea_ports?: number;
  total_airports?: number;
  total_dry_ports?: number;
}

export interface Port {
  id: number;
  un_locode: string;
  name: string;
  slug: string;
  country_id: number;
  country_code: string;
  country_name?: string;
  country_slug?: string;
  city: string;
  port_type: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  details?: any;
}

const DATA_DIR = path.join(process.cwd(), 'public', 'data');

export async function getCountries(): Promise<Country[]> {
  try {
    const filePath = path.join(DATA_DIR, 'countries-info.json');
    if (!fs.existsSync(filePath)) return [];
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return (data || [])
      .filter((c: any) => c && c.name && c.country_code)
      .map((c: any) => ({
        ...c,
        slug: c.slug || slugify(c.name || '')
      }))
      .filter((c: any) => c.slug);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

export async function getPorts(): Promise<Port[]> {
  try {
    const portsPath = path.join(DATA_DIR, 'ports-main.json');
    const countriesPath = path.join(DATA_DIR, 'countries-info.json');
    
    if (!fs.existsSync(portsPath)) return [];
    
    const portsData = JSON.parse(fs.readFileSync(portsPath, 'utf8'));
    const countriesData = fs.existsSync(countriesPath) 
      ? JSON.parse(fs.readFileSync(countriesPath, 'utf8')) 
      : [];

    const countryMap = new Map(countriesData.map((c: any) => [c.country_code, c]));

    return (portsData || [])
      .filter((p: any) => p && p.name && (p.un_locode || p.unlocode))
      .map((p: any) => {
        const un_locode = p.un_locode || p.unlocode;
        const country = countryMap.get(p.country_code);
        const country_slug = country?.slug || slugify(country?.name || '');
        
        return {
          ...p,
          un_locode,
          country_slug,
          slug: p.slug || `${slugify(p.name?.replace('Port of ', '') || '')}-${un_locode?.toLowerCase() ?? 'unknown'}`
        };
      })
      .filter((p: any) => p.slug && p.country_slug);
  } catch (error) {
    console.error('Error fetching ports:', error);
    return [];
  }
}

export async function getCountryBySlug(slug: string): Promise<Country | null> {
  const countries = await getCountries();
  return countries.find(c => c.slug === slug) || null;
}

export async function getPortsByCountryCode(code: string): Promise<Port[]> {
  const ports = await getPorts();
  return ports.filter(p => p.country_code === code);
}

export async function getPortBySlugs(countrySlug: string, portSlug: string): Promise<Port | null> {
  const countries = await getCountries();
  const country = countries.find(c => c.slug === countrySlug);
  if (!country) return null;

  const ports = await getPortsByCountryCode(country.country_code);
  return ports.find(p => p.slug === portSlug) || null;
}
