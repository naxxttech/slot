

const authMiddleware = (request, response, next) => {
    const authHeader = request.headers['auth']; 
    const expectedAuthValue = process.env["AUTHHEADER"]

    
    if (authHeader === expectedAuthValue) {

        next(); 

    } else {
        response.status(403).json({ message: 'Forbidden: Invalid auth token' });
    }
};



module.exports = authMiddleware