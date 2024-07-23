const socket = require("socket.io")
// events
const spin = require("./events/spin")
const balance = require("./events/balance")
const disconnect = require("./events/disconnect")


const initializeSocket = (server) => {
        // socket config
        const io = new socket.Server(server, {

                /*
                cors: {
                    origin: "FRONTEND ORIGIN HERE",
                    methods: ["GET", "POST"]
                }
                */
        })

        // Middleware for secured connection
        io.use((socket, next) => {

            const sessionId = socket.handshake.auth.sessionId
            const playerId = socket.handshake.auth.playerId

            if (!sessionId) {
                socket.disconnect()
                return next(new Error('Session ID Error'));
            }


            if (!playerId) {
                socket.disconnect()
                return next(new Error('Not valid Player ID'));
            }

            socket.user = { sessionId, playerId }
            next()
        });

        // events
        io.on("connection", (socket) => {
            
            console.log(`[${socket.user.sessionId}] -`, "User just connected")

            balance(socket)
            spin(socket)
            disconnect(socket)

        })


}


module.exports = initializeSocket