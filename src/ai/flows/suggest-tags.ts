// src/ai/flows/suggest-tags.ts
'use server';
/**
 * @fileOverview A flow to suggest tags for a blog post based on its content.
 *
 * - suggestTags - A function that suggests tags for a blog post.
 * - SuggestTagsInput - The input type for the suggestTags function.
 * - SuggestTagsOutput - The return type for the suggestTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTagsInputSchema = z.object({
  blogPostContent: z
    .string()
    .describe('The content of the blog post for which tags are to be suggested.'),
});
export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe('An array of suggested tags for the blog post.'),
  categories: z
    .array(z.string())
    .describe('An array of suggested categories for the blog post.'),
});
export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {schema: SuggestTagsInputSchema},
  output: {schema: SuggestTagsOutputSchema},
  prompt: `You are a blog post tagging expert. Given the content of a blog post, you will suggest relevant tags and categories to improve its discoverability.

Blog Post Content: {{{blogPostContent}}}

Suggest at least 5 tags and 3 categories.

Format your response as a JSON object with "tags" and "categories" fields, each containing an array of strings.`,
});

const suggestTagsFlow = ai.defineFlow(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
