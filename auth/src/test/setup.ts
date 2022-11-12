import {MongoMemoryServer} from 'mongodb-memory-server';
import  mongoose from 'mongoose';

import request from 'supertest';

import { app } from '../app';

declare global {
    function signup(): Promise<string[]>
}

let mongo:any;
beforeAll( async () => {

  mongo = await MongoMemoryServer.create();
  const mongoURI = mongo.getUri()

  await mongoose.connect(mongoURI);

})

beforeEach( async () => {
  
   const collections = await mongoose.connection.db.collections()
    collections.forEach(async (collection)=>{
       await collection.deleteMany({})
    })
   
})


afterAll( async () =>{
  await mongo.stop()
  await mongoose.connection.close();
}, 70000)



global.signup =async () : Promise<string[]> => {
  const email = 'user@example.com';
  const password = 'pass123';

 const response =  await request(app)
        .post('/api/users/signup')
        .send({ email: email, password: password})
        .expect(201)
  const cookies = response.get('Set-Cookie')

  return cookies
}
