// src/app/admin/edit/[id]/page.tsx
import PostForm from '@/components/admin/PostForm';
import { getPostById } from '@/lib/blog-data';
import { updatePostAction } from '@/app/actions';
import { notFound } from 'next/navigation';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }
  
  // Bind the post ID to the updatePostAction
  const updateActionForThisPost = updatePostAction.bind(null, params.id);

  return (
    <div>
      <PostForm post={post} onSubmitAction={updateActionForThisPost} />
    </div>
  );
}

export const revalidate = 0; // Ensure fresh data for editing
