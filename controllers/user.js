
import Router from 'express';
import { ObjectId } from 'mongodb';

import User from '../database/models/user.js';
import Organization from '../database/models/organization.js';
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
    const newid = new ObjectId(id);
    const user = await User.findByIdAndUpdate(newid, {organization: organization}, {new: true})
    const org = await Organization.findOne({name: organization})
    if(!org){
      const org = new Organization({
        name: organization,
        users: [user]
      })
      org.save();
    }
  
    if(org){
      org.users = [
        ...org.users,
        user
      ]
      org.save();
    }
  
    return res.json(user).status(204);
      
  } catch (error) {
    return next(error);    
  }
})

userRouter.patch('/:id/role', async(req, res, next)=>{
  try {

    const { id } = req.params;
    const { value } = req.body

    const newid = new ObjectId(id);

    const updatedUser = await User.findByIdAndUpdate(newid, {role: value.toLowerCase()}, {new: true})
    
    return res.json(updatedUser).status(204).end();

  } catch (error) {
    return next(error);
  }


})


export default userRouter;