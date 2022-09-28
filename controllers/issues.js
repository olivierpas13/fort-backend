import Router from 'express';
import { ObjectId } from 'mongodb';


import Issue from '../models/issue.js'
import Organization from '../models/organization.js'
import Project from '../models/project.js'

const issueRouter = Router();

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

        const updatedProject = await Project.findByIdAndUpdate(
            {_id: newid},
            {issues: currentProject.issues.concat(savedIssue)},
            {new: true})

        await Organization.findByIdAndUpdate(issueOrg._id, {"$push": {"projects": updatedProject}}, {new: true})
        return response.json(savedIssue).status(201).end();

    } catch (error) {
        return next(error);
    }
});

export default issueRouter;