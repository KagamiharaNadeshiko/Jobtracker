exports = async function(industryData) {
    const mongodb = context.services.get("mongodb-atlas");
    const db = mongodb.db("jobtracing");
    const industries = db.collection("industries");

    // 获取当前用户
    const currentUser = context.user;

    if (!currentUser) {
        return { error: "未授权的访问，请先登录" };
    }

    // 验证必要字段
    if (!industryData.name) {
        return { error: "行业名称为必填项" };
    }

    // 准备行业数据
    const newIndustry = {
        name: industryData.name,
        description: industryData.description || "",
        createdBy: currentUser.id,
        createdAt: new Date()
    };

    try {
        // 检查是否已存在同名行业
        const existingIndustry = await industries.findOne({
            name: newIndustry.name,
            createdBy: currentUser.id
        });

        if (existingIndustry) {
            return { error: "已存在同名行业" };
        }

        // 插入新行业
        const result = await industries.insertOne(newIndustry);

        return {
            success: true,
            industryId: result.insertedId
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};