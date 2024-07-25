
const make_api_request = require("../../helpers/httpClient");

const handleBalance = (socket) => {

    const { id } = socket.request.session.user
    
    socket.on("fetchBalance", async (cb) => {

        const betAPI = process.env["BETAPI"]
        const endpoint = `${betAPI}/api/balance/GetBalance?CasinoId=1&PlayerId=${id}&SessionId=${socket.request.session.id}`

        const new_api_request = await make_api_request(endpoint)
        cb?.(new_api_request)

    })
}



module.exports = handleBalance