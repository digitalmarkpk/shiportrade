"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function GoogleAnalytics() {
  const gaId = "G-H2P9E4PDWM";
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!gaId || !pathname) return;

    const url = pathname + searchParams.toString();
    
    // @ts-ignore
    if (typeof window.gtag === "function") {
      // @ts-ignore
      window.gtag("config", gaId, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, gaId]);

  if (!gaId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `,
        }}
      />
    </>
  );
}