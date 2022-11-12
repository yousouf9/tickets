import { Router, Request, Response } from 'express';

import {body} from 'express-validator';
import { BadRequestError, validateRequest } from '@ibee_common/common';
import { User } from '../models/userModel';
import { JWT } from '../services/Jwt';


const router = Router();


router.post('/signup', [
   body('email')
    .isEmail()
    .trim()
    .withMessage('Email must be valid'),
   body('password')
    .trim()
    .isLength({min:4, max:8})
    .withMessage('Passwords must be at least 4 characters and at most 8')
], validateRequest, async (req: Request, res: Response) => {

  const {email, password} = req.body;

  const existingUser = await User.findByEmail(email);

  if(existingUser){
    throw new BadRequestError('Users already exist')
  }

  const user =  User.createUser({email, password});
  await user.save();
         
  const token = await JWT.getToken({
    email:user.email,
    id:user._id.toString('hex')
  })
  req.session = {
    jwt: token
  };

  res.status(201).send(user)

})


export default router;