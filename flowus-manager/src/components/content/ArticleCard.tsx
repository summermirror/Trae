import { Edit, Trash2, Download, Eye, Heart } from 'lucide-react';
import type { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
}

export default function ArticleCard({ article, onEdit, onDelete, onExport }: ArticleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 flex-1 mr-4">
          {article.title}
        </h3>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(article.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="编辑"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(article.id)}
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
          {article.views.toLocaleString()}
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
          onClick={() => onExport(article.id)}
          className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded"
        >
          <Download className="w-4 h-4" />
          导出
        </button>
      </div>
    </div>
  );
}
