# Slot Game

This README file provides instructions for cloning and running the **Slot Game** project locally.

## Getting Started

Follow these steps to clone the project to your local environment.

### Prerequisites

- Node.js (version 14 or above)
- Docker

### Installation

1. **Clone the Project**

   ```bash
   git clone https://github.com/naxxttech/slot.git
   
2. **Navigate to the Project Directory**
   <p>Go to root directory of project</p>
   <p>Open terminal and type <b>npm install</b> </p>
   <p>After installation is done create .env file and paste those keys:</p>
   
      <pre><code>
      NODE_ENV=development
      PORT=3000
      MONGO_URI_DEV=mongodb://localhost:27017/dbname
      MONGO_URI_TESTSV=mongodb://test_server:27017/dbname
      MONGO_URI_CLOUD=""
      </code></pre>

   <p>Great, you set your env variables. Now, go to the `src/db/connect.js` file and specify which mongo uri connection you want to connect to mongo client.</p>

   ```js
   // JavaScript code for connecting to MongoDB
   const db_atlas_uri = process.env.MONGO_URI_CLOUD;
   const db_local_uri = process.env.MONGO_URI_DEV;
   const db_test_uri = process.env.MONGO_URI_TESTSV;
   
   // In this example we are connecting to the Atlas URI.
   const make_db_connection = () => {
       mongoose.connect(db_atlas_uri)
           .then(() => {
               // Connection successful
           })
           .catch(error => {
               // Handle connection error
           });
   }
 
3. **Run with Docker**
   <p>Open terminal and type</p>
   
   ```bash
   docker-compose up --build

  <p>This command will start the project within Docker containers.</p>
   
4. **Access the Application**
    <p>
        The application will run by default at http://localhost:4000. You can access it via your web browser or an HTTP client (e.g. Postman).
    </p>
