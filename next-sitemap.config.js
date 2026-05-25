/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://www.shiportrade.com',
    generateRobotsTxt: true, 
    generateIndexSitemap: false,
    exclude: ['/404', '/500'],
  }