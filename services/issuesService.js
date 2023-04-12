import { checkIfValidIssueInput } from "../utils/issuesUtils.js";
import issuesRepository from "../database/repositories/IssuesRepository.js"
import organizationService from "./organizationService.js";
import projectsService from "./projectsService.js";

class issuesService {
    
    constructor(){
        this.repository = new issuesRepository(); 
        this.orgService = new organizationService();
        this.projectService = new projectsService();
    }

    async createIssue(issue){

        checkIfValidIssueInput(issue);

        const org = await this.orgService.getSingleOrganization(issue.organization);

        const todayDate = new Date().toString();

        const createdIssue = await this.repository.createIssue({
            ...issue,
            organization: org._id,
            ticketStatus: "open",
            createdOn: todayDate,
        })

        await this.projectService.addIssueToProject({id: issue.project, createdIssue})
    
        return createdIssue;
    }

    async getAllOrganizationIssues(organization){
    
        const org = await this.orgService.getSingleOrganization(organization)
    
        return await this.repository.findIssuesByOrganization(org._id)
    }

    async getAllOrganizationIssuesStats(organization){
    
        const issues = await this.getAllOrganizationIssues(organization)
        
       // Priority

        const {
            highPriorityIssues,
            mediumPriorityIssues,
            lowPriorityIssues,
        } = this.repository.getIssuesByPriority(issues);
       
       // Status
       
        const {
            openIssues,
            closedIssues,
        } = this.repository.getIssuesByStatus(issues)

       // Project individual issues count

       const projectsIssues = await this.repository.getIndividualProjectsIssuesCount(issues)
    
         const stats = {
            totalIssues: issues.length,
            highPriorityIssues,
            mediumPriorityIssues,
            lowPriorityIssues,
            openIssues, 
            closedIssues, 
            projectsIssues
        }

        return stats;
    }
}

export default issuesService;