module.exports = (req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found',
        user: req.user
    })
};