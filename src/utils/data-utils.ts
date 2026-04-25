import fs from 'fs';
import path from 'path';
import { slugify } from './slugify';

export interface Country {
  id: string | number;
  name: string;
  slug: string;
  iso_alpha2: string;
  iso_alpha3: string;
  region: string;
  subregion: string;
  capital: string;
  currency: string;
  currency_name: string;
  phone_code: string;
  languages: string[];
  population: number;
  gdp_usd: number;
  coastline_km: number;
  major_exports: string[];
  major_imports: string[];
  total_sea_ports: number;
  total_airports: number;
  total_dry_ports: number;
  flag_url: string;
}

export interface Port {
  unlocode: string;
  name: string;
  slug: string;
  country_code: string;
  country_name: string;
  country_slug: string;
  region: string;
  subregion: string;
  latitude: number;
  longitude: number;
  port_type: string;
  annual_teu: number;
  max_depth_m: number;
  timezone: string;
  website: string;
  harbor_size: string;
  has_airport: boolean;
  nearby_ports: string[];
  iso_alpha2: string;
  iso_alpha3: string;
  currency: string;
  currency_name: string;
  phone_code: string;
  languages: string[];
  population: number;
  gdp_usd: number;
  major_exports: string[];
  major_imports: string[];
}

export interface Region {
  name: string;
  slug: string;
  countries_count: number;
  ports_count: number;
}

const DATA_DIR = path.join(process.cwd(), 'public', 'data');

let cachedCountries: Country[] | null = null;
let cachedPorts: Port[] | null = null;
let cachedRegions: Region[] | null = null;
let portMap: Map<string, Port> | null = null;

export async function getCountries(): Promise<Country[]> {
  if (cachedCountries) return cachedCountries;
  try {
    const filePath = path.join(DATA_DIR, 'countries.json');
    if (!fs.existsSync(filePath)) return [];
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    cachedCountries = data || [];
    return cachedCountries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

export async function getPorts(): Promise<Port[]> {
  if (cachedPorts) return cachedPorts;
  try {
    const filePath = path.join(DATA_DIR, 'ports.json');
    if (!fs.existsSync(filePath)) return [];
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    cachedPorts = data || [];
    return cachedPorts;
  } catch (error) {
    console.error('Error fetching ports:', error);
    return [];
  }
}

export async function getRegions(): Promise<Region[]> {
  if (cachedRegions) return cachedRegions;
  try {
    const filePath = path.join(DATA_DIR, 'regions.json');
    if (!fs.existsSync(filePath)) return [];
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    cachedRegions = data || [];
    return cachedRegions;
  } catch (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
}

export async function getCountryBySlug(slug: string): Promise<Country | null> {
  const countries = await getCountries();
  return countries.find(c => c.slug === slug) || null;
}

export async function getPortBySlug(countrySlug: string, portSlug: string): Promise<Port | null> {
  if (!portMap) {
    const ports = await getPorts();
    portMap = new Map();
    ports.forEach(p => {
      portMap!.set(`${p.country_slug}/${p.slug}`, p);
    });
  }
  return portMap.get(`${countrySlug}/${portSlug}`) || null;
}

export async function getPortsByCountryCode(code: string): Promise<Port[]> {
  const ports = await getPorts();
  return ports.filter(p => p.country_code === code);
}

export async function getPortsBySubregion(subregion: string): Promise<Port[]> {
  const ports = await getPorts();
  return ports.filter(p => p.subregion === subregion);
}
