import Organization from "../models/organization.js";
import Issue from "../models/issue.js";

class organizationRepository {

    async getSingleOrganization(name){
        try {
            return await Organization.findOne({name: name})
        } catch (error) {
            console.error(error);
        }
    }
    
    async getLastWeekIssues(projects){
        try {

            const currentDate = new Date();
            
            return await Promise.all(
                projects.map(project=> {
                  return(Issue.find({
                    project: project.id,
                    createdOn: {
                      $gte: currentDate.setDate(currentDate.getDate()-7),
                      }
                  }).then(res=> {
                    return{
                      name: project.name,
                      id: project.id,
                      weeklyIssues: {
                        monday: res.filter(issue => issue.createdOn.split(' ')[0] === 'Mon').length,
                        tuesday: res.filter(issue => issue.createdOn.split(' ')[0] === 'Tue').length,
                        wednesday: res.filter(issue => issue.createdOn.split(' ')[0] === 'Wed').length,
                        thursday: res.filter(issue => issue.createdOn.split(' ')[0] === 'Thu').length,
                        friday: res.filter(issue => issue.createdOn.split(' ')[0] === 'Fri').length,
                        saturday: res.filter(issue => issue.createdOn.split(' ')[0] === 'Sat').length,
                        sunday: res.filter(issue => issue.createdOn.split(' ')[0] === 'Sun').length,
                    }
                    }
                  }))
                })
              )

        } catch (error) {
            console.error(error);
        }
    }

}

export default organizationRepository;