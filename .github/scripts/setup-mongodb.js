const { MongoClient } = require('mongodb');

async function setup() {
    // 从环境变量获取MongoDB连接字符串
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('未提供MONGODB_URI环境变量');
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('已连接到MongoDB');

        const db = client.db('jobtracing');

        // 要创建的集合列表
        const collections = [
            'industries',
            'companies',
            'positions',
            'essays',
            'onlinetests',
            'interviews'
        ];

        // 创建集合
        for (const collectionName of collections) {
            try {
                await db.createCollection(collectionName);
                console.log(`创建集合: ${collectionName}`);
            } catch (err) {
                // 如果集合已存在(错误代码48)，则跳过
                if (err.code === 48) {
                    console.log(`集合已存在: ${collectionName}`);
                } else {
                    console.error(`创建集合${collectionName}时出错:`, err);
                }
            }
        }

        console.log('MongoDB集合设置完成');
    } catch (err) {
        console.error('连接MongoDB或创建集合时出错:', err);
        process.exit(1);
    } finally {
        await client.close();
        console.log('MongoDB连接已关闭');
    }
}

// 执行设置
setup();