const mongoose = require('mongoose');
require('dotenv').config();

async function initialiseDbConnection() {
    try {
    	console.log("testing bug",process.env['mongodb_uri'])
        await mongoose.connect(process.env['mongodb_uri'], { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Error in connecting to database", error);
    }
}
module.exports = { initialiseDbConnection };