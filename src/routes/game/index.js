const express = require("express")
const router = express.Router()

// const SlotGame = require("@src/base/game.config")
const SlotGame = require("../../base/game.config")

router.get("/:gameId", async (request, response) => {


    const gameId = request.params.gameId
    
    if (!gameId) {

        return response.status(400).json({ message: "No game ID specified."})
    }
 
    const requestedPaylines = 25
    const spin = new SlotGame(gameId)
    const spinResult = await spin.game_get_config(requestedPaylines)
    console.log("valid istance:", spinResult)
    // const gameResult = await game.generate_game_table(requestedPaylines)

    response.status(200).json(spinResult)

})




module.exports = router
