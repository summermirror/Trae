# FlowUs Papers Export API

## 概述

FlowUs Manager 提供了一个强大的导出API，允许你通过HTTP请求的方式导出论文数据，支持多种格式。

## API端点

### 基础URL
```
http://localhost:3001/api/export
```

### 获取支持的格式列表
```bash
GET /api/export/formats
```

响应示例：
```json
{
  "success": true,
  "formats": [
    {
      "id": "json",
      "name": "JSON",
      "extension": ".json",
      "description": "完整的JSON数据格式，适合程序处理",
      "mimeType": "application/json"
    },
    {
      "id": "csv",
      "name": "CSV",
      "extension": ".csv",
      "description": "Excel兼容的表格格式",
      "mimeType": "text/csv"
    },
    ...
  ]
}
```

### 导出论文
```bash
GET /api/export/papers
```

#### 查询参数
- `token` (必需): FlowUs API令牌
- `format` (可选): 导出格式，默认为 `json`

#### 支持的格式
1. **json** - JSON格式，适合程序处理
2. **csv** - CSV格式，Excel兼容
3. **bibtex** - BibTeX格式，LaTeX引用
4. **ris** - RIS格式，学术文献标准
5. **markdown** - Markdown格式，便于阅读
6. **word** - Word/HTML格式，可直接打开

## 使用示例

### 使用curl导出JSON格式
```bash
curl "http://localhost:3001/api/export/papers?token=YOUR_TOKEN&format=json" \
  -H "Content-Type: application/json" \
  -o papers.json
```

### 使用curl导出CSV格式
```bash
curl "http://localhost:30001/api/export/papers?token=YOUR_TOKEN&format=csv" \
  -H "Content-Type: text/csv; charset=utf-8" \
  -o papers.csv
```

### 使用curl导出Markdown格式
```bash
curl "http://localhost:3001/api/export/papers?token=YOUR_TOKEN&format=markdown" \
  -H "Content-Type: text/markdown; charset=utf-8" \
  -o papers.md
```

### 使用curl导出BibTeX格式
```bash
curl "http://localhost:3001/api/export/papers?token=YOUR_TOKEN&format=bibtex" \
  -H "Content-Type: text/plain; charset=utf-8" \
  -o papers.bib
```

### 使用curl导出Word格式
```bash
curl "http://localhost:3001/api/export/papers?token=YOUR_TOKEN&format=word" \
  -H "Content-Type: application/vnd.ms-word; charset=utf-8" \
  -o papers.doc
```

## 完整示例脚本

### Bash脚本 (test_export_api.sh)
```bash
#!/bin/bash
API_TOKEN="YOUR_FLOWUS_TOKEN"
BASE_URL="http://localhost:3001"

# 导出JSON
curl "${BASE_URL}/api/export/papers?token=${API_TOKEN}&format=json" \
  -o papers.json

# 导出CSV
curl "${BASE_URL}/api/export/papers?token=${API_TOKEN}&format=csv" \
  -o papers.csv

# 导出Markdown
curl "${BASE_URL}/api/export/papers?token=${API_TOKEN}&format=markdown" \
  -o papers.md
```

### Node.js脚本 (test_export_api.mjs)
```javascript
import fetch from 'node:fetch';

const API_TOKEN = 'YOUR_FLOWUS_TOKEN';
const BASE_URL = 'http://localhost:3001';

async function exportPapers(format = 'json') {
  const response = await fetch(
    `${BASE_URL}/api/export/papers?token=${API_TOKEN}&format=${format}`
  );
  
  const data = format === 'json' 
    ? await response.json() 
    : await response.text();
  
  return data;
}

// 导出所有格式
const jsonData = await exportPapers('json');
const csvData = await exportPapers('csv');
const mdData = await exportPapers('markdown');
```

### Python脚本
```python
import requests

API_TOKEN = 'YOUR_FLOWUS_TOKEN'
BASE_URL = 'http://localhost:3001/api/export/papers'

def export_papers(format='json'):
    params = {
        'token': API_TOKEN,
        'format': format
    }
    
    response = requests.get(BASE_URL, params=params)
    
    if format == 'json':
        return response.json()
    else:
        return response.text

# 导出JSON
json_data = export_papers('json')
print(f"导出 {json_data['count']} 篇论文")

# 导出CSV
csv_data = export_papers('csv')
with open('papers.csv', 'w', encoding='utf-8') as f:
    f.write(csv_data)
```

