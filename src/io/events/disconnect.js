

const handleDisconnect = (socket) => {

    const { id } = socket.request.session.user

    socket.on("disconnect", () => {
        // user disconnect for some reason create game history in here
        console.log(`[${socket.request.session.id}] - Player ID: ${id} jusr disconnect`)
    
    })
}



module.exports = handleDisconnect