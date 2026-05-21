# FlowUs 论文列表提取工具

## 📋 已获取的论文信息

基于对 FlowUs 页面的访问，以下是你主页论文多维表中的内容：

### 论文 #1 (置顶)
- **标题**: Quantitative Steel Corrosion Assessment Using Impedance Responses of Planar Eddy Current Sensor
- **标题译文**: 基于平面涡流传感器阻抗响应的钢材腐蚀定量评估方法
- **发表时间**: 2026/04/05
- **期刊**: IEEE Transactions on Industrial Electronics (TIE)
- **主要完成人**: HOO YEN YI(何远毅)
- **是否置顶**: ✅ 是
- **致谢项目**: 
  - 氯盐侵蚀混凝土修复界面钢筋电化学相容性与控制方法研究
  - 海洋环境液-固两相冲蚀作用下混凝土劣化与钢筋腐蚀机理

---

### 论文 #2 - #6 (未显示详细信息)

页面显示共有 **6 篇论文**（1篇置顶 + 5篇其他），但由于 FlowUs 页面的动态渲染限制，无法获取到剩余5篇论文的完整信息。

## 🔍 如何获取完整的论文列表

### 方法 1：使用 FlowUs 导出功能

1. 打开页面: https://flowus.cn/durability/share/9162bbd1-8518-4365-8cdd-ffd8a60a905c
2. 登录你的账号
3. 点击右上角的"..."菜单
4. 选择"导出"或"复制内容"
5. 选择导出格式（推荐：JSON 或 CSV）
6. 将导出的文件保存

### 方法 2：手动复制表格内容

1. 打开页面
2. 选中文档中的表格内容
3. 复制后粘贴到文本编辑器
4. 整理成结构化数据

### 方法 3：使用浏览器开发者工具

1. 在浏览器中打开页面
2. 按 F12 打开开发者工具
3. 切换到 Console 标签
4. 复制以下代码并执行：

```javascript
// 提取页面中所有论文信息
const papers = [];
document.querySelectorAll('[class*="database-row"]').forEach(row => {
  const title = row.querySelector('[class*="title"]')?.textContent || '';
  const time = row.querySelector('[class*="time"]')?.textContent || '';
  const journal = row.querySelector('[class*="journal"]')?.textContent || '';
  const author = row.querySelector('[class*="author"]')?.textContent || '';
  
  if (title) {
    papers.push({ title, time, journal, author });
  }
});

console.log(JSON.stringify(papers, null, 2));
```

5. 复制控制台输出的 JSON 数据

## 📝 请提供剩余论文信息

如果你能手动复制剩余5篇论文的信息，我可以帮你：
1. 整理成结构化数据
2. 导入到论文管理系统
3. 导出为多种格式（JSON、CSV、BibTeX 等）

## 📊 论文分类

根据页面结构，论文可能按以下分类：
- **SCI** 期刊论文
- **EI** 期刊论文  
- **核心** 期刊论文
- **会议** 论文

---

**如果你能导出或提供剩余论文的信息，我会立即帮你完成数据整理和导入！** 📚
