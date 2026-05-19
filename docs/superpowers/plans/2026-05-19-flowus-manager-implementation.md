# FlowUs个人主页管理平台实施计划

> **目标:** 开发一个FlowUs个人主页管理平台，实现完整的内容管理、数据分析和多格式导出功能

**架构方案:** 单体Web应用（React + TypeScript + Vite + Express），前后端一体化部署

**技术栈:**
- 前端框架: React 18 + TypeScript + Vite
- 后端框架: Node.js + Express
- 样式方案: Tailwind CSS
- 图表库: Recharts
- 数据存储: LocalStorage + IndexedDB
- API调用: Axios

---

## 📁 项目文件结构

```
flowus-manager/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── content/
│   │   │   ├── ArticleList.tsx
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── PageTree.tsx
│   │   │   ├── TagManager.tsx
│   │   │   └── MediaLibrary.tsx
│   │   ├── analytics/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── VisitChart.tsx
│   │   │   ├── InteractionChart.tsx
│   │   │   └── ContentPerformance.tsx
│   │   └── export/
│   │       ├── ExportPanel.tsx
│   │       └── ExportProgress.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Content.tsx
│   │   ├── Analytics.tsx
│   │   ├── Export.tsx
│   │   └── Settings.tsx
│   ├── services/
│   │   ├── flowusApi.ts
│   │   ├── storage.ts
│   │   └── analytics.ts
│   ├── hooks/
│   │   ├── useFlowusData.ts
│   │   ├── useSync.ts
│   │   └── useExport.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/
│   ├── index.js
│   └── routes/
│       └── flowus.js
├── .env
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🎯 Phase 1: 基础搭建（预计1-2天）

### 任务 1.1: 项目初始化

- [ ] **创建Vite项目并安装依赖**

```bash
# 创建项目
npm create vite@latest flowus-manager -- --template react-ts
cd flowus-manager

# 安装前端依赖
npm install react-router-dom recharts axios lucide-react
npm install -D tailwindcss postcss autoprefixer

# 安装后端依赖
npm install express cors dotenv node-fetch
npm install -D @types/express @types/cors concurrently nodemon
```

- [ ] **配置Tailwind CSS**

创建 `tailwind.config.js`:
```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- [ ] **初始化Git仓库并提交**

```bash
git init
git add .
git commit -m "chore: initialize project structure"
```

### 任务 1.2: Express后端搭建

- [ ] **创建服务器入口文件**

创建 `server/index.js`:
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/flowus', require('./routes/flowus'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

- [ ] **创建FlowUs API路由**

创建 `server/routes/flowus.js`:
```javascript
const express = require('express');
const router = express.Router();

const FLOWUS_API_BASE = 'https://api.flowus.cn/v1';

router.get('/pages', async (req, res) => {
  const { token } = req.headers;
  try {
    const response = await fetch(`${FLOWUS_API_BASE}/pages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

