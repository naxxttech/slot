const mongoose = require("mongoose");

const GameHistorySchema = new mongoose.Schema({

    win: { type: Boolean, required: true },
    game_id: { type: String, required: true},
    user_id: { type: String, required: true },
    user_name: { type: String},
    cells: { type: [[Number]], required: true },
    winningPaylines: { type: [], required: true},
    totalPayout: { type: Number, required: true},
    collected: { type: Boolean, default: false }


})



const model = mongoose.model('Game History', GameHistorySchema);


const create_game_history = async (data, extra) => {


    try {

        const { win, winningPaylines, cells, totalPayout } = data
        const { gameId, userId } = extra
        
        const entries = {

            win,
            game_id: gameId,
            user_id: userId,
            cells,
            winningPaylines,
            totalPayout
        }

        const history = new model(entries)
        await history.save()

    } catch (error) {
        
        console.log("Error while creating game history:", error)
        throw new Error("Error while creating game history")
    }
}



const get_game_history = async (gameId) => {


    try {

        // şimdilik en son oyunları al
        const history = await model.findOne({ game_id: gameId }).sort({ _id: -1}).select("win cells winningPaylines totalPayout -_id")

        if (history === null) {

            throw new Error("Could not find any history")
        }


        return history

    } catch (error) {
        
        console.log("Error while creating game history:", error)
        throw error
    }
}


module.exports = { create_game_history, get_game_history }