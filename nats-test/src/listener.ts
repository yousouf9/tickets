import nats, {Message, Stan, SubscriptionOptions, Subscription} from 'node-nats-streaming';

import {randomUUID} from 'crypto'
import { TicketCreatedListener } from './events/ticket-created-listener';


const client = nats.connect('tickets', randomUUID(), {
  url: 'http://localhost:4222'
})

console.clear();

client.on('connect', ()=>{
  console.log('subcriber connected');


  client.on('close', ()=>{
    console.log("About to close this publisher connection");
    process.exit(0);
  })

  

    const ticket = new TicketCreatedListener(client).listen();

  })

process.on('SIGINT', ()=> client.close())
process.on('SIGTERM', ()=> client.close())





