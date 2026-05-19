import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, ExternalLink } from 'lucide-react';
import type { Page } from '../../types';

interface PageTreeProps {
  pages: Page[];
  onPageClick: (id: string) => void;
}

export default function PageTree({ pages, onPageClick }: PageTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const renderPage = (page: Page, level: number = 0) => {
    const hasChildren = page.children && page.children.length > 0;
    const isExpanded = expandedIds.has(page.id);

    return (
      <div key={page.id}>
        <div
          className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer rounded"
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(page.id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}

          {page.type === 'folder' ? (
            <Folder className="w-5 h-5 text-yellow-500" />
          ) : (
            <File className="w-5 h-5 text-blue-500" />
          )}

          <span
            className="flex-1 text-sm text-gray-700"
            onClick={() => onPageClick(page.id)}
          >
            {page.title}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://flowus.cn/pages/${page.id}`, '_blank');
            }}
            className="p-1 text-gray-400 hover:text-blue-600"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {page.children!.map((child) => renderPage(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">页面结构</h3>
      <div className="space-y-1">
        {pages.map((page) => renderPage(page))}
      </div>
    </div>
  );
}
