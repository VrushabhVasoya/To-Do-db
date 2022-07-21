const express = require("express");
const router = express.Router();
const Model = require('../model/model');
const { authSchema } = require("../model/validation")
const jwt = require("jsonwebtoken")
const verifyToken = require("../middleware/auth")


router.post("/register", async (req, res) => {
    try {
        const result = await authSchema.validateAsync(req.body)
        console.log(result);
        let user = await Model.findOne({ email: req.body.email })
        if (user) {
            res.status(400).send('That user already exisits!');
        } else {
            const user = new Model({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: req.body.password

            })
            const dataToSave = await user.save()
            res.status(200).json(dataToSave)
        }
    } catch (error) {
        if (error.isJoi === true) {
            res.send(error.details[0].message)
        }
    }
})

router.post("/login", async (req, res) => {

    try {

        let user = await Model.find({
            email: req.body.email,
            password: req.body.password
        })
        if (user <= 0) {
            res.status(404).json({ status: false, message: "Incorrect email or password" })
        } else {
            console.log(process.env.TOKEN_KEY);
            const token = jwt.sign({ id: user[0].id }, process.env.TOKEN_KEY, { expiresIn: "2h", })
            user.token = token
            res.send({
                status: true,
                message: "You Have Successfully Logged",
                // data: results,
                token: token
            })
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: true })
    }
})

router.get("/getuser", verifyToken)



module.exports = router;