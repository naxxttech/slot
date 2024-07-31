const PaymentProcessor = require("../../base/payment.config")
const { update_game_history } = require("../../db/models/GameHistory")


module.exports = {

    name: "collect",
    exe: async (socket, data, cb) => {

        console.log("COLLECT RECEIVED:", data, "socket ID:", socket.request.session)

        const { entryId } = data

        if (!entryId) {
            throw new Error("EntryId is required")
        }

        const operationResult = await update_game_history(entryId, "collect")

        const { user_id } = socket.request.session
        
        const balance = new PaymentProcessor()
        const userBalance = await balance.checkUserBalance(user_id)

        return { status: operationResult, balance: userBalance}

    }
}