exports = async function(positionData) {
    const mongodb = context.services.get("mongodb-atlas");
    const db = mongodb.db("jobtracing");
    const positions = db.collection("positions");
    const companies = db.collection("companies");
    const ObjectId = require('bson').ObjectId;

    // 获取当前用户
    const currentUser = context.user;

    if (!currentUser) {
        return { error: "未授权的访问，请先登录" };
    }

    // 验证必要字段
    if (!positionData.title || !positionData.company) {
        return { error: "职位名称和公司为必填项" };
    }

    try {
        // 验证公司是否存在
        const companyId = new ObjectId(positionData.company);
        const company = await companies.findOne({
            _id: companyId,
            createdBy: currentUser.id
        });

        if (!company) {
            return { error: "指定的公司不存在或您无权访问" };
        }

        // 准备职位数据
        const newPosition = {
            title: positionData.title,
            company: companyId,
            description: positionData.description || "",
            applicationType: positionData.applicationType || "其他", // ES/网测/其他
            testType: positionData.testType || "",
            deadline: positionData.deadline ? new Date(positionData.deadline) : null,
            status: positionData.status || "准备中",
            createdBy: currentUser.id,
            createdAt: new Date()
        };

        // 插入新职位
        const result = await positions.insertOne(newPosition);

        return {
            success: true,
            positionId: result.insertedId
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};