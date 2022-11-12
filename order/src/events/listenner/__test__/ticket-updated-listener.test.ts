import { TicketUpdatedEvent } from "@ibee_common/common";
import { Types } from "mongoose";
import { netNewWrapper } from "../../../nats-client";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { Ticket } from '../../../models/TicketModel';


const setup = async () =>{

  const listener = new TicketUpdatedListener(netNewWrapper.client);
  
  const ticket = Ticket.createTicket({
    title:"concert",
    price:5000,
    id: new Types.ObjectId().toHexString()
  })

  await ticket.save();
 
  console.log("Initial Version", ticket.version);
  
  const data:TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    price: 4000,
    title: 'Movies',
    userId: new Types.ObjectId().toHexString()
}

//@ts-ignore
const oldMessage:Message = {
     ack: jest.fn()
}
 
  return {listener, data, oldMessage, ticket}
 
 }


 it('should find, update and save a ticket', async()=>{
   const {listener, data, oldMessage, ticket} =  await setup();

   await listener.onMessage(data, oldMessage);

   const  updatedTicket = await Ticket.findById(ticket.id);


   expect(updatedTicket!.title).toEqual(data.title);
   expect(updatedTicket!.price).toEqual(data.price);
   expect(updatedTicket!.version).toEqual(data.version);
 })

 it('should acks the message', async()=>{
  const {listener, data, oldMessage} =  await setup();

  await listener.onMessage(data, oldMessage);

  expect(oldMessage.ack).toHaveBeenCalled();
 })

 it('should not call acks if event has a skipped version number', async()=>{
  const {listener, data, oldMessage} = await setup();
  data.version = 4;

  try {
    await listener.onMessage(data, oldMessage); 
  } catch (error) {
    
  }
  expect(oldMessage.ack).not.toHaveBeenCalled();

 })