/* eslint-disable no-useless-escape */
import { createHash } from 'crypto';
import asyncHandler from '../middlewares/async';
import sendEmail from '../../configs/mailer';
import EmailVerificationToken from '../models/EmailVerificationToken';
import { errorResponse, successResponse } from '../helpers/response';
//models
import User from '../models/User';
import Admin from '../models/Admin';
import { UserType } from '../helpers/constants';
import moment from 'moment';
import { NextFunction, Request, Response } from 'express';
import { UserDoc } from '../../interfaces/UserDoc';
import { obj } from '../../interfaces/obj';

// eslint-disable-next-line no-unused-vars
export const signup = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		await req.validate({
			email: 'required|string|email',
			password: 'required|string',
		});

		const { email, password } = req.body;

		const user = await User.create({ email, password });

		sendTokenResponse(res, user, 201);
	}
);

export const signin = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		await req.validate({
			email: 'required|string|email',
			password: 'required|string',
		});

		const { email, password } = req.body;

		// Check for user
		const userCheck = await User.findOne({ email }).select('+password');

		if (!userCheck) {
			return errorResponse(next, 'Invalid credentials', 401);
		}

		// Check if password matches
		const isMatch = await userCheck.matchPassword(password);

		if (!isMatch) {
			return errorResponse(next, 'Invalid credentials', 401);
		}

		sendTokenResponse(res, userCheck);
	}
);

// eslint-disable-next-line no-unused-vars
export const signout = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		res.cookie('token', 'none', {
			expires: new Date(Date.now() + 10 * 1000),
			httpOnly: true,
		});

		successResponse(res, '', {});
	}
);

// eslint-disable-next-line no-unused-vars
export const getAuthUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await User.findById(req.user?._id);

		successResponse(res, '', { user });
	}
);

// eslint-disable-next-line no-unused-vars
export const updateDetails = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		await req.validate({
			email: 'required|string|email',
			username: 'required|string',
		});

		const fieldsToUpdate = {
			name: req.body.name,
			email: req.body.email,
		};

		const user = await User.findByIdAndUpdate(req.user?._id, fieldsToUpdate, {
			new: true,
			runValidators: true,
		});

		successResponse(res, '', { user });
	}
);

export const updatePassword = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		await req.validate({
			currentPassword: 'required|string|min:6',
			newPassword: 'required|string|min:6|confirmed',
		});

		const user = await User.findById(req.user?._id).select('+password');

		// Check current password
		if (!(await user.matchPassword(req.body.currentPassword))) {
			return errorResponse(next, 'Password is incorrect', 401);
		}

		user.password = req.body.newPassword;
		await user.save();

		sendTokenResponse(res, user);
	}
);

export const forgotPassword = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		await req.validate({
			email: 'required|email',
		});

		const user: UserDoc = await User.findOne({ email: req.body.email });

		if (!user) {
			return errorResponse(next, 'There is no user with that email', 404);
		}

		// Get reset token
		const resetCode = user.getResetPasswordCode();

		await user.save({ validateBeforeSave: false });

		const message = `Your password reset code is ${resetCode}.`;

		try {
			await sendEmail({
				email: user.email,
				subject: 'Password reset code',
				message,
			});

			successResponse(res, '', { success: true, data: 'Email sent' });
		} catch (err) {
			user.resetPasswordCode = undefined;
			user.resetPasswordExpire = undefined;

			await user.save({ validateBeforeSave: false });

			return errorResponse(next, 'Email could not be sent', 500);
		}

		successResponse(res, 'password reset code sent successfully', {});
	}
);

export const resetPassword = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		await req.validate({
			password: 'required|string|confirmed',
			resetCode: 'required|string',
		});

		// Get hashed code
		const resetPasswordCode = createHash('sha256')
			.update(req.body.resetCode)
			.digest('hex');

		const user = await User.findOne({
			resetPasswordCode,
			resetPasswordExpire: { $gt: Date.now() },
		});

		if (!user) {
			return errorResponse(next, 'Invalid token or code', 400);
		}

		// Set new password
		user.password = req.body.password;
		user.resetPasswordCode = undefined;
		user.resetPasswordExpire = undefined;
		await user.save();

		sendTokenResponse(res, user);
	}
);

export const getEmailVerificationToken = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await User.findById(req.user?._id);

		if (user.verified) {
			return errorResponse(next, 'User verified already', 400);
		}

		const token = await EmailVerificationToken.findOne({ user: user._id });

		const newToken = token.getVerificationToken();

		await token.save();

		const message = `Verify your email using the following link \n 
                     ${process.env.FRONTEND_URL}/verify-email/${newToken}`;

		await sendEmail({
			email: user.email,
			subject: `Email Confirmation, ${process.env.APP_NAME}`,
			message,
		});

		successResponse(
			res,
			'Email verification sent, check your email inbox',
			{},
			200
		);
	}
);

export const verifyEmail = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		req.validate({
			token: 'required|string',
		});
		const emailToken = req.params.token;

		// Get hashed token
		const verificationToken = createHash('sha256')
			.update(emailToken)
			.digest('hex');

		const token = await EmailVerificationToken.findOne({
			token: verificationToken,
			expires: { $gt: Date.now() },
		});

		if (!token) {
			return errorResponse(next, 'Invalid token', 400);
		}

		// update user verification status
		const user = await User.findById(token.user);

		user.verified = true;

		await user.save();

		// remove token from document
		token.token = undefined;
		token.expires = undefined;

		await token.save();

		successResponse(res, 'Email verification is successful', {}, 200);
	}
);

// Get token from model, create cookie and send response
const sendTokenResponse = (
	res: Response,
	user: UserDoc,
	statusCode: number = 200
) => {
	const token = user.getSignedJwtToken();

	const options = {
		expires: new Date(
			Date.now() +
				(process.env.JWT_COOKIE_EXPIRE as unknown as number) * 60 * 1000
		),
		httpOnly: true,
		secure: false,
	};

	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}

	let userObject = user.toObject({
		// eslint-disable-next-line no-unused-vars
		transform: (doc, ret, options) => {
			if (ret.password) delete ret.password;
			if (ret.securityQuestion) delete ret.securityQuestion;
			return ret;
		},
	});

	res
		.status(statusCode)
		.cookie('token', token, options)
		.json({
			success: true,
			data: { user: userObject },
			token,
		});
};
