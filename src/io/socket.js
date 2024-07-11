const socket = require("socket.io")

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

        // events
        io.on("connection", (socket) => {
            console.log("connected - connection id:", socket.id)

            socket.on("disconnect", () => {

                console.log("User just disconnect")
            })

        })


}



module.exports = initializeSocket