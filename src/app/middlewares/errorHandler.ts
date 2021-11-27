/* eslint-disable no-unused-vars */
import ErrorResponse from '../helpers/errorResponse';
import winston from 'winston';
import { NextFunction, Request, Response } from 'express';

const TESTING = process.env.NODE_ENV === 'test';

const files = new winston.transports.File({ filename: 'logs/error.log' });
winston.add(files);

const errorHandler = (
	err: ErrorResponse,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let error = { ...err };

	error.message = err.message;

	// Log to console for dev
	!TESTING && console.log((err as any).stack);

	// Mongoose bad ObjectId
	if (err.name === 'CastError') {
		const message = 'resource not found';
		error = new ErrorResponse(message, 404);
	}

	// Mongoose duplicate key
	if ((err as any).code === 11000) {
		// get the dup key field out of the err message
		let field = err.message.split('index:')[1];
		// now we have `field_1 dup key`
		field = field.split(' dup key')[0];
		field = field.substring(0, field.lastIndexOf('_')); // returns field
		field = field.trim();
		const message = `${field} already exists`;
		error = new ErrorResponse(message, 400);
	}

	// Mongoose validation error
	if (err.name === 'ValidationError') {
		const message = Object.values((err as any).errors)
			.map((val: any): string => val.message)
			.join(', ');
		error = new ErrorResponse(message, 400);
	}

	if (error.message === 'Route Not found') {
		const message = 'requested resource not found';
		error = new ErrorResponse(message, 404);
	}

	winston.info(err.stack);

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'server error',
	});
};

export default errorHandler;
