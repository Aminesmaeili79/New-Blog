// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.publicationDate),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(), // Or a more specific last modified date for the homepage
      changeFrequency: 'daily',
      priority: 1,
    },
    // Add other static pages here if any, e.g.
    // {
    //   url: `${SITE_URL}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.7,
    // },
    ...postEntries,
  ];
}
