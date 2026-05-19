import { useState, useMemo } from 'react';
import { useFlowusData } from '../hooks/useFlowusData';
import ArticleList from '../components/content/ArticleList';
import PageTree from '../components/content/PageTree';
import TagManager from '../components/content/TagManager';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';

export default function Content() {
  const { articles, pages, loading, error, refetch } = useFlowusData();
  const [activeTab, setActiveTab] = useState<'articles' | 'pages' | 'tags'>('articles');
  
  // Get all unique tags from articles
  const allTags = useMemo(() => {
    return Array.from(new Set(articles.flatMap(article => article.tags)));
  }, [articles]);
  
  const [userTags, setUserTags] = useState<string[]>([]);

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
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'articles'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                文章列表 ({articles.length})
              </button>
              <button
                onClick={() => setActiveTab('pages')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'pages'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                页面管理
              </button>
              <button
                onClick={() => setActiveTab('tags')}
                className={`px-6 py-3 font-medium transition-colors ${
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
                  tags={[...allTags, ...userTags]}
                  onAddTag={(tag) => setUserTags([...userTags, tag])}
                  onRemoveTag={(tag) => {
                    setUserTags(userTags.filter(t => t !== tag));
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
