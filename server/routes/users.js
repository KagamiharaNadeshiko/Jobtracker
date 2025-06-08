const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// 数据库模型
const User = require('../models/User');

// @route   POST api/users
// @desc    注册用户
// @access  Public
router.post(
    '/', [
        check('name', '姓名不能为空').not().isEmpty(),
        check('email', '请输入有效的电子邮件').isEmail(),
        check('password', '请输入至少6位的密码').isLength({ min: 6 })
    ],
    async(req, res) => {
        // 验证请求
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            // 检查用户是否已存在
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: '用户已存在' });
            }

            // 创建新用户
            user = new User({
                name,
                email,
                password
            });

            // 加密密码
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            // 保存用户
            await user.save();

            // 返回JWT
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET, { expiresIn: '24h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('服务器错误');
        }
    }
);

// @route   GET api/users/me
// @desc    获取当前用户信息
// @access  Private
router.get('/me', auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

module.exports = router;