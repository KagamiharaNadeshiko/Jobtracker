exports = function() {
    const mongodb = context.services.get("mongodb-atlas");
    const db = mongodb.db("jobtracing");
    const companies = db.collection("companies");

    return companies.find({}).toArray();
};