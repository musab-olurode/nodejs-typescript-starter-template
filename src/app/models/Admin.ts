import { Schema, model } from 'mongoose';
import { AdminDoc } from '../../interfaces/AdminDoc';

const AdminSchema = new Schema<AdminDoc>(
	{
		permissions: {
			type: [String],
		},
	},
	{ timestamps: true }
);

export default model('Admin', AdminSchema);
