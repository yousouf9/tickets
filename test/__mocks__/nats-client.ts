export const natWrapper = {
  client:{
    publish: (subject:string, data:string, callback: ()=> void)=>{
      callback();
    }
  }
}