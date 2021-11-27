import jwt from 'jsonwebtoken';
import asyncHandler from './async';
import User from '../models/User';
import Admin from '../models/Admin';
import { errorResponse } from '../helpers/response';
import { NextFunction, Request, Response } from 'express';
import { UserDoc } from '../../interfaces/UserDoc';
import { AdminDoc } from '../../interfaces/AdminDoc';
import { UserType } from '../helpers/constants';

// Protect routes
const protect = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		let token;
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			// Set token from Bearer token in header
			token = req.headers.authorization.split(' ')[1];
			// Set token from cookie
		} else if (req.cookies.token) {
			token = req.cookies.token;
		}
		// Make sure token exists
		if (!token) {
			return errorResponse(next, 'Not authorized to access this route', 401);
		}

		try {
			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
			let user: UserDoc | undefined = await User.findById((decoded as any).id);
			if (!user) {
				throw 'error';
			}
			req.user = user;
			next();
		} catch (err) {
			return errorResponse(next, 'Not authorized to access this route', 401);
		}
	}
);

// Grant access to only admins
const admin = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		let token;
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			// Set token from Bearer token in header
			token = req.headers.authorization.split(' ')[1];
			// Set token from cookie
		} else if (req.cookies.token) {
			token = req.cookies.token;
		}
		// Make sure token exists
		if (!token) {
			return errorResponse(next, 'Not authorized to access this route', 401);
		}

		try {
			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
			let admin = await Admin.findById((decoded as any).id);
			if (!admin) {
				throw 'error';
			}
			req.admin = admin;
			next();
		} catch (err) {
			return errorResponse(next, 'Not authorized to access this route', 401);
		}
	}
);

// Grant access to specific admin permissions
const authorizeAdmin = (...roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (req.admin?._id !== UserType.Admin) {
			return errorResponse(next, 'Not authorized to access this route', 403);
		}
		next();
	};
};

export { protect, admin, authorizeAdmin };
