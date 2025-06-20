// src/components/BlogPostCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {post.featuredImage && (
        <Link href={`/posts/${post.slug}`} aria-label={`Read more about ${post.title}`}>
          <div className="relative w-full h-48 sm:h-56 md:h-64">
            <Image
              src={post.featuredImage}
              alt={post.title} // More descriptive alt text
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              data-ai-hint="article abstract"
            />
          </div>
        </Link>
      )}
      <CardHeader>
        <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
          <CardTitle className="font-headline text-xl sm:text-2xl md:text-3xl leading-tight">
            {post.title}
          </CardTitle>
        </Link>
        <div className="text-sm text-muted-foreground flex items-center pt-2">
          <CalendarDays className="mr-2 h-4 w-4" />
          <time dateTime={post.publicationDate}>
            {format(new Date(post.publicationDate), 'MMMM d, yyyy')}
          </time>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-4">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 sm:gap-4 pt-4">
        <div className="flex flex-wrap gap-2">
          {post.categories.slice(0, 2).map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
        <Link href={`/posts/${post.slug}`} className="text-primary hover:text-accent font-semibold text-sm">
          Read More &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
}
