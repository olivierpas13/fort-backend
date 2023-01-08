import bcrypt from 'bcrypt';

import userService from '../services/userService.js'
import { checkIfLoginInputValid } from '../utils/loginUtils.js';
import generateError from '../utils/customError.js';
import { createToken } from '../utils/loginUtils.js';

class loginService{

    constructor(){
        this.userService = new userService();
    }

    async login({email, password}){

        checkIfLoginInputValid({email, password});
  
        const user = await this.userService.getUserByEmail(email)
      
        const passwordCorrect = user === null
          ? false
          : bcrypt.compare(password, user.passwordHash);
      
        if (!(user && passwordCorrect)) {
            throw generateError('Invalid username or password', 401);
        }

        const token = createToken(user);

        const loggedUser = {
            token,
            name: user.name,
            email: user.email,
            organization: user.organization,
            id: user._id,
        }

        return loggedUser;

    }

}

export default loginService;