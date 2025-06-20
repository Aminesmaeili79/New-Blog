// src/app/robots.ts
import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Example: If you want to disallow admin pages from being crawled
        // disallow: ['/admin/'], 
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
