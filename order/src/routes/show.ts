import { NotFoundError, requireAuth, validateRequest } from '@ibee_common/common';
import {Request, Response, Router} from 'express';
import { Order } from '../models/OrderModel';
import {param} from 'express-validator'
import mongoose from 'mongoose';

const router =  Router();


router.get('/:orderID', 
  requireAuth,
  [
    param('orderID')
      .trim()
      .not()
      .isEmpty()
      .custom((input:string)=>mongoose.Types.ObjectId.isValid(input))
      .withMessage('valid ticketId must be provided')
  ],
  validateRequest,
  async (req:Request, res:Response) => {
    
  const order = await Order.
                            findOne(
                              {
                                userId: req.currentUser!.id,
                                _id:req.params.orderID
                              }
                            )
                            .populate({
                              path: 'ticketId'
                            })
    
    if(!order){
      throw new NotFoundError();
    }
       
  res.status(200).send(order)
})


export {router as showOrders}