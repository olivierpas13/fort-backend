import userRepository from "../database/repositories/userRepository.js"
import organizationService from "./organizationService.js";

import { checkIfValidInput, getDataFromOrgCode, hashPassword } from '../utils/userUtils.js';

class userService{

    constructor(){
        this.organizationService = new organizationService()
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
                    organizationId,
                    role,
                    project,
                } = getDataFromOrgCode(organizationCode);

               savedUser = await this.repository.createUser({
                name,
                email,
                role,
                passwordHash,
                organizationName,
                organizationId,
                project,
               })
            }
        
            if(!organizationCode && organization){

                const newOrg = await this.organizationService.createOrganization(organization);        
                
                savedUser = await this.repository.createAdmin({
                    name,
                    email,
                    passwordHash,
                    organization: newOrg.name,
                    organizationId: newOrg._id,
                })
            }

            return savedUser;
        
        } catch (error) {
            throw error;
        }
    }

    async changeUserRole({id, role}){
        try {
            return await this.repository.changeRole({id, role})
        } catch (error) {
            throw error;
        }
    }

    async updateUserOrganization({id, organization}){

        const org = await this.organizationService.getSingleOrganization(organization)
        
        if(!org){
            const createdOrg = await this.organizationService.createOrganization(organization);
            await this.repository.updateUserOrg({id, organization: createdOrg.name});
            return await this.changeUserRole({
                id,
                role: "administrator",
            })
        }
        return await this.repository.updateUserOrg({id, organization: org.name});
    }

    async getAllUsersCountByProject(project){
        return await this.repository.getUsersCountFromProject(project);
    }

    async addUserFromGithub({id, code}){
        try {
            console.log(code);
            const {organizationName, role, project,} = getDataFromOrgCode(code);
        
            return await this.repository.updateUserFromGit({
                id,
                organization: organizationName,
                role,
                project,
            })   
        } catch (error) {
            throw error;
        }
    }


}

export default userService;