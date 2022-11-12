import {Ticket} from '../TicketModel';
import mongoose from 'mongoose';

it('should implement optimistic concurrency control', async()=>{

  const userID = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.createTicket({
    title: 'Concert',
    price: 500,
    userID: userID
  })

  await ticket.save();

  //fetch ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);


  //MAke changes to instances
  firstInstance!.set({
    title:'Movies'
  })
  secondInstance!.set({
    price: 1000
  })

  //save first instance successfully
  await firstInstance!.save();

  //save second instance with error
  try{
    await secondInstance!.save()
  }catch(e){
    expect(e).not.toEqual(null)
    return
  }
  
  throw new Error('Should not be reached')
})

it('it should increment version number by one', async()=>{
  
  const userID = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.createTicket({
    title: 'Concert',
    price: 500,
    userID: userID
  })
  await ticket.save();

  const result = await Ticket.findById(ticket.id);

  //MAke changes to instances
  result!.set({
    title:'Movies'
  })
  await result!.save();

  expect(result!.version).toEqual(1);

})