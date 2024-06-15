const { handleForbiddenRequest, handleServerError } = require('../utilities/errors')
const { User } = require('../models/index')
module.exports= {
    checkIsBanned: async(req, res, next) => {
        try {
            const userID = res.locals.userID
            const user = await User.findByPk(userID)
            if (user.isBanned) {
                handleForbiddenRequest(res, "You are currently banned. You can not access this feature…")
            }
            next()
        } catch (error) {
            handleServerError(error, res)
        }
    }
}