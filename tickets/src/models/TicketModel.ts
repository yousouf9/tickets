
import mongoose, {HydratedDocument, model, Model, Schema} from 'mongoose';
//import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

interface  TicketI {
   title: string
   price: number,
   userID: string,
   orderId?: string
}

interface TicketVersion extends TicketI{
   version: number,
}

interface TicketModel extends Model<TicketVersion> {
   createTicket(ticket: TicketI): HydratedDocument<TicketVersion>,
}

const schema = new Schema<TicketI, TicketModel>({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userID: { 
    type: String,
    required: true,
  },
  orderId: { 
    type: String,
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

schema.statics.createTicket = (ticket: TicketI): HydratedDocument<TicketI> => {
  return new Ticket(ticket)
}


const Ticket = model<TicketI, TicketModel>('ticket', schema);


export {
  Ticket
}