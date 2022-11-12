import {MongoMemoryServer} from 'mongodb-memory-server';
import  mongoose from 'mongoose';
import JWT from 'jsonwebtoken';

declare global {
    function signup(id?: string): string[]
}


jest.mock('../nats-client');

let mongo:any;
beforeAll( async () => {

  mongo = await MongoMemoryServer.create();
  const mongoURI = mongo.getUri()

  console.log(mongoURI);
  
  await mongoose.connect("mongodb://127.0.0.1:27017/ticket_test",{
    maxPoolSize:5
  });

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



global.signup =  (userId?:string) : string[] => {
 const id = userId || new mongoose.Types.ObjectId().toHexString();
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
