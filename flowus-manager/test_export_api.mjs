import fetch from 'node:fetch';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_TOKEN = 'AWrFb1KDwmzEt6g06wWx2jcYSNL6k3y8JwJCeSLq';
const BASE_URL = 'http://localhost:3001';

async function testExportAPI() {
  console.log('='.repeat(50));
  console.log('FlowUs Papers Export API 测试');
  console.log('='.repeat(50));
  console.log('');

  try {
    // 1. Test health endpoint
    console.log('1️⃣ 测试服务器健康状态...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✓ 服务器状态:', healthData.status);
    console.log('');

    // 2. Get supported formats
    console.log('2️⃣ 获取支持的导出格式...');
    const formatsResponse = await fetch(`${BASE_URL}/api/export/formats`);
    const formatsData = await formatsResponse.json();
    console.log('支持的格式:');
    formatsData.formats.forEach(f => {
      console.log(`  - ${f.id}: ${f.name} (${f.extension}) - ${f.description}`);
    });
    console.log('');

    // 3. Test JSON export
    console.log('3️⃣ 测试 JSON 格式导出...');
    const jsonResponse = await fetch(`${BASE_URL}/api/export/papers?token=${API_TOKEN}&format=json`);
    const jsonData = await jsonResponse.json();
    
    if (jsonData.success) {
      console.log(`✓ 成功导出 ${jsonData.count} 篇论文`);
      console.log('前3篇论文预览:');
      jsonData.data.slice(0, 3).forEach((paper, index) => {
        console.log(`  ${index + 1}. ${paper.title}`);
        console.log(`     创建时间: ${paper.createdAt}`);
        console.log(`     链接: ${paper.url}`);
      });
      
      // Save to file
      fs.writeFileSync(
        path.join(__dirname, 'FLOWUS_PAPERS_EXPORT_API.json'),
        JSON.stringify(jsonData, null, 2)
      );
      console.log(`✓ 已保存到 FLOWUS_PAPERS_EXPORT_API.json`);
    } else {
      console.log('✗ JSON导出失败:', jsonData.error);
    }
    console.log('');

    // 4. Test CSV export
    console.log('4️⃣ 测试 CSV 格式导出...');
    const csvResponse = await fetch(`${BASE_URL}/api/export/papers?token=${API_TOKEN}&format=csv`);
    const csvData = await csvResponse.text();
    
    fs.writeFileSync(
      path.join(__dirname, 'FLOWUS_PAPERS_EXPORT_API.csv'),
      csvData
    );
    console.log('✓ 已保存到 FLOWUS_PAPERS_EXPORT_API.csv');
    console.log('预览前5行:');
    console.log(csvData.split('\n').slice(0, 5).join('\n'));
    console.log('');

    // 5. Test Markdown export
    console.log('5️⃣ 测试 Markdown 格式导出...');
    const mdResponse = await fetch(`${BASE_URL}/api/export/papers?token=${API_TOKEN}&format=markdown`);
    const mdData = await mdResponse.text();
    
    fs.writeFileSync(
      path.join(__dirname, 'FLOWUS_PAPERS_EXPORT_API.md'),
      mdData
    );
    console.log('✓ 已保存到 FLOWUS_PAPERS_EXPORT_API.md');
    console.log('预览前20行:');
    console.log(mdData.split('\n').slice(0, 20).join('\n'));
    console.log('');

    // 6. Test BibTeX export
    console.log('6️⃣ 测试 BibTeX 格式导出...');
    const bibResponse = await fetch(`${BASE_URL}/api/export/papers?token=${API_TOKEN}&format=bibtex`);
    const bibData = await bibResponse.text();
    
    fs.writeFileSync(
      path.join(__dirname, 'FLOWUS_PAPERS_EXPORT_API.bib'),
      bibData
    );
    console.log('✓ 已保存到 FLOWUS_PAPERS_EXPORT_API.bib');
    console.log('');

    // 7. Summary
    console.log('='.repeat(50));
    console.log('✅ 测试完成！');
    console.log('='.repeat(50));
    console.log('');
    console.log('导出的文件:');
    const files = [
      'FLOWUS_PAPERS_EXPORT_API.json',
      'FLOWUS_PAPERS_EXPORT_API.csv',
      'FLOWUS_PAPERS_EXPORT_API.md',
      'FLOWUS_PAPERS_EXPORT_API.bib'
    ];
    files.forEach(file => {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`  ✓ ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
      }
    });
    console.log('');
    console.log('API调用示例:');
    console.log(`  curl '${BASE_URL}/api/export/papers?token=YOUR_TOKEN&format=json'`);
    console.log(`  curl '${BASE_URL}/api/export/papers?token=YOUR_TOKEN&format=csv'`);
    console.log(`  curl '${BASE_URL}/api/export/papers?token=YOUR_TOKEN&format=markdown'`);
    console.log(`  curl '${BASE_URL}/api/export/papers?token=YOUR_TOKEN&format=bibtex'`);
    console.log(`  curl '${BASE_URL}/api/export/papers?token=YOUR_TOKEN&format=word'`);

  } catch (error) {
    console.error('✗ 测试失败:', error.message);
    console.error('请确保服务器正在运行: npm run server');
    process.exit(1);
  }
}

testExportAPI();
