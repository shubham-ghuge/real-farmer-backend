const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const { initialiseDbConnection } = require('./db/db.connect');
const quizRoute = require('./routes/quiz.route');
const userRoute = require('./routes/user.route');
const certificateRoute = require('./routes/certificate.route');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

app.use(cors());
app.use(bodyParser.json());
initialiseDbConnection();

app.get('/', (req, res) => {
    console.log(process.env)
    res.json({ message: "hello from realfarmer-quiz" });
})
app.use('/quiz', quizRoute);
app.use('/users', userRoute);
app.use('/certificate', certificateRoute);

app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Invalid Route" });
})

app.listen(process.env.PORT || port, () => {
    console.log("server started at port", port)
})
