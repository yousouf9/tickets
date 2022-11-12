import {WorkerOptions, QueueOptions} from 'bullmq';
import {cpus} from 'os'

const queueOption: QueueOptions = {
    connection:{
      host: process.env.REDIS_HOST,
    },
    defaultJobOptions:{
     //  attempts: 5,
       //removeOnComplete:true, 
    }
}

const  workerOption: WorkerOptions ={
   //concurrency: cpus().length,
   connection:{
    host: process.env.REDIS_HOST,
   },
  // skipDelayCheck:true,
  // runRetryDelay: 1000 * 3
}

interface Payload {
  orderId: string;
}

const queueName = 'order:expiration';

export { queueOption, workerOption, Payload, queueName}