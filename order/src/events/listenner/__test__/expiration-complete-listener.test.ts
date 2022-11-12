import {ExpirationCompleteListener} from '../expiration-complete-listener'
import {netNewWrapper} from '../../../nats-client';
import {ExpirationCompleteEvent, OrderStatus} from '@ibee_common/common'
import {Types} from 'mongoose'
import {Message} from 'node-nats-streaming';
import { Order } from '../../../models/OrderModel';
import { Ticket } from '../../../models/TicketModel';


const setup = async () => {

   const listener = new ExpirationCompleteListener(netNewWrapper.client);

  const ticket = Ticket.createTicket({
    title:"concert",
    price:5000,
    id: new Types.ObjectId().toHexString()
  })

  await ticket.save();

  const order = Order.createOrder({
    userId: new Types.ObjectId().toHexString(),
    status:OrderStatus.Created,
    expiresAt: new Date(),
    ticketId: ticket.id
  })

  await order.save();

   const data: ExpirationCompleteEvent['data'] ={
        orderId: order.id
   }

  //@ts-ignore
  const oldMessage:Message = {
    ack: jest.fn()
  }

  return {listener, ticket, order, data, oldMessage}
}

it('should  updates the order status to cancelled', async ()=>{
  const {listener, ticket, order, data, oldMessage} = await setup();

  await listener.onMessage(data, oldMessage);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);

})

it('should  emit an order cancelled event', async ()=>{
  const {listener, ticket, order, data, oldMessage} = await setup();

  await listener.onMessage(data, oldMessage);
 
  expect(netNewWrapper.client.publish).toHaveBeenCalled()
  //calls return back the numbers of times it has been invoked with all the argumentsList
  //[1] return the second argument of the publish function which is the json data

 const eventData = JSON.parse((netNewWrapper.client.publish as jest.Mock).mock.calls[0][1])
   expect(eventData.id).toEqual(order.id);
})

it('should  ack the order cancelled message', async ()=>{
  const {listener, ticket, order, data, oldMessage} = await setup();

  await listener.onMessage(data, oldMessage);

  expect(oldMessage.ack).toHaveBeenCalled();
})