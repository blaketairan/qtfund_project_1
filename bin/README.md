# Frontend Service Management Scripts

这个目录包含用于管理 QTFund 前端服务的脚本。

## 脚本说明

### start.sh
启动前端开发服务器

**功能**：
- 检查端口是否被占用
- 检查是否已有服务运行
- 在后台启动 webpack-dev-server
- 记录 PID 到文件
- 输出日志到 logs/frontend.log

**使用**：
```bash
bash bin/start.sh
```

### stop.sh
停止前端服务

**功能**：
- 读取 PID 文件停止进程
- 清理占用 3000 端口的进程
- 清理所有相关的 webpack 和 npm 进程
- 删除 PID 文件

**使用**：
```bash
bash bin/stop.sh
```

### health.sh
健康检查

**功能**：
- 检查进程状态
- 检查端口占用
- HTTP 健康检查（如果有 curl）
- 显示 CPU、内存使用
- 显示最近日志

**使用**：
```bash
bash bin/health.sh
```

**退出码**：
- 0: 服务健康
- 1: 服务异常或未运行

### restart.sh
重启服务

**功能**：
- 先停止服务
- 等待 3 秒
- 重新启动服务

**使用**：
```bash
bash bin/restart.sh
```

## 快速开始

### 1. 赋予执行权限

```bash
chmod +x bin/*.sh
```

### 2. 启动服务

```bash
./bin/start.sh
```

### 3. 检查状态

```bash
./bin/health.sh
```

### 4. 查看日志

```bash
tail -f logs/frontend.log
```

### 5. 停止服务

```bash
./bin/stop.sh
```

## 文件说明

### 生成的文件

- `bin/frontend.pid` - 存储服务的进程 ID
- `logs/frontend.log` - 服务运行日志

### 端口配置

默认端口: `3000`

如需修改端口，需要同时修改：
1. `bin/start.sh` 中的 `PORT` 变量
2. `bin/stop.sh` 中的 `PORT` 变量
3. `bin/health.sh` 中的 `PORT` 变量
4. `webpack.config.js` 中的端口配置

## 系统要求

- Linux 操作系统
- Node.js 已安装
- npm 已安装
- bash shell
- lsof 命令（用于端口检查）
- curl 命令（可选，用于 HTTP 健康检查）

## 常见问题

### Q: 端口被占用无法启动？

**A:** 运行 `stop.sh` 会自动清理占用的端口

### Q: 服务启动失败？

**A:** 检查日志文件 `logs/frontend.log`

### Q: 如何在系统启动时自动运行？

**A:** 可以创建 systemd 服务或添加到 crontab：

```bash
@reboot cd /path/to/qtfund_project_1 && bash bin/start.sh
```

### Q: 如何设置定时健康检查？

**A:** 添加到 crontab：

```bash
*/5 * * * * cd /path/to/qtfund_project_1 && bash bin/health.sh >> logs/health.log 2>&1
```

## 生产环境建议

1. **使用 PM2 或 systemd** 进行进程管理
2. **配置日志轮转** 防止日志文件过大
3. **设置监控告警** 通过健康检查脚本
4. **使用 nginx 反向代理** 而不是直接暴露开发服务器
5. **构建生产版本** 使用 `npm run build` 并通过 nginx 提供静态文件

## 示例：systemd 服务配置

```ini
[Unit]
Description=QTFund Frontend Service
After=network.target

[Service]
Type=forking
User=terrell
WorkingDirectory=/path/to/qtfund_project_1
ExecStart=/bin/bash /path/to/qtfund_project_1/bin/start.sh
ExecStop=/bin/bash /path/to/qtfund_project_1/bin/stop.sh
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## 许可证

ISC

