const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGODB_STR)
.then(() => console.log("MongoDB Connected!"))
.catch((err) => console.error("MongoDB Connection Error:", err));


// Import Routes
const userRoutes = require("./src/route/user.route");



// Use Routes
app.use("/api/users", userRoutes);




app.get("/", (req, res) => {
  res.send("Welcome to User Management System API");
});



module.exports = app;
