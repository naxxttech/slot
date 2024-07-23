const express = require("express")
const router = express.Router()

const secureAuth = require("../../middlewares/secure-auth")

router.get("/test", async (request, response) => {
    console.log("USER?", request.session.user)


    response.json(request.session.user || "no user")

})

router.post("/create-session", secureAuth, async (request, response) => {

    const { bank, currency, id, nickname, externaltoken, gameid} = request.body
    const response_object = { msg: "", sessionId: ""}

    if (!bank || !currency || !id || !externaltoken || !gameid) {

        response_object.msg = "Invalid or missing parameters."
        return response.status(400).json(response_object)
    }

    console.log("USER?", request.session.user)

    request.session.user = { bank, currency, id, externaltoken, gameid }

    if (nickname) {
            request.session.user.nickname = nickname
    }

    response_object.msg = "OK"
    response_object.sessionId = request.sessionID
    response.status(201).json(response_object)
})



module.exports = router