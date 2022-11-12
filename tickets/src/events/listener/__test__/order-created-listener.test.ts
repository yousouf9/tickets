import { OrderCreatedEvent, OrderStatus} from "@ibee_common/common";
import { Types } from "mongoose";
import { netNewWrapper } from "../../../nats-client";
import { OrderCreatedListener } from "../order-created-listener";
import { Ticket } from '../../../models/TicketModel';


const setup = async () =>{

  const listener = new OrderCreatedListener(netNewWrapper.client);
  
  const ticket = Ticket.createTicket({
    title:"concert",
    price:5000,
    userID: new Types.ObjectId().toHexString()
  })

  await ticket.save();
 
  
  const data:OrderCreatedEvent['data'] = {
    id: new Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: ticket.userID,
    expiresAt: new Date().toISOString(),
    version:0,
    ticket: {
        id: ticket.id,
        price: ticket.price,
    }
}

//@ts-ignore
const oldMessage:Message = {
     ack: jest.fn()
}
 
  return {listener, data, oldMessage, ticket}
 
 }


 it('should set the orderId of the ticket', async()=>{
   const {listener, data, oldMessage, ticket} =  await setup();

   await listener.onMessage(data, oldMessage);

   const  updatedTicket = await Ticket.findById(ticket.id);


   expect(updatedTicket!.orderId).toEqual(data.id);
 })

 it('should acks the message', async()=>{
  const {listener, data, oldMessage} =  await setup();

  await listener.onMessage(data, oldMessage);

  expect(oldMessage.ack).toHaveBeenCalled();
 })

 it('should publish a ticket update event', async()=>{
  const {listener, data, oldMessage} =  await setup();

  await listener.onMessage(data, oldMessage);

   expect(netNewWrapper.client.publish).toHaveBeenCalled();

   const ticketPublishedUpdateMessage = JSON.parse((netNewWrapper.client.publish as jest.Mock).mock.calls[0][1]);

   expect(ticketPublishedUpdateMessage.orderId).toEqual(data.id);

 })