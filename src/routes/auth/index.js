const express = require("express")
const router = express.Router()



router.get("/generate-session", async (request, response) => {

    // express session or random generated session?
    response.status(201).json({ message: "Session created."})
})



module.exports = router