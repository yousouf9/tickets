import {Schema, model, Model, HydratedDocument} from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';
import { Order, OrderStatus, IOrder } from './OrderModel';

export interface ITicket {
 title: string,
 price: number,
 id:string,
}

interface  ITicketVersion extends ITicket{
  version: number
}
interface ITicketMethods {
  isReserved(): Promise<boolean>
 }

export interface TicketModel extends Model<ITicketVersion, {}, ITicketMethods>{
  createTicket(ticket: ITicket): HydratedDocument<ITicketVersion>,
  findByEvent(event:{id:string, version:number}): Promise<HydratedDocument<ITicketVersion> | null>
}

const schema = new Schema<ITicket, TicketModel, ITicketMethods>({
  title:{
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  }
},{
  timestamps: true,
  toJSON:{
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    },
  },
  versionKey:"version",
})

//schema.plugin(updateIfCurrentPlugin, {strategy: 'version' })

schema.statics.createTicket = (ticket: ITicket): HydratedDocument<ITicketVersion> =>{
   return new  Ticket({
     _id: ticket.id,
     title: ticket.title,
     price: ticket.price
   });
}

schema.statics.findByEvent = async function(event:{id:string,version: number}): Promise<HydratedDocument<ITicketVersion> | null>{
    const ticket = await this.findOne({_id: event.id, version: event.version - 1})

    console.log("ticket by events", ticket);
    
    return ticket;
}

schema.method("isReserved", async function isReserved(){

  const existingOrder : HydratedDocument<IOrder> | null = await Order.findOne({
    ticketId: this._id,
    status:{
     $in:[
       OrderStatus.Created,
       OrderStatus.AwaitingPayment,
       OrderStatus.Complete
     ]
    }
 })
 return existingOrder ? true : false;
})



const Ticket = model<ITicket, TicketModel>("Ticket", schema);



export {
  Ticket
}