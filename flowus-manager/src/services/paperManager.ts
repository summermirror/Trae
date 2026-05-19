import type { Paper, ImportExportSettings } from '../types/paper';

export const paperStorage = {
  STORAGE_KEY: 'flowus_papers',

  savePapers: (papers: Paper[]) => {
    localStorage.setItem(paperStorage.STORAGE_KEY, JSON.stringify(papers));
  },

  loadPapers: (): Paper[] => {
    const data = localStorage.getItem(paperStorage.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  addPaper: (paper: Paper) => {
    const papers = paperStorage.loadPapers();
    papers.push(paper);
    paperStorage.savePapers(papers);
  },

  updatePaper: (id: string, updates: Partial<Paper>) => {
    const papers = paperStorage.loadPapers();
    const index = papers.findIndex(p => p.id === id);
    if (index !== -1) {
      papers[index] = { ...papers[index], ...updates };
      paperStorage.savePapers(papers);
    }
  },

  deletePaper: (id: string) => {
    const papers = paperStorage.loadPapers();
    const filtered = papers.filter(p => p.id !== id);
    paperStorage.savePapers(filtered);
  },

  clearAll: () => {
    localStorage.removeItem(paperStorage.STORAGE_KEY);
  }
};

export const importPapers = {
  fromJSON: (jsonString: string): Paper[] => {
    try {
      const data = JSON.parse(jsonString);
      const papers = Array.isArray(data) ? data : [data];
      return papers.map(paper => ({
        id: paper.id || crypto.randomUUID(),
        title: paper.title || 'Untitled',
        authors: paper.authors || [],
        journal: paper.journal,
        year: paper.year,
        volume: paper.volume,
        issue: paper.issue,
        pages: paper.pages,
        doi: paper.doi,
        url: paper.url,
        abstract: paper.abstract,
        keywords: paper.keywords || [],
        tags: paper.tags || [],
        notes: paper.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        importedFrom: 'JSON Import'
      }));
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  },

  fromCSV: (csvString: string): Paper[] => {
    const lines = csvString.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const papers: Paper[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const paper: any = {
        id: crypto.randomUUID(),
        title: '',
        authors: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        importedFrom: 'CSV Import'
      };

      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header) {
          case 'title':
            paper.title = value;
            break;
          case 'authors':
            paper.authors = value.split(';').map((a: string) => a.trim());
            break;
          case 'journal':
          case 'journal name':
            paper.journal = value;
            break;
          case 'year':
            paper.year = parseInt(value) || undefined;
            break;
          case 'volume':
            paper.volume = value;
            break;
          case 'issue':
            paper.issue = value;
            break;
          case 'pages':
            paper.pages = value;
            break;
          case 'doi':
            paper.doi = value;
            break;
          case 'url':
            paper.url = value;
            break;
          case 'abstract':
            paper.abstract = value;
            break;
          case 'keywords':
            paper.keywords = value.split(';').map((k: string) => k.trim());
            break;
        }
      });

      if (paper.title) {
        papers.push(paper);
      }
    }

    return papers;
  },

  fromBibTeX: (bibtexString: string): Paper[] => {
    const entries = bibtexString.match(/@\w+\{[^@]+\}/g) || [];
    const papers: Paper[] = [];

    entries.forEach(entry => {
      const fields: any = {
        id: crypto.randomUUID(),
        authors: [],
        keywords: [],
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        importedFrom: 'BibTeX Import'
      };

      const fieldMatches = entry.matchAll(/(\w+)\s*=\s*[{"]([^}"]+)[}"]/g);
      for (const match of fieldMatches) {
        const [, key, value] = match;
        switch (key.toLowerCase()) {
          case 'title':
            fields.title = value.replace(/[{}]/g, '');
            break;
          case 'author':
            fields.authors = value.replace(/[{}]/g, '').split(' and ').map(a => a.trim());
            break;
          case 'journal':
          case 'booktitle':
            fields.journal = value.replace(/[{}]/g, '');
            break;
          case 'year':
            fields.year = parseInt(value);
            break;
          case 'volume':
            fields.volume = value;
            break;
          case 'number':
            fields.issue = value;
            break;
          case 'pages':
            fields.pages = value;
            break;
          case 'doi':
            fields.doi = value;
            break;
          case 'url':
            fields.url = value;
            break;
          case 'abstract':
            fields.abstract = value;
            break;
          case 'keywords':
            fields.keywords = value.split(',').map((k: string) => k.trim());
            break;
        }
      }

      if (fields.title) {
        papers.push(fields);
      }
    });

    return papers;
  },

  fromText: (text: string, sourceUrl?: string): Paper[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const papers: Paper[] = [];

    let currentPaper: any = null;
    let buffer: string[] = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();

      if (trimmedLine.match(/^\d+[\.\)]\s*.+/) || trimmedLine.match(/^\[.*\]\s*.+/)) {
        if (currentPaper && buffer.length > 0) {
          currentPaper.abstract = buffer.join(' ').trim();
          buffer = [];
        }

        const titleMatch = trimmedLine.match(/^\d+[\.\)]\s*(.+)/) ||
                          trimmedLine.match(/^\[.*\]\s*(.+)/);
        if (titleMatch) {
          currentPaper = {
            id: crypto.randomUUID(),
            title: titleMatch[1].trim(),
            authors: [],
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            importedFrom: sourceUrl || 'Text Import'
          };
          papers.push(currentPaper);
        }
      } else if (currentPaper && trimmedLine.match(/^by\s+.+/i)) {
        const authorMatch = trimmedLine.match(/by\s+(.+)/i);
        if (authorMatch) {
          currentPaper.authors = authorMatch[1].split(/,|and/).map(a => a.trim());
        }
      } else if (currentPaper && trimmedLine.match(/^\d{4}$/)) {
        currentPaper.year = parseInt(trimmedLine);
      } else if (currentPaper && trimmedLine.length > 20) {
        buffer.push(trimmedLine);
      }
    });

    if (currentPaper && buffer.length > 0) {
      currentPaper.abstract = buffer.join(' ').trim();
    }

    return papers;
  }
};

