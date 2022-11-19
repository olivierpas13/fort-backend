import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';

import { SECRET } from './config.js';
import generateError from '../utils/customError.js'
import User from '../database/models/user.js';

export const checkIfEmailIsUnique = async (email) =>{
    return await User.findOne({email})
}

export const checkIfValidInput = async ({name, password, email}) => {

    if (!(name && password && email )){
        throw generateError('Fields required missing', 400);
    }        
    if (!(name.length > 3) || !(password.length > 3)) {
        throw generateError('Name and password length should be more than 3 characters', 400);
    }
    if(await checkIfEmailIsUnique(email)){
        throw generateError('Email address already used.', 400);
    }
    return;
}

export const hashPassword = async (password) =>{
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

export const getDataFromOrgCode = (organizationCode) =>{
    const {
        name: organizationName,
        role,
        project
    } = jwt.verify(organizationCode, SECRET)

    return {
        organizationName,
        role,
        project,
    }
}