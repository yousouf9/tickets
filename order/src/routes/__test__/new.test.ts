import mongoose from "mongoose";
import request from "supertest";
import {app} from '../../app';
import { Order, OrderStatus } from "../../models/OrderModel";
import { Ticket } from "../../models/TicketModel";
import { netNewWrapper } from "../../nats-client";


it("should return 401 if user is not signed in", async() => {
   
  return request(app)
        .post('/api/orders')
        .send({
 
        })
        .expect(401)
})

it("should return 400 if ticketId is not  valid", async() => {
   
  const cookie = global.signup();

     await  request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({
           ticketid:'353gf'
        })
        .expect(400)
      await  request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({
           ticketid:''
        })
        .expect(400)
      await  request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({
        })
        .expect(400)
})

it("should return 404 if ticked doe not exist", async () => {
   
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  return request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({
          ticketId
        })
        .expect(404)

})

it("should return an error if ticked has been reserved", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const ticket =  Ticket.createTicket({
      title: "New Concert",
      price: 2000,
      id:ticketId
   })
   await ticket.save()
   const order = Order.createOrder({
     ticketId: ticket.id,
     status: OrderStatus.Created,
     userId: ticket.id,
     expiresAt: new Date()
   })
   await order.save()

   return request(app)
          .post('/api/orders')
          .set('Cookie', global.signup())
          .send({
            ticketId: ticket.id,
          })
          .expect(400)

})

it("should reserve a ticket", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const ticket =  Ticket.createTicket({
    title: "New Concert",
    price: 2000,
    id:ticketId
 })
 await ticket.save()

 await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({
          ticketId: ticket.id,
        })
        .expect(201);
  expect(netNewWrapper.client.publish).toHaveBeenCalled();
})