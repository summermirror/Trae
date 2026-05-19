import { useState } from 'react';
import { FileText, FileJson, FileSpreadsheet, File } from 'lucide-react';

export default function ExportPanel() {
  const [selectedFormat, setSelectedFormat] = useState('markdown');

  const formats = [
    { id: 'markdown', name: 'Markdown', icon: FileText, description: '保持格式的文本文件' },
    { id: 'pdf', name: 'PDF', icon: File, description: '精美的PDF文档' },
    { id: 'json', name: 'JSON', icon: FileJson, description: '完整数据结构' },
    { id: 'csv', name: 'CSV', icon: FileSpreadsheet, description: '表格数据格式' },
    { id: 'excel', name: 'Excel', icon: FileSpreadsheet, description: 'Excel工作簿' },
    { id: 'word', name: 'Word', icon: FileText, description: 'Word文档' },
  ];

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
    </div>
  );
}
