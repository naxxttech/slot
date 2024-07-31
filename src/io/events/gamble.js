const { update_game_history } = require("../../db/models/GameHistory")



module.exports = {
    
    name: "gamble",
    exe: async (socket, data, cb) => {

        const { entryId } = data

        const operationResult = await update_game_history(entryId, "gamble")
        
        return { status: operationResult }
    }
}