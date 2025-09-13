# 🚀 部署到 MyGenTool.com/snakegame

## 目标URL
`https://mygentool.com/snakegame`

## 部署方案

### 方案一：Netlify 部署（推荐）

1. **访问 Netlify**：
   - 打开 [netlify.com](https://netlify.com)
   - 登录您的账户

2. **导入项目**：
   - 点击 "New site from Git"
   - 连接您的 GitHub 仓库
   - 选择 `snakeGame` 仓库

3. **配置构建设置**：
   - Build command: `echo "No build needed"`
   - Publish directory: `.`
   - 点击 "Deploy site"

4. **设置自定义域名**：
   - 进入 Site settings → Domain management
   - 添加自定义域名：`snakegame.mygentool.com`
   - 配置 DNS 记录

### 方案二：Vercel 部署

1. **安装 Vercel CLI**：
   ```bash
   npm i -g vercel
   ```

2. **部署项目**：
   ```bash
   vercel --prod
   ```

3. **配置域名**：
   - 在 Vercel 控制台添加自定义域名
   - 配置 DNS 记录

### 方案三：直接服务器部署

如果您有 MyGenTool.com 的服务器访问权限：

1. **上传文件**：
   ```bash
   # 将项目文件上传到服务器
   scp -r . user@mygentool.com:/var/www/html/snakegame/
   ```

2. **配置 Web 服务器**：
   - 确保 `snakegame` 目录可访问
   - 配置适当的 MIME 类型

## DNS 配置

### 子域名配置
```
Type: CNAME
Name: snakegame
Value: your-deployment-url.netlify.app
```

### 路径配置
如果使用路径部署，确保：
- 服务器支持子目录访问
- 配置正确的重定向规则

## 验证部署

部署完成后，访问以下URL验证：
- `https://mygentool.com/snakegame`
- `https://snakegame.mygentool.com` (如果使用子域名)

## 故障排除

### 常见问题

1. **404 错误**：
   - 检查文件路径是否正确
   - 确认服务器配置

2. **资源加载失败**：
   - 检查相对路径配置
   - 确认 MIME 类型设置

3. **域名解析问题**：
   - 检查 DNS 配置
   - 等待 DNS 传播（最多24小时）

## 自动化部署

使用提供的脚本进行自动化部署：

```bash
./deploy.sh
```

## 监控和维护

- 定期检查游戏功能
- 监控访问统计
- 更新游戏内容
