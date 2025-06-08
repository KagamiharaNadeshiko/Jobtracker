exports = function() {
    // 暴露App Services的功能
    return {
        // 邮箱密码认证功能
        createUserWithEmail: (email, password) => {
            return context.app.auth.providers.local.userRegistration.registerUser({
                email,
                password
            });
        },

        // 确认用户电子邮件
        confirmUser: (token, tokenId) => {
            return context.app.auth.providers.local.userRegistration.confirmUser({
                token,
                tokenId
            });
        },

        // 重置密码
        resetPassword: (token, tokenId, password) => {
            return context.app.auth.providers.local.userRegistration.resetPassword({
                token,
                tokenId,
                password
            });
        },

        // 发送重置密码邮件
        sendResetPasswordEmail: (email) => {
            return context.app.auth.providers.local.userRegistration.sendResetPasswordEmail({
                email
            });
        }
    };
};