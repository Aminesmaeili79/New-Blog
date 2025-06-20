// src/lib/blog-data.ts
import type { BlogPost } from '@/types';
import { generateSlug } from '@/lib/utils';

// In-memory store for blog posts
let posts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Web Development',
    slug: 'the-future-of-web-development',
    content: `## The Ever-Evolving Landscape

Web development is a field that's constantly in flux. New frameworks, libraries, and paradigms emerge at a rapid pace, challenging developers to stay updated. In this post, we'll explore some of the key trends shaping the future of web development.

### Key Trends:

*   **Artificial Intelligence (AI) and Machine Learning (ML):** AI is increasingly being integrated into web applications, from chatbots to personalized user experiences and automated content generation.
*   **Serverless Architecture:** Moving away from traditional server management towards function-as-a-service (FaaS) models offers scalability and cost-efficiency.
*   **Progressive Web Apps (PWAs):** PWAs continue to blur the lines between web and native mobile applications, offering offline capabilities and enhanced performance.
*   **WebAssembly (Wasm):** Enabling near-native performance for web applications by allowing code written in languages like C++, Rust, and Go to run in the browser.
*   **Cybersecurity:** With increasing online threats, robust security measures and practices are more critical than ever.

The journey ahead is exciting, with endless possibilities for innovation. Staying curious and adaptable will be key for developers navigating this dynamic landscape.
`,
    excerpt: 'Exploring the key trends shaping the future of web development, from AI and serverless to PWAs and WebAssembly.',
    publicationDate: new Date('2024-05-10T10:00:00Z').toISOString(),
    categories: ['Web Development', 'Technology Trends'],
    tags: ['Future', 'AI', 'Serverless', 'PWA', 'WebAssembly'],
    featuredImage: 'https://placehold.co/800x400.png',
  },
  {
    id: '2',
    title: 'Mastering Modern CSS',
    slug: 'mastering-modern-css',
    content: `## Beyond the Basics

CSS has evolved significantly over the years. Modern CSS offers powerful features that can simplify complex layouts and create stunning visual effects. This post dives into some advanced CSS techniques.

### Advanced Techniques:

*   **CSS Grid and Flexbox:** For creating responsive and complex layouts with ease.
*   **Custom Properties (Variables):** Enhancing maintainability and theming capabilities.
*   **CSS Houdini:** A set of low-level APIs that expose parts of the CSS engine, allowing developers to extend CSS by writing JavaScript.
*   **Container Queries:** Styling elements based on the size of their containing element, rather than the viewport.
*   **Modern Selectors:** Leveraging new selectors for more precise styling.

Embracing these modern CSS features can elevate your web design and development skills, enabling you to build more sophisticated and performant user interfaces.
`,
    excerpt: 'A deep dive into advanced CSS techniques like Grid, Flexbox, Custom Properties, Houdini, and Container Queries.',
    publicationDate: new Date('2024-04-22T14:30:00Z').toISOString(),
    categories: ['Web Development', 'CSS'],
    tags: ['CSS Grid', 'Flexbox', 'Custom Properties', 'Houdini', 'Responsive Design'],
    featuredImage: 'https://placehold.co/800x400.png',
  },
  {
    id: '3',
    title: 'The Rise of No-Code and Low-Code Platforms',
    slug: 'the-rise-of-no-code-and-low-code-platforms',
    content: `## Democratizing Development

No-code and low-code platforms are transforming how applications are built, empowering individuals with limited or no programming skills to create software. This post examines their impact.

### Impact and Considerations:

*   **Accelerated Development:** Significantly speeding up the application development lifecycle.
*   **Reduced Costs:** Lowering the financial barrier to software development.
*   **Empowering Citizen Developers:** Enabling business users and domain experts to build their own solutions.
*   **Limitations:** Understanding the constraints in terms of customization, scalability, and complex logic.
*   **The Role of Traditional Developers:** Focusing on more complex integrations, custom components, and platform extensions.

While not a replacement for traditional development in all scenarios, no-code/low-code tools are valuable additions to the software creation toolkit, fostering innovation and broader participation.
`,
    excerpt: 'Examining the impact of no-code and low-code platforms on software development and the role of traditional developers.',
    publicationDate: new Date('2024-03-15T09:00:00Z').toISOString(),
    categories: ['Software Development', 'Technology Trends'],
    tags: ['No-Code', 'Low-Code', 'Innovation', 'Future of Work'],
    featuredImage: 'https://placehold.co/800x400.png',
  },
];

export async function getAllPosts(): Promise<BlogPost[]> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...posts].sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return posts.find(post => post.slug === slug);
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return posts.find(post => post.id === id);
}

export async function addPost(postData: Omit<BlogPost, 'id' | 'slug' | 'publicationDate'> & { content: string }): Promise<BlogPost> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const newPost: BlogPost = {
    ...postData,
    id: Date.now().toString(),
    slug: generateSlug(postData.title),
    publicationDate: new Date().toISOString(),
  };
  posts.unshift(newPost); // Add to the beginning for newest first
  return newPost;
}

export async function updatePost(id: string, postData: Partial<Omit<BlogPost, 'id' | 'slug'>> & { title?: string, content?: string }): Promise<BlogPost | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const index = posts.findIndex(post => post.id === id);
  if (index !== -1) {
    const existingPost = posts[index];
    const updatedPost = { ...existingPost, ...postData };
    if (postData.title && postData.title !== existingPost.title) {
      updatedPost.slug = generateSlug(postData.title);
    }
    posts[index] = updatedPost;
    return updatedPost;
  }
  return null;
}

export async function deletePost(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const initialLength = posts.length;
  posts = posts.filter(post => post.id !== id);
  return posts.length < initialLength;
}
