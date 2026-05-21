#!/bin/bash

# FlowUs Papers Export API Test Script
# 使用方法: ./test_export_api.sh

API_TOKEN="AWrFb1KDwmzEt6g06wWx2jcYSNL6k3y8JwJCeSLq"
BASE_URL="http://localhost:3001"

echo "=========================================="
echo "FlowUs Papers Export API 测试"
echo "=========================================="
echo ""

# 1. 测试服务器健康状态
echo "1️⃣ 测试服务器健康状态..."
curl -s "${BASE_URL}/health" | jq '.' || echo "服务器未运行，请先启动服务器"
echo ""

# 2. 查看支持的导出格式
echo "2️⃣ 获取支持的导出格式..."
curl -s "${BASE_URL}/api/export/formats" | jq '.'
echo ""

# 3. 测试JSON格式导出
echo "3️⃣ 测试 JSON 格式导出..."
curl -s "${BASE_URL}/api/export/papers?token=${API_TOKEN}&format=json" \
  -H "Content-Type: application/json" \
  -o papers_test.json
echo "已保存到 papers_test.json"
echo "预览前3条数据:"
cat papers_test.json | jq '.data | .[0:3]'
echo ""

# 4. 测试CSV格式导出
echo "4️⃣ 测试 CSV 格式导出..."
curl -s "${BASE_URL}/api/export/papers?token=${API_TOKEN}&format=csv" \
  -H "Content-Type: text/csv; charset=utf-8" \
  -o papers_test.csv
echo "已保存到 papers_test.csv"
echo "预览前5行:"
head -n 5 papers_test.csv
echo ""

# 5. 测试Markdown格式导出
echo "5️⃣ 测试 Markdown 格式导出..."
curl -s "${BASE_URL}/api/export/papers?token=${API_TOKEN}&format=markdown" \
  -H "Content-Type: text/markdown; charset=utf-8" \
  -o papers_test.md
echo "已保存到 papers_test.md"
echo "预览前30行:"
head -n 30 papers_test.md
echo ""

# 6. 测试BibTeX格式导出
echo "6️⃣ 测试 BibTeX 格式导出..."
curl -s "${BASE_URL}/api/export/papers?token=${API_TOKEN}&format=bibtex" \
  -H "Content-Type: text/plain; charset=utf-8" \
  -o papers_test.bib
echo "已保存到 papers_test.bib"
echo "预览前20行:"
head -n 20 papers_test.bib
echo ""

echo "=========================================="
echo "测试完成！"
echo "=========================================="
echo ""
echo "导出的文件:"
ls -lh papers_test.* 2>/dev/null || echo "未找到导出文件"
echo ""
echo "API使用示例:"
echo "  JSON:    curl '${BASE_URL}/api/export/papers?token=YOUR_TOKEN&format=json'"
echo "  CSV:     curl '${BASE_URL}/api/export/papers?token=YOUR_TOKEN&format=csv'"
echo "  Markdown: curl '${BASE_URL}/api/export/papers?token=YOUR_TOKEN&format=markdown'"
echo "  BibTeX:  curl '${BASE_URL}/api/export/papers?token=YOUR_TOKEN&format=bibtex'"
echo "  Word:    curl '${BASE_URL}/api/export/papers?token=YOUR_TOKEN&format=word'"
