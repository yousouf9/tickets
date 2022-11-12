import {Listener, OrderStatus, PaymentCreatedEvent, Subjects} from '@ibee_common/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order} from '../../models/OrderModel';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

 async onMessage(data:PaymentCreatedEvent['data'], msg: Message){

   const order = await Order.findById(data.orderId);

   if(!order){
    throw new Error('Order not found');
   }
   order.set({
     status: OrderStatus.Complete
   })
   await order.save();

   msg.ack();

   //TODO  add order updated here to notify other services that the order
   //has been update. But because we are not further updating th order after complete not implementing it here.
  }
}
