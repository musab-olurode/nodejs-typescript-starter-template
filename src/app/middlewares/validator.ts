import Validator, { ErrorMessages, Errors, Rules } from 'validatorjs';
import { errorResponse } from '../helpers/response';
import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { obj } from '../../interfaces/obj';
import { ValidationLocation } from '../../interfaces/ValidationLocation';

const registerCustomRules = () => {
	Validator.registerAsync(
		'exists',
		// eslint-disable-next-line no-unused-vars
		async (value, requirement, attribute, passes) => {
			if (!requirement) {
				return passes(false, 'Exists requirements are expected.');
			}
			const requirements = requirement.split(',');
			if (requirements.length !== 2) {
				return passes(false, 'Exists requirements must be exactly 2.');
			}
			const modelName = requirements[0];
			const modelField = requirements[1];
			const formattedModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
			const Model = mongoose.connection.model(formattedModelName);
			const foundModel = await Model.findOne({ [modelField]: value });
			if (!foundModel) {
				return passes(false, `The ${attribute} does not exist.`);
			}
			return passes();
		},
		'The :attribute does not exist.'
	);
	Validator.registerAsync(
		'unique',
		// eslint-disable-next-line no-unused-vars
		async (value, requirement, attribute, passes) => {
			if (!requirement) {
				return passes(false, 'Unique requirements are expected.');
			}
			const requirements = requirement.split(',');
			if (requirements.length !== 2) {
				return passes(false, 'Unique requirements must be exactly 2.');
			}
			const modelName = requirements[0];
			const modelField = requirements[1];
			const formattedModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
			const Model = mongoose.connection.model(formattedModelName);
			const foundModel = await Model.findOne({ [modelField]: value });
			if (foundModel) {
				return passes(false, `The ${attribute} already exists.`);
			}
			return passes();
		},
		'The :attribute already exists.'
	);
	Validator.registerAsync(
		'file',
		// eslint-disable-next-line no-unused-vars
		(value, requirement, attribute, passes) => {
			if (!(value as any).isFile) {
				return passes(false, `The ${attribute} is not a file.`);
			}
			if ((value as any).size > (process.env.MAX_FILE_UPLOAD as unknown as number)) {
				return passes(false, `The ${attribute} file size exceeds ${process.env.MAX_FILE_UPLOAD}.`);
			}
			return passes();
		},
		'The :attribute is not a file.'
	);
	Validator.registerAsync(
		'mime',
		(value, requirement, attribute, passes) => {
			if (!requirement) {
				return passes(false, 'Mime type requirements are expected.');
			}
			if (!(value as any).mimetype || !(value as any).mimetype.startsWith(requirement)) {
				return passes(false, `The ${attribute} is not a(n) ${requirement}.`);
			}
			return passes();
		},
		'The :attribute does not have a valid mimetype.'
	);
};

registerCustomRules();

const validator = async (data: any, rules: Rules, callback: Function, customMessages?: ErrorMessages) => {
	const validation = new Validator(data, rules, customMessages);
	validation.passes(() => callback(null, true));
	validation.fails(() => callback(validation.errors, false));
	validation.checkAsync(
		() => callback(null, true),
		() => callback(validation.errors, false)
	);
};

const validate = (req: Request, res: Response, next: NextFunction) => {
	req.validated = () => {
		return {};
	};
	req.validate = async (
		rules: Rules,
		locations: ValidationLocation[] = ['params', 'query', 'body', 'files'],
		customMessages = {}
	) => {
		// eslint-disable-next-line no-unused-vars
		return await new Promise<Response | void>((resolve, reject) => {
			let dataToValidate = getFieldsToValidate(req, locations);
			validator(
				dataToValidate,
				rules,
				(err: Errors, status: boolean) => {
					if (!status) {
						return errorResponse(next, convertValidationErrorsToString(err), 422);
					}
					req.validated = () => getValidatedFields(rules, dataToValidate);
					resolve();
				},
				customMessages
			);
		});
	};
	next();
};

const getFieldsToValidate = (req: Request, locations: ValidationLocation[]) => {
	const possibleFields: ValidationLocation[] = ['params', 'query', 'body', 'files'];
	let fields = {};
	possibleFields.forEach((possibleField) => {
		if (locations.length > 0 && locations.includes(possibleField)) {
			fields = { ...fields, ...req[possibleField as keyof typeof req] };
		}
	});
	return fields;
};

const getValidatedFields = (rules: Rules, dataToValidate: any) => {
	var validatedObject: obj = {};

	Object.keys(dataToValidate).forEach((key) => {
		if (dataToValidate[key] !== undefined && Object.keys(rules).includes(key)) {
			validatedObject[key] = dataToValidate[key];
		}
	});

	return validatedObject;
};

const convertValidationErrorsToString = (err: Errors) => {
	let errorString = '';
	let errors: string[] = [];

	// eslint-disable-next-line no-unused-vars
	Object.entries(err.errors).forEach(([key, value]) => {
		value.forEach((error) => {
			errors = errors.concat(error + ' ');
		});
	});
	errors.forEach((errorValue) => {
		let errorValueWithoutPeriod = errorValue.split('. ')[0];
		if (errors.indexOf(errorValue) != errors.length - 1) {
			errorValueWithoutPeriod += ', ';
		}
		errorString += errorValueWithoutPeriod;
	});

	return errorString;
};

export default validate;
