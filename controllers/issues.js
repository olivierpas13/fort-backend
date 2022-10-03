import Router, { response } from 'express';
import { ObjectId } from 'mongodb';

import Issue from '../models/issue.js'
import Organization from '../models/organization.js'
import Project from '../models/project.js'

const issueRouter = Router();

// Create an issue

issueRouter.post('/', async (request, response, next) => {
    try {
        const {title, priority, assignedDev, organization, submitter, project} = request.body;
        if(!title || !priority || !assignedDev || !organization || !submitter){
            return response.json({error: 'Required fields missing'}).status(400).end();
        }
        const issueOrg = await Organization.findOne({name: organization})

        const issue =  new Issue({
            ...request.body,
            organization: issueOrg._id,
            ticketStatus: "open",
        })

        const savedIssue = await issue.save();

        const currentProject = await Project.findOne({_id: project})

        const newid = new ObjectId(project);

        await Project.findByIdAndUpdate(
            {_id: newid},
            {issues: currentProject.issues.concat(savedIssue)},
            {new: true})

        // await Organization.findByIdAndUpdate(issueOrg._id, {"$push": {"projects": updatedProject}}, {new: true})
        
        // await Organization.findByIdAndUpdate(
        //     issueOrg._id, 
        //     {$set: {projects: updatedProject}})

        return response.json(savedIssue).status(201).end();

    } catch (error) {
        return next(error);
    }
});

// Get the organization's issues

issueRouter.get('/:name', async (req, res, next) =>{
    try {
        const {name} = req.params

        
        const organization = await Organization.findOne({name: name});
        
        const issues = await Issue.find({organization: organization._id})

        return res.json(issues);

    } catch (error) {
        return next(error);
    }

})

issueRouter.get('/:name/stats', async (req, res, next) =>{
    try {
        const {name} = req.params

        const organization = await Organization.findOne({name: name});
        
        // Priority

        const highPriorityIssues = await Issue.countDocuments({priority: "high", organization: organization._id})
        const mediumPriorityIssues = await Issue.countDocuments({priority: "medium", organization: organization._id})
        const lowPriorityIssues = await Issue.countDocuments({priority: "low", organization: organization._id})
        
        // Status
        
        const openIssues = await Issue.countDocuments({ticketStatus: "open", organization: organization._id})
        const closedIssues = await Issue.countDocuments({ticketStatus: "closed", organization: organization._id})

        // Project individual issues count

        const projectsIssues = await Promise.all(
            organization.projects.map(pr => {
              return(Issue.countDocuments({project: pr._id}).then(res => {return({
                projectName: pr.name,
                projectId: pr._id,
                projectIssues: res,
            })}));
            })
          );

        return res.json({
            highPriorityIssues,
            mediumPriorityIssues,
            lowPriorityIssues,
            openIssues, 
            closedIssues, 
            projectsIssues});

    } catch (error) {
        return next(error);
    }

})

export default issueRouter;