### JavaScript (浏览器端)
```javascript
const API_TOKEN = 'YOUR_FLOWUS_TOKEN';
const BASE_URL = 'http://localhost:3001';

async function exportPapers(format = 'json') {
  const response = await fetch(
    `${BASE_URL}/api/export/papers?token=${API_TOKEN}&format=${format}`
  );
  
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `papers.${format === 'markdown' ? 'md' : format}`;
  a.click();
  URL.revokeObjectURL(url);
}

// 使用
exportPapers('json');  // 导出JSON
exportPapers('csv');   // 导出CSV
exportPapers('markdown'); // 导出Markdown
```

## 响应示例

### JSON格式响应
```json
{
  "success": true,
  "count": 56,
  "exportedAt": "2026-05-21T10:30:00.000Z",
  "data": [
    {
      "id": "e131af40-5d43-42ba-a373-e3d5da9bcd40",
      "title": "Comparative analysis of microdamage-affected chloride transport...",
      "authors": [],
      "journal": "",
      "year": 2024,
      "doi": "",
      "url": "https://flowus.cn/docs/e131af40-5d43-42ba-a373-e3d5da9bcd40",
      "abstract": "",
      "keywords": [],
      "tags": [],
      "createdAt": "2024-10-25T08:39:29.582Z",
      "updatedAt": "2026-05-03T15:20:00.504Z",
      "importedFrom": "FlowUs API"
    },
    // ... more papers
  ]
}
```

### CSV格式响应
```csv
ID,Title,Authors,Journal,Year,DOI,URL,Abstract,Keywords,Created,Updated
"e131af40-5d43-42ba-a373-e3d5da9bcd40","Comparative analysis of microdamage-affected chloride transport...","","","2024","","https://flowus.cn/docs/e131af40-5d43-42ba-a373-e3d5da9bcd40","","","2024-10-25T08:39:29.582Z","2026-05-03T15:20:00.504Z"
```

### Markdown格式响应
```markdown
# 1. Comparative analysis of microdamage-affected chloride transport...

## 信息

- **作者**: 
- **期刊/会议**: 
- **年份**: 2024
- **DOI**: 
- **URL**: https://flowus.cn/docs/e131af40-5d43-42ba-a373-e3d5da9bcd40

## 摘要

无

## 关键词

无

---
```

## 错误处理

### 缺少Token
```json
{
  "success": false,
  "error": "Token is required",
  "message": "Please provide your FlowUs API token as a query parameter"
}
```

### 不支持的格式
```json
{
  "success": false,
  "error": "Unsupported format",
  "message": "Supported formats: json, csv, bibtex, ris, markdown, word",
  "supportedFormats": ["json", "csv", "bibtex", "ris", "markdown", "word"]
}
```

### API错误
```json
{
  "success": false,
  "error": "Export failed",
  "message": "FlowUs API error: 401"
}
```

## 最佳实践

1. **始终提供Token**: 确保API请求包含有效的FlowUs API令牌
2. **选择合适格式**: 
   - 程序处理: 使用JSON
   - 数据分析: 使用CSV
   - 文档编写: 使用Markdown
   - 学术引用: 使用BibTeX
3. **错误处理**: 实现适当的错误处理和重试机制
4. **数据验证**: 导出后验证数据完整性
5. **定期导出**: 建议定期导出数据以备份

## 测试API

运行测试脚本：
```bash
# 使用Bash脚本
./test_export_api.sh

# 使用Node.js脚本
node test_export_api.mjs
```

## 相关文档

- [FlowUs API文档](https://flowus.cn/share/df7cd54f-1c21-4fc1-9fd8-ce81be1918a5)
- [FlowUs Manager 使用指南](./README.md)
- [论文管理功能](./PAPERS_GUIDE.md)

## 技术支持

如有问题，请检查：
1. 服务器是否运行 (`npm run server`)
2. API令牌是否正确
3. 网络连接是否正常
4. 请求参数是否完整