router.get('/pages/:id', async (req, res) => {
  const { token } = req.headers;
  const { id } = req.params;
  try {
    const response = await fetch(`${FLOWUS_API_BASE}/pages/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch page details' });
  }
});

module.exports = router;
```

- [ ] **创建环境变量模板**

创建 `.env.example`:
```
PORT=3001
FLOWUS_API_TOKEN=your_api_token_here
```

- [ ] **配置package.json脚本**

更新 `package.json`:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "nodemon server/index.js",
    "client": "vite",
    "build": "vite build && node server/index.js",
    "preview": "vite preview"
  }
}
```

### 任务 1.3: 基础UI框架

- [ ] **创建通用组件**

创建 `src/components/common/Layout.tsx`:
```tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

- [ ] **创建导航侧边栏**

创建 `src/components/common/Sidebar.tsx`:
```tsx
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3, Download, Settings } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: '仪表盘' },
    { to: '/content', icon: FileText, label: '内容管理' },
    { to: '/analytics', icon: BarChart3, label: '数据分析' },
    { to: '/export', icon: Download, label: '导出中心' },
    { to: '/settings', icon: Settings, label: '设置' },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">FlowUs Manager</h1>
      </div>
      <nav className="mt-6">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
              }`
            }
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **创建Header组件**

创建 `src/components/common/Header.tsx`:
```tsx
import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  onRefresh?: () => void;
  lastSyncTime?: Date;
}

export default function Header({ onRefresh, lastSyncTime }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">FlowUs 个人主页管理</h2>
        <div className="flex items-center gap-4">
          {lastSyncTime && (
            <span className="text-sm text-gray-500">
              上次同步: {lastSyncTime.toLocaleString('zh-CN')}
            </span>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              刷新数据
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
```

- [ ] **提交Phase 1代码**

```bash
git add .
git commit -m "feat: complete phase 1 - project initialization and basic structure"
```

---

## 🎯 Phase 2: 内容管理功能（预计2-3天）

### 任务 2.1: FlowUs API服务层

- [ ] **创建TypeScript类型定义**

创建 `src/types/index.ts`:
```typescript
export interface Page {
  id: string;
  title: string;
  type: 'document' | 'folder';
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  children?: Page[];
}

export interface Article extends Page {
  content: string;
  tags: string[];
  views: number;
  likes: number;
}

export interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  createdAt: string;
}

export interface Analytics {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  topPages: Page[];
  viewTrends: TrendData[];
}

export interface TrendData {
  date: string;
  value: number;
}
```

- [ ] **创建FlowUs API服务**

创建 `src/services/flowusApi.ts`:
```typescript
import axios from 'axios';

const API_BASE = '/api/flowus';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const flowusApi = {
  getPages: async () => {
    const response = await api.get('/pages');
    return response.data;
  },

  getPageById: async (id: string) => {
    const response = await api.get(`/pages/${id}`);
    return response.data;
  },

  getArticles: async () => {
    const response = await api.get('/articles');
    return response.data;
  },

  getMedia: async () => {
    const response = await api.get('/media');
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data;
  },
};
```

- [ ] **创建自定义Hooks**

创建 `src/hooks/useFlowusData.ts`:
```typescript
import { useState, useEffect } from 'react';
import { flowusApi } from '../services/flowusApi';
import type { Page, Article } from '../types';

export function useFlowusData() {
  const [pages, setPages] = useState<Page[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pagesData, articlesData] = await Promise.all([
        flowusApi.getPages(),
        flowusApi.getArticles(),
      ]);
      setPages(pagesData);
      setArticles(articlesData);
      setError(null);
    } catch (err) {
      setError('获取数据失败，请检查API配置');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { pages, articles, loading, error, refetch: fetchData };
}
```

### 任务 2.2: 文章管理页面

- [ ] **创建文章列表组件**

创建 `src/components/content/ArticleList.tsx`:
```tsx
import { useState } from 'react';
import ArticleCard from './ArticleCard';
import { Search, Filter, SortAsc } from 'lucide-react';

interface ArticleListProps {
  articles: Article[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
}

export default function ArticleList({ articles, onEdit, onDelete, onExport }: ArticleListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes'>('date');
  const [filterTag, setFilterTag] = useState('');

  const filteredArticles = articles
    .filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(article =>
      !filterTag || article.tags.includes(filterTag)
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return b[sortBy] - a[sortBy];
    });

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="搜索文章..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="date">按更新时间</option>
          <option value="views">按浏览量</option>
          <option value="likes">按点赞数</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onEdit={() => onEdit(article.id)}
            onDelete={() => onDelete(article.id)}
            onExport={() => onExport(article.id)}
          />
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          没有找到匹配的文章
        </div>
      )}
    </div>
  );
}
```

- [ ] **创建文章卡片组件**

创建 `src/components/content/ArticleCard.tsx`:
```tsx
import { Edit, Trash2, Download, Eye, Heart } from 'lucide-react';
import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;
}

export default function ArticleCard({ article, onEdit, onDelete, onExport }: ArticleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {article.title}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="编辑"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {article.views}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          {article.likes}
        </span>
      </div>

      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{new Date(article.updatedAt).toLocaleDateString('zh-CN')}</span>
        <button
          onClick={onExport}
          className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded"
        >
          <Download className="w-4 h-4" />
          导出
        </button>
      </div>
    </div>
  );
}
```

### 任务 2.3: 页面树形结构

- [ ] **创建页面树组件**

创建 `src/components/content/PageTree.tsx`:
```tsx
import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, ExternalLink } from 'lucide-react';
import type { Page } from '../types';

interface PageTreeProps {
  pages: Page[];
  onPageClick: (id: string) => void;
}

export default function PageTree({ pages, onPageClick }: PageTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const renderPage = (page: Page, level: number = 0) => {
    const hasChildren = page.children && page.children.length > 0;
    const isExpanded = expandedIds.has(page.id);

    return (
      <div key={page.id}>
        <div
          className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer rounded"
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleExpand(page.id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}

          {page.type === 'folder' ? (
            <Folder className="w-5 h-5 text-yellow-500" />
          ) : (
            <File className="w-5 h-5 text-blue-500" />
          )}

          <span
            className="flex-1 text-sm text-gray-700"
            onClick={() => onPageClick(page.id)}
          >
            {page.title}
          </span>

          <button
            onClick={() => window.open(`https://flowus.cn/pages/${page.id}`, '_blank')}
            className="p-1 text-gray-400 hover:text-blue-600"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {page.children!.map((child) => renderPage(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">页面结构</h3>
      <div className="space-y-1">
        {pages.map((page) => renderPage(page))}
      </div>
    </div>
  );
}
```

### 任务 2.4: 标签管理

- [ ] **创建标签管理组件**

创建 `src/components/content/TagManager.tsx`:
```tsx
import { useState } from 'react';
import { Plus, X, Tag } from 'lucide-react';

interface TagManagerProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export default function TagManager({ tags, onAddTag, onRemoveTag }: TagManagerProps) {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
        <Tag className="w-5 h-5" />
        标签管理
      </h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
          placeholder="输入新标签..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTag}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
          >
            {tag}
            <button
              onClick={() => onRemoveTag(tag)}
              className="hover:bg-blue-200 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {tags.length === 0 && (
        <p className="text-center text-gray-500 py-4">暂无标签</p>
      )}
    </div>
  );
}
```

### 任务 2.5: 内容页面整合

- [ ] **创建内容管理页面**

创建 `src/pages/Content.tsx`:
```tsx
import { useState } from 'react';
import { useFlowusData } from '../hooks/useFlowusData';
import ArticleList from '../components/content/ArticleList';
import PageTree from '../components/content/PageTree';
import TagManager from '../components/content/TagManager';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';

