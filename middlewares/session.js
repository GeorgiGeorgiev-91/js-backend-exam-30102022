const { verifyToken } = require("../services/userService");

module.exports = () => (req, res, next) => {
    const token = req.cookies['token'];
    if (token) {
        // console.log(token);
        try {
            const userData = verifyToken(token);
            // console.log('Read Successful, user', userData.username);
            req.user = userData;
        } catch (error) {
            // console.log('Invalid token');
            res.clearCookie('token');
            res.redirect('/auth/login');
            return
        }
    }

    next();
};