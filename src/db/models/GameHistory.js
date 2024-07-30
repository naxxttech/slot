const mongoose = require("mongoose");

//const winTypes = ['win', 'lose', 'collected', 'gambleWin', 'gambleLose']

const winTypes = {

    LOSE: 0,
    WIN: 1,
    COLLECTED: 2
  };

  const winTypesAsText = {
    0: 'LOSE',
    1: "WIN",
    2: "COLLECTED"
  };

const GameHistorySchema = new mongoose.Schema({

    IP: { type: String },
    status: { type: Number, enum: { values: Object.values(winTypes), message: '{VALUE} is not a valid enum'}, required: true },
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


// virtuals
GameHistorySchema.virtual('statusText')
  .get(function() {
    return winTypesAsText[this.status];
  });


const model = mongoose.model('Game History', GameHistorySchema);


const create_game_history = async (data, extra) => {


    try {

        const { status, winningPaylines, cells, totalPayout } = data
        const { gameId, userId, requestedLines, bet } = extra
        
        const statusAsEnum = winTypes[status.toUpperCase()];

        const entries = {

            status: statusAsEnum,
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

        const instance = model.findById(history._id).select("-__v -bet -requestedLines -totalPayout")

        return instance

    } catch (error) {
        
        console.log("Error while creating game history:", error)
        throw new Error("Error while creating game history")
    }
}


const update_game_history = async (_id) => {

    try {
        
        const history = await model.findById({_id: _id})
        history.status = winTypes.COLLECTED
        await history.save()

        return history.status

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