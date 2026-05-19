# 论文管理功能使用指南

## 📚 功能概述

FlowUs Manager 现在集成了完整的论文管理功能，支持导入、导出、搜索和管理学术论文信息。

## 🎯 主要功能

### 1. 导入论文

支持多种格式导入：

#### JSON 格式
```json
[
  {
    "title": "论文标题",
    "authors": ["作者1", "作者2"],
    "journal": "期刊名称",
    "year": 2024,
    "doi": "10.xxxx/xxxxx",
    "abstract": "论文摘要",
    "keywords": ["关键词1", "关键词2"]
  }
]
```

#### CSV 格式
支持以下列：
- Title
- Authors
- Journal
- Year
- Volume
- Issue
- Pages
- DOI
- URL
- Abstract
- Keywords

#### BibTeX 格式
支持标准的 BibTeX 条目格式

#### 纯文本格式
支持从论文列表文本中自动提取信息

### 2. 导出论文

支持多种导出格式：

- **JSON** - 完整的数据格式，便于程序处理
- **CSV** - Excel 兼容的表格格式
- **BibTeX** - LaTeX 引用格式
- **RIS** - 学术文献标准格式
- **Markdown** - Markdown 文档格式
- **Word/HTML** - Word 文档格式

### 3. 论文管理

- 🔍 **搜索** - 按标题、作者或关键词搜索
- ✏️ **编辑** - 修改论文信息
- 🗑️ **删除** - 删除不需要的论文
- 📖 **详情查看** - 查看完整的论文信息
- 🔗 **链接访问** - 直接打开论文链接

## 💡 使用流程

### 从 FlowUs 页面导入

1. 打开 FlowUs 论文页面
2. 复制页面内容（可以是标题、作者、摘要等）
3. 在论文管理页面点击"导入"
4. 选择"纯文本"格式
5. 粘贴内容
6. （可选）输入源页面URL
7. 点击"导入"

### 手动添加论文

1. 点击"添加论文"按钮
2. 填写论文信息：
   - 标题（必填）
   - 作者（多个用逗号分隔）
   - 期刊/会议
   - 年份
   - DOI
   - URL
   - 摘要
   - 关键词（多个用逗号分隔）
3. 点击"添加"

### 导出论文

1. 在论文列表页面点击"导出"
2. 选择导出格式
3. 文件将自动下载到本地

## 🔧 数据存储

所有论文数据存储在浏览器的 LocalStorage 中：
- 无需登录
- 数据保存在本地
- 换设备需要手动导入/导出备份

## 📊 数据字段

每个论文记录包含以下字段：

| 字段 | 说明 | 必填 |
|------|------|------|
| ID | 唯一标识符 | 自动生成 |
| Title | 论文标题 | ✅ |
| Authors | 作者列表 | ❌ |
| Journal | 期刊/会议名称 | ❌ |
| Year | 发表年份 | ❌ |
| Volume | 卷号 | ❌ |
| Issue | 期号 | ❌ |
| Pages | 页码 | ❌ |
| DOI | 数字对象标识符 | ❌ |
| URL | 在线链接 | ❌ |
| Abstract | 摘要 | ❌ |
| Keywords | 关键词列表 | ❌ |
| Notes | 备注 | ❌ |
| CreatedAt | 创建时间 | 自动生成 |
| UpdatedAt | 更新时间 | 自动生成 |
| ImportedFrom | 导入来源 | 自动生成 |

## 🎨 界面说明

### 主界面
- 顶部：论文统计信息和操作按钮
- 搜索栏：快速搜索论文
- 论文列表：显示所有论文卡片
- 每个卡片包含：标题、作者、期刊、年份、DOI、摘要预览、关键词标签

### 导入模态框
- 选择导入格式
- 输入源URL（可选）
- 上传文件或粘贴内容
- 确认导入

### 导出模态框
- 显示论文数量
- 6种导出格式选项
- 点击即可下载

### 添加/编辑模态框
- 表单字段：标题、作者、期刊、年份、DOI、URL、摘要、关键词
- 表单验证
- 取消/保存按钮

### 详情模态框
- 显示完整论文信息
- 编辑模式切换
- 打开链接按钮
- 元信息展示

## 💡 实用技巧

### 批量导入
- 准备好 JSON 或 CSV 文件
- 确保字段名正确
- 一次导入多篇论文

### 数据备份
- 定期导出为 JSON 格式
- 保存到本地或其他云存储
- 需要时重新导入

### 论文整理
- 使用关键词标签组织
- 利用搜索功能快速查找
- 编辑功能修改错误信息

### 从学术数据库导出
1. Google Scholar / PubMed → RIS 格式
2. EndNote / Mendeley → BibTeX 格式
3. 其他数据库 → 检查是否支持 CSV/RIS 导出
4. 将导出的文件导入到论文管理

## 🔍 格式转换

如果你的数据格式不匹配，可以：
1. **在线工具**：使用 BibTeX to JSON 等在线转换工具
2. **手动整理**：导出为 CSV，用 Excel 编辑后重新导入
3. **Python 脚本**：编写脚本批量转换（适合大量数据）

## ⚙️ 技术细节

- **前端框架**：React 18
- **状态管理**：React Hooks + LocalStorage
- **样式**：Tailwind CSS
- **构建工具**：Vite
- **类型安全**：TypeScript

## 🐛 常见问题

### Q: 导入失败怎么办？
A: 检查文件格式是否正确，JSON 需要符合标准格式

### Q: 数据会丢失吗？
A: LocalStorage 清理浏览器数据时会丢失，建议定期导出备份

### Q: 支持批量删除吗？
A: 目前需要逐个删除，可在后续版本中加入批量选择功能

### Q: 能同步到云端吗？
A: 目前仅支持本地存储，可导出 JSON 文件手动备份

## 🚀 未来功能

计划中的功能：
- [ ] 批量选择和删除
- [ ] 云端同步
- [ ] 论文标签管理
- [ ] 笔记和批注
- [ ] 引用关系图
- [ ] PDF 文件上传和管理
- [ ] 高级搜索和筛选
- [ ] 数据可视化分析

## 📝 示例数据

你可以使用以下示例数据测试导入功能：

```json
[
  {
    "title": "Attention Is All You Need",
    "authors": ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
    "journal": "NeurIPS",
    "year": 2017,
    "abstract": "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks.",
    "keywords": ["transformer", "attention", "neural networks"]
  }
]
```

## 🎓 学术资源

获取论文数据的好去处：
- **Google Scholar**: scholar.google.com
- **PubMed**: pubmed.ncbi.nlm.nih.gov
- **IEEE Xplore**: ieeexplore.ieee.org
- **ACM Digital Library**: dl.acm.org
- **arXiv**: arxiv.org

---

**享受论文管理！** 📚✨
