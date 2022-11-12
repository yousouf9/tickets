import nats, {Stan} from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;


  public get client() {
    if(!this._client){
      throw new Error('You have to initialize nats first');
    }
    return this._client;
  }

  connect(clusterID: string, clientID: string, url: string){

    this._client = nats.connect(clusterID, clientID,{
         url
    })

   return new Promise<void>((resolve, reject) =>{
      this.client.on('connect', ()=>{
        console.log("successfully connected NATS");
          resolve()
      })

      this.client.on('error', (err)=>{
        console.log("error connecting to nats", err);
         reject(err)
      })
    })
  }
}

const netNewWrapper = new NatsWrapper();
//const netNewWrapper = Object.freeze(newWrapper);
export {netNewWrapper};

