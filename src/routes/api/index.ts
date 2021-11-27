import express from 'express';
const apiRoutes = express.Router();

import advancedResults from '../../app/middlewares/advancedResults';
import fileHandler from '../../app/middlewares/fileHandler';
import validate from '../../app/middlewares/validator';

// add api routes below
import authRouter from './modules/authRoute';

apiRoutes.use(advancedResults);
apiRoutes.use(fileHandler);
apiRoutes.use(validate);

// initialize routes
apiRoutes.use('/auth', authRouter);

export default apiRoutes;
