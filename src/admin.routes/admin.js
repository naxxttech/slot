const express = require("express")
const router = express.Router()
const GameSchema = require("../db/models/GameSchema")

router.get("/", async (request, response) => {
    console.log("TETİK GET")
    const context = {}
    const Games = await GameSchema.find()

    context.games = Games

    response.render("admin/index", { title: "Admin Dashboard", data: context})
})


// game routes (CRUD)
router.get("/resource/all", async (request, response) => {


    try {

        const games = await GameSchema.find()
        return response.status(200).json(games)
        
    } catch (error) {

        console.log("[ALL GAMES] Error", error)
        return response.status(500).json({ message: "Something went wrong please try again in 5 minutes."})
    }

})

router.get("/resource/get/:gameId", async (request, response) => {

    const { gameId } = request.params 

    
    try {

        const game = await GameSchema.findOne({ gameId })

        if (game === null) {

            return response.status(404).json({ message: "Could not find requested resource."})
        }

        return response.status(200).json(game)
    
    } catch (error) {

        console.log("[GET GAME] Error", error)
        return response.status(500).json({ message: "Something went wrong please try again in 5 minutes."})
    
    }

})



router.post("/resource/create/new/game", async (request, response) => {

    const { gameName, rows, cols, reels } = request.body

    const gameId = Math.floor(Math.random() * 2341213)

   

    try {

        const new_game = await GameSchema.create({ gameId, gameName, rows, cols, reels})
        return response.status(201).json(new_game)

    } catch (error) {

        console.log("[CREATE GAME] Error", error)
        return response.status(500).json({ message: "Something went wrong while creating resource please try again in 5 minutes."})
    }

   
})
module.exports = router