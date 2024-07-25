const SlotGame = require("../../base/game.config")

const handleSpin = (socket) => {


    socket.on("spin", async (data, cb) => {

        console.log("SPIN RECEIVED:", data)

        const { gameid } = socket.request.session.user
        const playerId = socket.request.session.user.id

        const { requestedLines, bet } = data

        /*
        if (!bet) {

            cb?.("Bet amount is not enough to spin")
            return
        }
        */
       
        const round = new SlotGame(gameid, playerId, bet)
        const roundResult = await round.start_game(requestedLines)

        cb?.(roundResult)

    })
}


module.exports = handleSpin