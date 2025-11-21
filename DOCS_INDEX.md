# 📚 文档索引

本项目的完整文档导航。

## 🚀 快速开始

| 文档 | 描述 | 适用场景 |
|------|------|----------|
| [WELCOME.md](./WELCOME.md) | 欢迎指南，5分钟快速入门 | ⭐⭐⭐ 首次使用必读 |
| [QUICKSTART.md](./QUICKSTART.md) | 一分钟快速启动指南 | ⭐⭐ 快速上手 |
| [README.md](./README.md) | 项目完整介绍和功能说明 | 了解项目全貌 |
| [INSTALL_CHECKLIST.md](./INSTALL_CHECKLIST.md) | 详细安装验证清单 | 确保安装正确 |
| [FILE_LIST.md](./FILE_LIST.md) | 项目文件清单和说明 | 了解文件结构 |

## 🛠️ 开发和部署

| 文档 | 描述 | 适用场景 |
|------|------|----------|
| [DEPLOYMENT.md](./DEPLOYMENT.md) | 完整部署指南（开发/生产/Docker） | 生产环境部署 |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | 项目技术总结和验收标准 | 了解技术实现 |
| [SETUP_IMPROVEMENTS.md](./SETUP_IMPROVEMENTS.md) | 本地开发环境改进说明 | 了解v2.0改进 |
| [STATUS_REPORT.md](./STATUS_REPORT.md) | 项目状态和完成度报告 | 查看项目状态 |

## 🔧 故障排除

| 文档 | 描述 | 适用场景 |
|------|------|----------|
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | 常见问题和解决方案 | 遇到问题时查阅 |

## 🔨 实用脚本

| 脚本 | 功能 | 使用方法 |
|------|------|----------|
| `setup.sh` | 自动安装所有依赖和配置 | `./setup.sh` |
| `start.sh` | 启动开发服务器（自动清理端口） | `./start.sh` |
| `quick-test.sh` | 快速测试所有API端点 | `./quick-test.sh` |
| `test-api.sh` | 详细的API测试脚本 | `./test-api.sh` |

## 📁 项目结构

```
capacity-multirole-diagnosis-report/
├── 📄 文档
│   ├── QUICKSTART.md              # 快速启动（推荐首读）
│   ├── README.md                   # 项目说明
│   ├── DEPLOYMENT.md               # 部署指南
│   ├── TROUBLESHOOTING.md          # 故障排除
│   ├── INSTALL_CHECKLIST.md        # 安装清单
│   ├── PROJECT_SUMMARY.md          # 项目总结
│   └── DOCS_INDEX.md               # 本文档
│
├── 🔨 脚本
│   ├── setup.sh                    # 安装脚本
│   ├── start.sh                    # 启动脚本
│   ├── quick-test.sh               # 快速测试
│   └── test-api.sh                 # API测试
│
├── ⚙️ 配置
│   ├── .env.example                # 后端环境配置示例
│   ├── .env                        # 后端环境配置（自动生成）
│   ├── package.json                # 根依赖配置
│   └── .gitignore                  # Git忽略规则
│
├── 🖥️ 后端 (server/)
│   ├── index.js                    # 服务器入口
│   ├── routes/                     # API路由
│   │   └── capacity.js             # 容量相关路由
│   ├── controllers/                # 业务控制器
│   │   └── capacityController.js  # 容量控制器
│   └── config/                     # 配置文件
│       └── database.js             # 数据库配置（可选）
│
├── 🎨 前端 (client/)
│   ├── public/                     # 静态资源
│   ├── src/                        # 源代码
│   │   ├── App.tsx                 # 应用入口
│   │   ├── components/             # React组件
│   │   │   ├── CTODashboard.tsx
│   │   │   ├── CEODashboard.tsx
│   │   │   ├── OpsDirectorDashboard.tsx
│   │   │   ├── OpsEngineerDashboard.tsx
│   │   │   ├── PriorityBadge.tsx
│   │   │   └── CapacityIndicator.tsx
│   │   └── services/               # API服务
│   │       └── api.ts              # API封装
│   ├── .env.example                # 前端环境配置示例
│   ├── .env                        # 前端环境配置（自动生成）
│   └── package.json                # 前端依赖
│
└── 💾 数据库 (database/)
    └── schema.sql                  # 数据库结构（可选）
```

## 🎯 使用流程建议

### 首次使用

1. **阅读** [QUICKSTART.md](./QUICKSTART.md) - 快速了解如何启动
2. **运行** `./setup.sh` - 自动安装依赖
3. **启动** `./start.sh` - 启动服务
4. **验证** `./quick-test.sh` - 测试API
5. **使用** http://localhost:3000 - 开始使用系统

### 遇到问题

1. **查阅** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. **验证** [INSTALL_CHECKLIST.md](./INSTALL_CHECKLIST.md)
3. **重装** `./setup.sh` 重新安装

### 生产部署

1. **阅读** [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **选择** 部署方式（传统/Docker/PM2）
3. **配置** 环境变量和数据库
4. **部署** 按照指南操作

## 📋 快速参考

### 常用命令

```bash
# 安装
./setup.sh

# 启动
./start.sh

# 测试
./quick-test.sh

# 清理端口
lsof -ti:3001 | xargs kill -9

# 查看日志
npm run server  # 后端日志在终端
# 前端日志在浏览器控制台（F12）
```

### 关键端口

- `3000` - 前端React应用
- `3001` - 后端API服务

### API端点

| 端点 | 角色 | 方法 |
|------|------|------|
| `/api/capacity/cto-dashboard` | CTO | GET |
| `/api/capacity/ceo-dashboard` | CEO | GET |
| `/api/capacity/ops-director-dashboard` | 运维总监 | GET |
| `/api/capacity/ops-engineer-dashboard` | 运维工程师 | GET |
| `/api/capacity/component/:id` | 组件详情 | GET |

## 🌟 特色功能

- ✅ **无需数据库** - 使用模拟数据即可运行
- 🚀 **一键启动** - 自动化脚本简化安装
- 📊 **4个视角** - 满足不同角色需求
- 🎨 **现代化UI** - 响应式设计
- 🔄 **热重载** - 开发时自动刷新
- 📱 **移动适配** - 支持移动设备

## 💬 获取帮助

### 问题排查顺序

1. 查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. 检查 [INSTALL_CHECKLIST.md](./INSTALL_CHECKLIST.md)
3. 运行 `./quick-test.sh` 诊断问题
4. 查看终端错误信息
5. 查看浏览器控制台（F12）

### 文档更新

所有文档都随代码更新，确保与当前版本同步。

---

**提示**: 建议从 [WELCOME.md](./WELCOME.md) 开始，5分钟快速上手！
