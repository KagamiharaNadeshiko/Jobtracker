exports = function(userId, documentCreatorId) {
    // If either ID is missing, deny access
    if (!userId || !documentCreatorId) {
        return false;
    }

    // Convert to strings for comparison if they are ObjectIds
    const userIdStr = userId.toString();
    const creatorIdStr = documentCreatorId.toString();

    // Check if the user is the creator of the document
    return userIdStr === creatorIdStr;
};