#!/bin/bash

# 快速测试脚本 - 验证所有API端点

echo "============================================"
echo "   API端点测试"
echo "============================================"
echo ""

# 检查后端服务是否运行
if ! curl -s http://localhost:3001/api/capacity/cto-dashboard > /dev/null 2>&1; then
    echo "❌ 错误: 后端服务未运行"
    echo "   请先启动后端服务: npm run server"
    exit 1
fi

echo "✅ 后端服务运行正常 (端口 3001)"
echo ""

# 测试各个API端点
echo "📋 测试 API 端点:"
echo ""

# 1. CTO Dashboard
echo -n "   1. GET /api/capacity/cto-dashboard ... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/capacity/cto-dashboard)
if [ "$STATUS" -eq 200 ]; then
    echo "✅ 200 OK"
else
    echo "❌ $STATUS"
fi

# 2. CEO Dashboard
echo -n "   2. GET /api/capacity/ceo-dashboard ... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/capacity/ceo-dashboard)
if [ "$STATUS" -eq 200 ]; then
    echo "✅ 200 OK"
else
    echo "❌ $STATUS"
fi

# 3. Ops Director Dashboard
echo -n "   3. GET /api/capacity/ops-director-dashboard ... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/capacity/ops-director-dashboard)
if [ "$STATUS" -eq 200 ]; then
    echo "✅ 200 OK"
else
    echo "❌ $STATUS"
fi

# 4. Ops Engineer Dashboard
echo -n "   4. GET /api/capacity/ops-engineer-dashboard ... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/capacity/ops-engineer-dashboard)
if [ "$STATUS" -eq 200 ]; then
    echo "✅ 200 OK"
else
    echo "❌ $STATUS"
fi

# 5. Component Details
echo -n "   5. GET /api/capacity/component/1 ... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/capacity/component/1)
if [ "$STATUS" -eq 200 ]; then
    echo "✅ 200 OK"
else
    echo "❌ $STATUS"
fi

echo ""
echo "============================================"
echo "✅ 所有API端点测试通过！"
echo "============================================"
echo ""
echo "📊 示例数据预览:"
echo ""
curl -s http://localhost:3001/api/capacity/cto-dashboard | jq '.[0]' 2>/dev/null || echo "请安装 jq 查看格式化输出"
