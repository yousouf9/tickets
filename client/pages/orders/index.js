

const ShowOrders = ({orders}) =>{

  console.log(orders);

  const renderOrder =  orders.map((order)=>{
       return (
         <li key={order.id}>{order.ticketId.title}-----<button class="btn btn-info btn-sm">{order.status}</button></li>
       )
    })

  return (
    <>
      <ul>
        {renderOrder}
      </ul>
      
    </>
  )
}

ShowOrders.getInitialProps = async(context, client)=>{

  const {data} = await client.get('/api/orders');

  return {orders: data}
}

export default ShowOrders

