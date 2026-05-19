import { useState } from 'react';
import { Download, CheckSquare, Square, RefreshCw, BookOpen } from 'lucide-react';
import { useFlowusData } from '../hooks/useFlowusData';
import { useExport } from '../hooks/useExport';
import { usePapers } from '../hooks/usePapers';
import ExportProgress from '../components/export/ExportProgress';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';

export default function Export() {
  const { articles, loading, error, refetch } = useFlowusData();
  const { isExporting, exportProgress, currentFile, exportError, startExport, resetExport } = useExport();
  const { papers, importFromText } = usePapers();
  const [activeTab, setActiveTab] = useState<'articles' | 'papers'>('articles');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState('markdown');
  const [syncingPapers, setSyncingPapers] = useState(false);

  const toggleArticle = (id: string) => {
    setSelectedArticles(prev => 
      prev.includes(id) 
        ? prev.filter(articleId => articleId !== id) 
        : [...prev, id]
    );
  };

  const togglePaper = (id: string) => {
    setSelectedPapers(prev => 
      prev.includes(id) 
        ? prev.filter(paperId => paperId !== id) 
        : [...prev, id]
    );
  };

  const toggleAllArticles = () => {
    if (activeTab === 'articles') {
      if (selectedArticles.length === articles.length) {
        setSelectedArticles([]);
      } else {
        setSelectedArticles(articles.map(a => a.id));
      }
    } else {
      if (selectedPapers.length === papers.length) {
        setSelectedPapers([]);
      } else {
        setSelectedPapers(papers.map(p => p.id));
      }
    }
  };

  const handleExportArticles = () => {
    const articlesToExport = articles.filter(a => selectedArticles.includes(a.id));
    startExport(articlesToExport, selectedFormat);
  };

  const handleExportPapers = () => {
    const papersToExport = papers.filter(p => selectedPapers.includes(p.id));
    const papersData = JSON.stringify(papersToExport, null, 2);
    
    let filename = `papers_${Date.now()}`;
    let mimeType = 'application/json';
    
    switch (selectedFormat) {
      case 'json':
        filename += '.json';
        break;
      case 'csv':
        filename += '.csv';
        mimeType = 'text/csv';
        break;
      case 'markdown':
        filename += '.md';
        mimeType = 'text/markdown';
        break;
      default:
        filename += '.json';
    }

    const blob = new Blob([papersData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSyncPapers = async () => {
    setSyncingPapers(true);
    try {
      const response = await fetch('http://localhost:3001/api/flowus/pages', {
        method: 'GET',
        headers: {
          'token': localStorage.getItem('flowusSettings') ? 
            JSON.parse(localStorage.getItem('flowusSettings') || '{}').apiToken : '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('FlowUs data:', data);
        
        const papersText = JSON.stringify(data, null, 2);
        const count = importFromText(papersText, 'https://flowus.cn/durability/share/9162bbd1-8518-4365-8cdd-ffd8a60a905c');
        alert(`成功同步 ${count} 条数据到论文管理`);
      } else {
        alert('同步失败，请检查API配置');
      }
    } catch (err) {
      console.error('Sync error:', err);
      alert('同步失败，请重试');
    } finally {
      setSyncingPapers(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>;

  const currentList = activeTab === 'articles' ? articles : papers;
  const currentSelected = activeTab === 'articles' ? selectedArticles : selectedPapers;

  return (
    <div className="space-y-6">
      <Header onRefresh={refetch} lastSyncTime={new Date()} />

      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'articles'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            文章导出 ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('papers')}
            className={`px-6 py-3 font-medium flex items-center gap-2 ${
              activeTab === 'papers'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            论文管理 ({papers.length})
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {activeTab === 'articles' ? '选择要导出的文章' : '选择要导出的论文'}
                </h3>
                <div className="flex gap-2">
                  {activeTab === 'papers' && (
                    <button
                      onClick={handleSyncPapers}
                      disabled={syncingPapers}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 flex items-center gap-2 text-sm"
                    >
                      <RefreshCw className={`w-4 h-4 ${syncingPapers ? 'animate-spin' : ''}`} />
                      同步FlowUs论文
                    </button>
                  )}
                  <button
                    onClick={toggleAllArticles}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {currentSelected.length === currentList.length ? '取消全选' : '全选'}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {currentList.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p>{activeTab === 'articles' ? '暂无文章' : '暂无论文'}</p>
                    {activeTab === 'papers' && (
                      <button
                        onClick={handleSyncPapers}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        同步FlowUs论文
                      </button>
                    )}
                  </div>
                ) : (
                  currentList.map((item: any) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeTab === 'articles') {
                            toggleArticle(item.id);
                          } else {
                            togglePaper(item.id);
                          }
                        }}
                        className="text-blue-600"
                      >
                        {currentSelected.includes(item.id) ? (
                          <CheckSquare className="w-6 h-6" />
                        ) : (
                          <Square className="w-6 h-6" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {activeTab === 'articles' 
                            ? `${new Date(item.updatedAt).toLocaleDateString('zh-CN')} · ${item.views} 次浏览`
                            : item.authors?.join(', ') || '未知作者'
                          }
                        </p>
                      </div>
                    </label>
                  ))
                )}
              </div>

              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  已选择 <span className="font-semibold text-blue-600">{currentSelected.length}</span> 
                  {activeTab === 'articles' ? ' 篇文章' : ' 篇论文'}
                </p>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">导出设置</h3>
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
                onClick={activeTab === 'articles' ? handleExportArticles : handleExportPapers}
                disabled={currentSelected.length === 0 || isExporting}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
              >
                <Download className="w-5 h-5" />
                {isExporting ? '导出中...' : '导出选中项'}
              </button>
            </div>
          </div>
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
