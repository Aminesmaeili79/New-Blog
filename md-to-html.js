export function simpleMarkdownToHTML(markdown) {
  return markdown
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
    .replace(/^##### (.*$)/gim, "<h5>$1</h5>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/~~(.*?)~~/gim, "<del>$1</del>")
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
    .replace(/`(.*?)`/gim, "<code>$1</code>")
    .replace(/^\s*>\s*(.*)$/gim, "<blockquote>$1</blockquote>")
    .replace(/^\s*-\s+(.*)$/gim, "<ul><li>$1</li></ul>")
    .replace(/<\/ul>\s*<ul>/gim, "")
    .replace(/^\s*\d+\.\s+(.*)$/gim, "<ol><li>$1</li></ol>")
    .replace(/<\/ol>\s*<ol>/gim, "")
    .replace(/^\s*---\s*$/gim, "<hr />")
    .replace(/^\s*--\s*$/gim, "<hr />")
    .replace(/\n$/gim, "<br />")
    .replace(/<ul>\s*<\/ul>/gim, "")
    .replace(/<ol>\s*<\/ol>/gim, "")
    .replace(/<blockquote>\s*<br \/>/gim, "<blockquote>")
    .replace(/<blockquote>\s*<\/blockquote>/gim, "");
}

export function getMarkdownMetaData(markdown) {
  const metaData = {};
  const lines = markdown.split("\n");

  for (const line of lines) {
    if (line.startsWith("title:")) {
      metaData.title = line.replace("title:", "").trim();
    } else if (line.startsWith("date:")) {
      metaData.date = line.replace("date:", "").trim();
    } else if (line.startsWith("author:")) {
      metaData.author = line.replace("author:", "").trim();
    } else if (line.startsWith("tags:")) {
      metaData.tags = line
        .replace("tags:", "")
        .trim()
        .split(",")
        .map((tag) => tag.trim());
    } else if (line.startsWith("description:")) {
      metaData.description = line.replace("description:", "").trim();
    } else if (line.startsWith("image:")) {
      metaData.image = line.replace("image:", "").trim();
    } else if (line.startsWith("category:")) {
      metaData.category = line.replace("category:", "").trim();
    }
  }

  return metaData;
}
