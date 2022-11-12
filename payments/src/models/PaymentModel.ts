import {HydratedDocument, model, Model} from 'mongoose';
import { Schema } from 'mongoose';

interface IPayment{
  orderId:string,
  reference: string,
}

 interface PaymentModel extends Model<IPayment>{
    createPayment(order: IPayment): HydratedDocument<IPayment>
 }

 const schema = new Schema<IPayment, PaymentModel>({ 

  orderId:{
    type:String,
    required:[true, 'userId is required']
  },
  reference:{
    type:String,
    required:[true, 'reference is required']
  },

 },{
   versionKey:"version",
   toJSON:{
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id
    },
   }
 });


 schema.statics.createPayment = (payment: IPayment) => {
   
    return new Payment({
      reference: payment.reference,
      orderId: payment.orderId,
    })
 }


 const Payment = model<IPayment,PaymentModel>('Payment', schema)

 export {
  Payment
 }