import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  onRefresh?: () => void;
  lastSyncTime?: Date;
}

export default function Header({ onRefresh, lastSyncTime }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">FlowUs 个人主页管理</h2>
        <div className="flex items-center gap-4">
          {lastSyncTime && (
            <span className="text-sm text-gray-500">
              上次同步: {lastSyncTime.toLocaleString('zh-CN')}
            </span>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              刷新数据
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
