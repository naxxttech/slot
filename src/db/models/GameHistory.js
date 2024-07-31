const mongoose = require("mongoose");

//const winTypes = ['win', 'lose', 'collected', 'gambleWin', 'gambleLose']

const types = {

    LOSE: 0,
    WIN: 1,
    COLLECTED: 2,
    GAMBLE: 3
  };

  const typesAsText = {
    0: 'LOSE',
    1: "WIN",
    2: "COLLECTED",
    3: "GAMBLE"
  };

const GameHistorySchema = new mongoose.Schema({

    IP: { type: String },
    status: { type: Number, enum: { values: Object.values(types), message: '{VALUE} is not a valid enum'}, required: true },
    game_id: { type: String, required: true},
    user_id: { type: String, required: true },
    user_name: { type: String},
    cells: { type: [[Number]], required: true },
    winningPaylines: { type: [], required: true},
    totalPayout: { type: Number, required: true},
    requestedLines: { type: Number },
    bet: { type: Number },
    gamble: { type: mongoose.Schema.Types.Mixed, default: [] },

}, {
    timestamps: true
})


// virtuals
GameHistorySchema.virtual('statusText')
  .get(function() {
    return typesAsText[this.status];
  });


const model = mongoose.model('Game History', GameHistorySchema);


const create_game_history = async (data, extra) => {


    try {

        const { status, winningPaylines, cells, totalPayout } = data
        const { gameId, userId, requestedLines, bet } = extra
        
        const statusAsEnum = types[status.toUpperCase()];

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


const update_game_history = async (_id, action) => {

    try {
        
        const history = await model.findById({_id: _id})

        switch (action) {

            case "gamble":
                history.status = types.GAMBLE
                break;

            case "win":
                history.status = types.WIN
                break;
                
            case "lose":
                history.status = types.LOSE
                break;
                
            case "collect":
                history.status = types.COLLECTED
                break;
            }

        await history.save()

        return history.status

    } catch (error) {

        console.log("Error while updating game history:", error)
        throw error
    }


}

const get_game_history = async (query, userId) => {


    try {

        let searchOptions = {}

        if (mongoose.Types.ObjectId.isValid(query)) {

            searchOptions._id = query;

        } else {

            searchOptions.game_id = query;

            if (userId) {

                searchOptions.user_id = userId
            }
        }


        // şimdilik en son oyunları al
        const history = await model.findOne(searchOptions).sort({ _id: -1}).select("status cells winningPaylines totalPayout gamble")
        return history

    } catch (error) {
        
        console.log("Error while getting game history:", error)
        throw error
    }
}




module.exports = { create_game_history, get_game_history, update_game_history, types }