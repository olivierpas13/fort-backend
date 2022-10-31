import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Router from 'express';
import { ObjectId } from 'mongodb';
import { v4 as uuid } from 'uuid';

import User from '../models/user.js';
import Organization from '../models/organization.js';
import organization from '../models/organization.js';

const userRouter = Router();

userRouter.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

userRouter.post('/', async (request, response, next) => {
  try {
    const { name, email, password, organizationCode: organizationCodeWithRole, organization } = request.body;

    const {
       name: organizationName,
       role,
       orgInvitationCode: organizationCode, 
      } = jwt.verify(organizationCodeWithRole, process.env.SECRET)

    const saltRounds = 10;

    if (!(name && password && email )){ return response.status(400).json({ error: 'Fields required missing' }).end(); }

    if (!(name.length > 3) || !(password.length > 3)) { return response.status(400).json({ error: 'name and password length should be more than 3 characters' }).end(); }

    const passwordHash = await bcrypt.hash(password, saltRounds);

    let savedUser;

    if(organizationCode){

      // const organizationFromInvitation = await Organization.findOne({orgInvitationCode: organizationCode})
  
      const user = new User({
        name,
        email,
        role,
        passwordHash,
        organization: organizationName,
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


    if(!organizationCode && organization){

      const user = new User({
        name,
        email,
        passwordHash,
        role: admin,
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
  const { id } = request.params;
  console.log(id);
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
})


export default userRouter;