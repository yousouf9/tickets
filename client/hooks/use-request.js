import {useState} from 'react'
 
import axios from 'axios'

export default ({url, method, body, onSuccess}) => {
  
  const [errors, setErrors] = useState(null);

  const doRequest = async(inputs = {}) =>{
    try {
     const response = await axios[method](url, {...body, ...inputs});     
     if(onSuccess){
      onSuccess(response.data);
     }
     return response

    } catch (error) {

      const errs =  error.response.data.errors;
      setErrors(
        <div className="alert alert-danger">
          <h4>Oooops!....</h4>
          <ul>
            {
              errs.map((err, index) => {
                return <li key={index}>{err.message}</li>
              }) 
            }
          </ul>
        </div>
      )
    }
  }
  return {
    doRequest,
    errors,
  }
}

