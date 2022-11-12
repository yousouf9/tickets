import {useEffect} from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';


export default ()=>{

  const requestObject ={
    url:'/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: ()=> Router.push('/')
  }
  const { doRequest } = useRequest(requestObject)

  useEffect(()=>{
    doRequest()
  },[])
  return (
    <div>Signing you out...</div>
  )
}