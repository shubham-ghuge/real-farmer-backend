const mongoose = require('mongoose');

async function initialiseDbConnection() {
    try {
        await mongoose.connect("mongodb+srv://shubham-ghuge:QW8r7KGSaZsDa1yb@farmers-grocery-cluster.qyup9.mongodb.net/real-farmer-quiz?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Error in connecting to database", error);
    }
}
module.exports = { initialiseDbConnection };