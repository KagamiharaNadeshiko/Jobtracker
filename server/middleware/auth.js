const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 保护路由
exports.protect = async(req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // 从Authorization请求头获取token
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        // 从cookie中获取token
        token = req.cookies.token;
    }

    // 确保token存在
    if (!token) {
        return res.status(401).json({ message: '未授权访问' });
    }

    try {
        // 验证token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 设置请求中的用户
        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        return res.status(401).json({ message: '未授权访问' });
    }
};