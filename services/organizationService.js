import jwt from 'jsonwebtoken';

import organizationRepository from "../database/repositories/organizationRepository.js";
import { SECRET } from '../utils/config.js'

class organizationService {

    constructor(){
        this.repository = new organizationRepository();
    }

    async getSingleOrganization(name){
        try {

            return await this.repository.getSingleOrganization(name);    
        
        } catch (error) {
            
            console.error(error);

        }
    }

    async getInvitationCode({name, role, orgInvitationCode, project}){
        try {
            
            const roleInvitationCode = jwt.sign({
                name,
                role,
                orgInvitationCode,
                project,
              }, SECRET);
            
            return roleInvitationCode;

        } catch (error) {
            console.error(error);
        }
      
    }

    async getAllProjectsWeeklyStats(name){

        try {
            const { projects } = await this.getSingleOrganization(name);

            const allWeekIssues = await (this.repository.getLastWeekIssues(projects))

            return allWeekIssues;
       
        }catch (error) {
            console.error(error);
        }
    }

    async createOrganization(name){
        try {
            const organization = await this.repository.createOrganization(name);
            return organization;
        } catch (error) {
            console.error(error);
        }
    }

}

export default organizationService;
