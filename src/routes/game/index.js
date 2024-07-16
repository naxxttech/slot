const express = require("express")
const router = express.Router()

const SlotGame = require("@src/base/game.config")

router.get("/:gameId", async (request, response) => {


    const requested_gameId = request.params.gameId
    
    if (!requested_gameId) {

        return response.status(400).json({ message: "No game ID specified."})
    }
 
    const requestedPaylines = 25
    const game = new SlotGame(requested_gameId)
    const data = await game.generate_game_table(requestedPaylines)

    response.status(200).json(data)

})




module.exports = router
