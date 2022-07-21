const express = require("express");
const router = express.Router();
const Model = require("../model/todoModel")
const jwt = require("jsonwebtoken")

router.post("/create", async (req, res) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
            res.status(422).json({
                message: "Please provide the token",
            });
        }
        const theToken = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(theToken, process.env.TOKEN_KEY)
        const data = new Model({
            user_id: decoded.id,
            task: req.body.task, complete: req.body.complete
        })
        const dataToSave = await data.save()
        res.status(200).json(dataToSave)

    } catch (error) {
        console.log(error);
        res.status(422).json({
            message: "Please Enter the valid token",
        });
    }
})

router.get("/user", async (req, res) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
            res.status(422).json({
                message: "Please provide the token",
            });
        }
        const theToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken, process.env.TOKEN_KEY)
        console.log(decoded.id);
        const user = await Model.find({ user_id: decoded.id })
        res.send(user)
    } catch (error) {
        res.status(422).json({
            message: "Please Enter the valid token",
        });
    }
})

router.put("/update/:id", async (req, res) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
            res.status(422).json({
                message: "Please provide the token",
            });
        }
        const theToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken, process.env.TOKEN_KEY)
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true }
        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )
        res.send(result)
        console.log(result);
    } catch (error) {
        res.status(422).json({
            message: "Please Enter the valid token",
        });
    }
})
router.delete("/delete/:id", async (req, res) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
            res.status(422).json({
                message: "Please provide the token",
            });
        }
        const theToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken, process.env.TOKEN_KEY)
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send({
            status: true,
            message: "Your ToDo has been deleted",
        });
    } catch (error) {
        res.status(404).json({ msg: "error is true" })
    }
})

module.exports = router;
