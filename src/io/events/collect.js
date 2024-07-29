const { update_game_history } = require("../../db/models/GameHistory")
const handleErrorsIfAny = require("../helpers/handle.socket.errors")


const collect = (socket) => {


    socket.on("collect", async (data, cb) => {
        
        await handleErrorsIfAny(async () => {

        console.log("COLLECT RECEIVED:", data, "socket ID:", socket.request.session)

        // const { id, user_id, gameid } = socket.request.session



        const { entryId } = data

        if (!entryId) {
            throw new Error("EntryId is required")
        }

        const result = await update_game_history(entryId)


    }, socket, cb)

 })
}



module.exports = collect