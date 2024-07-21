const socket = require("socket.io")
const SlotGame = require("../base/game.config")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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

            /*
            const token = socket.handshake.auth.token;
            
            if (!token) {
                return next(new Error('Token Error'));
            }
            
            jwt.verify(token, SECRET_KEY, (err, decoded) => {
                if (err) {
                    return next(new Error('Authentication error'));
                }
                
                // Token is valid, attach user info to socket object
                socket.user = decoded;
                next();
            });
            */

            const sessionId = socket.handshake.auth.sessionId
            const playerId = socket.handshake.auth.playerId

            if (!sessionId) {
                return next(new Error('Session ID Error'));
            }


            if (!playerId) {
                return next(new Error('Not valid Player ID'));
            }

            socket.user = { sessionId, playerId }
            next()
        });

        // events
        io.on("connection", (socket) => {
            
            console.log(`[${socket.user.sessionId}] -`, "User just connected")

            
            socket.on("fetchBalance", async (cb) => {

                const betAPI = process.env["BETAPI"]
                const endpoint = `${betAPI}/api/balance/GetBalance?CasinoId=1&PlayerId=${socket.user.playerId}&SessionId=${socket.user.sessionId}`
                const error_object = { code: null }
               
                try {
                    
                    const request = await fetch(endpoint)
                    error_object.code = request.status

                    if (request.status !== 200) {

                        throw new Error("Unable to connect service API")
                    }

                    const response = await request.json()
                    cb?.(response)

                } catch (error) {

                    console.log("[SERVICE ERROR] WS:", error, error_object)
                    error_object.message = "Unable to connect service APIs"
                    cb?.(error_object)
                }

            })

            socket.on("spin", async (data, cb) => {

                console.log("SPIN RECEIVED:", data, "session:", socket.user)

                const { requestedLines } = data
                const round = new SlotGame(data.gameId)
                const roundResult = await round.start_game(requestedLines)

                cb?.(roundResult)

            })

            socket.on("disconnect", () => {
                // user disconnect for some reason create game history in here
                console.log(`[${socket.user.sessionId}] -`, "User just disconnect")
            
            })

        })


}


module.exports = initializeSocket