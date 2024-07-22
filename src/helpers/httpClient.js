const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const make_api_request = async (endpoint) => {

    const response_object = { code: null, message: null, resource: null }
               
    try {
        
        const request = await fetch(endpoint)
        response_object.code = request.status

        if (request.status != 200) {


            response_object.message = "Unable to connect service API"
            return response_object
        }

        const response = await request.json()
        console.log("RESP:", response)

        response_object.resource = response

    } catch (error) {

        console.log("[SERVICE ERROR] WS:", error, response_object)
        response_object.message = "Unable to connect service APIs"
        

    }

    
    return response_object
}



module.exports = make_api_request