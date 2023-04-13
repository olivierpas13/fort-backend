import Project from "../models/project.js";
class projectsRepository{
    
    async addIssueToProject({id, issue}){
        return await Project.findByIdAndUpdate(
            id,
            {$push: {issues: issue}},
            {new: true})
    }

    async updateIssueInProject({projectId, issueId, updatedFields}){

        const project = await Project.findById(projectId);

        if (!project) {
          throw new Error('No matching project found')
        }
        
        const issue = project.issues.id(issueId);
        
        if (!issue) {
          throw new Error('No matching issue found')
        }

        Object.assign(issue, updatedFields);

        const updatedProject = await project.save();
            return updatedProject;
    };

    async deleteIssueInProject({projectId, issueId}){
        const project = await Project.findById(projectId);

        if (!project) {
          console.log('No matching project found');
          return;
        }
    
        const issue = project.issues.id(issueId);
    
        if (!issue) {
          console.log('No matching issue found');
          return;
        }
    
        issue.remove();
    
        await project.save();
    }

    async addUserToProject({id, user}){
        await Project.findByIdAndUpdate(
            id,
            {$push: {users: user}},
            {new: true})
    }

    async fetchProjectById(id){
        return await Project.findById(id);
    }

    async fetchProjectsByOrganization(organization){
        return await Project.find({organization});
    }

    async createNewProject({name, organization, logo}){
        try {
            const project = new Project({
                name,
                organization,
                logo,
                issues:[],
              })
      
              return await project.save();
        } catch (error) {
            throw(error);
        };
    }
}

export default projectsRepository;