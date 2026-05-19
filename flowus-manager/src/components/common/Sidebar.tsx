import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3, Download, Settings } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: '仪表盘' },
    { to: '/content', icon: FileText, label: '内容管理' },
    { to: '/analytics', icon: BarChart3, label: '数据分析' },
    { to: '/export', icon: Download, label: '导出中心' },
    { to: '/settings', icon: Settings, label: '设置' },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">FlowUs Manager</h1>
      </div>
      <nav className="mt-6">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
              }`
            }
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
