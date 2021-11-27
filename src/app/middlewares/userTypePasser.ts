import { NextFunction, Request, Response } from 'express';
import { UserType } from '../helpers/constants';

const userTypePasser = (userType: UserType) => {
	return (req: Request, res: Response, next: NextFunction) => {
		req.userType = userType;
		next();
	};
};

export default userTypePasser;
