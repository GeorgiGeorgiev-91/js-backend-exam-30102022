const authController = require("../controllers/authController");
const blogController = require("../controllers/blogController");
const defaultController = require("../controllers/defaultController");
const homeController = require("../controllers/homeController");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/blog', blogController);

    app.all('*', defaultController);
};