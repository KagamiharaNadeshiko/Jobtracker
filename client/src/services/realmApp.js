import * as Realm from 'realm-web';

// 从环境变量获取Realm App ID
const REALM_APP_ID = process.env.REACT_APP_REALM_APP_ID;
const app = new Realm.App({ id: REALM_APP_ID || 'jobtracing-app' });

/**
 * 使用邮箱和密码登录
 * @param {string} email 用户邮箱
 * @param {string} password 用户密码
 * @returns {Promise<Realm.User>} 登录成功的用户对象
 */
export async function loginEmailPassword(email, password) {
    const credentials = Realm.Credentials.emailPassword(email, password);
    try {
        const user = await app.logIn(credentials);
        return user;
    } catch (err) {
        console.error("登录失败", err);
        throw err;
    }
}

/**
 * 注册新用户
 * @param {string} email 用户邮箱
 * @param {string} password 用户密码
 */
export async function registerUser(email, password) {
    try {
        await app.emailPasswordAuth.registerUser({ email, password });
    } catch (err) {
        console.error("注册失败", err);
        throw err;
    }
}

/**
 * 获取当前登录用户
 * @returns {Realm.User|null} 当前登录用户或null
 */
export function getCurrentUser() {
    return app.currentUser;
}

/**
 * 退出登录
 */
export async function logOut() {
    if (app.currentUser) {
        await app.currentUser.logOut();
    }
}

/**
 * 调用Atlas Function
 * @param {string} functionName 函数名称
 * @param {...any} args 函数参数
 * @returns {Promise<any>} 函数执行结果
 */
export async function callFunction(functionName, ...args) {
    if (!app.currentUser) {
        throw new Error('用户未登录');
    }

    try {
        return await app.currentUser.functions[functionName](...args);
    } catch (err) {
        console.error(`调用函数 ${functionName} 失败:`, err);
        throw err;
    }
}

/**
 * 获取MongoDB集合
 * @param {string} collectionName 集合名称
 * @returns {Realm.Services.MongoDB.MongoDBCollection} MongoDB集合对象
 */
export function getCollection(collectionName) {
    if (!app.currentUser) {
        throw new Error('用户未登录');
    }

    const mongodb = app.currentUser.mongoClient('mongodb-atlas');
    return mongodb.db('jobtracing').collection(collectionName);
}

export { app };