import {Stan, SubscriptionOptions, Message} from 'node-nats-streaming'
import { Subjects } from './subject';


interface Event {
  subject: Subjects,
  data:any,
}


export abstract class Listener<T extends Event>{
  private client: Stan;

  abstract  subject: T['subject'];
  abstract  queueGroupName: string;
  abstract onMessage(data:T['data'], oldMessageObject: Message):void

  protected ackWait = 5 * 1000;

  constructor(client:Stan){
    this.client = client
  }

  subscriptionOptions(): SubscriptionOptions{
    return this.client
               .subscriptionOptions()
               .setManualAckMode(true)
               .setDeliverAllAvailable()
               .setAckWait(this.ackWait)
               .setDurableName(this.queueGroupName);
  }

  listen(): void{
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    )
    subscription.on('message', (msg: Message) =>{
       console.log(`Message Received: ${this.subject} / ${this.queueGroupName}`);
       const parseMessage = this.parseMessage(msg)

        this.onMessage(parseMessage, msg);
    })
  }


 
  parseMessage(message:Message){
    const data = message.getData();

    if(typeof data === 'string'){
      return JSON.parse(data);
    }
    return JSON.parse(data.toString('utf8'));
  }
}