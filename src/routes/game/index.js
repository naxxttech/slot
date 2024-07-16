const express = require("express")
const router = express.Router()

// const SlotGame = require("@src/base/game.config")
const SlotGame = require("../../base/game.config")

router.get("/:gameId", async (request, response) => {


    const requested_gameId = request.params.gameId
    
    if (!requested_gameId) {

        return response.status(400).json({ message: "No game ID specified."})
    }
 
    // testId
    const testGameId = 54

    const requestedPaylines = 25
    const game = new SlotGame(testGameId)
    const gameResult = await game.generate_game_table(requestedPaylines)

    console.log("DATA:", gameResult)

    response.status(200).json(gameResult)

})




module.exports = router
