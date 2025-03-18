const express = require('express');
const router = express.Router();


const { 
    createUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser
    } = require('../controller/user.controller');

const { isAuthenticatedUser,authorizeRoles } = require('../middlewars/auth')


router.post('/register', createUser)
router.post('/login', loginUser )
router.put('/updateProfile/:id',isAuthenticatedUser, updateUser)

router.get("/seeUser", isAuthenticatedUser, authorizeRoles("admin"), getUser);
router.delete("/deleteProfile/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports=router;