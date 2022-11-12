import request from 'supertest';
import {app} from '../../app';

import mongoose from 'mongoose';
//NOTE this import the mock wrapper not this actual one from the __mock__ folder
import {netNewWrapper} from '../../nats-client'

import {Ticket} from '../../models/TicketModel'

it("should return 404 if provided id does not exist",  async () => {

 const id  =new mongoose.Types.ObjectId().toHexString();
   await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signup())
        .send({ 
          title:'hello',
          price: 50
        })
        .expect(404);
})

it("should return 401 if user is not logged in",  async () => {
  const id  =new mongoose.Types.ObjectId().toHexString();
  await request(app)
       .put(`/api/tickets/${id}`)
       .send({ 
         title:'hello',
         price: 50
       })
       .expect(401);
})
it("should return 401 if user does not own the ticket", async () => {
   const {body} =  await request(app)
         .post(`/api/tickets`)
         .set('Cookie', global.signup())
         .send({ 
          title:'hello',
          price: 50
         })
         .expect(201);
    await request(app)
         .put(`/api/tickets/${body.id}`)
         .set('Cookie', global.signup())
         .send({ 
          title:'hello1',
          price: 50
         })
         .expect(401);
})
it("should return 400 if user does not provide title or price",  async () => {
  const cookie = global.signup()
  const {body}=await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ 
      title:'title',
      price: 50
    })
    .expect(201);
    
  await request(app)
    .put(`/api/tickets/${body.id}`)
    .set('Cookie', cookie)
    .send({ 
      title:'',
      price: 20
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${body.id}`)
    .set('Cookie', cookie)
    .send({ 
      title:'',
      price: -50
    })
    .expect(400);
})
it("should update the ticket provide valid inputs",  async () => {
  const cookie = global.signup()

  const {body}=await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ 
      title:'title',
      price: 50
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${body.id}`)
    .set('Cookie', cookie)
    .send({ 
      title:'new title',
      price: 20
    })
    .expect(200);
 const ticketRes = await request(app)
    .get(`/api/tickets/${body.id}`)
    .send()
    .expect(200);
  expect(ticketRes.body.title).toEqual('new title');
  expect(ticketRes.body.price).toEqual(20);
})

it('Should publishes an event after update', async () => {

  const cookie = global.signup()

  const {body}=await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ 
      title:'title',
      price: 50
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${body.id}`)
    .set('Cookie', cookie)
    .send({ 
      title:'new title',
      price: 20
    })
    .expect(200);
 const ticketRes = await request(app)
    .get(`/api/tickets/${body.id}`)
    .send()
    .expect(200);
  expect(ticketRes.body.title).toEqual('new title');
  expect(ticketRes.body.price).toEqual(20);

  console.log("update test",netNewWrapper);
  
  expect(netNewWrapper.client.publish).toHaveBeenCalled();
    
})

it('Should not be able to edit a reserved ticket', async () => {
  
  const cookie = global.signup()

  const orderId = new mongoose.Types.ObjectId().toHexString();

  const {body}=await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ 
      title:'title',
      price: 50
    })
    .expect(201);

  const ticket = await Ticket.findById(body.id);

  ticket?.set({orderId})
  await ticket?.save();

  await request(app)
  .put(`/api/tickets/${body.id}`)
  .set('Cookie', cookie)
  .send({ 
    title:'new title',
    price: 20
  })
  .expect(400);

})