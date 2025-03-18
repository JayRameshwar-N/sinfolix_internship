const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const userModel= require('../model/user.model');

const { 
    handleValidationErr,
    validateCreateUser,
    validateLoginUser,

    }=require('../utils/validation')




 
//---------- User Sign-up
exports.createUser = [
    validateCreateUser, handleValidationErr,
    
    async (req, res) => {
      try {
        const { firstName, lastName, email, password, confirmPassword,role } = req.body;
  
        const existingUserByEmail = await userModel.findOne({ email });
        if (existingUserByEmail) {
          return res.status(400).send({ error: "Email is already registered." })}
  
        if (password !== confirmPassword) {
          return res.status(400).send({ error: "Passwords do not match, Please confirm your password." })}
  
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = jwt.sign({ email: email }, process.env.SecretKey, { expiresIn: "1h" });
  
        await userModel.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          token,
          role
        });
  
        res.status(201).send({ message: "User registered successfully!" });
      } 
        catch(err){
            console.log(err)
        res.status(500).send({ error: "Internal server error. Please try again later." });
      }
    }
  ];
  
  
  //---------- User Sign-in
  exports.loginUser = [
    validateLoginUser, handleValidationErr,
  
    async (req, res) => {
      try {
        const { email, password } = req.body;
  
        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).send({ error: "User not found." });
  
        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) return res.status(400).send({ error: "Invalid credentials." });
  
        const token = jwt.sign({ id: user._id }, process.env.SecretKey, { expiresIn: "1h" });
  
        await userModel.findByIdAndUpdate(user._id, { token: token });
        res.status(200).send({ message: "Login successful", token });
        
      } catch{
        res.status(500).send({ error: "Internal server error. Please try again later." });
      }
    }
  ];


  // ----- Update User Profile (User Can Update Only Their Own Profile)
exports.updateUser = async (req, res) => {

    try {
        if (req.user.id.toString() !== req.params.id.toString()) {
            return res.status(403).json({ message: "Access Denied: You can only update your own profile"});
            }
    
        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
            }

        res.status(200).send({ message: "Profile updated successfully", user: updatedUser });
    } catch{
        res.status(500).send({
            message: "Failed to update user profile", error: error.message});
            }
};


// ----- Delete User (Only Admin Can Delete)
exports.deleteUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).send({ message: "Access Denied: Only admins can delete users"});
            }

        const deletedUser = await userModel.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).send({message: "User not found" });
            } 

        res.status(200).send({ message: "User deleted successfully"});
    } catch{
        res.status(500).send({ message: "Failed to delete user", error: error.message });
        }
};

  
// ----- Get All Users (Admin Only)
exports.getUser = async (req, res) => {

    try {
        if (req.user.role !== "admin") {
            return res.status(403).send({message: "Access Denied: Only admins can view all users"});
            }

        const users = await userModel.find();

        res.status(200).send({ count: users.length,users});
    } catch (error) {
        res.status(500).send({ message: "Failed to fetch users", error: error.message});
        }
};
