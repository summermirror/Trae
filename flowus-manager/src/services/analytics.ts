import type { Article, Analytics, TrendData } from '../types';

export function calculateAnalytics(articles: Article[]): Analytics {
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const totalLikes = articles.reduce((sum, a) => sum + a.likes, 0);
  const totalComments = articles.reduce((sum, a) => sum + (a.comments || 0), 0);
  const totalShares = articles.reduce((sum, a) => sum + (a.shares || 0), 0);

  const topPages = [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return {
    totalViews,
    totalLikes,
    totalComments,
    totalShares,
    topPages,
    viewTrends: generateViewTrends(articles),
  };
}

function generateViewTrends(_articles: Article[]): TrendData[] {
  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last30Days.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 100) + 50,
    });
  }
  return last30Days;
}

export function getInteractionDistribution(articles: Article[]) {
  const likes = articles.reduce((sum, a) => sum + a.likes, 0);
  const comments = articles.reduce((sum, a) => sum + (a.comments || 0), 0);
  const shares = articles.reduce((sum, a) => sum + (a.shares || 0), 0);

  return [
    { name: '点赞', value: likes, color: '#3B82F6' },
    { name: '评论', value: comments, color: '#10B981' },
    { name: '分享', value: shares, color: '#F59E0B' },
  ];
}
