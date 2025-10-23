# QTFund 快速入门指南

## 5 分钟启动项目

### 1️⃣ 安装依赖

```bash
cd /Users/terrell/qt/qtfund_project_1
npm install
```

### 2️⃣ 启动开发服务器

```bash
npm run dev
```

### 3️⃣ 打开浏览器

访问: `http://localhost:3000`

### 4️⃣ 登录系统

使用默认凭据：
- 用户名: `admin`
- 密码: `admin123`

## 项目命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（端口 3000） |
| `npm start` | 启动开发服务器（同上） |
| `npm run build` | 生产环境构建 |

## 页面访问

| 路径 | 说明 | 需要登录 |
|------|------|---------|
| `/` | 首页 | ❌ |
| `/login` | 登录页 | ❌ |
| `/dashboard` | 仪表盘 | ✅ |
| `/funds` | 基金列表 | ✅ |
| `/portfolios` | 投资组合 | ✅ |
| `/settings` | 设置页面 | ✅ |

## 主要功能

### 🏠 首页
- 功能特性展示
- 快速导航按钮

### 🔐 登录
- 用户认证
- 自动重定向
- 错误提示

### 📊 仪表盘
- 投资概览
- 收益统计
- 最近活动
- 热门基金

### 💰 基金管理
- 基金列表
- 实时搜索
- 详细信息
- 投资操作

### 📁 投资组合
- 多组合管理
- 持仓查看
- 收益计算
- 创建新组合

### ⚙️ 设置
- 个人资料
- 安全设置
- 通知偏好
- 语言/货币

## 开发建议

### 推荐的开发工具

1. **VS Code** + 扩展:
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - Prettier - Code formatter
   - ESLint

2. **浏览器扩展**:
   - React Developer Tools
   - Redux DevTools (未来使用)

### 代码规范

```javascript
import { useState } from 'react';
import Button from '../components/Button';

const MyComponent = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div className="p-4">
      <Button onClick={handleClick}>
        Count: {count}
      </Button>
    </div>
  );
};

export default MyComponent;
```

### 创建新页面

```bash
# 1. 创建页面组件
touch src/pages/NewPage.jsx

# 2. 编写组件
# src/pages/NewPage.jsx

# 3. 在 src/index.js 添加路由
<Route path="new-page" element={<NewPage />} />
```

### 创建新组件

```bash
# 1. 创建组件文件
touch src/components/NewComponent.jsx

# 2. 使用组件
import NewComponent from '../components/NewComponent';
```

### API 调用示例

```javascript
import { fundAPI } from '../services/api';

const fetchFunds = async () => {
  const funds = await fundAPI.getFunds();
  console.log(funds);
};
```

## 常见问题

### Q: 端口 3000 被占用？

**A:** 修改 `webpack.config.js` 中的端口：

```javascript
devServer: {
  port: 3001, // 改为其他端口
}
```

### Q: 如何连接真实后端？

**A:** 修改 `webpack.config.js` 代理配置：

```javascript
proxy: {
  '/api': {
    target: 'http://your-backend-url:8000',
    changeOrigin: true,
  }
}
```

### Q: 如何添加环境变量？

**A:** 创建 `.env` 文件：

```bash
REACT_APP_API_URL=http://localhost:8000
```

### Q: 样式不生效？

**A:** 确保导入了 `globals.css`：

```javascript
import './styles/globals.css';
```

### Q: 组件不更新？

**A:** 检查：
1. 状态更新是否正确
2. 是否需要添加依赖项到 useEffect
3. 控制台是否有错误

## 项目结构速查

```
src/
├── components/      # UI 组件
├── entities/        # 数据模型
├── pages/          # 页面
├── services/       # API
├── styles/         # 样式
├── utils/          # 工具
├── Layout.jsx      # 布局
└── index.js        # 入口
```

## 技术栈速查

- **React 18** - UI 框架
- **React Router 6** - 路由
- **Tailwind CSS** - 样式
- **HeadlessUI** - UI 组件
- **Lucide React** - 图标
- **Webpack 5** - 构建工具

## 下一步

1. ✅ 浏览项目文件结构
2. ✅ 运行开发服务器
3. ✅ 探索各个页面
4. ✅ 查看组件代码
5. ✅ 尝试修改样式
6. ✅ 添加新功能
7. ✅ 连接真实 API

## 学习资源

- [React 官方文档](https://react.dev)
- [React Router 文档](https://reactrouter.com)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [HeadlessUI 文档](https://headlessui.com)

## 获取帮助

查看详细文档：
- `README.md` - 项目说明
- `ARCHITECTURE.md` - 架构设计
- `UPGRADE_SUMMARY.md` - 升级说明

祝你开发愉快！🚀

