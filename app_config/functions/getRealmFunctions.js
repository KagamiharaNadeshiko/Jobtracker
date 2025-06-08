/**
 * Helper function to access MongoDB Atlas App Services functions
 * This is used by the client to call App Services functions
 */
exports = function() {
    return {
        /**
         * Get dashboard statistics for a user
         * @param {string} userId - The user ID to get stats for
         * @returns {Object} Dashboard statistics
         */
        getDashboardStats: async function(userId) {
            try {
                // Call the App Services function
                return await context.functions.execute("getDashboardStats", userId);
            } catch (err) {
                console.error("Error calling getDashboardStats:", err);
                throw err;
            }
        },

        /**
         * Reset a user's password
         * @param {string} email - User's email address
         * @returns {Object} Result of password reset attempt
         */
        resetPassword: async function(email) {
            try {
                // Call the App Services function
                return await context.functions.execute("resetPassword", email);
            } catch (err) {
                console.error("Error calling resetPassword:", err);
                throw err;
            }
        }
    };
};