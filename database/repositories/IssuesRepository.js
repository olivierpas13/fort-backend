import Issue from "../models/issue.js";
import countProjectIssues from "../../utils/countProjectIssues.js";

class issuesRepository {

    async createIssue(issue){

        const createdIssue = new Issue(issue);
        return await createdIssue.save();
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
        const group = countProjectIssues(issues, "projectTitle")
        console.log(group);
          return group;
    }
}

export default issuesRepository;
