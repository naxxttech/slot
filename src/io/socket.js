const socket = require("socket.io")
// events
const spin = require("./events/spin")
const balance = require("./events/balance")
const disconnect = require("./events/disconnect")

const initializeSocket = (server, sessionMiddleWare) => {
        // socket config
        const io = new socket.Server(server, {

                /*
                cors: {
                    origin: "FRONTEND ORIGIN HERE",
                    methods: ["GET", "POST"]
                }
                */
        })

        // use session
        io.engine.use(sessionMiddleWare)
   
        // Middleware for secured connection
        /*
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
        */

        io.use((socket, next) => {

                const user = socket.request.session.user
            

                if (!user) {

                    return next(new Error('Not valid Session'));
                }
          
                console.log("SESSION OBJECT IN SOCKET:", socket.request.session)
                next()
        })
        
        // events
        io.on("connection", (socket) => {

            const { id } = socket.request.session.user
            console.log(`[SOCKET] Session: [${socket.request.session.id}] - Player ID: ${id} just connected`)

             balance(socket)
             spin(socket)
            // disconnect(socket)

        })


}


module.exports = initializeSocket