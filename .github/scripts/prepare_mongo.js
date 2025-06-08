/**
 * MongoDB连接准备脚本
 * 用于在GitHub Actions中或在没有环境变量的情况下准备MongoDB连接
 */

const fs = require('fs');
const { MongoClient } = require('mongodb');

// MongoDB Atlas连接信息
const username = process.env.MONGO_USERNAME || 'testuser';
const password = process.env.MONGO_PASSWORD || 'testpassword';
const clusterName = process.env.CLUSTER_NAME || 'jobtracing-cluster';
const databaseName = process.env.DATABASE_NAME || 'jobtracing';

// 优先使用直接的主机地址而非SRV格式来避免DNS查找问题
async function createMongoDBConnection() {
    try {
        console.log('尝试连接到MongoDB...');

        // 检查是否存在MONGO_URI环境变量
        if (process.env.MONGO_URI) {
            console.log('使用环境变量中的MONGO_URI');
            return process.env.MONGO_URI;
        }

        // 构建直接连接字符串（非SRV格式）
        // 格式: mongodb://username:password@host:port/database
        let connectionString;

        // 检查环境（本地开发或CI环境）
        if (process.env.CI) {
            console.log('在CI环境运行，使用本地MongoDB');
            connectionString = 'mongodb://localhost:27017/jobtracing_test';
        } else if (process.env.ATLAS_CLUSTER_HOST) {
            // 使用Atlas集群主机直接连接（非SRV格式）
            connectionString = `mongodb://${username}:${password}@${process.env.ATLAS_CLUSTER_HOST}/${databaseName}?retryWrites=true&w=majority`;
        } else {
            // 使用标准的Atlas SRV连接字符串
            connectionString = `mongodb+srv://${username}:${password}@${clusterName}.mongodb.net/${databaseName}?retryWrites=true&w=majority`;
        }

        console.log(`连接字符串构建完成 (敏感信息已隐藏): ${connectionString.replace(/\/\/.*:.*@/, '//[username]:[password]@')}`);

        // 测试连接
        const client = new MongoClient(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // 超时时间5秒
        });

        await client.connect();
        console.log('MongoDB连接成功');
        await client.close();

        return connectionString;
    } catch (error) {
        console.error('MongoDB连接错误:', error.message);

        // 如果是DNS查找错误，提供更清晰的错误信息
        if (error.code === 'ENOTFOUND') {
            console.error('无法解析MongoDB服务器地址。如果使用SRV格式，请检查域名是否正确。');
            console.error('尝试使用标准连接格式或本地MongoDB...');

            // 降级为本地连接
            return 'mongodb://localhost:27017/jobtracing_test';
        }

        // 对于其他错误，也返回本地连接字符串作为备选
        console.error('使用本地MongoDB作为备选...');
        return 'mongodb://localhost:27017/jobtracing_test';
    }
}

// 创建环境变量文件
async function updateEnvFile() {
    try {
        const connectionString = await createMongoDBConnection();

        // 读取现有.env文件，如果存在
        let envContent = '';
        try {
            if (fs.existsSync('.env')) {
                envContent = fs.readFileSync('.env', 'utf8');
            }
        } catch (err) {
            console.log('没有找到现有的.env文件，将创建新文件');
        }

        // 更新MONGO_URI
        if (envContent.includes('MONGO_URI=')) {
            // 替换现有的MONGO_URI
            envContent = envContent.replace(/MONGO_URI=.*(\r?\n|$)/g, `MONGO_URI=${connectionString}\n`);
        } else {
            // 添加MONGO_URI
            envContent += `\nMONGO_URI=${connectionString}\n`;
        }

        // 保存更新后的.env文件
        fs.writeFileSync('.env', envContent);
        console.log('.env文件已更新，包含有效的MongoDB连接字符串');

    } catch (error) {
        console.error('更新.env文件时出错:', error.message);
        process.exit(1);
    }
}

// 执行主函数
updateEnvFile().catch(err => {
    console.error('脚本执行失败:', err);
    process.exit(1);
});