import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Router from 'express';
import { ObjectId } from 'mongodb';
import { v4 as uuid } from 'uuid';

import User from '../database/models/user.js';
import Organization from '../database/models/organization.js';

const userRouter = Router();

userRouter.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

userRouter.get('/:id', async (req, res) => {
  
  const { id } = req.params

  const user = await User.findById(id);

  res.json(user).end();
  
});

userRouter.get('/organization/:organization', async (request, response) => {
  
  const { organization } = request.params

  const users = await User.find({organization});
  
  response.json(users);

});

userRouter.post('/', async (request, response, next) => {
  try {
    const { name, email, password, organization } = request.body;

    const saltRounds = 10;

    if (!(name && password && email )){ return response.status(400).json({ error: 'Fields required missing' }).end(); }

    if (!(name.length > 3) || !(password.length > 3)) { return response.status(400).json({ error: 'name and password length should be more than 3 characters' }).end(); }

    const passwordHash = await bcrypt.hash(password, saltRounds);

    let savedUser;

    if(request.body?.organizationCode){

      const {organizationCode: organizationCodeWithRole} = request.body;

      const {
        name: organizationName,
        role,
        orgInvitationCode: organizationCode, 
        project
       } = jwt.verify(organizationCodeWithRole, process.env.SECRET)
 
      const user = new User({
        name,
        email,
        role,
        passwordHash,
        organization: organizationName,
        project: project.length === 0? null: project
      });

      savedUser = await user.save();

      try {
        await Organization.findOneAndUpdate({

          orgInvitationCode: organizationCode},
          
          {$push: {users: savedUser}},
          
          {new: true})
      
      } catch (error) {
        return next(error);
      }

    }


    if(!request.body?.organizationCode && organization){

      const user = new User({
        name,
        email,
        passwordHash,
        role: "administrator",
        organization: organization
      });

      savedUser = await user.save();

      const org = new Organization({
        name: organization,
        users: [savedUser],
        orgInvitationCode: uuid()
      })

      await org.save();

    }
    
    return response.json(savedUser).status(201);
  } catch (error) {
    return next(error);
  }
});

userRouter.patch('/:id', async (request, response, next) => {
  try {
    const { id } = request.params;
    const { body: {organization} } = request;
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
  
    return response.json(user).status(204);
      
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