const SlotGame = require("../../base/game.config")
const extend_session = require("../helpers/extend.session")
const handleErrorsIfAny = require("../helpers/handle.socket.errors")


const handleSpin = (socket) => {


    socket.on("spin", async (data, cb) => {
        
        await handleErrorsIfAny(async () => {

        console.log("SPIN RECEIVED:", data, "socket ID:", socket.request.session)

        const { id, user_id, gameid } = socket.request.session

        await extend_session(socket, id)

        const { requestedLines, bet } = data

        /*
        if (!bet) {

            cb?.("Bet amount is not enough to spin")
            return
        }
        */
       
        const round = new SlotGame(gameid, user_id, bet)
        const roundResult = await round.start_game(requestedLines)
            
        return roundResult
    }, socket, cb)

 })
}


module.exports = handleSpin