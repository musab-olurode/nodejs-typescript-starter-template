import { Document, Types } from 'mongoose';

export default interface IEmailVerificationToken extends Document {
	user: Types.ObjectId;
	token: string;
	expires: number;
}
