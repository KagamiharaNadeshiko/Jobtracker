exports = async function() {
    const mongodb = context.services.get("mongodb-atlas");
    const db = mongodb.db("jobtracing");

    // 获取当前用户
    const currentUser = context.user;

    if (!currentUser) {
        return { error: "未授权的访问，请先登录" };
    }

    try {
        // 获取统计数据
        const industries = db.collection("industries");
        const companies = db.collection("companies");
        const positions = db.collection("positions");
        const interviews = db.collection("interviews");

        // 行业数量
        const industryCount = await industries.count({
            createdBy: currentUser.id
        });

        // 公司数量
        const companyCount = await companies.count({
            createdBy: currentUser.id
        });

        // 职位数量
        const positionCount = await positions.count({
            createdBy: currentUser.id
        });

        // 按状态统计职位
        const positionStatusStats = await positions.aggregate([
            { $match: { createdBy: currentUser.id } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]).toArray();

        // 按申请类型统计职位
        const positionTypeStats = await positions.aggregate([
            { $match: { createdBy: currentUser.id } },
            { $group: { _id: "$applicationType", count: { $sum: 1 } } }
        ]).toArray();

        // 按月统计申请数
        const monthlyApplications = await positions.aggregate([
            { $match: { createdBy: currentUser.id } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]).toArray();

        // 近期截止的职位
        const upcomingDeadlines = await positions.find({
                createdBy: currentUser.id,
                deadline: { $gte: new Date() }
            })
            .sort({ deadline: 1 })
            .limit(5)
            .toArray();

        return {
            summary: {
                industryCount,
                companyCount,
                positionCount
            },
            positionStatusStats,
            positionTypeStats,
            monthlyApplications,
            upcomingDeadlines
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};