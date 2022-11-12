import {Request, Response, Router} from 'express';
import {requireAuth} from '@ibee_common/common';
import { Order } from '../models/OrderModel';
const router =  Router();

router.get('/' , requireAuth,  async (req:Request, res:Response) => {
    
  const order = await Order.
                            find({userId: req.currentUser!.id})
                            .populate({
                              path: 'ticketId'
                            })

       console.log(order);
       
  res.status(200).send(order)
})


export {router as fetchAllOrders}