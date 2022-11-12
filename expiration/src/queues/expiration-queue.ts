import {Job, Queue, Worker, QueueScheduler} from 'bullmq';
import {queueName, queueOption, Payload, workerOption} from '../config/config'
import { processor } from './processor';


const schuler = new QueueScheduler(queueName, queueOption);
const expirationQueue = new Queue<Payload>(queueName, queueOption)

const worker = new Worker(queueName, processor, workerOption)


export {expirationQueue}