const socket = require("socket.io")
// events
const spin = require("./events/spin")
const balance = require("./events/balance")
const disconnect = require("./events/disconnect")
const { get_session } = require("../db/models/Session")

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
            console.log("[Socket] received session id:", id)

            const validate_session = await get_session(id)

            if (validate_session.code === 200) {

                const { user_id, gameid } = validate_session.resource
                // create socket session here
                socket.request.session = { id: id, user_id, gameid }
                console.log(`[Socket] - ${socket.request.session.id} - Player ID: ${user_id} Game ID: ${gameid} just connected`)

                // expiresAt'ı güncelle
                const newExpiryDate = new Date(Date.now() + 20 * 60 * 1000); // 20 dk
                validate_session.resource.expiredAt = newExpiryDate
                await validate_session.resource.save()
                
            } else {

                // session geçersiz bağlantıyı kapat
                //socket.emit('error', { message: validate_session.message });
                socket.disconnect()
                return
            }

            console.log("query result:", validate_session.resource)

      

      
            //  balance(socket)
             spin(socket)
             disconnect(socket)

        })


}


module.exports = initializeSocket