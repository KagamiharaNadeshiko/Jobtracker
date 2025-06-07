const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

// 设置存储引擎
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: (req, file, cb) => {
        // 创建唯一的文件名
        crypto.randomBytes(16, (err, raw) => {
            if (err) return cb(err);

            cb(
                null,
                raw.toString('hex') + Date.now() + path.extname(file.originalname)
            );
        });
    }
});

// 检查文件类型
const fileFilter = (req, file, cb) => {
    // 允许的文件类型
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    // 检查文件扩展名
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // 检查mime类型
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('错误：仅支持图片和文档文件!'));
    }
};

// 初始化上传，添加适当的大小限制和安全设置
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50000000 } // 50MB
});

module.exports = upload;