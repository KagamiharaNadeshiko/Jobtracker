const path = require('path');
const fs = require('fs');

// @desc    上传文件
// @route   POST /api/upload
// @access  Private
exports.uploadFile = async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: '请选择要上传的文件' });
        }

        // 返回文件信息
        res.status(200).json({
            success: true,
            file: {
                filename: req.file.filename,
                path: `/uploads/${req.file.filename}`,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '文件上传失败' });
    }
};

// @desc    添加简历文件
// @route   POST /api/upload/resume/:positionId
// @access  Private
exports.uploadResume = async(req, res) => {
    try {
        const Position = require('../models/Position');
        const position = await Position.findById(req.params.positionId);

        if (!position) {
            return res.status(404).json({ message: '未找到该职位' });
        }

        if (!req.file) {
            return res.status(400).json({ message: '请选择要上传的简历文件' });
        }

        // 更新职位记录中的简历字段
        position.resume = `/uploads/${req.file.filename}`;
        await position.save();

        res.status(200).json({
            success: true,
            data: position
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '简历上传失败' });
    }
};

// @desc    删除文件
// @route   DELETE /api/upload/:filename
// @access  Private
exports.deleteFile = async(req, res) => {
    try {
        const filePath = path.join(__dirname, '../../public/uploads', req.params.filename);

        // 检查文件是否存在
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: '文件不存在' });
        }

        // 删除文件
        fs.unlinkSync(filePath);

        res.status(200).json({
            success: true,
            message: '文件已成功删除'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '删除文件失败' });
    }
};