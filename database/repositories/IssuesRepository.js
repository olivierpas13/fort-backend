import Issue from "../models/issue.js";

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

    async getIssuesByPriority(organization){
        
        const highPriorityIssues = await Issue.countDocuments({priority: "high", organization: organization})
        const mediumPriorityIssues = await Issue.countDocuments({priority: "medium", organization: organization})
        const lowPriorityIssues = await Issue.countDocuments({priority: "low", organization: organization})

        return {
            highPriorityIssues,
            mediumPriorityIssues,
            lowPriorityIssues,
        }
    
    }

    async getIssuesByStatus(organization){
        const openIssues = await Issue.countDocuments({ticketStatus: "open", organization: organization})
        const closedIssues = await Issue.countDocuments({ticketStatus: "closed", organization: organization})
        return{
            openIssues,
            closedIssues,
        }
    }

    async getIndividualProjectsIssuesCount(organization){
        const projectsIssues = await Promise.all(
            organization.projects.map(pr => {
              return(Issue.countDocuments({project: pr._id}).then(res => {return({
                projectName: pr.name,
                projectId: pr._id,
                projectIssues: res,
            })}));
            })
          );
          
        return projectsIssues;
    }
}

export default issuesRepository;
