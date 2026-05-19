import { useState, useEffect } from 'react';
import { Key, RefreshCw, Sun, Moon, Bell, CheckCircle, Save, AlertCircle } from 'lucide-react';
import Header from '../components/common/Header';

interface SettingsType {
  apiToken: string;
  syncInterval: string;
  theme: 'light' | 'dark';
  notifications: boolean;
  autoSync: boolean;
  syncOnStart: boolean;
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType>({
    apiToken: '',
    syncInterval: 'daily',
    theme: 'light',
    notifications: true,
    autoSync: false,
    syncOnStart: true,
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem('flowusSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }

    const savedLastSync = localStorage.getItem('flowusLastSync');
    if (savedLastSync) {
      setLastSync(new Date(savedLastSync));
    }
  }, []);

  const handleTestConnection = async () => {
    if (!settings.apiToken) {
      setTestResult('error');
      setTestMessage('请输入 API 令牌');
      return;
    }

    setTesting(true);
    setTestResult(null);
    setTestMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/flowus/test', {
        method: 'GET',
        headers: {
          'token': settings.apiToken,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setTestResult('success');
        setTestMessage('成功连接到 FlowUs API');
      } else {
        const error = await response.json();
        setTestResult('error');
        setTestMessage(error.error || '连接失败，请检查 API 令牌');
      }
    } catch (error) {
      setTestResult('error');
      setTestMessage('无法连接到服务器，请确保后端服务正在运行');
    } finally {
      setTesting(false);
    }
  };

  const handleManualSync = async () => {
    if (!settings.apiToken) {
      alert('请先配置 API 令牌');
      return;
    }

    setSyncing(true);
    try {
      const response = await fetch('http://localhost:3001/api/flowus/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: settings.apiToken })
      });

      if (response.ok) {
        const now = new Date();
        setLastSync(now);
        localStorage.setItem('flowusLastSync', now.toISOString());
        alert('数据同步成功！');
      } else {
        alert('同步失败，请检查 API 令牌');
      }
    } catch (error) {
      alert('同步失败，请检查网络连接');
    } finally {
      setSyncing(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem('flowusSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (key: keyof SettingsType, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Header 
        onRefresh={handleManualSync}
        lastSyncTime={lastSync || undefined}
      />

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
            <Key className="w-5 h-5" />
            FlowUs API 配置
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API 令牌
              </label>
              <input
                type="password"
                value={settings.apiToken}
                onChange={(e) => handleChange('apiToken', e.target.value)}
                placeholder="输入你的 FlowUs API 令牌"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-2 text-sm text-gray-500">
                在 FlowUs 设置中获取你的 API 令牌，用于连接你的个人主页数据
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
                测试连接
              </button>

              <button
                onClick={handleManualSync}
                disabled={syncing || !settings.apiToken}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                立即同步
              </button>

              {testResult === 'success' && (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  {testMessage}
                </span>
              )}
              {testResult === 'error' && (
                <span className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  {testMessage}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
            <RefreshCw className="w-5 h-5" />
            同步设置
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-800">自动同步</p>
                <p className="text-sm text-gray-500">自动从 FlowUs 获取最新数据</p>
              </div>
              <button
                onClick={() => handleChange('autoSync', !settings.autoSync)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.autoSync ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.autoSync ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                自动同步频率
              </label>
              <select
                value={settings.syncInterval}
                onChange={(e) => handleChange('syncInterval', e.target.value)}
                disabled={!settings.autoSync}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="hourly">每小时</option>
                <option value="daily">每天</option>
                <option value="weekly">每周</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-800">启动时同步</p>
                <p className="text-sm text-gray-500">打开应用时自动同步数据</p>
              </div>
              <button
                onClick={() => handleChange('syncOnStart', !settings.syncOnStart)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.syncOnStart ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.syncOnStart ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {lastSync && (
              <div className="text-sm text-gray-500 pt-3 border-t">
                最后同步时间: {lastSync.toLocaleString('zh-CN')}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
            {settings.theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            界面设置
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                主题
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => handleChange('theme', 'light')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    settings.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Sun className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                  <p className="text-sm font-medium text-gray-800">浅色模式</p>
                </button>
                <button
                  onClick={() => handleChange('theme', 'dark')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    settings.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Moon className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                  <p className="text-sm font-medium text-gray-800">深色模式</p>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-t">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">通知提醒</p>
                  <p className="text-sm text-gray-500">接收同步完成和数据更新提醒</p>
                </div>
              </div>
              <button
                onClick={() => handleChange('notifications', !settings.notifications)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.notifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.notifications ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">💡 使用提示</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 配置 API 令牌后，可以测试连接确保令牌有效</li>
            <li>• 开启自动同步后，系统会按照设定频率自动更新数据</li>
            <li>• 随时可以点击"立即同步"手动获取最新数据</li>
            <li>• 所有设置都会保存在本地浏览器中</li>
          </ul>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 transition-colors shadow-lg"
        >
          <Save className="w-5 h-5" />
          {saved ? '✓ 已保存！' : '保存设置'}
        </button>
      </div>
    </div>
  );
}
