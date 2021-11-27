import { Schema, Types, model, Query } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { generateString, UserType } from '../helpers/constants';
import { UserDoc } from '../../interfaces/UserDoc';

const UserSchema = new Schema<UserDoc>(
	{
		phone: {
			type: String,
			unique: true,
			// required: [true, 'Please add a phone number'],
		},
		email: {
			type: String,
			// required: [true, 'Please add an email'],
			unique: true,
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				'Please add a valid email',
			],
		},
		avatar: {
			type: String,
		},
		password: {
			type: String,
			required: [true, 'Please add a password'],
			minlength: 6,
			select: false,
		},
		resetPasswordCode: String,
		resetPasswordExpire: Date,
	},
	{ timestamps: true }
);

//Encrypt password
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Verify if password is valid
UserSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, (this as any).local.password);
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

// Match User entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password code
UserSchema.methods.getResetPasswordCode = function () {
	// Generate code
	const resetCode = generateString(6, false);

	// Hash code and set to resetPasswordCode field
	this.resetPasswordCode = crypto
		.createHash('sha256')
		.update(resetCode)
		.digest('hex');

	// Set expire
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

	return resetCode;
};

export default model('User', UserSchema);
