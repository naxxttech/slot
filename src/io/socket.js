const socket = require("socket.io")
const path = require('node:path');
const fs = require('node:fs');

// events
const collect = require("./events/collect");
const spin = require("./events/spin")
const balance = require("./events/balance")
const disconnect = require("./events/disconnect")
const triggerGamble = require("./events/gamble");
const playGamble = require("./events/playGamble");

// helpers
const extend_session = require("./helpers/extend.session")
const handleErrorsIfAny = require("./helpers/handle.socket.errors")
const { get_game_history } = require("../db/models/GameHistory");





const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);


		//client.on(event.name, (...args) => event.execute(...args));
	
}

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
            
          console.log("event:", eventFiles)

          await handleErrorsIfAny(async () => {

            const { id } = socket.handshake.auth
            console.log("[connection] socket received session id:", id)
            console.log("socket session:", socket.request?.session)

            const session = await extend_session(socket, id)
                
            if (session) {
                        
                        // get user data
                        // test user
                        const user_data = {

                             user_id: socket.request.session.user_id,
                             user_nickname: socket.request.session.user_nickname || "Random Test User",
                             currency: socket.request.session.currency,
                             balance: 1421
                        }
                        
                        // send user data such as game history, id etc.
                        const game_history = await get_game_history(socket.request.session.gameid)
                        user_data.history = game_history
                        
                        // will refactor those codes later.
                        socket.emit("userData", user_data)
                        //  balance(socket)
                        spin(socket)
                        collect(socket)
                        triggerGamble(socket)
                        playGamble(socket)
                        disconnect(socket)

            }
      
        }, socket)


   })


}


module.exports = initializeSocket