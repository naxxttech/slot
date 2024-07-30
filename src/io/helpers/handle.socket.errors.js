const handleErrorsIfAny = async (fn, socket, cb) => {
 
    const response_object = { status: true }

    try {
      
      const triggered_function_response = await fn();

      response_object.data = triggered_function_response
      cb?.(response_object)

    } catch (error) {
      console.error('An error occured in socket:', error.message);
      response_object.status = false 
      response_object.message = error.message
      
      if (!cb) {
        
        socket.disconnect(true);
      
      } else {

        cb(response_object)
      }



    
    }
  };


  module.exports = handleErrorsIfAny