import { useState, useEffect, useCallback } from 'react';
import { flowusApi } from '../services/flowusApi';
import type { Page, Article } from '../types';

export function useFlowusData() {
  const [pages, setPages] = useState<Page[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [pagesData, articlesData] = await Promise.all([
        flowusApi.getPages(),
        flowusApi.getArticles(),
      ]);
      setPages(pagesData);
      setArticles(articlesData);
    } catch (err) {
      setError('获取数据失败，请检查API配置');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { pages, articles, loading, error, refetch: fetchData };
}
