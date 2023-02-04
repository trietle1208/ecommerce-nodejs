const { default: mongoose } = require('mongoose');

const dbConnect = () => {
    try {
        mongoose.set("strictQuery", false);
        const conn = mongoose.connect("mongodb://localhost:27017/digitic");
        console.log("Connect database success");
    } catch (error) {
        console.log("Database error");
        throw new Error(error);
    }
};

module.exports = dbConnect;