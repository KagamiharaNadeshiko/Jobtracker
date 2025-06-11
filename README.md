# 求职申请管理系统

一款帮助求职者管理求职申请进度的 Web 应用，支持按行业-公司-职位三级管理投递记录，记录 ES（企业特有简历问答）、网测（在线测评）提交期限、类型、进度，以及维护面试记录及结果。

## 功能特点

- 按行业 → 公司 → 职位的三级层级管理求职申请
- 记录企业特有简历问答（ES）内容
- 跟踪网测信息（截止日期、类型、进度）
- 维护多轮面试记录（面试官、问答要点、结果）
- 响应式设计，支持手机和电脑访问
- 用户认证，确保数据安全

## 技术栈

### 前端
- React
- React Router
- Tailwind CSS
- Axios

### 后端
- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- JWT 认证

### 部署
- Docker
- Docker Compose

## 本地开发环境设置

### 前提条件
- Node.js (v14+)
- PostgreSQL
- Docker 和 Docker Compose (可选，用于容器化部署)

### 安装步骤

1. 克隆仓库：
   ```bash
   git clone https://github.com/yourusername/jobtracing.git
   cd jobtracing
   ```

2. 后端设置：
   ```bash
   cd backend
   npm install
   
   # 创建 .env 文件并设置环境变量
   # 示例：
   # NODE_ENV=development
   # PORT=8000
   # JWT_SECRET=your_jwt_secret
   # DATABASE_URL=postgres://youruser:yourpass@localhost:5432/jobtracker
   
   # 启动开发服务器
   npm run dev
   ```

3. 前端设置：
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. 访问应用：
   - 前端: http://localhost:3000
   - 后端 API: http://localhost:8000

## Docker 部署

使用 Docker Compose 快速部署整个应用：

```bash
docker-compose up -d
```

应用将在以下地址可用：
- 前端: http://localhost:3000
- 后端 API: http://localhost:8000

## API 文档

主要 API 端点：

| 方法   | 路径                             | 描述                      |
|------|--------------------------------|-------------------------|
| GET  | /api/industries                | 获取所有行业                  |
| POST | /api/industries                | 创建新行业                   |
| GET  | /api/industries/:id            | 获取单个行业详情                |
| GET  | /api/industries/:iid/companies | 获取行业下的所有公司              |
| GET  | /api/companies/:id             | 获取公司详情                  |
| POST | /api/companies                 | 创建新公司                   |
| GET  | /api/positions/:id             | 获取职位详情                  |
| POST | /api/positions                 | 创建新职位                   |
| GET  | /api/positions/:pid/interviews | 获取职位的所有面试记录             |
| POST | /api/interviews                | 创建新面试记录                 |

## 贡献指南

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

MIT 