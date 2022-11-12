import {MongoMemoryServer} from 'mongodb-memory-server';
import  mongoose from 'mongoose';
import JWT from 'jsonwebtoken';

import request from 'supertest';

import { app } from '../app';

declare global {
    function signup(): string[]
}


jest.mock('../nats-client');

let mongo:any;
beforeAll( async () => {

  mongo = await MongoMemoryServer.create();
  const mongoURI = mongo.getUri()

  await mongoose.connect(mongoURI);

})

beforeEach( async () => {
  
   jest.clearAllMocks();

   const collections = await mongoose.connection.db.collections()
    collections.forEach(async (collection)=>{
       await collection.deleteMany({})
    })
   
})


afterAll( async () =>{
  await mongo.stop()
  await mongoose.connection.close();
}, 90000)



global.signup =  () : string[] => {
 const id = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    email :'user@example.com',
    id
  }

  const token = JWT.sign(payload, process.env.JWT_KEY!, )

  const session = {jwt: token}

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`]
}
