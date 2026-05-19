import { useState, useEffect, useRef } from 'react';

interface SyncSettings {
  autoSync: boolean;
  syncInterval: string;
  syncOnStart: boolean;
  apiToken: string;
  notifications: boolean;
}

export function useSync(onSyncComplete?: () => void) {
  const [settings, setSettings] = useState<SyncSettings>({
    autoSync: false,
    syncInterval: 'daily',
    syncOnStart: true,
    apiToken: '',
    notifications: true,
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem('flowusSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }

    const savedLastSync = localStorage.getItem('flowusLastSync');
    if (savedLastSync) {
      setLastSync(new Date(savedLastSync));
    }
  }, []);

  const syncNow = async () => {
    if (!settings.apiToken) {
      setError('请先配置 API 令牌');
      return;
    }

    setIsSyncing(true);
    setError(null);

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
        
        if (settings.notifications && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification('FlowUs Manager', {
              body: '数据同步成功！',
              icon: '/favicon.ico'
            });
          }
        }

        onSyncComplete?.();
      } else {
        const errorData = await response.json();
        setError(errorData.error || '同步失败');
      }
    } catch (err) {
      setError('网络错误，请检查连接');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (settings.syncOnStart && settings.apiToken) {
      syncNow();
    }
  }, []);

  useEffect(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }

    if (settings.autoSync && settings.apiToken) {
      const intervals: { [key: string]: number } = {
        hourly: 60 * 60 * 1000,
        daily: 24 * 60 * 60 * 1000,
        weekly: 7 * 24 * 60 * 60 * 1000,
      };

      const intervalMs = intervals[settings.syncInterval];
      if (intervalMs) {
        syncIntervalRef.current = setInterval(() => {
          syncNow();
        }, intervalMs);
      }
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [settings.autoSync, settings.syncInterval, settings.apiToken]);

  const updateSettings = (newSettings: Partial<SyncSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    isSyncing,
    lastSync,
    error,
    syncNow,
    updateSettings,
  };
}
