import { useState } from 'react';
import { usePapers } from '../hooks/usePapers';
import { Upload, Download, Plus, Trash2, Search, FileText, Edit, ExternalLink, RefreshCw } from 'lucide-react';
import type { Paper } from '../types/paper';
import { paperStorage } from '../services/paperManager';

export default function Papers() {
  const {
    papers,
    loading,
    addPaper,
    updatePaper,
    deletePaper,
    importFromJSON,
    importFromCSV,
    importFromBibTeX,
    importFromText,
    exportToJSON,
    exportToCSV,
    exportToBibTeX,
    exportToRIS,
    exportToMarkdown,
    exportToWord,
  } = usePapers();

  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [importSource, setImportSource] = useState('');
  const [syncing, setSyncing] = useState(false);

  const filteredPapers = papers.filter(paper =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
    paper.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleImport = (format: string, content: string) => {
    try {
      let count = 0;
      switch (format) {
        case 'json':
          count = importFromJSON(content);
          break;
        case 'csv':
          count = importFromCSV(content);
          break;
        case 'bibtex':
          count = importFromBibTeX(content);
          break;
        case 'text':
          count = importFromText(content, importSource);
          break;
      }
      alert(`成功导入 ${count} 篇论文`);
      setShowImportModal(false);
    } catch (error) {
      alert('导入失败，请检查文件格式');
    }
  };

  const handleExport = (format: string) => {
    switch (format) {
      case 'json':
        exportToJSON();
        break;
      case 'csv':
        exportToCSV();
        break;
      case 'bibtex':
        exportToBibTeX();
        break;
      case 'ris':
        exportToRIS();
        break;
      case 'markdown':
        exportToMarkdown();
        break;
      case 'word':
        exportToWord();
        break;
    }
    setShowExportModal(false);
  };

  const addSampleData = async () => {
    setSyncing(true);
    
    const samplePapers = [
      {
        id: 'sample-1',
        title: 'Attention Is All You Need',
        authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar'],
        journal: 'NeurIPS',
        year: 2017,
        doi: '10.48550/arXiv.1706.03762',
        url: 'https://arxiv.org/abs/1706.03762',
        abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
        keywords: ['transformer', 'attention', 'neural networks', 'NLP'],
        tags: ['classic', 'important'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        importedFrom: 'Sample Data'
      },
      {
        id: 'sample-2',
        title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
        authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova'],
        journal: 'ACL',
        year: 2019,
        doi: '10.18653/v1/N19-1423',
        url: 'https://arxiv.org/abs/1810.04805',
        abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations by jointly conditioning on both left and right context in all layers.',
        keywords: ['BERT', 'transformer', 'pre-training', 'language model'],
        tags: ['important', 'classic'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        importedFrom: 'Sample Data'
      },
      {
        id: 'sample-3',
        title: 'GPT-3: Language Models are Few-Shot Learners',
        authors: ['Tom Brown', 'Benjamin Mann', 'Nick Ryder', 'Melanie Subbiah'],
        journal: 'NeurIPS',
        year: 2020,
        doi: '10.48550/arXiv.2005.14165',
        url: 'https://arxiv.org/abs/2005.14165',
        abstract: 'Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets of thousands or tens of thousands of examples.',
        keywords: ['GPT-3', 'few-shot learning', 'language models', 'large models'],
        tags: ['important'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        importedFrom: 'Sample Data'
      }
    ];
    
    try {
      const existingPapers = paperStorage.loadPapers();
      const paperIds = new Set(existingPapers.map(p => p.id));
      let added = 0;
      
      for (const paper of samplePapers) {
        if (!paperIds.has(paper.id)) {
          paperStorage.addPaper(paper);
          added++;
        }
      }
      
      if (added > 0) {
        alert(`成功添加 ${added} 篇示例论文！`);
        window.location.reload();
      } else {
        alert('示例论文已经存在了！');
      }
    } catch (error) {
      console.error('Error adding sample data:', error);
      alert('添加示例数据失败');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">论文管理</h2>
            <p className="text-gray-600 mt-1">共 {papers.length} 篇论文</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              添加论文
            </button>
            <button
              onClick={addSampleData}
              disabled={syncing}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors disabled:bg-gray-300"
            >
              <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? '添加中...' : '添加示例论文'}
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2 transition-colors"
            >
              <Upload className="w-5 h-5" />
              导入
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
              disabled={papers.length === 0}
            >
              <Download className="w-5 h-5" />
              导出
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="搜索论文标题、作者或关键词..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {filteredPapers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">
            {searchTerm ? '没有找到匹配的论文' : '还没有添加任何论文'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowImportModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              导入论文
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {paper.title}
                  </h3>

                  {paper.authors.length > 0 && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">作者：</span>
                      {paper.authors.join(', ')}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                    {paper.journal && <span>📖 {paper.journal}</span>}
                    {paper.year && <span>📅 {paper.year}</span>}
                    {paper.doi && <span>🔗 DOI: {paper.doi}</span>}
                  </div>

                  {paper.abstract && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {paper.abstract}
                    </p>
                  )}

                  {paper.keywords && paper.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {paper.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedPaper(paper)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="查看详情"
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                  {paper.url && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="打开链接"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      if (confirm('确定要删除这篇论文吗？')) {
                        deletePaper(paper.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImport}
          sourceUrl={importSource}
          onSourceChange={setImportSource}
        />
      )}

      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          paperCount={papers.length}
        />
      )}

      {showAddModal && (
        <AddPaperModal
          onClose={() => setShowAddModal(false)}
          onAdd={(paper) => {
            addPaper(paper);
            setShowAddModal(false);
          }}
        />
      )}

      {selectedPaper && (
        <PaperDetailModal
          paper={selectedPaper}
          onClose={() => setSelectedPaper(null)}
          onUpdate={(updates) => {
            updatePaper(selectedPaper.id, updates);
            setSelectedPaper({ ...selectedPaper, ...updates });
          }}
        />
      )}
    </div>
  );
}

function ImportModal({
  onClose,
  onImport,
  sourceUrl,
  onSourceChange,
}: {
  onClose: () => void;
  onImport: (format: string, content: string) => void;
  sourceUrl: string;
  onSourceChange: (url: string) => void;
}) {
  const [format, setFormat] = useState('json');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target?.result as string);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleImport = () => {
    if (!content.trim()) {
      alert('请先选择文件或输入内容');
      return;
    }
    onImport(format, content);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">导入论文</h3>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              导入格式
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="bibtex">BibTeX</option>
              <option value="text">纯文本</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              源页面URL（可选）
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => onSourceChange(e.target.value)}
              placeholder="https://flowus.cn/..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              上传文件
            </label>
            <input
              type="file"
              accept={format === 'json' ? '.json' : format === 'csv' ? '.csv' : format === 'bibtex' ? '.bib' : '.txt'}
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {file && <p className="text-sm text-green-600 mt-1">已选择: {file.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              或直接粘贴内容
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="粘贴你的论文数据..."
            />
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleImport}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            导入
          </button>
        </div>
      </div>
    </div>
  );
}

function ExportModal({
  onClose,
  onExport,
  paperCount,
}: {
  onClose: () => void;
  onExport: (format: string) => void;
  paperCount: number;
}) {
  const formats = [
    { id: 'json', name: 'JSON', desc: '完整的JSON数据格式' },
    { id: 'csv', name: 'CSV', desc: 'Excel兼容的表格格式' },
    { id: 'bibtex', name: 'BibTeX', desc: 'LaTeX引用格式' },
    { id: 'ris', name: 'RIS', desc: '学术文献标准格式' },
    { id: 'markdown', name: 'Markdown', desc: 'Markdown文档格式' },
    { id: 'word', name: 'Word/HTML', desc: 'Word文档格式' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">导出论文</h3>
          <p className="text-gray-600 mt-1">共 {paperCount} 篇论文</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => onExport(format.id)}
                className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-all text-left"
              >
                <h4 className="font-semibold text-gray-800 mb-1">{format.name}</h4>
                <p className="text-sm text-gray-600">{format.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t">
          <button
            onClick={onClose}
            className="w-full px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

function AddPaperModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (paper: Paper) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    journal: '',
    year: '',
    doi: '',
    url: '',
    abstract: '',
    keywords: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('请输入论文标题');
      return;
    }

    const paper: Paper = {
      id: crypto.randomUUID(),
      title: formData.title,
      authors: formData.authors.split(',').map(a => a.trim()).filter(Boolean),
      journal: formData.journal || undefined,
      year: formData.year ? parseInt(formData.year) : undefined,
      doi: formData.doi || undefined,
      url: formData.url || undefined,
      abstract: formData.abstract || undefined,
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      importedFrom: 'Manual Entry',
    };

    onAdd(paper);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">添加论文</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              论文标题 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入论文标题"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              作者（多个用逗号分隔）
            </label>
            <input
              type="text"
              value={formData.authors}
              onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="张三, 李四, 王五"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                期刊/会议
              </label>
              <input
                type="text"
                value={formData.journal}
                onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                年份
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1900"
                max="2030"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DOI
              </label>
              <input
                type="text"
                value={formData.doi}
                onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              摘要
            </label>
            <textarea
              value={formData.abstract}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              关键词（多个用逗号分隔）
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="机器学习, 深度学习, 神经网络"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PaperDetailModal({
  paper,
  onClose,
  onUpdate,
}: {
  paper: Paper;
  onClose: () => void;
  onUpdate: (updates: Partial<Paper>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(paper);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">论文详情</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">作者</label>
                <input
                  type="text"
                  value={formData.authors.join(', ')}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value.split(',').map(a => a.trim()) })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
                <textarea
                  value={formData.abstract || ''}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{paper.title}</h2>
                {paper.authors.length > 0 && (
                  <p className="text-gray-600">{paper.authors.join(', ')}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                {paper.journal && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    📖 {paper.journal}
                  </span>
                )}
                {paper.year && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    📅 {paper.year}
                  </span>
                )}
                {paper.doi && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                    🔗 {paper.doi}
                  </span>
                )}
              </div>

              {paper.abstract && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">摘要</h4>
                  <p className="text-gray-600 leading-relaxed">{paper.abstract}</p>
                </div>
              )}

              {paper.keywords && paper.keywords.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">关键词</h4>
                  <div className="flex flex-wrap gap-2">
                    {paper.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-500 pt-4 border-t">
                <p>导入时间: {new Date(paper.createdAt).toLocaleString('zh-CN')}</p>
                <p>更新时间: {new Date(paper.updatedAt).toLocaleString('zh-CN')}</p>
                {paper.importedFrom && <p>来源: {paper.importedFrom}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-between">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-100"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                保存
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Edit className="w-5 h-5" />
                编辑
              </button>
              {paper.url && (
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  打开链接
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
