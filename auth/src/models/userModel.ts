import {Schema, model, Model, HydratedDocument}  from "mongoose";
import { Password } from "../services/Password";

interface UserI {
  email: string;
  password: string;
}

interface UserModel extends Model<UserI> {
  createUser(user:UserI): HydratedDocument<UserI>;
  findByEmail(email:string): Promise<HydratedDocument<UserI>>;
}


const userSchema = new Schema<UserI, UserModel>({
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
},
{ 
  timestamps:true,
  toJSON:{
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      delete ret.password;
    },
  }

}
)

userSchema.statics.createUser = (user:UserI) =>{
  return new User(user)
}

userSchema.statics.findByEmail = async function(email:string){
    return this.findOne({email})
}

userSchema.pre('save', async function(){
   if(this.isModified('password')){
    const hash = await Password.toHash(this.get('password'));
    this.set('password', hash);
   }
})

const User = model<UserI, UserModel>("User", userSchema);



export {User};

