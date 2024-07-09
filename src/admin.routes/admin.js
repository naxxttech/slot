const express = require("express")
const router = express.Router()
const { getAllGames, getGameById, create_new_game } = require("../db/models/GameSchema")

router.get("/", async (request, response) => {

    const context = {}
    const games_object = await getAllGames()

    context.games = games_object.resource

    response.render("admin/index", { title: "Admin Dashboard", data: context})
})


// game routes (CRUD)
router.get("/resource/all", async (request, response) => {


        const games_object = await getAllGames()

        return response.status(games_object.code).json(games_object)

})

router.get("/resource/get/:gameId", async (request, response) => {

    const { gameId } = request.params 

    const game_object = await getGameById(gameId)

    return response.status(game_object.code).json(game_object)

})



router.post("/resource/create/new/game", async (request, response) => {

    const { gameName, rows, cols, reels } = request.body

    const game_object = await create_new_game(request.body)

    return response.status(game_object.code).json(game_object)

   
})
module.exports = router