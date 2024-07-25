const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const { Schema } = mongoose;




// const DataSchema = require("./Relation")
const SessionSchema = new Schema({

    sessionId: { type: String, required: true }, 
    bank: { type: String, required: true},
    currency: { type: String, required: true },
    user_id: { type: String, required: true},
    user_nickname: { type: String },
    externaltoken: { type: String, required: true},
    gameid: { type: String, required: true},
    expiredAt: { type: Date, default: new Date(Date.now() + 20 * 60 * 1000) }
}, {
    timestamps: true
})




const model = mongoose.model('Session', SessionSchema);



const create_session = async (body) => {

    const response_object = { code: null, message: "", resource: null }

    try {

        body.sessionId = uuidv4();

        const session = new model(body)
        await session.save()


        response_object.code = 201
        response_object.message = "OK"
        response_object.resource = session
        
    } catch (error) {
        
        console.log("[Create Session] Error:", error)

        response_object.code = 500
        response_object.message = "Something went wrong"
    }
 
    
    return response_object
}




const get_session = async (sessionId) => {

    const response_object = { code: null, message: "", resource: null }

    try {

        const session = await model.findOne({ sessionId })

        if (!session) {

            response_object.code = 404
            response_object.message = "Session is not found"
            return response_object
        }

        response_object.code = 200
        response_object.message = "OK"
        response_object.resource = session
        
    } catch (error) {
        
        console.log("[Create Session] Error:", error)

        response_object.code = 500
        response_object.message = "Something went wrong"
    }
 
    
    return response_object
}


const get_active_session = async (body) => {

    const response_object = { code: null, message: "", resource: null }

    try {

        const session = await model.findOne({ user_id: body.user_id})
        // console.log("received body:", body)
        console.log("Found session:", session)

        if (!session) {

            response_object.code = 404
            response_object.message = "Session is not found or expired"
            return response_object
        }

        response_object.code = 200
        response_object.message = "OK"
        response_object.resource = session
        
    } catch (error) {
        
        console.log("[Find Session] Error:", error)

        response_object.code = 500
        response_object.message = "Something went wrong"
    }
 
    
    return response_object
}


module.exports = { create_session, get_session, get_active_session }