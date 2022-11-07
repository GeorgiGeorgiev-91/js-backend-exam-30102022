const { Schema, model, Types } = require('mongoose');

const URL_PATTERN = /^https?:\/\/.+$/i;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: [5, 'The Title should be at least 5 characters and no longer than 50 characters'],
        maxlength: [50, 'The Title should be at least 5 characters and no longer than 50 characters']
    },
    imageUrl: {
        type: String,
        required: true,
        validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'The Blog Image should start with http:// or https://'
        }
    },
    content: { type: String, required: true, minlength: [10, 'The Content should be a minimum of 10 characters long'] },
    category: { type: String, required: true, minlength: [3, 'The Category should be a minimum of 3 characters long'] },
    followList: { type: [Types.ObjectId], ref: 'User', default: [] },
    owner: { type: Types.ObjectId, ref: 'User', required: true }
});

blogSchema.index({ name: 1 }, {
    colation: {
        locale: 'en',
        strength: 2
    }
});

const Blog = model('Blog', blogSchema);

module.exports = Blog