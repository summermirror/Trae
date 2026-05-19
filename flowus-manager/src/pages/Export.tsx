import { useState, useCallback } from 'react';
import { Download, CheckSquare, Square } from 'lucide-react';
import { useFlowusData } from '../hooks/useFlowusData';
import { useExport } from '../hooks/useExport';
import ExportProgress from '../components/export/ExportProgress';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';

export default function Export() {
  const { articles, loading, error, refetch } = useFlowusData();
  const { isExporting, exportProgress, currentFile, exportError, startExport, resetExport } = useExport();
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState('markdown');

  const toggleArticle = useCallback((id: string) => {
    setSelectedArticles(prev => 
      prev.includes(id) 
        ? prev.filter(articleId => articleId !== id) 
        : [...prev, id]
    );
  }, []);

  const toggleAllArticles = useCallback(() => {
    if (selectedArticles.length === articles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(articles.map(a => a.id));
    }
  }, [articles, selectedArticles.length]);

  const handleExport = useCallback(() => {
    const articlesToExport = articles.filter(a => selectedArticles.includes(a.id));
    startExport(articlesToExport, selectedFormat);
  }, [articles, selectedArticles, selectedFormat, startExport]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>;

  return (
    <div className="space-y-6">
      <Header onRefresh={refetch} lastSyncTime={new Date()} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">选择要导出的文章</h3>
              <button
                onClick={toggleAllArticles}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                {selectedArticles.length === articles.length ? '取消全选' : '全选'}
              </button>
            </div>
            
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {articles.map((article) => (
                <label
                  key={article.id}
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleArticle(article.id);
                    }}
                    className="text-blue-600"
                  >
                    {selectedArticles.includes(article.id) ? (
                      <CheckSquare className="w-6 h-6" />
                    ) : (
                      <Square className="w-6 h-6" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{article.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(article.updatedAt).toLocaleDateString('zh-CN')} · {article.views} 次浏览
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-gray-600">
                已选择 <span className="font-semibold text-blue-600">{selectedArticles.length}</span> 篇文章
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">导出设置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  选择导出格式
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'markdown', name: 'Markdown', icon: '📝' },
                    { id: 'json', name: 'JSON', icon: '📄' },
                    { id: 'csv', name: 'CSV', icon: '📊' },
                  ].map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        selectedFormat === format.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">{format.icon}</div>
                      <p className="text-sm font-medium">{format.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={selectedArticles.length === 0 || isExporting}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            导出选中文章
          </button>
        </div>
      </div>

      <ExportProgress
        isExporting={isExporting}
        progress={exportProgress}
        currentFile={currentFile}
        error={exportError}
        onCancel={resetExport}
      />
    </div>
  );
}
