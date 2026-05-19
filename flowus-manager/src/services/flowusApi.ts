import type { Page, Article, MediaFile, Analytics, TrendData } from '../types';

// Mock data
const mockArticles: Article[] = [
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
  {
    id: '3',
    title: 'Node.js 性能优化技巧',
    type: 'document',
    content: '# Node.js 性能优化技巧\n\n提升 Node.js 应用性能的实用技巧和最佳实践...',
    tags: ['Node.js', '后端', '性能优化'],
    views: 1876,
    likes: 123,
    comments: 34,
    shares: 28,
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-01-15T09:30:00Z',
  },
  {
    id: '4',
    title: 'CSS Grid 布局完全指南',
    type: 'document',
    content: '# CSS Grid 布局完全指南\n\n掌握 CSS Grid 布局，创建复杂的网页布局变得简单...',
    tags: ['CSS', '前端', '布局'],
    views: 3421,
    likes: 234,
    comments: 67,
    shares: 56,
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-12T11:15:00Z',
  },
  {
    id: '5',
    title: '微服务架构设计模式',
    type: 'document',
    content: '# 微服务架构设计模式\n\n探讨微服务架构中的常见设计模式和最佳实践...',
    tags: ['架构', '微服务', '设计模式'],
    views: 2654,
    likes: 178,
    comments: 52,
    shares: 41,
    createdAt: '2023-12-28T15:30:00Z',
    updatedAt: '2024-01-10T10:45:00Z',
  },
  {
    id: '6',
    title: 'Vue 3 组合式 API 入门',
    type: 'document',
    content: '# Vue 3 组合式 API 入门\n\n从零开始学习 Vue 3 的组合式 API...',
    tags: ['Vue', '前端', 'API'],
    views: 1987,
    likes: 134,
    comments: 38,
    shares: 29,
    createdAt: '2023-12-25T11:20:00Z',
    updatedAt: '2024-01-08T13:30:00Z',
  },
];

const mockPages: Page[] = [
  {
    id: 'folder-1',
    title: '技术文章',
    type: 'folder',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    children: [
      {
        id: '1',
        title: 'React Hooks 最佳实践指南',
        type: 'document',
        parentId: 'folder-1',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:45:00Z',
      },
      {
        id: '2',
        title: 'TypeScript 类型系统详解',
        type: 'document',
        parentId: 'folder-1',
        createdAt: '2024-01-10T08:15:00Z',
        updatedAt: '2024-01-18T16:20:00Z',
      },
      {
        id: '3',
        title: 'Node.js 性能优化技巧',
        type: 'document',
        parentId: 'folder-1',
        createdAt: '2024-01-05T12:00:00Z',
        updatedAt: '2024-01-15T09:30:00Z',
      },
    ],
  },
  {
    id: 'folder-2',
    title: '前端开发',
    type: 'folder',
    createdAt: '2023-11-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    children: [
      {
        id: '4',
        title: 'CSS Grid 布局完全指南',
        type: 'document',
        parentId: 'folder-2',
        createdAt: '2024-01-01T09:00:00Z',
        updatedAt: '2024-01-12T11:15:00Z',
      },
      {
        id: '6',
        title: 'Vue 3 组合式 API 入门',
        type: 'document',
        parentId: 'folder-2',
        createdAt: '2023-12-25T11:20:00Z',
        updatedAt: '2024-01-08T13:30:00Z',
      },
    ],
  },
  {
    id: '5',
    title: '微服务架构设计模式',
    type: 'document',
    createdAt: '2023-12-28T15:30:00Z',
    updatedAt: '2024-01-10T10:45:00Z',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const flowusApi = {
  async getPages(): Promise<Page[]> {
    await delay(500);
    return mockPages;
  },

  async getPageById(id: string): Promise<Page | undefined> {
    await delay(300);
    const findPage = (pages: Page[]): Page | undefined => {
      for (const page of pages) {
        if (page.id === id) return page;
        if (page.children) {
          const found = findPage(page.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findPage(mockPages);
  },

  async getArticles(): Promise<Article[]> {
    await delay(600);
    return mockArticles;
  },

  async getMedia(): Promise<MediaFile[]> {
    await delay(400);
    return [];
  },

  async getAnalytics(): Promise<Analytics> {
    await delay(500);
    const totalViews = mockArticles.reduce((sum, a) => sum + a.views, 0);
    const totalLikes = mockArticles.reduce((sum, a) => sum + a.likes, 0);
    const totalComments = mockArticles.reduce((sum, a) => sum + (a.comments || 0), 0);
    const totalShares = mockArticles.reduce((sum, a) => sum + (a.shares || 0), 0);
    
    const viewTrends: TrendData[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      viewTrends.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 100) + 50,
      });
    }
    
    return {
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      topPages: [...mockArticles].sort((a, b) => b.views - a.views).slice(0, 10),
      viewTrends,
    };
  },
};
