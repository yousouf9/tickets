import request from "supertest";

import mongoose from "mongoose";

import {app} from '../../app';

it("should return 404 if ticket not found", async() => {
  const id = new mongoose.Types.ObjectId().toHexString();
   await request(app)
      .get(`/api/tickets/${id}`)
      .send()
      .expect(404)
})

it("should return ticket if found", async() => {

  const title = "Ticket"
  const price = 50;
 const response =  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title,
      price
    })
   .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body?.id}`)
    .send()
    .expect(200);
  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
  
})