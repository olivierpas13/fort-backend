import Router from 'express';
import loginService from '../services/loginService.js';

const loginRouter = Router();

const service = new loginService()

loginRouter.post('/', async (req, res) => {

  try {
    
    const { email,  password } = req.body;
  
    const loggedUser = await service.login({email, password});
  
    return res.send(loggedUser).status(200);
  } catch (error) {
    throw error;
  }
});

export default loginRouter;