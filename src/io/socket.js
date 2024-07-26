const socket = require("socket.io")
// events
const spin = require("./events/spin")
const balance = require("./events/balance")
const disconnect = require("./events/disconnect")
const { get_session } = require("../db/models/Session")
const extend_session = require("./helpers/extend.session")

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
            
            const { id } = socket.handshake.auth
            console.log("[connection] socket received session id:", id)

            await extend_session(socket, id)
                
            // user datasını gönder, history vs.
            socket.emit("userData", {})
            console.log("trg")
            console.log("socket session:", socket.request.session)

      

            //  balance(socket)
             spin(socket)
             disconnect(socket)

        })


}


module.exports = initializeSocket