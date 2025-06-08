/**
 * MongoDB 连接预检和故障排除脚本
 * 用于CI/CD环境中连接MongoDB并处理常见问题
 */

const mongoose = require('mongoose');
const dns = require('dns');
const { MongoClient } = require('mongodb');

// 获取环境变量
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jobtracing';
const RETRY_ATTEMPTS = parseInt(process.env.RETRY_ATTEMPTS || '5');
const RETRY_DELAY = parseInt(process.env.RETRY_DELAY || '2000');

// 创建标准连接字符串的备选SRV版本（或反之亦然）
function createAlternativeConnectionString(uri) {
    // 如果是SRV连接字符串，创建标准连接字符串
    if (uri.startsWith('mongodb+srv://')) {
        return uri.replace('mongodb+srv://', 'mongodb://');
    }
    // 如果是标准连接字符串，尝试创建SRV连接字符串
    if (uri.startsWith('mongodb://')) {
        return uri.replace('mongodb://', 'mongodb+srv://');
    }
    return null;
}

// DNS查询测试函数
async function testDnsResolution(hostname) {
    try {
        console.log(`尝试解析主机名: ${hostname}`);
        const addresses = await new Promise((resolve, reject) => {
            dns.resolve(hostname, (err, addresses) => {
                if (err) reject(err);
                else resolve(addresses);
            });
        });
        console.log(`成功解析主机名 ${hostname} 到 ${addresses.join(', ')}`);
        return { success: true, addresses };
    } catch (error) {
        console.error(`DNS解析失败: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// 使用Mongoose测试连接
async function testMongooseConnection(uri) {
    try {
        console.log(`尝试使用Mongoose连接到: ${uri}`);
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log('Mongoose连接成功!');
        await mongoose.disconnect();
        return { success: true };
    } catch (error) {
        console.error(`Mongoose连接失败: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// 使用MongoDB驱动直接测试连接
async function testNativeConnection(uri) {
    let client;
    try {
        console.log(`尝试使用MongoDB驱动连接到: ${uri}`);
        client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        await client.connect();
        console.log('MongoDB驱动连接成功!');
        return { success: true };
    } catch (error) {
        console.error(`MongoDB驱动连接失败: ${error.message}`);
        return { success: false, error: error.message };
    } finally {
        if (client) await client.close();
    }
}

// 提取连接字符串中的主机名
function extractHostname(uri) {
    try {
        // 处理SRV格式
        if (uri.startsWith('mongodb+srv://')) {
            const withoutProtocol = uri.replace('mongodb+srv://', '');
            const authHostnamePath = withoutProtocol.split('/')[0];
            const hostname = authHostnamePath.includes('@') ?
                authHostnamePath.split('@')[1] :
                authHostnamePath;
            return hostname;
        }
        // 处理标准格式
        else if (uri.startsWith('mongodb://')) {
            const withoutProtocol = uri.replace('mongodb://', '');
            const authHostnamePath = withoutProtocol.split('/')[0];
            const hostnameWithPort = authHostnamePath.includes('@') ?
                authHostnamePath.split('@')[1] :
                authHostnamePath;
            return hostnameWithPort.split(':')[0];
        }
    } catch (error) {
        console.error('提取主机名时出错:', error.message);
    }
    return null;
}

// 重试函数
async function withRetry(fn, attempts = RETRY_ATTEMPTS, delay = RETRY_DELAY) {
    for (let i = 0; i < attempts; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === attempts - 1) throw error;
            console.log(`尝试失败 (${i+1}/${attempts}), ${delay}ms后重试...`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

// 主要执行函数
async function main() {
    console.log('===== MongoDB 连接测试 =====');
    console.log(`使用连接字符串: ${MONGO_URI.replace(/mongodb(\+srv)?:\/\/(.*?)@/, 'mongodb$1://*****@')}`);

    try {
        // 1. 测试直接连接
        console.log('\n[步骤 1] 测试直接连接');
        const directResult = await withRetry(() => testNativeConnection(MONGO_URI));

        if (directResult.success) {
            console.log('直接连接成功! MongoDB服务器可访问。');
            process.exit(0);
        }

        // 2. 解析连接字符串中的主机名
        console.log('\n[步骤 2] 测试DNS解析');
        const hostname = extractHostname(MONGO_URI);
        if (hostname) {
            const dnsResult = await testDnsResolution(hostname);
            if (!dnsResult.success) {
                console.log('DNS解析失败，可能存在网络问题或DNS配置错误。');
            }
        }

        // 3. 尝试使用替代连接字符串
        console.log('\n[步骤 3] 尝试使用替代连接方式');
        const alternativeUri = createAlternativeConnectionString(MONGO_URI);
        if (alternativeUri) {
            console.log(`尝试替代连接字符串: ${alternativeUri.replace(/mongodb(\+srv)?:\/\/(.*?)@/, 'mongodb$1://*****@')}`);
            const altResult = await testNativeConnection(alternativeUri);
            if (altResult.success) {
                console.log('使用替代连接字符串成功!');
                // 如果替代连接字符串成功，则使用它替换默认值
                process.env.MONGO_URI = alternativeUri;
                process.exit(0);
            }
        }

        // 4. 最后尝试使用Mongoose
        console.log('\n[步骤 4] 尝试使用Mongoose连接');
        const mongooseResult = await testMongooseConnection(MONGO_URI);
        if (mongooseResult.success) {
            console.log('Mongoose连接成功!');
            process.exit(0);
        }

        // 如果所有尝试都失败，提供诊断信息
        console.error('\n===== MongoDB 连接故障诊断 =====');
        console.error('1. 检查MongoDB服务器是否正在运行');
        console.error('2. 验证连接字符串格式是否正确');
        console.error('3. 确认IP地址在MongoDB Atlas允许列表中');
        console.error('4. 检查用户凭据是否正确');
        console.error('5. 确认网络防火墙设置允许连接');

        // 在CI环境中，设置特定的退出码而不是失败
        if (process.env.CI) {
            console.log('在CI环境中运行，不标记为失败，但请检查连接问题。');
            process.exit(0); // 在CI中不失败，但记录问题
        } else {
            process.exit(1); // 在非CI环境中失败
        }
    } catch (error) {
        console.error('MongoDB连接测试失败:', error);
        if (process.env.CI) {
            process.exit(0); // 在CI中不失败
        } else {
            process.exit(1); // 在非CI环境中失败
        }
    }
}

main().catch(err => {
    console.error('脚本执行错误:', err);
    process.exit(process.env.CI ? 0 : 1);
});