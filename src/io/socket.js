const socket = require("socket.io")
const path = require('node:path');
const fs = require('node:fs');


// helpers
const handleErrorsIfAny = require("./helpers/handle.socket.errors")
const handleSocketConnection = require("./helpers/handle.socket.connection");


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
            
          await handleErrorsIfAny(() => handleSocketConnection.exe(socket), socket)

          const eventsPath = path.join(__dirname, 'events');
          const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

          for (const file of eventFiles) {

                 const filePath = path.join(eventsPath, file);

                            const event = require(filePath);
                          
                            if (event.name && socket.connected) {

                                // console.log(event.name, "event is active")
                                socket.on(event.name, (data, cb) => handleErrorsIfAny(() => event.exe(socket, data, cb), socket, cb));
              
                          }
                          
                  }
        

            })
        
    }
      



module.exports = initializeSocket