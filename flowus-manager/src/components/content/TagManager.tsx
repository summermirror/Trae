import { useState } from 'react';
import { Plus, X, Tag } from 'lucide-react';

interface TagManagerProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export default function TagManager({ tags, onAddTag, onRemoveTag }: TagManagerProps) {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
        <Tag className="w-5 h-5" />
        标签管理
      </h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
          placeholder="输入新标签..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTag}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
          >
            {tag}
            <button
              onClick={() => onRemoveTag(tag)}
              className="hover:bg-blue-200 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {tags.length === 0 && (
        <p className="text-center text-gray-500 py-4">暂无标签</p>
      )}
    </div>
  );
}
