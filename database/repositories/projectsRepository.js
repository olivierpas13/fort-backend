import Project from "../models/project.js";

class projectsRepository{
    
    async addIssueToProject({id, issue}){
        await Project.findByIdAndUpdate(
            id,
            {$push: {issues: issue}},
            {new: true})
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