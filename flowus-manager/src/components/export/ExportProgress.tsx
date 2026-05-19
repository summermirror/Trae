import { Loader2, CheckCircle, XCircle, FileText } from 'lucide-react';

interface ExportProgressProps {
  isExporting: boolean;
  progress: number;
  currentFile?: string;
  error?: string;
  onCancel?: () => void;
}

export default function ExportProgress({ 
  isExporting, 
  progress, 
  currentFile, 
  error, 
  onCancel 
}: ExportProgressProps) {
  if (!isExporting && !error && progress === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        {error ? (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">导出失败</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              关闭
            </button>
          </div>
        ) : progress === 100 ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">导出成功</h3>
            <p className="text-gray-600 mb-4">所有文件已成功导出</p>
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              完成
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                <h3 className="text-lg font-semibold text-gray-800">正在导出</h3>
              </div>
              <span className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {currentFile && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span className="truncate">{currentFile}</span>
              </div>
            )}

            {onCancel && (
              <button
                onClick={onCancel}
                className="mt-6 w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                取消
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
