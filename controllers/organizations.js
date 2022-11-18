import Router from 'express';

import Organization from '../database/models/organization.js';
import organizationService from '../services/organizationService.js';
import Issue from '../database/models/issue.js';

const organizationRouter = Router();

const service = new organizationService()

organizationRouter.get('/:name', async (req, res, next) => {
  try {

    const { name } = req.params;
    const organization = await service.getSingleOrganization(name);
    return res.json(organization).status(200).end();
  
  } catch (error) {
  
    return next(error);
  
  }
});

organizationRouter.post('/:name/invitation/:role', async (req, res, next) => {
  try {

    const { name, role } = req.params;
    const { project } = req.body;
    
    const invitationCode = await service.getInvitationCode({name, role, project})

    return res.send(invitationCode).status(200).end();

  } catch (error) {
    return next(error);
  }
});

organizationRouter.get('/:name/allProjects/weeklyStats', async (req, res, next)=> {

  const { name } = req.params;

  const allWeekIssues = await service.getAllProjectsWeeklyStats(name);

  return res.json(allWeekIssues).end();
});

export default organizationRouter;