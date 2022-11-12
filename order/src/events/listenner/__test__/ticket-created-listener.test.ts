import {TicketCreatedListener} from '../ticket-created-listener'
import {netNewWrapper} from '../../../nats-client';
import {TicketCreatedEvent} from '@ibee_common/common'
import {Types} from 'mongoose'
import {Message} from 'node-nats-streaming';
import { Ticket } from '../../../models/TicketModel';

const setup = async () =>{

 const listener = new TicketCreatedListener(netNewWrapper.client);
 
 const data:TicketCreatedEvent['data'] = {
     version: 0,
     id: new Types.ObjectId().toHexString(),
     price: 4000,
     title: 'Movies',
     userId: new Types.ObjectId().toHexString()
 }

//@ts-ignore
 const oldMessage:Message = {
      ack: jest.fn()
 }


 return {listener, data, oldMessage}

}

it('should create and save a ticket', async ()=> {
  const {listener, data, oldMessage} =  await setup();

   await listener.onMessage(data, oldMessage);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);

})

it('should acks the message', async ()=> {
  const {listener, data, oldMessage} =  await setup();

  await listener.onMessage(data, oldMessage);
  expect(oldMessage.ack).toHaveBeenCalled();
})