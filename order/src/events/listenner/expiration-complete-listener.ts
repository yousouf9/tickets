import {Listener, ExpirationCompleteEvent, Subjects} from '@ibee_common/common'
import { Message } from 'node-nats-streaming';
import {Ticket} from '../../models/TicketModel'
import {Order, OrderStatus} from '../../models/OrderModel'
import {queueGroupName} from './queue-group-name'
import { OrderCancelledPublisher } from '../publisher/order-cancelled-publisher';


export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
  subject: Subjects.expirationComplete = Subjects.expirationComplete;
  queueGroupName: string = queueGroupName

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message){
   
    console.log("Order data", data);
    const order = await Order.findById(data.orderId)
                              .populate({
                                path: 'ticketId'
                              })

    
    if(!order){
      throw new Error('Order not found');
    }

    if(order.status === OrderStatus.Complete){
      return  msg.ack()
    }
    
    order.set({ 
      status: OrderStatus.Cancelled
    })
    
    await order.save();

    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
       version: order.version,
       ticket:{
        id: order.ticketId?.id
       }
    })

    msg.ack()
  }
}