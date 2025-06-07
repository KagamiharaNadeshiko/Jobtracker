# 求职跟踪系统 (Job Tracking System)

一个功能完善的求职跟踪系统，用于记录和管理求职过程中的各种信息，包括行业分类、公司信息、职位申请、申请文书、网测记录和面试情况。

## 功能特点

### 数据管理
- 行业分类管理
- 公司信息管理（按行业分类）
- 职位申请跟踪
- 申请文书管理
- 网测记录
- 面试记录

### 用户界面
- 仪表盘：展示申请统计和最近更新的职位
- 行业管理：创建和管理不同的行业分类
- 公司列表：按行业归类的公司信息
- 职位申请：跟踪所有职位申请的状态
- 职位详情：管理每个职位的文书、网测和面试

## 技术栈

### 前端
- React
- TypeScript
- React Router DOM
- Chakra UI
- React Icons
- Axios

### 后端
- Node.js
- Express
- MongoDB
- Mongoose

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
```

5. 运行开发环境
```bash
npm run dev
```
这将同时启动后端服务器(端口5000)和前端开发服务器(端口3000)

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
├── client/                 # React前端
│   ├── public/             # 静态文件
│   └── src/                # 源代码
│       ├── components/     # 组件
│       ├── pages/          # 页面组件
│       └── services/       # API服务
├── server/                 # Express后端
│   ├── config/             # 配置文件
│   ├── controllers/        # 控制器
│   ├── models/             # 数据模型
│   └── routes/             # API路由
└── server.js               # 入口文件
```

## 数据模型

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