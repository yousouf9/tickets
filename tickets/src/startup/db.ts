import mongoose from 'mongoose';
import {Application} from 'express'

import {Stan} from 'node-nats-streaming'
import {netNewWrapper} from '../nats-client'
import { OrderCancelledListener } from '../events/listener/order-cancelled-listener';
import { OrderCreatedListener } from '../events/listener/order-created-listener';

declare global {
 var client: Stan
}

export const startup = async(app: Application) =>{
  if(!process.env.JWT_KEY ){
    throw new Error('JWT_KEY is required')
  }
  if(!process.env.Mongo_URI){
    throw new Error('Mongo_URI is required')
  }
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
  
  await mongoose.connect(process.env.Mongo_URI)
    console.log("connected to mongodb");

  new OrderCancelledListener(global.client).listen();
  new OrderCreatedListener(global.client).listen();
     
  } catch (error) {
    console.log(error);
    
  }



  const PORT = process.env.PORT || 3000;
  app.listen(PORT, ()=>{
    console.log(`Listenning on port ${PORT}!!!`);
  });

}