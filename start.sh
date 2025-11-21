#!/bin/bash

# 多角色容量扩容诊断报表系统 - 启动脚本

echo "============================================"
echo "   容量扩容诊断报表系统 - 启动中..."
echo "============================================"
echo ""

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "⚠️  检测到依赖未安装，正在运行安装脚本..."
    ./setup.sh
    if [ $? -ne 0 ]; then
        echo "❌ 安装失败，请检查错误信息"
        exit 1
    fi
fi

# 检查端口是否被占用并清理
echo "🔍 检查端口占用..."
PORT_3001=$(lsof -ti:3001)
if [ ! -z "$PORT_3001" ]; then
    echo "⚠️  端口 3001 已被占用，正在清理..."
    kill -9 $PORT_3001 2>/dev/null
    sleep 1
    echo "✅ 端口 3001 已清理"
fi

PORT_3000=$(lsof -ti:3000)
if [ ! -z "$PORT_3000" ]; then
    echo "⚠️  端口 3000 已被占用，正在清理..."
    kill -9 $PORT_3000 2>/dev/null
    sleep 1
    echo "✅ 端口 3000 已清理"
fi
echo ""

# 启动服务
echo "🚀 启动开发服务器..."
echo ""
echo "   后端服务: http://localhost:3001"
echo "   前端应用: http://localhost:3000"
echo ""
echo "   按 Ctrl+C 停止服务"
echo "============================================"
echo ""

# 启动前后端服务
npm run dev
