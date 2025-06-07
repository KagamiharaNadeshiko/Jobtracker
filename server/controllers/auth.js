const crypto = require('crypto');
const User = require('../models/User');

// @desc    注册用户
// @route   POST /api/auth/register
// @access  Public
exports.register = async(req, res) => {
    try {
        const { username, email, password } = req.body;

        // 检查用户是否已存在
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                message: '该用户名或邮箱已被注册'
            });
        }

        // 创建用户
        const user = await User.create({
            username,
            email,
            password
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: '服务器错误' });
    }
};

// @desc    用户登录
// @route   POST /api/auth/login
// @access  Public
exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // 验证email和password
        if (!email || !password) {
            return res.status(400).json({ message: '请提供邮箱和密码' });
        }

        // 检查用户是否存在
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: '无效的凭据' });
        }

        // 检查密码是否匹配
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: '无效的凭据' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// @desc    退出登录
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async(req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: '成功退出登录'
    });
};

// @desc    获取当前登录用户
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// @desc    更新密码
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        // 检查当前密码
        if (!(await user.matchPassword(req.body.currentPassword))) {
            return res.status(401).json({ message: '密码错误' });
        }

        user.password = req.body.newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 生成token并发送响应
const sendTokenResponse = (user, statusCode, res) => {
    // 创建token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    // 在生产环境中启用secure属性
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    // 清除密码
    user.password = undefined;

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            user,
            token
        });
};