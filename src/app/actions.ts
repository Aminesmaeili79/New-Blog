// src/app/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addPost as dbAddPost, updatePost as dbUpdatePost, deletePost as dbDeletePost, getPostById } from "@/lib/blog-data";
import { generateSlug } from "@/lib/utils";
import type { BlogPost } from "@/types";

export interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  categories: string; // Comma-separated
  tags: string; // Comma-separated
  featuredImage?: string;
}

export async function addPostAction(formData: PostFormData) {
  try {
    const newPostData: Omit<BlogPost, 'id' | 'slug' | 'publicationDate'> = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      categories: formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      featuredImage: formData.featuredImage || undefined,
    };
    
    await dbAddPost(newPostData);

  } catch (error) {
    console.error("Failed to add post:", error);
    return { success: false, message: "Failed to add post." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
  // return { success: true, message: "Post added successfully." }; // Redirect happens before this
}

export async function updatePostAction(id: string, formData: PostFormData) {
  try {
    const existingPost = await getPostById(id);
    if (!existingPost) {
      return { success: false, message: "Post not found." };
    }

    const updatedPostData: Partial<Omit<BlogPost, 'id' | 'slug'>> & { title?: string, content?: string } = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      categories: formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      featuredImage: formData.featuredImage || undefined,
    };
    
    await dbUpdatePost(id, updatedPostData);
  } catch (error) {
    console.error("Failed to update post:", error);
    return { success: false, message: "Failed to update post." };
  }
  
  revalidatePath("/");
  revalidatePath(`/posts/${generateSlug(formData.title)}`); // Use the new slug if title changed
  revalidatePath("/admin");
  redirect("/admin");
  // return { success: true, message: "Post updated successfully." }; // Redirect happens before this
}

export async function deletePostAction(id: string) {
  try {
    await dbDeletePost(id);
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, message: "Failed to delete post." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, message: "Post deleted successfully." };
}
