
const make_api_request = require("../../helpers/httpClient");

const handleBalance = (socket) => {


    socket.on("fetchBalance", async (cb) => {

        const betAPI = process.env["BETAPI"]
        const endpoint = `${betAPI}/api/balance/GetBalance?CasinoId=1&PlayerId=${socket.user.playerId}&SessionId=${socket.user.sessionId}`

        const new_api_request = await make_api_request(endpoint)
        cb?.(new_api_request)

    })
}



module.exports = handleBalance