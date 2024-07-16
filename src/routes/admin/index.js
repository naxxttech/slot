const express = require("express")
const router = express.Router()

const { getAllGames, getGameById, create_new_game, update_game } = require("../../db/models/GameSchema")



router.get("/", async (request, response) => {

    const context = {}
    const games_object = await getAllGames()

    context.games = games_object.resource

    response.render("admin/index", { 
        title: "Admin Dashboard", 
        data: context,
        link: response.locals.prefix
    })
})


// this route gets all game entities
router.get("/resource/all", async (request, response) => {


        const games_object = await getAllGames()

        return response.status(games_object.code).json(games_object)

})




// this route gets game entity
router.get("/resource/get/:gameId", async (request, response) => {

    const { gameId } = request.params 
    const { data } = request.query

    const game_object = await getGameById(gameId)

    if (data === "raw") {

        const context = {}
        const games_objects = await getAllGames()

        context.games = games_objects.resource
        context.game = game_object

        return response.status(200).render("admin/resource_detail", { 
            title: "Admin Dashboard", 
            data: context,
            link: response.locals.prefix
        })

    } else {

        return response.status(game_object.code).json(game_object)
    }


})

// this route gets create game view
router.get("/resource/create/new/item", async (request, response) => {

    const context = {}
    const games_object = await getAllGames()
    context.games = games_object.resource

    response.render("admin/add_resource", 
        { 
          title: "Admin Dashboard", 
          data: context, 
          link: response.locals.prefix
        })

   
})


// this route updates game entities
router.post("/resource/get/:gameId/set/items", async (request, response) => {
    
    
    const { gameId } = request.params

   
    const game_object = await getGameById(gameId)

    if (game_object.code != 200) {

        return response.status(game_object.code).redirect(`/admin/resource/get/${game_object.resource.gameId}?data=raw`)

    } else {

        const new_game_object = await update_game(request.body)

        // eğer update atarken bir sorun olmuşsa
        if (new_game_object.code != 201) {

            response.locals.error = new_game_object.message;
        } else {

            response.locals.success = new_game_object.message
        }

        return response.status(new_game_object.code).redirect(`/admin/resource/get/${game_object.resource.gameId}?data=raw`)
    }
})





// this route creates new game entity
router.post("/resource/create/new/item", async (request, response) => {


    const game_object = await create_new_game(request.body)

    return response.status(game_object.code).json(game_object)

   
})



module.exports = router