const express = require("express")
const router = express.Router()

const secureAuth = require("../../middlewares/secure-auth")
const { create_session, get_session, get_active_session } = require("../../db/models/Session")

router.get("/check-session", async (request, response) => {

    const { sessionId } = request.query

    
    if (sessionId) {

        const session = await get_session(sessionId)

        return response.status(session.code).json(session)
    }


    return response.status(400).json({ message: "Invalid request query."})
   

})

router.post("/create-session", secureAuth, async (request, response) => {

    const response_object = { msg: "", sessionId: ""}

    if (request.headers['content-type'] !== 'application/json') {

        response_object.msg = "Content-Type must be application/json"
        return response.status(400).json(response_object);
      }


    const { bank, currency, id, name, nickname, externaltoken, gameid} = request.body

    if (!bank || !currency || !id || !externaltoken || !gameid || !name) {

        response_object.msg = "Invalid or missing parameters."
        return response.status(400).json(response_object)
    }


    const payload = { ...request.body }

    if (nickname) {
        payload.user_nickname = nickname
    
    }

    payload.user_id = id
    payload.game_name = name
    delete payload.id
    delete payload.name


    // do this user already have session? 
    const user_session = await get_active_session(payload)

    if (user_session.code != 404) {

        return response.status(user_session.code).json({ message: user_session.message, sessionId: user_session.resource.sessionId })
    }

    const new_session = await create_session(payload)

    if (new_session.code === 201) {

        return response.status(new_session.code).json({ message: new_session.message, sessionId: new_session.resource.sessionId })

    } else {

        return response.status(new_session.code).json(new_session)
    }
})



module.exports = router