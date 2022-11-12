import { OrderCancelledEvent, OrderStatus} from "@ibee_common/common";
import { Types } from "mongoose";
import { netNewWrapper } from "../../../nats-client";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Ticket } from '../../../models/TicketModel';


const setup = async () =>{

  const listener = new OrderCancelledListener(netNewWrapper.client);
  
  const orderId = new Types.ObjectId().toHexString()

  const ticket = Ticket.createTicket({
    title:"concert",
    price:5000,
    userID: new Types.ObjectId().toHexString()
  })

  ticket.set({orderId});

  await ticket.save();
  
  const data:OrderCancelledEvent['data'] = {
    id: orderId,
    version:0,
    ticket: {
        id: ticket.id,
    }
}

//@ts-ignore
const oldMessage:Message = {
     ack: jest.fn()
}
 
  return {listener, data, oldMessage, ticket, orderId}
 
 }


 it('should update the tickets, publish it and acks the event', async()=>{
   
  //retrieve all data from setup
  const {listener, data, oldMessage, ticket, orderId} =  await setup();

  //update and publish the event
   await listener.onMessage(data, oldMessage);

  //find updated ticket
  const  updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  
  //make sure publish has been called
  console.log("yusuf being called", netNewWrapper);
  
  expect(netNewWrapper.client.publish).toHaveBeenCalled();

  //get updated event and test
  const ticketPublishedUpdateMessage = JSON.parse((netNewWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(ticketPublishedUpdateMessage.orderId).toEqual(data.id);

   expect(oldMessage.ack).toHaveBeenCalled();
 })


