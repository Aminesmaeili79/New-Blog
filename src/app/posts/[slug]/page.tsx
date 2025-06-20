// src/app/posts/[slug]/page.tsx
import { getPostBySlug, getAllPosts } from '@/lib/blog-data';
import type { BlogPost } from '@/types';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import SocialShareButtons from '@/components/SocialShareButtons';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The post you are looking for does not exist.',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const featuredImageUrl = post.featuredImage 
    ? (post.featuredImage.startsWith('http') ? post.featuredImage : `${SITE_URL}${post.featuredImage.startsWith('/') ? '' : '/'}${post.featuredImage}`) 
    : `${SITE_URL}/og-image.png`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/posts/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/posts/${post.slug}`, // Relative to metadataBase
      type: 'article',
      publishedTime: post.publicationDate,
      authors: ['Content Hub Team'], // Or dynamically set author if available
      images: [
        {
          url: featuredImageUrl, // Should be absolute URL
          width: post.featuredImage ? 800 : 1200, // Adjust if you know image dimensions
          height: post.featuredImage ? 400 : 630,
          alt: `Featured image for ${post.title}`,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [featuredImageUrl], // Should be absolute URL
    },
  };
}


export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.featuredImage 
        ? [(post.featuredImage.startsWith('http') ? post.featuredImage : `${SITE_URL}${post.featuredImage.startsWith('/') ? '' : '/'}${post.featuredImage}`)] 
        : [`${SITE_URL}/og-image.png`], // Ensure absolute URL
    datePublished: post.publicationDate,
    dateModified: post.publicationDate, // Assuming no separate modified date for now
    author: [{
        '@type': 'Organization', // Or 'Person' if you have individual authors
        name: 'Content Hub Team', // Replace with actual author name or organization
    }],
    publisher: {
        '@type': 'Organization',
        name: 'Content Hub',
        logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/logo.png` // Ensure absolute URL, replace with your logo
        }
    },
    description: post.excerpt,
    mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/posts/${post.slug}` // Ensure absolute URL
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto bg-card p-6 sm:p-8 md:p-10 rounded-lg shadow-xl">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <header className="mb-8">
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
              {post.title}
            </h1>
            <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-2 items-center">
              <div className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                <time dateTime={post.publicationDate}>
                  {format(new Date(post.publicationDate), 'MMMM d, yyyy')}
                </time>
              </div>
            </div>
            {post.featuredImage && (
              <div className="relative w-full h-64 sm:h-80 md:h-96 mt-6 rounded-md overflow-hidden shadow-md">
                <Image
                  src={post.featuredImage}
                  alt={`Featured image for ${post.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                  data-ai-hint="article hero"
                />
              </div>
            )}
          </header>
          
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-headline prose-headings:text-primary prose-a:text-accent hover:prose-a:text-accent/80 prose-strong:text-foreground prose-blockquote:border-primary prose-code:text-accent prose-code:bg-muted/50 prose-code:p-1 prose-code:rounded-sm prose-li:marker:text-primary">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          <footer className="mt-10 pt-6 border-t border-border">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Categories:</h3>
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <Badge key={category} variant="secondary">{category}</Badge>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
            <SocialShareButtons title={post.title} description={post.excerpt} />
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  );
}

export const revalidate = 60; // Revalidate every 60 seconds
