import Router from 'express';
import jwt from 'jsonwebtoken';

import Organization from '../models/organization.js';
import Issue from '../models/issue.js';

const organizationRouter = Router();

organizationRouter.get('/', async (request, response) => {
    const organizations = await Organization.find({});
    response.json(organizations);
  });

organizationRouter.get('/:name', async (request, response, next) => {
  try {
    const { name } = request.params;
    const organization = await Organization.findOne({name: name});
    return response.json(organization);
  } catch (error) {
    return next(error);
  }
});

organizationRouter.post('/:name/invitation/:role', async (request, response, next) => {
  try {

    const { name, role } = request.params;
    
    const { orgInvitationCode, project } = request.body;
    
    const roleInvitationCode = jwt.sign({
      name,
      role,
      orgInvitationCode,
      project,
    }, process.env.SECRET);

    response.send(roleInvitationCode).status(200).end();

  } catch (error) {
    return next(error);
  }
});

organizationRouter.get('/:name/allProjects/weeklyStats', async (req, res, next)=> {

  const { name } = req.params;

  const organization = await Organization.findOne({name: name})

  const currentDate = new Date();

  const allWeekIssues = await Promise.all(
    organization.projects.map(project=> {
      return(Issue.find({
        project: project.id,
        createdOn: {
          $lte: new Date(),
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

  return res.json(allWeekIssues).end();
});

export default organizationRouter;