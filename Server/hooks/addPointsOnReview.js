const addPointsOnReview = async (userID) => {
    try {
        const User = require('../models/user.model');
        await User.increment('points', { by: 1, where: { userID: userID } });
    } catch (error) {
        throw new Error('Error updating user points: ' + error.message);
    }
}
module.exports = addPointsOnReview