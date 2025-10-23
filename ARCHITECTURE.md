# QTFund 项目架构文档

## 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                     QTFund Frontend                          │
│                  React 18 + React Router                     │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Pages      │    │  Components  │    │  Services    │
│              │    │              │    │              │
│ - Home       │    │ - Button     │    │ - API Client │
│ - Login      │    │ - Input      │    │ - Auth API   │
│ - Dashboard  │    │ - Card       │    │ - User API   │
│ - Funds      │    │ - Table      │    │ - Fund API   │
│ - Portfolios │    │ - Modal      │    │ - Portfolio  │
│ - Settings   │    │ - Alert      │    │ - Transaction│
│              │    │ - Loading    │    │              │
│              │    │ - Navbar     │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                    ┌──────────────┐
                    │   Layout     │
                    │              │
                    │ - Header     │
                    │ - Content    │
                    │ - Footer     │
                    └──────────────┘
                              │
                              ▼
                    ┌──────────────┐
                    │  AuthContext │
                    │              │
                    │ - User State │
                    │ - Auth Logic │
                    └──────────────┘
```

## 技术栈分层

```
┌───────────────────────────────────────────────────────────┐
│ Presentation Layer (展示层)                                │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ React Components + Tailwind CSS + HeadlessUI         │ │
│ │ - 6 Pages / 9 Components / 1 Layout                  │ │
│ └───────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
                            ▼
┌───────────────────────────────────────────────────────────┐
│ State Management Layer (状态管理层)                        │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ React Context API                                     │ │
│ │ - AuthContext (认证状态)                              │ │
│ │ - useState/useEffect (组件状态)                       │ │
│ └───────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
                            ▼
┌───────────────────────────────────────────────────────────┐
│ Business Logic Layer (业务逻辑层)                          │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ Services & Utils                                      │ │
│ │ - API Client (统一请求处理)                           │ │
│ │ - Auth Context (认证逻辑)                             │ │
│ └───────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
                            ▼
┌───────────────────────────────────────────────────────────┐
│ Data Layer (数据层)                                        │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ Entity Schemas + API Endpoints                        │ │
│ │ - JSON Schema 定义                                    │ │
│ │ - RESTful API 调用                                    │ │
│ └───────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

## 数据流向

```
User Action (用户操作)
      │
      ▼
Component Event Handler (组件事件处理)
      │
      ▼
Service/API Call (服务/API 调用)
      │
      ▼
Backend API (后端 API)
      │
      ▼
Response Processing (响应处理)
      │
      ▼
State Update (状态更新)
      │
      ▼
Component Re-render (组件重渲染)
      │
      ▼
UI Update (界面更新)
```

## 路由架构

```
/ (Root)
│
├─ / (HomePage)
│  └─ 公开访问
│
├─ /login (LoginPage)
│  └─ 公开访问
│
├─ /dashboard (Dashboard)
│  └─ 需要认证 ✓
│
├─ /funds (FundsPage)
│  └─ 需要认证 ✓
│
├─ /portfolios (PortfoliosPage)
│  └─ 需要认证 ✓
│
└─ /settings (SettingsPage)
   └─ 需要认证 ✓
```

## 组件依赖关系

```
App
 │
 ├─ BrowserRouter
 │   │
 │   ├─ AuthProvider (Context)
 │   │   │
 │   │   ├─ Layout
 │   │   │   │
 │   │   │   ├─ Navbar
 │   │   │   │   └─ Menu (HeadlessUI)
 │   │   │   │
 │   │   │   ├─ Outlet (React Router)
 │   │   │   │   │
 │   │   │   │   ├─ HomePage
 │   │   │   │   │   ├─ Card
 │   │   │   │   │   └─ Button
 │   │   │   │   │
 │   │   │   │   ├─ Dashboard (Protected)
 │   │   │   │   │   ├─ Card
 │   │   │   │   │   ├─ Alert
 │   │   │   │   │   └─ Loading
 │   │   │   │   │
 │   │   │   │   ├─ FundsPage (Protected)
 │   │   │   │   │   ├─ Card
 │   │   │   │   │   ├─ Table
 │   │   │   │   │   ├─ Button
 │   │   │   │   │   └─ Modal
 │   │   │   │   │
 │   │   │   │   ├─ PortfoliosPage (Protected)
 │   │   │   │   │   ├─ Card
 │   │   │   │   │   ├─ Button
 │   │   │   │   │   ├─ Modal
 │   │   │   │   │   └─ Input
 │   │   │   │   │
 │   │   │   │   └─ SettingsPage (Protected)
 │   │   │   │       ├─ Card
 │   │   │   │       ├─ Input
 │   │   │   │       ├─ Button
 │   │   │   │       └─ Alert
 │   │   │   │
 │   │   │   └─ Footer
 │   │   │
 │   │   └─ LoginPage
 │   │       ├─ Card
 │   │       ├─ Input
 │   │       ├─ Button
 │   │       └─ Alert
```

## API 服务架构

