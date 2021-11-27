import { config } from 'dotenv';
import path from 'path';

import express, { Application } from 'express';
import morgan from 'morgan';
import ErrorHandler from './app/middlewares/errorHandler';
import ConnectDB from './configs/database';
import cookieParser from 'cookie-parser';
import fileupload from 'express-fileupload';

// securing api packages

import mongoSanitize from 'express-mongo-sanitize';

// import helmet from 'helmet';

import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';

// const __dirname = path.resolve(path.dirname(''));

// Load Environment
config();

// connect to database
ConnectDB();

const app: Application = express();

// body requests parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

// File Upload
app.use(fileupload());

// import routes files
import apiRoutes from './routes/api/index';
// import webRoutes from './routes/web/index';

//development mode middle ware logger
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// sanitize data sql or mongo injection
app.use(mongoSanitize());

// set security headers for api security
// app.use(helmet());

// prevent XSS attacks
app.use(xss());

// api request rate limiting default : 100 requests in 10minutes
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 mins
	max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// enable cors
app.use(cors());

// initialize routers
app.use('/v1/', apiRoutes);
// app.use('/', webRoutes);

// set static storage folder
app.use(express.static(path.join(__dirname, 'storage')));

// Handle 404 Requests
app.use('*', (req, res, next) => {
	const error = new Error('Route Not found');
	(error as any).status = 404;
	next(error);
});

// error handler
app.use(ErrorHandler);

export default app;
