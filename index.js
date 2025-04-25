const express = require('express');
const session = require('express-session');
const authenticationMiddleware = require('./middlewares/authentication.js');
const customerRoutes = require('./routes/auth_users.js').authenticated;
const generalRoutes = require('./routes/general.js').general;

const app = express();
const PORT = 5000;

// Middleware parses incoming req body to json
app.use(express.json());

// Set up session middleware
app.use(session({
    secret:"fingerprint_customer",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000  // 1 hour
    }
}));

// Use authentication middleware to protect routes
app.use("/customer/auth", authenticationMiddleware);

// Set up routes
app.use("/customer", customerRoutes);
app.use("/", generalRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});