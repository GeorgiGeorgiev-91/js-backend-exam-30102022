const mongoose = require('mongoose');


const CONNECTION_STRING = 'mongodb://localhost:27017/exam301022';

module.exports = async(app) => {
    try {
        mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Databse connected');
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};