import Router from 'next/router';
import {useEffect, useState} from 'react'
import {PaystackButton} from 'react-paystack'
import useRequest from '../../hooks/use-request';
const ShowOrder = ({order, currentUser})=>{
   const [timeLeft, setTimeLeft] = useState('');
   const {doRequest, errors} = useRequest({
     url:'/api/payments',
     method: 'post',
     body: {
      orderId:order.id,
      token: "test-token"
     },
     onSuccess:() => Router.push('/orders', '/orders')
   })
   const componentProps = {
    email: currentUser.email,
    amount: parseInt(order.ticketId.price),
    publicKey: 'pk_test_dd3b1b3a5d70959a0b0923fc3e33c131d288e457',
    text: "Ticket Order",
    onSuccess: async (data) =>{
      await doRequest({reference: data.reference})

      Router.push('/orders', '/orders')
    },
    onClose: () => alert("Are you sure you want to quit now!!!!"),
  }
   useEffect(()=>{
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft /1000))
    }
    findTimeLeft()
    const intervalId = setInterval(findTimeLeft, 1000)
    return ()=> {
        clearInterval(intervalId)
    }
   }, [order.expiresAt, currentUser])

   if(timeLeft < 0) return <div>Order has expired</div>
  return (
    <>
      <p>{timeLeft} seconds until the order expires</p>
      <PaystackButton className="paystack-button" {...componentProps} />
      {errors}
    </>
  )
}

ShowOrder.getInitialProps = async (context, client) =>{
  const { orderId } = context.query
  const {data} = await client.get(`/api/orders/${orderId}`)

  console.log(data);
  return {order: data}
}

export default ShowOrder