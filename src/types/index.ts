export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown content
  excerpt: string;
  publicationDate: string; // ISO string format for dates
  categories: string[];
  tags: string[];
  featuredImage?: string; // URL for an optional featured image
}
