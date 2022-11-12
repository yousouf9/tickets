import mongoose from "mongoose";
import request from "supertest";
import {app} from '../../app';
import { Ticket } from "../../models/TicketModel";

const createTicket = async(price: number)=>{
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const ticket =  Ticket.createTicket({
    title: "New Concert",
    price: price,
    id: ticketId
 })
 await ticket.save()

 return ticket;
}

it("should return 401 if user is not signed in", async() => {
   
  return request(app)
        .get('/api/orders')
        .send()
        .expect(401)
})

it("should return empty list or list of tickets with 200", async() => {


  const ticket1 = await createTicket(2000);
  const ticket2 = await createTicket(1005);
  const ticket3 = await createTicket(4000);

 const user1 = global.signup()
 const user2 = global.signup()
 
 
 await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({
          ticketId: ticket1.id,
        })
        .expect(201)
 
  await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({
          ticketId: ticket2.id,
        })
        .expect(201)
 
  await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({
          ticketId: ticket3.id,
        })
        .expect(201)

 const response =  await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2);
    expect(response.body[1].ticketId.price).toEqual(4000);
})