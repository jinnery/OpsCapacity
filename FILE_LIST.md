# 项目文件清单

本文档列出项目中的所有重要文件及其用途。

## 📄 文档文件（10个）

| 文件名 | 用途 | 推荐阅读顺序 |
|--------|------|--------------|
| **WELCOME.md** | 欢迎指南，5分钟快速入门 | ⭐ 1 |
| **QUICKSTART.md** | 快速启动指南 | ⭐ 2 |
| **README.md** | 项目完整说明 | ⭐ 3 |
| **TROUBLESHOOTING.md** | 故障排除（10+问题） | 遇到问题时 |
| **INSTALL_CHECKLIST.md** | 安装验证清单 | 验证安装时 |
| **DOCS_INDEX.md** | 文档索引导航 | 查找文档时 |
| **DEPLOYMENT.md** | 生产部署指南 | 准备部署时 |
| **PROJECT_SUMMARY.md** | 项目技术总结 | 了解技术时 |
| **SETUP_IMPROVEMENTS.md** | 改进说明 | 了解更新时 |
| **STATUS_REPORT.md** | 项目状态报告 | 了解完成度时 |
| **FILE_LIST.md** | 本文档 | 浏览文件时 |

## 🔨 脚本文件（4个）

| 文件名 | 功能 | 使用频率 |
|--------|------|----------|
| **setup.sh** | 自动安装依赖和配置 | ⭐ 首次必用 |
| **start.sh** | 启动开发服务器（自动清理端口） | ⭐ 每次启动 |
| **quick-test.sh** | 快速测试所有API | ⭐ 验证时用 |
| **test-api.sh** | 详细API测试脚本 | 深度测试时 |

### 使用方法
```bash
# 首次安装
./setup.sh

# 启动服务
./start.sh

# 验证API
./quick-test.sh
```

## ⚙️ 配置文件（6个）

| 文件名 | 用途 | 说明 |
|--------|------|------|
| **package.json** | 根项目依赖配置 | npm脚本和后端依赖 |
| **package-lock.json** | 依赖锁定文件 | 自动生成 |
| **.env.example** | 后端环境配置示例 | 模板文件 |
| **.env** | 后端环境配置 | 开发环境配置 |
| **.gitignore** | Git忽略规则 | 版本控制配置 |
| **client/.env.example** | 前端环境配置示例 | 模板文件 |
| **client/.env** | 前端环境配置 | 前端API地址 |

### 环境变量说明

**后端 (.env)**
```env
NODE_ENV=development          # 运行环境
PORT=3001                     # API端口
# 数据库配置（可选）
```

**前端 (client/.env)**
```env
REACT_APP_API_URL=http://localhost:3001
```

## 🖥️ 后端代码（server/）

### 核心文件

```
server/
├── index.js                    # 服务器入口（Express配置）
├── routes/
│   └── capacity.js             # 容量相关API路由
├── controllers/
│   └── capacityController.js   # 业务逻辑控制器
└── config/
    └── database.js             # 数据库配置（可选）
```

### 关键功能

**server/index.js**
- Express服务器配置
- CORS中间件
- 路由注册
- 静态文件服务（生产环境）

**server/routes/capacity.js**
- 5个API端点路由定义
- RESTful风格

**server/controllers/capacityController.js**
- 模拟数据定义
- 5个控制器函数
- 优先级计算逻辑
- 扩容方案生成
- 业务影响评估

**server/config/database.js**
- MySQL连接池配置
- 数据库查询函数（可选）

## 🎨 前端代码（client/）

### 目录结构

```
client/
├── public/                     # 静态资源
│   ├── index.html              # HTML模板
│   └── ...                     # 其他静态资源
├── src/
│   ├── App.tsx                 # 应用入口，路由配置
│   ├── components/             # React组件
│   │   ├── CTODashboard.tsx           # CTO视角
│   │   ├── CEODashboard.tsx           # CEO视角
│   │   ├── OpsDirectorDashboard.tsx   # 运维总监
│   │   ├── OpsEngineerDashboard.tsx   # 运维工程师
│   │   ├── PriorityBadge.tsx          # 优先级标签
│   │   └── CapacityIndicator.tsx      # 容量指示器
│   └── services/
│       └── api.ts              # API封装
├── package.json                # 前端依赖配置
└── tsconfig.json              # TypeScript配置
```

