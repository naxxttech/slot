const mongoose = require("mongoose")


const db_atlas_uri = process.env.MONGO_URI_CLOUD
const db_local_uri = process.env.MONGO_URI_DEV
const db_test_uri = process.env.MONGO_URI_TESTSV

const make_db_connection = () => {

        // const DB_URI = `mongodb://${db_username}:${db_password}@${db_host}:${db_port}/slotdb`
        mongoose.connect(db_local_uri).then(() => {

            console.log("Connected to database successfully")

        }).catch(error => {

            console.log("Database connection error")
            console.log(error)
        })


  

}



module.exports = make_db_connection