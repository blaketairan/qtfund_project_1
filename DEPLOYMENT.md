# QTFund 前端部署指南

## 服务管理脚本

项目已配置完整的服务管理脚本，位于 `bin/` 目录。

### 脚本列表

| 脚本 | 功能 | 使用方法 |
|------|------|----------|
| `start.sh` | 启动服务 | `bash bin/start.sh` |
| `stop.sh` | 停止服务 | `bash bin/stop.sh` |
| `health.sh` | 健康检查 | `bash bin/health.sh` |
| `restart.sh` | 重启服务 | `bash bin/restart.sh` |

## 快速部署

### 1. 拉取最新代码

```bash
cd workspace/qtfund_project_1
git pull origin main
```

### 2. 安装依赖（首次或依赖更新时）

```bash
npm install
```

### 3. 停止旧服务

```bash
bash bin/stop.sh
```

### 4. 启动服务

```bash
bash bin/start.sh
```

### 5. 检查状态

```bash
bash bin/health.sh
```

## 服务信息

- **端口**: 3000
- **访问地址**: http://118.25.145.113:3000
- **日志文件**: `logs/frontend.log`
- **PID 文件**: `bin/frontend.pid`

## 常用命令

### 查看实时日志

```bash
tail -f logs/frontend.log
```

### 检查服务状态

```bash
bash bin/health.sh
```

### 重启服务

```bash
bash bin/restart.sh
```

### 查看进程

```bash
ps aux | grep webpack
```

### 检查端口占用

```bash
lsof -i:3000
```

## 最近部署记录

### 2025-10-24 01:18

✅ **部署成功**

**变更内容**：
- 从原生 JS 升级到 React 18 企业级架构
- 添加服务管理脚本（start/stop/health/restart）
- 新增 9 个可复用组件
- 新增 6 个功能页面
- 完整的 API 服务层
- 4 个数据模型

**部署步骤**：
1. 拉取最新代码 ✓
2. 安装新依赖 (391 packages) ✓
3. 停止旧服务 ✓
4. 启动新服务 ✓
5. 健康检查通过 ✓

**服务状态**：
- Status: ✓ HEALTHY
- PID: 3262251
- CPU: 11.7%
- Memory: 1.4%
- HTTP: 200 OK

## 服务监控

### 健康检查脚本

`health.sh` 提供完整的健康检查：

- ✓ 进程状态检查
- ✓ 端口占用检查
- ✓ HTTP 响应检查
- ✓ CPU/内存监控
- ✓ 日志查看

**退出码**：
- 0: 服务健康
- 1: 服务异常

### 定时监控

可以设置 crontab 进行定时健康检查：

```bash
*/5 * * * * cd /data/terrell/workspace/qtfund_project_1 && bash bin/health.sh >> logs/health-monitor.log 2>&1
```

## 故障排查

### 服务无法启动

1. 检查端口是否被占用
```bash
lsof -i:3000
```

2. 查看错误日志
```bash
tail -50 logs/frontend.log
```

3. 停止所有相关进程
```bash
bash bin/stop.sh
```

### 服务运行但无响应

1. 检查服务状态
```bash
bash bin/health.sh
```

2. 重启服务
```bash
bash bin/restart.sh
```

### 内存/CPU 占用过高

1. 查看资源使用
```bash
bash bin/health.sh
```

2. 考虑构建生产版本
```bash
npm run build
# 然后使用 nginx 提供静态文件
```

## 生产环境建议

### 1. 使用生产构建

开发服务器不适合生产环境，建议：

```bash
# 构建生产版本
npm run build

# 使用 nginx 提供静态文件
# 参考 nginx 配置示例
```

### 2. Nginx 配置示例

```nginx
server {
    listen 80;
    server_name qtfund.example.com;
    
    root /data/terrell/workspace/qtfund_project_1/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. 进程管理

使用 PM2 或 systemd 进行进程管理：

```bash
# PM2 示例
pm2 start npm --name "qtfund-frontend" -- start
pm2 save
pm2 startup
```

### 4. 日志管理

配置日志轮转：

```bash
# /etc/logrotate.d/qtfund
/data/terrell/workspace/qtfund_project_1/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 terrell terrell
}
```

## 回滚策略

如果新版本有问题，可以快速回滚：

```bash
# 1. 停止服务
bash bin/stop.sh

# 2. 回滚代码
git log --oneline -5  # 查看最近提交
git reset --hard <commit-id>  # 回滚到指定版本

# 3. 重新安装依赖
npm install

# 4. 启动服务
bash bin/start.sh
```

## 安全建议

1. **防火墙配置** - 只开放必要端口
2. **SSL/TLS** - 使用 HTTPS
3. **访问控制** - 限制管理接口访问
4. **定期更新** - 及时更新依赖包
5. **日志审计** - 定期检查日志

## 性能优化

1. **启用 gzip 压缩** - Nginx 配置
2. **CDN 加速** - 静态资源使用 CDN
3. **缓存策略** - 合理的缓存配置
4. **代码分割** - 使用路由级懒加载
5. **资源优化** - 压缩图片、字体等

## 维护计划

### 日常维护
- ✓ 每日健康检查
- ✓ 监控日志大小
- ✓ 检查磁盘空间

### 每周维护
- ✓ 清理旧日志
- ✓ 检查依赖更新
- ✓ 性能分析

### 每月维护
- ✓ 安全更新
- ✓ 备份配置
- ✓ 性能优化评估

## 联系方式

如有问题，请联系开发团队。

---

最后更新: 2025-10-24

