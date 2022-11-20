import jwt from 'jsonwebtoken';

import generateError from '../utils/customError.js'
import { SECRET } from './config.js';

export const checkIfLoginInputValid = ({email, password}) => {
    if(!email || !password){
        throw generateError('Fields required missing', 400);
      }    
} 

export const createToken = (user) =>{

  const userForToken = {
    name: user.name,
    email: user.email,
    organization: user.organization,
    id: user._id,
  };

  return jwt.sign(userForToken, SECRET);

}