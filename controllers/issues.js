import Router from 'express';

import Issue from '../database/models/issue.js'
import Organization from '../database/models/organization.js'
import issuesService from '../services/issuesService.js';

const issueRouter = Router();

const service = new issuesService();

// Create an issue

issueRouter.post('/', async (request, response, next) => {
    try {
        const {title, priority, assignedDev, organization, submitter, project} = request.body;

        const issue = await service.createIssue({title, priority, assignedDev, organization, submitter, project})  

        return response.json(issue).status(201).end();

    } catch (error) {
        return next(error);
    }
});

// Get the organization's issues

issueRouter.get('/:orgName', async (req, res, next) =>{
    try {

        const {orgName} = req.params
        const issues = await service.getAllOrganizationIssues(orgName);
        return res.json(issues).status(200).end();

    } catch (error) {
        return next(error);
    }

})

// Get all organization issues stats

issueRouter.get('/:name/stats', async (req, res, next) =>{
    try {
        const {name} = req.params

        const stats = await service.getAllOrganizationIssuesStats(name)        
 
        return res.json(stats).status(200).end();

    } catch (error) {
        return next(error);
    }

})

export default issueRouter;