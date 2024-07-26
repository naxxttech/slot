const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const { Schema } = mongoose;

const createResponseObject = require("../../helpers/create.response");


// const DataSchema = require("./Relation")
const SessionSchema = new Schema({

    sessionId: { type: String, required: true }, 
    bank: { type: String, required: true},
    currency: { type: String, required: true },
    user_id: { type: String, required: true},
    user_nickname: { type: String },
    externaltoken: { type: String, required: true},
    gameid: { type: String, required: true},
    game_name: { type: String, required: true},
    expiredAt: { type: Date, default: new Date(Date.now() + 20 * 60 * 1000) }
}, {
    timestamps: true
})




const model = mongoose.model('Session', SessionSchema);



const create_session = async (body) => {

    try {

        body.sessionId = uuidv4();

        const session = new model(body)
        await session.save()

        return createResponseObject(201, "OK", session)
        
    } catch (error) {
        
        console.log("[Create Session] Error:", error)


        return createResponseObject(500, "Something went wrong")
    }
 
    
}




const get_session = async (sessionId) => {

    try {

        const session = await model.findOne({ sessionId })

        if (!session) {

            return createResponseObject(404, "Session is not found")
        }

        return createResponseObject(200, "OK", session)

    } catch (error) {
        
        console.log("[Get Session] Error:", error)
        return createResponseObject(500, "Something went wrong")
    }
 
    
}


const get_active_session = async (body) => {


    try {

        const session = await model.findOne({ user_id: body.user_id})
        // console.log("received body:", body)
        console.log("Found session:", session)

        if (!session) {

            return createResponseObject(404, "Session is not found or expired")
        }

          return createResponseObject(200, "OK", session)

    } catch (error) {
        
        console.log("[Find Session] Error:", error)

        return createResponseObject(500, "Something went wrong")
    }
 

}


module.exports = { create_session, get_session, get_active_session }