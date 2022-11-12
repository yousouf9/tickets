import {Request, Response, Router} from 'express';
import {body} from 'express-validator'
import { isValidObjectId } from 'mongoose'
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError,
    NotAuthorizedError,
    OrderStatus
  }from '@ibee_common/common'
import {Order} from '../models/OrderModel';
import { Paystack } from '../paystack';
import { Payment } from '../models/PaymentModel';
import { netNewWrapper } from '../nats-client';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';

const  router =  Router();

router.post('/',
  requireAuth,
  [
    body('token')
      .not()
      .isEmpty()
      .withMessage("Token not provided"),
    body('reference')
      .not()
      .isEmpty()
      .withMessage("Transaction reference not provided"),
    body('orderId')
      .isString()
      .custom(input => isValidObjectId(input))
      .withMessage("Invalid orderId"),
  ],
  validateRequest,
  async(req: Request, res: Response) => {

    const { token, orderId, reference } = req.body;

    const order = await Order.findById(orderId);

    if(!order){
      throw new NotFoundError()
    }
    if(order.userId !== req.currentUser?.id){
      throw new NotAuthorizedError('You cannot make payment for this order')
    }
    if(order.status === OrderStatus.Cancelled){
      throw new BadRequestError("This order has been cancelled")
    }

   const paymentResponse = await Paystack.transaction.charge({
      reference,
      authorization_code:`${token}`,
      amount: order.price * 100,
      email: req.currentUser.email
    })

    const payment = Payment.createPayment({
       orderId,
       reference:reference
    })

    await payment.save();

    new PaymentCreatedPublisher(netNewWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      reference: payment.reference
    })
    res.status(201).send({id: payment.id});
})


export {router as paymentRouter}