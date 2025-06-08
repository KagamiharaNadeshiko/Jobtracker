exports = async function(email, password, userData) {
    // 获取app对象和服务
    const app = context.services.get("mongodb-atlas");
    const db = app.db("jobtracing");
    const users = db.collection("users");

    try {
        // 使用内置的email/password身份验证系统注册用户
        await context.functions.execute("createEmailPasswordUser", email, password);

        // 获取刚刚创建的用户ID
        const filter = { "data.email": email };
        const user = await context.user;

        // 创建用户文档，包含附加信息
        const userDoc = {
            _id: user.id,
            email: email,
            username: userData.username || email.split('@')[0],
            createdAt: new Date(),
            ...userData
        };

        // 将用户文档插入到users集合中
        await users.insertOne(userDoc);

        return { success: true, userId: user.id };
    } catch (error) {
        return { error: error.message };
    }
};