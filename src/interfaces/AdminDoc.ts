import { Document } from 'mongoose';

export interface AdminDoc extends Document {
	permissions: string[];
}
