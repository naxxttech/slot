const { update_game_history } = require("../../db/models/GameHistory")
const handleErrorsIfAny = require("../helpers/handle.socket.errors")


const triggerGamble = (socket) => {


    socket.on("canGamble", async (data, cb) => {
        
         handleErrorsIfAny(async () => {

         const { entryId } = data

         const operationResult = await update_game_history(entryId, "gamble")
         
         return { status: operationResult }

     

        }, socket, cb)

 })
}



module.exports = triggerGamble