### 组件说明

**CTODashboard.tsx** (CTO视角)
- 技术扩容方案
- 工作量评估
- 卡片式布局

**CEODashboard.tsx** (CEO视角)
- 业务影响分析
- 风险等级评估
- 决策建议

**OpsDirectorDashboard.tsx** (运维总监)
- 全局容量规划
- 表格式展示
- 周计划分组

**OpsEngineerDashboard.tsx** (运维工程师)
- 详细执行步骤
- 验证方法
- 风险提示

**PriorityBadge.tsx**
- 优先级标签组件
- 颜色编码（P1-P4）
- 可复用

**CapacityIndicator.tsx**
- 容量指示器组件
- 使用率可视化
- 可复用

**services/api.ts**
- Axios封装
- API端点定义
- 统一错误处理

## 💾 数据库文件（database/）

```
database/
└── schema.sql                  # MySQL数据库结构
```

**说明**: 
- 定义 `metrics_daily` 表结构
- **可选** - 系统可使用模拟数据运行
- 如需真实数据，导入此文件

## 📦 自动生成文件

### 不需要手动编辑的文件

- `package-lock.json` - npm依赖锁定
- `client/package-lock.json` - 前端依赖锁定
- `node_modules/` - 后端依赖包
- `client/node_modules/` - 前端依赖包
- `client/build/` - 前端构建输出
- `server.log` - 服务器日志（运行时生成）

## 📊 文件统计

### 总计
- 📄 文档文件: 11个
- 🔨 脚本文件: 4个
- ⚙️ 配置文件: 7个
- 💻 源代码文件: 10+个
- 📦 依赖包: 1400+个（node_modules）

### 核心文件（必读）
1. WELCOME.md - 欢迎指南
2. setup.sh - 安装脚本
3. start.sh - 启动脚本
4. server/index.js - 后端入口
5. client/src/App.tsx - 前端入口

### 配置文件（首次必配）
1. .env - 后端环境
2. client/.env - 前端环境

### 业务逻辑文件（核心代码）
1. server/controllers/capacityController.js - 后端业务逻辑
2. client/src/components/*.tsx - 前端组件

## 🔍 快速查找

### 想修改API端点？
→ `server/routes/capacity.js`

### 想修改业务逻辑？
→ `server/controllers/capacityController.js`

### 想修改页面样式？
→ `client/src/components/*.tsx`

### 想修改API地址？
→ `client/.env` 和 `client/src/services/api.ts`

### 想添加新功能？
1. 后端: 添加控制器函数和路由
2. 前端: 添加组件和API调用

## 📝 文件命名规范

### 文档文件
- 全大写 + 下划线: `README.md`, `SETUP_IMPROVEMENTS.md`
- 便于识别，区别于代码文件

### 脚本文件
- 小写 + 连字符 + `.sh`: `setup.sh`, `quick-test.sh`
- Linux/Unix标准命名

### 代码文件
- **后端**: 小写 + 驼峰: `capacityController.js`
- **前端**: 帕斯卡命名: `CTODashboard.tsx`
- TypeScript标准命名

### 配置文件
- 点开头: `.env`, `.gitignore`
- 标准配置文件命名

## 🎯 使用建议

### 新手入门
1. 阅读 `WELCOME.md`
2. 运行 `./setup.sh`
3. 运行 `./start.sh`
4. 查看 `README.md` 了解功能

### 开发者
1. 查看 `PROJECT_SUMMARY.md` 了解架构
2. 阅读核心代码文件
3. 修改和扩展功能
4. 参考 `DEPLOYMENT.md` 部署

### 运维人员
1. 阅读 `DEPLOYMENT.md`
2. 配置环境变量
3. 部署到服务器
4. 参考 `TROUBLESHOOTING.md` 排错

---

**提示**: 所有文档文件都可以直接用文本编辑器或 `cat` 命令查看。

```bash
# 查看任意文档
cat WELCOME.md
cat README.md
cat TROUBLESHOOTING.md
```
