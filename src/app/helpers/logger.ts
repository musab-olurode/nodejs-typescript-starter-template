import winston from 'winston';

const files = new winston.transports.File({ filename: 'logs/debug.log' });
winston.add(files);

const logToFile = (message: any) => {
	winston.info(message);
};

export default logToFile;
