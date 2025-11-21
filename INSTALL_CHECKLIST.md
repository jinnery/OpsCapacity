# 安装验证清单

使用本清单确保系统已正确安装和配置。

## ✅ 安装前检查

### 系统要求
- [ ] Node.js 版本 >= 16.0
  ```bash
  node --version
  # 应显示 v16.x.x 或更高
  ```

- [ ] npm 已安装
  ```bash
  npm --version
  # 应显示版本号
  ```

- [ ] 端口 3000 和 3001 未被占用
  ```bash
  lsof -i:3000
  lsof -i:3001
  # 应无输出或可以清理
  ```

## 📦 安装步骤验证

### 1. 克隆/获取代码
- [ ] 代码已下载到本地
- [ ] 进入项目目录
  ```bash
  cd capacity-multirole-diagnosis-report
  pwd
  ```

### 2. 后端依赖安装
- [ ] 运行 `npm install`
- [ ] `node_modules` 目录已创建
- [ ] 无错误信息（警告可忽略）
  ```bash
  ls -d node_modules
  # 应显示: node_modules
  ```

### 3. 前端依赖安装
- [ ] 进入 `client` 目录
- [ ] 运行 `npm install`
- [ ] `client/node_modules` 目录已创建
  ```bash
  ls -d client/node_modules
  # 应显示: client/node_modules
  ```

### 4. 环境配置
- [ ] `.env` 文件已创建（根目录）
  ```bash
  cat .env
  # 应显示配置内容
  ```

- [ ] `client/.env` 文件已创建
  ```bash
  cat client/.env
  # 应显示: REACT_APP_API_URL=http://localhost:3001
  ```

## 🚀 启动验证

### 后端服务
- [ ] 运行 `npm run server`
- [ ] 终端显示 "Server is running on port 3001"
- [ ] 无错误信息

### 后端API测试
- [ ] CTO Dashboard API
  ```bash
  curl http://localhost:3001/api/capacity/cto-dashboard
  # 应返回JSON数据
  ```

- [ ] CEO Dashboard API
  ```bash
  curl http://localhost:3001/api/capacity/ceo-dashboard
  # 应返回JSON数据
  ```

- [ ] 运维总监 API
  ```bash
  curl http://localhost:3001/api/capacity/ops-director-dashboard
  # 应返回JSON数据
  ```

- [ ] 运维工程师 API
  ```bash
  curl http://localhost:3001/api/capacity/ops-engineer-dashboard
  # 应返回JSON数据
  ```

- [ ] 组件详情 API
  ```bash
  curl http://localhost:3001/api/capacity/component/1
  # 应返回JSON数据
  ```

### 前端服务（新终端窗口）
- [ ] 运行 `npm run client`（或在新终端）
- [ ] 编译成功，无错误
- [ ] 浏览器自动打开或手动访问 http://localhost:3000

### 前端界面验证
- [ ] 页面正常加载，无空白
- [ ] 导航栏显示正常（CTO、CEO、运维总监、运维工程师）
- [ ] 可以切换不同视角
- [ ] 数据正常显示（卡片或表格）
- [ ] 无控制台错误（F12查看）

## 🧪 功能测试

### CTO Dashboard
- [ ] 显示组件列表（卡片形式）
- [ ] 每个卡片显示：
  - 组件名称
  - 当前使用率（P95/P99）
  - 预测饱和日期
  - 优先级标签（P1/P2/P3/P4）
  - 扩容方案
  - 工作量评估

### CEO Dashboard
- [ ] 显示组件列表（卡片形式）
- [ ] 每个卡片显示：
  - 组件名称
  - 业务影响
  - 用户影响
  - 风险等级（Critical/High/Medium）
  - 截止日期
  - 决策建议

### 运维总监 Dashboard
- [ ] 显示全局统计信息
- [ ] 显示按饱和时间排序的表格
- [ ] 每行显示：
  - 组件名称
  - 优先级
  - 饱和天数
  - 饱和日期
  - 工作量
  - 所需资源
  - 完成周

### 运维工程师 Dashboard
- [ ] 显示组件列表（可展开卡片）
- [ ] 每个卡片显示：
  - 组件名称
  - 优先级
  - 当前状态（P95/P99使用率）
  - 扩容步骤（可展开）
  - 预期效果
  - 验证方法
  - 潜在风险

## 🎨 样式验证

- [ ] 页面布局美观，无明显错位
- [ ] 优先级标签颜色正确：
  - P1: 红色
  - P2: 橙色  
  - P3: 蓝色
  - P4: 绿色
- [ ] 响应式设计正常（调整浏览器窗口大小）
- [ ] 字体清晰可读
- [ ] 按钮和链接可交互

## 🔄 集成测试

### 同时启动前后端
- [ ] 停止之前的服务（Ctrl+C）
- [ ] 运行 `npm run dev`
- [ ] 前后端同时启动
- [ ] 两个服务都正常运行

### 快速测试脚本
- [ ] 运行 `./quick-test.sh`
- [ ] 所有5个API端点返回 ✅ 200 OK
- [ ] 示例数据正确显示

## 🐛 问题排查

如果任何步骤失败：

### 端口占用
```bash
# 清理端口
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### 依赖问题
```bash
# 完全重新安装
rm -rf node_modules client/node_modules
rm package-lock.json client/package-lock.json
npm install
cd client && npm install && cd ..
```

### 查看详细错误
```bash
# 后端
npm run server
# 查看终端输出

# 前端
npm run client
# 查看终端输出和浏览器控制台（F12）
```

## ✅ 验证完成

如果以上所有项目都打勾✅，恭喜！系统已成功安装并可以正常使用。

### 下一步

- 📖 阅读 [README.md](./README.md) 了解更多功能
- 🚀 阅读 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解生产部署
- 🔧 查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) 解决问题
- 📊 开始使用系统分析容量扩容需求

## 📝 备注

- 系统默认使用模拟数据，无需配置数据库
- 如需连接真实数据库，参考 [DEPLOYMENT.md](./DEPLOYMENT.md)
- 所有测试应在开发环境进行
- 生产部署前请仔细阅读部署文档
