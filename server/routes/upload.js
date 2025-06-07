const express = require('express');
const router = express.Router();
const { uploadFile, uploadResume, deleteFile } = require('../controllers/upload');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// 所有上传路由都需要认证
router.use(protect);

// 上传通用文件
router.post('/', upload.single('file'), uploadFile);

// 上传简历文件到特定职位
router.post('/resume/:positionId', upload.single('resume'), uploadResume);

// 删除文件
router.delete('/:filename', deleteFile);

module.exports = router;