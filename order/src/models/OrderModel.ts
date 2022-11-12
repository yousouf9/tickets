import {Schema, model, Model, HydratedDocument, PopulatedDoc} from 'mongoose';
import {ITicket} from './TicketModel'
import {OrderStatus} from '@ibee_common/common'


export interface IOrder {
 userId: string,
 status: OrderStatus,
 expiresAt: Date,
 ticketId: PopulatedDoc<HydratedDocument<ITicket>>

}

interface IOrderVersion extends IOrder {
  version: number
}
interface OrderModel extends Model<IOrderVersion>{
   createOrder(order: IOrder): HydratedDocument<IOrderVersion>
}

const schema = new Schema<IOrder, OrderModel>({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt:{
    type: Schema.Types.Date,
  },
  ticketId: {
    type: Schema.Types.ObjectId,
    ref: "Ticket"
  }
},{
  timestamps: true,
  toJSON:{
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    },
  },
  versionKey:'version',
  optimisticConcurrency: true
})


schema.statics.createOrder = (order: IOrder): HydratedDocument<IOrderVersion> =>{
   return new  Order(order);
}


const Order = model<IOrder, OrderModel>("Order", schema);

export {
  Order,
  OrderStatus
}
