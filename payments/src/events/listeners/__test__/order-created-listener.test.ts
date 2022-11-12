import {netNewWrapper} from '../../../nats-client';
import {Types} from 'mongoose'
import {OrderCreatedListener} from '../order-created-listener';
import {OrderCreatedEvent, OrderStatus} from '@ibee_common/common';
import { Order } from '../../../models/OrderModel';
import { Message } from 'node-nats-streaming';

const setup = async () => {

  const listener = new OrderCreatedListener(netNewWrapper.client)
   
  const data:OrderCreatedEvent['data'] = {
     id:new Types.ObjectId().toHexString(),
     version:0,
     status: OrderStatus.Created,
     expiresAt: new Date().toISOString(),
     userId: new Types.ObjectId().toHexString(),
     ticket:{
      id: new Types.ObjectId().toHexString(),
      price: 50000
     }
  }

  //@ts-ignore
  const msg:Message = {
    ack: jest.fn()
  }

  return { listener, data, msg}
}

it('should emit the order created event', async () => {

   const { listener, data, msg}  = await setup()

   await listener.onMessage(data, msg)

   const order = await Order.findById(data.id);
   
   
   expect(order!.price).toEqual(data.ticket.price);
})

it('should ack the order message', async () =>{

  const { listener, data, msg}  = await setup()


  await listener.onMessage(data, msg)

   expect(msg.ack).toHaveBeenCalled();
})