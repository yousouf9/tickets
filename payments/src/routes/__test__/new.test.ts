import { OrderStatus } from '@ibee_common/common';
import { Types } from 'mongoose';
import request from 'supertest';
import {app} from '../../app'
import { Order } from '../../models/OrderModel';
import { Payment } from '../../models/PaymentModel';

import {Paystack} from '../../paystack'

jest.mock('../../paystack')

it('should return 404 if order does not exist', async() => {
  
  const userCookie = global.signup()

  await request(app)
          .post('/api/payments')
          .set('Cookie', userCookie)
          .send({ 
             token:"45gryu4646",
             orderId: new Types.ObjectId().toHexString(),
             reference:new Types.ObjectId().toHexString()
          })
          .expect(404)       
})

it('should return 401 if order does not belong to user', async() => {
  const userCookie = global.signup()

  const order = Order.createOrder({
      id: new Types.ObjectId().toHexString(),
      price:500,
      userId:new Types.ObjectId().toHexString(),
      status:OrderStatus.Created,
      version:0
  })
  await order.save();

  await request(app)
          .post('/api/payments')
          .set('Cookie', userCookie)
          .send({ 
             token:"45gryu4646",
             orderId: order.id,
             reference:new Types.ObjectId().toHexString()
          })
          .expect(401)       
})

it('should return 400 if order is cancelled', async() => {

  const userId = new Types.ObjectId().toHexString()

  const order = Order.createOrder({
      id: new Types.ObjectId().toHexString(),
      price:500,
      userId,
      status:OrderStatus.Cancelled,
      version:0
  })

  const userCookie = global.signup(userId)
  await order.save();

  await request(app)
          .post('/api/payments')
          .set('Cookie', userCookie)
          .send({ 
             token:"45gryu4646",
             orderId: order.id,
             reference:new Types.ObjectId().toHexString()
          })
          .expect(400)       
})

it('should return 201 with valid inputs', async ()=>{
  
  const userId = new Types.ObjectId().toHexString()
  const reference =new Types.ObjectId().toHexString()

  const order = Order.createOrder({
      id: new Types.ObjectId().toHexString(),
      price:500,
      userId,
      status:OrderStatus.Created,
      version:0
  })

  const userCookie = global.signup(userId)
  await order.save();

  await request(app)
  .post('/api/payments')
  .set('Cookie', userCookie)
  .send({ 
     token:"45gryu4646",
     orderId: order.id,
     reference
  })
  .expect(201)   

 const chargeOptions = (Paystack.transaction.charge as jest.Mock).mock.calls[0][0];

 expect(chargeOptions.amount).toEqual(500 * 100)
 expect(chargeOptions.authorization_code).toEqual("45gryu4646")


 const payment = await Payment.findOne({orderId: order.id})

 expect(payment).not.toBeNull();

})
