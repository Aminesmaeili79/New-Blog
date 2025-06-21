const fs = require("fs");
const path = require("path");
const mdToHtml = require("./md-to-html");

const currentDir = __dirname;
const blogDir = `${currentDir}/blogs`;
const distDir = `${currentDir}/dist`;
const blogPosts = fs.readdirSync(blogDir);

// Create dist directory
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Copy static assets
fs.mkdirSync(`${distDir}/styles`, { recursive: true });
fs.mkdirSync(`${distDir}/images`, { recursive: true });
fs.copyFileSync(
  `${currentDir}/styles/index.css`,
  `${distDir}/styles/index.css`
);

// Copy images
if (fs.existsSync(`${currentDir}/images`)) {
  const images = fs.readdirSync(`${currentDir}/images`);
  images.forEach((image) => {
    fs.copyFileSync(
      `${currentDir}/images/${image}`,
      `${distDir}/images/${image}`
    );
  });
}

// Generate home page
const indexHtml = fs.readFileSync(`${currentDir}/index.html`, "utf-8");
let blogPostsHTML = "";

blogPosts.forEach((post) => {
  const mdFile = fs.readFileSync(`${blogDir}/${post}`, "utf-8");
  const metaData = mdToHtml.getMarkdownMetaData(mdFile);
  const slug = metaData.title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  blogPostsHTML += `
    <article class="blog-post">
      <header class="blog-post-header">
        <h2><a href="/blog/${slug}.html" class="blog-post-link">${
    metaData.title
  }</a></h2>
        <time datetime="${metaData.date}" class="blog-date">${
    metaData.date
  }</time>
      </header>
      <p class="blog-description">${metaData.description}</p>
      <div class="blog-meta">
        <p><strong>Author:</strong> ${metaData.author}</p>
        <p><strong>Tags:</strong> ${metaData.tags.join(", ")}</p>
      </div>
      ${
        metaData.image
          ? `<img src="${metaData.image}" alt="${metaData.title}" loading="lazy" />`
          : ""
      }
      <div class="blog-actions">
        <a href="/blog/${slug}.html" class="read-more-btn">Read More →</a>
      </div>
    </article>
  `;
});

const finalHTML = indexHtml.replace(
  "<!-- Blog posts will be inserted here -->",
  blogPostsHTML
);
fs.writeFileSync(`${distDir}/index.html`, finalHTML);

// Generate individual blog pages
fs.mkdirSync(`${distDir}/blog`, { recursive: true });

blogPosts.forEach((post) => {
  const mdFile = fs.readFileSync(`${blogDir}/${post}`, "utf-8");
  const htmlContent = mdToHtml.simpleMarkdownToHTML(mdFile);
  const metaData = mdToHtml.getMarkdownMetaData(mdFile);
  const slug = metaData.title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  const blogPostHTML = generateBlogPostHTML(metaData, htmlContent);
  fs.writeFileSync(`${distDir}/blog/${slug}.html`, blogPostHTML);
});

// Generate sitemap
const sitemap = generateSitemap(blogPosts);
fs.writeFileSync(`${distDir}/sitemap.xml`, sitemap);

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://yourusername.github.io/your-repo-name/sitemap.xml`;
fs.writeFileSync(`${distDir}/robots.txt`, robotsTxt);

console.log("Static site built successfully in /dist folder!");

function generateBlogPostHTML(metaData, content) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaData.title} - Amin's Blog</title>
  <meta name="description" content="${metaData.description}">
  <meta name="keywords" content="${metaData.tags.join(", ")}">
  <meta property="og:title" content="${metaData.title}">
  <meta property="og:description" content="${metaData.description}">
  <meta property="og:image" content="${metaData.image}">
  <link rel="stylesheet" href="../styles/index.css">
</head>
<body>
  <header class="header">
    <a href="../index.html" aria-label="Amin's Blog Home">
      <h1>Amin's Blogs</h1>
    </a>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="../index.html">All Posts</a></li>
        <li><a href="../about.html">About Me</a></li>
      </ul>
    </nav>
  </header>
  <main class="main-content">
    <article class="single-blog-post">
      <header class="blog-header">
        <h1>${metaData.title}</h1>
        <div class="blog-meta-info">
          <time datetime="${metaData.date}">${metaData.date}</time>
          <span class="author">By ${metaData.author}</span>
          <div class="tags">
            ${metaData.tags
              .map((tag) => `<span class="tag">${tag}</span>`)
              .join("")}
          </div>
        </div>
        ${
          metaData.image
            ? `<img src="../${metaData.image}" alt="${metaData.title}" class="featured-image" />`
            : ""
        }
      </header>
      <div class="blog-content">
        ${content}
      </div>
      <footer class="blog-footer">
        <a href="../index.html" class="back-to-blog">← Back to All Posts</a>
      </footer>
    </article>
  </main>
</body>
</html>
  `;
}

function generateSitemap(blogPosts) {
  const baseUrl = "https://yourusername.github.io/your-repo-name";
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  blogPosts.forEach((post) => {
    const mdFile = fs.readFileSync(`${currentDir}/blogs/${post}`, "utf-8");
    const metaData = mdToHtml.getMarkdownMetaData(mdFile);
    const slug = metaData.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    sitemap += `
  <url>
    <loc>${baseUrl}/blog/${slug}.html</loc>
    <lastmod>${metaData.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  sitemap += "\n</urlset>";
  return sitemap;
}
