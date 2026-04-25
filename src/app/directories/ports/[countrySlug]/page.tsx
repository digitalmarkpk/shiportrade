import { redirect, notFound } from 'next/navigation';
import { getCountries, getCountryBySlug } from '@/utils/data-utils';

interface Props {
  params: Promise<{ countrySlug: string }>;
}

export async function generateStaticParams() {
  const countries = await getCountries();
  return countries.map((c) => ({
    countrySlug: c.slug,
  }));
}

export default async function CountryRedirectPage({ params }: Props) {
  const { countrySlug } = await params;
  const country = await getCountryBySlug(countrySlug);
  
  if (!country) {
    notFound();
  }
  
  redirect(`/directories/ports/country/${country.slug}`);
}
