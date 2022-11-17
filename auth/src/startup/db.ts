import mongoose from 'mongoose';
import {Application} from 'express'


export const startDB = async(app: Application) => {
  console.log("Initialing Application 3");
  if(!process.env.JWT_KEY){
    throw new Error('JWT_KEY is required')
  }
  
  if(!process.env.MONGO_URI_AUTH){
    throw new Error('MONGO_URI_AUTH is required');
  }
  try {
  await mongoose.connect(process.env.MONGO_URI_AUTH)
    console.log("connected to mongodb");
    
     
  } catch (error) {
    console.log(error);
    
  }
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, ()=>{
    console.log(`Listenning on port ${PORT}!!!`);
  });
}