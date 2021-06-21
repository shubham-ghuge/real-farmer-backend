const mongoose = require('mongoose')
const { Schema } = mongoose;

const attemptedQuizSchema = new Schema({
    quizId: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    score: Number
})
const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    attemptedQuiz: [attemptedQuizSchema]
})
const User = mongoose.model('User', userSchema);

module.exports = User;