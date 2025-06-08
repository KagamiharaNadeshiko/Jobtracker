exports = async function(companyData) {
    const mongodb = context.services.get("mongodb-atlas");
    const db = mongodb.db("jobtracing");
    const companies = db.collection("companies");
    const industries = db.collection("industries");
    const ObjectId = require('bson').ObjectId;

    // 获取当前用户
    const currentUser = context.user;

    if (!currentUser) {
        return { error: "未授权的访问，请先登录" };
    }

    // 验证必要字段
    if (!companyData.name || !companyData.industry) {
        return { error: "公司名称和行业为必填项" };
    }

    try {
        // 验证行业是否存在
        const industryId = new ObjectId(companyData.industry);
        const industry = await industries.findOne({
            _id: industryId,
            createdBy: currentUser.id
        });

        if (!industry) {
            return { error: "指定的行业不存在或您无权访问" };
        }

        // 检查是否已存在同名公司
        const existingCompany = await companies.findOne({
            name: companyData.name,
            industry: industryId,
            createdBy: currentUser.id
        });

        if (existingCompany) {
            return { error: "该行业下已存在同名公司" };
        }

        // 准备公司数据
        const newCompany = {
            name: companyData.name,
            industry: industryId,
            description: companyData.description || "",
            location: companyData.location || "",
            website: companyData.website || "",
            createdBy: currentUser.id,
            createdAt: new Date()
        };

        // 插入新公司
        const result = await companies.insertOne(newCompany);

        return {
            success: true,
            companyId: result.insertedId
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};