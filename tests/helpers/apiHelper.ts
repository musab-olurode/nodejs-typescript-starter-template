import supertest, { SuperTest, Test } from 'supertest';
import app from '../../src/app';

class Helper {
	apiServer: SuperTest<Test>;

	constructor() {
		this.apiServer = supertest(app);
	}
}

export default Helper;
