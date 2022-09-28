import Router from 'express';

import Organization from '../models/organization.js';

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

export default organizationRouter;