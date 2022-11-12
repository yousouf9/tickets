import {Stan} from 'node-nats-streaming'
import { OrderCreatedListener } from '../events/listeners/order-created-listener'
import {netNewWrapper} from '../nats-client'
declare global {
 var client: Stan
}

export const startup = async() =>{

  if(!process.env.NATS_URI){
    throw new Error('NATS_URI is required')
  }
  if(!process.env.NATS_CLIENT_ID){
    throw new Error('NATS_CLIENT_ID is required')
  }
  try {

  //clusterId same as define in your nats deployment file
  await netNewWrapper.connect('tickets',  process.env.NATS_CLIENT_ID, process.env.NATS_URI)
  
  //assign the client to global object
  global.client = netNewWrapper.client;

  global.client.on('close', ()=>{
    console.log("About to close NAT connection");
    process.exit(0);
  })

  process.on('SIGINT', ()=> global.client.close())
  process.on('SIGTERM', ()=> global.client.close())

  new OrderCreatedListener(global.client).listen();


  } catch (error) {
    console.log(error);
    
  }

}