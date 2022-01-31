import mongoose from 'mongoose';

const teardown = async () => {
	await mongoose.connection.close();
};

export default teardown;
