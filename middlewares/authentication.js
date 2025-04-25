function authenticationMiddleware(req, res, next){
    if (req.session.user) {  // If user is authenticated, allow them to proceed
      next();
    } else {  // If not authenticated, send a 401 Unauthorized response
      return res.status(401).json({ message: "Unauthorized access. Please log in." });
    }
}

module.exports = authenticationMiddleware;