import express, { Request, Response } from 'express';
const webRoutes = express.Router();

// add web routes below

webRoutes.use('/', (req: Request, res: Response) => {
	res.setHeader('Content-Type', 'text/html');
	res.write('<h1>WELCOME TO NODE JS TYPESCRIPT STARTER TEMPLATE<h1>');

	setTimeout(() => {
		res.end();
	}, 1000);
});

export default webRoutes;
