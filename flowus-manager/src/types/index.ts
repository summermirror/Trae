export interface Page {
  id: string;
  title: string;
  type: 'document' | 'folder';
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  children?: Page[];
}

export interface Article extends Page {
  content: string;
  tags: string[];
  views: number;
  likes: number;
  comments?: number;
  shares?: number;
}

export interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  createdAt: string;
}

export interface Analytics {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  topPages: Page[];
  viewTrends: TrendData[];
}

export interface TrendData {
  date: string;
  value: number;
}
