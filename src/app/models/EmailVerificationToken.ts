import { Schema, Types, model } from 'mongoose';
import crypto from 'crypto';
import IEmailVerificationToken from '../../interfaces/EmailVerificationToken';

const EmailVerificationTokenSchema = new Schema<IEmailVerificationToken>(
	{
		user: {
			type: Types.ObjectId,
			ref: 'User',
			required: true,
		},
		token: {
			type: String,
		},
		expires: Date,
	},
	{ timestamps: true }
);

// Generate and hash token
EmailVerificationTokenSchema.methods.getVerificationToken = function () {
	// Generate token
	const verificationToken = crypto.randomBytes(20).toString('hex');

	// Hash token and set to verificationToken field
	this.token = crypto
		.createHash('sha256')
		.update(verificationToken)
		.digest('hex');

	// set expire=y date
	this.expires = Date.now() + 10 * 60 * 1000;

	this.save();

	return verificationToken;
};

const EmailVerificationTokenModel = model(
	'EmailVerificationToken',
	EmailVerificationTokenSchema
);

export default EmailVerificationTokenModel;
