const { get_game_history } = require("../../db/models/GameHistory");
const { get_session } = require("../../db/models/Session");
const extend_session = require("./extend.session");

module.exports = {

    name: "connection",
    exe: async (socket) => {


        try {

            const { id } = socket.handshake.auth;
            console.log("[connection] socket received session id:", id);
            console.log("socket session:", socket.request?.session);

            const session = await get_session(id)

            const { resource } = session
            const { expiredAt } = resource

            const currentDate = new Date();

            if (new Date(expiredAt) < currentDate) {

                // throw new Error(`[Socket] Session: ${id} is expired.`)
            }
     

            // get user data
            const user_data = {

                    id: id,
                    user_id: resource.user_id,
                    user_nickname: resource.user_nickname || "Random Test User",
                    gameid: resource.gameid,
                    currency: resource.currency,
                    balance: 1421
            };


         
            socket.emit("userData", user_data)
            // send user data such as game history, id etc.
            const game_history = await get_game_history(socket.request.session.gameid, user_data.user_id);
            user_data.history = game_history;
            
            // extend session
            // await extend_session(socket, id);
            socket.request.session = user_data
            
        } catch (error) {
                    
            console.log("[Socket Connection] Error:", error)
            
        }
    }
}