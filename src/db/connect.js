const mongoose = require("mongoose")
const URI = process.env["MONGOURI"]


const make_db_connection = () => {

        
        mongoose.connect(URI).then(() => {

            console.log("Connected to database successfully")

        }).catch(error => {

            console.log("Database connection error")
            console.log(error)
        })


  

}



module.exports = make_db_connection