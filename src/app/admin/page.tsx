// src/app/admin/page.tsx
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import DeletePostButton from '@/components/admin/DeletePostButton'; // We'll create this client component

export default async function AdminDashboardPage() {
  const posts = await getAllPosts();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/admin/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Post
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Manage Blog Posts</CardTitle>
          <CardDescription>View, edit, or delete existing blog posts.</CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No posts found. Start by adding a new one!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Title</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.categories.slice(0,2).map(cat => <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>)}
                        {post.categories.length > 2 && <Badge variant="secondary" className="text-xs">...</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0,2).map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                        {post.tags.length > 2 && <Badge variant="outline" className="text-xs">...</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(post.publicationDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" asChild title="Edit Post">
                        <Link href={`/admin/edit/${post.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeletePostButton postId={post.id} postTitle={post.title} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export const revalidate = 0; // Ensure fresh data on each visit
