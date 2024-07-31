
module.exports = {

    name: "disconnect",
    exe: (socket) => {

        const { id, user_id, gameid } = socket.request.session
        console.log(`[Socket] - ${id}  Player ID: ${user_id} Game ID: ${gameid} just disconnect`)
    }

}