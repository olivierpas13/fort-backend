import userRepository from "../database/repositories/userRepository.js"
import organizationRepository from "../database/repositories/organizationRepository.js"

import { checkIfValidInput, getDataFromOrgCode, hashPassword } from '../utils/userUtils.js';

class userService{

    constructor(){
        this.organizationRepo = new organizationRepository()
        this.repository = new userRepository()
    }

    async getUserByEmail(email){
        return await this.repository.fetchUserByEmail(email);
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

        try {

            await checkIfValidInput({name, password, email})
        
            const passwordHash = await hashPassword(password);
        
            let savedUser;
        
            if(organizationCode){
        
                const {        
                    organizationName,
                    role,
                    project,
                } = getDataFromOrgCode(organizationCode);

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

                const newOrg = await this.organizationRepo.createOrganization(organization);        
                
                savedUser = await this.repository.createAdmin({
                    name,
                    email,
                    passwordHash,
                    organization: newOrg.name,
                })

            }

            return savedUser;
        
        } catch (error) {
            throw error;
        }
    }

    async updateUserOrganization({id, organization}){

        const user = await this.repository.updateUserOrg({id, organization});
        const org = await this.organizationRepo.getSingleOrganization({name: organization})
        
        if(!org){
            await this.organizationRepo.createOrganization(organization);
        }

        return user;
    }
}

export default userService;