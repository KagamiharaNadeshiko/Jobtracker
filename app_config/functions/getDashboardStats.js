exports = async function(userId) {
    if (!userId) {
        return { error: "User ID is required" };
    }

    const mongodb = context.services.get("mongodb-atlas");
    const db = mongodb.db("jobtracing");

    try {
        // Get counts for each collection
        const industryCount = await db.collection("industries").count({ createdBy: BSON.ObjectId(userId) });
        const companyCount = await db.collection("companies").count({ createdBy: BSON.ObjectId(userId) });
        const positionCount = await db.collection("positions").count({ createdBy: BSON.ObjectId(userId) });
        const interviewCount = await db.collection("interviews").count({ createdBy: BSON.ObjectId(userId) });

        // Get position status counts
        const positionStatusCounts = await db.collection("positions").aggregate([
            { $match: { createdBy: BSON.ObjectId(userId) } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]).toArray();

        // Format position status counts
        const statusCounts = {};
        positionStatusCounts.forEach(item => {
            statusCounts[item._id] = item.count;
        });

        // Get recent positions
        const recentPositions = await db.collection("positions")
            .find({ createdBy: BSON.ObjectId(userId) })
            .sort({ date: -1 })
            .limit(5)
            .toArray();

        // Get upcoming interviews
        const upcomingInterviews = await db.collection("interviews")
            .find({
                createdBy: BSON.ObjectId(userId),
                date: { $gte: new Date() }
            })
            .sort({ date: 1 })
            .limit(5)
            .toArray();

        return {
            counts: {
                industries: industryCount,
                companies: companyCount,
                positions: positionCount,
                interviews: interviewCount
            },
            statusCounts,
            recentPositions,
            upcomingInterviews
        };
    } catch (err) {
        return { error: err.message };
    }
};