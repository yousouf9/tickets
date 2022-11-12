import {useRouter} from 'next/router'
import useRequest from '../../hooks/use-request'

const ShowTicket = ({ticket}) => {

  const router = useRouter()
  const {doRequest, errors} = useRequest({
    url:'/api/orders',
    method: 'post',
    body: {ticketId: ticket.id},
    onSuccess:(data)=> router.push('/orders/[orderId]', `/orders/${data.id}`)
  })

  const handleOrder = (e) => {
      e.preventDefault();
      doRequest()
  }
  return(
    <>
      <div className="card">
        <div className="card-header">
            Ticket Details
        </div>
        <div className="card-body">
          <h4 className="card-title">{ticket.title}</h4>
          <p className="card-text">{ticket.price}</p>
          <button onClick={handleOrder}  className="btn btn-primary">Purchase</button>
        </div>
      </div>
      {errors}
    </>
  )
}
ShowTicket.getInitialProps = async (context, client) =>{

  const { ticketId } = context.query
  const { data } = await client.get(`/api/tickets/${ticketId}`)

  console.log(data);
  return {ticket: data}
}

export default ShowTicket