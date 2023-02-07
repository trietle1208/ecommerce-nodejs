const { default: mongoose } = require('mongoose');

const dbConnect = () => {
    try {
        mongoose.set("strictQuery", false);
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("Connect database success");
    } catch (error) {
        console.log("Database error");
        throw new Error(error);
    }
};

module.exports = dbConnect;