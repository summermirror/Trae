# FlowUs Manager

FlowUs 个人主页管理平台

## Phase 1 已完成功能

- ✅ 项目初始化（Vite + React + TypeScript）
- ✅ Tailwind CSS 配置
- ✅ Express 后端服务器搭建
- ✅ FlowUs API 代理路由
- ✅ 基础 UI 组件（Layout, Sidebar, Header）
- ✅ React Router 路由配置
- ✅ 项目可正常构建

## 技术栈

- 前端框架：React 18 + TypeScript + Vite
- 后端框架：Node.js + Express
- 样式方案：Tailwind CSS
- 路由管理：React Router v6
- 图表库：Recharts
- HTTP 客户端：Axios
- 图标库：Lucide React

## 快速开始

### 安装依赖

```bash
cd flowus-manager
npm install
```

### 开发模式（同时启动前后端）

```bash
npm run dev
```

### 分别启动

启动后端服务器：
```bash
npm run server
```

启动前端开发服务器：
```bash
npm run client
```

### 构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
flowus-manager/
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Layout.tsx
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Content.tsx
│   │   ├── Analytics.tsx
│   │   ├── Export.tsx
│   │   └── Settings.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/
│   ├── index.js
│   └── routes/
│       └── flowus.js
├── .env.example
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```
