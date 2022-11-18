import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { SECRET } from '../utils/config.js'
import User from '../database/models/user.js';
import userRepository from "../database/repositories/userRepository.js"
import organizationRepository from "../database/repositories/organizationRepository.js"

class userService{

    constructor(){
        this.organizationRepo = new organizationRepository()
        this.repository = new userRepository()
    }

    async getUserById(id){
        try {
            return await this.repository.fetchUserById(id);
        } catch (error) {
            console.error(error);
        }
    }

    async getAllUsersFromOrg(organization){
        try {
            return await this.repository.fetchAllUsersFromOrg(organization);
        } catch (error) {
            console.error(error);
        }

    }

    async createUser({name, email, password, organization, organizationCode}){

        const generateError = (message, statusCode, data) => {
            const error = new Error(message);
            error.statusCode = statusCode;
            error.data = data || {};
            error.error = true;
            return error
        }

        try {

            const saltRounds = 10;

            if (!(name && password && email )){
                throw generateError('Fields required missing',400);
            }        
            if (!(name.length > 3) || !(password.length > 3)) {
                throw generateError('Name and password length should be more than 3 characters',400);
            }
        
            const passwordHash = await bcrypt.hash(password, saltRounds);
        
            let savedUser;
        
            if(organizationCode){
        
              const {
                name: organizationName,
                role,
                project
               } = jwt.verify(organizationCode, SECRET)
         
               savedUser = await this.repository.createUser({
                name,
                email,
                role,
                passwordHash,
                organizationName,
                project,
               })
            }
        
        
            if(!organizationCode && organization){

                savedUser = await this.repository.createAdmin({
                    name,
                    email,
                    passwordHash,
                    organization,
                })

                this.organizationRepo.createOrganization(organization);        
            }

            return savedUser;
        } catch (error) {
            throw error;
        }
    }

}

export default userService;