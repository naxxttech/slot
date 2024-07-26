const { get_session } = require("../../db/models/Session")

const extend_session = async (socket, sessionId) => {

    const session_object = await get_session(sessionId)

    if (session_object.code === 200) {

        const { user_id, gameid, currency } = session_object.resource
        // create socket session here
        socket.request.session = { id: sessionId, user_id, gameid, currency }
       // expiresAt'ı güncelle
       const newExpiryDate = new Date(Date.now() + 20 * 60 * 1000); // 20 dk
       session_object.resource.expiredAt = newExpiryDate
       await session_object.resource.save()

       console.log(`[${sessionId}] extended`)

       return true

    } else {

        throw new Error(`Session ID: ${sessionId} could not found. It might expired.`)
    }
}



module.exports = extend_session