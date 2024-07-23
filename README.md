# Slot Game

This README file provides instructions for cloning and running the **Slot Game** project locally.

## Getting Started

Follow these steps to clone the project to your local environment.

### Prerequisites For Development

1. [Node.js](https://nodejs.org/)
2. [MongoDB](https://www.mongodb.com/try/download/community) (If you do not want to download locally you can use mongo's cloud service)
3. [Docker](https://www.docker.com/) (**Optional**)

### Installation

1. **Clone the Project**

   ```bash
   git clone https://github.com/naxxttech/slot.git
   
2. **Navigate to the Project Directory**
   <p>Go to root directory of project</p>
   <p>Open terminal and type</p>
   
   ```bash
    npm install
   ```
   
   <p>After installation is done create .env file and paste those keys:</p>
   <p><b>Note: If you use cloud service then you need to type your access key to MONGO_URI_CLOUD field</b></p>

      ```env
      NODE_ENV=development
      PORT=3000
      MONGO_URI_DEV=mongodb://localhost:27017/dbname
      MONGO_URI_TESTSV=mongodb://test_server:27017/dbname
      MONGO_URI_CLOUD=""
      BETAPI=https://ostageapi.mbit24.com/
      COOKIESCT=uhamzcvQeRtquWx12!a_vyhm
      AUTHHEADER=myname
      ```

   <p>Great, you set your env variables. Now, go to the `src/db/connect.js` file and specify which mongo uri connection you want to connect to mongo client.</p>

   ```js
   // URI options for connecting to MongoDB. These options comes from your .env file.
   const db_atlas_uri = process.env.MONGO_URI_CLOUD;
   const db_local_uri = process.env.MONGO_URI_DEV;
   const db_test_uri = process.env.MONGO_URI_TESTSV;
   
   // In this example we are connecting to the Atlas URI.
   const make_db_connection = () => {
       mongoose.connect(db_atlas_uri)   // < Just change this line
           .then(() => {
               //...
           })
           .catch(error => {
               // ...
           });
   }
   ```
   ### WebSocket Configuration
   <p>In order to interact with API from client side you must send sessionId and playerId as payload on WebSocket.</p>
   
   ```html
        <script>
                 // socket configuration
                  const socket = io({
                      auth: {
                          sessionId: "jmkqikvucqw2z93",
                          playerId: "frmtest"
                      }
                  });
   
                 // get user balance
                 socket.emit("fetchBalance", (args) => { /* handle args here*/ }

                 const payload = {
                       requestedLines: 10,
                       gameId: "your game id",
                       bet: 100
                }
   
                 // handle spin and get win / lose / bet results 
                socket.emit("spin", payload, (args) => {}
   
        </script>
    ```
   
   <p>🚀 That's all. Now, run project on your localhost</p>
   <p>Open terminal and type one of the commands below</p>
   
   ```bash
       npm run dev or npm start
   ```

### Run with Docker
   <p><b>Note: This process only for production stage. If project still in development mode follow above steps.</b></p>
   <p>Open terminal and type</p>
   
   ```bash
     docker-compose up --build
   ```
  <p>That command will start the project within Docker containers.</p>
  
  **Access the Application**
    <p>
        The application will run by default at http://localhost:4000. You can access it via your web browser or an HTTP client (e.g. Postman).
    </p>
