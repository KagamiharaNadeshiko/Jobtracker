#!/bin/bash

# 脚本功能: 准备Atlas App Services部署配置
# 使用方法: ./prepare_deployment.sh <REALM_APP_ID>

APP_ID=$1

if [ -z "$APP_ID" ]; then
    echo "错误: 未提供App ID参数"
    echo "使用方法: ./prepare_deployment.sh <REALM_APP_ID>"
    exit 1
fi

echo "开始准备部署配置，App ID: $APP_ID"

# 更新auth配置中的URL
sed -i "s/\$REALM_APP_ID/$APP_ID/g" auth/providers.json
echo "已更新身份验证提供者URL配置"

# 更新realm_config.json中的应用ID
sed -i "s/\"app_id\": \"jobtracing-app\"/\"app_id\": \"$APP_ID\"/g" realm_config.json
sed -i "s/\"name\": \"jobtracing-app\"/\"name\": \"$APP_ID\"/g" realm_config.json
echo "已更新Realm配置"

# 创建必要的目录
mkdir -p hosting/build
mkdir -p functions
mkdir -p http_endpoints

echo "配置准备完成，可以进行部署" 