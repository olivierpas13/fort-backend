import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Router from 'express';
import User from '../models/user.js';

const loginRouter = Router();

loginRouter.post('/', async (request, response) => {
  const { email,  password } = request.body;

  if(!email || !password){
    return response.status(400).json('Fields missing');
  }

  const user = await User.findOne({ email });

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'Invalid username or password',
    });
  }

/*  eslint-disable  */

  const userForToken = {
    name: user.name,
    email: user.email,
    id: user._id,
  };

  /*  eslint-enable */

  const token = jwt.sign(userForToken, process.env.SECRET);

  return response
    .status(200)
    .send({ token, name: user.name, email: user.email });
});

export default loginRouter;