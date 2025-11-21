#!/bin/bash

# API测试脚本
# 用于验证所有API端点是否正常工作

BASE_URL="http://localhost:3001/api/capacity"

echo "🚀 开始测试容量扩容诊断报表系统API..."
echo "=================================================="

# 检查服务器是否运行
echo "📡 检查服务器状态..."
if ! curl -s "$BASE_URL/cto-dashboard" > /dev/null; then
    echo "❌ 服务器未运行，请先启动服务器: npm run server"
    exit 1
fi
echo "✅ 服务器运行正常"
echo ""

# 测试CTO Dashboard API
echo "🔧 测试CTO Dashboard API..."
CTO_RESPONSE=$(curl -s "$BASE_URL/cto-dashboard")
if echo "$CTO_RESPONSE" | grep -q "componentName"; then
    echo "✅ CTO Dashboard API正常"
    echo "   返回组件数量: $(echo "$CTO_RESPONSE" | jq '. | length' 2>/dev/null || echo "解析失败")"
else
    echo "❌ CTO Dashboard API异常"
fi
echo ""

# 测试CEO Dashboard API
echo "👔 测试CEO Dashboard API..."
CEO_RESPONSE=$(curl -s "$BASE_URL/ceo-dashboard")
if echo "$CEO_RESPONSE" | grep -q "businessImpact"; then
    echo "✅ CEO Dashboard API正常"
    echo "   返回组件数量: $(echo "$CEO_RESPONSE" | jq '. | length' 2>/dev/null || echo "解析失败")"
else
    echo "❌ CEO Dashboard API异常"
fi
echo ""

# 测试运维总监 Dashboard API
echo "📊 测试运维总监 Dashboard API..."
OPS_DIRECTOR_RESPONSE=$(curl -s "$BASE_URL/ops-director-dashboard")
if echo "$OPS_DIRECTOR_RESPONSE" | grep -q "weeklyPlan"; then
    echo "✅ 运维总监 Dashboard API正常"
    echo "   总工作量: $(echo "$OPS_DIRECTOR_RESPONSE" | jq '.totalWorkHours' 2>/dev/null || echo "解析失败") 小时"
else
    echo "❌ 运维总监 Dashboard API异常"
fi
echo ""

# 测试运维工程师 Dashboard API
echo "🛠️ 测试运维工程师 Dashboard API..."
OPS_ENGINEER_RESPONSE=$(curl -s "$BASE_URL/ops-engineer-dashboard")
if echo "$OPS_ENGINEER_RESPONSE" | grep -q "expansionSteps"; then
    echo "✅ 运维工程师 Dashboard API正常"
    echo "   返回组件数量: $(echo "$OPS_ENGINEER_RESPONSE" | jq '. | length' 2>/dev/null || echo "解析失败")"
else
    echo "❌ 运维工程师 Dashboard API异常"
fi
echo ""

# 测试组件详情API
echo "🔍 测试组件详情API..."
COMPONENT_DETAIL_RESPONSE=$(curl -s "$BASE_URL/component/1")
if echo "$COMPONENT_DETAIL_RESPONSE" | grep -q "component"; then
    echo "✅ 组件详情API正常"
    echo "   组件名称: $(echo "$COMPONENT_DETAIL_RESPONSE" | jq -r '.component.name' 2>/dev/null || echo "解析失败")"
else
    echo "❌ 组件详情API异常"
fi
echo ""

# 测试不存在的组件
echo "🚫 测试不存在的组件..."
NOT_FOUND_RESPONSE=$(curl -s -w "%{http_code}" "$BASE_URL/component/999")
HTTP_CODE="${NOT_FOUND_RESPONSE: -3}"
if [ "$HTTP_CODE" = "404" ]; then
    echo "✅ 404错误处理正常"
else
    echo "❌ 404错误处理异常，HTTP状态码: $HTTP_CODE"
fi
echo ""

# 数据完整性检查
echo "🔍 数据完整性检查..."
CTO_COUNT=$(echo "$CTO_RESPONSE" | jq '. | length' 2>/dev/null || echo "0")
CEO_COUNT=$(echo "$CEO_RESPONSE" | jq '. | length' 2>/dev/null || echo "0")
OPS_ENGINEER_COUNT=$(echo "$OPS_ENGINEER_RESPONSE" | jq '. | length' 2>/dev/null || echo "0")

if [ "$CTO_COUNT" = "$CEO_COUNT" ] && [ "$CEO_COUNT" = "$OPS_ENGINEER_COUNT" ] && [ "$CTO_COUNT" -gt 0 ]; then
    echo "✅ 数据一致性检查通过，所有API返回相同数量的组件: $CTO_COUNT"
else
    echo "❌ 数据一致性检查失败"
    echo "   CTO: $CTO_COUNT, CEO: $CEO_COUNT, 工程师: $OPS_ENGINEER_COUNT"
fi
echo ""

# 优先级检查
echo "🎯 优先级分布检查..."
P1_COUNT=$(echo "$CTO_RESPONSE" | jq '[.[] | select(.priority == "P1")] | length' 2>/dev/null || echo "0")
P2_COUNT=$(echo "$CTO_RESPONSE" | jq '[.[] | select(.priority == "P2")] | length' 2>/dev/null || echo "0")
P3_COUNT=$(echo "$CTO_RESPONSE" | jq '[.[] | select(.priority == "P3")] | length' 2>/dev/null || echo "0")
P4_COUNT=$(echo "$CTO_RESPONSE" | jq '[.[] | select(.priority == "P4")] | length' 2>/dev/null || echo "0")

echo "   P1 (立即扩容): $P1_COUNT 个"
echo "   P2 (近期扩容): $P2_COUNT 个"
echo "   P3 (计划扩容): $P3_COUNT 个"
echo "   P4 (暂无压力): $P4_COUNT 个"

TOTAL_CHECK=$((P1_COUNT + P2_COUNT + P3_COUNT + P4_COUNT))
if [ "$TOTAL_CHECK" = "$CTO_COUNT" ]; then
    echo "✅ 优先级分布检查通过"
else
    echo "❌ 优先级分布检查失败"
fi
echo ""

# 性能测试
echo "⚡ 性能测试..."
START_TIME=$(date +%s%N)
for i in {1..10}; do
    curl -s "$BASE_URL/cto-dashboard" > /dev/null
done
END_TIME=$(date +%s%N)
AVG_RESPONSE_TIME=$(( (END_TIME - START_TIME) / 10000000 ))
echo "   10次请求平均响应时间: ${AVG_RESPONSE_TIME}ms"

if [ "$AVG_RESPONSE_TIME" -lt 100 ]; then
    echo "✅ 性能测试通过"
else
    echo "⚠️  响应时间较慢，建议优化"
fi
echo ""

echo "=================================================="
echo "🎉 API测试完成！"
echo ""
echo "📊 测试总结:"
echo "   - 所有API端点已测试"
echo "   - 数据完整性已验证"
echo "   - 优先级分布已检查"
echo "   - 性能指标已评估"
echo ""
echo "🌐 访问地址:"
echo "   - 前端应用: http://localhost:3000"
echo "   - 后端API: $BASE_URL"
echo ""
echo "📱 API端点列表:"
echo "   - GET $BASE_URL/cto-dashboard"
echo "   - GET $BASE_URL/ceo-dashboard"
echo "   - GET $BASE_URL/ops-director-dashboard"
echo "   - GET $BASE_URL/ops-engineer-dashboard"
echo "   - GET $BASE_URL/component/:id"