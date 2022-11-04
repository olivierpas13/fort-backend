import Router, { response } from 'express';
import { ObjectId } from 'mongodb';

import Organization from '../models/organization.js';
import Project from '../models/project.js';
import User from '../models/user.js';

const projectRouter = Router();

projectRouter.get('/', async (request, response) => {
    const projects = await Project.find({});
    response.json(projects);
  });

projectRouter.get('/:id', async (request, response, next) => {
  try {
    const { id } = request.params;
    const project = await Project.findById(id);
    return response.json(project);
  } catch (error) {
    return next(error);
  }
});

projectRouter.get('/:id/stats', async (req, res, next) => {
    try {

      const { id } = req.params;

      const project = await Project.findById(id);
      
      const users = await User.countDocuments({project: id})

      const projectStats = {
        projectName: project.name,
        projectIssues: project.issues.length,
        users,
        highPriorityIssues: project.issues.filter(issue=> issue.priority === 'high').length,
        mediumPriorityIssues: project.issues.filter(issue=> issue.priority === 'medium').length,
        lowPriorityIssues: project.issues.filter(issue=> issue.priority === 'low').length,
        openIssues: project.issues.filter(issue=> issue.ticketStatus === 'open').length,
        closedIssues: project.issues.filter(issue=> issue.ticketStatus === 'closed').length,
      }

      return res.json(projectStats).end();
    } catch (error) {
      return next(error);
    }
});  

projectRouter.get('/organization/:organization', async (req, res, next) => {
    
    try {

        const { organization } = req.params;
    
        const projects = await Project.find({organization: organization});

        return res.json(projects).status(200).end();

    } catch (error) {
        return next(error);        
    }
})

projectRouter.post('/', async (req, res, next) =>{
    try {
        const {name, organization} = req.body;
        if(!name || !organization){
            return res.json({error: 'Required fields missing'}).status(400).end();
        }

        let currentOrganization =  await Organization.findOne({
            name: organization
        })
        
        const project = new Project({
            name,
            organization: currentOrganization._id,
            issues: []
        })
        
        const savedProject = await project.save();
        
        await Organization.findOneAndUpdate({name: organization}, {projects: currentOrganization.projects.concat(savedProject)}, {new: true})

        return res.json(savedProject).status(201).end();

    } catch (error) {
        return next(error);
    }
})

projectRouter.patch('/:id', async (req, res, next) =>{
    try {
        const { id } = request.params;
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

        return response.json(savedProject).status(204);

    } catch (error) {
        return next(error);
    }
})

export default projectRouter;