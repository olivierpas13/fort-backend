import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MONGODB_URI } from './utils/config.js';


// const blogRouter = require('./controllers/blog');
// const testingRouter = require('./controllers/testing');
import loginRouter from './controllers/login.js';
import userRouter from './controllers/user.js';
import organizationRouter from './controllers/organizations.js'
import issuesRouter from './controllers/issues.js'
import projectsRouter from './controllers/projects.js'

import { tokenExtractor } from './utils/jwtMiddleware.js';

const app = express();

console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error.message);
  });

app.use(cors());

app.use(express.static('./.next'));

app.use(express.json());

app.use(tokenExtractor);

app.use('/api/login', loginRouter);

app.use('/api/organization', organizationRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/users', userRouter);
app.use('/api/issues', issuesRouter);

// if (process.env.NODE_ENV === 'test') {
/* eslint-disable */
  /* eslint-enable */
// }

app.get('/health', (req, res) => {
  res.send('ok');
});

export default app;