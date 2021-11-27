import supertest from 'supertest';
import app from '../../app';

class Helper {
	constructor() {
		this.apiServer = supertest(app);
	}
}

export default Helper;
