import Link from  'next/link'

const landing =({currentUser, tickets})=> {

  console.log(tickets);
  const ticketList = tickets.map(ticket => {
      return(
        <tr key={ticket.id}>
            <td>{ticket.title}</td>
            <td>{ticket.price}</td>
            <td>
              <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
                <a>view</a>
              </Link>              
            </td>
        </tr>
      )
  })

  return(
    <>
      <h1>Tickets</h1>
      <table className="table">
         <thead>
            <tr>
              <td>Title</td>
              <td>Price</td>
            </tr>
         </thead>
         <tbody>
          {ticketList}
         </tbody>
      </table>
    </>
  )
}

landing.getInitialProps = async(context, client, currentUser) =>{

  //remember context houses the req
  //const {data} = await buildClient(context).get('api/users/currentuser');
  const {data} = await client.get('/api/tickets');

  return { tickets : data }
}

export default landing