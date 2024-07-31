const { get_game_history } = require("../../db/models/GameHistory");
const extend_session = require("./extend.session");

module.exports = {

    name: "connection",
    exe: async (socket) => {


        try {

            const { id } = socket.handshake.auth;
            console.log("[connection] socket received session id:", id);
            console.log("socket session:", socket.request?.session);

            const session = await extend_session(socket, id);

            if (session) {
                // get user data
                const user_data = {
                    user_id: socket.request.session.user_id,
                    user_nickname: socket.request.session.user_nickname || "Random Test User",
                    currency: socket.request.session.currency,
                    balance: 1421
                };

                // send user data such as game history, id etc.
                const game_history = await get_game_history(socket.request.session.gameid);
                user_data.history = game_history;
            }

            
        } catch (error) {
                    
            console.log("[Socket Connection] Error:", error)
            
        }
    }
}