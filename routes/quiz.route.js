const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz.model');
const { authHandler } = require('../middlewares/auth.middleware')

router.use(authHandler);

router.route('/')
    .get(async (req, res) => {
        const quizList = await Quiz.find({});
        const listOfQuizzes = quizList.map((i) => {
            return { id: i._id, name: i.quizName }
        });
        res.json({ success: true, listOfQuizzes })
    })
    .post(async (req, res) => {
        const { quizName, questions } = req.body;
        if (quizName && questions) {
            try {
                const response = await Quiz.create({ quizName, questions });
                res.json({ success: true, message: "quiz inserted successfully", response })
            } catch (error) {
                console.log('error inserting quiz', error)
                res.status(409).json({ success: false, message: 'error inserting quiz' })
            }
        } else {
            res.status(412).json({ success: false, message: "insufficient data" })
        }
    })

router.get('/:quizId', async (req, res) => {
    const { quizId } = req.params;
    if (quizId) {
        try {
            const quiz = await Quiz.findById(quizId).lean();
            res.status(200).json({ success: true, quiz });
        } catch (error) {
            console.log("error getting quiz", error);
            res.status(400).json({ success: false, message: "error getting quiz" })
        }
    } else {
        res.status(412).json({ success: false, message: "insufficient data" })
    }
})

module.exports = router;