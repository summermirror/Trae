import type { Article } from '../types';

export function exportArticle(article: Article, format: string): void {
  switch (format) {
    case 'markdown':
      exportToMarkdown(article);
      break;
    case 'json':
      exportToJson(article);
      break;
    case 'csv':
      exportToCsv(article);
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

function exportToMarkdown(article: Article) {
  const content = `# ${article.title}

${article.content}

---

Tags: ${article.tags.join(', ')}

Views: ${article.views} | Likes: ${article.likes}
`;
  downloadFile(content, `${sanitizeFilename(article.title)}.md`, 'text/markdown');
}

function exportToJson(article: Article) {
  const content = JSON.stringify(article, null, 2);
  downloadFile(content, `${sanitizeFilename(article.title)}.json`, 'application/json');
}

function exportToCsv(article: Article) {
  const headers = ['ID', 'Title', 'Views', 'Likes', 'Tags', 'Created', 'Updated'];
  const row = [
    article.id,
    article.title,
    article.views,
    article.likes,
    article.tags.join(';'),
    article.createdAt,
    article.updatedAt,
  ];
  const content = [headers.join(','), row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')].join('\n');
  downloadFile(content, `${sanitizeFilename(article.title)}.csv`, 'text/csv');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportBatch(
  articles: Article[], 
  format: string,
  onProgress?: (progress: number, currentFile: string) => void
): Promise<void> {
  const total = articles.length;
  for (let i = 0; i < total; i++) {
    const article = articles[i];
    if (onProgress) {
      onProgress(((i) / total) * 100, article.title);
    }
    exportArticle(article, format);
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  if (onProgress) {
    onProgress(100, '');
  }
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/[<>:"/\\|?*]/g, '_').substring(0, 100);
}
