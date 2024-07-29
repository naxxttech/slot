const mongoose = require("mongoose");

const winTypes = ['win', 'lose', 'collected', 'gambleWin', 'gambleLose']

const GameHistorySchema = new mongoose.Schema({

    IP: { type: String },
    win: { type: String, enum: { values: winTypes, message: '{VALUE} is not a valid enum'}, required: true },
    game_id: { type: String, required: true},
    user_id: { type: String, required: true },
    user_name: { type: String},
    cells: { type: [[Number]], required: true },
    winningPaylines: { type: [], required: true},
    totalPayout: { type: Number, required: true},
    requestedLines: { type: Number },
    bet: { type: Number }

}, {
    timestamps: true
})


const model = mongoose.model('Game History', GameHistorySchema);


const create_game_history = async (data, extra) => {


    try {

        const { status, winningPaylines, cells, totalPayout } = data
        const { gameId, userId, requestedLines, bet } = extra
        
        const entries = {

            win: status,
            game_id: gameId,
            user_id: userId,
            cells,
            winningPaylines,
            totalPayout,
            requestedLines,
            bet
        }

        const history = new model(entries)
        await history.save()

        return history._id

    } catch (error) {
        
        console.log("Error while creating game history:", error)
        throw new Error("Error while creating game history")
    }
}


const update_game_history = async (_id) => {

    try {
        
        const history = await model.findById({_id: _id})
        history.win = "collected"
        await history.save()

        return history.win

    } catch (error) {

        console.log("Error while updating game history:", error)
        throw error
    }


}

const get_game_history = async (gameId) => {


    try {

        // şimdilik en son oyunları al
        const history = await model.findOne({ game_id: gameId }).sort({ _id: -1}).select("win cells winningPaylines totalPayout")

        return history

    } catch (error) {
        
        console.log("Error while creating game history:", error)
        throw error
    }
}





module.exports = { create_game_history, get_game_history, update_game_history }