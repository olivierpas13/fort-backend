import Project from "../models/project.js";

class projectsRepository{
    async addIssueToProject({id, issue}){
        await Project.findByIdAndUpdate(
            id,
            {$push: {issues: issue}},
            {new: true})
    }
}

export default projectsRepository;