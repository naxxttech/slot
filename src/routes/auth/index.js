const express = require("express")
const router = express.Router()

const secureAuth = require("../../middlewares/secure-auth")

router.get("/check-session", async (request, response) => {

    const { sessionId } = request.query

    if (sessionId || request.session.user) {

        const store = request.sessionStore

        let session_id;

        if (sessionId) {

            session_id = sessionId

        } else {

            session_id = request.session.id
        }

        store.get(session_id, (error, session) => {

            if (error || !session) {

                response.status(404).json({ message: 'Session not found or expired' });

            } else {
                console.log("USER?", session.user)
                response.status(200).json({ sessionId: sessionId, user: session.user });
            }
        })


    } 
    

   

})

router.post("/create-session", secureAuth, async (request, response) => {

    const response_object = { msg: "", sessionId: ""}

    if (request.headers['content-type'] !== 'application/json') {

        response_object.msg = "Content-Type must be application/json"
        return response.status(400).json(response_object);
      }


    const { bank, currency, id, nickname, externaltoken, gameid} = request.body

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