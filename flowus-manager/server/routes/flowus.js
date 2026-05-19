import express from 'express';

const router = express.Router();

// Mock data for demonstration
const mockArticles = [
  {
    id: '1',
    title: 'React Hooks 最佳实践指南',
    type: 'document',
    content: '# React Hooks 最佳实践指南\n\n在这篇文章中，我们将探讨如何正确使用 React Hooks...',
    tags: ['React', '前端', 'Hooks'],
    views: 1256,
    likes: 89,
    comments: 23,
    shares: 15,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
  },
  {
    id: '2',
    title: 'TypeScript 类型系统详解',
    type: 'document',
    content: '# TypeScript 类型系统详解\n\nTypeScript 的类型系统是其最强大的特性之一...',
    tags: ['TypeScript', '前端', '类型系统'],
    views: 2341,
    likes: 156,
    comments: 45,
    shares: 32,
    createdAt: '2024-01-10T08:15:00Z',
    updatedAt: '2024-01-18T16:20:00Z',
  },
];

router.get('/pages', (req, res) => {
  res.json([
    {
      id: 'folder-1',
      title: '技术文章',
      type: 'folder',
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z',
      children: mockArticles,
    },
  ]);
});

router.get('/articles', (req, res) => {
  res.json(mockArticles);
});

router.get('/analytics', (req, res) => {
  const totalViews = mockArticles.reduce((sum, a) => sum + a.views, 0);
  const totalLikes = mockArticles.reduce((sum, a) => sum + a.likes, 0);
  const totalComments = mockArticles.reduce((sum, a) => sum + (a.comments || 0), 0);
  const totalShares = mockArticles.reduce((sum, a) => sum + (a.shares || 0), 0);
  
  const viewTrends = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    viewTrends.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 100) + 50,
    });
  }
  
  res.json({
    totalViews,
    totalLikes,
    totalComments,
    totalShares,
    topPages: [...mockArticles].sort((a, b) => b.views - a.views).slice(0, 10),
    viewTrends,
  });
});

router.get('/pages/:id', (req, res) => {
  const { id } = req.params;
  const page = mockArticles.find(p => p.id === id);
  if (page) {
    res.json(page);
  } else {
    res.status(404).json({ error: 'Page not found' });
  }
});

export default router;
