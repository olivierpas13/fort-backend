import projectsRepository from "../database/repositories/projectsRepository.js"
import userService from "./userService.js";
import { organizeProjectIssues } from "../utils/projectsUtils.js";

import Issue from "../database/models/issue.js";

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

    async getWeeklyProjectStats(id){

        const currentDate = new Date();

        const project = await this.getProjectById(id);

        // Using the issues array inside the project

        // const weekIssues = project.issues.filter(issue=>{
        //     const time = new Date(issue.createdOn).getTime(); 
        //     return(time > currentDate.getDate()-7)
        // });

        // {
        //     "monday": 0,
        //     "tuesday": 3,
        //     "wednesday": 5,
        //     "thursday": 0,
        //     "friday": 1,
        //     "saturday": 0,
        //     "sunday": 0
        // }

        // console.log(weekIssues);

        // Using a query for the weekly issues of an specific project

        const weekIssues = await Issue.find({
            project: id,
            createdOn: {
                $gte: currentDate.setDate(currentDate.getDate()-7),
        }})

        console.log(weekIssues);

      const weeklyStats = {
        monday: weekIssues.filter(issue => issue.createdOn.split(' ')[0] === 'Mon').length,
        tuesday: weekIssues.filter(issue => issue.createdOn.split(' ')[0] === 'Tue').length,
        wednesday: weekIssues.filter(issue => issue.createdOn.split(' ')[0] === 'Wed').length,
        thursday: weekIssues.filter(issue => issue.createdOn.split(' ')[0] === 'Thu').length,
        friday: weekIssues.filter(issue => issue.createdOn.split(' ')[0] === 'Fri').length,
        saturday: weekIssues.filter(issue => issue.createdOn.split(' ')[0] === 'Sat').length,
        sunday: weekIssues.filter(issue => issue.createdOn.split(' ')[0] === 'Sun').length,
    }

    return weeklyStats;

    }
}

export default projectsService;