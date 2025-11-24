# 快速入门指南

一分钟内启动多角色容量扩容诊断报表系统！

## ⚡ 超快速启动（推荐）

```bash
# 1. 运行安装脚本
./setup.sh

# 2. 启动服务
./start.sh
```

完成！打开浏览器访问 http://localhost:3000

## 🔧 手动启动

如果自动化脚本不工作，使用以下命令：

### 步骤 1: 安装依赖

```bash
# 后端
npm install

# 前端
cd client && npm install && cd ..
```

### 步骤 2: 创建配置文件

```bash
# 复制环境配置
cp .env.example .env
cp client/.env.example client/.env
```

### 步骤 3: 启动服务

```bash
# 方式A - 同时启动前后端（推荐）
npm run dev

# 方式B - 分别启动（两个终端窗口）
npm run server  # 终端1: 后端
npm run client  # 终端2: 前端
```

### 步骤 4: 访问应用

- **前端**: http://localhost:3000
- **API**: http://localhost:3001

## ✅ 验证安装

运行快速测试脚本：

```bash
./quick-test.sh
```

应该看到所有API端点返回 ✅ 200 OK

## 🎯 系统功能

### 4个角色视角

1. **CTO视角** - 技术扩容方案和工作量评估
2. **CEO视角** - 业务影响分析和决策建议
3. **运维总监视角** - 全局容量规划和资源安排
4. **运维工程师视角** - 详细执行步骤和验证方法

### 核心问题

**哪些资源需要扩容，什么时候必须扩，优先级是什么？**

每个角色都能获得针对性的答案。

## 🐛 遇到问题？

### 端口被占用

```bash
# 清理端口并重启
./start.sh  # 自动清理
```

或手动清理：

```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
npm run dev
```

### 模块找不到

```bash
# 重新安装所有依赖
./setup.sh
```

### 更多问题

查看详细故障排除文档：

```bash
cat TROUBLESHOOTING.md
```

或在线查看: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 📚 下一步

- 📖 **完整功能**: [README.md](./README.md)
- 🚀 **生产部署**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- ✅ **安装验证**: [INSTALL_CHECKLIST.md](./INSTALL_CHECKLIST.md)

## 💡 提示

- ✨ 系统使用**模拟数据**，无需配置数据库即可运行
- 🔄 支持**热重载**，修改代码后自动刷新
- 📱 **响应式设计**，支持移动设备访问
- 🎨 **现代化UI**，带有优先级颜色编码

## 🎉 开始使用

现在您可以：

1. 浏览不同角色的报表视图
2. 查看容量扩容建议
3. 分析优先级和风险
4. 制定扩容计划

祝使用愉快！🚀
