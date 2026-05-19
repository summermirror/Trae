import { TrendingUp } from 'lucide-react';
import type { Article } from '../../types';

interface ContentPerformanceProps {
  articles: Article[];
  metric: 'views' | 'likes' | 'comments';
}

export default function ContentPerformance({ articles, metric }: ContentPerformanceProps) {
  const sortedArticles = [...articles]
    .sort((a, b) => (b[metric] || 0) - (a[metric] || 0))
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
                {(article[metric] || 0).toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((article[metric] || 0) / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
