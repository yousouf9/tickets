
import {useState} from 'react'
import Router, {useRouter} from 'next/router';
import useRequest from '../../hooks/use-request'


const NewTicket = () =>{

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  

  const {doRequest, errors} = useRequest({
    url:'/api/tickets',
    method: 'post',
    body:{
      title,
      price,
    },
    onSuccess:()=> Router.push('/')
  })

  const handleOnBlur = () =>{
      const value = parseFloat(price)
      if(isNaN(value)){
         return
      }
      setPrice(value.toFixed(2))
  }

  const handleSubmit =  (e) =>{
    e.preventDefault();
    doRequest()
  }
  return (
    <>
      <h1>Create New Ticket</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label >Title</label>
          <input 
            type="text"
            className="form-control"
            value={title}
            onChange={(e)=> setTitle(e.target.value)}/>
        </div>
        <div className="form-group">
          <label >Price</label>
          <input 
            type='text'
            className="form-control"
            value={price} 
            onBlur={handleOnBlur}
            onChange={(e)=> setPrice(e.target.value)}
            />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </>
  )
}

export default NewTicket;