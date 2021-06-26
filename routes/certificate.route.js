const express = require('express');
const User = require('../models/user.model');
const router = express.Router();

router.route('/:email')
    .get(async (req, res) => {
        const { email } = req.params;
        try {
            const [{ attemptedQuiz, name }] = await User.find({ email }).populate('attemptedQuiz.quizId').exec();
            console.log(attemptedQuiz)
            const quizCertificateData = await attemptedQuiz.map(({
                quizId,
                score
            }) => {
                return {
                    name: quizId.quizName,
                    score
                }
            })
            res.json({ quizCertificateData, name });
        } catch (error) {
            console.log("error getting certificates", error);
            res.json("no records found");
        }
    })

module.exports = router;