import nats, {Message} from 'node-nats-streaming';

import {randomUUID} from 'crypto'


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

    const options = client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setDurableName('service-name')
      .setManualAckMode(true)

       
    const subscription = client.subscribe('ticket:created', "queue-group", options)

    subscription.on('message', (msg:Message) =>{
       console.log(msg.getData());
       msg.ack()
    })
  })

process.on('SIGINT', ()=> client.close())
process.on('SIGTERM', ()=> client.close())
