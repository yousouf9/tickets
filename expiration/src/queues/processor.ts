import { Job } from "bullmq";
import { Payload } from "../config/config";
import { ExpirationCompletePublisher } from '../events/publisher/expiration-complete-publisher'
import { netNewWrapper } from '../nats-client'



export const processor = async(job: Job<Payload>)=>{
 console.log("This is coming from processor", job.data.orderId);
 new ExpirationCompletePublisher(netNewWrapper.client).publish({
  orderId: job.data.orderId
 })
}

