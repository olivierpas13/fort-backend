
import Router from 'express';

import { getDataFromOrgCode } from '../utils/userUtils.js';
import userService from '../services/userService.js';

const userRouter = Router();

const service = new userService();

userRouter.get('/:id', async (req, res) => {
  
  try {

    const { id } = req.params
    
    const user = await service.getUserById(id);
    return res.json(user).status(200).end();
    
  } catch (error) {
    console.error(error);
  }
  
});

userRouter.get('/organization/:organization', async (req, res) => {
  
  try {
    
    const { organization } = req.params
  
    const users = await service.getAllUsersFromOrg(organization);
    return res.json(users).status(200).end();
  
  } catch (error) {
    console.error(error);    
  }
});

userRouter.post('/', async (req, res, next) => {
  try {
    const { name, email, password, organization } = req.body;
    
    const savedUser = await service.createUser({
      name,
      email,
      password,
      organization,
      organizationCode: req.body?.organizationCode
    })

    return res.json(savedUser).status(201).end();
    
  } catch (error) {
    return next(error);
  }
});

userRouter.patch('/:id', async (req, res, next) => {
  try {

    const { id } = req.params;
    
    const { body: {organization} } = req;
    
    const user = await service.updateUserOrganization({id, organization});
  
    return res.json(user).status(204);
      
  } catch (error) {
    return next(error);    
  }
})

userRouter.patch('/:id/role', async(req, res, next)=>{
  try {

    const { id } = req.params;
    const { value } = req.body

    const updatedUser = service.changeUserRole({
      id,
      role: value,
    }) 
    
    return res.json(updatedUser).status(204).end();

  } catch (error) {
    return next(error);
  }
})

userRouter.patch('/:id/add-from-git', async (req, res, next) => {
  try {

    const updatedUser = await service.addUserFromGithub({
      id: req.params.id,  
      code:req.body.code
    })

    return res.json(updatedUser).status(204).end();

  } catch (error) {
    return next(error);
  }
});



export default userRouter;