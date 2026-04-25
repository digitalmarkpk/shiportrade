import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      // Unsplash (free images)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
        pathname: '/**',
      },
      // News Source Domains
      {
        protocol: 'https',
        hostname: 'www.hellenicshippingnews.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hellenicshippingnews.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'splash247.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gcaptain.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.marineinsight.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'marineinsight.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.porttechnology.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'porttechnology.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.seatrade-maritime.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'seatrade-maritime.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.freightwaves.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'freightwaves.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.marinelog.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'marinelog.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'oilprice.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.reuters.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'reuters.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.aljazeera.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'aljazeera.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'feeds.feedburner.com',
        pathname: '/**',
      },
      // CDN and Image Hosting Services (commonly used by news sites)
      {
        protocol: 'https',
        hostname: '*.cdn.ampproject.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.contentstack.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'eu-images.contentstack.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.contentstack.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.imgix.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imgix.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.wordpress.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wordpress.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i1.wp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i2.wp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'c0.wp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cdn.bsky.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.twimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.bbci.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ichef.bbci.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ft.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ftcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.dw.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.dw.com',
        pathname: '/**',
      },
      // Catch-all for any HTTPS image (use carefully)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/tools/ocean-freight/port-code-finder',
        destination: '/directories/ports',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
