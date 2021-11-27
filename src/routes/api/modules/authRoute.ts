import express from 'express';
import {
	forgotPassword,
	getAuthUser,
	resetPassword,
	signup,
	signin,
	updatePassword,
} from '../../../app/controllers/authController';
import { UserType } from '../../../app/helpers/constants';
import { protect } from '../../../app/middlewares/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', protect, getAuthUser);
router.put('/update-password', protect, updatePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

export default router;
