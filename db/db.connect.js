const mongoose = require('mongoose');

function initialiseDbConnection() {
    // try {
    //     await mongoose.connect(process.env['mongodb_uri'], { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
    //     console.log("Database connected successfully")
    // } catch (error) {
    //     console.log("Error in connecting to database", error);
    // }
    mongoose.connect(process.env['mongodb_uri'], { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
    mongoose.connection.once('open', function () {
        console.log('Conection has been made!');
    }).on('error', function (error) {
        console.log('Error is: ', error);
    });
}
module.exports = { initialiseDbConnection };