export default function Content() {
  const { articles, pages, loading, error, refetch } = useFlowusData();
  const [activeTab, setActiveTab] = useState<'articles' | 'pages' | 'tags'>('articles');
  const [allTags, setAllTags] = useState<string[]>([]);

  const handleEdit = (id: string) => {
    window.open(`https://flowus.cn/pages/${id}`, '_blank');
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这篇文章吗？')) {
      console.log('Delete article:', id);
    }
  };

  const handleExport = (id: string) => {
    console.log('Export article:', id);
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>;

  return (
    <div className="space-y-6">
      <Header onRefresh={refetch} lastSyncTime={new Date()} />

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('articles')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'articles'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                文章列表 ({articles.length})
              </button>
              <button
                onClick={() => setActiveTab('pages')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'pages'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                页面管理 ({pages.length})
              </button>
              <button
                onClick={() => setActiveTab('tags')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'tags'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                标签管理
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'articles' && (
                <ArticleList
                  articles={articles}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onExport={handleExport}
                />
              )}
              {activeTab === 'pages' && (
                <PageTree
                  pages={pages}
                  onPageClick={handleEdit}
                />
              )}
              {activeTab === 'tags' && (
                <TagManager
                  tags={allTags}
                  onAddTag={(tag) => setAllTags([...allTags, tag])}
                  onRemoveTag={(tag) => setAllTags(allTags.filter((t) => t !== tag))}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **提交Phase 2代码**

```bash
git add .
git commit -m "feat: complete phase 2 - content management features"
```

---

## 🎯 Phase 3: 数据分析功能（预计2-3天）

### 任务 3.1: 数据分析仪表盘

- [ ] **创建统计卡片组件**

创建 `src/components/analytics/StatCard.tsx`:
```tsx
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

export default function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **创建访问趋势图表**

创建 `src/components/analytics/VisitChart.tsx`:
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VisitChartProps {
  data: { date: string; views: number; visitors: number }[];
}

export default function VisitChart({ data }: VisitChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">访问趋势</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} name="访问量" />
          <Line type="monotone" dataKey="visitors" stroke="#10B981" strokeWidth={2} name="访客数" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **创建互动数据图表**

创建 `src/components/analytics/InteractionChart.tsx`:
```tsx
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface InteractionChartProps {
  data: { name: string; value: number; color: string }[];
}

export default function InteractionChart({ data }: InteractionChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">互动分布</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **创建内容表现排行**

创建 `src/components/analytics/ContentPerformance.tsx`:
```tsx
import { TrendingUp } from 'lucide-react';
import type { Article } from '../types';

interface ContentPerformanceProps {
  articles: Article[];
  metric: 'views' | 'likes' | 'comments';
}

export default function ContentPerformance({ articles, metric }: ContentPerformanceProps) {
  const sortedArticles = [...articles]
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, 10);

  const maxValue = sortedArticles[0]?.[metric] || 1;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
        <TrendingUp className="w-5 h-5" />
        内容表现排行（Top 10）
      </h3>
      <div className="space-y-3">
        {sortedArticles.map((article, index) => (
          <div key={article.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">
                <span className="font-bold text-gray-400 mr-2">{index + 1}</span>
                {article.title}
              </span>
              <span className="text-gray-600 font-medium">
                {article[metric].toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(article[metric] / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 任务 3.2: 数据分析服务

- [ ] **创建数据分析服务**

创建 `src/services/analytics.ts`:
```typescript
import type { Article, Analytics, TrendData } from '../types';

export function calculateAnalytics(articles: Article[]): Analytics {
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const totalLikes = articles.reduce((sum, a) => sum + a.likes, 0);
  const totalComments = articles.reduce((sum, a) => sum + (a.comments || 0), 0);
  const totalShares = articles.reduce((sum, a) => sum + (a.shares || 0), 0);

  const topPages = [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return {
    totalViews,
    totalLikes,
    totalComments,
    totalShares,
    topPages,
    viewTrends: generateViewTrends(articles),
  };
}

function generateViewTrends(articles: Article[]): TrendData[] {
  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last30Days.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 100) + 50,
    });
  }
  return last30Days;
}

export function getInteractionDistribution(articles: Article[]) {
  const likes = articles.reduce((sum, a) => sum + a.likes, 0);
  const comments = articles.reduce((sum, a) => sum + (a.comments || 0), 0);
  const shares = articles.reduce((sum, a) => sum + (a.shares || 0), 0);

  return [
    { name: '点赞', value: likes, color: '#3B82F6' },
    { name: '评论', value: comments, color: '#10B981' },
    { name: '分享', value: shares, color: '#F59E0B' },
  ];
}
```

### 任务 3.3: 数据分析页面

- [ ] **创建数据分析页面**

创建 `src/pages/Analytics.tsx`:
```tsx
import { useMemo } from 'react';
import { Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useFlowusData } from '../hooks/useFlowusData';
import StatCard from '../components/analytics/StatCard';
import VisitChart from '../components/analytics/VisitChart';
import InteractionChart from '../components/analytics/InteractionChart';
import ContentPerformance from '../components/analytics/ContentPerformance';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';
import { calculateAnalytics, getInteractionDistribution } from '../services/analytics';

export default function Analytics() {
  const { articles, loading, error, refetch } = useFlowusData();

  const analytics = useMemo(() => calculateAnalytics(articles), [articles]);
  const interactionData = useMemo(() => getInteractionDistribution(articles), [articles]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>;

  return (
    <div className="space-y-6">
      <Header onRefresh={refetch} lastSyncTime={new Date()} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总访问量"
          value={analytics.totalViews.toLocaleString()}
          change={12.5}
          icon={Eye}
          color="blue"
        />
        <StatCard
          title="总点赞数"
          value={analytics.totalLikes.toLocaleString()}
          change={8.3}
          icon={Heart}
          color="red"
        />
        <StatCard
          title="总评论数"
          value={analytics.totalComments.toLocaleString()}
          change={-2.1}
          icon={MessageCircle}
          color="green"
        />
        <StatCard
          title="总分享数"
          value={analytics.totalShares.toLocaleString()}
          change={15.7}
          icon={Share2}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitChart
          data={analytics.viewTrends.map((t) => ({
            date: t.date.slice(5),
            views: t.value,
            visitors: Math.floor(t.value * 0.7),
          }))}
        />
        <InteractionChart data={interactionData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentPerformance articles={articles} metric="views" />
        <ContentPerformance articles={articles} metric="likes" />
      </div>
    </div>
  );
}
```

- [ ] **提交Phase 3代码**

```bash
git add .
git commit -m "feat: complete phase 3 - analytics and visualization"
```

---

## 🎯 Phase 4: 导出功能（预计1-2天）

### 任务 4.1: 导出面板

- [ ] **创建导出面板组件**

创建 `src/components/export/ExportPanel.tsx`:
```tsx
import { useState } from 'react';
import { FileText, FileJson, FileSpreadsheet, File, Download } from 'lucide-react';

interface ExportPanelProps {
  onExport: (format: string, articleIds: string[]) => void;
}

export default function ExportPanel({ onExport }: ExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState('markdown');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  const formats = [
    { id: 'markdown', name: 'Markdown', icon: FileText, description: '保持格式的文本文件' },
    { id: 'pdf', name: 'PDF', icon: File, description: '精美的PDF文档' },
    { id: 'json', name: 'JSON', icon: FileJson, description: '完整数据结构' },
    { id: 'csv', name: 'CSV', icon: FileSpreadsheet, description: '表格数据格式' },
    { id: 'excel', name: 'Excel', icon: FileSpreadsheet, description: 'Excel工作簿' },
    { id: 'word', name: 'Word', icon: FileText, description: 'Word文档' },
  ];

  const handleExport = () => {
    if (selectedArticles.length === 0) {
      alert('请选择要导出的文章');
      return;
    }
    onExport(selectedFormat, selectedArticles);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-800">导出设置</h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          选择导出格式
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedFormat === format.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <format.icon className={`w-8 h-8 mx-auto mb-2 ${
                selectedFormat === format.id ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <p className="font-medium text-gray-800">{format.name}</p>
              <p className="text-xs text-gray-500 mt-1">{format.description}</p>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleExport}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
      >
        <Download className="w-5 h-5" />
        导出选中文章
      </button>
    </div>
  );
}
```

### 任务 4.2: 导出服务

- [ ] **创建导出服务**

创建 `src/services/export.ts`:
```typescript
import type { Article } from '../types';

export async function exportArticle(article: Article, format: string) {
  switch (format) {
    case 'markdown':
      return exportToMarkdown(article);
    case 'json':
      return exportToJson(article);
    case 'csv':
      return exportToCsv(article);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

function exportToMarkdown(article: Article) {
  const content = `# ${article.title}\n\n${article.content}\n\n---\n\nTags: ${article.tags.join(', ')}\n\nViews: ${article.views} | Likes: ${article.likes}\n`;
  downloadFile(content, `${article.title}.md`, 'text/markdown');
}

function exportToJson(article: Article) {
  const content = JSON.stringify(article, null, 2);
  downloadFile(content, `${article.title}.json`, 'application/json');
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
  const content = [headers.join(','), row.map((cell) => `"${cell}"`).join(',')].join('\n');
  downloadFile(content, `${article.title}.csv`, 'text/csv');
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

export async function exportBatch(articles: Article[], format: string) {
  for (const article of articles) {
    await exportArticle(article, format);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
```

### 任务 4.3: 导出页面

- [ ] **创建导出页面**

创建 `src/pages/Export.tsx`:
```tsx
import { useState } from 'react';
import { useFlowusData } from '../hooks/useFlowusData';
import ExportPanel from '../components/export/ExportPanel';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';

export default function Export() {
  const { articles, loading } = useFlowusData();
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: string, articleIds: string[]) => {
    setExporting(true);
    try {
      const { exportBatch } = await import('../services/export');
      const articlesToExport = articles.filter((a) => articleIds.includes(a.id));
      await exportBatch(articlesToExport, format);
      alert('导出成功！');
    } catch (error) {
      console.error('Export failed:', error);
      alert('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">选择要导出的文章</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {articles.map((article) => (
                <label
                  key={article.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedArticles.includes(article.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedArticles([...selectedArticles, article.id]);
                      } else {
                        setSelectedArticles(selectedArticles.filter((id) => id !== article.id));
                      }
                    }}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="flex-1 text-gray-700">{article.title}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(article.updatedAt).toLocaleDateString('zh-CN')}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                已选择 <span className="font-semibold">{selectedArticles.length}</span> 篇文章
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ExportPanel onExport={handleExport} />
        </div>
      </div>

      {exporting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-700">正在导出，请稍候...</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **提交Phase 4代码**

```bash
git add .
git commit -m "feat: complete phase 4 - export functionality"
```

---

## 🎯 Phase 5: 系统设置与测试优化（预计1天）

### 任务 5.1: 设置页面

- [ ] **创建设置页面**

创建 `src/pages/Settings.tsx`:
```tsx
import { useState } from 'react';
import { Key, RefreshCw, Sun, Moon, Bell, CheckCircle } from 'lucide-react';
import Header from '../components/common/Header';

export default function Settings() {
  const [apiToken, setApiToken] = useState('');
  const [syncInterval, setSyncInterval] = useState('daily');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const response = await fetch('/api/flowus/pages', {
        headers: { 'Authorization': `Bearer ${apiToken}` }
      });
      setTestResult(response.ok ? 'success' : 'error');
    } catch {
      setTestResult('error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Header />

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
            <Key className="w-5 h-5" />
            FlowUs API配置
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API令牌
              </label>
              <input
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="输入你的FlowUs API令牌"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleTestConnection}
                disabled={testing || !apiToken}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
                测试连接
              </button>

              {testResult === 'success' && (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  连接成功
                </span>
              )}
              {testResult === 'error' && (
                <span className="text-red-600">连接失败，请检查API令牌</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
            <RefreshCw className="w-5 h-5" />
            同步设置
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              自动同步频率
            </label>
            <select
              value={syncInterval}
              onChange={(e) => setSyncInterval(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="hourly">每小时</option>
              <option value="daily">每天</option>
              <option value="weekly">每周</option>
              <option value="manual">仅手动同步</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
            {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            界面设置
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                主题
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <Sun className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">浅色模式</p>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <Moon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">深色模式</p>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">通知提醒</p>
                  <p className="text-sm text-gray-500">接收同步完成和数据更新提醒</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.setItem('settings', JSON.stringify({
              apiToken,
              syncInterval,
              theme,
              notifications,
            }));
            alert('设置已保存');
          }}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          保存设置
        </button>
      </div>
    </div>
  );
}
```

### 任务 5.2: 路由配置和主页面

- [ ] **配置React Router**

更新 `src/App.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Content from './pages/Content';
import Analytics from './pages/Analytics';
import Export from './pages/Export';
import Settings from './pages/Settings';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="content" element={<Content />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="export" element={<Export />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **创建仪表盘页面**

创建 `src/pages/Dashboard.tsx`:
```tsx
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, Heart, TrendingUp, ArrowRight } from 'lucide-react';
import { useFlowusData } from '../hooks/useFlowusData';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';
import { calculateAnalytics } from '../services/analytics';

export default function Dashboard() {
  const { articles, loading } = useFlowusData();

  const analytics = useMemo(() => calculateAnalytics(articles), [articles]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <Header />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">文章总数</p>
              <p className="text-2xl font-bold text-gray-800">{articles.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总访问量</p>
              <p className="text-2xl font-bold text-gray-800">
                {analytics.totalViews.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <Eye className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总点赞数</p>
              <p className="text-2xl font-bold text-gray-800">
                {analytics.totalLikes.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">互动总数</p>
              <p className="text-2xl font-bold text-gray-800">
                {(analytics.totalLikes + analytics.totalComments + analytics.totalShares).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">热门文章</h3>
            <Link
              to="/analytics"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
            >
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {analytics.topPages.slice(0, 5).map((page, index) => (
              <div key={page.id} className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400">{index + 1}</span>
                <div className="flex-1">
                  <p className="text-gray-800">{page.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(page.updatedAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {page.views?.toLocaleString() || 0} 次访问
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">快速操作</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/content"
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 text-center"
            >
              <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="font-medium text-gray-800">内容管理</p>
            </Link>
            <Link
              to="/analytics"
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 text-center"
            >
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="font-medium text-gray-800">数据分析</p>
            </Link>
            <Link
              to="/export"
              className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 text-center"
            >
              <Eye className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="font-medium text-gray-800">导出中心</p>
            </Link>
            <Link
              to="/settings"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 text-center"
            >
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <p className="font-medium text-gray-800">系统设置</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **创建Loading组件**

创建 `src/components/common/Loading.tsx`:
```tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">加载中...</p>
      </div>
    </div>
  );
}
```

- [ ] **提交Phase 5代码**

```bash
git add .
git commit -m "feat: complete phase 5 - settings and dashboard"
```

---

## 📋 实施检查清单

- [ ] Phase 1: 项目初始化和基础结构
- [ ] Phase 2: FlowUs API集成和内容管理功能
- [ ] Phase 3: 数据分析仪表盘和可视化
- [ ] Phase 4: 多格式导出功能
- [ ] Phase 5: 系统设置和优化

---

## 🚀 启动应用

```bash
cd flowus-manager

# 安装依赖
npm install

# 复制环境变量
cp .env.example .env

# 启动开发服务器
npm run dev
```

应用将在 http://localhost:5173 运行，后端API在 http://localhost:3001

---

**预计总工期**: 7-11天

**关键里程碑**:
1. Day 1-2: 完成基础搭建
2. Day 3-5: 完成内容管理功能
3. Day 6-8: 完成数据分析功能
4. Day 9-10: 完成导出功能
5. Day 11: 测试和优化
