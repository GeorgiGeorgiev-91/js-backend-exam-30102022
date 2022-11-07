function parseError(error) {
    if (error.name == 'ValidationError') {
        //mongoose error
        return Object.values(error.errors).map(v => v.message);
    } else if (Array.isArray(error)) {
        //express-validator error
        return error.map(x => x.msg);
    } else {
        return error.message.split('\n');
    }
}

module.exports = {
    parseError
}