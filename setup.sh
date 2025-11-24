#!/bin/bash

# 多角色容量扩容诊断报表系统 - 安装脚本

echo "============================================"
echo "   容量扩容诊断报表系统 - 安装向导"
echo "============================================"
echo ""

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到 Node.js"
    echo "请先安装 Node.js 16+ 版本: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js 版本: $NODE_VERSION"

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未检测到 npm"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm 版本: $NPM_VERSION"
echo ""

# 步骤1: 安装后端依赖
echo "📦 步骤 1/3: 安装后端依赖..."
npm install --silent
if [ $? -eq 0 ]; then
    echo "✅ 后端依赖安装成功"
else
    echo "❌ 后端依赖安装失败"
    exit 1
fi
echo ""

# 步骤2: 安装前端依赖
echo "📦 步骤 2/3: 安装前端依赖..."
cd client
npm install --silent
if [ $? -eq 0 ]; then
    echo "✅ 前端依赖安装成功"
else
    echo "❌ 前端依赖安装失败"
    exit 1
fi
cd ..
echo ""

# 步骤3: 创建环境配置文件
echo "⚙️  步骤 3/3: 配置环境变量..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ 创建后端 .env 文件"
else
    echo "ℹ️  后端 .env 文件已存在，跳过"
fi

if [ ! -f client/.env ]; then
    cp client/.env.example client/.env
    echo "✅ 创建前端 .env 文件"
else
    echo "ℹ️  前端 .env 文件已存在，跳过"
fi
echo ""

echo "============================================"
echo "✅ 安装完成！"
echo "============================================"
echo ""
echo "🚀 启动说明："
echo ""
echo "   方式1 - 同时启动前后端（推荐）:"
echo "   npm run dev"
echo ""
echo "   方式2 - 分别启动:"
echo "   npm run server  # 后端 (端口 3001)"
echo "   npm run client  # 前端 (端口 3000)"
echo ""
echo "📌 访问地址:"
echo "   前端: http://localhost:3000"
echo "   API:  http://localhost:3001"
echo ""
echo "💡 提示: 系统使用模拟数据，无需配置数据库即可运行"
echo "============================================"
