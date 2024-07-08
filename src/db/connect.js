const mongoose = require("mongoose")

const db_username = process.env.MONGO_INITDB_ROOT_USERNAME
const db_password = process.env.MONGO_INITDB_ROOT_PASSWORD
const db_host = process.env.DB_HOST
const db_port = process.env.DB_PORT
const db_atlas_uri = process.env.URI

const make_db_connection = () => {

        console.log("U:", db_username, "P:", db_password, "port:", db_port)
        // const DB_URI = `mongodb://${db_username}:${db_password}@${db_host}:${db_port}/slotdb`
        mongoose.connect(db_atlas_uri).then(() => {

            console.log("Connected to database successfully")

        }).catch(error => {

            console.log("Database connection error")
            console.log(error)
        })


  

}



module.exports = make_db_connection