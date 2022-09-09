import express from 'express';
import userController from '../controllers/userControllers.js';
import authenticUser from '../middlewares/auth-middleware.js'



const router = express.Router;

// Middleware route
router.use('/changepassword', authenticUser);
router.use('/logedin' ,authenticUser )


// public route
router.post('/register', userController.userRegister);
router.post('/login' , userController.userLogin);
router.post('/send-password-reset-email' , userController.sendResetEmail);
router.post('/reset-password/:id/:token', userController.passwordReset)

// protected route
router.post('/changepassword', userController.changePassword)
router.post('/logedin', userController.logedInUser)


export default router;
