// src/components/admin/PostForm.tsx
"use client";

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { BlogPost } from '@/types';
import { suggestTags as suggestTagsAI } from '@/ai/flows/suggest-tags'; // GenAI flow
import type { PostFormData } from '@/app/actions'; // Import PostFormData

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  excerpt: z.string().min(5, { message: "Excerpt must be at least 5 characters." }).max(300, { message: "Excerpt must be at most 300 characters." }),
  categories: z.string().optional(), // Comma-separated
  tags: z.string().optional(), // Comma-separated
  featuredImage: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type PostFormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  post?: BlogPost; // Optional: for editing existing post
  onSubmitAction: (data: PostFormData) => Promise<void | { success: boolean; message: string }>;
}

export default function PostForm({ post, onSubmitAction }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isAISuggesting, setIsAISuggesting] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      excerpt: post?.excerpt || '',
      categories: post?.categories.join(', ') || '',
      tags: post?.tags.join(', ') || '',
      featuredImage: post?.featuredImage || '',
    },
  });

  const currentContent = watch('content');

  const handleAISuggestions = async () => {
    const content = getValues('content');
    if (!content || content.length < 50) {
      toast({
        title: "Content Too Short",
        description: "Please write at least 50 characters of content before suggesting tags.",
        variant: "destructive",
      });
      return;
    }

    setIsAISuggesting(true);
    setSuggestedTags([]);
    setSuggestedCategories([]);
    try {
      const result = await suggestTagsAI({ blogPostContent: content });
      setSuggestedTags(result.tags);
      setSuggestedCategories(result.categories);
      if (result.tags.length === 0 && result.categories.length === 0) {
        toast({ title: "AI Suggestion", description: "No new suggestions found based on the current content." });
      }
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast({
        title: "AI Suggestion Failed",
        description: "Could not fetch suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAISuggesting(false);
    }
  };

  const addSuggestion = (type: 'tag' | 'category', value: string) => {
    const field = type === 'tag' ? 'tags' : 'categories';
    const currentValue = getValues(field) || '';
    const items = currentValue.split(',').map(item => item.trim()).filter(item => item);
    if (!items.includes(value)) {
      setValue(field, [...items, value].join(', '));
    }
    if (type === 'tag') setSuggestedTags(prev => prev.filter(t => t !== value));
    if (type === 'category') setSuggestedCategories(prev => prev.filter(c => c !== value));
  };

  const onSubmit: SubmitHandler<PostFormValues> = (data) => {
    startTransition(async () => {
      const actionData: PostFormData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        categories: data.categories || '',
        tags: data.tags || '',
        featuredImage: data.featuredImage || '',
      };
      const result = await onSubmitAction(actionData);
      // Note: Server actions with redirect won't return here. Toasting success is tricky.
      // If redirecting, success is implied. Error handling is more critical if action returns error obj.
      if (result && !result.success) {
         toast({
           title: post ? "Error Updating Post" : "Error Adding Post",
           description: result.message || "An unexpected error occurred.",
           variant: "destructive",
         });
      } else if (result && result.success) { // Only if not redirecting
         toast({
           title: post ? "Post Updated" : "Post Added",
           description: result.message,
         });
      }
      // If redirect happens, this won't be reached.
    });
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl md:text-3xl">
          {post ? 'Edit Post' : 'Create New Post'}
        </CardTitle>
        <CardDescription>
          {post ? 'Modify the details of your blog post.' : 'Fill in the details to publish a new blog post.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} className="mt-1" aria-invalid={errors.title ? "true" : "false"} />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="content">Content (Markdown supported)</Label>
            <Textarea id="content" {...register('content')} rows={10} className="mt-1" aria-invalid={errors.content ? "true" : "false"} />
            {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
          </div>
          
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={handleAISuggestions} disabled={isAISuggesting || !currentContent}>
              {isAISuggesting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Suggest Tags & Categories
            </Button>
          </div>

          {(suggestedCategories.length > 0 || suggestedTags.length > 0) && (
            <Card className="bg-secondary/50 p-4">
              <CardDescription className="mb-2 text-sm">Click to add AI suggestions:</CardDescription>
              {suggestedCategories.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Suggested Categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedCategories.map(cat => (
                      <Badge key={cat} onClick={() => addSuggestion('category', cat)} className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {suggestedTags.length > 0 && (
                 <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Suggested Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map(tag => (
                      <Badge key={tag} onClick={() => addSuggestion('tag', tag)} variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}


          <div>
            <Label htmlFor="excerpt">Excerpt (Short summary)</Label>
            <Textarea id="excerpt" {...register('excerpt')} rows={3} className="mt-1" aria-invalid={errors.excerpt ? "true" : "false"} />
            {errors.excerpt && <p className="text-sm text-destructive mt-1">{errors.excerpt.message}</p>}
          </div>

          <div>
            <Label htmlFor="categories">Categories (comma-separated)</Label>
            <Input id="categories" {...register('categories')} className="mt-1" placeholder="e.g., Web Development, AI, Lifestyle" />
             {errors.categories && <p className="text-sm text-destructive mt-1">{errors.categories.message}</p>}
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" {...register('tags')} className="mt-1" placeholder="e.g., Next.js, React, Tutorial" />
            {errors.tags && <p className="text-sm text-destructive mt-1">{errors.tags.message}</p>}
          </div>

          <div>
            <Label htmlFor="featuredImage">Featured Image URL (Optional)</Label>
            <Input id="featuredImage" {...register('featuredImage')} className="mt-1" placeholder="https://placehold.co/800x400.png" />
            {errors.featuredImage && <p className="text-sm text-destructive mt-1">{errors.featuredImage.message}</p>}
          </div>

        </CardContent>
        <CardFooter className="flex justify-end space-x-2 pt-6">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {post ? 'Update Post' : 'Create Post'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
