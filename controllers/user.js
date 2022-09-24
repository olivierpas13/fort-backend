import bcrypt from 'bcrypt';
import Router from 'express';
import User from '../models/user.js';
// import Session from '../models/session'
import Organization from '../models/organization.js';
import mongodb from 'mongodb'
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import organization from '../models/organization.js';

const userRouter = Router();

userRouter.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

userRouter.post('/', async (request, response, next) => {
  try {
    const { name, email, password, organization } = request.body;

    const saltRounds = 10;

    if (!(name && password && email && organization)){ return response.status(400).json({ error: 'Email, name, organization and password are required' }).end(); }

    if (!(name.length > 3) || !(password.length > 3)) { return response.status(400).json({ error: 'name and password length should be more than 3 characters' }).end(); }

    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      email,
      passwordHash,
      organization
    });

    const savedUser = await user.save();
    
    const organizationObject  = await Organization.findOne({name: savedUser.organization})

    if(!organizationObject){
      const org = new Organization({
        name: organization,
        users: [savedUser._id]
      })
      await org.save();
    }

    if(organizationObject){
      try {
        await Organization.findByIdAndUpdate({
          _id: organizationObject._id},
          {users: organizationObject.users.concat(savedUser._id)},
          {new: true})
      
      } catch (error) {
        console.error(error);
      }
    }

    return response.json(savedUser).status(201);
  } catch (error) {
    return next(error);
  }
});

userRouter.patch('/:id', async (request, response, next) => {
  const { id } = request.params;
  const { body: {organization} } = request;
  const newid = new ObjectId(id);
  const user = await User.findByIdAndUpdate(newid, {organization: organization}, {new: true})
  const org = await Organization.findOne({name: organization})
  if(!org){
    const org = new Organization({
      name: organization,
      users: [user._id]
    })
    org.save();
  }
    console.log(user);
  return response.json(user).status(204);
})


export default userRouter;