const SlotGame = require("../../base/game.config")

const handleSpin = (socket) => {


    socket.on("spin", async (data, cb) => {

        console.log("SPIN RECEIVED:", data, "session:", socket.user)

        const { requestedLines, bet } = data

        if (!bet) {

            cb?.("Bet amount is not enough to spin")
            return
        }

        const round = new SlotGame(data.gameId, socket.user, bet)
        const roundResult = await round.start_game(requestedLines)

        cb?.(roundResult)

    })
}


module.exports = handleSpin