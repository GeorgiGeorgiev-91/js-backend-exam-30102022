const Blog = require("../models/Blog");

async function create(blog) {
    return await Blog.create(blog);
}

async function getLast3() {
    return Blog.find({}).sort({ _id: -1 }).limit(3).lean();
}

async function getAll() {
    return Blog.find({}).lean();
}

async function getById(id) {
    return Blog.findById(id).lean();
}

async function deleteById(id) {
    return Blog.findByIdAndDelete(id);
}

async function followBlog(blogId, userId) {
    const existing = await Blog.findById(blogId);
    existing.followList.push(userId);

    existing.save();
}

async function updateById(id, data) {
    const existing = await Blog.findById(id);
    existing.title = data.title;
    existing.imageUrl = data.imageUrl;
    existing.content = data.content;
    existing.category = data.category;

    return existing.save();
}

async function getMyBlogs(userId) {
    return Blog.find({ owner: userId }).lean();
}

async function getMyFollowings(userId) {
    return Blog.find({ followList: userId }).lean();
}

module.exports = {
    getAll,
    create,
    getLast3,
    getById,
    deleteById,
    followBlog,
    updateById,
    getMyBlogs,
    getMyFollowings
}