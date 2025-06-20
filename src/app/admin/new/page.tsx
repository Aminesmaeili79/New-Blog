// src/app/admin/new/page.tsx
import PostForm from '@/components/admin/PostForm';
import { addPostAction } from '@/app/actions';

export default function NewPostPage() {
  return (
    <div>
      <PostForm onSubmitAction={addPostAction} />
    </div>
  );
}
