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
            
            throw(error);

        }
    }

    async getInvitationCode({name, role, project}){
        try {
            
            const roleInvitationCode = jwt.sign({
                name,
                role,
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

    async createOrganization(organization){
        try {
            console.log(organization);
            const newOrganization = await this.repository.createOrganization(organization);
            return newOrganization;
        } catch (error) {
            console.error(error);
        }
    }

    async updateOrganizationProjects({name, project}){
        return await this.repository.updateOrganizationProjects({name, project})
    }

}

export default organizationService;
