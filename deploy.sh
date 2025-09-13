#!/bin/bash

# 贪吃蛇游戏部署脚本
# 目标: https://mygentool.com/snakegame

echo "🐍 开始部署贪吃蛇游戏到 MyGenTool.com..."

# 检查Git状态
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 发现未提交的更改，正在提交..."
    git add .
    git commit -m "Deploy: Update snake game for MyGenTool.com"
fi

# 推送到远程仓库
echo "🚀 推送到远程仓库..."
git push origin main

# 如果使用GitHub Pages
if [ -f "CNAME" ]; then
    echo "🌐 配置自定义域名: $(cat CNAME)"
    echo "✅ 请确保在DNS中配置CNAME记录指向: yourusername.github.io"
fi

echo "🎉 部署完成！"
echo "📍 访问地址: https://mygentool.com/snakegame"
echo "🔧 如果使用GitHub Pages，请等待几分钟让更改生效"
