import request from "supertest";
import {app} from '../../app';

import {Ticket} from '../../models/TicketModel'

//NOTE this import the mock wrapper not this actual one from the __mock__ folder
import {netNewWrapper} from '../../nats-client'
it('it should have route handler for /api/tickets for post request', async()=>{
 const response = await  request(app)
      .post('/api/tickets')
      .send({});
      expect(response.status).not.toEqual(404);
})

it('Can be accessed if user is signed in', async()=>{
  const response = await  request(app)
  .post('/api/tickets')
  .send({})
  .expect(401)
})
it('Should return a status other then 401 when sign in', async()=>{
  const cookie = global.signup()

  const response = await  request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({});

  
  expect(response.status).not.toEqual(401);
})

it('should returns error in title is invalid', async()=>{
   await request(app)
         .post('/api/tickets')
         .set('Cookie', global.signup())
         .send({
          title:'',
          price:10
         })
         .expect(400);
   await request(app)
         .post('/api/tickets')
         .set('Cookie', global.signup())
         .send({
          price:10
         })
         .expect(400);
})

it('should return error if price is invalid', async()=>{
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signup())
  .send({
   title:'my tickets',
   price:-10
  })
  .expect(400);
await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signup())
  .send({
    title:'my tickets',
  })
  .expect(400);
})
it('create a ticket with valid inputs and return 201', async()=>{
  
  let ticket = await Ticket.find({});
  expect(ticket.length).toEqual(0);
  await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signup())
      .send({
        title:'my tickets',
        price:50
      })
      .expect(201);
  ticket = await Ticket.find({});
  expect(ticket.length).toEqual(1);
  expect(ticket[0].price).toEqual(50)
})

it('Should publishes an event', async () => {

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title:'my tickets',
      price:50
    })
    .expect(201);


    expect(netNewWrapper.client.publish).toHaveBeenCalled();
    
})