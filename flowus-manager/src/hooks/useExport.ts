import { useState, useCallback } from 'react';
import type { Article } from '../types';
import { exportBatch } from '../services/export';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [exportError, setExportError] = useState<string>('');

  const startExport = useCallback(async (articles: Article[], format: string) => {
    if (articles.length === 0) {
      setExportError('请选择要导出的文章');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setCurrentFile('');
    setExportError('');

    try {
      await exportBatch(articles, format, (progress, file) => {
        setExportProgress(progress);
        setCurrentFile(file);
      });
    } catch (error) {
      setExportError(error instanceof Error ? error.message : '导出失败，请重试');
    } finally {
      if (!exportError) {
        setExportProgress(100);
      }
    }
  }, []);

  const resetExport = useCallback(() => {
    setIsExporting(false);
    setExportProgress(0);
    setCurrentFile('');
    setExportError('');
  }, []);

  return {
    isExporting,
    exportProgress,
    currentFile,
    exportError,
    startExport,
    resetExport,
  };
}
