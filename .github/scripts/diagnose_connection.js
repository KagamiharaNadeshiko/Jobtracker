/**
 * MongoDB Atlas 连接诊断工具
 * 用于CI/CD环境中排查连接问题
 */

const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const dns = require('dns');
const { promisify } = require('util');

const dnsResolve = promisify(dns.resolve);
const dnsLookup = promisify(dns.lookup);
const dnsResolveSrv = promisify(dns.resolveSrv);

// 可能的集群名称变体
const CLUSTER_VARIANTS = [
    'jobtracker.slt16xn.mongodb.net',
    'jobtracing.slt16xn.mongodb.net',
    'cluster0.slt16xn.mongodb.net',
    'cluster0-shard-00-00.slt16xn.mongodb.net',
    'atlas-sql-65b203d04953163b8e444c83-n9rjr.mongodb.net',
    'cluster0-9nnzv.mongodb.net',
    'slt16xn.mongodb.net'
];

// 从环境变量或命令行参数获取连接字符串
let originalUri = process.env.MONGO_URI || process.argv[2];
if (!originalUri) {
    console.error('错误: 未提供MongoDB连接URI。请设置MONGO_URI环境变量或作为命令行参数传递。');
    process.exit(1);
}

// 屏蔽用户名和密码
function maskUri(uri) {
    return uri.replace(/mongodb(\+srv)?:\/\/(.*?):(.*?)@/, 'mongodb$1://*****:*****@');
}

// 测试DNS解析
async function testDns(hostname) {
    console.log(`\n[DNS测试] 测试主机名: ${hostname}`);

    try {
        console.log('尝试标准DNS解析...');
        const addresses = await dnsResolve(hostname);
        console.log(`✅ 解析成功! IP地址: ${addresses.join(', ')}`);
    } catch (error) {
        console.log(`❌ 标准解析失败: ${error.message}`);
    }

    try {
        console.log('尝试DNS查找...');
        const result = await dnsLookup(hostname);
        console.log(`✅ 查找成功! IP地址: ${result.address}`);
    } catch (error) {
        console.log(`❌ DNS查找失败: ${error.message}`);
    }

    if (hostname.includes('.mongodb.net')) {
        try {
            console.log(`尝试SRV记录解析: _mongodb._tcp.${hostname}`);
            const srvRecords = await dnsResolveSrv(`_mongodb._tcp.${hostname}`);
            console.log(`✅ SRV解析成功! 记录: ${JSON.stringify(srvRecords)}`);
        } catch (error) {
            console.log(`❌ SRV解析失败: ${error.message}`);
        }
    }
}

