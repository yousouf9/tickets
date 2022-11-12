import { Request, Response, Router } from 'express';
import {body} from 'express-validator'
import { BadRequestError, validateRequest } from '@ibee_common/common';
import { User } from '../models/userModel';
import { JWT } from '../services/Jwt';
import { Password } from '../services/Password';

const router = Router();

router.post('/signin', [
   body('email')
    .trim()
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Passwords must be provided')
], validateRequest,  async (req : Request, res : Response) => {
 
  const {email, password} = req.body;

  const user = await User.findByEmail(email);
  if(!user)
    throw new BadRequestError('Invalid email or password');

  const isValid = await Password.compare(user.password, password)

  if (!isValid) throw new BadRequestError('Invalid email or password');

  const token = await JWT.getToken({
    email:user.email,
    id:user._id.toString('hex')
  })
  req.session = {
    jwt: token
  };

  res.status(200).send(user)
})



export default router;