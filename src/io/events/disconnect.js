

const handleDisconnect = (socket) => {

    const { id, user_id, gameid } = socket.request.session

    socket.on("disconnect", () => {
        // user disconnect for some reason create game history in here
        console.log(`[Socket] - ${id}  Player ID: ${user_id} Game ID: ${gameid} just disconnect`)
    
    })
}



module.exports = handleDisconnect