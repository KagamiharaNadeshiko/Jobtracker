const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, '用户名不能为空'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, '邮箱不能为空'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            '请提供有效的邮箱地址'
        ]
    },
    password: {
        type: String,
        required: [true, '密码不能为空'],
        minlength: 6,
        select: false
    },
    avatar: {
        type: String
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
});

// 密码加密
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 签发JWT
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id },
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE }
    );
};

// 比对密码
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);