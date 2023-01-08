import Project from "../models/project.js";

class projectsRepository{
    async addIssueToProject({id, issue}){
        await Project.findByIdAndUpdate(
            id,
            {$push: {issues: issue}},
            {new: true})
    }

    async fetchProjectById(id){
        return await Project.findById(id);
    }

    async fetchProjectsByOrganization(organization){
        return await Project.find({organization});
    }
}

export default projectsRepository;