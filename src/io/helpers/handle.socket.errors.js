const handleErrorsIfAny = async (fn, socket, cb) => {
 
    const response_object = { status: true }

    try {
      
      const response = await fn();

      response_object.data = response
      cb?.(response_object)

    } catch (error) {
      console.error('An error occured in socket:', error.message);
       // socket.emit('error', { message: error.message });
      response_object.status = false 
      response_object.message = error.message
      
      cb?.(response_object)

      // socket.disconnect(true);
    
    }
  };


  module.exports = handleErrorsIfAny