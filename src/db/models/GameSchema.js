const mongoose = require("mongoose");

const { Schema } = mongoose;




// const DataSchema = require("./Relation")
const GameSchema = new Schema({
  
    gameId: { type: String, required: true }, // Game ID or reference
    gameName: { type: String, required: true }, 
    paylines: { type: [[Number | String]] },  // Array of arrays representing paylines
    rows: { type: Number, default: 5},
    cols: { type: Number, default: 3},
    reels: [

            { 
                id: Number, 
                name: String,
                probability: { type: String, default: "0.5"}
            }
    ],
    // validation for vol: high, medium
    volalitiy: { type: String, default: "low"}

}, {

    timestamps: true
});



const model = mongoose.model('Game', GameSchema);



// methods

/** Gets all games. */
const getAllGames = async () => {

    const data = {

        code: 200,
        message: "",
        resource: null
    }

    try {

        const games_object = await model.find()
        
        data.message = "OK"
        data.resource = games_object

    } catch (error) {

        console.log("[ALL GAMES] Error", error)
        data.code = 500
        data.message = "Something went wrong please try again in 5 minutes."
    }


    return data
}

/**
* Gets requested game resource.
* @param {number} gameId - The game ID.
*/
const getGameById = async (gameId) => {



    const init = {

        code: 200,
        message: "",
        resource: null
    }

    if (!gameId) {
        
        init.code = 400
        init.message = "Missing Data: gameId"
        return init
    }

    try {

        const game_object = await model.findOne({ gameId })

        if (game_object === null) {

            init.code = 404
            init.message = "Could not find requested resource."
   

        } else {

            init.message = "Resource found."
            init.resource = game_object
        }

    } catch (error) {

        console.log("[GET GAME] Error", error)

        init.code = 500
        init.message = "Something went wrong please try again in 5 minutes."
    }

    return init
}


const deleteGameById = async (gameId) => {

    const init = {

        code: 200,
        message: "",
        resource: null
    }

    if (!gameId) {
        
        init.code = 400
        init.message = "Missing Data: gameId"
        return init
    }


    try {
        
        const game_object = await model.findOne({ gameId })

        if (game_object === null) {

            init.code = 404
            init.message = "Could not find requested resource."
   

        } else {

            init.message = "Resource found and has been deleted."
            await game_object.deleteOne()
        }

    } catch (error) {

        console.log("[DELETE GAME] Error", error)

        init.code = 500
        init.message = "Something went wrong please try again in 5 minutes."
    }

    return init
}


/**
 * @typedef {Object} Reel
 * @property {number} id - The ID of the reel.
 * @property {string} name - The name of the reel.
 * @property {string} probability - The probability rate of the reel. Default is 0.5
 */

/**
 * Creates a new game.
 * @param {Object} gameData - The game data.
 * @param {number} gameData.rows - The number of rows in the game.
 * @param {number} gameData.cols - The number of columns in the game.
 * @param {Array<Reel>} gameData.reels - The reels data accepts two params id and name
 * @returns {Object} an object that contains success result data or not
 */
const create_new_game = async (body) => {

    const init_data = {

        code: 400,
        message: "",
        resource:{}
    }

    if (!body.gameName) {

        init_data.message = "Game Name is required"
        return init_data
    }

    const array_symbol = []

    for (const key in body) {
        
        if (body.hasOwnProperty(key) && key.startsWith('card-')) {
            array_symbol.push({ id: Math.floor(Math.random() * 10000), name: body[key] });
        }
    }

     /* VALIDATION BURADA BAŞLAR */
    try {

        const random_game_id = Math.floor(Math.random() * 2341213)
       
        const payload = {

            gameId: random_game_id,
            gameName: body.gameName,
            volalitiy: body.volalitiy,

        }

        if (array_symbol.length) payload.reels = array_symbol
        
        const new_game = await model.create(payload)

        init_data.code = 201
        init_data.message = "Resource created successfully"
        init_data.resource = new_game

    } catch (error) {
        console.log("[CREATE GAME] Error", error)
        init_data.code = 500,
        init_data.message = "Something went wrong while creating resource please try again in 5 minutes."
    }
 

    return init_data
}

/**
* Sets the volatility of the resource.
* @param {model} resource - The Mongoose schema.
* @param {string} new_volatility - The new volatility value low | medium | high.
* @returns {object | null}
*/
const update_game = async (new_entries) => {

    console.log("[update_game] entries:", new_entries)

    const init_data = {

        code: 201,
        message: "",
        resource: null
    }

    // add paytable validation later
    const { gameId, gameName, volalitiy, paytable } = new_entries

    if (!gameName || !volalitiy) {

        init_data.code = 400
        init_data.message = "All fields must be filled."
        return init_data
    }

    if (!["low", "medium", "high"].includes(volalitiy)) {

        init_data.code = 400
        init_data.message = "Provided volality is not valid"
        return init_data
    }

     const new_doc = await model.findOneAndUpdate({ gameId: gameId}, new_entries, { new: true })
   

    init_data.message = "Succesfully updated"
    init_data.resource = new_doc

    return init_data
}

module.exports = { getAllGames, getGameById, create_new_game, update_game, deleteGameById, model: GameSchema }