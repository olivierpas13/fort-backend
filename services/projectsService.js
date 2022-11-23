import projectsRepository from "../database/repositories/projectsRepository.js"
import userService from "./userService.js";
import { organizeProjectIssues } from "../utils/projectsUtils.js";

class projectsService{
    constructor(){
        this.repository = new projectsRepository()
        this.userService = new userService();
    }
    async addIssueToProject({id, issue}){
        return await this.repository.addIssueToProject({id, issue})
    }

    async getProjectById(id){
        return await this.repository.fetchProjectById(id);
    }

    async getProjectStats(id){
        const project = await this.getProjectById(id);
      
        const users = await this.userService.getAllUsersCountByProject(project.id)
  
        const {
            highPriorityIssues,
            mediumPriorityIssues,
            lowPriorityIssues,
            openIssues,
            closedIssues,
        } = organizeProjectIssues(project.issues);
        
        const projectStats = {
          projectName: project.name,
          projectIssues: project.issues.length,
          users,
          highPriorityIssues,
          mediumPriorityIssues,
          lowPriorityIssues,
          openIssues,
          closedIssues,
      }
        return projectStats
    }
}

export default projectsService;