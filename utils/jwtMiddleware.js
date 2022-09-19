import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const tokenExtractor = (request, response, next) => {
  try {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      const token = (authorization.substring(7));

      request.token = token;
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const userExtractor = async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Token missing or invalid' });
    }
    const user = await User.findById(decodedToken.id);

    request.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};