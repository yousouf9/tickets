import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';


 console.clear();
 
const client = nats.connect('tickets', 'abc', {
  url: 'http://localhost:4222'
})


client.on('connect', async ()=>{
  console.log('Publisher connected');
  const data = {
    id:'12345abcd',
    title:'music concert',
    price:35
  }

  client.on('close', ()=>{
    console.log("About to close this publisher connection");
    process.exit(0);
  })
  const publisher = new TicketCreatedPublisher(client);
  await publisher.publish(data);
})

process.on('SIGINT', ()=> client.close())
process.on('SIGTERM', ()=> client.close())