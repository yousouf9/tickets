
import mongoose from "mongoose";
import request from "supertest";
import {app} from '../../app';
import { Order, OrderStatus } from "../../models/OrderModel";
import { Ticket } from "../../models/TicketModel";

const createTicket = async(price: number)=>{
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const ticket =  Ticket.createTicket({
    title: "New Concert",
    price: price,
    id:ticketId
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

it("should return 400 if invalid order id is provided", async() => {
   
  await request(app)
      .get(`/api/orders/12345`)
      .set('Cookie', global.signup())
      .send()
      .expect(400)
})

it("should return 404 if order is not found", async() => {
   
  const ticket1 = await createTicket(2000);
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const userCookie = global.signup()

  await request(app)
        .post('/api/orders')
        .set('Cookie', userCookie)
        .send({
          ticketId: ticket1.id,
        })
        .expect(201)
        
   await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Cookie', global.signup())
        .send()
        .expect(404)
})

it("should update the status to cancelled", async() => {

 const ticket1 = await createTicket(2000);

 const user1 = global.signup()
 
 const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({
          ticketId: ticket1.id,
        })
        .expect(201)
  
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user1)
        .send()
        .expect(204);

    const updatedOrder = await Order.findOne({
      _id:order.id
    }).populate({ 
      path:'ticketId'
    })

    if(!updatedOrder){
      fail('Order not updated');
    }

    expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
    
})
