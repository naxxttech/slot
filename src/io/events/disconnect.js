

const handleDisconnect = (socket) => {

    socket.on("disconnect", () => {
        // user disconnect for some reason create game history in here
        console.log(`[${socket.user.sessionId}] -`, "User just disconnect")
    
    })
}



module.exports = handleDisconnect