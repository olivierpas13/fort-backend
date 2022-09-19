import bcrypt from 'bcrypt';
import Router from 'express';
import User from '../models/user.js';
import Organization from '../models/organization.js';

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
    
    const organizationObject  = await Organization.findOne({name: organization})

    if(!organizationObject){
      const org = new Organization({
        name: organization,
        users: [savedUser._id]
      })
      await org.save();
    }

    if(organizationObject){
      organizationObject = {
        ...organizationObject,
        users: [...users, savedUser._id]
      }
      organizationObject.save();
    }

    return response.status(201).json(savedUser);
  } catch (error) {
    return next(error);
  }
});

export default userRouter;