import express from 'express';

const router = express.Router();

const FLOWUS_API_BASE = 'https://api.flowus.cn/v1';
const PAPERS_PAGE_ID = '9162bbd1-8518-4365-8cdd-ffd8a60a905c';

function convertToCSV(papers) {
  const headers = ['ID', 'Title', 'Authors', 'Journal', 'Year', 'DOI', 'URL', 'Abstract', 'Keywords', 'Created', 'Updated'];
  const rows = papers.map(p => [
    p.id,
    `"${(p.title || '').replace(/"/g, '""')}"`,
    `"${(p.authors || []).join('; ').replace(/"/g, '""')}"`,
    `"${(p.journal || '').replace(/"/g, '""')}"`,
    p.year || '',
    p.doi || '',
    p.url || '',
    `"${(p.abstract || '').replace(/"/g, '""')}"`,
    `"${(p.keywords || []).join('; ').replace(/"/g, '""')}"`,
    p.createdAt || '',
    p.updatedAt || ''
  ].join(','));
  
  return [headers.join(','), ...rows].join('\n');
}

function convertToBibTeX(papers) {
  return papers.map((p, index) => {
    const authors = (p.authors || []).join(' and ');
    const key = p.authors?.[0]?.split(' ').pop()?.toLowerCase() || 'unknown';
    const year = p.year || 'n.d.';
    
    return `@article{${key}${year},
  title = {${p.title || 'Untitled'}},
  author = {${authors || 'Unknown'}},
  journal = {${p.journal || ''}},
  year = {${year}},
  volume = {${p.volume || ''}},
  number = {${p.issue || ''}},
  pages = {${p.pages || ''}},
  doi = {${p.doi || ''}},
  url = {${p.url || ''}},
  abstract = {${(p.abstract || '').replace(/[{}]/g, '')}}
}`;
  }).join('\n\n');
}

function convertToRIS(papers) {
  return papers.map(p => {
    const lines = [
      'TY  - JOUR',
      `TI  - ${p.title || 'Untitled'}`,
      ...(p.authors || []).map(a => `AU  - ${a}`),
      `JO  - ${p.journal || ''}`,
      `PY  - ${p.year || ''}`,
      `VL  - ${p.volume || ''}`,
      `IS  - ${p.issue || ''}`,
      `SP  - ${p.pages || ''}`,
      `DO  - ${p.doi || ''}`,
      `UR  - ${p.url || ''}`,
      `AB  - ${p.abstract || ''}`,
      ...(p.keywords || []).map(k => `KW  - ${k}`),
      'ER  - '
    ];
    return lines.join('\n');
  }).join('\n\n');
}

function convertToMarkdown(papers) {
  return papers.map((p, index) => {
    return `# ${index + 1}. ${p.title || 'Untitled'}

## 信息

- **作者**: ${(p.authors || []).join(', ') || '未知'}
- **期刊/会议**: ${p.journal || '未知'}
- **年份**: ${p.year || '未知'}
- **DOI**: ${p.doi || '无'}
- **URL**: ${p.url || '无'}

## 摘要

${p.abstract || '无'}

## 关键词

${(p.keywords || []).map(k => `- ${k}`).join('\n') || '无'}

---
`;
  }).join('\n');
}

