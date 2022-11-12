import {HydratedDocument, model, Model} from 'mongoose';
import { OrderStatus } from '@ibee_common/common';
import { Schema } from 'mongoose';

interface OrderI{
  id:string,
  status: OrderStatus,
  version: number,
  userId: string
  price: number
}
 
 interface OrderVersionI extends OrderI {
   version: number
 }
 interface OrderModel extends Model<OrderVersionI>{
    createOrder(order: OrderI): HydratedDocument<OrderVersionI>
    findByEvent(event:{id:string, version:number}): Promise<HydratedDocument<OrderVersionI> | null>
 }


 const schema = new Schema<OrderI, OrderModel>({ 

  userId:{
    type:String,
    required:[true, 'userId is required']
  },
  price:{
    type:Number,
    required:[true, 'price is required']
  },
  status:{
    type:String,
    required:[true, 'status is required'],
    enum:[...Object.values(OrderStatus)]
  }

 },{
   versionKey:"version",
   toJSON:{
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id
    },
   }
 });


 schema.statics.createOrder = (order: OrderI) => {
   
    return new Order({
      _id: order.id,
      price: order.price,
      version: order.version,
      status: order.status,
      userId: order.userId
    })
 }


 schema.statics.findByEvent = async function(event:{id:string,version: number}): Promise<HydratedDocument<OrderVersionI> | null>{
  
  const order = await this.findOne({_id: event.id, version: event.version - 1})
  return order;
}

 const Order = model<OrderVersionI,OrderModel>('Order', schema)

 export {
  Order
 }