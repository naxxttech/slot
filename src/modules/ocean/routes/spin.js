const express = require("express")
const router = express.Router()
const Game = require("@src/base/config")



router.get("/spin", async (request, response) => { 

     const requested_gameId = 54
     const requestedPaylines = 20
     const oceanGame = new Game(requested_gameId)
     const data = await oceanGame.generate_game_table(3, 5, requestedPaylines)

     response.status(200).json(data)

})



module.exports = router