```
api.js (API Client)
 │
 ├─ handleResponse() - 统一响应处理
 │
 ├─ apiRequest() - 基础请求封装
 │
 ├─ authAPI
 │   ├─ login()
 │   ├─ logout()
 │   └─ checkAuth()
 │
 ├─ userAPI
 │   ├─ getUsers()
 │   ├─ getUser(id)
 │   ├─ createUser()
 │   ├─ updateUser(id)
 │   └─ deleteUser(id)
 │
 ├─ fundAPI
 │   ├─ getFunds()
 │   ├─ getFund(id)
 │   ├─ createFund()
 │   ├─ updateFund(id)
 │   ├─ deleteFund(id)
 │   └─ getFundHistory(id)
 │
 ├─ transactionAPI
 │   ├─ getTransactions()
 │   ├─ getTransaction(id)
 │   ├─ createTransaction()
 │   └─ cancelTransaction(id)
 │
 └─ portfolioAPI
     ├─ getPortfolios()
     ├─ getPortfolio(id)
     ├─ createPortfolio()
     ├─ updatePortfolio(id)
     ├─ deletePortfolio(id)
     └─ getPortfolioPerformance(id)
```

## 认证流程

```
┌─────────────┐
│  用户访问   │
│ 受保护页面  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ ProtectedRoute 检查 │
│  isAuthenticated?   │
└─────────┬───────────┘
          │
    ┌─────┴─────┐
    │           │
   YES         NO
    │           │
    ▼           ▼
┌────────┐  ┌──────────────┐
│显示页面│  │重定向到 /login│
└────────┘  └───────┬──────┘
                    │
                    ▼
            ┌──────────────┐
            │  登录表单    │
            └───────┬──────┘
                    │
                    ▼
            ┌──────────────┐
            │ 提交凭据     │
            └───────┬──────┘
                    │
                    ▼
            ┌──────────────┐
            │ API: /login  │
            └───────┬──────┘
                    │
              ┌─────┴─────┐
              │           │
            成功        失败
              │           │
              ▼           ▼
      ┌──────────┐  ┌──────────┐
      │设置 Cookie│  │显示错误  │
      │更新状态   │  └──────────┘
      └─────┬────┘
            │
            ▼
      ┌──────────┐
      │重定向到  │
      │目标页面  │
      └──────────┘
```

## 构建流程

```
Source Files (.jsx, .js, .css)
        │
        ▼
┌─────────────────┐
│ Babel Transform │
│ (JSX → JS)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ PostCSS Process │
│ (Tailwind CSS)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Webpack Bundle  │
│ (Module Pack)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ dist/bundle.js  │
│ + index.html    │
└─────────────────┘
```

## 开发工作流

```
1. 编写代码
   ├─ src/pages/*.jsx (页面)
   ├─ src/components/*.jsx (组件)
   └─ src/styles/*.css (样式)
        │
        ▼
2. Webpack Dev Server
   ├─ 自动编译
   ├─ 热模块替换 (HMR)
   └─ API 代理
        │
        ▼
3. 浏览器预览
   ├─ http://localhost:3000
   └─ 实时更新
        │
        ▼
4. 生产构建
   ├─ npm run build
   ├─ 代码压缩
   ├─ Tree Shaking
   └─ dist/ 输出
```

## 性能优化策略

1. **代码分割**
   - 路由级别的懒加载
   - 按需加载组件

2. **缓存策略**
   - 浏览器缓存
   - Service Worker (未来)

3. **资源优化**
   - CSS 压缩
   - JS 压缩和混淆
   - Tree Shaking

4. **渲染优化**
   - React.memo (按需)
   - useMemo/useCallback (按需)
   - 虚拟滚动 (长列表)

## 安全考虑

1. **认证安全**
   - Cookie-based 认证
   - 受保护路由
   - 自动登出机制

2. **XSS 防护**
   - React 自动转义
   - 避免 dangerouslySetInnerHTML

3. **CSRF 防护**
   - Cookie SameSite 属性
   - CSRF Token (后端)

4. **API 安全**
   - HTTPS 传输
   - 错误信息脱敏
   - 速率限制 (后端)

## 可扩展性

项目架构支持以下扩展：

1. ✅ 添加新页面 - pages/ 目录
2. ✅ 添加新组件 - components/ 目录
3. ✅ 添加新 API - services/api.js
4. ✅ 添加新实体 - entities/ 目录
5. ✅ 添加新路由 - src/index.js
6. ✅ 添加新样式 - styles/ 目录
7. ✅ 添加新工具 - utils/ 目录

## 维护指南

### 添加新页面
1. 在 `src/pages/` 创建新组件
2. 在 `src/index.js` 添加路由
3. 如需保护，使用 `<ProtectedRoute>`

### 添加新组件
1. 在 `src/components/` 创建组件
2. 保持组件小而专注
3. 使用 props 传递数据

### 添加新 API
1. 在 `src/services/api.js` 添加方法
2. 遵循现有命名规范
3. 统一错误处理

### 修改样式
1. 优先使用 Tailwind 类
2. 全局样式放 `styles/globals.css`
3. 组件样式内联

## 总结

此架构提供了：
- 🎯 清晰的代码组织
- 🔧 易于维护和扩展
- 🚀 优秀的开发体验
- 📦 模块化的组件系统
- 🔒 安全的认证机制
- 📱 响应式的用户界面
- ⚡ 高性能的构建流程

适合中大型企业级应用开发。

