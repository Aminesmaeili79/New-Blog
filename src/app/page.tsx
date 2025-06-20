// src/app/page.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogPostCard from '@/components/BlogPostCard';
import { getAllPosts } from '@/lib/blog-data';
import type { BlogPost } from '@/types';

export default async function HomePage() {
  const posts: BlogPost[] = await getAllPosts();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-8 text-center">
          Welcome to Content Hub
        </h1>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          Discover insightful articles, tutorials, and reflections on technology, web development, and more.
        </p>
        
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground text-xl">No posts yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export const revalidate = 60; // Revalidate every 60 seconds
