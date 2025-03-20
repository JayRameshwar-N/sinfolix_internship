const userModel = require('../model/user.model');
const jwt = require("jsonwebtoken");
require('dotenv').config();



// ----- isAuthenticatedUser Middleware
exports.isAuthenticatedUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized: No token provided" 
            });
        }

        const token = authHeader.split(" ")[1];

        if (!process.env.SecretKey) {
            console.error("Error: Secret key is missing in environment variables.");
            return res.status(500).json({ 
                success: false, 
                message: "Internal Server Error: Missing Secret Key" 
            });
        }

        const decodedData = jwt.verify(token, process.env.SecretKey);
        
        const user = await userModel.findById(decodedData.id);

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid or expired token" 
            });
        }

        req.user = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        next();
        
    } catch (err) {
        res.status(500).send({ success: false, error:err.message });
    }
};

// ----- authorizeRoles Middleware
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
                return res.status(403).json({ 
                    success: false, 
                    message: `Access Denied: Role '${req.user?.role || "unknown"}' is not authorized` 
                });
            }
            next();
        } catch (err) {
            console.error("Authorization Error:", err.message);
            return res.status(500).json({ success: false, message: "Authorization error" });
        }
    };
};