function convertToWordHTML(papers) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>论文列表导出</title>
  <style>
    body { font-family: 'Microsoft YaHei', Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; }
    h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
    .paper { background: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0; }
    .paper h2 { color: #1e40af; margin-top: 0; }
    .info { color: #64748b; font-size: 14px; margin: 10px 0; }
    .abstract { background: white; padding: 15px; border-radius: 8px; margin-top: 15px; }
    .keywords { margin-top: 15px; }
    .keyword { display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 12px; margin: 4px; border-radius: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>📚 论文列表导出</h1>
  <p style="color: #64748b;">共 ${papers.length} 篇论文 | 导出时间: ${new Date().toLocaleString('zh-CN')}</p>
  
  ${papers.map((p, index) => `
  <div class="paper">
    <h2>${index + 1}. ${p.title || 'Untitled'}</h2>
    <div class="info">
      <strong>👥 作者:</strong> ${(p.authors || []).join(', ') || '未知'}<br>
      <strong>📖 期刊:</strong> ${p.journal || '未知'} | <strong>📅 年份:</strong> ${p.year || '未知'}
    </div>
    ${p.abstract ? `<div class="abstract"><strong>📝 摘要:</strong><br>${p.abstract}</div>` : ''}
    ${p.doi ? `<div class="info"><strong>🔗 DOI:</strong> ${p.doi}</div>` : ''}
    ${p.url ? `<div class="info"><strong>🔗 URL:</strong> <a href="${p.url}">${p.url}</a></div>` : ''}
    ${(p.keywords || []).length > 0 ? `
    <div class="keywords">
      <strong>🏷️ 关键词:</strong><br>
      ${p.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
    </div>` : ''}
  </div>
  `).join('')}
  
  <div style="text-align: center; color: #94a3b8; margin-top: 40px; padding: 20px; border-top: 1px solid #e2e8f0;">
    <p>由 FlowUs Manager 导出</p>
  </div>
</body>
</html>`;
  
  return html;
}

// Get papers from FlowUs API
async function fetchPapersFromFlowUs(token) {
  try {
    const response = await fetch(`${FLOWUS_API_BASE}/blocks/${PAPERS_PAGE_ID}/children?page_size=100`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`FlowUs API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform API response to our paper format
    const papers = (data.data || []).map(item => ({
      id: item.id,
      title: item.title || 'Untitled',
      authors: [],
      journal: '',
      year: item.created ? new Date(item.created).getFullYear() : null,
      volume: '',
      issue: '',
      pages: '',
      doi: '',
      url: `https://flowus.cn/docs/${item.id}`,
      abstract: '',
      keywords: [],
      tags: [],
      createdAt: item.created,
      updatedAt: item.edited,
      importedFrom: 'FlowUs API'
    }));
    
    return papers;
  } catch (error) {
    console.error('Error fetching from FlowUs:', error);
    throw error;
  }
}

// Main export endpoint
router.get('/papers', async (req, res) => {
  const { token, format } = req.query;
  
  console.log('Export papers API called with:', { format, hasToken: !!token });
  
  if (!token) {
    return res.status(400).json({ 
      success: false, 
      error: 'Token is required',
      message: 'Please provide your FlowUs API token as a query parameter'
    });
  }
  
  try {
    // Fetch papers from FlowUs
    const papers = await fetchPapersFromFlowUs(token);
    
    console.log(`Fetched ${papers.length} papers from FlowUs`);
    
    // Determine export format
    const exportFormat = (format || 'json').toLowerCase();
    
    // Set response headers based on format
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (exportFormat) {
      case 'json':
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=papers_${timestamp}.json`);
        res.json({
          success: true,
          count: papers.length,
          exportedAt: new Date().toISOString(),
          data: papers
        });
        break;
        
      case 'csv':
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=papers_${timestamp}.csv`);
        res.send('\ufeff' + convertToCSV(papers)); // BOM for Excel
        break;
        
      case 'bibtex':
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=papers_${timestamp}.bib`);
        res.send(convertToBibTeX(papers));
        break;
        
      case 'ris':
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=papers_${timestamp}.ris`);
        res.send(convertToRIS(papers));
        break;
        
      case 'markdown':
      case 'md':
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=papers_${timestamp}.md`);
        res.send(convertToMarkdown(papers));
        break;
        
      case 'word':
      case 'html':
        res.setHeader('Content-Type', 'application/vnd.ms-word; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=papers_${timestamp}.doc`);
        res.send(convertToWordHTML(papers));
        break;
        
      default:
        res.status(400).json({
          success: false,
          error: 'Unsupported format',
          message: `Supported formats: json, csv, bibtex, ris, markdown, word`,
          supportedFormats: ['json', 'csv', 'bibtex', 'ris', 'markdown', 'word']
        });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: 'Export failed',
      message: error.message
    });
  }
});

// Get supported export formats
router.get('/formats', (req, res) => {
  res.json({
    success: true,
    formats: [
      { 
        id: 'json', 
        name: 'JSON', 
        extension: '.json',
        description: '完整的JSON数据格式，适合程序处理',
        mimeType: 'application/json'
      },
      { 
        id: 'csv', 
        name: 'CSV', 
        extension: '.csv',
        description: 'Excel兼容的表格格式',
        mimeType: 'text/csv'
      },
      { 
        id: 'bibtex', 
        name: 'BibTeX', 
        extension: '.bib',
        description: 'LaTeX引用格式',
        mimeType: 'text/plain'
      },
      { 
        id: 'ris', 
        name: 'RIS', 
        extension: '.ris',
        description: '学术文献标准格式',
        mimeType: 'text/plain'
      },
      { 
        id: 'markdown', 
        name: 'Markdown', 
        extension: '.md',
        description: 'Markdown文档格式',
        mimeType: 'text/markdown'
      },
      { 
        id: 'word', 
        name: 'Word/HTML', 
        extension: '.doc',
        description: 'Word文档格式',
        mimeType: 'application/vnd.ms-word'
      }
    ]
  });
});

export default router;
