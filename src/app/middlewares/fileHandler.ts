import { NextFunction, Request, Response } from 'express';

const fileHandler = (req: Request, res: Response, next: NextFunction) => {
	if (req.files) {
		// eslint-disable-next-line no-unused-vars
		Object.entries(req.files).forEach(([key, file]) => {
			(file as any).isFile = true;
		});
		// req.body = { ...req.body, ...req.files };
	}
	next();
};

export default fileHandler;
