// 数据库配置
const mongoose = require('mongoose');
const colors = require('colors');

/**
 * 连接到MongoDB数据库
 * 增加了重试机制和高级错误处理
 */
const connectDB = async() => {
    // 默认连接配置
    const connectOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // 设置合理的超时时间
        serverSelectionTimeoutMS: 15000, // 服务器选择超时时间
        connectTimeoutMS: 30000, // 连接超时时间
        socketTimeoutMS: 45000, // Socket超时时间，防止长时间操作被断开
    };

    // 尝试原始连接字符串
    let uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('MongoDB连接URI未定义！请在.env文件中设置MONGO_URI环境变量'.red.bold);
        process.exit(1);
    }

    // 重试连接的最大次数和间隔
    const maxRetries = 5;
    const retryInterval = 3000; // 毫秒
    let currentRetry = 0;
    let connected = false;

    while (currentRetry < maxRetries && !connected) {
        try {
            if (currentRetry > 0) {
                console.log(`正在进行第 ${currentRetry}/${maxRetries} 次重试连接...`.yellow);
                // 在重试时尝试使用替代连接字符串格式
                if (currentRetry === 2 && uri.startsWith('mongodb://')) {
                    uri = uri.replace('mongodb://', 'mongodb+srv://');
                    console.log('尝试使用SRV连接字符串格式...'.yellow);
                } else if (currentRetry === 3 && uri.startsWith('mongodb+srv://')) {
                    uri = uri.replace('mongodb+srv://', 'mongodb://');
                    console.log('尝试使用标准连接字符串格式...'.yellow);
                }
            }

            const conn = await mongoose.connect(uri, connectOptions);

            connected = true;
            console.log(`MongoDB连接成功: ${conn.connection.host}`.cyan.underline.bold);

            // 设置连接事件监听器
            mongoose.connection.on('error', (err) => {
                console.error(`MongoDB连接错误: ${err.message}`.red);
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('MongoDB连接断开，尝试重新连接...'.yellow);
                // 如果在应用运行期间连接断开，自动尝试重连
                setTimeout(() => {
                    if (mongoose.connection.readyState === 0) { // 0 = disconnected
                        connectDB().catch(err => {
                            console.error('重新连接失败:', err);
                        });
                    }
                }, retryInterval);
            });

            return conn;
        } catch (error) {
            currentRetry++;

            // 提供更详细的错误信息
            console.error(`MongoDB连接失败 (尝试 ${currentRetry}/${maxRetries})`.red.bold);

            if (error.name === 'MongooseServerSelectionError') {
                console.error('无法连接到MongoDB服务器，请检查服务器是否运行以及网络设置'.red);
            } else if (error.name === 'MongoParseError') {
                console.error('MongoDB连接字符串格式错误'.red);
            } else if (error.message.includes('authentication failed')) {
                console.error('MongoDB身份验证失败，请检查用户名和密码'.red);
            } else if (error.message.includes('ENOTFOUND') || error.message.includes('could not be reached')) {
                console.error('找不到MongoDB主机，DNS解析问题或主机名错误'.red);
            } else {
                console.error(`MongoDB错误: ${error.message}`.red);
            }

            // 如果还有重试次数，等待后继续
            if (currentRetry < maxRetries) {
                console.log(`${retryInterval/1000}秒后重试...`.yellow);
                await new Promise(resolve => setTimeout(resolve, retryInterval));
            } else {
                console.error('已达到最大重试次数，无法连接到MongoDB'.red.bold);

                // 在生产环境中不终止进程，可能还有其他功能不依赖MongoDB
                if (process.env.NODE_ENV === 'production') {
                    console.warn('在生产环境中继续运行，但MongoDB功能将不可用'.yellow.bold);
                    return null;
                } else {
                    process.exit(1);
                }
            }
        }
    }
};

module.exports = connectDB;