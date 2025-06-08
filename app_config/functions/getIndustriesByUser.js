exports = function() {
    const mongodb = context.services.get("mongodb-atlas");
    const db = mongodb.db("jobtracing");
    const industries = db.collection("industries");

    // 获取当前用户
    const currentUser = context.user;

    if (!currentUser) {
        return { error: "未授权的访问，请先登录" };
    }

    // 获取当前用户创建的行业
    return industries.find({ createdBy: currentUser.id }).toArray()
        .then(docs => {
            return docs;
        })
        .catch(err => {
            return { error: err.message };
        });
};