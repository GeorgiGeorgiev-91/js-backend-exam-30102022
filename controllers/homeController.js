const { hasUser } = require('../middlewares/guards');
const { getLast3, getAll, getMyBlogs, getMyFollowings } = require('../services/blogService');

const homeController = require('express').Router();

homeController.get('/', async(req, res) => {
    const blogs = await getLast3();
    res.render('home', {
        title: 'Home Page',
        user: req.user,
        blogs
    });
});

homeController.get('/catalog', async(req, res) => {
    const blogs = await getAll();
    res.render('Catalog', {
        title: 'Catalog Page',
        user: req.user,
        blogs
    });
});

homeController.get('/profile', hasUser(), async(req, res) => {
    const myBlogs = await getMyBlogs(req.user._id);
    myBlogs.count = myBlogs.length;

    const myFollowings = await getMyFollowings(req.user._id);
    myFollowings.count = myFollowings.length;

    console.log(myFollowings);

    res.render('profile', {
        title: 'Profile Page',
        user: req.user,
        myBlogs,
        myFollowings
    });
});

module.exports = homeController;