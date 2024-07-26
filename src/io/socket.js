const socket = require("socket.io")
// events
const spin = require("./events/spin")
const balance = require("./events/balance")
const disconnect = require("./events/disconnect")
const extend_session = require("./helpers/extend.session")
const handleErrorsIfAny = require("./helpers/handle.socket.errors")


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
   



        // events
        io.on("connection", async (socket) => {
            


          await handleErrorsIfAny(async () => {

            const { id } = socket.handshake.auth
            console.log("[connection] socket received session id:", id)
            console.log("socket session:", socket.request?.session)

            const result = await extend_session(socket, id)
                
            if (result) {

                        // user datasını gönder, history vs.
                        socket.emit("userData", {})
                        //  balance(socket)
                        spin(socket)
                        disconnect(socket)

            }
      
        }, socket)


   })


}


module.exports = initializeSocket