import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, Heart, TrendingUp, ArrowRight, MessageCircle, Share2 } from 'lucide-react';
import { useFlowusData } from '../hooks/useFlowusData';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';
import { calculateAnalytics } from '../services/analytics';
import StatCard from '../components/analytics/StatCard';

export default function Dashboard() {
  const { articles, loading, refetch } = useFlowusData();

  const analytics = useMemo(() => calculateAnalytics(articles), [articles]);

  const recentArticles = useMemo(() => {
    return [...articles]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [articles]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <Header onRefresh={refetch} lastSyncTime={new Date()} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="文章总数"
          value={articles.length}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="总访问量"
          value={analytics.totalViews.toLocaleString()}
          icon={Eye}
          color="green"
        />
        <StatCard
          title="总点赞数"
          value={analytics.totalLikes.toLocaleString()}
          icon={Heart}
          color="red"
        />
        <StatCard
          title="总互动数"
          value={(analytics.totalLikes + analytics.totalComments + analytics.totalShares).toLocaleString()}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">最新文章</h3>
            <Link
              to="/content"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">{article.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    更新于 {new Date(article.updatedAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {article.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {article.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">快捷操作</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/content"
              className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="font-medium text-gray-800">内容管理</span>
            </Link>
            <Link
              to="/analytics"
              className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="font-medium text-gray-800">数据分析</span>
            </Link>
            <Link
              to="/export"
              className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <div className="p-3 bg-purple-100 rounded-lg">
                <Share2 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="font-medium text-gray-800">数据导出</span>
            </Link>
            <Link
              to="/settings"
              className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <div className="p-3 bg-orange-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
              <span className="font-medium text-gray-800">系统设置</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">内容表现排行</h3>
          <Link
            to="/analytics"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            查看详情
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...articles]
            .sort((a, b) => b.views - a.views)
            .slice(0, 3)
            .map((article, index) => (
              <div key={article.id} className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <h4 className="font-medium text-gray-800 truncate">{article.title}</h4>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    <Eye className="w-4 h-4 inline mr-1" />
                    {article.views.toLocaleString()}
                  </span>
                  <span className="text-gray-500">
                    <Heart className="w-4 h-4 inline mr-1" />
                    {article.likes}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
