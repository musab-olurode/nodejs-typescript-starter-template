import { NextFunction, Response } from 'express';
import ErrorResponse from './errorResponse';

const successResponse = (
	res: Response,
	message: string,
	data: any,
	code: number = 200
) => {
	return res.status(code).json({ success: true, message, data });
};

const errorResponse = (next: NextFunction, error: string, code: number) => {
	return next(new ErrorResponse(error, code));
};

export { successResponse, errorResponse };
