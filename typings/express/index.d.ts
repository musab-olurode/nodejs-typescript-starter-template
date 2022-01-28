declare namespace Express {
	interface Request {
		user?: import('../../src/interfaces/UserDoc').UserDoc;
		admin?: import('../../src/interfaces/UserDoc').UserDoc;
		validate: (
			args: import('validatorjs').Rules,
			locations?: import('../../src/interfaces/ValidationLocation').ValidationLocation[],
			customMessages?: import('validatorjs').ErrorMessages
		) => Promise<Response | void>;
		userType?: import('../../src/app/helpers/constants').UserType;
		validated: () => any;
	}
	interface Response {
		advancedResults: (model: import('mongoose').Model<any>, populate?: string) => Promise<any>;
	}
}
