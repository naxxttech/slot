const socket = require("socket.io")
const SlotGame = require("../base/game.config")

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
            
            console.log(`[${socket.id}] -`, "User just connected")


            socket.on("spin", async (data, cb) => {

                console.log("SPIN RECEIVED:", data)

                const { requestedLines } = data
                const requested_game = new SlotGame(data.gameId)
                const game_data = await requested_game.generate_game_table(requestedLines)

                cb?.(game_data)

            })

            socket.on("disconnect", () => {
                // user disconnect for some reason create game history in here
                console.log(`[${socket.id}] -`, "User just disconnect")
            
            })

        })


}


module.exports = initializeSocket