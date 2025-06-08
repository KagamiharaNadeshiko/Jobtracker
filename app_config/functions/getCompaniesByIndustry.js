exports = function(industryId) {
    const mongodb = context.services.get("mongodb-atlas");
    const db = mongodb.db("jobtracing");
    const companies = db.collection("companies");
    const ObjectId = require('bson').ObjectId;

    // 获取当前用户
    const currentUser = context.user;

    if (!currentUser) {
        return { error: "未授权的访问，请先登录" };
    }

    if (!industryId) {
        return { error: "行业ID为必填项" };
    }

    try {
        // 查询指定行业下的公司，确保当前用户有权访问
        const query = {
            industry: new ObjectId(industryId),
            createdBy: currentUser.id
        };

        return companies.find(query).toArray()
            .then(docs => {
                return docs;
            })
            .catch(err => {
                return { error: err.message };
            });
    } catch (err) {
        return { error: err.message };
    }
};