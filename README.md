# 求职跟踪系统 (Job Tracking System)

一个功能完善的求职跟踪系统，用于记录和管理求职过程中的各种信息，包括行业分类、公司信息、职位申请、申请文书、网测记录和面试情况。

## 功能特点

### 用户与认证
- 用户注册和登录系统
- JWT认证保护API路由
- 基于角色的访问控制
- 个人资料管理

### 数据管理
- 行业分类管理
- 公司信息管理（按行业分类）
- 职位申请跟踪
- 申请文书管理
- 网测记录
- 面试记录
- 简历和文件上传（支持最大50MB的文件）

### 数据可视化
- 仪表盘：申请状态分布饼图
- 月度申请活动统计图表
- 实时进度与数据统计

### 用户界面
- 响应式布局适配各种设备
- 仪表盘：展示申请统计和最近更新的职位
- 行业管理：创建和管理不同的行业分类
- 公司列表：按行业归类的公司信息
- 职位申请：跟踪所有职位申请的状态
- 职位详情：管理每个职位的文书、网测和面试

## 技术栈

### 前端
- React 18
- TypeScript
- React Router DOM 6
- Chakra UI
- React Icons
- Recharts (数据可视化)
- Axios

> **注意**: 本项目最初使用 create-react-app 构建，但该工具已被React团队标记为弃用。对于新项目，建议考虑使用以下现代替代方案:
> - Next.js (https://nextjs.org/)
> - Vite (https://vitejs.dev/)
> - Remix (https://remix.run/)
> - 更多推荐框架请参考: https://react.dev/

### 后端
- Node.js
- Express
- MongoDB
- Mongoose
- JWT认证
- bcryptjs (密码加密)
- Multer (文件上传)

## 安装步骤

### 前提条件
- Node.js (版本 14.0.0 或更高)
- MongoDB

### 安装过程

1. 克隆仓库
```bash
git clone <repository-url>
cd jobtracking
```

2. 安装服务器依赖
```bash
npm install
```

3. 安装客户端依赖
```bash
npm run install-client
```

4. 配置环境变量
创建 `.env` 文件并添加以下内容:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobtracking
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

5. 创建上传目录
```bash
mkdir -p public/uploads
```

6. 运行开发环境
```bash
npm run dev
```
这将同时启动后端服务器(端口5000)和前端开发服务器(端口3000)

## 测试

运行单元测试:
```bash
npm test
```

## 部署

### 部署到Heroku
```bash
heroku create
git push heroku main
```

### 自定义部署
1. 构建前端
```bash
npm run build
```

2. 启动生产服务器
```bash
npm start
```

## 项目结构
```
jobtracking/
├── __tests__/              # 测试文件
├── client/                 # React前端
│   ├── public/             # 静态文件
│   └── src/                # 源代码
│       ├── components/     # 组件
│       │   ├── charts/     # 图表组件
│       │   └── Layout/     # 布局组件
│       ├── context/        # Context API
│       ├── pages/          # 页面组件
│       └── services/       # API服务
├── public/                 # 公共静态文件
│   ├── uploads/            # 上传文件存储
│   ├── css/                # CSS文件
│   ├── js/                 # JavaScript文件
│   └── images/             # 图片文件
├── server/                 # Express后端
│   ├── config/             # 配置文件
│   ├── controllers/        # 控制器
│   ├── middleware/         # 中间件
│   ├── models/             # 数据模型
│   └── routes/             # API路由
└── server.js               # 入口文件
```

## 数据模型

### User (用户)
- username: 用户名
- email: 邮箱
- password: 密码(加密存储)
- avatar: 头像(可选)

### Industry (行业)
- name: 行业名称
- description: 行业描述

### Company (公司)
- name: 公司名称
- industry: 所属行业
- description: 公司描述
- location: 公司地点
- website: 公司网站(可选)

### Position (职位)
- title: 职位名称
- company: 所属公司
- description: 职位描述
- location: 工作地点
- deadline: 申请截止日期(可选)
- status: 申请状态
- resume: 简历文件路径
- attachments: 附件列表

### Essay (申请文书)
- position: 关联职位
- title: 文书标题
- content: 文书内容
- wordCount: 字数统计
- notes: 备注(可选)

### OnlineTest (网测)
- position: 关联职位
- testType: 测试类型
- platform: 测试平台
- date: 测试日期
- duration: 测试时长(分钟)
- content: 测试内容(可选)
- score: 测试成绩(可选)
- notes: 备注(可选)

### Interview (面试)
- position: 关联职位
- round: 面试轮次
- type: 面试类型
- date: 面试日期
- duration: 面试时长(分钟)
- interviewers: 面试官(可选)
- questions: 面试问题(可选)
- notes: 备注(可选)
- result: 面试结果 

## API路由

### 认证
- POST /api/auth/register - 注册用户
- POST /api/auth/login - 用户登录
- GET /api/auth/logout - 退出登录
- GET /api/auth/me - 获取当前用户信息
- PUT /api/auth/updatepassword - 更新密码

### 文件上传
- POST /api/upload - 上传通用文件 (最大50MB)
- POST /api/upload/resume/:positionId - 上传简历到特定职位 (最大50MB)
- DELETE /api/upload/:filename - 删除文件

### 行业
- GET /api/industries - 获取所有行业
- POST /api/industries - 创建行业
- GET /api/industries/:id - 获取单个行业
- PUT /api/industries/:id - 更新行业
- DELETE /api/industries/:id - 删除行业

### 公司
- GET /api/companies - 获取所有公司
- POST /api/companies - 创建公司
- GET /api/companies/:id - 获取单个公司
- PUT /api/companies/:id - 更新公司
- DELETE /api/companies/:id - 删除公司
- GET /api/companies/industry/:id - 按行业获取公司

### 职位
- GET /api/positions - 获取所有职位
- POST /api/positions - 创建职位
- GET /api/positions/:id - 获取单个职位
- PUT /api/positions/:id - 更新职位
- DELETE /api/positions/:id - 删除职位
- GET /api/positions/company/:id - 按公司获取职位 