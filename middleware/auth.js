const jwt = require('jsonwebtoken');

// Middleware function for authentication, called in route.js
module.exports = (req, res, next) => {
    // Assigning variable 'token' to the header 'token' when the POST request is made
    const token = req.header('token');
    // If token is not provided/found, provide error
    if(!token) return res.status(401).json({ message: "Auth Error." });

    try {
        /* Storing the token passed to the server to be verified by the server 
        in the variable 'decoded' */ 
        const decoded = jwt.verify(token, "randomString");
        /* Pertains to the GET request made in route.js where 'user' is subsequently defined.
        Passing the decoded user back to that file. */
        req.user = decoded.user;
        // Redirecting back to the function called in route.js to finish executing 
        next();
    } catch(err) {
        res.status(500).send({ message: "Invalid Token" });
    }
}