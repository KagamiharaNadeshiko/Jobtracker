exports = async function(email, password) {
    const { createUserWithEmail } = context.functions.execute("getRealmFunctions");

    try {
        // 创建一个新的邮箱/密码用户
        await createUserWithEmail(email, password);
        return { success: true };
    } catch (error) {
        return { error: error.message };
    }
};