export const exportPapers = {
  toJSON: (papers: Paper[], settings?: Partial<ImportExportSettings>): string => {
    let exportData = papers;

    if (settings && !settings.includeAbstract) {
      exportData = papers.map(p => ({ ...p, abstract: undefined }));
    }

    return JSON.stringify(exportData, null, 2);
  },

  toCSV: (papers: Paper[], settings?: Partial<ImportExportSettings>): string => {
    const headers = ['Title', 'Authors', 'Journal', 'Year', 'Volume', 'Issue', 'Pages', 'DOI', 'URL'];
    if (settings?.includeAbstract) headers.push('Abstract');
    if (settings?.includeKeywords) headers.push('Keywords');

    const rows = papers.map(paper => {
      const row = [
        paper.title,
        paper.authors.join('; '),
        paper.journal || '',
        paper.year?.toString() || '',
        paper.volume || '',
        paper.issue || '',
        paper.pages || '',
        paper.doi || '',
        paper.url || ''
      ];

      if (settings?.includeAbstract) row.push(paper.abstract || '');
      if (settings?.includeKeywords) row.push((paper.keywords || []).join('; '));

      return row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  },

  toBibTeX: (papers: Paper[]): string => {
    return papers.map(paper => {
      const type = paper.journal ? 'article' : 'misc';
      const lines = [`@${type}{${paper.id.slice(0, 8)},`];

      if (paper.title) lines.push(`  title = {${paper.title}},`);
      if (paper.authors.length) lines.push(`  author = {${paper.authors.join(' and ')}},`);
      if (paper.journal) lines.push(`  journal = {${paper.journal}},`);
      if (paper.year) lines.push(`  year = {${paper.year}},`);
      if (paper.volume) lines.push(`  volume = {${paper.volume}},`);
      if (paper.issue) lines.push(`  number = {${paper.issue}},`);
      if (paper.pages) lines.push(`  pages = {${paper.pages}},`);
      if (paper.doi) lines.push(`  doi = {${paper.doi}},`);
      if (paper.url) lines.push(`  url = {${paper.url}},`);
      if (paper.abstract) lines.push(`  abstract = {${paper.abstract}},`);
      if (paper.keywords?.length) lines.push(`  keywords = {${paper.keywords.join(', ')}},`);

      lines.push('}');
      return lines.join('\n');
    }).join('\n\n');
  },

  toRIS: (papers: Paper[]): string => {
    return papers.map(paper => {
      const lines: string[] = [];

      lines.push('TY  - JOUR');
      if (paper.title) lines.push(`TI  - ${paper.title}`);
      paper.authors.forEach(author => lines.push(`AU  - ${author}`));
      if (paper.journal) lines.push(`JO  - ${paper.journal}`);
      if (paper.year) lines.push(`PY  - ${paper.year}`);
      if (paper.volume) lines.push(`VL  - ${paper.volume}`);
      if (paper.issue) lines.push(`IS  - ${paper.issue}`);
      if (paper.pages) {
        const pageParts = paper.pages.split('-');
        if (pageParts.length === 2) {
          lines.push(`SP  - ${pageParts[0]}`);
          lines.push(`EP  - ${pageParts[1]}`);
        } else {
          lines.push(`SP  - ${paper.pages}`);
        }
      }
      if (paper.doi) lines.push(`DO  - ${paper.doi}`);
      if (paper.url) lines.push(`UR  - ${paper.url}`);
      if (paper.abstract) lines.push(`AB  - ${paper.abstract}`);
      paper.keywords?.forEach(keyword => lines.push(`KW  - ${keyword}`));
      lines.push('ER  -');

      return lines.join('\n');
    }).join('\n\n');
  },

  toMarkdown: (papers: Paper[]): string => {
    return papers.map((paper, index) => {
      const lines = [
        `## ${index + 1}. ${paper.title}`,
        '',
        paper.authors.length ? `**Authors:** ${paper.authors.join(', ')}` : '',
        paper.journal ? `**Journal:** ${paper.journal}` : '',
        paper.year ? `**Year:** ${paper.year}` : '',
        paper.doi ? `**DOI:** ${paper.doi}` : '',
        paper.url ? `**URL:** ${paper.url}` : '',
        '',
      ];

      if (paper.abstract) {
        lines.push('### Abstract', '', paper.abstract, '');
      }

      if (paper.keywords?.length) {
        lines.push('### Keywords', '', paper.keywords.join(', '), '');
      }

      if (paper.notes) {
        lines.push('### Notes', '', paper.notes, '');
      }

      return lines.filter(line => line !== '').join('\n');
    }).join('\n\n---\n\n');
  },

  toWord: (papers: Paper[]): string => {
    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Papers Export</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .paper { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    h2 { color: #333; margin-bottom: 10px; }
    .meta { color: #666; font-size: 14px; margin-bottom: 15px; }
    .abstract { margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <h1>Papers Collection</h1>
`;

    papers.forEach((paper, index) => {
      html += `
    <div class="paper">
      <h2>${index + 1}. ${paper.title}</h2>
      <div class="meta">
        ${paper.authors.length ? `<strong>Authors:</strong> ${paper.authors.join(', ')}<br>` : ''}
        ${paper.journal ? `<strong>Journal:</strong> ${paper.journal}<br>` : ''}
        ${paper.year ? `<strong>Year:</strong> ${paper.year}<br>` : ''}
        ${paper.doi ? `<strong>DOI:</strong> ${paper.doi}<br>` : ''}
        ${paper.url ? `<strong>URL:</strong> <a href="${paper.url}">${paper.url}</a><br>` : ''}
      </div>
      ${paper.abstract ? `
      <div class="abstract">
        <strong>Abstract:</strong>
        <p>${paper.abstract}</p>
      </div>` : ''}
      ${paper.keywords?.length ? `<p><strong>Keywords:</strong> ${paper.keywords.join(', ')}</p>` : ''}
    </div>
`;
    });

    html += `
</body>
</html>`;

    return html;
  }
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
