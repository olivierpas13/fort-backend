import Router from 'express';
import { ObjectId } from 'mongodb';

import Organization from '../database/models/organization.js';
import Project from '../database/models/project.js';
import User from '../database/models/user.js';
import projectsService from '../services/projectsService.js';

const projectRouter = Router();

const service = new projectsService();

projectRouter.get('/:id', async (req, res, next) => {
  try {
    
    const { id } = req.params;
    
    const project = await service.getProjectById(id);
    
    return res.json(project);

} catch (error) {

    return next(error);

}
});

projectRouter.get('/:id/stats', async (req, res, next) => {
    try {
        const { id } = req.params;

        const projectStats  = await service.getProjectStats(id);
        
        return res.json(projectStats).end();
    
    } catch (error) {
      return next(error);
    }
});  

projectRouter.get('/:id/weeklyStats', async (req, res, next) => {
    try {

        const { id } = req.params;

        const weeklyStats = await service.getWeeklyProjectStats(id);

        return res.json(weeklyStats).end();

    } catch (error) {
      return next(error);
    }

});  

projectRouter.get('/organization/:organization', async (req, res, next) => {
    
    try {

        const { organization } = req.params;
    
        const projects = await service.getProjectsByOrganization(organization);

        return res.json(projects).status(200).end();

    } catch (error) {
        return next(error);        
    }
})

projectRouter.post('/', async (req, res, next) =>{
    try {
        const {name, organization} = req.body;
        
        const savedProject = await service.createProject({name, organization});

        return res.json(savedProject).status(201).end();

    } catch (error) {
        return next(error);
    }
})

projectRouter.patch('/:id', async (req, res, next) =>{
    try {
        const { id } = req.params;
        const { issue } =  req.body;
        const newid = new ObjectId(id);
        
        const project = await Project.findById(newid);
        project = {
            ...project,
            issues: project.issues.concat(issue)
        }
        
        const savedProject = project.save();
        
        const orgId = new ObjectId(issue.organization);

        const currentOrganization =  await Organization.findById(orgId);

        const projectToUpdate  = currentOrganization.projects.find(project=> toString(project._id) === id)
        
        projectToUpdate = savedProject;

        currentOrganization.save();

        return res.json(savedProject).status(204);

    } catch (error) {
        return next(error);
    }
})

export default projectRouter;