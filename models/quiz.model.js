const mongoose = require('mongoose');
const { Schema } = mongoose;

const optionSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    isRight: {
        type: Boolean,
        required: true
    }
})
const questionSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    options: [optionSchema],
    points: Number
})
const quizSchema = new Schema({
    quizName: {
        type: String,
        required: true
    },
    questions: [questionSchema]
})
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;