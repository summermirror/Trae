import { useState, useEffect } from 'react';
import { Key, RefreshCw, Sun, Moon, Bell, CheckCircle, Save } from 'lucide-react';
import Header from '../components/common/Header';

interface SettingsType {
  apiToken: string;
  syncInterval: string;
  theme: 'light' | 'dark';
  notifications: boolean;
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType>({
    apiToken: '',
    syncInterval: 'daily',
    theme: 'light',
    notifications: true,
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('flowusSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTestResult('success');
    } catch {
      setTestResult('error');
    } finally {
      setTesting(false);
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
      <Header />

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
                提示：目前使用模拟数据进行演示，无需真实的 API 令牌
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleTestConnection}
                disabled={testing || !settings.apiToken}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
                测试连接
              </button>

              {testResult === 'success' && (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  连接成功
                </span>
              )}
              {testResult === 'error' && (
                <span className="text-red-600">连接失败，请检查 API 令牌</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
            <RefreshCw className="w-5 h-5" />
            同步设置
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              自动同步频率
            </label>
            <select
              value={settings.syncInterval}
              onChange={(e) => handleChange('syncInterval', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="hourly">每小时</option>
              <option value="daily">每天</option>
              <option value="weekly">每周</option>
              <option value="manual">仅手动同步</option>
            </select>
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

            <div className="flex items-center justify-between py-2">
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

        <button
          onClick={handleSave}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saved ? '已保存！' : '保存设置'}
        </button>
      </div>
    </div>
  );
}
