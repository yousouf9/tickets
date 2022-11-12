import {Subjects, OrderCancelledEvent, Listener, OrderStatus} from '@ibee_common/common';
import { Message } from 'node-nats-streaming';
import {queueGroupName} from './queue-group-name';
import {Order} from '../../models/OrderModel';

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message){
    const order = await Order.findByEvent(data);

    if(!order){
      throw new Error('Order not found');
    }
    order.set({
      status: OrderStatus.Cancelled,
      version: data.version
    })
    await order.save();

    msg.ack();
  }
}