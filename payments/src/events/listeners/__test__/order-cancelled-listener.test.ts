import { OrderCancelledEvent, OrderStatus } from "@ibee_common/common"
import { Types } from "mongoose"
import { Order } from "../../../models/OrderModel"
import { netNewWrapper } from "../../../nats-client"
import { OrderCancelledListener } from "../order-cancelled-listener"


const setup = async () => {

  const listener = new OrderCancelledListener(netNewWrapper.client)
   

  const order = Order.createOrder({
    id:new Types.ObjectId().toHexString(),
    version:0,
    status: OrderStatus.Cancelled,
    price:5000,
    userId: new Types.ObjectId().toHexString(),
  })

  await order.save()

  const data:OrderCancelledEvent['data'] = {
     id:order.id,
     version: 1,
     ticket:{
      id: new Types.ObjectId().toHexString()
     }
  }
  //@ts-ignore
  const msg:Message = {
    ack: jest.fn()
  }

  return { listener, order, data, msg} 
}

it('should update the status of the order', async () => {

  const { listener, order, data, msg} = await setup();
  

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);

})
it('should ack the order message', async () => {

  const { listener, order, data, msg} = await setup();
  
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
})