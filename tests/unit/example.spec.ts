import ApiHelper from '../helpers/apiHelper';
import mongoose from 'mongoose';

const helper = new ApiHelper();
const urlPrefix = '/v1/';

describe('POST /auth/signup |success', () => {
	it('responds with success json containing token and user', async () => {
		const res = await helper.apiServer
			.post(`${urlPrefix}/auth/signup`)
			.send({ email: 'email@mailinator.com', password: 'secret' });

		expect(res.statusCode).toBe(201);
		expect(res.body.success).toBe(true);
		expect(res.body).toHaveProperty('token');
		expect(res.body.data).toHaveProperty('user');
	});
});

describe('POST /auth/signup |error', () => {
	it('responds with error json from failed validation', async () => {
		const res = await helper.apiServer
			.post(`${urlPrefix}/auth/signup`)
			.send({ email: 'email@mailinator.com', username: 'example-username' });

		expect(res.statusCode).toBe(422);
		expect(res.body.success).toBe(false);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
