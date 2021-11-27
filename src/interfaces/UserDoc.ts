import { Document, Types } from 'mongoose';
import { AdminDoc } from './AdminDoc';

export interface UserDoc extends Document {
	phone: string;
	email: string;
	avatar: string;
	password: string;
	resetPasswordCode?: string;
	resetPasswordExpire?: number;
	matchPassword: (pw: string) => Promise<boolean>;
	validPassword: (pw: string) => Promise<boolean>;
	getSignedJwtToken: () => Promise<string>;
	getResetPasswordCode: () => string;
}
