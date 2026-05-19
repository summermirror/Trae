import { useState } from 'react';
import ArticleCard from './ArticleCard';
import { Search, Filter, SortAsc } from 'lucide-react';
import type { Article } from '../../types';

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

  // Get all unique tags
  const allTags = Array.from(new Set(articles.flatMap(article => article.tags)));

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
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="搜索文章..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">所有标签</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <SortAsc className="w-5 h-5 text-gray-500" />
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onEdit={onEdit}
            onDelete={onDelete}
            onExport={onExport}
          />
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          没有找到匹配的文章
        </div>
      )}
    </div>
  );
}
