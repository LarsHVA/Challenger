// Get MongoDB URI
require('dotenv').config();
const uri = process.env.URI;

// Database connection mongoose
const connect = async (mongoose) => {
    try {
        await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});
        console.log('Connected d[ o_0 ]b');
    } catch (err) {
        console.log('Failed ε(´סּ︵סּ`)з');
    }
};

// Make module connect
module.exports = connect;