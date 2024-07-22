const socket = require("socket.io")
const SlotGame = require("../base/game.config");
const make_api_request = require("../helpers/httpClient");
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
   
                const new_api_request = await make_api_request(endpoint)
                cb?.(new_api_request)

            })

            socket.on("spin", async (data, cb) => {

                console.log("SPIN RECEIVED:", data, "session:", socket.user)

                const { requestedLines, bet } = data

                if (!bet) {

                    cb?.("Bet amount is not enough to spin")
                    return
                }

                const round = new SlotGame(data.gameId, socket.user, bet)
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