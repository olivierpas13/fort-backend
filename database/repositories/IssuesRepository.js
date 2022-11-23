import Issue from "../models/issue.js";
import countGroupBy from "../../utils/countGroupBy.js";

class issuesRepository {

    async createIssue({title, priority, assignedDev, organization, submitter, project, ticketStatus, createdOn}){

        const issue = new Issue({
            title,
            priority,
            assignedDev,
            organization,
            ticketStatus,
            createdOn,
            submitter,
            project
        })

        return await issue.save();
    }

    async findIssuesByOrganization(organization){
        return await Issue.find({organization});
    }

    getIssuesByPriority(issues){
        
        const highPriorityIssues = issues.filter(issue => issue.priority === 'high').length 
        const mediumPriorityIssues = issues.filter(issue => issue.priority === 'medium').length
        const lowPriorityIssues = issues.filter(issue => issue.priority === 'low').length

        return {
            highPriorityIssues,
            mediumPriorityIssues,
            lowPriorityIssues,
        }
    }

    getIssuesByStatus(issues){
        
        const openIssues = issues.filter(issue => issue.ticketStatus === 'open').length
        const closedIssues = issues.filter(issue => issue.ticketStatus === 'closed').length
        
        return{
            openIssues,
            closedIssues,
        }
    }

    async getIndividualProjectsIssuesCount(issues){
          return countGroupBy(issues, "project")
    }
}

export default issuesRepository;
