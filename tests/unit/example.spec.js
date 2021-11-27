import ApiHelper from '../helpers/apiHelper';
import assert from 'assert';
import mongoose from 'mongoose';

const helper = new ApiHelper();
const urlPrefix = '/v1/';

describe('POST /example |success', () => {
	it('responds with success json', async () => {
		return helper.apiServer
			.post(`${urlPrefix}/example`)
			.send({ email: 'email@mailinator.com', username: 'example-username' })
			.expect(200)
			.then(({ body }) => {
				assert(body.success, true);
				assert(body.data, {});
			})
			.catch((err) => err);
	});
});

describe('POST /example |error', () => {
	it('responds with error json', async () => {
		return helper.apiServer
			.post(`${urlPrefix}/example`)
			.send({ email: 'email@mailinator', username: 'example-username' })
			.expect(422)
			.then(({ body }) => {
				assert(body.success, false);
				expect(body).toHaveProperty('error');
			})
			.catch((err) => err);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
