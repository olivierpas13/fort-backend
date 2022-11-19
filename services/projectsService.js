import projectsRepository from "../database/repositories/projectsRepository.js"

class projectsService{
    constructor(){
        this.repository = new projectsRepository()
    }
    async addIssueToProject({id, issue}){
        return await this.repository.addIssueToProject({id, issue})
    }
}

export default projectsService;