// 测试MongoDB驱动直接连接
async function testDirectConnection(uri, label) {
    let client;
    console.log(`\n[MongoDB直接连接测试] ${label}`);
    console.log(`尝试连接: ${maskUri(uri)}`);

    try {
        client = new MongoClient(uri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        await client.connect();

        // 尝试简单的数据库操作
        const admin = client.db('admin');
        const result = await admin.command({ ping: 1 });

        console.log(`✅ 连接成功! 服务器响应: ${JSON.stringify(result)}`);
        return { success: true, uri };
    } catch (error) {
        console.log(`❌ 连接失败: ${error.message}`);
        return { success: false, error: error.message };
    } finally {
        if (client) await client.close();
    }
}

// 测试Mongoose连接
async function testMongooseConnection(uri, label) {
    console.log(`\n[Mongoose连接测试] ${label}`);
    console.log(`尝试连接: ${maskUri(uri)}`);

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });

        console.log('✅ Mongoose连接成功!');
        await mongoose.disconnect();
        return { success: true, uri };
    } catch (error) {
        console.log(`❌ Mongoose连接失败: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// 从URI中提取集群名称
function extractClusterFromUri(uri) {
    try {
        // 处理SRV格式
        if (uri.startsWith('mongodb+srv://')) {
            const withoutProtocol = uri.replace('mongodb+srv://', '');
            const authHostnamePath = withoutProtocol.split('/')[0];
            return authHostnamePath.includes('@') ?
                authHostnamePath.split('@')[1] :
                authHostnamePath;
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

// 生成不同的连接字符串变体
function generateUriVariants(originalUri) {
    const variants = [];
    const originalCluster = extractClusterFromUri(originalUri);

    if (!originalCluster) {
        console.warn('无法从连接字符串中提取集群名称');
        return [originalUri];
    }

    for (const variant of CLUSTER_VARIANTS) {
        if (variant === originalCluster) continue;

        // 替换集群名称
        const newUri = originalUri.replace(originalCluster, variant);
        variants.push(newUri);

        // 如果是SRV格式，添加标准格式变体
        if (newUri.startsWith('mongodb+srv://')) {
            variants.push(newUri.replace('mongodb+srv://', 'mongodb://'));
        }
        // 如果是标准格式，添加SRV格式变体
        else if (newUri.startsWith('mongodb://')) {
            variants.push(newUri.replace('mongodb://', 'mongodb+srv://'));
        }
    }

    return variants;
}

// 尝试使用不同的身份验证方式连接
async function testConnectionWithDifferentAuth(originalUri) {
    console.log('\n[尝试使用不同的身份验证参数]');

    // 如果原始URI中没有凭据，则无需测试
    if (!originalUri.includes('@')) {
        console.log('原始连接字符串不包含凭据，跳过此测试');
        return { success: false };
    }

    try {
        // 尝试构建只有用户名没有密码的URI
        const usernameOnly = originalUri.replace(/(mongodb(\+srv)?:\/\/)(.*?):(.*?)@/, '$1$3:@');
        console.log(`尝试只使用用户名连接: ${maskUri(usernameOnly)}`);
        const usernameResult = await testDirectConnection(usernameOnly, '只使用用户名');
        if (usernameResult.success) return usernameResult;

        // 尝试空凭据
        const noAuth = originalUri.replace(/(mongodb(\+srv)?:\/\/)(.*?):(.*?)@/, '$1');
        console.log(`尝试无验证连接: ${maskUri(noAuth)}`);
        const noAuthResult = await testDirectConnection(noAuth, '无验证');
        if (noAuthResult.success) return noAuthResult;

    } catch (error) {
        console.log(`尝试不同身份验证方式出错: ${error.message}`);
    }
    return { success: false };
}

// 添加对DNS配置文件的检查
async function checkDnsConfig() {
    console.log('\n[检查DNS配置]');
    try {
        const fs = require('fs');
        const util = require('util');
        const readFile = util.promisify(fs.readFile);

        try {
            const resolv = await readFile('/etc/resolv.conf', 'utf8');
            console.log('DNS解析器配置:\n', resolv);
        } catch (err) {
            console.log('无法读取/etc/resolv.conf:', err.message);
        }

        try {
            const hosts = await readFile('/etc/hosts', 'utf8');
            console.log('主机文件配置:\n', hosts);
        } catch (err) {
            console.log('无法读取/etc/hosts:', err.message);
        }
    } catch (error) {
        console.log('检查DNS配置时出错:', error.message);
    }
}

// 主函数
async function main() {
    console.log('===== MongoDB Atlas 连接诊断 =====');
    console.log(`原始连接字符串: ${maskUri(originalUri)}`);

    // 1. 测试DNS解析
    const originalCluster = extractClusterFromUri(originalUri);
    if (originalCluster) {
        await testDns(originalCluster);
    }

    // 2. 尝试原始连接字符串
    let result = await testDirectConnection(originalUri, '使用原始连接字符串');
    if (result.success) {
        console.log('\n✅ 连接成功! 使用原始连接字符串。');
        process.exit(0);
    }

    // 3. 尝试切换连接格式 (SRV <-> 标准)
    let alternativeUri;
    if (originalUri.startsWith('mongodb+srv://')) {
        alternativeUri = originalUri.replace('mongodb+srv://', 'mongodb://');
        result = await testDirectConnection(alternativeUri, '使用标准连接格式');
    } else if (originalUri.startsWith('mongodb://')) {
        alternativeUri = originalUri.replace('mongodb://', 'mongodb+srv://');
        result = await testDirectConnection(alternativeUri, '使用SRV连接格式');
    }

    if (result.success) {
        console.log('\n✅ 连接成功! 使用替代连接格式。');
        console.log(`推荐使用的连接字符串: ${maskUri(result.uri)}`);
        process.exit(0);
    }

    // 4. 尝试不同的集群名称变体
    console.log('\n[尝试不同集群名称]');
    const variants = generateUriVariants(originalUri);

    for (const variant of variants) {
        result = await testDirectConnection(variant, `尝试替代集群名称`);
        if (result.success) {
            console.log('\n✅ 连接成功! 使用替代集群名称。');
            console.log(`推荐使用的连接字符串: ${maskUri(result.uri)}`);
            process.exit(0);
        }
    }

    // 4.5 检查DNS配置
    await checkDnsConfig();

    // 4.7 尝试不同的身份验证参数
    result = await testConnectionWithDifferentAuth(originalUri);
    if (result.success) {
        console.log('\n✅ 连接成功! 使用不同的身份验证参数。');
        console.log(`推荐使用的连接字符串: ${maskUri(result.uri)}`);
        process.exit(0);
    }

    // 5. 尝试本地MongoDB (用于CI环境)
    const localUri = 'mongodb://localhost:27017/jobtracing';
    result = await testDirectConnection(localUri, '尝试连接本地MongoDB');

    if (result.success) {
        console.log('\n✅ 连接成功! 使用本地MongoDB。');
        console.log('注意：这只适用于测试环境，生产环境应使用MongoDB Atlas。');
        process.exit(0);
    }

    console.log('\n❌ 所有连接尝试均失败。请检查：');
    console.log('1. MongoDB Atlas集群是否正确配置');
    console.log('2. IP白名单是否包含CI/CD环境IP');
    console.log('3. 用户名和密码是否正确');
    console.log('4. 网络连接是否正常');
    process.exit(1);
}

// 运行主函数
main().catch(error => {
    console.error('诊断工具运行错误:', error);
    process.exit(1);
});