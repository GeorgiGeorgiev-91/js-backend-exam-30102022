const { hasUser } = require('../middlewares/guards');
const { create, getById, followBlog, deleteById, updateById } = require('../services/blogService');
const { getEmailById, getUsernameById } = require('../services/userService');
const { parseError } = require('../util/parser');

const blogController = require('express').Router();

blogController.post('/create', hasUser(), async(req, res) => {
    const blog = {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        content: req.body.content,
        category: req.body.category,
        owner: req.user._id,
    }


    try {
        await create(blog);
        res.redirect('/catalog');
    } catch (error) {
        res.render('create', {
            title: 'Create Blog',
            errors: parseError(error),
            body: blog,
            user: req.user
        })
    }
});

blogController.get('/create', hasUser(), (req, res) => {
    if (req.user) {
        res.render('create', {
            title: 'Create Blog',
            user: req.user
        });
    }
});

blogController.get('/:id/details', async(req, res) => {
    const blog = await getById(req.params.id);
    const followersList = [];

    if (req.user) {
        if (blog.owner == req.user._id) {
            blog.isOwner = true;
        } else if (blog.followList.map(b => b.toString()).includes(req.user._id.toString())) {
            blog.isFollowed = true;
        }
    }

    for (const iterator of blog.followList) {
        followersList.push(await getUsernameById(iterator.toString()));
    }

    blog.followersList = followersList.join(', ');

    blog.ownerEmail = await getEmailById(blog.owner.toString());

    res.render('details', {
        title: 'Blog Details',
        blog: blog,
        user: req.user
    })
});

blogController.get('/:id/follow', hasUser(), async(req, res) => {
    const blog = await getById(req.params.id);

    if (blog.owner.toString() != req.user._id.toString() && (blog.followList.map(x => x.toString()).includes(req.user._id.toString())) == false) {
        followBlog(req.params.id, req.user._id);
    }
    res.redirect(`/blog/${req.params.id}/details`);
});

blogController.get('/:id/delete', hasUser(), async(req, res) => {
    const blog = await getById(req.params.id);

    if (blog.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    await deleteById(req.params.id);
    res.redirect('/catalog');

});

blogController.get('/:id/edit', hasUser(), async(req, res) => {
    const blog = await getById(req.params.id);
    if (blog.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    res.render('edit', {
        user: req.user,
        title: 'Edit Blog',
        blog
    });
});

blogController.post('/:id/edit', hasUser(), async(req, res) => {
    const blog = await getById(req.params.id);
    if (blog.owner != req.user._id) {
        return res.redirect('/auth/login');
    }

    try {
        await updateById(req.params.id, req.body);
        res.redirect(`/blog/${req.params.id}/details`);
    } catch (error) {
        req.body._id = req.params.id;
        res.render('edit', {
            user: req.user,
            title: 'Edit Blog',
            errors: parseError(error),
            blog: req.body
        });
    }
});

module.exports = blogController;